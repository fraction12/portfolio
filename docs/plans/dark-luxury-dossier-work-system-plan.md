---
title: Dark Luxury Dossier Work System Plan
type: feat
date: 2026-06-16
origin: docs/brainstorms/dark-luxury-dossier-work-system-requirements.md
---

# Dark Luxury Dossier Work System Plan

## Summary

Turn the work area into a dark luxury dossier system without changing the underlying project content.

The core product change is on `/tools`: project cards stop feeling like ordinary navigation tiles and become a dossier wall. Clicking a card opens a right-side flyout inspector on desktop, while keeping the grid visible. On mobile, the same inspector becomes a bottom sheet. Dedicated `/tools/[slug]` pages remain, but become the deliberate "full file" experience: a dossier/spec-sheet hybrid with proof as the loudest moment.

This plan is scoped to the work browsing surface, the work cards, the flyout inspector, the tool detail pages, and the motion system needed to support them.

## Problem Frame

The current work flow is too conventional for the intended brand direction:

- `/tools` renders a simple grid of cards that navigate directly to separate detail pages.
- `WorkGridCard` shows project visuals too plainly and behaves like a standard portfolio tile.
- `/tools/[slug]` reads like an editorial case-study page rather than an opened file.
- Motion exists, but it does not yet carry the "slide, lock, reveal, sharpen" language from the brainstorm.

The target feeling is not "more animation." It is a darker system of proof: black dossier cards, restrained silver discipline, one red-orange flame moment, and fast browsing that still feels premium.

## Requirements

R1. `/tools` must present projects as a dossier wall, not a generic card grid.

R2. Work cards must use partially concealed visuals: cropped strips, edge peeks, ghosted proof, or shuttered media rather than fully exposed screenshots by default.

R3. Work cards must keep sharp project identification: title, one-line thesis, status/proof metadata, and one restrained visual signal.

R4. Clicking a work card must open a right-side flyout inspector on desktop instead of immediately navigating away.

R5. The grid must remain visible while the flyout is open, with the selected dossier staying visually active and the rest of the grid slightly de-emphasized.

R6. The flyout must stay narrow-to-medium width and behave like a file inspector, not a modal, article panel, or inline reader.

R7. The flyout must include visual proof, a one-line thesis, 3-5 metadata facts when available, one proof/action link, and a clear "Open full file" link to `/tools/[slug]`.

R8. Selecting another card while the flyout is open must keep the flyout open and swap content internally with a shutter/slide animation.

R9. The flyout must become a bottom sheet on mobile, with equivalent content and clear close/open-full-file controls.

R10. `/tools/[slug]` pages must keep the same source content while being reorganized into a dossier/spec-sheet hybrid: hero statement, tight facts, proof surface, and short evidence sections.

R11. The proof visual must get the flame moment: one restrained red-orange reveal pass, then silence. No looping flame, no glowing border, no gamer treatment.

R12. The visual system must use black, charcoal, off-black, silver, and one red-orange accent with restraint.

R13. Literal metal textures, chrome gradients, rivets, carbon fibre, heavy bevels, cyberpunk panels, and "tech armor" styling are out of scope.

R14. Motion must feel mechanical and expensive: slide, lock, reveal, shutter, sharpen, settle. No bounce, confetti, or cute easing.

R15. All motion must honor `prefers-reduced-motion`.

R16. Existing `ToolDetail` data remains the source of truth. The implementation must avoid duplicating project copy across page components.

R17. No-JS fallback must still let users reach the full detail page through normal links.

R18. Keyboard users must be able to open the inspector, switch projects, close it, and open the full file.

## High-Level Technical Design

```mermaid
flowchart TB
  Details[toolDetails config] --> Presenters[work presentation helpers]
  Presenters --> ToolsPage[src/pages/tools.astro]
  Presenters --> DetailPage[src/pages/tools/[slug].astro]
  ToolsPage --> Card[WorkGridCard]
  ToolsPage --> Inspector[WorkInspector]
  Presenters --> Proof[ToolProofMedia]
  Proof --> Inspector
  Proof --> DetailPage
  Motion[src/scripts/portfolio-motion.ts] --> Card
  Motion --> Inspector
  Motion --> DetailPage
```

