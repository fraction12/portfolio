import bundledManifest from '../../public/_worker-media/manifest.json';

type MediaFile = {
  path: string;
  size: number;
  contentType: string;
  etag: string;
  chunks: { path: string; size: number }[];
};
type Assets = { fetch(request: Request): Promise<Response> };
type ByteRange = { kind: 'full' | 'partial'; start: number; end: number } | { kind: 'unsatisfiable' };

function byteRange(value: string | null, size: number): ByteRange {
  const full = { kind: 'full', start: 0, end: size - 1 } satisfies ByteRange;
  const match = value?.match(/^bytes=(\d*)-(\d*)$/);
  if (!match || (!match[1] && !match[2])) return full;
  const start = match[1] ? Number(match[1]) : Math.max(0, size - Number(match[2]));
  const end = match[1] && match[2] ? Math.min(size - 1, Number(match[2])) : size - 1;
  if (!Number.isSafeInteger(start) || !Number.isSafeInteger(end) || start >= size || start > end) {
    return { kind: 'unsatisfiable' };
  }
  return { kind: 'partial', start, end };
}

async function* readChunks(request: Request, assets: Assets, file: MediaFile, range: Exclude<ByteRange, { kind: 'unsatisfiable' }>) {
  let offset = 0;
  for (const chunk of file.chunks) {
    const chunkEnd = offset + chunk.size - 1;
    if (chunkEnd >= range.start && offset <= range.end) {
      const start = Math.max(0, range.start - offset);
      const end = Math.min(chunk.size - 1, range.end - offset);
      const response = await assets.fetch(new Request(new URL(chunk.path, request.url), {
        signal: request.signal,
      }));
      if (!response.body || response.status !== 200) {
        await response.body?.cancel();
        throw new Error(`Media asset unavailable, status ${response.status}, path ${chunk.path}`);
      }
      const reader = response.body.getReader();
      let position = 0;
      try {
        while (true) {
          const { value, done } = await reader.read();
          if (done) break;
          const next = position + value.length;
          if (next > start) yield value.subarray(Math.max(0, start - position), Math.min(value.length, end - position + 1));
          position = next;
          if (position > end) break;
        }
      } finally {
        await reader.cancel();
        reader.releaseLock();
      }
    }
    offset += chunk.size;
  }
}

export function fetchWorkerMedia(request: Request, assets: Assets, manifest: MediaFile[] = bundledManifest): Response | undefined {
  const file = manifest.find(entry => entry.path === new URL(request.url).pathname);
  if (!file || !['GET', 'HEAD'].includes(request.method)) return;
  const headers = new Headers({
    'Content-Type': file.contentType,
    'Cache-Control': 'public, max-age=0, must-revalidate',
    'Accept-Ranges': 'bytes',
    ETag: file.etag,
  });
  const ifNoneMatch = request.headers.get('If-None-Match');
  if (ifNoneMatch?.split(',').some(value => value.trim() === '*' || value.trim().replace(/^W\//, '') === file.etag)) {
    return new Response(null, { status: 304, headers });
  }
  const ifRange = request.headers.get('If-Range');
  const range = byteRange(ifRange && ifRange !== file.etag ? null : request.headers.get('Range'), file.size);
  if (range.kind === 'unsatisfiable') {
    headers.set('Content-Range', `bytes */${file.size}`);
    return new Response(null, { status: 416, headers });
  }
  headers.set('Content-Length', String(range.end - range.start + 1));
  if (range.kind === 'partial') headers.set('Content-Range', `bytes ${range.start}-${range.end}/${file.size}`);
  const status = range.kind === 'partial' ? 206 : 200;
  if (request.method === 'HEAD') return new Response(null, { status, headers });
  const chunks = readChunks(request, assets, file, range);
  const body = new ReadableStream<Uint8Array>({
    async pull(controller) {
      try {
        const { value, done } = await chunks.next();
        if (done === true) controller.close();
        else controller.enqueue(value);
      } catch (error) {
        controller.error(error);
      }
    },
    async cancel() {
      await chunks.return();
    },
  }, { highWaterMark: 0 });
  return new Response(body, { status, headers });
}
