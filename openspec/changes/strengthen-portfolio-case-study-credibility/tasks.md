## 1. Content Decisions

- [ ] 1.1 Decide whether the current homepage portrait should be replaced, de-emphasized, or removed for the credibility pass.
- [ ] 1.2 Draft final homepage hero copy that states role, product focus, audience/context, and proof path within the first viewport.
- [ ] 1.3 Choose the curated Writing lead set and define whether the archive path is an external Substack link or an in-page/all-writing section.
- [ ] 1.4 Confirm the flagship case-study set for richer narrative treatment.

## 2. Homepage and Contact Path

- [ ] 2.1 Update the `Hero` component copy and portrait treatment to match the first-viewport credibility requirements.
- [ ] 2.2 Review homepage proof strip copy against the sharper hero so it adds evidence rather than repeating the same claim.
- [ ] 2.3 Add a restrained contact path after high-proof surfaces where needed, reusing the existing contact/email pattern without duplicating long prose.

## 3. Work Media System

- [ ] 3.1 Refine flagship Work card media styling so screenshots share consistent frame, aspect ratio, border, crop, and spacing rules.
- [ ] 3.2 Audit all ready project media assets for card suitability and adjust object positioning or asset choice where important content is poorly framed.
- [ ] 3.3 Ensure mixed website, app, and demo screenshots remain truthful while feeling visually cohesive.

## 4. Tool Detail Case Studies

- [ ] 4.1 Extend the tool detail content model or config data to support flagship case-study roles without breaking supporting detail pages.
- [ ] 4.2 Rewrite flagship detail sections around problem, ownership, product/system decision, shipped output, and what the work proves.
- [ ] 4.3 Keep supporting detail pages concise while preserving useful labels and truthful access/status boundaries.
- [ ] 4.4 Update detail media framing so screenshots and video posters are inspectable proof rather than decorative crops.
- [ ] 4.5 Remove or avoid any placeholder, fake proof, or low-credibility media sections for projects without ready proof assets.

## 5. Writing Curation

- [ ] 5.1 Implement curated writing selection using the smallest maintainable local data structure or filter.
- [ ] 5.2 Update `/writing` copy and layout so selected writing leads and the broader archive remains reachable at lower priority.
- [ ] 5.3 Verify each visible writing row still has a clear title, date, reading time, link purpose, and focus state.

## 6. Verification

- [ ] 6.1 Run `openspec validate strengthen-portfolio-case-study-credibility --json`.
- [ ] 6.2 Run `npm test`.
- [ ] 6.3 Run `npm run build`.
- [ ] 6.4 Run `git diff --check`.
- [ ] 6.5 Inspect `/`, `/tools`, `/writing`, `/tools/tradespec`, `/tools/openspec-studio`, `/tools/microcanvas`, `/tools/agentplan`, at least one supporting detail page, and one unknown route at desktop and mobile widths.
- [ ] 6.6 Check for horizontal overflow, clipped text, media framing problems, repeated copy, placeholder copy, and dark-mode regressions.
- [ ] 6.7 Restore incidental generated snapshot changes from local verification unless intentionally part of the implementation.
