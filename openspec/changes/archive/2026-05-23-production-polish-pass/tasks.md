## 1. Baseline Audit

- [x] 1.1 Review the current public route map for `/`, `/tools`, `/tools/[slug]`, `/writing`, `/robots.txt`, `/llms.txt`, `/jarvis`, and unknown routes
- [x] 1.2 Search public source and rendered pages for scaffold/noisy terms: `Demo slot`, `placeholder`, `TODO`, `Jarvis`, `Live public proof`, repeated `View detail`, and repeated `Read essay`
- [x] 1.3 Record the current detail pages with ready media and without ready media so demo handling can be changed without breaking Microcanvas or OpenSpec Studio
- [x] 1.4 Inspect current Work and Writing link structures and identify duplicated or generic link labels that need consolidation
- [x] 1.5 Inspect current metadata, Open Graph image usage, `robots.txt`, `llms.txt`, sitemap output, and not-found behavior before editing

## 2. Remove Unfinished Public Demo States

- [x] 2.1 Update the tool-detail content/rendering model so non-ready demo media does not render `Demo slot` as a public CTA
- [x] 2.2 Omit demo sections for tools without ready media unless a finished low-emphasis note is explicitly useful for that page
- [x] 2.3 Preserve `Watch demo` behavior, controls, poster support, and no-autoplay loading for ready demo pages
- [x] 2.4 Browser-check representative ready-video pages: `/tools/microcanvas` and `/tools/openspec-studio`
- [x] 2.5 Browser-check representative no-video pages, including `/tools/tradespec`, and confirm they do not feel visibly unfinished

## 3. Reduce Work And Writing Link Noise

- [x] 3.1 Refactor Work catalog cards/rows so the project title is the primary internal detail link when a detail page exists
- [x] 3.2 Remove or collapse redundant `View detail` links that duplicate the project-title destination
- [x] 3.3 Keep at most one secondary external action per Work item unless a project has a documented need for multiple public destinations
- [x] 3.4 Ensure external Work links use specific labels such as `GitHub`, `Marketing site`, `Live app`, package host, or domain name
- [x] 3.5 Refactor Writing cards/rows so essay titles are primary links or repeated action links have accessible names that include the essay title
- [x] 3.6 Verify keyboard focus states and link purposes for Work entries, Writing entries, nav links, footer links, and contact actions

## 4. Strengthen TradeSpec As Flagship Proof

- [x] 4.1 Rewrite `/tools/tradespec` hero and summary copy to clearly state what TradeSpec is, who it is for, and what workflow it supports
- [x] 4.2 Add or refine TradeSpec sections for problem, workflow, output/proof, public/private status, and safe external links
- [x] 4.3 Remove any generic catalog filler or unfinished demo language from TradeSpec
- [x] 4.4 Audit TradeSpec claims for truthfulness: no unsupported customer counts, funding claims, broad adoption, public self-serve availability, or private source/customer material
- [x] 4.5 Browser-check `/tools/tradespec` on desktop and mobile for readability, hierarchy, and credibility within the first screen

## 5. Clean Crawlability, Metadata, And Machine-Readable Surfaces

- [x] 5.1 Update `robots.txt` so it contains standards-clean crawler directives, sitemap reference, and no unknown non-comment `Llms-Txt` directive
- [x] 5.2 Preserve `/llms.txt` availability and standards-safe page discovery through existing alternate link metadata or equivalent
- [x] 5.3 Audit and update page titles, descriptions, canonical URLs, Open Graph tags, and Twitter tags for Home, Work, Writing, TradeSpec, Microcanvas, and OpenSpec Studio
- [x] 5.4 Remove stale public Jarvis references from metadata, `llms.txt`, internal links, and rendered public pages unless they are intentionally archival and non-navigational
- [x] 5.5 Verify `/robots.txt`, `/llms.txt`, and sitemap output after build

## 6. Add Social Preview And Icon Polish

- [x] 6.1 Create or generate composed social preview assets for the homepage, Work catalog, TradeSpec, Microcanvas, and OpenSpec Studio
- [x] 6.2 Wire page-specific `ogImage` values through the layout/page metadata without breaking existing fallbacks
- [x] 6.3 Confirm preview asset text is short, legible, and aligned with the quiet-founder design system
- [x] 6.4 Keep favicon/app icon support unchanged because the existing icon is consistent and higher-priority polish is complete
- [x] 6.5 Inspect built metadata or page source to confirm social image URLs resolve correctly

## 7. Add Intentional Not-Found Behavior

- [x] 7.1 Add a custom not-found page that matches the quiet founder visual system
- [x] 7.2 Ensure unknown routes provide clear links back to Work, Writing, and Contact
- [x] 7.3 Ensure `/jarvis` no longer re-enters the public portfolio concept and returns or renders not-found semantics
- [x] 7.4 Verify not-found behavior locally for `/jarvis` and at least one unknown path

## 8. Optimize Demo Media Delivery

- [x] 8.1 Generate appropriately sized poster derivatives for current ready videos, especially Microcanvas and OpenSpec Studio
- [x] 8.2 Update media markup or source paths so default layouts do not download poster images far larger than rendered dimensions
- [x] 8.3 Keep media frames dimensionally stable with explicit aspect ratio, width/height, or equivalent layout constraints
- [x] 8.4 Confirm videos still use controls, no autoplay, and low-bandwidth loading behavior
- [x] 8.5 Document any remaining media limitations, such as missing captions/transcripts or future hosting needs

## 9. Production Verification

- [x] 9.1 Run `openspec validate production-polish-pass --json`
- [x] 9.2 Run `npm test`
- [x] 9.3 Run `npm run build`
- [x] 9.4 Inspect representative pages in the browser: `/`, `/tools`, `/writing`, `/tools/tradespec`, `/tools/microcanvas`, `/tools/openspec-studio`, `/robots.txt`, `/llms.txt`, `/jarvis`, and one unknown route
- [x] 9.5 Run Lighthouse against built output: TradeSpec scored Performance 99, Accessibility 100, Best Practices 96, SEO 100. The remaining console items are local static-server 404s for Vercel Analytics/Speed Insights scripts that Vercel supplies in production.
- [x] 9.6 Run a final content QA pass for broken links, visible placeholders, repeated proof points, noisy labels, text clipping, horizontal overflow, focus visibility, and color contrast
- [x] 9.7 Update this task list truthfully as work is completed and leave any blocked verification explicit

## 10. Detail Page Simplification

- [x] 10.1 Remove the standalone `Decisions` section from all tool detail pages
- [x] 10.2 Verify representative tool detail pages still read cleanly without adding replacement labels or duplicated copy
