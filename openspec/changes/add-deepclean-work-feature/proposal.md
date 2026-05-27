## Why

Deepclean is now a public GitHub and npm artifact with a landing site, so the portfolio should represent it as current work instead of omitting a newly released tool.

## What Changes

- Add Deepclean to the Work catalog as a public Human Tools project.
- Add a Deepclean detail page through the existing catalog/detail data model.
- Feature Deepclean on the homepage selected-work grid.
- Add a screenshot preview captured from the public Deepclean landing site.
- Update machine-readable portfolio summary text so agents can discover the new tool.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `portfolio-site-redesign`: Work catalog and homepage selected-work surfaces include Deepclean as current public work.
- `tool-detail-pages`: Tool detail pages include Deepclean with repo-grounded copy, public links, and landing-site preview media.

## Impact

- `src/config/packages.ts`
- `src/config/tool-details.ts`
- `src/config/featured-work.ts`
- `src/pages/tools.astro`
- `src/data/llms.txt`
- `public/tool-media/deepclean/*`
