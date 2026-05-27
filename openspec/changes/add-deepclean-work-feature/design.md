## Context

Work artifacts are defined in `src/config/packages.ts`, enriched in `src/config/tool-details.ts`, surfaced in the `/tools` paginated card grid, and featured on the homepage through `src/config/featured-work.ts`. Detail pages are generated from `toolDetails`.

Deepclean has public evidence:

- GitHub repository: `fraction12/deepclean`
- Landing site: `https://fraction12.github.io/deepclean/`
- npm package: `@fraction12/deepclean`

## Goals / Non-Goals

**Goals:**

- Add Deepclean once to the canonical artifact data so catalog and detail routes work automatically.
- Feature Deepclean on the homepage with concise proof copy.
- Use a real landing-site screenshot instead of fallback media.
- Preserve the existing card, pagination, and detail page patterns.

**Non-Goals:**

- Redesign the Work grid or homepage selected-work component.
- Add new analytics, package-fetching behavior, or npm registry UI.
- Replace existing featured projects unless the curated list needs ordering only.

## Decisions

- Treat Deepclean as `human-tools`: it is a local operator/developer utility for inspecting and planning cleanup work, not a reusable library primitive.
- Put Deepclean first in `flagshipWorkSlugs`: the user explicitly asked to feature the newly released tool, and the existing Work ordering uses flagship order as a tie-breaker among media-backed cards.
- Add an explicit Deepclean `links` override so the detail page can expose Website, GitHub, and npm without broadening link behavior for every npm package.
- Store the preview under `public/tool-media/deepclean/` and reference it from the existing demo/media model.

## Risks / Trade-offs

- New public package download counts may be absent from snapshots because the current npm loader falls back if any npm package fetch fails. Mitigation: the card still presents the artifact kind truthfully, and the detail page links directly to npm.
- GitHub Pages screenshots can drift as the landing site changes. Mitigation: use the screenshot as current visual proof and keep the source link available.
