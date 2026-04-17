## 1. Canonical site configuration
- [x] 1.1 Set the Astro production site origin to `https://dushyantgarg.com`
- [x] 1.2 Confirm canonical and social URLs resolve against the production origin in built output
- [x] 1.3 Review all public pages and tighten page-specific titles/descriptions where they are too generic

## 2. Crawl discovery artifacts
- [x] 2.1 Add sitemap generation for the public site
- [x] 2.2 Add `robots.txt` that allows public crawling and points to the sitemap URL
- [x] 2.3 Verify only intended public pages appear in crawl artifacts

## 3. Structured data
- [x] 3.1 Add `Person` JSON-LD for Dushyant Garg
- [x] 3.2 Add `WebSite` JSON-LD for the canonical portfolio
- [x] 3.3 Include major public profile links in `sameAs`
- [x] 3.4 Validate the structured data shape in built output

## 4. Verification readiness
- [x] 4.1 Add optional configuration for Google site verification
- [x] 4.2 Add optional configuration for Bing site verification
- [x] 4.3 Emit verification tags only when tokens are configured

## 5. Operator docs and validation
- [x] 5.1 Add a short SEO operations doc for Search Console and Bing Webmaster Tools submission
- [x] 5.2 Run build/test validation after implementation
- [x] 5.3 Capture a concise verification note listing sitemap URL, robots URL, and schema presence

## Verification note

Evidence from the build produced by `npm run build` at commit prior to archival:

- **Crawl artifacts**
  - `https://dushyantgarg.com/robots.txt` → `Allow: /` and `Sitemap: https://dushyantgarg.com/sitemap-index.xml`
  - `https://dushyantgarg.com/sitemap-index.xml` → references `sitemap-0.xml`
  - `sitemap-0.xml` lists exactly 6 public routes: `/`, `/beliefs/`, `/colophon/`, `/jarvis/`, `/projects/`, `/writing/` (no duplicates, no internal endpoints like `/robots.txt`)
- **Canonical metadata**
  - Every public page renders `link rel="canonical"` pointing at `https://dushyantgarg.com/<path>`
  - OG/Twitter URL + image resolve against the production origin
  - Each page now has a unique, purposeful title and description (no shared generic default)
- **Structured data on home**
  - Two valid `application/ld+json` blocks: `Person` and `WebSite`
  - `Person.sameAs` = GitHub (`fraction12`), LinkedIn (`dushyantgarg`), Substack (`dushyantg`)
  - Both parse as valid JSON; to re-validate, run the Rich Results Test on production after deploy
- **Verification readiness**
  - Absent by default: no `google-site-verification` or `msvalidate.01` tags in built output
  - Present when `PUBLIC_GOOGLE_SITE_VERIFICATION` / `PUBLIC_BING_SITE_VERIFICATION` env vars are set at build time
- **Tests**: `npm test` → 19 passed, 0 failed
- **Build**: `npm run build` → completes cleanly, `@astrojs/sitemap` generates `sitemap-index.xml`
