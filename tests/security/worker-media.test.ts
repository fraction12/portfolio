import { describe, expect, it } from 'vitest';
import { fetchWorkerMedia } from '../../src/lib/worker-media';

const manifest = [{
  path: '/movie.mp4',
  size: 10,
  contentType: 'video/mp4',
  etag: '"fixture"',
  chunks: [{ path: '/chunk-0', size: 5 }, { path: '/chunk-1', size: 5 }],
}];

function fixture() {
  const requests: Request[] = [];
  const chunks = new Map([['/chunk-0', 'abcde'], ['/chunk-1', 'fghij']]);
  const assets = {
    async fetch(request: Request) {
      requests.push(request);
      const bytes = chunks.get(new URL(request.url).pathname);
      if (!bytes) return new Response(null, { status: 404 });
      const range = request.headers.get('Range')?.match(/^bytes=(\d+)-(\d+)$/);
      return new Response(range ? bytes.slice(Number(range[1]), Number(range[2]) + 1) : bytes, { status: range ? 206 : 200 });
    },
  };
  return { assets, requests };
}

describe('large Worker media', () => {
  it('streams the original bytes without fetching until the body is consumed', async () => {
    const { assets, requests } = fixture();
    const response = fetchWorkerMedia(new Request('https://portfolio.test/movie.mp4'), assets, manifest)!;
    expect(requests).toHaveLength(0);
    expect(response.status).toBe(200);
    expect(response.headers.get('Content-Type')).toBe('video/mp4');
    expect(response.headers.get('Content-Length')).toBe('10');
    expect(response.headers.get('Accept-Ranges')).toBe('bytes');
    expect(await response.text()).toBe('abcdefghij');
  });

  it.each([
    ['bytes=0-0', 'a', 'bytes 0-0/10', 1],
    ['bytes=3-7', 'defgh', 'bytes 3-7/10', 2],
    ['bytes=7-', 'hij', 'bytes 7-9/10', 1],
    ['bytes=-3', 'hij', 'bytes 7-9/10', 1],
    ['bytes=-30', 'abcdefghij', 'bytes 0-9/10', 2],
    ['bytes=7-30', 'hij', 'bytes 7-9/10', 1],
  ])('serves %s with exact range bytes', async (range, body, contentRange, chunkCount) => {
    const { assets, requests } = fixture();
    const response = fetchWorkerMedia(new Request('https://portfolio.test/movie.mp4', { headers: { Range: range } }), assets, manifest)!;
    expect(response.status).toBe(206);
    expect(response.headers.get('Content-Range')).toBe(contentRange);
    expect(response.headers.get('Content-Length')).toBe(String(body.length));
    expect(await response.text()).toBe(body);
    expect(requests).toHaveLength(chunkCount);
  });

  it.each(['bytes=10-', 'bytes=7-2', 'bytes=-0'])('rejects unsatisfiable range %s', range => {
    const { assets, requests } = fixture();
    const response = fetchWorkerMedia(new Request('https://portfolio.test/movie.mp4', { headers: { Range: range } }), assets, manifest)!;
    expect(response.status).toBe(416);
    expect(response.headers.get('Content-Range')).toBe('bytes */10');
    expect(requests).toHaveLength(0);
  });

  it.each(['bad-range', 'bytes=0-1,3-4'])('ignores unsupported range %s', async range => {
    const { assets } = fixture();
    const response = fetchWorkerMedia(new Request('https://portfolio.test/movie.mp4', { headers: { Range: range } }), assets, manifest)!;
    expect(response.status).toBe(200);
    expect(await response.text()).toBe('abcdefghij');
  });

  it('answers HEAD without fetching media', () => {
    const { assets, requests } = fixture();
    const response = fetchWorkerMedia(new Request('https://portfolio.test/movie.mp4', { method: 'HEAD' }), assets, manifest)!;
    expect(response.status).toBe(200);
    expect(response.headers.get('Content-Length')).toBe('10');
    expect(response.body).toBeNull();
    expect(requests).toHaveLength(0);
  });

  it('stops reading backing assets when the client cancels', async () => {
    const { assets, requests } = fixture();
    const response = fetchWorkerMedia(new Request('https://portfolio.test/movie.mp4'), assets, manifest)!;
    const reader = response.body!.getReader();
    expect(new TextDecoder().decode((await reader.read()).value)).toBe('abcde');
    await reader.cancel();
    expect(requests).toHaveLength(1);
  });

  it.each(['"fixture"', 'W/"fixture"', '*', '"other", "fixture"'])('returns 304 for If-None-Match %s', etag => {
    const { assets, requests } = fixture();
    const response = fetchWorkerMedia(new Request('https://portfolio.test/movie.mp4', { headers: { 'If-None-Match': etag } }), assets, manifest)!;
    expect(response.status).toBe(304);
    expect(response.body).toBeNull();
    expect(requests).toHaveLength(0);
  });

  it('ignores Range when If-Range does not match the current strong ETag', async () => {
    const { assets } = fixture();
    const response = fetchWorkerMedia(new Request('https://portfolio.test/movie.mp4', {
      headers: { Range: 'bytes=3-7', 'If-Range': '"old"' },
    }), assets, manifest)!;
    expect(response.status).toBe(200);
    expect(await response.text()).toBe('abcdefghij');
  });

  it('honors Range when If-Range matches the current strong ETag', async () => {
    const { assets } = fixture();
    const response = fetchWorkerMedia(new Request('https://portfolio.test/movie.mp4', {
      headers: { Range: 'bytes=3-7', 'If-Range': '"fixture"' },
    }), assets, manifest)!;
    expect(response.status).toBe(206);
    expect(await response.text()).toBe('defgh');
  });

  it('fails the stream if a media chunk is unavailable', async () => {
    const response = fetchWorkerMedia(new Request('https://portfolio.test/movie.mp4'), {
      async fetch() { return new Response(null, { status: 404 }); },
    }, manifest)!;
    await expect(response.text()).rejects.toThrow('Media asset unavailable');
  });

  it('does not handle unrelated paths or non-read methods', () => {
    const { assets } = fixture();
    expect(fetchWorkerMedia(new Request('https://portfolio.test/other.mp4'), assets, manifest)).toBeUndefined();
    expect(fetchWorkerMedia(new Request('https://portfolio.test/movie.mp4', { method: 'POST' }), assets, manifest)).toBeUndefined();
  });
});
