## ADDED Requirements

### Requirement: Quiet Founder Index Positioning
The portfolio SHALL present Dushyant Garg as a serious Product Manager / Builder who ships practical AI products and product systems in startup-caliber environments.

#### Scenario: First viewport communicates the positioning
- **WHEN** a reader lands on the homepage
- **THEN** the first viewport presents Dushyant's name, role, concise positioning, and a small set of high-signal paths without dashboard, terminal, fake-live, or performative status language

#### Scenario: Startup-caliber credibility is implied through restraint
- **WHEN** homepage copy and visuals describe Dushyant's experience and work
- **THEN** they use specific product language, selected evidence, and calm hierarchy instead of exaggerated claims, novelty labels, or decorative proof badges

#### Scenario: First ten seconds are decisive
- **WHEN** a first-time reader scans the homepage for no more than ten seconds
- **THEN** they can identify who Dushyant is, what kind of product work he does, why the quality bar feels serious, and where to go next

### Requirement: Research-Backed Credibility Guardrails
The portfolio SHALL apply external credibility and usability research as implementation guardrails for the redesign.

#### Scenario: Visual design supports credibility
- **WHEN** public pages render
- **THEN** layout, typography, consistency, contact access, useful evidence, restrained promotional copy, and error-free presentation support credibility rather than novelty

#### Scenario: Minimalism is operational
- **WHEN** a component includes labels, metadata, decorative styling, hover treatment, or repeated copy
- **THEN** irrelevant units are removed because they compete with the information that matters

### Requirement: Cohesive Design System
The portfolio SHALL use one cohesive design system across all public pages, including shared color tokens, type roles, spacing, borders, card treatments, button treatments, and page layout rules.

#### Scenario: Shared components feel consistent
- **WHEN** a reader moves between the homepage, tools page, and writing page
- **THEN** navigation, page headers, section headers, cards, links, CTAs, and footer treatments follow the same visual language and interaction model

#### Scenario: Color system is restrained
- **WHEN** the site renders in dark or light mode
- **THEN** the palette uses neutral surfaces, readable text contrast, and a limited accent role without one-note gradients, decorative orbs, or competing status colors

#### Scenario: Typography supports hierarchy
- **WHEN** headings, prose, metadata, buttons, and labels appear on any public page
- **THEN** each uses a defined type role with consistent sizing, weight, line height, and spacing appropriate to its content density

#### Scenario: Public default feels editorial
- **WHEN** the site renders with its default theme
- **THEN** it presents a light-first or otherwise editorial canvas without terminal, dashboard, grid-overlay, glow-heavy, or agent-cockpit styling

#### Scenario: Dark mode remains restrained
- **WHEN** the site renders in dark mode
- **THEN** it keeps the same editorial hierarchy and does not reintroduce terminal/cockpit visual language

### Requirement: Redundancy Budget
Each public page SHALL avoid repeating the same piece of information in multiple surfaces on the same page.

#### Scenario: Project proof appears once per page
- **WHEN** a project appears on a page
- **THEN** its primary description, status, metric, and core claim appear in one intentional location on that page, with any secondary link using shorter navigational text rather than repeating the same proof

#### Scenario: Page claims are not duplicated
- **WHEN** the homepage states the primary positioning claim
- **THEN** later homepage sections do not restate the same claim with different words and instead add new evidence, context, or navigation

#### Scenario: Navigation and footer exemptions stay functional
- **WHEN** global navigation or footer links repeat a route, name, or social destination
- **THEN** the repetition is allowed only as navigation, not as duplicated proof copy or repeated explanation

### Requirement: Full-Site Copy Rewrite
The portfolio SHALL rewrite public labels and body copy into serious, plain-spoken, product-oriented language aligned with the quiet founder index direction.

#### Scenario: Labels lose decorative suffixes
- **WHEN** section labels, page kickers, category names, and CTAs are rendered
- **THEN** they avoid decorative punctuation, faux command syntax, jokey suffixes, and status theater

#### Scenario: Copy remains specific
- **WHEN** project, writing, contact, or page copy describes Dushyant's work
- **THEN** it names concrete product work, practical AI systems, user/customer context, or builder judgment without generic PM portfolio filler

### Requirement: Homepage As Edited Index
The homepage SHALL act as an edited index, not a catalog or dashboard.

#### Scenario: Homepage has limited primary sections
- **WHEN** the homepage renders
- **THEN** it presents only the essential sections needed for first-impression credibility: identity, selected work, writing/thinking, and contact or next action

