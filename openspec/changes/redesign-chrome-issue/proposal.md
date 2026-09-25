## Why

Dushyant is now an AI product engineer and builder at Surround Sound Media, not a Product Manager, and the portfolio's audience is people who want to see his taste and his work, not only recruiters. The dark "Quiet Index" design read as a tidy developer portfolio. This change gives the site a distinct visual identity drawn from his moodboard (chrome fashion editorial, Gucci Flora botanical painting, cinematic night light) while keeping the copy restrained.

## What Changes

- New visual system ("Chrome Issue"): plaster ground, ink type, a wide variable display face (Anybody) for headings, Hanken Grotesk for body, Martian Mono for labels, chrome-gradient lettering for the biggest type.
- New homepage:
  - a chrome masthead
  - a plaster arched window onto a night garden painted in the manner of Accornero's Flora print (layered canvases with parallax and gentle sway)
  - two chrome balloon stars (three.js, loaded on demand)
  - a dark "Work" screening room of film stills with one plain subtitle each
  - About, Writing (titles and dates) and an email-led contact
- Positioning updated everywhere it is stated: layout meta, JSON-LD (`jobTitle`, `worksFor`), `llms.txt`.
- Restrained copy: no datelines, invented quotes, or magazine gimmicks; page titles are "Work" and "Writing".
- Nav and footer simplified; the dot-field nav animation is removed.
- Removed components only the old homepage used: `Hero`, `FlagshipWorkCard`, `WritingBlock`, `Contact`, `GithubActivity`.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `portfolio-homepage-positioning`: the first viewport identifies Dushyant as an AI product engineer at Surround Sound Media.
- `portfolio-site-redesign`: the site uses the Chrome Issue visual system and the homepage cover, screening room and restrained copy.

## Impact

- Pages: `src/pages/index.astro`, `src/pages/tools.astro`, `src/pages/writing.astro`; all pages inherit the new tokens.
- Components: new `CoverHero.astro`, `WorkReel.astro`; rewritten `Nav.astro`, `Footer.astro`.
- Scripts: new `src/scripts/garden.js`, `src/scripts/chrome-stars.js`.
- Styles: `tokens.css`, `base.css`, `btn.css`, `card.css`, `nav.css`, `footer.css`.
- Dependencies: adds `three` (loaded with a dynamic import on the homepage only).
