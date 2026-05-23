## Why

Several public tool repositories now expose real project websites through GitHub Pages, but the portfolio still treats those tools as source/package-only projects. Adding those public surfaces and screenshots makes the detail pages feel more complete without inventing demos or adding placeholder copy.

## What Changes

- Add verified repo homepage URLs for agentplan and agentrem.
- Add optimized screenshot previews for agentplan and agentrem detail pages.
- Keep existing OpenRank, WireFlow, and TradeSpec previews unchanged.
- Keep Eat as source-only because its declared Vercel deployment currently returns `DEPLOYMENT_NOT_FOUND`.
- Do not add screenshots for GitHub README-only homepages or repos without a real public website.

## Capabilities

### New Capabilities
- None.

### Modified Capabilities
- `tool-detail-pages`: Detail pages and catalog surfaces should use verified public repository websites and screenshot previews when a repo declares a working non-GitHub website.

## Impact

- Affected config: `src/config/packages.ts`, `src/config/tool-details.ts`.
- Affected assets: new `public/tool-media/agentplan/*` and `public/tool-media/agentrem/*` preview images.
- Affected tests: tool detail media config tests.
- External verification: GitHub repository homepage metadata and live HTTP checks for public websites.