Use progressive enhancement:

- Cards keep real `href` values to `/tools/[slug]` for fallback and SEO.
- Client-side JS intercepts eligible card clicks on `/tools` and opens the inspector.
- The explicit "Open full file" action always navigates to the detail page.
- If JS fails, the work page still behaves as it does now.

Use shared presentation helpers:

- Derive card labels, flyout facts, proof media, and action links from `ToolDetail`.
- Keep the current data model intact unless a small helper type is needed.
- Prefer adding a helper module over scattering formatting logic through Astro pages.

Keep the implementation framework-light:

- Do not add a client UI framework for this.
- Use Astro-rendered markup plus the existing `portfolio-motion.ts` Motion.dev layer.
- Use component-scoped styles unless a token is genuinely shared across cards, flyout, and detail pages.

## Key Technical Decisions

KTD1. **Progressive Enhancement Over Route Replacement**  
Cards remain real links to detail pages. JS upgrades them into inspector triggers on `/tools`. This gives the desired experience without breaking no-JS behavior, crawlability, or expected link semantics.

KTD2. **Right-Side Inspector, Not Modal**  
The inspector sits beside the grid on desktop. It does not blur or cover the whole page. The selected card remains part of the scene so the interaction feels like browsing a file system.

KTD3. **No Default Open Inspector**  
The inspector opens only after a user selects a card. This keeps the initial dossier wall clean and avoids stealing attention or focus on page load.

KTD4. **Visible Page Scope For Pagination**  
The inspector only needs to support projects rendered on the current paginated page. Changing pagination can reset inspector state.

KTD5. **Single Content Source**  
`toolDetails` remains the source of truth for project detail content. Any flyout facts, proof links, or section labels should be derived through helper functions.

KTD6. **Shared Proof Media Rendering**  
Introduce a shared proof-media component or helper so flyout and detail pages use the same image/video/fallback behavior.

KTD7. **Motion Lives In The Existing Motion Script**  
Extend `src/scripts/portfolio-motion.ts` instead of creating a second motion runtime. Keep helper functions testable and cleanup-compatible with Astro page transitions.

KTD8. **Scoped Dark System First**  
Apply the dark dossier language to work cards, flyout, and detail pages first. Do not rewrite the homepage, writing pages, or global theme in this work.

## Implementation Units

### U1. Work Presentation Helpers

**Goal:** Centralize the derived project presentation data needed by cards, flyout, and detail pages.

**Files:**

- `src/config/tool-details.ts`
- `src/config/work-presentation.ts`
- `tests/config/work-presentation.test.ts`
- `tests/config/tool-details.test.ts`

**Work:**

- Add helper functions for card thesis, flyout facts, primary proof/action link, proof media, and full-file href.
- Keep helpers pure and testable.
- Prefer existing fields: `tagline`, `summary`, `categoryLabel`, `statusNote`, `artifact.stack`, `links`, `demo`, and `detailPath`.
- Do not invent fields like year or role unless the content model is explicitly extended.

**Test Scenarios:**

- Every `ToolDetail` returns a full-file href matching `detail.detailPath`.
- Every `ToolDetail` returns a flyout thesis from existing content.
- Details with demo media expose usable proof media metadata.
- Details without demo media return a stable fallback presentation.
- Flyout facts stay within the 3-5 fact target when enough source data exists.

### U2. Dossier Card Redesign

**Goal:** Make work cards feel like black dossier folders with metal discipline and partially concealed proof.

**Files:**

- `src/components/WorkGridCard.astro`
- `src/pages/tools.astro`
- `src/config/work-presentation.ts`

**Work:**

- Add data attributes needed by the inspector and motion layer, such as selected slug and card trigger metadata.
- Keep the card's anchor semantics intact for fallback navigation.
- Replace fully exposed media treatment with a concealed/peeked visual treatment.
- Add active/selected styling hooks.
- Tighten typography and metadata styling around the dossier direction.

**Verification Scenarios:**

- Card click still navigates to detail page when JS is unavailable.
- Card focus state is visible and professional.
- Selected card is visually distinct when inspector is open.
- Media does not stretch, crop incoherently, or shift card layout.

### U3. Right-Side Flyout Inspector

**Goal:** Add the in-page project inspector for `/tools`.

