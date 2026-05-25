## MODIFIED Requirements

### Requirement: Media-ready Case Study Layout
Tool detail pages SHALL support screenshots, demo videos, or other proof media while allowing media sections to be omitted before final assets are added.

#### Scenario: Media exists
- **WHEN** a tool detail page includes media assets
- **THEN** each asset SHALL render with caption and accessible alt text or equivalent description
- **AND** video media SHALL be user-initiated rather than autoplayed.

#### Scenario: Media is not ready
- **WHEN** a tool detail page has no safe media assets yet
- **THEN** the page SHALL either omit the media section or render a low-emphasis finished note
- **AND** it SHALL NOT pretend that screenshots or video assets already exist.

#### Scenario: Future narrated demos
- **WHEN** a video demo includes narration or important audio
- **THEN** the content model SHALL allow captions and/or transcript text to be attached later.
