## Context

The portfolio now has a calmer editorial foundation and a proof hierarchy, but the next weakness is credibility depth rather than visual noise alone. The homepage still needs a sharper first-viewport claim, Work screenshots come from different sources with different crops, detail pages still feel partly like structured catalog entries, and Writing still behaves more like a feed than a curated evidence surface.

The target reader is a serious product/startup evaluator: someone deciding quickly whether Dushyant has the taste, judgment, and shipping history to build useful AI products and systems. The implementation should keep the current restrained visual system and avoid reintroducing dashboards, fake-live labels, decorative metrics, or hype.

## Goals / Non-Goals

**Goals:**
- Make the homepage first viewport answer: who is this, what does he build, who is it for, and why should I believe it?
- Turn flagship project detail pages into concise product case studies with clear proof order.
- Make ready screenshots and demos inspectable on detail pages while keeping Work-card media visually consistent.
- Lead Writing with thesis-aligned essays and provide lower-priority access to the broader archive.
- Add a clearer contact path after Work/detail proof without turning the site into a sales landing page.
- Preserve the existing OpenSpec, Astro, static asset, and design-token patterns.

**Non-Goals:**
- No new content management system.
- No new analytics/event tracking.
- No runtime image-generation or screenshot-generation dependency.
- No external writing API redesign beyond filtering/curation of existing fetched/snapshot essays.
- No claim of customer metrics, adoption, funding, or availability unless already approved in public copy.
- No major route migration; `/tools` remains the Work route unless handled by a separate routing change.

## Decisions

### Keep the current editorial system and deepen the hierarchy

Use the existing light-first editorial design system, section split layout, restrained borders, and plain-spoken tone. The problem is not that the system needs more decoration; it needs sharper information hierarchy.

Alternative considered: introduce a more startup/landing-page hero with stronger graphics and visual drama. Rejected because the user explicitly wants seriousness and belief in the first ten seconds without cringe.

### Treat the portrait as optional proof, not mandatory decoration

The hero should either use an intentional professional portrait treatment or reduce/remove the portrait from first-viewport priority. A casual image can create warmth, but if it undercuts the Sam Altman/Richard Hendricks seriousness target, the design should privilege the claim and proof path.

Alternative considered: keep the image unchanged and rely on copy fixes. Rejected because the first viewport is a credibility system; weak visual cues still affect trust.

### Use one media treatment for cards and a different proof treatment for detail pages

Flagship Work cards should normalize screenshot sources through a consistent frame, aspect ratio, and crop. Detail pages should make screenshots inspectable, likely using contained media or a larger proof frame where important UI is not cropped.

Alternative considered: use `object-fit: cover` everywhere for visual neatness. Rejected because detail pages need proof media readers can inspect.

### Introduce case-study content roles without building a complex CMS

Extend the existing `tool-details.ts` model enough to support richer case-study sections for flagship projects. Use structured section labels such as `Problem`, `Ownership`, `Product decision`, `What shipped`, and `What it proves` where appropriate. Supporting projects can keep shorter sections.

Alternative considered: create a markdown/content collection for case studies. Deferred because the current config-driven model is sufficient for this pass and keeps the diff smaller.

### Curate Writing with an explicit filter or curated list

Writing should lead with selected essays that reinforce the portfolio thesis. The implementation can use a curated title/URL/date allowlist, a tag-like local metadata map, or a small ranking function over fetched essays. The curated surface should not imply it is the full feed; provide a lower-priority Substack/archive link.

Alternative considered: leave Writing as raw chronological feed. Rejected because chronological freshness is less important than credibility fit for this portfolio.

### Add proof-adjacent contact without duplicating contact prose

Add compact contact actions after Work and/or detail page proof. Reuse the existing email/contact pattern, but keep copy short and navigational.

Alternative considered: add a persistent contact CTA to every section. Rejected because it would add noise and make the site feel salesy.

## Risks / Trade-offs

- First-viewport copy may become too generic if over-tightened -> verify by reading only the hero and asking whether the specific AI product/system thesis is still clear.
- Removing or de-emphasizing the portrait may make the page feel less personal -> retain identity through name, tone, and footer/profile links.
- More case-study structure may make pages longer -> apply richer narrative only to flagship projects and keep supporting pages concise.
- Curating Writing may hide recent posts -> label the list as selected writing and keep a lower-priority archive path.
- Contained screenshots may feel less visually polished than cropped cards -> use contained media only on detail proof surfaces; keep normalized cropping on Work cards.
- Local dev verification can refresh live-data snapshots -> explicitly restore generated snapshot churn unless a task intentionally changes snapshot data.

## Migration Plan

1. Update copy/data structures first: hero copy, writing curation metadata, detail-page section roles, and flagship designation.
2. Update visual components: hero portrait treatment, Work media frame, detail media frame, and proof-adjacent contact module.
3. Validate rendered routes locally across desktop and mobile.
4. Run `npm test`, `npm run build`, `git diff --check`, and `openspec validate strengthen-portfolio-case-study-credibility --json`.
5. Restore incidental snapshot timestamp/data churn produced by local verification unless it is intentionally part of the change.

Rollback is straightforward: revert the component/config changes and remove the new OpenSpec change before archive. No persistent data migrations are involved.

## Open Questions

- Should the current portrait be replaced with a more intentional image, de-emphasized, or removed entirely for this pass?
- Which essays should be considered thesis-aligned for the curated Writing lead?
- Which projects should be treated as flagship case studies beyond TradeSpec, OpenSpec Studio, Microcanvas, and agentplan?
