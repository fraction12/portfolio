## Why

Clawpatch found concrete security, data-integrity, test reliability, documentation, and UI-contract issues after the latest portfolio proof-hierarchy work landed. This change closes those findings before the review state is committed and pushed.

## What Changes

- Sanitize public telemetry surfaces, especially `/llms.txt`, before values reach logs or analytics.
- Harden external data ingestion so malformed GraphQL, feed, git, and URL inputs fail closed or fall back safely.
- Make client-side lifecycle code idempotent across Astro transitions.
- Align homepage, Writing, and tool-detail surfaces with the current editorial and social-preview contracts.
- Add deterministic quality gates, tests, and docs updates for the Clawpatch findings.

## Capabilities

### New Capabilities

- `portfolio-review-hardening`: Cross-cutting safety, data integrity, lifecycle, test, and quality-gate behavior found by automated review.

### Modified Capabilities

- `tool-detail-pages`: Clarify that no-media detail pages may omit the media section instead of rendering a placeholder.

## Impact

- Affected routes/components: `/`, `/tools`, `/tools/[slug]`, `/writing`, `/llms.txt`, layout theme bootstrap, scroll reveal, newsletter signup, and writing rows.
- Affected data/config: GitHub/Substack loaders, agent/package metadata, social preview assets, OpenSpec archive workflow docs, and stale design docs.
- Affected validation: Vitest coverage, package scripts, OpenSpec validation, build, Clawpatch revalidation, commit, and push.
