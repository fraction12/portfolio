## ADDED Requirements

### Requirement: Expose crawl discovery artifacts for the canonical site
The portfolio SHALL expose standard crawl discovery artifacts for the public production site.

#### Scenario: Robots file points crawlers at the sitemap
- **WHEN** a crawler requests the site's `robots.txt`
- **THEN** the response allows public crawling of indexable pages and advertises the canonical sitemap URL for `https://dushyantgarg.com`

#### Scenario: Sitemap enumerates public pages
- **WHEN** a crawler requests the site's sitemap
- **THEN** the sitemap lists the intended public portfolio pages under the canonical production origin

### Requirement: Use intentional canonical metadata on every public page
Every public portfolio page SHALL expose page-specific metadata that resolves to the canonical production domain.

#### Scenario: Canonical metadata resolves to production host
- **WHEN** a public page is rendered in production
- **THEN** its canonical URL, social URL, and related metadata resolve against `https://dushyantgarg.com`

#### Scenario: Public pages avoid generic metadata reuse
- **WHEN** a user or crawler views different public pages such as home, projects, writing, jarvis, beliefs, or colophon
- **THEN** each page exposes a title and description that describes that page specifically rather than relying on a generic shared default

### Requirement: Publish structured identity data for the portfolio
The portfolio SHALL publish structured data that helps search engines understand the site's owner and canonical web presence.

#### Scenario: Home page identifies the site owner
- **WHEN** the home page is rendered
- **THEN** it includes valid `Person` structured data for Dushyant Garg with the canonical site URL and major public profile links

#### Scenario: Home page identifies the website entity
- **WHEN** the home page is rendered
- **THEN** it includes valid `WebSite` structured data describing the portfolio as the canonical website for Dushyant Garg

### Requirement: Support configurable search engine ownership verification
The portfolio SHALL support search engine verification tags through configuration rather than one-off code edits.

#### Scenario: Google verification token is configured
- **WHEN** a Google site verification token is present in site configuration
- **THEN** the rendered site emits the corresponding verification metadata

#### Scenario: Bing verification token is configured
- **WHEN** a Bing site verification token is present in site configuration
- **THEN** the rendered site emits the corresponding verification metadata

#### Scenario: Verification tags stay absent by default
- **WHEN** no verification tokens are configured
- **THEN** the site does not emit empty or placeholder verification tags
