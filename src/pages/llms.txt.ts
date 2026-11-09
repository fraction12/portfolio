import type { APIRoute } from 'astro';
// `?raw` imports the file as a string at build time — keeps the content
// editable as plain text in src/data/llms.txt without code-escaping.
import llmsTxtContent from '../data/llms.txt?raw';

// Keep request logging even when other portfolio responses are cached.
export const prerender = false;

const MAX_PROP = 120;

function boundedHeader(value: string | null, fallback = 'unknown'): string {
  const cleaned = (value ?? fallback).replace(/\s+/g, ' ').trim();
  return (cleaned || fallback).slice(0, MAX_PROP);
}

function sanitizedReferer(value: string | null): string {
  if (!value) return 'none';
  try {
    const url = new URL(value);
    return url.origin.slice(0, MAX_PROP);
  } catch {
    return 'invalid';
  }
}

export const GET: APIRoute = async ({ request }) => {
  const ua = boundedHeader(request.headers.get('user-agent'));
  const referer = sanitizedReferer(request.headers.get('referer'));
  const country = boundedHeader(request.headers.get('cf-ipcountry'));

  console.log(
    JSON.stringify({ event: 'llms.txt.fetch', ua, referer, country })
  );

  return new Response(llmsTxtContent, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      // `private` = browsers may cache, CDN must not. If the CDN cached
      // this we wouldn't be invoked and couldn't track. A 5-minute
      // browser cache still prevents the same reader from generating
      // duplicate events on rapid refetches.
      'Cache-Control': 'private, max-age=300, must-revalidate',
    },
  });
};
