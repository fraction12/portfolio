## Context

The current portfolio is an Astro site with reusable components for navigation, hero, page headers, section headers, cards, writing rows, newsletter/contact surfaces, tools catalog cards, and a Jarvis page. A previous cleanup removed the loudest homepage elements, but the broader site still carries an agent-cockpit identity: mono labels, slash punctuation, status pills, command/install blocks, category blurbs, dashboard metrics, and repeated proof surfaces.

The chosen direction is Option A: a quiet founder index. The target reader should understand within 10 seconds that Dushyant is a serious Product Manager / Builder with startup-caliber taste, product judgment, and hands-on shipping ability. This should feel closer to a composed founder/operator personal site than a generic PM case-study portfolio or a playful agent dashboard.

External patterns and research considered during discovery:

- Patrick Collison: dense but calm personal index, clear taxonomy, minimal ornamentation.
- Sam Altman: sparse writing-first credibility, plain text, low interface theatrics.
- Andy Matuschak and Bret Victor: personal systems can be distinctive without behaving like a marketing template.
- PM portfolio guidance: credible product portfolios need context, decisions, and outcomes, not just visuals or slogans.
- Stanford Web Credibility: credibility depends heavily on professional, purpose-appropriate visual design, clear contact information, usefulness, restraint in promotional content, and avoiding small errors.
- Nielsen Norman Group: every extra unit of irrelevant information competes with relevant information; visual hierarchy should use scale, contrast, balance, and a limited set of type sizes to guide the eye.
- GOV.UK design principles: start with user needs, do less, do the hard work to make it simple, design for everyone, and be consistent without becoming uniform.
- WCAG 2.2: visible focus, unobscured focus, sufficient target sizes, contrast, and predictable navigation are part of the quality bar, not optional polish.

Research sources:

- Patrick Collison: https://patrickcollison.com/
- Sam Altman: https://blog.samaltman.com/
- Andy Matuschak: https://andymatuschak.org/
- Bret Victor: https://worrydream.com/
- Stanford Web Credibility Guidelines: https://credibility.stanford.edu/guidelines/
- Nielsen Norman Group usability heuristics: https://www.nngroup.com/articles/ten-usability-heuristics/
- Nielsen Norman Group visual design principles: https://www.nngroup.com/articles/principles-visual-design/
- GOV.UK Design Principles: https://www.gov.uk/guidance/government-design-principles
- W3C WCAG 2.2 summary: https://www.w3.org/WAI/standards-guidelines/wcag/new-in-22/

## Research Synthesis For Option A

The research does not point toward a more dramatic website. It points toward a more edited one.

```text
Credibility comes from:

professional visual design
clear information architecture
real person / easy contact
useful evidence
restraint with promotion
few errors
consistent interactions
accessible reading and navigation
```

For this portfolio, that means the redesign should avoid the common AI-builder failure mode: proving capability by showing too many systems at once. The site should instead act like a calm index of judgment. Patrick Collison and Bret Victor show that dense archives can feel credible when taxonomy is clear. Sam Altman shows that plain writing and directness can carry authority without interface theater. Andy Matuschak shows that an independent body of work can be unusual while still being organized.

Implementation implication: the redesign should not chase novelty in chrome. It should make the work, hierarchy, and copy feel inevitable.

## Goals / Non-Goals

**Goals:**

- Redesign every public surface so it follows one coherent design system and copy system.
- Make the first impression serious, direct, and founder-grade.
- Remove redundant content on each page; each claim or proof point gets one home.
- Remove Jarvis as a public first-class page.
- Preserve useful existing routes: homepage, tools, writing, machine-readable summary.
- Keep the site distinctive through editorial restraint, specific project curation, and high-quality execution.
- Make implementation reviewable by grouping changes into design system, page structure, copy, removal, and verification tasks.

**Non-Goals:**

