import type { APIRoute } from 'astro';

export const prerender = true;

const crawlers = [
  '*',
  'Googlebot',
  'Bingbot',
  'GPTBot',
  'OAI-SearchBot',
  'ChatGPT-User',
  'ClaudeBot',
  'Claude-SearchBot',
  'Claude-User',
  'PerplexityBot',
  'Google-Extended',
  'Applebot',
  'Amazonbot',
  'meta-externalagent',
  'FacebookBot',
  'DuckAssistBot',
  'CCBot',
];

export const GET: APIRoute = ({ site }) => {
  const origin = (site ?? new URL('https://dushyantgarg.com')).origin;
  const body = [
    ...crawlers.flatMap(crawler => [`User-agent: ${crawler}`, 'Allow: /', '']),
    `Sitemap: ${origin}/sitemap.xml`,
    '',
    `# LLM-friendly summary: ${origin}/llms.txt`,
    `# Expanded summary: ${origin}/llms-full.txt`,
    '',
  ].join('\n');

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
