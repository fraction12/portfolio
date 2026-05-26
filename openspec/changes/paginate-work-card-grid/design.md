## Design

### Approach

The Work page should have one catalog surface: a paginated grid of visual project cards. This removes the special flagship/list hierarchy while retaining the stronger card treatment introduced for flagship work.

### Card Model

- Reuse `ToolDetail` as the source of truth for artifact, detail path, category label, summary, and demo media.
- Keep proof copy in `featured-work.ts` only for homepage/flagship contexts; the full Work catalog should use each detail's summary or existing catalog copy.
- Extend the current card component or add a close sibling so it can render:
  - ready image media directly,
  - video poster media for ready video demos,
  - a polished text/metadata fallback when no media is ready.

### Pagination

- Astro should render based on a `page` query parameter, defaulting to page 1.
- Invalid, missing, or out-of-range page values should resolve to page 1 in the rendered UI rather than breaking the page.
- Controls should be normal links to `/tools?page=N`, with current page state exposed via accessible text.
- Page size is 9.

### Media

- Use local static media under `public/tool-media/<slug>/`.
- For LinkedIn-sourced Potato v3 and ClawK media, only use media that can be accessed or saved as an appropriate local asset during implementation.
- For Starglass, prefer the README image from the public repository if available.
- If media cannot be retrieved reliably, use the fallback card visual and keep the media model truthful.

### Responsive Behavior

- Desktop: 3 columns.
- Medium widths: 2 columns.
- Mobile: 1 column.
- Cards must not shift layout when labels, headings, or fallback visuals render.
