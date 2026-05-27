## MODIFIED Requirements

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

#### Scenario: Deepclean is featured
- **WHEN** selected work appears on the homepage
- **THEN** Deepclean SHALL appear as one of the featured work cards

### Requirement: Tools Page As Catalog With Editorial Discipline
The `/tools` page SHALL remain available as a broader catalog of shipped and experimental work while using the same quiet founder index design language.

#### Scenario: Catalog is scannable without noise
- **WHEN** a reader opens `/tools`
- **THEN** artifact categories, cards, metadata, metrics, and external links are organized for scanning without repeated descriptions, excessive tags, command-line styling, or fake status cues

#### Scenario: Metrics are truthful and useful
- **WHEN** package metrics or project status appear on `/tools`
- **THEN** they are truthful, sourced by existing data, and presented as supporting context rather than the primary credibility signal

#### Scenario: Deepclean appears in catalog
- **WHEN** a reader opens `/tools`
- **THEN** Deepclean SHALL appear as a current public Work artifact
- **AND** it SHALL use truthful GitHub, npm, and landing-site context
