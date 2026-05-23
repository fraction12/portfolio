# portfolio-production-polish Specification

## Purpose
TBD - created by archiving change production-polish-pass. Update Purpose after archive.
## Requirements
### Requirement: Public pages avoid unfinished scaffold states
The portfolio SHALL NOT show placeholder labels, scaffold CTAs, or internal TODO-style copy on public pages.

#### Scenario: Detail page has no ready demo media
- **WHEN** a visitor opens a project detail page whose demo media status is not ready
- **THEN** the page does not show `Demo slot` as a CTA
- **AND** the page either omits the demo section or renders a low-emphasis finished note that does not read like an implementation placeholder

#### Scenario: Detail page has ready demo media
- **WHEN** a visitor opens a project detail page with ready demo video media
- **THEN** the page shows a clear `Watch demo` path
- **AND** the video uses controls, does not autoplay, and includes a poster or equivalent pre-play visual

#### Scenario: Public source copy is audited
- **WHEN** the production polish pass is complete
- **THEN** public source and rendered pages do not expose obvious scaffold terms such as `placeholder`, `Demo slot`, `TODO`, or unfinished implementation notes to normal visitors

### Requirement: Work catalog uses specific low-noise navigation
The Work catalog SHALL make each project easy to inspect without repeating multiple generic actions for the same destination.

#### Scenario: Catalog item has a detail page
- **WHEN** a Work catalog item has an internal detail page
- **THEN** the project name links to that detail page
- **AND** the card or row does not also require a second generic `View detail` link with the same destination

#### Scenario: Catalog item has an external destination
- **WHEN** a Work catalog item has a live site, marketing site, package, or GitHub repository
- **THEN** the external link label is specific enough to identify the destination type
- **AND** the card exposes no more than one secondary external action unless a project has a documented reason for multiple public destinations

#### Scenario: Catalog is scanned quickly
- **WHEN** a visitor scans the Work page
- **THEN** categories, metadata, links, and metrics do not compete with the project name and one-line description
- **AND** repeated labels are minimized across the visible list

### Requirement: Writing links are specific and accessible
The Writing page SHALL avoid repeated generic link text as the only way to identify essay destinations.

#### Scenario: Essay card is rendered
- **WHEN** an essay appears on the Writing page or homepage writing section
- **THEN** the essay title is the primary link or the action link has an accessible name that includes the essay title
- **AND** repeated visible labels such as `Read essay` are not the only available link context

#### Scenario: Keyboard user navigates writing links
- **WHEN** a keyboard user tabs through essay links
- **THEN** each focused link has a visible focus state
- **AND** the focused link purpose is understandable without relying on surrounding visual layout alone

### Requirement: TradeSpec detail page acts as the flagship proof page
The TradeSpec detail page SHALL be the strongest product proof surface on the site and SHALL stay truthful about public/private boundaries.

#### Scenario: Visitor opens TradeSpec detail page
- **WHEN** a visitor opens `/tools/tradespec`
- **THEN** the page clearly explains what TradeSpec is, who it is for, what problem it solves, and what workflow or output it supports
- **AND** the copy reads like a concise product case study rather than a generic catalog entry
- **AND** the page does not render a standalone `Decisions` section

#### Scenario: TradeSpec proof is bounded
- **WHEN** TradeSpec copy references status, customers, pilots, availability, or product maturity
- **THEN** the claim is specific, truthful, and supported by existing approved public context
- **AND** the page does not imply public self-serve availability, funding details, broad adoption, or customer metrics unless those claims are explicitly available and approved

#### Scenario: TradeSpec links are shown
- **WHEN** TradeSpec has a safe public marketing site or other approved public destination
- **THEN** the detail page exposes that link with a specific label
- **AND** private source, customer material, or sensitive plan content is not exposed

### Requirement: Crawl and machine-readable surfaces are standards-clean
The portfolio SHALL expose search and machine-readable metadata without introducing validator-visible production errors.

#### Scenario: robots.txt is fetched
- **WHEN** a crawler or audit tool fetches `/robots.txt`
- **THEN** the file contains standard crawler directives and sitemap references
- **AND** non-standard `llms.txt` discovery text, if present, is represented as a comment rather than an unknown directive

#### Scenario: llms.txt remains discoverable
- **WHEN** a crawler or agent reads public pages
- **THEN** `/llms.txt` remains available
- **AND** public pages continue to advertise the LLM-friendly summary through an appropriate alternate link or equivalent standards-safe discovery mechanism

