# KV Capsules + PTI Portfolio Implementation Plan

Date: 2026-06-16
Origin: `docs/brainstorms/2026-06-16-kv-capsules-pti-portfolio-requirements.md`

## Problem Frame

The portfolio needs to present the KV Capsules + PTI paper as a high-signal Work artifact, not a writing archive item or a bare PDF link. The page must make the practical result immediately legible: on the selected repeated-work stream, the KV Capsule + PTI route was 13.8x faster than the tested regular text-threaded local-agent harness while also completing more tasks.

The page must preserve the research boundaries from the origin brief: this is a selected repeated-work comparison using the same local model family under different runtime contracts, not an official BFCL leaderboard result and not a prompt-identical universal KV speed claim.

## Scope

In scope:

- Add a new Work catalog card for `KV Capsules + PTI`.
- Add a detail page at `/tools/kv-capsules-pti`.
- Copy the final explainer video, poster image, and paper PDF into `public/tool-media/kv-capsules-pti/`.
- Make the `13.8x faster` result visible above the fold or in the first detail-page story pass.
- Link to the PDF from the detail page.
- Add a focused data/config regression test for the new artifact.

Out of scope:

- Redesigning the Work detail page template.
- Hosting or rebuilding the separate paper site.
- Changing the paper content.
- Adding a homepage feature strip unless requested later.
- Publishing or committing the untracked video folder in `ai-research-lab`.

## Existing Patterns To Follow

- Catalog data lives in `src/config/packages.ts`.
- Detail copy and media live in `src/config/tool-details.ts`.
- Editorial flagship ordering lives in `src/config/featured-work.ts`.
- `/tools` catalog copy lives in `src/pages/tools.astro`.
- Detail pages are generated from `src/pages/tools/[slug].astro`.
- Card media uses `detail.demo.poster` for video cards, as seen in `microcanvas`, `spec-ui`, and `openspec-studio`.
- Static media lives under `public/tool-media/<slug>/`.

## Implementation Units

### 1. Static Assets

Files:

- `public/tool-media/kv-capsules-pti/kv-capsules-pti-explainer.mp4`
- `public/tool-media/kv-capsules-pti/kv-capsules-pti-poster.jpg`
- `public/tool-media/kv-capsules-pti/quality-gated-attention-state-reuse.pdf`

Source assets:

- Video source from the research repo: `research/02-quality-gated-stateful-kv-reuse/kv-pti-research-video/renders/kv-pti-research-explainer-v8d-timeline-fixed.mp4`
- Poster source candidate from the research repo: `research/02-quality-gated-stateful-kv-reuse/kv-pti-research-video/snapshots/contact-sheet.jpg`
- PDF source from the research repo: `research/02-quality-gated-stateful-kv-reuse/arxiv/main.pdf`

Decision:

- Prefer a single clean poster frame over the contact sheet if one of the existing frame snapshots reads well in the card. Use the contact sheet only if the single frames are weak.
- Rename copied assets to portfolio-facing names rather than preserving long research filenames.

Verification:

- Confirm all copied media files exist under `public/tool-media/kv-capsules-pti/`.
- Confirm the detail video loads from the portfolio path and has a poster.

### 2. Artifact Catalog Entry

File:

- `src/config/packages.ts`

Add an artifact:

- `slug`: `kv-capsules-pti`
- `name`: `KV Capsules + PTI`
- `category`: `human-tools`
- `status`: `private` or `dev`
- `kind`: `research · local agent runtime`
- `stack`: `llama.cpp · gemma 4 12b · local agents`
- `metricOverride`: `13.8x faster repeated-work run`

Decision:

- Use `human-tools`, not `experiments`, because the work is research into the runtime shape of local-agent tools and belongs beside operator-facing agent systems.
- Use `private` if the underlying harness/repo is not meant to be presented as an installable public project; use `dev` only if the page should imply active prototype status.

Verification:

- `/tools` includes the new artifact.
- `getToolDetail('kv-capsules-pti')` resolves.

### 3. Detail Copy And Links

File:

- `src/config/tool-details.ts`

Add an override for `kv-capsules-pti`.

Required copy:

