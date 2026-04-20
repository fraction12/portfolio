import type { APIRoute } from 'astro';
import { track } from '@vercel/analytics/server';
// `?raw` imports the file as a string at build time — keeps the content
// editable as plain text in src/data/llms.txt without code-escaping.
import llmsTxtContent from '../data/llms.txt?raw';

// SSR: every request hits the function so we can log and track. A static
// asset (public/llms.txt) would have been served by the CDN without ever
// invoking our code, defeating the purpose.
export const prerender = false;

// Cap the event-props we emit so a pathological user-agent can't blow
// past Vercel Analytics' per-property size limit.
const MAX_PROP = 120;

export const GET: APIRoute = async ({ request }) => {
  const ua = request.headers.get('user-agent') ?? 'unknown';
  const referer = request.headers.get('referer') ?? 'none';
  // Vercel injects this header at the edge — gives us a rough
  // geographic distribution of who's reading the file.
  const country = request.headers.get('x-vercel-ip-country') ?? 'unknown';

  // Structured console log shows up in Vercel's function-log viewer.
  // Retention is short on Hobby (hours, not days) — this is for
  // real-time spot-checking, not long-term analytics.
  console.log(
    JSON.stringify({ event: 'llms.txt.fetch', ua, referer, country })
  );

  // Vercel Analytics custom event — persisted in the Web Analytics
  // dashboard. Hobby plan has a monthly custom-event budget, so keep
  // payloads small and never let a tracking failure block the response.
  try {
    await track(
      'llms.txt fetched',
      {
        ua: ua.slice(0, MAX_PROP),
        referer: referer.slice(0, MAX_PROP),
        country,
      },
      // Passing the request lets Vercel attribute the event to this
      // page's session and location rather than logging it as a
      // disconnected backend ping.
      { request },
    );
  } catch (err) {
    console.error('llms.txt analytics track failed', err);
  }

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