- Do not turn the site into a traditional resume page.
- Do not add fake metrics, exaggerated funding/startup claims, or logos that are not already authorized.
- Do not invent case-study detail that is not supported by existing work.
- Do not add a CMS, animation library, component library, or heavy design dependency.
- Do not complete the unrelated `add-tool-detail-pages` change as part of this redesign.
- Do not preserve the Jarvis page just because the source content exists.

## Redesign Principle

The site should behave like an edited index of judgment.

```text
Before: many things proving activity

hero claim
selected proof
selected work
tools catalog
metrics
install commands
writing
newsletter
Jarvis
status cues

After: few things proving judgment

identity
selected work
tools catalog as archive
writing
contact
```

Every component should pass this test: "Does this help a serious reader trust the person faster?" If not, remove it, simplify it, or move it deeper.

## Locked Implementation Defaults

These defaults are locked so implementation does not wander.

- Public nav label is **Work**, backed by the existing `/tools` route for URL compatibility.
- Public nav is: brand/home link, Work, Writing, Contact. Do not include Home or Jarvis as separate nav items.
- `/jarvis` is removed as a public page. Prefer deleting the route or rendering a normal not-found response. Do not redirect `/jarvis` to `/tools` in the final implementation because that keeps Jarvis alive as a public concept.
- Default theme is light-first editorial. Dark mode may remain as a restrained secondary mode, but it must not be the public default and must not keep cockpit/grid/glow language.
- Homepage selected work appears once. Do not keep both `SelectedProof` and a second selected-work list if they contain the same projects.
- Install commands, registry metrics, private/dev status labels, and category taxonomy do not appear on the homepage.
- No new visual dependency should be added unless it removes real complexity and survives review.

## First-10-Second Test

The homepage passes only if a fresh reader can answer these questions from the first viewport:

1. Who is this? Dushyant Garg.
2. What is the role? Product Manager / Builder.
3. What kind of work does he do? Practical AI products and product systems.
4. Why should I believe the quality bar is high? The layout, copy, and selected work feel edited, specific, and professionally composed.
5. Where do I go next? Work, Writing, or Contact.

Failure conditions:

- The reader sees more than one competing proof surface in the first viewport.
- The page looks like a dashboard, terminal, agent cockpit, or novelty AI demo.
- The hero uses vague slogans without concrete product/workflow context.
- The primary action area asks the reader to parse too many links, labels, or badges.

## Information Architecture

### Public routes

- `/`: edited index. Identity, selected work, writing/thinking, contact.
- `/tools`: broader build catalog. Label as **Work** in public navigation; useful for technical depth, not the homepage's proof engine.
- `/writing`: essays and notes. Evidence of thinking, not a second homepage.
- `/llms.txt`: machine-readable summary updated to match the new public site.

### Removed route

- `/jarvis`: removed from navigation and public positioning. Final implementation should delete the page or return a normal not-found response. Redirecting to `/tools` is only allowed as a temporary migration fallback and should not be the final state.

### Global navigation

Recommended links:

```text
Dushyant Garg     Work     Writing     Contact
```

Notes:

- "Work" is the public label for `/tools`.
- "Home" is redundant when the brand links home.
- "Jarvis" is removed.
- Theme toggle should be visually quiet. If retained, make it an icon or compact control that does not compete with navigation.

## Page Plans

### Homepage

Purpose: first impression and edited proof.

Recommended structure:

```text
Identity
  Dushyant Garg
  Product Manager / Builder
  I build practical AI products and product systems.
  One supporting paragraph about ambiguous workflows, real users, and shipped products.

Selected Work
  3-4 entries, no repeated descriptions later on the same page
  Each entry: name, one-line product context, role/type, link

Writing
  2-3 recent essays, compact

Contact
  One clear prompt
```

Remove from homepage:

- right-column "selected proof" panel if the same projects are also listed below
- duplicate selected work sections
- install commands
- package metrics
- fake status labels
- broad catalog counts
- repeated social/contact links beyond one compact row or footer

