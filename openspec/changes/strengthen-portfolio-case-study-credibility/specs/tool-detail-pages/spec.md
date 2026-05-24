## ADDED Requirements

### Requirement: Product Case Study Structure
Tool detail pages SHALL present strong projects as concise product case studies rather than generic fact sheets.

#### Scenario: Flagship detail page renders
- **WHEN** a visitor opens a flagship detail page such as TradeSpec, OpenSpec Studio, Microcanvas, or agentplan
- **THEN** the page explains the problem, Dushyant's ownership, the product decision or system decision, what shipped, and what the work proves
- **AND** the story order helps a reader evaluate judgment before scanning secondary implementation details

#### Scenario: Supporting detail page renders
- **WHEN** a visitor opens a supporting tool detail page
- **THEN** the page may stay shorter than a flagship case study
- **AND** it still uses labels that clarify what was built, how it works, and why it matters

### Requirement: Inspectable Detail Media
Ready media on tool detail pages SHALL be framed as proof a reader can inspect, not as decorative cropped imagery.

#### Scenario: Screenshot preview renders
- **WHEN** a detail page renders a ready screenshot preview
- **THEN** the screenshot is visible enough to understand the product surface or website being shown
- **AND** it avoids cropping important headings, navigation, controls, or proof areas unless the crop is intentionally focused and captioned

#### Scenario: Video demo renders
- **WHEN** a detail page renders a ready video demo
- **THEN** the poster and video frame preserve the demo's primary UI context
- **AND** the media caption explains what workflow or product decision the reader should notice

### Requirement: Flagship and Supporting Detail Hierarchy
The tool detail system SHALL distinguish flagship proof pages from supporting catalog detail pages without creating separate templates that drift visually.

#### Scenario: Flagship project has richer proof
- **WHEN** a project is designated as flagship work
- **THEN** its detail page includes richer product narrative and proof media
- **AND** the page remains within the shared detail-page design system

#### Scenario: Supporting project lacks proof media
- **WHEN** a supporting project lacks ready media or a strong public proof surface
- **THEN** the detail page omits the media section rather than showing placeholder or low-credibility proof