#### Scenario: metadata matches page purpose
- **WHEN** a visitor or crawler opens a public page
- **THEN** the page has a specific title, description, canonical URL, and social metadata that match the page's actual content
- **AND** removed public concepts such as Jarvis do not appear in current public metadata unless explicitly archival and non-navigational

### Requirement: Shared links have composed social previews
The portfolio SHALL provide intentional social preview assets for high-value public pages.

#### Scenario: Home or Work page is shared
- **WHEN** the homepage or Work catalog URL is shared on a platform that reads Open Graph or Twitter metadata
- **THEN** the preview image, title, and description present Dushyant Garg's Product Manager / Builder positioning cleanly
- **AND** the preview does not rely on a generic fallback if a page-specific image has been defined

#### Scenario: High-value project page is shared
- **WHEN** `/tools/tradespec`, `/tools/microcanvas`, or `/tools/openspec-studio` is shared
- **THEN** the page uses a composed preview image or a deliberately chosen fallback that names the project and matches the site's design system

#### Scenario: Preview assets are maintainable
- **WHEN** preview assets are added or updated
- **THEN** the implementation uses static assets or a simple repeatable generation path
- **AND** it does not add a runtime image-generation dependency for this polish pass

### Requirement: Not-found behavior is intentional
The portfolio SHALL render a polished not-found experience for removed or unknown public routes.

#### Scenario: Visitor opens removed Jarvis route
- **WHEN** a visitor opens `/jarvis`
- **THEN** the site returns or renders a not-found experience rather than redirecting Jarvis back into the public portfolio concept
- **AND** the page offers clear paths to Work, Writing, and Contact

#### Scenario: Visitor opens unknown route
- **WHEN** a visitor opens an unknown route
- **THEN** the not-found page matches the quiet founder visual system
- **AND** the response preserves correct not-found semantics for crawlers and browsers

### Requirement: Demo media is performant and accessible
Project detail demo media SHALL load intentionally, preserve layout stability, and remain accessible.

#### Scenario: Ready video appears on detail page
- **WHEN** a project detail page renders a demo video
- **THEN** the video does not autoplay
- **AND** the video uses controls and `preload="none"` or an equivalent low-bandwidth loading strategy
- **AND** the media frame has stable dimensions before playback

#### Scenario: Poster image is rendered
- **WHEN** a video poster image is shown
- **THEN** the poster asset is sized appropriately for its rendered dimensions or uses a responsive image strategy
- **AND** the page avoids downloading an unnecessarily oversized poster for the default layout

#### Scenario: Media copy is reviewed
- **WHEN** demo media includes labels, captions, or surrounding explanatory text
- **THEN** the copy describes the actual workflow being demonstrated
- **AND** it does not claim capabilities that are not visible or supported by the demo

### Requirement: Production quality verification is required before completion
The change SHALL NOT be marked complete until build, validation, browser, accessibility, and content-quality checks have been run or explicitly documented as blocked.

#### Scenario: OpenSpec validation runs
- **WHEN** implementation is complete
- **THEN** `openspec validate production-polish-pass --json` passes

#### Scenario: Site build and tests run
- **WHEN** implementation is complete
- **THEN** existing relevant tests pass
- **AND** `npm run build` succeeds

#### Scenario: Browser inspection is performed
- **WHEN** implementation is complete
- **THEN** representative pages are inspected locally or in preview: `/`, `/tools`, `/writing`, `/tools/tradespec`, `/tools/microcanvas`, `/tools/openspec-studio`, `/robots.txt`, `/llms.txt`, and at least one unknown route
- **AND** the inspection checks for broken links, visible placeholders, layout overlap, text clipping, and incorrect theme behavior

#### Scenario: Production-like audit is performed
- **WHEN** Lighthouse or an equivalent audit is used
- **THEN** the audit is run against built/production-like output rather than Astro dev-toolbar output
- **AND** any remaining production-relevant failures are fixed or documented with rationale

#### Scenario: Accessibility baseline is verified
- **WHEN** keyboard, contrast, and link-name checks are performed
- **THEN** focus states are visible
- **AND** text contrast passes automated checks
- **AND** link purposes are understandable for primary navigation, Work entries, Writing entries, and contact actions
