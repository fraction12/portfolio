# KV Capsules + PTI Portfolio Feature Brief

Date: 2026-06-16

## Goal

Add the KV Capsules + PTI research work to the portfolio as a flagship Work artifact, using the explainer video and paper as proof while making the speed result legible to non-paper readers.

## Positioning

This should read as a research-backed systems artifact, not a writing post or a raw PDF link.

Recommended title:

> KV Capsules + PTI

Recommended tagline:

> Quality-gated attention-state reuse for local tool-using agents.

Recommended short card copy:

> A local-agent research system showing that stable tool context can be preserved as reusable hidden attention state instead of replayed or summarized as text.

Primary proof point:

> 13.8x faster on the selected repeated-work stream, completing the 100-case run in 14.2 minutes versus 3.28 hours for the tested regular text-threaded local-agent harness.

## Required Claim Boundaries

The speed claim is important and should be prominent, but it must be stated carefully.

Allowed:

- KV Capsule + PTI was 13.8x faster on the selected repeated-work stream.
- The comparison used the same local model family under different runtime contracts.
- KV Capsule + PTI completed 100/100 tasks in 853,499 ms.
- The regular text-threaded local-agent harness completed 86/100 tasks in 11,813,816 ms.
- The KV route used restored hidden state and small fresh tails, avoiding repeated visible context replay.
- The baseline was a practical local-agent harness with natural text compaction, not a prompt-identical mechanism control.

Avoid:

- "KV capsules are always faster."
- "Prompt-identical comparison."
- "Official BFCL leaderboard result."
- Treating reported visible-token telemetry as clean per-task token accounting.

## Page Structure

### Hero

Use the final explainer video first.

Media:

- Source video: `/Volumes/MacSSD/Projects/kv-capsules-paper-video/renders/kv-capsules-paper-video-with-background-music-20pct-actual-high.mp4`
- Poster candidate: `research/02-quality-gated-stateful-kv-reuse/kv-pti-research-video/snapshots/contact-sheet.jpg` or a single selected frame.
- PDF: `research/02-quality-gated-stateful-kv-reuse/arxiv/main.pdf`

Hero copy should frame the work in plain English:

> Local agents keep paying to reread stable tool context. This project tested whether a validated KV state could carry that context instead.

### Proof Strip

Show three compact numbers:

- `13.8x faster` repeated-work completion
- `100/100` selected cases with restored KV + PTI
- `0 leaks` across fresh-tail and wrong-capsule controls

Optional comparison text:

> 14.2 minutes vs 3.28 hours on the selected 100-case repeated-work stream.

### What I Built

Explain the components:

- KV Capsule harness: saves and restores validated attention/KV state for stable local-agent context.
- PTI: constrained structured local tool interface for deterministic tool plans.
- Control ladder: full visible PTI, native live append, restored KV, fresh-tail negative, wrong-capsule negative, direct visible tools, compact visible evidence.
- Repeated-work comparison: practical local-agent runtime comparison against a regular text-threaded harness.

### Why It Matters

Core message:

> Text summaries preserve an interpretation of context. KV Capsules preserve the model's computed attention state after reading stable context.

This is the portfolio-level insight. It should sell systems judgment, not just benchmark numbers.

### Evidence

Use careful paper-backed evidence:

- Restored KV matched native live append on the selected 100-case cohort.
- Fresh-tail and wrong-capsule controls produced zero leaks.
- Compact visible evidence solved 19/100, which distinguishes the mechanism from text-memory approaches.
- Direct visible tools solved 91/100, while PTI lanes reached 100/100.
- On the repeated-work stream, KV Capsule + PTI completed in 853,499 ms versus 11,813,816 ms for the tested natural compaction baseline.

### Links

Primary links:

- Read the paper
- Watch the explainer

Optional link:

- View research site, if the static paper site is copied or hosted.

## Placement

Add this to `/tools` as a flagship Work card.

Recommended ordering:

- Include in `flagshipWorkSlugs`.
- Place near the top, but probably after OctoCheck and Deepclean unless the homepage needs a stronger research signal.

Recommended category:

- `human-tools` if we want it grouped with AI/operator tooling.
- `experiments` if we want to emphasize research scope and avoid implying a productized tool.

My recommendation: use `human-tools` with status `dev` or `private`. The work is not just an experiment; it is research into the runtime shape of local-agent tools.

## Success Criteria

- `/tools` shows a new KV Capsules + PTI card with media.
- Detail page embeds the explainer video.
- Detail page links to the PDF.
- The 13.8x speed result is visible without scrolling far.
- The copy preserves limitations and does not overclaim.
- Build passes.
