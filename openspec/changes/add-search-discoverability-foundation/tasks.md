## 1. Canonical site configuration
- [ ] 1.1 Set the Astro production site origin to `https://dushyantgarg.com`
- [ ] 1.2 Confirm canonical and social URLs resolve against the production origin in built output
- [ ] 1.3 Review all public pages and tighten page-specific titles/descriptions where they are too generic

## 2. Crawl discovery artifacts
- [ ] 2.1 Add sitemap generation for the public site
- [ ] 2.2 Add `robots.txt` that allows public crawling and points to the sitemap URL
- [ ] 2.3 Verify only intended public pages appear in crawl artifacts

## 3. Structured data
- [ ] 3.1 Add `Person` JSON-LD for Dushyant Garg
- [ ] 3.2 Add `WebSite` JSON-LD for the canonical portfolio
- [ ] 3.3 Include major public profile links in `sameAs`
- [ ] 3.4 Validate the structured data shape in built output

## 4. Verification readiness
- [ ] 4.1 Add optional configuration for Google site verification
- [ ] 4.2 Add optional configuration for Bing site verification
- [ ] 4.3 Emit verification tags only when tokens are configured

## 5. Operator docs and validation
- [ ] 5.1 Add a short SEO operations doc for Search Console and Bing Webmaster Tools submission
- [ ] 5.2 Run build/test validation after implementation
- [ ] 5.3 Capture a concise verification note listing sitemap URL, robots URL, and schema presence
