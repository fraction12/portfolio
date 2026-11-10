# SEO Operations

One-time and recurring operator steps for search discoverability on
`https://dushyantgarg.com`. The technical foundation lives in the codebase;
this doc covers what still requires a human at a console.

## Canonical origin

The production origin is set in [astro.config.mjs](../astro.config.mjs) via
`site: 'https://dushyantgarg.com'`. Canonical/OG URLs and the sitemap all
derive from it. Don't change this without also updating:

- the catalog pagination URLs in `src/lib/discovery.ts`
- structured data URLs in [src/layouts/Layout.astro](../src/layouts/Layout.astro)

The Worker redirects HTTPS `www` requests to the apex with a permanent 301.
Canonical URLs use trailing slashes. Catalog pagination has its own canonical
query string, title, and description.

## Crawl files and structured data

`/robots.txt` explicitly allows search and AI crawlers. `/sitemap.xml` is an alias
of Astro's generated sitemap index. Astro discovers tool detail routes from
`getStaticPaths`; the sitemap also includes the homepage, writing index, and
every catalog page. It excludes error pages and discovery text files.

Essays are hosted on Substack. There are no local post routes, so external essay
URLs belong in the writing index and LLM summaries rather than the apex sitemap.
The writing index emits a CollectionPage with BlogPosting entries from the same
feed data rendered in its links. Tool pages emit SoftwareApplication data, except
the KV Capsules + PTI research project, which uses CreativeWork. The homepage
retains Person and WebSite data with the existing public profile links.

`/llms.txt` and `/llms-full.txt` combine the biography in `src/data/llms.txt` with
the tool catalog and bundled writing snapshot. The full file includes tool
context and essay summaries, not full Substack articles. Update the existing
catalog or snapshot to update both documents. `/llms.txt` retains its sanitized
request log and cache policy.

## Verification tokens

The layout emits verification meta tags only when the corresponding env var
is set. Tokens are public by design, so they use the `PUBLIC_` prefix and
are safe to expose in those meta tags.

| Provider | Env var | Where to get it |
| --- | --- | --- |
| Google Search Console | `PUBLIC_GOOGLE_SITE_VERIFICATION` | Search Console → Add property → HTML tag method → copy the `content` value |
| Bing Webmaster Tools  | `PUBLIC_BING_SITE_VERIFICATION`   | Bing Webmaster → Add site → Meta tag method → copy the `content` value |

Set each variable in Cloudflare Workers Builds under Build Variables and Secrets
before the production build. See [the hosting guide](cloudflare-hosting.md) for
the build settings and cutover steps. When absent, no verification tag is emitted.

## Submission checklist (one-time, per search engine)

1. Deploy the current main branch to production.
2. Visit `https://dushyantgarg.com/robots.txt` — confirm it returns 200 and
   references `https://dushyantgarg.com/sitemap.xml`.
3. Visit `https://dushyantgarg.com/sitemap.xml` — confirm it returns
   200 and links the per-section sitemap(s).
4. In **Google Search Console**:
   - Add `https://dushyantgarg.com` as a property (URL prefix).
   - Verify via the HTML tag method using `PUBLIC_GOOGLE_SITE_VERIFICATION`.
   - Under Sitemaps, submit `sitemap.xml`.
5. In **Bing Webmaster Tools**:
   - Add the site.
   - Verify via the meta-tag method using `PUBLIC_BING_SITE_VERIFICATION`.
   - Submit `sitemap.xml`.

## Post-deploy validation

After any SEO-relevant change, spot-check:

- `curl -sI https://dushyantgarg.com/robots.txt` returns 200 text/plain.
- `curl -s https://dushyantgarg.com/sitemap.xml` links the generated sitemap.
  Follow that link and confirm home, tools, catalog pagination, every tool detail,
  and writing appear with apex URLs.
- Both LLM text files return 200 with Markdown content and absolute links.
- View-source on the home page contains two `application/ld+json` blocks
  (Person + WebSite) and a `link rel="canonical"` pointing at the production
  origin.
- Use [Schema.org's validator](https://validator.schema.org/) to check the JSON-LD.
  [Rich Results Test](https://search.google.com/test/rich-results) checks Google's
  rich-result eligibility, which may require additional fields. Do not invent
  offers or reviews to satisfy those diagnostics.

Cloudflare zone AI-bot and managed robots settings are being checked separately.
Repository allowances do not override zone blocking. This change does not alter
Cloudflare account settings.

## Web Analytics after deployment

The shared layout loads the manual Cloudflare Web Analytics beacon. The Worker
uses the CSP in `vercel.json`, which permits `static.cloudflareinsights.com` for
scripts and `cloudflareinsights.com` for beacon requests. Existing `'self'`
connections also permit same-origin `/cdn-cgi/rum`.

After merge and the Workers Build, visit the homepage, a tool, and the writing
index. Confirm the browser loads one beacon and permits its RUM request. Within
a few minutes, check Cloudflare Web Analytics for `dushyantgarg.com` for pageviews,
pages, referrers, and countries. Referrer data requires a visit with a referrer.
Zone auto-install stays enabled elsewhere; the manual beacon is intentional for
this Worker-rendered portfolio.

## What's intentionally not here

- No backlink or paid-acquisition workflow.
- No broad-keyword content strategy.

If any of those become in-scope, add a follow-up change rather than
expanding this doc.
