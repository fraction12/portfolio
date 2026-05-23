## Context

The site has already moved to the approved Option A direction: a quiet founder index for a Product Manager / Builder. The current public surfaces are an Astro/Vercel portfolio with:

- homepage at `/`
- Work catalog at `/tools`
- project detail pages at `/tools/[slug]`
- writing page at `/writing`
- contact section anchored from the homepage
- `robots.txt`, `llms.txt`, sitemap output, Open Graph/Twitter metadata, Person/WebSite JSON-LD, and Vercel Analytics/Speed Insights

The latest local audit found the design direction is credible and restrained, but several details still read as unfinished or not fully production-operated:

- Detail pages without demo media render `Demo slot` as a CTA and show placeholder media sections.
- Work cards can expose multiple repeated actions for the same project: title link, `View detail`, and external links.
- Writing cards repeat `Read essay`, which is visually quiet but weak for link scanning and screen readers.
- `robots.txt` includes a non-standard `Llms-Txt:` directive that Lighthouse flags as invalid, even though `/llms.txt` is already discoverable through a `<link rel="alternate">`.
- The default Open Graph image is generic and does not make shared links feel composed.
- There is no intentionally designed 404/not-found route for removed routes such as `/jarvis`.
- Demo poster images are larger than their rendered dimensions on detail pages.

Research guardrails that should drive implementation:

- Stanford Web Credibility: credibility depends on professional visual design, useful content, clear contact information, visible real-person/company cues, restraint, and avoiding small errors. Source: https://credibility.stanford.edu/guidelines/
- Nielsen Norman Group: users often decide whether a page is worth attention quickly; the page must make its purpose and value clear immediately. Sources: https://www.nngroup.com/articles/how-long-do-users-stay-on-web-pages/ and https://www.nngroup.com/articles/tagline-blues-whats-the-site-about/
- Nielsen Norman Group link guidance: repeated generic labels such as "read more" or "learn more" reduce scannability and accessibility. Source: https://www.nngroup.com/articles/learn-more-links/
- Google Search Central: titles, descriptions, crawlability, structured data, and media placement should help search engines and readers understand page purpose. Source: https://developers.google.com/search/docs/fundamentals/seo-starter-guide
- web.dev Core Web Vitals: production UX quality includes fast visible content, low layout shift, and responsive interaction. Source: https://web.dev/articles/defining-core-web-vitals-thresholds
- WCAG 2.2: focus visibility, keyboard access, readable link purpose, contrast, and target size are baseline quality requirements. Source: https://www.w3.org/TR/WCAG22/

## Goals / Non-Goals

**Goals:**

- Make every public page feel finished, intentional, and trustworthy.
- Preserve the quiet-founder visual system from `redesign-quiet-founder-index`.
- Remove or replace visible scaffold language on production pages.
- Make Work and Writing links specific and low-noise.
- Make TradeSpec the strongest proof page because it best supports the Product Manager / Builder positioning.
- Ensure crawl, metadata, social preview, and not-found behavior have no obvious production errors.
- Improve detail-page media performance without adding unnecessary hosting or video infrastructure.
- Keep the scope reviewable: polish the existing architecture rather than redesigning it again.

**Non-Goals:**

- Do not create another full visual redesign.
- Do not add fake metrics, exaggerated funding/customer claims, or unverifiable proof.
- Do not invent final case-study copy where product facts are unknown.
- Do not add a CMS, animation framework, heavy component library, or new analytics dependency.
- Do not reintroduce Jarvis as a public site concept.
- Do not remove the existing `/tools` route; public label remains Work for URL compatibility.

## Decisions

### Decision: Hide unfinished demo modules instead of showing placeholder CTAs

Visible `Demo slot` copy is useful for internal scaffolding but weak as public-facing production copy. For tools without media, detail pages should either:

- omit the demo section entirely, or
- show an intentionally finished low-emphasis note only when it adds value, such as "Demo coming soon" inside a deeper project context.

Recommendation: default to omission for production pages. A page without demo media should still stand on its problem, audience, decisions, and links. This avoids making the reader inspect unfinished areas.

Alternative considered: keep placeholders but rename them. This still signals incompleteness and keeps visual weight on missing assets.

### Decision: Reduce repeated work-card actions

The Work catalog should scan like an edited index. Each row/card should have one primary internal navigation target and at most one clear external action. Recommended model:

- project title links to `/tools/[slug]` when a detail page exists
- remove or visually collapse repeated `View detail`
- show one external link with a specific label when useful, such as `GitHub`, `Marketing site`, `Live app`, or the host name

This follows the existing quiet index direction and avoids turning the catalog into a button wall.

### Decision: Make link text specific where repetition currently hurts scanning

Writing cards should not rely on repeated visible `Read essay` labels as the only link text. Preferred patterns:

