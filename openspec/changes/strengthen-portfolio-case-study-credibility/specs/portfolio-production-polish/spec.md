## ADDED Requirements

### Requirement: Credibility Pass Verification
The portfolio SHALL verify the credibility-focused design pass against rendered pages, not only source diffs.

#### Scenario: First impression is checked
- **WHEN** implementation is complete
- **THEN** the homepage first viewport is inspected at desktop and mobile widths
- **AND** the inspection checks that the role, thesis, proof path, portrait treatment, and primary CTA are understandable without scrolling

#### Scenario: Case study pages are checked
- **WHEN** implementation is complete
- **THEN** representative flagship and supporting detail pages are inspected at desktop and mobile widths
- **AND** the inspection checks story order, media framing, link labels, contact path, and absence of placeholder copy

#### Scenario: Writing curation is checked
- **WHEN** implementation is complete
- **THEN** the Writing page is inspected to confirm curated thesis-aligned essays lead the page
- **AND** any all-writing/archive path is visible but lower priority than the curated list

### Requirement: Media and Layout Stability Verification
The portfolio SHALL verify screenshot/media treatments for visual consistency and responsive stability.

#### Scenario: Work media system is inspected
- **WHEN** implementation is complete
- **THEN** the Work page flagship media grid is inspected for consistent frame treatment, crop logic, spacing, and image loading behavior
- **AND** mixed source screenshots do not create a noisy or incoherent section

#### Scenario: Responsive overflow check runs
- **WHEN** implementation is complete
- **THEN** homepage, Work, Writing, 404, and all tool detail routes are checked for horizontal scrolling or clipped text at mobile and desktop widths
- **AND** any generated live-data snapshot changes from local verification are excluded unless intentionally part of the implementation
