import { handle } from '@astrojs/cloudflare/handler';
import { toolDetails } from './config/tool-details';
import vercel from '../vercel.json';
import { fetchWorkerMedia } from './lib/worker-media';

declare const FixedLengthStream: new (length: number) => TransformStream<Uint8Array, Uint8Array>;

const detailPaths = new Set(toolDetails.map(tool => `/tools/${tool.slug}`));
const securityHeaders = vercel.headers.flatMap(rule => rule.headers);
const staticCacheControl = 'public, max-age=0, must-revalidate';

export default {
  async fetch(...args: Parameters<typeof handle>) {
    const [request, env, context] = args;
    const url = new URL(request.url);
    const productionHost = url.hostname === 'dushyantgarg.com' || url.hostname === 'www.dushyantgarg.com';
    let response: Response;

    if (productionHost && url.protocol === 'http:') {
      url.protocol = 'https:';
      response = new Response(null, { status: 308, headers: { Location: url.href } });
    } else if (url.hostname === 'www.dushyantgarg.com') {
      url.hostname = 'dushyantgarg.com';
      response = new Response(null, { status: 301, headers: { Location: url.href, 'Cache-Control': staticCacheControl } });
    } else if (/^\/\.(?:env(?:\.|$)|git(?:\/|$))/.test(url.pathname)) {
      response = new Response('Forbidden\n', { status: 403, headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'private, no-store, max-age=0',
      } });
    } else {
      const path = url.pathname.replace(/\/$/, '');
      if (detailPaths.has(path)) url.pathname = `${path}/index.html`;
      const media = fetchWorkerMedia(request, env.ASSETS);
      const asset = media ?? (request.method === 'GET' || request.method === 'HEAD'
        ? await env.ASSETS.fetch(new Request(url, request))
        : undefined);
      if (asset && asset.status !== 404) {
        if (media?.body) {
          const stream = new FixedLengthStream(Number(media.headers.get('Content-Length')));
          context.waitUntil(media.body.pipeTo(stream.writable));
          response = new Response(stream.readable, media);
        } else {
          response = new Response(asset.body, asset);
        }
        response.headers.set('Cache-Control', url.pathname.startsWith('/_astro/')
          ? 'public, max-age=31536000, immutable'
          : staticCacheControl);
        if (url.pathname.endsWith('.xml')) response.headers.set('Content-Type', 'application/xml');
        if (url.pathname.endsWith('.js')) response.headers.set('Content-Type', 'application/javascript; charset=utf-8');
      } else {
        await asset?.body?.cancel();
        const rendered = await handle(request, env, context);
        response = new Response(rendered.body, rendered);
        if (response.status === 404) response.headers.set('Cache-Control', staticCacheControl);
      }
    }

    for (const header of securityHeaders) response.headers.set(header.key, header.value);
    response.headers.set('Strict-Transport-Security', 'max-age=63072000');
    return response;
  },
};