Quality constraints:

- One primary headline, one role line, one supporting paragraph.
- One restrained profile portrait may sit beside the identity block to make the page feel more human and credible.
- No first-viewport card wall.
- No numbered section rail unless it demonstrably improves scanning.
- No decorative cursor, terminal prompt, grid overlay, fake status pill, or glow-heavy hover treatment.
- Primary selected work should appear within the first scroll, but not compete with the identity block.

### Tools / Work Page

Purpose: deeper catalog for people who want breadth.

Recommended changes:

- Rename page framing from "Tools // for agents" to "Work".
- Use category taxonomy only if it improves scanning; otherwise group into "Products", "Open-source systems", "Experiments".
- Convert cards from command-heavy tool cards to editorial build rows.
- Keep install commands only behind a lower-emphasis detail row or external GitHub link.
- Metrics appear only when they are real and useful. Avoid using private/dev labels as decorative badges.
- Do not repeat the exact homepage descriptions. The catalog should add a different layer: what it is, who it is for, and where to inspect it.

### Writing Page

Purpose: show judgment and taste through thinking.

Recommended changes:

- Rename heading from "Writing // from the stack" to "Writing".
- Page lede should be one sentence.
- Essay list should be quiet: title, date, read time, link behavior.
- Subscription prompt should appear once, likely below the list, with a different job than the page lede.
- Remove repeated Substack explanation if the link label already says Substack.

### Contact / Footer

Purpose: give a clear next action without shouting.

Recommended changes:

- Keep one email or contact prompt.
- Footer should be sparse: copyright, GitHub, LinkedIn, Substack, llms.txt if useful.
- Do not repeat the same contact links in hero, contact section, and footer on the homepage. Pick one primary contact surface plus global footer.

### Jarvis

Purpose: remove from public portfolio.

Recommended changes:

- Remove nav entry.
- Remove or de-route `src/pages/jarvis.astro`.
- Remove Jarvis-specific components from the public dependency path if unused.
- Audit `llms.txt`, metadata, schema, internal links, tests, and snapshots for public Jarvis references.
- Keep source content only if it remains useful as private/archive material and does not ship publicly.

## Design System Direction

### Color

Move from "Signal Desk" to "Quiet Index."

Recommended palette model:

- Background: off-white editorial canvas for the default public impression; dark mode may use near-black charcoal, but must feel editorial rather than terminal-like.
- Text: high-contrast primary, softer secondary, muted tertiary.
- Accent: one restrained warm accent for links and focus states only.
- Borders: subtle neutral lines, no glow-heavy hover treatment.
- Status colors: avoid on main marketing surfaces; use only when a real status needs to be communicated.

Design constraints:

- No gradient orbs, decorative bokeh, heavy glows, or multi-color status vocabulary.
- No page-wide grid overlay.
- No dominant one-note palette. The site may be quiet, but it should not be beige mush or all-slate darkness.
- Links and focus states should use the same accent family.
- Hover effects should be border/text changes, not floating-dashboard theatrics.

### Typography

- Display: use current readable display font or replace only if implementation shows a strong reason.
- Mono: reserved for small technical metadata only, not page personality.
- Titles: calm, large enough for hierarchy, no oversized hero theatrics.
- Body: generous line height, high readability.
- Labels: plain text, no slash suffixes, no fake command syntax.
- Each surface should use no more than three obvious type sizes unless a specific page-level hierarchy requires more.
- Do not scale type directly with viewport width in a way that makes text unpredictable.

### Layout

- Use one max-width container system instead of page-specific width guesses.
- Prefer editorial rows and simple bordered sections over nested cards.
- Cards should be limited to repeated items. No card-inside-card patterns.
- Homepage should read in a single vertical rhythm: identity, selected work, writing, contact.
- Mobile should stack naturally with stable spacing and no text overflow.
- Use stable responsive constraints for repeated cards/rows so hover, focus, metrics, or wrapping text cannot shift layout.
- Prefer fewer, stronger sections over many labeled bands.

