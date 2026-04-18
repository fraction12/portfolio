# SEO Operations

One-time and recurring operator steps for search discoverability on
`https://dushyantgarg.com`. The technical foundation lives in the codebase;
this doc covers what still requires a human at a console.

## Canonical origin

The production origin is set in [astro.config.mjs](../astro.config.mjs) via
`site: 'https://dushyantgarg.com'`. Canonical/OG URLs and the sitemap all
derive from it. Don't change this without also updating:

- the sitemap's `customPages` list in the same file
- structured data URLs in [src/layouts/Layout.astro](../src/layouts/Layout.astro)

## Verification tokens

The layout emits verification meta tags only when the corresponding env var
is set. Tokens are public by design, so they use the `PUBLIC_` prefix and
are safe to commit to Vercel env config.

| Provider | Env var | Where to get it |
| --- | --- | --- |
| Google Search Console | `PUBLIC_GOOGLE_SITE_VERIFICATION` | Search Console → Add property → HTML tag method → copy the `content` value |
| Bing Webmaster Tools  | `PUBLIC_BING_SITE_VERIFICATION`   | Bing Webmaster → Add site → Meta tag method → copy the `content` value |

Set each var in Vercel under Project → Settings → Environment Variables
(Production scope), then redeploy. When absent, no verification tag is
emitted.

## Submission checklist (one-time, per search engine)

1. Deploy the current main branch to production.
2. Visit `https://dushyantgarg.com/robots.txt` — confirm it returns 200 and
   references `https://dushyantgarg.com/sitemap-index.xml`.
3. Visit `https://dushyantgarg.com/sitemap-index.xml` — confirm it returns
   200 and links the per-section sitemap(s).
4. In **Google Search Console**:
   - Add `https://dushyantgarg.com` as a property (URL prefix).
   - Verify via the HTML tag method using `PUBLIC_GOOGLE_SITE_VERIFICATION`.
   - Under Sitemaps, submit `sitemap-index.xml`.
5. In **Bing Webmaster Tools**:
   - Add the site.
   - Verify via the meta-tag method using `PUBLIC_BING_SITE_VERIFICATION`.
   - Submit `sitemap-index.xml`.

## Post-deploy validation

After any SEO-relevant change, spot-check:

- `curl -sI https://dushyantgarg.com/robots.txt` returns 200 text/plain.
- `curl -s https://dushyantgarg.com/sitemap-index.xml` lists only the intended
  public routes (home, tools, writing, jarvis).
- View-source on the home page contains two `application/ld+json` blocks
  (Person + WebSite) and a `link rel="canonical"` pointing at the production
  origin.
- [Rich Results Test](https://search.google.com/test/rich-results) accepts
  both JSON-LD blocks without errors.

## What's intentionally not here

- No backlink or paid-acquisition workflow.
- No per-project landing pages yet.
- No broad-keyword content strategy.

If any of those become in-scope, add a follow-up change rather than
expanding this doc.
