## Context

The portfolio already has a quiet, production-grade detail-page media pattern for ready videos and public website screenshots. GitHub repo metadata now identifies two additional working project sites:

- `fraction12/agentplan` -> `https://fraction12.github.io/agentplan/`
- `fraction12/agentrem` -> `https://fraction12.github.io/agentrem/`

Existing working websites already represented in the portfolio are OpenRank, WireFlow, and TradeSpec. Eat still declares `https://eat-tawny.vercel.app`, but that deployment currently returns `DEPLOYMENT_NOT_FOUND`, so it should remain source-only.

## Goals / Non-Goals

**Goals:**

- Add agentplan and agentrem public website links to catalog/detail surfaces.
- Add screenshot previews for those sites using the existing media model.
- Preserve the information rule: do not add duplicate links or new noisy labels.
- Keep broken or GitHub README-only homepages out of the preview set.

**Non-Goals:**

- Do not create new website copy beyond concise captions/alt text.
- Do not add demos where only screenshots exist.
- Do not restore Eat's dead deployment link.
- Do not change the overall detail page layout.

## Decisions

### Decision: Treat non-GitHub working homepages as previewable websites

Agentplan and agentrem both expose working GitHub Pages sites that are more useful to visitors than only GitHub/package links. They should receive `url` values and ready image media.

Alternative considered: only link GitHub. Rejected because the public sites are designed visitor surfaces and help the portfolio feel more complete.

### Decision: Exclude dead and README-only homepages

Eat's Vercel deployment is unavailable, and OpenSpec Studio's repo homepage points to a GitHub README anchor. Neither should receive a screenshot as a public website preview.

### Decision: Use the existing image preview media model

The detail page already supports `type: 'image'` with stable dimensions, captions, and alt text. Reusing it avoids new UI complexity and keeps the site cohesive.

## Risks / Trade-offs

- GitHub Pages screenshots can drift as those docs sites change -> Store local screenshots and refresh when the source sites materially change.
- Adding website URLs changes Work catalog secondary links from GitHub to website host labels -> Accept because the catalog already prefers the strongest public destination while GitHub remains available on detail pages.
- Website screenshots are not demos -> Label them as `Preview`, not `Demo`.
