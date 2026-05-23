## 1. Audit And Direction Lock

- [x] 1.1 Inventory all public routes, components, labels, CTAs, metadata, and repeated proof points
- [x] 1.2 Preserve `/tools` as the route while changing public navigation/page framing to Work
- [x] 1.3 Remove `/jarvis` as a public page and implement normal not-found behavior unless a temporary migration fallback is documented
- [x] 1.4 Set the public default presentation to light-first editorial styling with any dark mode kept restrained and non-terminal
- [x] 1.5 Document the source-backed guardrails from Stanford Web Credibility, Nielsen Norman Group, GOV.UK, WCAG 2.2, and the personal-site pattern study in implementation notes or PR summary

## 2. Design System

- [x] 2.1 Replace Signal Desk token naming and palette emphasis with Quiet Index design tokens
- [x] 2.2 Define consistent layout containers, section rhythm, typography roles, link states, focus states, and card treatments
- [x] 2.3 Simplify global background, borders, hover states, and motion so no decorative dashboard/glow language remains
- [x] 2.4 Update shared button, card, section, nav, footer, and form styles to use the new system
- [x] 2.5 Remove page-wide grid overlays, animated cursor personality, glow-heavy card hovers, slash suffixes, and terminal/cockpit affordances
- [x] 2.6 Verify type hierarchy uses a restrained set of roles and no surface relies on more than three obvious type sizes without a documented reason
- [x] 2.7 Verify focus states, contrast, reduced motion, and touch target spacing meet the accessibility quality bar

## 3. Information Architecture And Routing

- [x] 3.1 Simplify navigation labels and remove Home/Jarvis redundancy according to the approved IA
- [x] 3.2 Remove Jarvis from public navigation, footer, metadata, machine-readable summaries, and internal links
- [x] 3.3 Implement the approved `/jarvis` route strategy and remove unused Jarvis public components when safe
- [x] 3.4 Update page metadata, Open Graph copy, and identity schema to match the new positioning

## 4. Homepage Redesign

- [x] 4.1 Rebuild the homepage as an edited founder index: identity, selected work, writing, contact
- [x] 4.2 Remove duplicate selected-proof/selected-work surfaces so each project proof appears once on the page
- [x] 4.3 Rewrite homepage hero, CTAs, section labels, project copy, writing copy, and contact prompt
- [x] 4.4 Remove homepage install commands, package metrics, status pills, catalog counts, and duplicate social/contact blocks
- [x] 4.5 Verify the first viewport passes the first-10-second test for identity, role, work type, credibility, and next actions
- [x] 4.6 Verify homepage desktop and mobile layouts are calm, legible, and text-safe

## 5. Work Catalog Redesign

- [x] 5.1 Reframe `/tools` as the broader work/build catalog while preserving useful artifact data
- [x] 5.2 Redesign tool cards into quieter editorial build rows/cards with reduced metadata and no command-line dominance
- [x] 5.3 Simplify categories, category blurbs, metrics, install commands, and external links
- [x] 5.4 Ensure project descriptions are not duplicated from the homepage on the same page or repeated unnecessarily across catalog surfaces
- [x] 5.5 Confirm the Work page adds a different layer than the homepage: who it is for, what it does, and where to inspect it

## 6. Writing And Contact Redesign

- [x] 6.1 Rewrite `/writing` header, essay section, and subscription prompt with no repeated Substack value proposition
- [x] 6.2 Restyle writing rows/cards to match the quiet index design system
- [x] 6.3 Simplify contact and footer surfaces so social/contact links are not repeated multiple times on the same page
- [x] 6.4 Verify contact information is clear and easy to find without appearing in three competing places on the same page

## 7. Copy And Redundancy QA

- [x] 7.1 Search public source for noisy phrases: Signal Desk, selected proof, live public proof, dispatch, cockpit, cron, fake-live/status language, and slash-suffix labels
- [x] 7.2 Run a manual per-page redundancy audit and remove repeated claims, metrics, project descriptions, and contact prompts
- [x] 7.3 Verify all remaining labels and CTAs are plain, serious, and aligned with Product Manager / Builder positioning
- [x] 7.4 Verify no public copy claims Series A, funding scale, enterprise quality, or customer proof unless the claim is specific, truthful, and already supported
- [x] 7.5 Run a broken-link and typo pass for public pages because small errors directly undermine credibility

## 8. Validation

- [x] 8.1 Run `openspec validate redesign-quiet-founder-index --json`
- [x] 8.2 Run `npm test`
- [x] 8.3 Run `npm run build`
- [x] 8.4 Inspect homepage, work/tools page, writing page, and removed Jarvis behavior locally in desktop and mobile browser
- [x] 8.5 Capture or review browser screenshots at mobile and desktop widths and confirm no overlap, clipping, repeated proof surfaces, accidental nested cards, or blank states
- [x] 8.6 Confirm no unrelated generated snapshot churn is included in the final diff

## 9. Profile Image Follow-up

- [x] 9.1 Fetch the current GitHub profile image for `fraction12` and store it locally as a static asset
- [x] 9.2 Add the profile image to the homepage hero as a restrained identity cue
- [x] 9.3 Re-run OpenSpec validation, build, and browser screenshot QA for the updated hero

## 10. Contact Reliability Follow-up

- [x] 10.1 Restore a single primary `mailto:` contact action
- [x] 10.2 Keep the plain email address visible as the fallback