### Components

- `Nav`: simplify labels, remove Jarvis, reduce theme-toggle noise.
- `Hero`: become identity block, not a pitch deck.
- `SelectedProof`: remove or merge into homepage selected work to avoid duplication.
- `ToolCard`: redesign into `BuildCard` or adapt into quiet editorial rows.
- `SectionHead`: remove numbered/sidebar treatment if it makes the site feel like a dashboard. Use simple section titles.
- `PageHeader`: remove italic signal substitution and decorative punctuation.
- `WritingRow`: keep compact but align with new typography and hover behavior.
- `NewsletterSignup` / `Contact`: ensure one concise job per page.
- `Footer`: sparse global utility.

## Accessibility And Interaction Quality Bar

- Meet WCAG 2.2 AA intent for contrast, keyboard focus visibility, focus not being obscured, predictable navigation, and pointer target sizing.
- Every interactive element must have a visible focus style that is not color-only.
- Link text must describe the destination or action without relying on surrounding decoration.
- Mobile tap targets should be at least 24px by 24px, with spacing that prevents accidental taps.
- The site must remain understandable with motion reduced.
- Theme changes must not cause a flash that undermines the production feel.
- The implementation must check desktop and mobile screenshots for overlap, text clipping, awkward wrapping, accidental nested cards, and blank/empty surfaces.

## Copy System

### Voice

Serious, direct, and specific. The site should sound like a product-minded founder/operator, not a portfolio template and not an AI hacker dashboard.

### Copy rules

- No "live public proof."
- No fake-live, cron, cockpit, dispatch, signal desk, or status theater on public portfolio surfaces.
- No repeated claim in two components on the same page.
- No generic PM filler like "cross-functional stakeholder alignment" unless tied to a concrete work example.
- Prefer "builds", "work", "writing", "contact" over "tools", "dispatches", "systems", or "selected proof" when the latter adds noise.
- Project descriptions should be one sentence and do one job.
- Do not mention Series A, funding, or multi-million-dollar environments unless backed by a truthful, specific public work example. Signal that quality through polish and product judgment, not unverifiable claims.
- Prefer short nouns and verbs: build, ship, work, write, contact, product, workflow, customer, evidence.

### Possible homepage copy direction

```text
Dushyant Garg
Product Manager / Builder

I build practical AI products and product systems.

I work close to the messy part of new ideas: unclear workflows, fast-moving teams,
and users who need useful software more than impressive demos.
```

This is a direction, not final copy. Final implementation should tune the words against available project evidence.

## Implementation Anti-Wandering Rules

If an implementation agent is unsure, it should choose the quieter option.

Do:

- Use plain section names: Work, Writing, Contact.
- Use the profile image only as an identity cue in the hero.
- Use one selected-work component on the homepage.
- Use editorial rows or simple cards with low border contrast.
- Use real links and real facts.
- Preserve existing data loading only where it supports the quieter presentation.

Do not:

- Reintroduce dashboard panels, terminal prompts, animated cursors, "live" labels, status dots, slash-suffix headings, fake metrics, or glowing cards.
- Duplicate the same project description in multiple homepage components.
- Place the profile image in nav, footer, project cards, or repeated surfaces.
- Add icons or visual flourishes just to make the site feel designed.
- Turn `/tools` into a package-manager page in the first screen.
- Keep Jarvis visible because the old content is fun.

## Redundancy Rule

Each page gets an information budget.

```text
One fact, one home.

Allowed repetition:
- route names in nav/footer
- project names when linking to deeper pages
- the person name in global identity/metadata

Not allowed:
- the same project description in hero and card
- the same newsletter value proposition in header and form
- the same social links in hero, contact, and footer on one page
- status/metric language repeated as badges and footers
```

