# Quiet Founder Index Implementation Notes

Source-backed guardrails used for the redesign:

- Stanford Web Credibility: use professional visual design, clear contact access, restrained promotional copy, and avoid small errors.
- Nielsen Norman Group: remove irrelevant labels and metadata because they compete with useful information; use scale, contrast, balance, and a limited type system for hierarchy.
- GOV.UK design principles: start with the reader's need, do less, do the hard work to make it simple, and stay consistent without becoming uniform.
- WCAG 2.2: preserve visible focus, predictable navigation, readable contrast, reduced-motion behavior, and usable touch targets.
- Personal-site pattern study: the strongest founder/builder sites work as edited indexes of judgment, not dashboards of activity.

Implementation defaults:

- Public nav is brand, Work, Writing, Contact.
- `/tools` remains the route, but the public label is Work.
- `/jarvis` is not a public page.
- The default presentation is light-first editorial with restrained dark mode support.
- Homepage project proof appears once, through the Work section.
