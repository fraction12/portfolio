## Why

The quiet-founder redesign is directionally strong, but the current site still has a few production-quality tells: visible demo placeholders, repeated generic link labels, a non-standard `robots.txt` directive, generic social previews, and missing edge-page polish. This change turns the redesigned portfolio from a good local pass into a credible production website that a serious startup/product reader can trust quickly.

## What Changes

- Remove unfinished public states that make the site feel scaffolded, especially visible `Demo slot` CTAs and placeholder demo sections on project detail pages without media.
- Tighten Work catalog and Writing link behavior so repeated generic labels are reduced and links are specific, useful, and accessible.
- Strengthen high-value project proof pages, with TradeSpec treated as the flagship credibility page until more demos/case-study assets are ready.
- Clean crawl and metadata surfaces: valid `robots.txt`, page-specific Open Graph/Twitter previews where useful, accurate `llms.txt`, and no stale Jarvis/public-route references.
- Add a custom 404 page that keeps the same serious visual system and routes readers back to Work, Writing, and Contact.
- Improve media and performance polish for demo pages: optimized poster assets, no autoplay, preserved controls, and no avoidable render-blocking or oversized media.
- Preserve the existing quiet founder design direction; this is a production polish pass, not another full visual redesign.

## Capabilities

### New Capabilities

- `portfolio-production-polish`: Defines the production quality bar for the public portfolio, including unfinished-state handling, link specificity, flagship proof-page polish, crawl/metadata correctness, custom 404 behavior, media optimization, accessibility, and verification requirements.

### Modified Capabilities

- None. No archived OpenSpec capabilities currently exist for the public portfolio site.

## Impact

- Affected routes: `/`, `/tools`, `/tools/[slug]`, `/writing`, `/contact` anchor behavior, `/404` or not-found behavior, `/robots.txt`, `/llms.txt`, sitemap/metadata surfaces, and removed `/jarvis` references if any remain.
- Affected components: build/work cards, writing cards/rows, tool detail page media sections, layout metadata, nav/footer as needed, contact surfaces if redundant copy is found, and any custom not-found page components.
- Affected assets: Open Graph images, favicon/app icon set if added, demo video poster images, and any generated static media derivatives.
- Affected tests/validation: OpenSpec validation, existing unit/config tests, production build, representative browser inspection, Lighthouse or equivalent production-page audit, link/copy redundancy audit, and accessibility/focus checks.
