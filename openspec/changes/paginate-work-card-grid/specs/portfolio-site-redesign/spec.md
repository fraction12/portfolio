## MODIFIED Requirements

### Requirement: Tools Page As Catalog With Editorial Discipline
The `/tools` page SHALL remain available as a broader catalog of shipped and experimental work while using the same quiet founder index design language.

#### Scenario: Catalog is scannable without noise
- **WHEN** a reader opens `/tools`
- **THEN** artifact categories, cards, metadata, metrics, and external links are organized for scanning without repeated descriptions, excessive tags, command-line styling, or fake status cues

#### Scenario: Catalog uses a visual paginated grid
- **WHEN** a reader opens `/tools`
- **THEN** the catalog SHALL render artifacts as a uniform image-led card grid
- **AND** cards with ready visual media SHALL appear before cards that use fallback visuals
- **AND** desktop layouts SHALL show up to 3 cards per row
- **AND** each page of the catalog SHALL show no more than 9 project cards before requiring pagination

#### Scenario: Catalog adapts to smaller screens
- **WHEN** `/tools` is viewed on tablet or mobile widths
- **THEN** the card grid SHALL reduce columns responsively without horizontal scrolling, overlap, or clipped text
- **AND** pagination controls SHALL remain reachable and understandable

#### Scenario: Catalog card media is incomplete
- **WHEN** an artifact does not have ready demo media
- **THEN** its card SHALL still use the same card structure with a polished fallback visual
- **AND** the fallback SHALL NOT claim that a screenshot, video, or public product surface exists

#### Scenario: Metrics are truthful and useful
- **WHEN** package metrics or project status appear on `/tools`
- **THEN** they are truthful, sourced by existing data, and presented as supporting context rather than the primary credibility signal