**Files:**

- `src/components/WorkInspector.astro`
- `src/components/ToolProofMedia.astro`
- `src/pages/tools.astro`
- `src/config/work-presentation.ts`
- `tests/scripts/work-inspector.test.ts`

**Work:**

- Render inspector markup on `/tools` using the current page's `visibleDetails`.
- Provide a panel per visible project or a data-backed rendering strategy that avoids duplicating source copy.
- Include proof media, thesis, facts, primary proof/action link, close button, and "Open full file."
- Add ARIA/state attributes for open state, selected project, active panel, and hidden panels.
- Ensure Escape and close button dismiss the inspector.
- Restore focus sensibly after close.

**Test Scenarios:**

- Clicking a card opens the inspector and marks that card selected.
- Closing the inspector removes selected state and returns focus.
- Pressing Escape closes the inspector.
- The active panel matches the selected slug.
- The "Open full file" link points to the selected project's detail path.

### U4. Inspector Swap And Motion Layer

**Goal:** Implement the right-side slide-in, internal content swap, selected-card sharpening, and proof reveal motion.

**Files:**

- `src/scripts/portfolio-motion.ts`
- `tests/scripts/portfolio-motion.test.ts`
- `tests/scripts/work-inspector.test.ts`

**Work:**

- Add initialization for work inspector triggers and panels.
- Animate first open as a right-side slide-in on desktop.
- Animate subsequent project changes as an internal shutter/slide swap.
- Add one proof reveal pass for the active media.
- Use instant state changes under `prefers-reduced-motion`.
- Register cleanup for Astro page transitions.

**Test Scenarios:**

- Reduced-motion mode applies final state without animation.
- Selecting a second card keeps inspector open and updates active panel.
- Cleanup removes listeners and stops in-flight animation controls.
- Motion selectors do not accidentally target homepage or unrelated cards.

### U5. Mobile Bottom Sheet Behavior

**Goal:** Make the same inspector experience work on narrow screens without becoming a cramped side drawer.

**Files:**

- `src/components/WorkInspector.astro`
- `src/scripts/portfolio-motion.ts`
- `src/pages/tools.astro`

**Work:**

- Use CSS breakpoints to turn the inspector into a bottom sheet.
- Keep the same content hierarchy as desktop.
- Ensure the close control remains reachable.
- Avoid body-scroll traps unless they are necessary and tested.

**Verification Scenarios:**

- On mobile width, selecting a card opens a bottom sheet, not an offscreen side panel.
- Sheet content is scrollable if needed.
- Close and "Open full file" are visible without awkward layout overlap.
- Keyboard focus does not disappear behind the sheet.

### U6. Tool Detail Page Dossier Redesign

**Goal:** Redesign `/tools/[slug]` pages as full project files while preserving source content.

**Files:**

- `src/pages/tools/[slug].astro`
- `src/components/ToolProofMedia.astro`
- `src/config/work-presentation.ts`
- `tests/config/tool-details.test.ts`

**Work:**

- Reframe the detail page around the dossier/spec-sheet hybrid:
  - giant project title
  - one-sentence thesis
  - tight facts rail
  - proof surface
  - short evidence sections
- Preserve existing content from `ToolDetail`: audience, problem, summary, sections, links, status, and demo media.
- Reuse the proof media rendering path from the inspector.
- Apply one restrained proof reveal moment.

**Test Scenarios:**

- `getStaticPaths` still emits one route per `ToolDetail`.
- Details without media do not render broken proof surfaces.
- All rendered sections have content.
- Detail links still use configured `ToolDetail.links`.

### U7. Visual Restraint And Final QA

**Goal:** Ensure the final result matches the dark luxury dossier direction without drifting into corny metal, cyberpunk, or SaaS modal language.

**Files:**

- `src/components/WorkGridCard.astro`
- `src/components/WorkInspector.astro`
- `src/pages/tools/[slug].astro`
- `src/styles/tokens.css`
- `src/styles/base.css`

**Work:**

- Keep new global token changes minimal.
- Prefer scoped CSS for dossier cards, inspector, and full-file pages.
- Add only the shared colors/tokens needed for black, silver, and flame accent consistency.
- Review screenshots at desktop and mobile sizes.