#### Scenario: Homepage does not duplicate the tools catalog
- **WHEN** selected work appears on the homepage
- **THEN** it shows a curated subset with concise context and links onward rather than reproducing the full tools catalog, install commands, or category taxonomy

#### Scenario: Homepage uses one selected work surface
- **WHEN** homepage projects are rendered
- **THEN** the page uses one selected-work surface and does not also render a separate selected-proof panel with the same projects

#### Scenario: Homepage includes a restrained identity portrait
- **WHEN** the homepage hero renders
- **THEN** it MAY include one locally hosted profile image near the identity block, sized and styled as a quiet credibility cue rather than a decorative card or oversized headshot

### Requirement: Public Navigation
The portfolio SHALL use a minimal public navigation model aligned with the quiet founder index direction.

#### Scenario: Navigation is minimal
- **WHEN** the public navigation renders
- **THEN** it shows the brand/home link plus Work, Writing, and Contact without separate Home or Jarvis links

#### Scenario: Work label preserves route compatibility
- **WHEN** a reader selects Work
- **THEN** they navigate to the existing `/tools` route or a compatible route strategy without seeing the old "Tools for agents" framing

### Requirement: Tools Page As Catalog With Editorial Discipline
The `/tools` page SHALL remain available as a broader catalog of shipped and experimental work while using the same quiet founder index design language.

#### Scenario: Catalog is scannable without noise
- **WHEN** a reader opens `/tools`
- **THEN** artifact categories, cards, metadata, metrics, and external links are organized for scanning without repeated descriptions, excessive tags, command-line styling, or fake status cues

#### Scenario: Metrics are truthful and useful
- **WHEN** package metrics or project status appear on `/tools`
- **THEN** they are truthful, sourced by existing data, and presented as supporting context rather than the primary credibility signal

### Requirement: Writing Page Supports Judgment
The `/writing` page SHALL present essays as evidence of thinking and judgment without duplicating homepage or newsletter copy.

#### Scenario: Writing list is clean and editorial
- **WHEN** essays render on `/writing`
- **THEN** each row or card presents title, date, reading time, and a single outbound action without repeated Substack explanations

#### Scenario: Subscription prompt is not redundant
- **WHEN** a subscription or contact prompt appears on `/writing`
- **THEN** it uses a single concise prompt and does not repeat the same value proposition already stated in the page header

### Requirement: Jarvis Public Page Removal
The portfolio SHALL remove Jarvis as a public first-class page.

#### Scenario: Jarvis is not in public navigation
- **WHEN** the navigation or footer renders
- **THEN** no public link to `/jarvis` is shown

#### Scenario: Jarvis route no longer presents a portfolio page
- **WHEN** a reader requests `/jarvis`
- **THEN** the site does not render the previous Jarvis marketing/dispatch page and returns normal not-found behavior unless a temporary migration fallback is explicitly documented

#### Scenario: Removed Jarvis references are audited
- **WHEN** public metadata, machine-readable summaries, sitemap-like outputs, or internal links are reviewed
- **THEN** they no longer describe Jarvis as a public portfolio destination

### Requirement: Production-Quality Responsive Polish
The redesigned site SHALL be visually stable, legible, and coherent on mobile and desktop.

#### Scenario: Mobile layout remains calm
- **WHEN** the site renders at mobile widths
- **THEN** text fits its containers, cards do not create nested-card clutter, navigation remains usable, and section spacing preserves hierarchy

#### Scenario: Desktop layout uses whitespace intentionally
- **WHEN** the site renders at desktop widths
- **THEN** content width, columns, section rhythm, and card density feel deliberate rather than sparse by accident or crowded by metadata

#### Scenario: Motion is restrained
- **WHEN** hover, focus, theme, or page-transition interactions occur
- **THEN** motion is subtle, accessible, and supportive of orientation rather than decorative spectacle

#### Scenario: Keyboard and touch interaction are production quality
- **WHEN** a reader navigates with keyboard, pointer, or touch
- **THEN** interactive elements have visible focus states, unobscured focus, predictable hover/focus behavior, and touch targets sized and spaced to avoid accidental activation

#### Scenario: Contact action remains simple
- **WHEN** a reader reaches the contact section
- **THEN** the primary contact action MAY use a `mailto:` link
- **AND** the plain email address SHALL remain visible as a fallback for browsers that do not open a mail handler

#### Scenario: Visual QA covers real breakpoints
- **WHEN** implementation is complete
- **THEN** homepage, Work, Writing, and removed Jarvis behavior are inspected in local browser at desktop and mobile widths for overlap, clipping, repeated content, layout shift, and empty or blank surfaces
