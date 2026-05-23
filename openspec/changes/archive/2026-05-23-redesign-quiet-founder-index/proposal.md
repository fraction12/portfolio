## Why

The current portfolio has improved, but it still carries too much "Signal Desk" interface language: labels, status cues, catalog surfaces, tool metadata, and repeated proof all compete with the serious first impression the site needs to create. The next redesign should make the site feel like a production-quality founder/PM index: restrained, cohesive, credible, and built for readers who evaluate startup-caliber product judgment quickly.

## What Changes

- Redesign the entire public site around the approved Option A direction: a quiet founder index for a Product Manager / Builder.
- Replace the current dark agent-cockpit visual language with a cohesive editorial design system: fewer accents, cleaner layout, restrained cards, consistent type roles, and production-grade spacing.
- Apply research-backed quality constraints from Stanford Web Credibility, Nielsen Norman Group visual/usability heuristics, GOV.UK design principles, WCAG 2.2, and the personal-site pattern study.
- Rewrite labels, page titles, section names, CTAs, metadata, card copy, and footer text so every surface uses serious, plain-spoken product language.
- Introduce a strict redundancy rule: a specific claim, metric, project description, or contact prompt appears only once per page unless it has a different navigational purpose.
- Rework homepage information architecture so the first 10 seconds communicate: Dushyant is a PM/builder who ships practical AI products in serious startup environments.
- Keep the existing `/tools` route for compatibility, but label it **Work** in public navigation and redesign it as a calmer selected-builds/catalog page.
- Rework `/writing` into a clean essays/notes page that supports credibility without newsletter or Substack repetition.
- Remove the Jarvis page from the public site experience. `/jarvis` should not redirect to another portfolio surface unless a technical constraint temporarily forces a migration fallback.
- Preserve truthful existing data sources and links where useful, but stop using fake-live/status phrasing or non-metrics as credibility.
- Keep the Astro stack and avoid adding new UI dependencies unless implementation reveals a strong reason.

## Capabilities

### New Capabilities

- `portfolio-site-redesign`: Defines the full-site information architecture, design system, copy model, redundancy constraints, page behavior, and removal of the Jarvis public page.

### Modified Capabilities

- None. No archived OpenSpec capability currently exists for the public portfolio site.

## Impact

- Affected routes: `/`, `/tools`, `/writing`, `/jarvis`, `/llms.txt`, metadata for indexed pages, and navigation/footer routes.
- Affected components: layout, nav, theme controls, footer, hero, page headers, section headers, cards, buttons, writing rows, newsletter/contact surfaces, selected proof/build surfaces, and any Jarvis-specific components removed from public routing.
- Affected styling: global tokens, base layout, component CSS, page-specific CSS, motion/hover behavior, color system, spacing, typography, borders, and surface elevation.
- Affected content: route descriptions, Open Graph descriptions, JSON-LD identity copy, artifact/category labels, homepage featured project copy, tools page taxonomy, writing page copy, footer/social/contact labels, and machine-readable summaries if they reference removed public pages.
- Validation should include OpenSpec validation, existing tests, production build, desktop/mobile browser inspection, accessibility/focus checks, a first-10-second review, and a manual copy audit for repeated claims and noisy language.