**Verification Scenarios:**

- No chrome gradients, rivets, carbon fibre, armor panels, or heavy bevels.
- Accent red-orange appears as a single controlled moment, not a repeated decoration.
- Cards, flyout, and detail page feel like one system.
- Text stays readable on mobile and does not overflow controls.

## Acceptance Examples

AE1. **Desktop Card Selection**  
Given a user is on `/tools` on desktop, when they click a work card, then the page does not navigate, the flyout slides in from the right, the grid remains visible, and the selected card becomes active.

AE2. **Desktop Project Switching**  
Given the flyout is open, when the user clicks another card, then the flyout stays open and the content swaps internally with a shutter/slide motion.

AE3. **Explicit Full File Navigation**  
Given a project is selected in the flyout, when the user clicks "Open full file," then they navigate to that project's `/tools/[slug]` page.

AE4. **No-JS Fallback**  
Given JavaScript is unavailable, when the user clicks a work card, then the browser navigates to the corresponding `/tools/[slug]` page.

AE5. **Mobile Inspector**  
Given a user is on a mobile viewport, when they click a work card, then the preview opens as a bottom sheet with proof, facts, action, close, and open-full-file controls.

AE6. **Reduced Motion**  
Given reduced motion is enabled, when the user opens or switches the inspector, then the state changes without shutter, slide, flame, or animated reveal effects.

AE7. **Detail Page Proof Moment**  
Given a user opens a full-file detail page, then the page presents a dossier/spec-sheet layout and the proof surface receives at most one restrained flame reveal pass.

## Scope Boundaries

**In Scope:**

- `/tools` work browsing experience
- `WorkGridCard` visual and interaction redesign
- right-side desktop flyout inspector
- mobile bottom-sheet inspector
- `/tools/[slug]` detail page redesign
- Motion.dev behavior for cards, inspector, swap, and proof reveal
- focused unit tests for presentation helpers and inspector motion behavior

**Deferred:**

- homepage dark visual system
- full copy rewrite across all project content
- new screenshot/video asset production
- GitHub heatmap redesign
- Vercel/live-data changes
- global site theme replacement
- browser screenshot automation unless added separately

**Explicitly Out Of Scope:**

- inline project reader
- full-page modal overlay
- Apple clone scrollytelling
- cyberpunk dashboard treatment
- literal metal texture pack
- looping flame effects

## Risks And Dependencies

- **Astro without a client framework:** Keep the inspector as server-rendered markup plus a small TS behavior layer. Avoid adding React/Svelte just for this.
- **Inconsistent media coverage:** Some projects may not have demo media. The proof media component needs a tasteful fallback.
- **Accessibility:** Custom inspector behavior needs keyboard support, focus management, close affordances, and reduced-motion behavior.
- **Pagination:** The first pass should keep inspector state scoped to the current `visibleDetails` page.
- **Visual taste risk:** Dark, silver, and flame can turn cheesy fast. The final pass needs screenshot review against the "luxury dossier with metal discipline" rule.
- **Existing dirty files:** `src/data/snapshots/pypi.json` and `src/data/snapshots/substack.json` may be modified independently and should not be touched by this work unless explicitly requested.

## Verification Plan

Run code checks:

```bash
npm run typecheck
npm test
npm run build
```

Run browser QA:

- `/tools` desktop: card hover, card click, selected state, flyout open, flyout close, second-card swap.
- `/tools` mobile: bottom sheet open, close, content scroll, full-file link.
- `/tools/[slug]` with media: proof surface, facts, sections, links.
- `/tools/[slug]` without rich media: fallback proof treatment and no broken layout.
- Keyboard: Tab to cards, Enter/Space behavior where applicable, Escape closes inspector, focus returns.
- Reduced motion: no slide/shutter/flame animation, but all states still work.

## Sources

- `docs/brainstorms/dark-luxury-dossier-work-system-requirements.md`
- `src/pages/tools.astro`
- `src/components/WorkGridCard.astro`
- `src/pages/tools/[slug].astro`
- `src/config/tool-details.ts`
- `src/scripts/portfolio-motion.ts`
- `tests/scripts/portfolio-motion.test.ts`
- `tests/config/tool-details.test.ts`
