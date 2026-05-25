## Context

Clawpatch reported 25 open findings, with 15 tied to the new proof-hierarchy commit and the rest from the prior map. The fixes are mostly narrow hardening issues rather than a new feature direction.

## Approach

- Prefer local helper functions and deterministic tests over broad refactors.
- Treat duplicate Clawpatch findings as one code fix when they share root cause, such as GitHub GraphQL validation or live git test assumptions.
- Preserve the current portfolio direction: quiet editorial pages, one selected-work surface on the homepage, truthful media/data, and no fabricated metrics.
- Keep workflow-doc fixes in-place so the user-scope/project agent instructions remain safer without requiring executable tooling changes.

## Decisions

### Decision: Make data loaders validate upstream shape
GitHub GraphQL calls return HTTP 200 for query-level failures, so the response body must be checked for `errors` and required arrays before deriving commit or heatmap data.

### Decision: Remove homepage ProofStrip
The current canonical homepage contract says selected project proof appears in one work surface. Removing `ProofStrip` fixes the duplication without inventing a new design.

### Decision: Convert existing SVG preview cards to raster assets
The SVG files remain editable source assets, while PNG variants become the metadata targets for pages and crawlers that reject SVG previews.

### Decision: Keep live git checks out of default tests
Parser behavior is what the default test suite needs. Any live repo smoke should be explicit, because source exports, shallow clones, and quiet months are normal environments.

## Risks

- Some Clawpatch findings overlap and may remain open until revalidation recognizes the shared fix.
- Raster OG conversion depends on local tooling; if conversion is unavailable, the build must still keep source SVGs intact and document the blocked validation.
- Adding a dedicated lint script without an installed linter would create a broken gate, so `lint` is scoped to an available validation path unless a linter dependency is added later.
