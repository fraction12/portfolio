import type { APIRoute } from 'astro';

export const prerender = true;

export const GET: APIRoute = ({ site }) => {
  const origin = (site ?? new URL('https://dushyantgarg.com')).origin;
  const body = [
    'User-agent: *',
    'Allow: /',
    '',
    `Sitemap: ${origin}/sitemap-index.xml`,
    '',
  ].join('\n');

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
