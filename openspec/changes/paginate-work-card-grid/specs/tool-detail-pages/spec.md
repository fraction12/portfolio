## MODIFIED Requirements

### Requirement: Catalog-to-Detail Navigation
The tool catalog SHALL prefer internal detail pages for tools that have them while preserving external links.

#### Scenario: Tool has a detail page
- **WHEN** a tool card is rendered for a current artifact
- **THEN** the primary card navigation SHALL point to the internal detail page
- **AND** external repo/site links SHALL remain accessible from the card or detail page.

#### Scenario: Visual catalog card has media
- **WHEN** a tool card's detail model includes ready demo media
- **THEN** the catalog card SHALL render the image or video poster as visual evidence with accessible alt text

#### Scenario: Visual catalog card lacks media
- **WHEN** a tool card's detail model does not include ready demo media
- **THEN** the catalog card SHALL render a finished fallback visual using truthful project metadata
- **AND** the fallback SHALL preserve the same navigation target as media-backed cards

#### Scenario: Homepage selected work
- **WHEN** a selected work item also has a detail page
- **THEN** the homepage SHALL offer an internal path into the portfolio story without hiding the external product/repo link.
