# Dark Luxury Dossier Work System Requirements

Date: 2026-06-16

## Thesis

The portfolio work experience should feel like a dark luxury dossier system for a builder/operator.

Not a portfolio grid. Not a case-study blog. The site should feel like someone opened a black metal case and laid out proof: quiet, expensive, severe, and confident. The energy is Versace Eros Flame, Marlboro Lights, dark French roast coffee, Rick Owens, and Midnight Studios translated into a product interface.

The work should feel like evidence, not content marketing.

## Goals

- Make the work page feel like a high-status dossier wall instead of a generic project grid.
- Let users inspect projects without immediately leaving the work page.
- Preserve full detail pages, but make them feel deliberate: full files for people who want the receipts.
- Keep all existing project content, but reframe it with sharper hierarchy, motion, and presentation.
- Use Motion.dev for restrained, premium transitions and reveals.

## Non-Goals

- Do not build another inline article reader.
- Do not clone Apple scrollytelling.
- Do not use cyberpunk, gamer, Terminator, carbon-fibre, chrome, rivet, armor, or heavy-metal visual tropes.
- Do not use looping flames, smoke effects, decorative glow spam, or novelty texture work.
- Do not make the flyout a modal that hides the work grid.

## Visual Direction

The visual world is dark luxury operator:

- mostly black, charcoal, off-black, and muted silver
- one red-orange flame accent, used rarely
- sharp borders and thin silver rules
- restrained spec-label typography
- subtle edge highlights
- black paper in a steel filing system, not literal metal panels
- less rounded softness, more severe editorial structure

Metal should be an attitude, not a texture.

Avoid:

- chrome gradients
- rivets
- carbon fibre
- heavy bevels
- tech armor panels
- glossy gaming-PC surfaces
- generic SaaS cards

## Work Cards

Work cards should feel like luxury dossier folders with metal discipline.

Default state:

- dark restrained surface
- project title
- sharp one-line thesis
- status/proof metadata
- partially concealed visual evidence
- subtle silver structure

Visual treatment:

- project visuals are partially concealed, not fully exposed by default
- the card may show a cropped strip, edge peek, ghosted preview, or tucked evidence layer
- the work page should not scream "look at my screenshots"
- evidence should feel stored inside the file until the user engages

Hover/focus state:

- dossier sharpens
- edge catches light
- visual preview slips or shutters open slightly
- one restrained ember/flame accent may appear
- no bounce, no cute motion

Selected state:

- selected dossier remains visibly active
- surrounding grid stays visible but can be slightly de-emphasized
- selected state should feel precise, not noisy

## Work Page Interaction

Clicking a work card should keep the user on the work page and open a right-side flyout inspector.

The work page becomes a browsing surface. The detail page becomes the deliberate "full file" step.

Flyout behaviour:

- first card click opens the flyout from the right
- grid remains visible
- selected card stays sharp
- flyout is narrow-to-medium, not a full article page
- flyout contains preview-level evidence only
- mobile version becomes a bottom sheet

Flyout contents:

- larger visual proof surface
- one-line project thesis
- 3-5 metadata facts
- one proof/action link when available
- clear "Open full file" action for the full detail page

Clicking another card:

- flyout stays open
- selected card state moves to the new dossier
- flyout content swaps internally with a small shutter/slide animation
- do not close and reopen the full flyout

## Detail Pages

Tool detail pages should become dossier/spec sheet hybrids.

They should feel like opening the full file, not reading a blog post.

Structure:

- massive project name
- one sentence that punches
- side rail or tight metadata block with role, stack, status, year, and proof links
- main proof surface treated like evidence
- short labelled sections

Preferred sections:

- Problem
- Built
- Proof
- Why it mattered

Copy rule:

No polite case-study fluff. No paragraphs trying to sound thoughtful. Short blocks. Receipts.

Tone:

- "Here is what was broken."
- "Here is what I built."
- "Here is the proof."
- "Here is why it mattered."

## Motion Direction

Motion should feel mechanical, expensive, and decisive.

Use:

- slide
- lock
- reveal
- sharpen
- shutter
- settle

Avoid:

- bounce
- playful easing
- confetti
- looping decorative motion
- generic fade-only page dressing

Every page should have at most one flame moment. The accent should be loud once, then quiet.

## Flame Moment

The heat belongs to the evidence.

On project detail pages and flyout previews, the proof surface gets the flame reveal:

- proof visual reveals with a shutter/slide motion
- one thin red-orange edge or glow passes across it
- the accent immediately dies down
- the page returns to dark, serious restraint

No looping flame. No glowing gamer border. One confident strike, then silence.

## Responsive Behaviour

Desktop:

- work grid remains visible
- flyout slides in from the right
- selected card remains active
- user can browse projects quickly by clicking cards

Mobile:

- flyout becomes a bottom sheet
- selected project still feels like a dossier
- preview remains brief
- "Open full file" remains the path to the complete page

## Success Criteria

- Work browsing no longer feels like being kicked to another page.
- The work page feels like a dossier wall with inspectable evidence.
- The flyout feels like a file inspector, not a modal and not an inline article.
- Detail pages feel like full project files, not generic case studies.
- Visual treatment remains polished, dark, and serious without becoming sci-fi or gamer-coded.
- Motion feels premium and controlled, with one flame moment per relevant surface.

## Open Questions

- Which project metadata fields are most important in the flyout: role, stack, status, year, proof, impact, or type?
- Should the work page open with a default selected project on desktop, or only open the inspector after user action?
- Which existing project visuals are strong enough for the concealed-preview treatment, and which need replacement or cropping?
