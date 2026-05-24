## Why

The current cleanup made the portfolio calmer, but the next credibility gap is deeper: the site still reads partly like a catalog of projects instead of a decisive Product Manager / Builder proof system. A serious reader should understand the thesis, inspect proof, and see judgment within the first scan without working through mixed screenshots, raw writing feeds, or fact-sheet case studies.

This change strengthens the site for a first-impression reader evaluating whether Dushyant can build and lead practical AI product work.

## What Changes

- Sharpen the homepage hero so the first viewport states what Dushyant builds, who it is for, and why the work is credible without overclaiming.
- Make the hero portrait either clearly intentional/professional or remove/de-emphasize it from first-impression hierarchy.
- Convert tool detail pages from structured fact sheets into product case studies with a consistent story rhythm: problem, ownership, product decision, shipped output, and proof.
- Update ready media on detail pages so screenshots and demos are inspectable proof rather than decorative cropped thumbnails.
- Standardize flagship screenshot treatment across Work cards so mixed source screenshots feel like one portfolio system.
- Curate Writing so the first visible list supports the portfolio thesis; off-thesis or more personal essays remain reachable but stop leading the page.
- Add a clearer contact path after strong proof surfaces without making the design feel salesy.

## Capabilities

### New Capabilities

- None.

### Modified Capabilities

- `portfolio-homepage-positioning`: tighten first-viewport credibility, role clarity, and portrait handling.
- `portfolio-site-redesign`: extend the design system to cover a consistent screenshot/media treatment, curated writing hierarchy, and visible contact path.
- `tool-detail-pages`: require case-study narrative structure and inspectable detail-page media.
- `portfolio-production-polish`: add validation expectations for curated writing, media framing, contact placement, and screenshot-system consistency.

## Impact

- Affected routes: `/`, `/tools`, `/writing`, `/tools/{slug}`, and contact anchors.
- Affected components likely include `Hero`, `ProofStrip`, `FlagshipWorkCard`, `Writing`, `WritingRow`, `Contact`, and the tool detail page template.
- Affected data/config likely includes curated writing metadata or filtering logic, tool detail section labels/copy, and demo media presentation.
- No API, auth, database, deployment, or package dependency changes are expected.
