## ADDED Requirements

### Requirement: Detail Page Title Containment
Tool detail pages SHALL keep project names readable and contained across desktop and mobile layouts.

#### Scenario: Long project name renders on desktop
- **WHEN** a detail page title such as `AgentSense` or `Microcanvas` renders beside fact metadata
- **THEN** the title SHALL stay within its content column
- **AND** it SHALL NOT overlap, crowd, or visually collide with the facts column.

#### Scenario: Detail page renders on mobile
- **WHEN** a detail page is viewed at mobile widths
- **THEN** the title, tagline, summary, facts, and links SHALL fit without horizontal overflow or clipped text.

### Requirement: Case Study Proof Layout
Flagship tool detail pages SHALL present proof like concise case studies rather than generic schema pages.

#### Scenario: Flagship project has ready media
- **WHEN** a flagship project detail page has ready media
- **THEN** the media SHALL appear early enough to support the hero claim before the reader reaches the lower story section
- **AND** the media caption SHALL describe what the reader is seeing and why it matters.

#### Scenario: Project detail tells a product story
- **WHEN** a reader scans a flagship detail page
- **THEN** the page SHALL clearly separate problem, product decision, workflow/output, and public access boundaries
- **AND** the page SHALL avoid generic repeated section structures when a project-specific story would be clearer.

### Requirement: Media As Evidence
Project screenshots and videos SHALL act as informative proof rather than decorative placeholders.

#### Scenario: Screenshot preview is shown
- **WHEN** a project screenshot is rendered
- **THEN** the crop SHALL prioritize the actual product interface or workflow state
- **AND** the surrounding frame SHALL not add excessive empty space that weakens the evidence.

#### Scenario: Demo video is shown
- **WHEN** a demo video is rendered
- **THEN** the preview area SHALL remain stable and accessible
- **AND** the caption SHALL describe the demonstrated workflow without overstating capabilities.
