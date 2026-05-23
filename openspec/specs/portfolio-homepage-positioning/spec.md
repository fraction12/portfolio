# portfolio-homepage-positioning Specification

## Purpose
TBD - created by archiving change simplify-portfolio-homepage. Update Purpose after archive.
## Requirements
### Requirement: Serious First Impression
The homepage SHALL communicate within the first viewport that Dushyant is a serious product-minded builder who turns ambiguous AI ideas into working products.

#### Scenario: Visitor lands on homepage
- **WHEN** a visitor opens the homepage
- **THEN** the first viewport SHALL show Dushyant's name or identity, a clear Product Manager / Builder positioning line, a concise thesis about building practical AI products, and a primary path to selected work.

#### Scenario: Visitor scans for credibility
- **WHEN** a visitor scans the first viewport
- **THEN** the homepage SHALL present concrete selected work or product proof before decorative operational status, command-line chrome, or broad activity feeds.

### Requirement: Calm Proof Hierarchy
The homepage SHALL prioritize a small set of meaningful proof points over a large set of labels, badges, metrics, or decorative status indicators.

#### Scenario: Featured proof is shown
- **WHEN** featured work appears on the homepage
- **THEN** the page SHALL show a curated set of high-signal projects with plain descriptions of the problem, product, or outcome.
- **AND** the page SHALL avoid presenting non-metrics such as "live public proof" as credibility metrics.

#### Scenario: Metrics are shown
- **WHEN** the homepage includes a metric
- **THEN** the metric SHALL be truthful, sourced from existing data, and useful for reader understanding.
- **AND** the metric SHALL NOT be used as decorative dashboard filler.

### Requirement: Reduced Visual Noise
The homepage SHALL retain the dark technical visual identity while reducing distracting label density and interface chrome.

#### Scenario: Homepage sections render
- **WHEN** homepage sections render
- **THEN** section labels SHALL be plain and purposeful, without jokey suffixes or dense punctuation.
- **AND** supporting metadata SHALL be limited to information that helps the reader understand the work.

#### Scenario: Technical visual language is used
- **WHEN** technical styling such as mono type, terminal panels, status dots, or command-line motifs appears
- **THEN** it SHALL be used sparingly and only where it clarifies real data, links, or product context.

### Requirement: Non-Cringe Copy Tone
Homepage copy SHALL use concrete, adult language and avoid performative, overclaimed, or self-mythologizing phrasing.

#### Scenario: Hero copy is rendered
- **WHEN** the homepage hero renders
- **THEN** the copy SHALL emphasize useful products, ambiguous problem-solving, interface judgment, and shipped systems.
- **AND** the copy SHALL avoid claims that sound like agent theater, fake urgency, or vanity proof.

#### Scenario: CTA copy is rendered
- **WHEN** homepage calls to action render
- **THEN** the CTAs SHALL describe normal reader actions such as viewing selected work, reading writing, or getting in touch.

### Requirement: Responsive Professional Layout
The simplified homepage SHALL remain polished and readable across desktop and mobile viewports.

#### Scenario: Homepage renders on desktop
- **WHEN** the homepage is viewed on a desktop viewport
- **THEN** the first viewport SHALL have clear visual hierarchy, comfortable whitespace, and no overlapping text or controls.

#### Scenario: Homepage renders on mobile
- **WHEN** the homepage is viewed on a mobile viewport
- **THEN** hero copy, navigation, selected work, and calls to action SHALL stack cleanly without clipped labels, crowded controls, or horizontal scrolling.
