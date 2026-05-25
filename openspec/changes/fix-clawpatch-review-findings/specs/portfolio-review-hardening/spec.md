## ADDED Requirements

### Requirement: Public telemetry is minimized
Public request telemetry SHALL NOT write raw user-controlled headers to logs or analytics.

#### Scenario: llms.txt is fetched with sensitive headers
- **WHEN** `/llms.txt` receives `Referer` or `User-Agent` values containing query strings, fragments, secrets, or unusually long strings
- **THEN** logs and analytics SHALL include only bounded sanitized values
- **AND** the response body SHALL remain the static `llms.txt` content.

### Requirement: External data loaders preserve last-known-good data
External GitHub and Substack loaders SHALL reject malformed upstream payloads instead of replacing useful snapshot data with empty or misleading records.

#### Scenario: GitHub GraphQL returns errors with HTTP 200
- **WHEN** GitHub returns a GraphQL response with `errors`, missing contribution weeks, or malformed history nodes
- **THEN** the loader SHALL throw into its existing fallback path
- **AND** it SHALL NOT write an empty heatmap or misleading commit set over the existing snapshot.

#### Scenario: Substack feed contains malformed entities or unsafe links
- **WHEN** feed content contains an out-of-range XML code point or an unsafe URL scheme
- **THEN** parsing SHALL not throw for the whole feed
- **AND** rendered essay links SHALL be limited to safe `http` or `https` destinations.

### Requirement: Client lifecycle handlers are idempotent
Client-side scripts SHALL avoid accumulating stale observers or global listeners across Astro client-side navigation.

#### Scenario: Astro navigation repeats
- **WHEN** a reader navigates between pages using Astro transitions
- **THEN** theme listeners and scroll-reveal observers SHALL be installed once or cleaned up before replacement
- **AND** missing browser APIs SHALL degrade to visible content instead of throwing.

### Requirement: Review quality gates are deterministic
The repository SHALL expose reviewable static quality gates and keep the test suite deterministic across checkout age and clone depth.

#### Scenario: Test suite runs in CI or a source export
- **WHEN** `npm run test` runs without reliable live git history
- **THEN** parser behavior SHALL still be tested with fixed fixtures
- **AND** live repository smoke checks SHALL be absent or explicitly guarded.

#### Scenario: Static gates are requested
- **WHEN** maintainers inspect `package.json`
- **THEN** it SHALL expose dedicated typecheck and lint scripts that can be used by CI or release automation.

### Requirement: Social previews use crawler-safe raster assets
High-value public pages SHALL use crawler-compatible raster Open Graph images.

#### Scenario: Home, Work, Writing, or flagship detail pages are shared
- **WHEN** metadata is rendered
- **THEN** `og:image` and `twitter:image` SHALL point at PNG, JPG, or WebP assets rather than SVG-only sources.

### Requirement: Review workflow docs are shell-safe
Agent workflow documentation SHALL show path validation and shell-safe quoting for user-supplied OpenSpec change IDs.

#### Scenario: An archive workflow receives a change name
- **WHEN** the archive instructions describe moving an OpenSpec change directory
- **THEN** they SHALL require resolving the change from active OpenSpec output
- **AND** they SHALL show quoted commands that reject path traversal, globs, spaces, and shell metacharacters.
