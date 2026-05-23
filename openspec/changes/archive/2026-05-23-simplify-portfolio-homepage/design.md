## Context

The current homepage implements the April "Signal Desk" redesign: dark technical styling, live-ish metrics, terminal panels, numbered sections, mono tags, and a strong builder/operator mood. The design is distinctive, but the accumulated labels and status cues now compete with the main job of the site: help a serious reader quickly understand that Dushyant is a Product Manager / Builder who ships useful AI products.

Product direction chosen in discovery:

- Use the "Calm Proof Of Work" direction.
- Keep the dark technical identity.
- Strip away performative dashboard/terminal/status language.
- Lead with judgment, selected work, and concrete product outcomes.

External pattern check:

- Sam Altman's blog is text-first and sparse, which reinforces that credibility does not require interface theatrics: https://blog.samaltman.com/
- Patrick Collison's site is extremely plain and link-driven, which reinforces that serious builders can rely on clear taxonomy over visual noise: https://patrickcollison.com/
- Derek Sivers' site is similarly direct and personal, which reinforces the value of simple navigation and owned voice: https://sive.rs/

## Goals / Non-Goals

**Goals:**

- Make the homepage feel serious, composed, and credible within the first viewport.
- Replace the current hero emphasis with a clearer Product Manager / Builder thesis.
- Curate proof around a small number of selected systems instead of many simultaneous status signals.
- Reduce decorative labels, jokey section headings, terminal commands, status dots, and non-metric metrics.
- Preserve the existing Astro stack, data modules, routes, and dark technical styling where they still serve the positioning.

**Non-Goals:**

- Do not redesign the entire site in this change.
- Do not remove project, writing, contact, or detail-page capabilities.
- Do not invent new metrics, badges, or external proof.
- Do not introduce a CMS, animation framework, or design dependency.
- Do not archive or complete the unrelated `add-tool-detail-pages` change.

## Decisions

### Decision: Lead With Builder Thesis, Not Activity Theater

The hero should say plainly that Dushyant turns ambiguous AI ideas into working products. The first-screen supporting copy should explain practical AI systems, product workflows, useful interfaces, and shipped proof.

Alternatives considered:

- Keep "I ship at the pace of agents": memorable, but it centers the agent metaphor before the human product judgment.
- Lead with metrics: useful only when the metric is legible and relevant; otherwise it reads as decorative dashboard styling.

### Decision: Replace Terminal Panel With Selected Proof

The right side of the hero should stop behaving like a metrics terminal. Replace or heavily demote `ColophonTerminal` on the homepage with a quieter selected-proof panel or selected-work preview.

Alternatives considered:

- Keep the terminal but remove rows: still carries the command-line gimmick in the most valuable viewport.
- Remove the right column entirely: clean, but loses a fast proof surface.

### Decision: Keep Dark Technical Styling, Reduce Chrome

The existing palette and restrained amber accent can stay. The cleanup should focus on density: fewer labels, simpler section headings, lower mono usage, calmer cards, and less decorative punctuation.

Alternatives considered:

- Full light editorial redesign: mature, but loses the distinctive technical identity.
- Keep the full Signal Desk concept: distinctive, but currently too noisy for the desired first impression.

### Decision: Curate Featured Work

Homepage featured work should act like selected evidence, not a catalog. Favor three or four systems with clear product relevance, plain descriptions, and a path to deeper detail when available.

Alternatives considered:

- Show many tools: proves breadth but increases scanning cost.
- Show only one hero project: focused, but underplays range.

### Decision: Treat Metrics As Optional Supporting Evidence

Metrics may remain only if they are truthful, sourced, and explanatory. Remove non-metric phrasing like "live public proof" and avoid status language that tries to manufacture credibility.

Alternatives considered:

- Remove all metrics: maximally calm, but may discard useful evidence if already wired.
- Preserve all existing metric rows: keeps instrumentation, but conflicts with the cleanup goal.

## Proposed Homepage Shape

1. **Nav:** simple identity plus key routes. No status strip in the homepage nav.
2. **Hero:** Product Manager / Builder kicker, direct thesis, concise lede, two CTAs.
3. **Selected Proof:** three or four high-signal projects with plain product descriptions.
4. **Selected Work Section:** continue the proof with richer cards, but reduce metadata and install-command prominence.
5. **Writing:** keep as credibility for thinking, with simpler section label and fewer decorative marks.
6. **Contact:** keep straightforward, without extra theater.

Candidate hero copy:

```text
Product Manager / Builder

I turn ambiguous AI ideas into working products.

I build practical AI systems, product workflows, and open-source tools.
The throughline is simple: find the useful interface, ground it in real work,
and ship the smallest honest proof.
```

## Risks / Trade-offs

- **Risk:** The cleanup removes too much personality.  
  **Mitigation:** Keep the dark technical palette, sharp selected-work curation, and specific product language.

- **Risk:** The page becomes generic portfolio minimalism.  
  **Mitigation:** Keep concrete AI/product systems in the first screen and avoid bland resume copy.

- **Risk:** Removing metric surfaces hides real shipping velocity.  
  **Mitigation:** Keep metrics only where they explain a specific proof point and are visibly grounded.

- **Risk:** The homepage and `/tools` page duplicate each other.  
  **Mitigation:** Make homepage cards curated and narrative; leave `/tools` as the broader catalog.

## Migration Plan

1. Update hero structure and copy.
2. Replace the homepage terminal/metrics panel with selected proof.
3. Simplify homepage section labels and metadata.
4. Tune featured work cards for reduced density.
5. Verify desktop and mobile visual hierarchy.

Rollback is a normal git revert of the homepage/component edits.

## Open Questions

- Exact final hero copy can be adjusted during implementation, but it must stay within the approved tone: serious, concrete, and plain-spoken.
- Final featured-work set should use existing artifact data and prioritize the strongest product proof available at implementation time.
