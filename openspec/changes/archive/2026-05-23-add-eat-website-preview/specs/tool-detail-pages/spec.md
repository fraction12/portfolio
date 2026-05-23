## ADDED Requirements

### Requirement: Eat Website Preview
The Eat detail page SHALL represent the verified public Eat website as a live public surface.

#### Scenario: Visitor opens Eat detail page
- **WHEN** a visitor opens `/tools/eat`
- **THEN** the page SHALL link to `https://eat-ai.app`
- **AND** it SHALL keep the GitHub source link available.

#### Scenario: Eat preview is rendered
- **WHEN** the Eat detail page renders media
- **THEN** it SHALL show a screenshot preview of the live website with accessible alt text and a truthful caption
- **AND** it SHALL label the media as a preview rather than a demo.

#### Scenario: Stale Eat deployment is avoided
- **WHEN** Eat links are rendered in catalog, detail, or machine-readable summary surfaces
- **THEN** they SHALL NOT link to the stale `https://eat-tawny.vercel.app` deployment.
