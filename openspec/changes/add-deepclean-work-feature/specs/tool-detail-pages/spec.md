## MODIFIED Requirements

### Requirement: Tool Detail Pages
The portfolio SHALL support dedicated detail pages for catalog artifacts.

#### Scenario: Tool has detail content
- **WHEN** an artifact has detail-page content
- **THEN** the site SHALL expose a public `/tools/{slug}` page for that artifact
- **AND** the page SHALL render page-specific title, description, status, links, and narrative sections.

#### Scenario: Current catalog artifacts have scaffolds
- **WHEN** the current tool catalog is rendered
- **THEN** each current artifact SHALL have an internal detail page scaffold
- **AND** the scaffold SHALL use truthful existing catalog data plus restrained placeholder copy for unfinished narrative/media sections.

#### Scenario: Unknown slug
- **WHEN** a visitor requests a `/tools/{slug}` page that does not map to a current artifact detail
- **THEN** the site SHALL return normal not-found behavior instead of rendering a generic empty page.

#### Scenario: Deepclean detail page exists
- **WHEN** a visitor opens `/tools/deepclean`
- **THEN** the page SHALL explain Deepclean as a local repo cleanup reporting CLI
- **AND** it SHALL link to the public landing site, GitHub repository, and npm package

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

#### Scenario: Deepclean preview is rendered
- **WHEN** the Deepclean detail page renders media
- **THEN** it SHALL show a screenshot preview of `https://fraction12.github.io/deepclean/` with accessible alt text and a truthful caption