Implementation should include a manual copy audit per page before completion.

## Decisions

### Decision: Redesign As System, Not Page Patch

The change should update tokens, shared components, and page structures together. A page-only update would leave the site feeling like old components wearing new copy.

Alternatives considered:

- Only redesign homepage: faster, but the user explicitly wants all labels, cards, and text aligned.
- Start from a new app: cleaner blank slate, but unnecessary risk because the current Astro site and data loading are usable.

### Decision: Remove Jarvis From Public Site

Jarvis is interesting, but it pulls the portfolio back into agent-dashboard performance. Removing it makes the site more serious and focused.

Alternatives considered:

- Keep Jarvis as a nav item: distinctive, but off-strategy.
- Hide Jarvis under tools: still creates a page-level concept the reader must interpret.
- Keep content only in repo/archive: acceptable if it does not ship publicly.

### Decision: Use Work Label For Existing Tools Route

The public navigation should say Work while preserving `/tools` for compatibility. This removes generic tool-catalog framing without creating route churn.

Alternatives considered:

- Rename the route to `/work`: cleaner, but creates redirect and link migration work that does not improve the first impression enough.
- Keep the Tools label: technically accurate, but too narrow and too close to the old catalog-first mental model.

### Decision: Use Light-First Editorial Presentation

The default impression is light-first editorial, with dark mode retained only if it feels equally restrained. This is the strongest break from the old dashboard mood and better matches the quiet founder-index direction.

Alternatives considered:

- Keep dark-first: preserves current vibe, but risks retaining cockpit associations.
- Remove theme control entirely: clean, but unnecessary if the toggle can be quiet and accessible.

### Decision: Keep Tools, But Reframe

The work catalog is useful proof of builder range. It should remain, but as an editorial catalog rather than a command/install dashboard.

Alternatives considered:

- Delete `/tools`: clean but discards real builder evidence.
- Keep current tool cards: preserves data, but conflicts with Option A.

### Decision: Use Restraint As The Distinctive Move

The site will stand out by being unusually edited for an AI builder portfolio. The weirdness should be in the work and taste, not UI theatrics.

Alternatives considered:

- Interactive lab concept: memorable but too close to the noise problem.
- Generic PM case-study template: credible but forgettable and not aligned with the user's builder identity.

## Risks / Trade-offs

- Removing too much personality -> Preserve specificity in project choices, copy, and details.
- Site becomes too plain -> Use strong spacing, type, and a few sharp content decisions instead of decoration.
- Jarvis removal breaks links -> Choose route strategy deliberately and audit internal references.
- Tools page loses technical utility -> Keep GitHub/external links and real metrics, but lower their visual dominance.
- Redundancy rule becomes too strict -> Exempt functional navigation and metadata; target repeated proof copy, not usability.
- Copy overclaims startup experience -> Signal startup-caliber quality through polish and concrete work, not unverifiable claims.
- Light-first direction loses the existing technical mood -> Keep specificity in the work and allow a restrained dark mode, but do not keep terminal styling.

## Migration Plan

1. Freeze the design target and route strategy through this OpenSpec change.
2. Audit current public copy and components against the redundancy rule.
3. Update design tokens and global layout.
4. Rebuild shared components.
5. Rework homepage.
6. Rework tools/work catalog.
7. Rework writing/contact/footer.
8. Remove Jarvis from public routing and references.
9. Run tests/build/OpenSpec validation.
10. Inspect locally in desktop and mobile browser.
11. Run manual copy audit for repeated claims and noisy labels.

Rollback is a normal git revert of the redesign commit. If route removal creates an unexpected production issue, temporarily redirect `/jarvis` to `/tools` only as a short-lived migration fallback while preserving removal from navigation and public copy.

## Implementation Readiness

- No blocking product/design questions remain for implementation. The defaults above should be treated as the approved direction unless the user explicitly changes them.
