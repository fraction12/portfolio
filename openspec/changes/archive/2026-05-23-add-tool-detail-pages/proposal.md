## Why
The portfolio's `/tools` page is good at proving breadth, but the stronger artifacts now need room to prove depth. TradeSpec in particular is no longer just a line item: it has a real marketing site, a customer-facing product story, and enough context to act as proof that Dushyant can turn agent/product ideas into something commercially legible.

A dedicated tool page pattern lets the portfolio show screenshots, demo videos, richer narrative, status, links, and implementation context without making `/tools` bloated or forcing every tool card to carry the whole story. The next version should scaffold detail pages across the portfolio so demo videos and final copy can be added project-by-project without reworking the information architecture later.

## What Changes
- introduce first-class per-tool detail pages under `/tools/[slug]`
- ship a reusable detail page for each current catalog artifact, seeded with restrained placeholder copy derived from existing truthful catalog descriptions
- ship a stronger first detail page for TradeSpec AI
- connect existing tool cards and machine-readable catalog surfaces to the new page where appropriate
- support richer proof sections such as screenshots, demo videos, problem, workflow, proof/status, links, and notes on what is public vs private
- add media-ready demo slots so real video assets can be added later without changing page structure
- keep truthful distribution/status copy: no fake npm package, fake repo, or public access claims

## Scope
In scope:
- Astro route/template support for tool detail pages
- content/model additions needed for rich tool pages
- placeholder detail content for all current catalog artifacts
- TradeSpec AI as the most specific implemented detail page
- `/tools` and homepage navigation into internal portfolio detail pages while preserving external links
- metadata and `llms.txt` updates so human-readable and machine-readable surfaces stay aligned

Out of scope:
- redesigning the whole portfolio
- changing the TradeSpec marketing site
- publishing private TradeSpec source or internals
- adding a CMS
- adding heavy video hosting/infrastructure beyond local video, poster assets, or supported public embeds
- producing final case-study copy or final demo-video files for every project

## Success Criteria
- `/tools/tradespec` exists and reads like a concise product case study, not a README dump
- every current catalog artifact has a detail page scaffold under `/tools/{slug}`
- the page is truthful about TradeSpec's current alpha/private/customer-pilot status
- each page can include screenshots and/or demo media without requiring a redesign later
- placeholder media states are polished, clearly incomplete, and do not pretend that a demo video exists
- copy and labels for public-repo-backed tools are grounded in the current GitHub README/repo metadata instead of generic category scaffolding
- the existing `/tools` page can link into detail pages while preserving GitHub/live-site links
- `llms.txt` reflects that TradeSpec has a portfolio detail page and marketing site
- `npm test` and `npm run build` pass
