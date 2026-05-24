## ADDED Requirements

### Requirement: Proof Hierarchy Verification
The proof-hierarchy polish SHALL be visually verified before completion.

#### Scenario: Responsive proof hierarchy is inspected
- **WHEN** implementation is complete
- **THEN** homepage, Work, Writing, 404, and representative detail pages SHALL be inspected at desktop and mobile widths
- **AND** the inspection SHALL check for unclear hierarchy, repeated proof, hidden media, text clipping, overflow, and noisy labels.

#### Scenario: Quality commands run
- **WHEN** implementation is complete
- **THEN** OpenSpec validation, tests, and build SHALL run successfully or any blocker SHALL be documented with evidence.

### Requirement: Content Restraint Pass
The polish SHALL remove public copy that reads like internal scaffolding or design commentary.

#### Scenario: Public pages are scanned for scaffold copy
- **WHEN** public page copy is reviewed
- **THEN** visible text SHALL avoid terms such as placeholder, demo slot, below the work, implementation notes, or other internal phrasing
- **AND** reader-facing copy SHALL stay plain-spoken, specific, and serious.
