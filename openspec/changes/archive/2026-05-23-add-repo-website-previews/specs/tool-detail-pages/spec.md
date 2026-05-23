## ADDED Requirements

### Requirement: Repository Website Previews
Tool detail pages SHALL surface verified public repository websites and previews when those websites are real product or documentation surfaces.

#### Scenario: Repository declares a working public website
- **WHEN** a catalog artifact's public GitHub repository declares a non-GitHub homepage URL
- **AND** that homepage loads successfully
- **THEN** the artifact SHALL include that URL as its public external website destination
- **AND** its detail page SHALL render a screenshot preview with accessible alt text and a truthful caption.

#### Scenario: Repository homepage is missing or not a real website
- **WHEN** a catalog artifact's repository has no homepage, a GitHub README-only homepage, or a homepage that does not load successfully
- **THEN** the portfolio SHALL NOT add a website screenshot for that artifact
- **AND** the artifact SHALL keep the most truthful available public destination, such as GitHub, package registry, or no public product surface.

#### Scenario: Website preview exists
- **WHEN** a detail page renders a repository website preview
- **THEN** the page SHALL use the existing low-noise media section pattern
- **AND** the preview SHALL NOT introduce duplicated website links, fake demo labels, or placeholder media copy.
