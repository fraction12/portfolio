## 1. Content model
- [x] 1.1 Add a separate detail-content map for artifact detail pages
- [x] 1.2 Model links, proof/status, narrative sections, decisions, and demo media placeholders
- [x] 1.3 Add generated or authored placeholder detail content for every current catalog artifact
- [x] 1.4 Add stronger TradeSpec detail content with truthful alpha/private/customer-pilot status

## 2. Routing and rendering
- [x] 2.1 Add `/tools/[slug]` route for artifacts with detail content
- [x] 2.2 Render a strong detail layout: hero, links, problem, workflow, output/proof, decisions, media-ready section
- [x] 2.3 Render polished demo placeholders when video assets are not ready
- [x] 2.4 Return 404 or avoid route generation for unknown slugs

## 3. Index and homepage integration
- [x] 3.1 Update tool cards so current catalog items link internally first
- [x] 3.2 Preserve external repo/site links in card footers and/or detail pages
- [x] 3.3 Ensure homepage featured work points users into the portfolio story without hiding marketing-site/repo links

## 4. Machine-readable/catalog sync
- [x] 4.1 Update `llms.txt` to reference the portfolio detail-page pattern and TradeSpec detail page
- [x] 4.2 Ensure TradeSpec's marketing-site URL remains present and accurate
- [x] 4.3 Keep install/distribution copy truthful for private/unpublished tools

## 5. Validation
- [x] 5.1 Run `npm test`
- [x] 5.2 Run `npm run build`
- [x] 5.3 Inspect generated route output or preview for `/tools/tradespec` and at least one non-TradeSpec detail page
- [x] 5.4 Capture any follow-up media gaps for screenshots/demo videos

## 6. Repo-grounded copy pass
- [x] 6.1 Inspect GitHub README and metadata for every artifact with a public repo
- [x] 6.2 Rewrite detail-page labels, audience, problem, workflow, output, decisions, and demo-slot captions from repo evidence
- [x] 6.3 Keep no-repo/private/dev tools truthful using existing portfolio/product context
- [x] 6.4 Re-run `openspec validate add-tool-detail-pages --json`
- [x] 6.5 Re-run `npm test`
- [x] 6.6 Re-run `npm run build`
- [x] 6.7 Browser-inspect representative detail pages after the copy pass

## 7. First real demo media
- [x] 7.1 Add the Microcanvas demo video and poster image
- [x] 7.2 Render ready demo pages with a `Watch demo` CTA instead of placeholder copy

## 8. OpenSpec Studio detail page and media
- [x] 8.1 Add OpenSpec Studio to the work catalog with repo-grounded public-alpha copy
- [x] 8.2 Add a web-optimized OpenSpec Studio demo video and poster image
- [x] 8.3 Render `/tools/openspec-studio` as a ready-video detail page
