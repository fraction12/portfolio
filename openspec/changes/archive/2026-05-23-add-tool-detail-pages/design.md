## Overview
Add a reusable tool detail-page pattern, with TradeSpec as the first stronger proof page and every current artifact receiving a media-ready scaffold. The goal is not to turn the portfolio into a documentation site. It is to give important tools enough surface area to carry a story: what problem it solves, what exists, why it matters, where someone can see more, and where demo videos will live.

## Product Direction
The `/tools` page should remain the index. Detail pages should be selective and earned. A strong candidate page has at least one of:

- real users/customers or production use
- visual proof worth showing
- a public repo/site/demo
- a deeper product/architecture story than a card can carry
- recruiting/fundraising value

TradeSpec qualifies because it is the clearest product/business proof: alpha, real customer, marketing site, specific buyer/problem, and concrete output shape.

For the rest of the catalog, the first pass should be honest scaffolding rather than fake case studies. Each page can start from existing catalog truth, show a demo-video slot, and provide prompts for final copy. The copy should feel like an intentional draft surface, not a public TODO list.

## Page Model
Add detail metadata in a separate source-controlled detail-content map rather than overloading the core package catalog or hardcoding one-off routes everywhere.

Suggested fields:

- `tagline`
- `summary`
- `audience`
- `problem`
- `statusNote`
- `links`
- `demo` entry with placeholder or ready media state
- `sections` for what it is, workflow, output/proof, and why it matters
- `decisions` for key product/technical calls

Keep the model simple enough to live in source control. If this grows, move rich detail content into separate per-tool content files later.

## Route Structure
Use `/tools/[slug]` for public detail pages.

Implementation options:

1. Static allowlist route
   - define `getStaticPaths()` from artifacts with detail content
   - generate pages only for tools with detail content
   - simplest for SEO and avoids empty pages

2. Manual first page
   - create `src/pages/tools/tradespec.astro`
   - fastest but less reusable

Recommendation: use the reusable dynamic route now and populate all current artifacts through a generated detail-content map. This gives the right architecture and creates the editing surface for future videos/copy without adding a CMS.

## TradeSpec Page Content
The TradeSpec detail page should present:

- hero: TradeSpec AI, specialty-contractor estimating workflow, alpha/customer-pilot status
- one sharp product line: reads plan sets, pulls scope, and produces evidence-linked review packs
- links: TradeSpec marketing site; private/source note if needed
- problem: contractors lose estimator time on first-pass plan review and scope extraction
- workflow: upload bid package → review evidence → hand off starter pack
- output: scope summary, material takeoff, placement/notes, page-linked evidence, PDF/CSV handoff
- proof/status: real customer pilot, private alpha, marketing site exists, not publicly self-serve
- why it matters: shows AI can create trustworthy first-pass work when outputs stay grounded in source evidence

Avoid:

- claiming public SaaS availability if it is not self-serve
- exposing private repo names/details unnecessarily
- turning this into a TradeSpec sales page that duplicates the marketing site
- showing sensitive customer documents or private plan sets

## Media Strategy
Support media blocks on every detail page, but treat missing assets as explicit placeholder states.

Media should be:

- local static files under `public/tool-media/<slug>/...` when owned and safe
- or external embeds/links when already public
- always captioned and alt-described
- click-to-play only; no autoplay or sound-on load
- poster-first when video assets exist
- transcript/caption-ready when narration is present

TradeSpec and other tools can initially ship with demo placeholders. The placeholder should state what kind of demo belongs there without pretending that media exists. If no safe screenshots or videos are ready, the page should still work with text proof and links.

## Navigation
- Tool cards should link to the portfolio detail page first.
- Existing repo/site links should remain visible; the detail page can then present external links more clearly.
- Homepage featured items should click into the detail page rather than only the external marketing site/repo, while the card/footer can still show the external link.

## SEO and Machine-readable Surfaces
- Detail page title/description should be page-specific.
- `llms.txt` should mention the detail-page pattern and call out TradeSpec's portfolio detail page and marketing site.
- Avoid schema bloat in this change; standard page metadata is enough.

## Risks
- Too many visibly unfinished detail pages could make the site feel like a half-finished product museum.
- Media can accidentally overclaim polish or expose private material.
- Reusable content modeling can turn into CMS cosplay if overbuilt.

## Verification Plan
- `npm test`
- `npm run build`
- confirm `/tools/tradespec` and at least one non-TradeSpec detail page are generated/served
- inspect the rendered page links and truthful status copy
- verify `/tools` still renders and links correctly

## Follow-up Media Gaps

- Add final demo videos for each project, ideally 60-120 seconds and focused on the path from first action to useful output.
- Add poster images for ready videos so pages stay fast and visually intentional before playback.
- Add captions or transcripts for narrated demos.
- Replace generic scaffold copy with final project-specific story sections before treating every detail page as production-polished.

## Repo-grounded Copy Pass

Use the public GitHub repository README and metadata for tools that have repos. The detail page copy should translate source truth into portfolio language:

- prefer what the repo says the tool does over category-level filler
- keep labels plain and specific: memory layer, task board, menu bar, compiler, benchmark, viewer/runtime
- avoid claiming maturity, users, adoption, or demo readiness unless the repo/page supports it
- for tools without public repos, keep existing truthful product/experiment copy and mark private/dev boundaries clearly
- demo-slot captions should describe the concrete workflow a video should eventually show
