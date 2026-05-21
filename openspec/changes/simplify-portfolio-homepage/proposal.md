## Why

The homepage currently has a strong visual identity, but too many labels, status cues, command-line flourishes, and competing proof points make it feel noisy instead of serious. The next version should make a serious reader believe within 10 seconds that Dushyant is a product-minded builder who turns ambiguous AI ideas into working systems.

## What Changes

- Reposition the homepage around a calm proof-of-work narrative for a Product Manager / Builder.
- Keep the dark technical "Signal Desk" visual language, but remove or demote terminal/status/dashboard chrome that reads as performative.
- Simplify the hero copy, CTAs, section labels, and featured-work presentation so the page leads with judgment, selected work, and concrete product outcomes.
- Reduce label density across the homepage: fewer mono tags, fewer decorative dividers, fewer jokey section suffixes, and no fake-live/status phrasing used as credibility.
- Replace broad activity/metric theater with a small number of truthful, useful proof points.
- Preserve existing core routes and content sources while changing the homepage emphasis and component composition.

## Capabilities

### New Capabilities

- `portfolio-homepage-positioning`: Defines the homepage positioning, proof hierarchy, copy tone, and visual-noise constraints for the cleaned-up portfolio.

### Modified Capabilities

- None. No archived OpenSpec capability currently exists for the portfolio homepage.

## Impact

- Affected pages/components: `src/pages/index.astro`, `src/components/Hero.astro`, `src/components/ColophonTerminal.astro`, `src/components/SectionHead.astro`, `src/components/ToolCard.astro`, and related homepage styles.
- No new external dependencies are expected.
- No routing changes are required.
- Validation should include the existing test suite, production build, and a local visual inspection of the homepage on desktop and mobile.