- Tagline: `Quality-gated attention-state reuse for local tool-using agents.`
- Summary: explain that stable tool context can be preserved as reusable hidden attention state instead of replayed or summarized as text.
- Problem: local agents repeatedly pay to reread stable context such as tool schemas, runtime rules, interface contracts, and task protocols.
- Status note: make clear this is a research artifact/paper, not an installable production tool.
- Demo: video with `src`, `poster`, label, duration if known, and a caption mentioning the explainer.
- Links:
  - `Read paper` -> `/tool-media/kv-capsules-pti/quality-gated-attention-state-reuse.pdf`

Required story sections:

- `What I built`: KV Capsule harness, PTI, control ladder, repeated-work comparison.
- `How it works`: validated stable prefix becomes restored hidden KV state; fresh task tails are appended; PTI constrains tool plans.
- `What it proves`: 13.8x faster on the selected repeated-work stream, `100/100` with restored KV + PTI, `0 leaks` in fresh-tail and wrong-capsule controls, with explicit limitation language.

Decision:

- The first proof sentence should be direct: `On the selected repeated-work stream, KV Capsules + PTI completed the 100-case run 13.8x faster: 14.2 minutes versus 3.28 hours for the tested regular text-threaded local-agent harness.`
- Immediately qualify the result in the same section: `This is a practical runtime comparison, not a prompt-identical benchmark or official BFCL leaderboard claim.`

Verification:

- Detail page renders without missing fields.
- The paper link opens the PDF.
- The copy includes `13.8x faster`, `14.2 minutes`, `3.28 hours`, `100/100`, and `0 leaks`.

### 4. Catalog Placement And Copy

Files:

- `src/config/featured-work.ts`
- `src/pages/tools.astro`

Changes:

- Add `kv-capsules-pti` to `flagshipWorkSlugs`.
- Add `flagshipWorkProof` entry.
- Add `catalogCopy` entry for the `/tools` card.

Decision:

- Place the new slug after `deepclean` in `flagshipWorkSlugs`, unless implementation review shows the Work page needs the research artifact even higher.
- Catalog card copy should include the speed proof without becoming too dense:
  `Research system for local agents that reused hidden attention state to complete the selected repeated-work stream 13.8x faster than the tested regular harness.`

Verification:

- New card appears on page 1 of `/tools`.
- Card support text uses `metricOverride`.
- Card image appears via the video poster.

### 5. Regression Test

File:

- `tests/config/tool-details.test.ts`

Test scenarios:

- `getToolDetail('kv-capsules-pti')` returns a detail with `detailPath === '/tools/kv-capsules-pti'`.
- The artifact has `metricOverride` containing `13.8x`.
- The demo is a ready video with both `src` and `poster`.
- The detail has a `Read paper` link ending in `.pdf`.
- The detail copy contains the claim-boundary terms needed to prevent overclaiming, such as `selected repeated-work stream` and `not a prompt-identical`.

Decision:

- Keep this as a config/data test rather than a browser test. The implementation is content-driven; the highest-risk regression is broken data or missing claim boundary text.

Verification:

- `npm test` passes.

## Build Verification

Run:

- `npm run typecheck`
- `npm test`
- `npm run build`

Manual check:

- Open `/tools`.
- Open `/tools/kv-capsules-pti`.
- Confirm video poster and controls render.
- Confirm the speed proof is visible early and the limitation language is present.
- Confirm the PDF link opens.

## Risks And Mitigations

- Risk: The speed claim becomes too broad.
  - Mitigation: Pair every `13.8x faster` claim with `selected repeated-work stream` and keep the baseline described as the tested regular text-threaded local-agent harness.

- Risk: Video asset is large and hurts page load.
  - Mitigation: Existing template uses `preload="none"` for videos. Keep a poster and avoid autoplay.

- Risk: Contact-sheet poster looks noisy in the Work grid.
  - Mitigation: Prefer a single frame snapshot if visually stronger.

- Risk: The research repo has untracked video assets.
  - Mitigation: Copy only the chosen final assets into the portfolio; do not modify or stage the research repo.

## Open Questions

- Should the artifact status be `private` or `dev`? Default to `private` if implementing without more input.
- Should a separate static paper site be copied later? Defer; the PDF link is enough for this pass.

