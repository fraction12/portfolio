## Why

The Work page is becoming the main catalog surface, but the current split between flagship image cards and compact rows makes the page feel uneven. A uniform visual grid with pagination lets every project read as portfolio work while keeping the page scannable.

## What Changes

- Replace the current flagship-plus-list Work page layout with one paginated card grid.
- Render 9 projects per page in a 3 column desktop grid, with responsive 2/1 column behavior on smaller screens.
- Use the same image-led card treatment for every artifact, with real media where available and polished fallback visuals where media is not ready.
- Add or wire available public visuals for Potato v3, ClawK, and Starglass when accessible from approved public sources.
- Preserve internal detail-page navigation and truthful project status/context.

## Capabilities

### New Capabilities

- None.

### Modified Capabilities

- `portfolio-site-redesign`: Work catalog presentation changes from grouped row/catalog sections to a uniform paginated visual card grid.
- `tool-detail-pages`: Catalog media presentation extends the existing demo media model to support all-card visual previews and polished non-media fallbacks.

## Impact

- Affects `/tools` page layout, Work card rendering, media/fallback behavior, and pagination controls.
- May add static media files under `public/tool-media/`.
- Does not change public routes, artifact slugs, or detail-page URLs.
