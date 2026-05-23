## Why

Eat now has a working public website at `https://eat-ai.app`, so the portfolio should stop presenting it as source-only or unavailable. Adding the live link and screenshot keeps the Work catalog accurate and gives the Eat detail page the same production preview treatment as other public product surfaces.

## What Changes

- Replace the stale Eat deployment language with the verified public website `https://eat-ai.app`.
- Add an optimized Eat website screenshot preview to the detail page.
- Keep the GitHub repository link available.
- Update machine-readable summary and tests so Eat is no longer treated as missing a public deployment.

## Capabilities

### New Capabilities
- None.

### Modified Capabilities
- `tool-detail-pages`: Detail pages and catalog surfaces should represent Eat as a live public web app with a screenshot preview.

## Impact

- Affected config: `src/config/packages.ts`, `src/config/tool-details.ts`.
- Affected public summary: `src/data/llms.txt`.
- Affected assets: `public/tool-media/eat/eat-preview.jpg`.
- Affected tests: tool detail media/link assertions.
