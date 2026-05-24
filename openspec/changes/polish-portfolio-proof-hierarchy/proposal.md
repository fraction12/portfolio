## Why

The redesign is calmer and more serious, but the site now underplays proof: the homepage is credible without enough evidence, the Work page gives flagship products and parked experiments similar weight, and detail pages feel too template-like. This change makes the portfolio persuasive in the first scan while preserving the quiet founder direction.

## What Changes

- Add a compact proof layer to the homepage that supports the Product Manager / Builder positioning without returning to noisy badges or "live proof" language.
- Rework the Work catalog hierarchy so flagship projects lead with visual proof and smaller systems/experiments become easier to scan.
- Make tool detail pages feel like case studies where media, product decisions, and evidence support the story instead of sitting below generic schema sections.
- Fix oversized detail-page title behavior and improve media placement/cropping so screenshots and demos are useful proof.
- Tighten Writing page and dark-mode presentation so both remain editorial, serious, and consistent with the overall positioning.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `portfolio-site-redesign`: Strengthen homepage proof hierarchy, Work catalog hierarchy, Writing page editorial cleanup, and dark-mode restraint.
- `tool-detail-pages`: Improve detail-page case-study structure, media prominence, and title containment.
- `portfolio-production-polish`: Add verification expectations for proof hierarchy, responsive layout, and content-quality cleanup.

## Impact

- Affected pages/components: `src/pages/index.astro`, `src/pages/tools.astro`, `src/pages/writing.astro`, `src/pages/tools/[slug].astro`, `src/components/Hero.astro`, `src/components/BuildCard.astro`, writing components, and shared CSS.
- Affected content/config: project detail metadata and media captions in `src/config/tool-details.ts` and catalog copy in `src/config/packages.ts`/page-local maps as needed.
- No route removals, data model migrations, or runtime dependencies are expected.
