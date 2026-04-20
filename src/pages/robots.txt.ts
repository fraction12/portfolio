import type { APIRoute } from 'astro';

export const prerender = true;

export const GET: APIRoute = ({ site }) => {
  const origin = (site ?? new URL('https://dushyantgarg.com')).origin;
  // Non-standard `Llms-Txt` directive + human-readable comment. No
  // formal robots.txt grammar covers llms.txt yet (Apr 2026), so we
  // emit both: the comment is legible to anyone reading the file, and
  // several agent-crawlers parse arbitrary `Key: value` lines.
  const body = [
    'User-agent: *',
    'Allow: /',
    '',
    `Sitemap: ${origin}/sitemap-index.xml`,
    '',
    '# LLM-friendly summary of this site (https://llmstxt.org):',
    `Llms-Txt: ${origin}/llms.txt`,
    '',
  ].join('\n');

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
