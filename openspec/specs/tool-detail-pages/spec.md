# tool-detail-pages Specification

## Purpose
TBD - created by archiving change add-tool-detail-pages. Update Purpose after archive.
## Requirements
### Requirement: Tool Detail Pages
The portfolio SHALL support dedicated detail pages for catalog artifacts.

#### Scenario: Tool has detail content
- **WHEN** an artifact has detail-page content
- **THEN** the site SHALL expose a public `/tools/{slug}` page for that artifact
- **AND** the page SHALL render page-specific title, description, status, links, and narrative sections.

#### Scenario: Current catalog artifacts have scaffolds
- **WHEN** the current tool catalog is rendered
- **THEN** each current artifact SHALL have an internal detail page scaffold
- **AND** the scaffold SHALL use truthful existing catalog data plus restrained placeholder copy for unfinished narrative/media sections.

#### Scenario: Unknown slug
- **WHEN** a visitor requests a `/tools/{slug}` page that does not map to a current artifact detail
- **THEN** the site SHALL return normal not-found behavior instead of rendering a generic empty page.

### Requirement: TradeSpec Detail Page
The portfolio SHALL include a dedicated TradeSpec AI detail page as the first tool detail page.

#### Scenario: Visitor opens TradeSpec detail page
- **WHEN** a visitor opens `/tools/tradespec`
- **THEN** the page SHALL explain TradeSpec as an AI workflow for specialty-contractor estimating
- **AND** SHALL describe the evidence-linked review-pack output
- **AND** SHALL state that it is private/alpha/customer-pilot rather than publicly self-serve.

#### Scenario: Visitor wants the public product surface
- **WHEN** a visitor views the TradeSpec detail page
- **THEN** the page SHALL link to the TradeSpec marketing site at `https://tradespec-website.vercel.app`.

### Requirement: Media-ready Case Study Layout
Tool detail pages SHALL support screenshots, demo videos, or other proof media while allowing placeholder media slots before final assets are added.

#### Scenario: Media exists
- **WHEN** a tool detail page includes media assets
- **THEN** each asset SHALL render with caption and accessible alt text or equivalent description
- **AND** video media SHALL be user-initiated rather than autoplayed.

#### Scenario: Media is not ready
- **WHEN** a tool detail page has no safe media assets yet
- **THEN** the page SHALL render a polished demo placeholder that explains what will be added
- **AND** SHALL NOT pretend that screenshots or video assets already exist.

#### Scenario: Future narrated demos
- **WHEN** a video demo includes narration or important audio
- **THEN** the content model SHALL allow captions and/or transcript text to be attached later.

### Requirement: Truthful Distribution and Access Claims
Tool detail pages and catalog surfaces SHALL accurately represent whether a tool is public, private, installable, unpublished, or alpha-only.

#### Scenario: Tool is private or unpublished
- **WHEN** a tool is private, alpha, or not distributed through npm/PyPI/etc.
- **THEN** the page and catalog SHALL NOT show fake install commands or imply public self-serve access.

### Requirement: Repo-grounded Detail Copy
Tool detail page labels and copy SHALL be grounded in source repository evidence when a public repository exists.

#### Scenario: Tool has a public GitHub repository
- **WHEN** a catalog artifact has a public GitHub repository
- **THEN** its detail page SHALL use the repository README and metadata to refine what it is, who it is for, the workflow, outputs, decisions, and demo-slot caption.

#### Scenario: Tool has no public GitHub repository
- **WHEN** a catalog artifact lacks a public GitHub repository
- **THEN** its detail page SHALL use existing truthful portfolio/product context and SHALL clearly preserve private, alpha, dev, or parked status boundaries.

### Requirement: Catalog-to-Detail Navigation
The tool catalog SHALL prefer internal detail pages for tools that have them while preserving external links.

#### Scenario: Tool has a detail page
- **WHEN** a tool card is rendered for a current artifact
- **THEN** the primary card navigation SHALL point to the internal detail page
- **AND** external repo/site links SHALL remain accessible from the card or detail page.

#### Scenario: Homepage selected work
- **WHEN** a selected work item also has a detail page
- **THEN** the homepage SHALL offer an internal path into the portfolio story without hiding the external product/repo link.

### Requirement: Repository Website Previews
Tool detail pages SHALL surface verified public repository websites and previews when those websites are real product or documentation surfaces.

#### Scenario: Repository declares a working public website
- **WHEN** a catalog artifact's public GitHub repository declares a non-GitHub homepage URL
- **AND** that homepage loads successfully
- **THEN** the artifact SHALL include that URL as its public external website destination
- **AND** its detail page SHALL render a screenshot preview with accessible alt text and a truthful caption.

#### Scenario: Repository homepage is missing or not a real website
- **WHEN** a catalog artifact's repository has no homepage, a GitHub README-only homepage, or a homepage that does not load successfully
- **THEN** the portfolio SHALL NOT add a website screenshot for that artifact
- **AND** the artifact SHALL keep the most truthful available public destination, such as GitHub, package registry, or no public product surface.

#### Scenario: Website preview exists
- **WHEN** a detail page renders a repository website preview
- **THEN** the page SHALL use the existing low-noise media section pattern
- **AND** the preview SHALL NOT introduce duplicated website links, fake demo labels, or placeholder media copy.