- make the essay title the primary link, with no extra repeated action link; or
- keep a small action link but set accessible text such as `aria-label="Read essay: {title}"`.

Recommendation: title-as-link is cleaner and closer to the portfolio's editorial direction.

### Decision: Treat TradeSpec as the flagship proof page

TradeSpec should receive the strongest content polish first because it proves product judgment, domain understanding, customer workflow thinking, and AI product execution better than a generic tool catalog row. Its detail page should include:

- what it is
- who it is for
- what problem it solves
- what the workflow/output looks like
- what product boundaries make it credible
- what is public vs private
- links to the marketing site and any safe public surfaces

TradeSpec must not claim public self-serve availability, funding/customer details, or adoption metrics unless those claims are already supported and approved.

### Decision: Keep `llms.txt` discoverable but make `robots.txt` standards-clean

The site can continue exposing `/llms.txt` and advertising it with `<link rel="alternate" type="text/plain" href="/llms.txt">`. `robots.txt` should contain only standard crawler directives and comments. If the LLM summary is referenced there, make it a comment, not a key-value directive, so validators and production audits do not flag it as invalid.

### Decision: Add intentionally designed not-found behavior

Removed routes such as `/jarvis` should not redirect to unrelated pages or feel broken. Add a custom not-found page that:

- matches the quiet founder system
- clearly says the page does not exist
- offers Work, Writing, and Contact routes
- preserves a real 404 status in production

### Decision: Add composed social preview assets without overbuilding

Page-specific OG images should prioritize the pages most likely to be shared or inspected:

- homepage
- Work catalog
- TradeSpec
- Microcanvas
- OpenSpec Studio
- optionally Writing

These can be static SVGs or generated PNG/JPG assets, as long as they look intentional, load reliably, and do not introduce brittle runtime generation. Keep copy short and consistent with site positioning.

### Decision: Optimize demo poster assets, not the whole media pipeline

The current demo videos are reasonable in size and use `preload="none"`, which is correct. The main performance refinement is poster delivery:

- create smaller poster derivatives close to rendered dimensions
- set explicit width/height/aspect ratio to prevent shift
- keep videos click-to-play with controls
- preserve captions/transcript-ready structure if narration exists later

Do not add external video hosting unless local assets become too large or deployment limits require it.

Current media limitations to preserve honestly:

- Microcanvas, OpenSpec Studio, and Spec UI have ready demo videos and optimized poster derivatives.
- TradeSpec, OpenRank, and WireFlow use public product-surface screenshots because ready demo videos are not available.
- Eat does not receive a screenshot because the previous public deployment currently returns a missing deployment response; keep the source link only.
- Captions/transcripts are not shipped yet. Keep the markup transcript-ready without claiming accessibility assets that do not exist.
- CLI/private/early tools without safe public visuals should omit media sections instead of rendering placeholder copy.

### Decision: Remove standalone Decisions sections from detail pages

Project detail pages should not expose a separate `Decisions` section. It makes each page feel more like an internal build memo than a clean public proof page. If a product or technical choice is important, it should be reflected once in the relevant story copy, problem framing, workflow, or output section.

## Risks / Trade-offs

- Placeholder removal can make some detail pages feel thinner → Preserve useful problem/decision/link sections so pages remain complete without demo media.
- TradeSpec copy can overclaim if written like a sales page → Keep claims specific, truthful, and bounded by current public/private status.
- OG image work can become design rabbit-hole work → Limit first pass to reusable templates and high-value pages.
- Removing generic action labels can make actions less visually obvious → Preserve clear hover/focus states and ensure the title link affordance is discoverable.
- `llms.txt` tracking is SSR-backed and may not exist in static-only local serving → Verify production build and Vercel behavior separately from simple static-server checks.
- Lighthouse in Astro dev mode can show Vite/dev-toolbar noise → Run audits against built output, Vercel preview, or a production-like server when using scores for decisions.

## Migration Plan

1. Implement content/UI polish behind the existing routes and component APIs where possible.
2. Preserve existing URLs and canonical behavior for `/`, `/tools`, `/tools/[slug]`, `/writing`, `/robots.txt`, and `/llms.txt`.
3. Add custom 404/not-found behavior without redirecting removed pages to unrelated content.
4. Update generated/static assets and metadata.
5. Run validation and browser QA before deploying.
6. If deployment reveals a Vercel-specific issue, rollback by reverting this change; no data migration is involved.

## Open Questions

- Which pages should receive custom OG images in the first implementation pass if time is constrained? Recommended minimum: home, Work, TradeSpec, Microcanvas, OpenSpec Studio.
- Should detail pages without media omit the demo section entirely or use a low-emphasis "No public demo yet" note? Recommended default: omit unless the missing demo context is useful to the reader.
- Should the favicon/app icon set be expanded in this change? Recommended: include only if quick and consistent; do not let icon polishing displace higher-value proof-page work.
