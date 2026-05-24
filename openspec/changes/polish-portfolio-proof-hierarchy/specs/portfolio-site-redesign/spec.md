## ADDED Requirements

### Requirement: Homepage Proof Hierarchy
The homepage SHALL support the quiet founder positioning with concise proof that can be understood in the first scan.

#### Scenario: First viewport includes credible proof path
- **WHEN** a first-time reader lands on the homepage
- **THEN** the hero SHALL still identify Dushyant Garg as a Product Manager / Builder
- **AND** the page SHALL expose a small set of concrete proof signals or flagship paths before the reader reaches the full Work list
- **AND** the proof SHALL avoid noisy labels, fake-live language, dashboard styling, and cringe metrics.

#### Scenario: Proof supports the claim
- **WHEN** the homepage references selected work
- **THEN** the surfaced examples SHALL name real products, systems, or customer-facing workflows
- **AND** the examples SHALL help the reader understand why the positioning is believable.

### Requirement: Work Catalog Proof Hierarchy
The Work catalog SHALL distinguish flagship proof from supporting systems and experiments.

#### Scenario: Flagship work is emphasized
- **WHEN** a reader opens `/tools`
- **THEN** the page SHALL present a small flagship set before the full supporting catalog
- **AND** flagship entries SHALL include stronger visual or contextual proof than ordinary rows.

#### Scenario: Supporting work remains scannable
- **WHEN** open-source systems and experiments are listed
- **THEN** the page SHALL preserve a calm, dense list for inspection
- **AND** it SHALL NOT give parked/private experiments the same visual priority as flagship work.

### Requirement: Writing Page Editorial Cleanup
The Writing page SHALL read as evidence of judgment rather than a feed scaffold.

#### Scenario: Reader scans writing
- **WHEN** essays render on `/writing`
- **THEN** the section copy SHALL be serious and reader-facing
- **AND** visible labels SHALL NOT include implementation notes or meta-copy about the page structure.

#### Scenario: Essay list supports credibility
- **WHEN** essay entries render
- **THEN** the list SHALL favor readable hierarchy and direct titles over decorative card density
- **AND** the page SHALL preserve clear links, dates, and reading-time context.

### Requirement: Editorial Dark Mode
Dark mode SHALL preserve the same serious editorial identity as the light theme.

#### Scenario: Dark mode is active
- **WHEN** the reader switches to dark mode
- **THEN** the site SHALL remain calm and editorial
- **AND** it SHALL NOT visually regress into terminal, hacker, cockpit, glow-heavy, or pure-black novelty styling.
