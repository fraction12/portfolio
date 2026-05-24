## Context

The latest portfolio redesign successfully removed the loud dashboard/terminal feeling. A rendered audit across desktop and mobile found the remaining design issue: the site is calm but not persuasive enough. It needs a clearer proof hierarchy, stronger project visuals, less template-like detail pages, and a dark mode that stays editorial.

Research guardrails:
- NN/g homepage guidance: communicate who/what quickly, reveal content through concrete examples, prompt clear next actions, and keep the homepage simple.
- NN/g minimalist heuristic: every extra unit of information competes with relevant information.
- Stanford credibility guidance: professional visual design, contact clarity, usefulness, freshness, restraint, and small-error cleanup affect trust.
- Information scent guidance: link labels, summaries, context, and representative images shape whether readers continue.

## Goals / Non-Goals

**Goals:**
- Make the first scan more believable by adding concise proof without noisy metrics.
- Promote flagship work visually while keeping the broader catalog inspectable.
- Turn important detail pages into proof-oriented mini case studies.
- Fix oversized title containment and improve responsive visual QA.
- Keep dark mode, Writing, and public copy aligned with serious PM/builder positioning.

**Non-Goals:**
- Add a new design language, animation system, or dependency.
- Reintroduce terminal/dashboard/cockpit aesthetics.
- Rewrite every project description from scratch.
- Create new product claims, customer metrics, or adoption claims not already safe to publish.

## Decisions

### Decision: Add proof without a badge wall
Use a compact proof strip or proof rail on the homepage with 3-4 specific, plain-language signals. This supports credibility without returning to the earlier noisy "proof" system.

Alternatives considered:
- Add metrics everywhere: rejected because the user explicitly rejected cringe metric language and many projects do not have comparable metrics.
- Add a hero screenshot montage: rejected for now because it risks visual noise and weakens the quiet identity.

### Decision: Split Work into flagship and supporting lists
The Work page should lead with flagship project cards that include media and product context, then continue into compact supporting rows. This makes TradeSpec/OpenSpec Studio/Microcanvas/spec-ui/agentplan-style proof feel intentionally ranked.

Alternatives considered:
- Keep one uniform list: rejected because it makes a customer-facing product and a parked experiment feel equally important.
- Make every project a visual card: rejected because it makes the catalog heavy and noisy.

### Decision: Promote media into detail-page proof
Ready media should appear directly after links or as part of the top detail composition, not far down the page. The implementation should keep stable media frames, descriptive captions, and no autoplay.

Alternatives considered:
- Keep media where it is: rejected because readers must scroll past abstract copy before seeing proof.
- Put every screenshot in the hero: rejected because some media assets are not strong enough and some detail pages have no safe media.

### Decision: Scale detail typography down slightly
Keep strong editorial titles, but cap the desktop title size and width so long names do not collide with metadata. Use responsive containment rather than per-project title hacks.

Alternatives considered:
- Add per-slug CSS overrides: rejected because the issue is systemic.

### Decision: Keep dark mode editorial
Use warmer dark surfaces and less absolute black so dark mode feels like a reading mode rather than a terminal surface.

Alternatives considered:
- Remove dark mode: rejected because it is already present and useful.

## Risks / Trade-offs

- [Risk] Flagship cards could make the Work page feel more marketing-heavy. → Mitigation: use restrained cards, direct captions, and keep the supporting catalog compact.
- [Risk] Proof strip could become a badge wall. → Mitigation: limit to 3-4 plain facts, no animated counters, no fake-live labels.
- [Risk] Media crops may not be ideal for all assets. → Mitigation: improve CSS framing now and keep future screenshot replacement easy through `tool-details.ts`.
- [Risk] Some detail pages still have no media. → Mitigation: do not fabricate media; smaller pages can remain text-only and lower priority.

## Migration Plan

Implement behind existing routes and config. No migration is required. Rollback is a standard git revert of this change.

## Open Questions

- Which projects should remain in the flagship set long-term? Initial implementation will use the strongest current public proof and can be adjusted later.
