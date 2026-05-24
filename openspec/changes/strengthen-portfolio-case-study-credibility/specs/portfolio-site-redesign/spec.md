## ADDED Requirements

### Requirement: Unified Proof Media System
The portfolio SHALL use a consistent visual treatment for project screenshots and demo previews so Work cards and project pages feel like one designed system rather than mixed external captures.

#### Scenario: Flagship Work cards render
- **WHEN** flagship Work cards display project screenshots or posters
- **THEN** each card uses the same frame rules, aspect ratio strategy, border treatment, caption/label hierarchy, and crop logic
- **AND** screenshot treatments do not visually compete with the project name and proof copy

#### Scenario: Mixed source screenshots appear together
- **WHEN** screenshots from product sites, desktop apps, demos, and documentation pages appear in the same section
- **THEN** the layout normalizes them enough that the section feels cohesive
- **AND** the source differences remain truthful rather than being disguised as fake product UI

### Requirement: Thesis-Aligned Writing Curation
The Writing page SHALL lead with writing that supports Dushyant's portfolio thesis and move off-thesis essays behind a lower-priority path.

#### Scenario: Visitor opens Writing
- **WHEN** a visitor opens `/writing`
- **THEN** the first visible essay list prioritizes writing about AI products, product systems, shipping judgment, and practical builder lessons
- **AND** essays that are personal, experimental, or less relevant to the portfolio thesis do not lead the page

#### Scenario: Visitor wants all writing
- **WHEN** a visitor wants to browse beyond curated writing
- **THEN** the site provides a clear lower-priority path to all recent writing or the external Substack archive
- **AND** the curated list does not pretend to be a complete feed if it is filtered

### Requirement: Clear Contact Path After Proof
The portfolio SHALL provide an obvious but restrained path to contact Dushyant after high-credibility proof surfaces.

#### Scenario: Visitor finishes reviewing Work
- **WHEN** a visitor reaches the end of the Work page or a flagship project detail page
- **THEN** a concise contact path is available without requiring navigation back to the homepage
- **AND** the copy frames contact around product roles, startup work, or focused consulting without salesy language

#### Scenario: Contact path repeats globally
- **WHEN** contact actions appear in navigation, footer, homepage, Work, or detail pages
- **THEN** the repeated actions remain navigational and do not duplicate long contact explanations
