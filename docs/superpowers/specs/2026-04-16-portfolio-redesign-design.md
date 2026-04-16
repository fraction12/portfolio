# Portfolio redesign — The Signal Desk

**Date:** 2026-04-16
**Author:** Dushyant Garg (with Claude, brainstormed)
**Status:** Approved design, ready for implementation planning
**Supersedes:** existing `src/` under `portfolio/`

---

## 1. Goals

Redesign the personal site to position the author for a career switch to **Product Builder**, **AI Applied Research**, or **Agent Wizard / founder-adjacent** roles (in that priority order).

The new site must:

1. **Prove velocity at first glance.** The reader should see, within 400ms of landing, that this person ships constantly. Numbers, not adjectives.
2. **Earn its mythos through instrumentation, not decoration.** No named fake agent rosters, no cockpit theming for theming's sake. Every metric on the page must be derivable from `git log`, a public API, or the repo itself.
3. **Read cleanly for a dyslexic brain.** Typography and sizing are tuned for maximum letter differentiation and comfortable reading.
4. **Feel singular.** A committed aesthetic — not a generic dark-SaaS template, not a whimsical wizard site, not an editorial magazine. One thesis, executed with discipline.

## 2. Non-goals

- Not a blog platform redesign — essays continue to live on Substack; the site pulls them.
- Not a real-time dashboard — "live" means "updated every few hours via build", not WebSocket streaming.
- Not a case-study portfolio — no "The Challenge / My Role / Outcome" case studies. Projects are cards with a sentence.
- Not a CMS. Content comes from Markdown + RSS + public APIs. No admin UI.
- No agent chrome for its own sake. If it isn't derivable, it doesn't go on the page.

## 3. Target audience & positioning

| Priority | Role | What they care about | Where on the site |
|---|---|---|---|
| **A** (primary) | Product Builder at AI startup / scaleup | Shipping velocity, taste, range (PM + eng) | Hero numerals, heatmap, artifact grid, stream tape |
| **B** (secondary) | AI Applied Research lead | Depth of thinking, novel approaches, artifacts that look like research | Writing section, dispatch inset, beliefs |
| **C** (flavor) | Founder / staff eng who deploys agents | Someone who lives inside the agent stack | Grounded agent references, dispatch mythos, stream tags |

**One-sentence thesis:** *I ship at the pace of agents.*

Identity claim (I operate in this space), velocity claim (agents are fast, so am I), positioning claim (hire someone who works at this tempo). The sub-copy backs it up with grounded evidence.

## 4. Aesthetic direction — "The Signal Desk"

**Mood:** dark factory, operator's voice, disciplined restraint. Not editorial, not whimsical, not generic SaaS.

**Palette** (CSS custom properties):

```
--ink:      #07090f   /* near-black, very slightly blue */
--ink-1:    #0b0f18   /* panel backgrounds */
--ink-2:    #10141e   /* panel hover */
--ivory:    #f2eee6   /* primary text, warm white */
--ivory-2:  #d4cfc3   /* secondary text */
--dim:      #8a8f9d   /* metadata, labels */
--dim-2:    #5a5f6c   /* barely-there text */
--line:     rgba(242,238,230,0.07)   /* quiet dividers */
--line-2:   rgba(242,238,230,0.14)   /* structural borders */
--signal:   #ff8a4c   /* warm amber — the only brand color */
--pulse:    #7de2a3   /* live/on indicator */
--hot:      #ff5b5b   /* alerts, reverts */
--cold:     #6ca8ff   /* prod / deploy events */
```

No gradients. No glows beyond the 6–10px amber ticks and pulse halos. The ink blue keeps the palette from reading as generic "dark mode."

**Typography:**

- **Display** (hero line, section titles, artifact titles, writing titles, big numerals, belief quotes): **Fraunces** — variable serif, `opsz` 144 for display sizes, 72 for numerals. Used only at >= 1.25rem. Italic in signal amber is the primary emphasis mechanism.
- **Body / UI**: **Atkinson Hyperlegible** — purpose-built by the Braille Institute for high letter differentiation. Base size **15.5px**, line-height **1.7**. Bold (700) is the secondary emphasis mechanism (italic is avoided in body for dyslexic readability).
- **Data / Mono**: **JetBrains Mono** — restricted to actual data: timestamps, tag pills, commit hashes, stack labels, status strip, metric sub-captions. **Not used for body copy anywhere.**

**Motion (intentionally minimal):**

- Pulse-dot breathing (~1.8s) on `.pulse` indicators
- Blinking cursor (~1.1s) on the hero kicker
- Subtle scan-grid CSS overlay (80–96px vertical lines at 1.6% opacity) for "factory floor" texture
- Per-row hover indent on stream/writing rows
- No parallax, no scroll-jacking, no large animated illustrations

**Responsive breakpoints:**

- `≤ 1080px`: hero collapses to single column; artifact grid → 2 col; beliefs grid → 2 col; numerals → 2×2
- `≤ 640px`: nav links hidden (mobile nav is just mark + status strip); artifact/beliefs → 1 col; writing rows → stacked

## 5. Information architecture

**Top-level pages:**

| Path | Purpose | Status |
|---|---|---|
| `/` | Home — Signal Desk (all sections on one scroll) | rebuild |
| `/artifacts` | Full projects index (deeper than the home card set) | rebuild (replaces `/projects`) |
| `/writing` | Full Substack-synced essay list | restyle |
| `/stream` | Full unified tape — all entries reverse-chron | new |
| `/beliefs` | Existing manifesto page | restyle |
| `/jarvis` | Dispatch archive (all log entries) | restyle |
| `/colophon` | "What's derived from where" — grounding page: lists every metric on the site with its source, fetch frequency, last-refresh timestamp, and a link to the fetcher source file in the repo. This is the honesty proof. | new |

**Top nav (5 items, Index-first):** Index · Artifacts · Writing · Stream · Beliefs

**Off-nav but linked:** Jarvis (from dispatch inset), Colophon (from footer).

## 6. Home page structure

The home page is a single scroll. Every section has a numbered section header (`§ NN · <name>`) with a right-side meta tag.

### 6.1 Sticky nav bar

- Left: mark (author name in Fraunces + pulse dot, status = repo-live)
- Center: **live status strip** (4 mono stats): `Repo · live · last commit Nm ago` · `Shipped 30d · N` · `Commits 7d · N` · `Downloads 30d · N`
- Right: nav links

### 6.2 Hero

Two-column grid, `1fr 1.1fr`:

- **Left:** kicker (`Product builder · Applied AI research` in amber mono) → Fraunces hero line (`I ship at the *pace* of agents.`) → body sub-copy → 5 CTA links (primary amber button "See what I ship →", plus GitHub, Substack, LinkedIn, npm)
- **Right:** heatmap block:
  - `Commit tape · last 182 days` header (mono)
  - 26-column × 7-row CSS grid of colored cells (5 intensity levels, today cell outlined). Represents **six months** (~182 days) of activity — matches the hero sub-copy phrase "six months of real commits."
  - Legend strip: date anchors + "less → more" scale
  - Below: 4-cell numerals panel in a bordered grid (Commits 30d, Packages 30d, Stars all repos, Downloads 30d). Fraunces 2.6rem numerals. Mono sub-captions with deltas.

**Hero copy (locked):**

- **Kicker:** `Product builder · Applied AI research`
- **Line:** `I ship at the *pace* of agents.`
- **Sub:** `Applied AI research, shipped weekly. The graph on the right is six months of real commits — most happened while I was asleep. I run a one-person lab where agents do a lot of the typing and I do the thinking, the taste, and the cut. Everything on this page is grounded in ` + mono `git log`.

### 6.3 § 01 · What I ship

3-column bordered grid, one border-1px dividers only. Each artifact card:

- Top row: `NN · Lang · Kind` (mono) + status pill (`● Live` in pulse green, or `◐ In Dev` in signal amber)
- Fraunces italic title (e.g. `*Potato* v3`)
- 2–3 sentence description (Atkinson, max 44ch)
- Footer row anchored to bottom: stack labels (mono) + live metric (mono). Metrics that aren't wired yet render as dim italic `[pypi stats]`, `[gh stats]` — explicit placeholders, not faked data.

Launch set: Potato, Starglass, AgentTK, agentplan, OpenRank, agentrem, ClawK, AgentSense, Agent Office.

### 6.4 § 02 · What I think

Writing table (4-column grid): `date` · `entry-number` · `title + sub-blurb` · `read-time`. Titles in Fraunces, italic emphasis for 1–2 words in amber. Hover-indent animation, title turns signal amber.

Below the writing rows, a **dispatch inset**: 3-column bordered panel showing the latest `/jarvis/*.md` entry inline:

- Left rail: `Jarvis.log · Dispatch NNN · YYYY-MM-DD HH:MM UTC · Author: Jarvis · Commit: <short sha>`
- Middle: Fraunces title + 2–3 paragraph excerpt. `<em>` spans for italic amber emphasis. Bold for impact lines.
- Right rail: shift sidecar (Fraunces-less, mono): `Shift 4h 12m · +412/−184 loc · Next run <time>`.

### 6.5 § 03 · The tape

Unified reverse-chronological feed. Two row types:

**Shift-summary row** (every overnight window gets one): amber 3px left-border, slightly tinted background, 3-column grid:
- `<date> · overnight`
- `Shift summary — <short narrative of what happened>`
- `+N/−N loc · N commits · N PRs` (mono, amber bold accent)

**Entry row** (one per artifact/essay/log/prod event): 4-column grid:
- `date` (mono) · `TAG` (colored mono pill) · `title + sub` · `read-time or kind`
- Tag colors: `LOG` pulse, `SHIP` signal, `ESSAY` lilac, `PROD` cold-blue

Bottom: `See full tape · N entries →` button → links to `/stream`.

### 6.6 § 04 · Beliefs

4-cell bordered grid. Each cell:
- Mono kicker `Rule · 0N` (amber)
- Fraunces rule statement (1.25rem) with italic amber for the key word.

Four rules carry over from the existing beliefs page: MAP / Constraints / One ticket one turn / Next tired version.

### 6.7 Footer

- Left: `© 2026 Dushyant Garg · shipped at the pace of agents` + sub-line `site derived from this repo · last commit Nm ago · colophon →`
- Right: `GitHub · Substack · LinkedIn · Colophon`

## 7. Data sources & instrumentation

All data fetched at build time via Vercel deploys. Schedule: nightly cron rebuild + on-push rebuilds.

| Metric | Source | Fetcher | Cache policy |
|---|---|---|---|
| Commit heatmap (182d) | GitHub GraphQL `contributionsCollection` | `src/lib/data/github.ts` | Fetch on build; fallback JSON in repo if API fails |
| Commit count 7d / 30d | GitHub REST `/search/commits` per repo | `src/lib/data/github.ts` | Same |
| Repo stars aggregate | GitHub REST `/users/{user}/repos` | `src/lib/data/github.ts` | Same |
| npm downloads 30d | `api.npmjs.org/downloads/point/last-month/{pkg}` | `src/lib/data/npm.ts` | Same; list of packages hardcoded in config |
| PyPI downloads 30d | `pypistats.org/api/packages/{pkg}/recent` | `src/lib/data/pypi.ts` | Same |
| Substack essays | RSS at `dushyantg.substack.com/feed` | existing logic in `Writing.astro`, extracted to `src/lib/data/substack.ts` | Existing pattern |
| Jarvis dispatches | `src/content/jarvis/*.md` | Astro Content Collections | Native |
| Shift summaries | Local `git log --since='90 days ago' --pretty=fuller` parsing | `src/lib/data/shifts.ts` | Run at build; cluster commits within 4h gaps |
| Last-commit age | `git log -1 --format=%ct` | `src/lib/data/git.ts` | Run at build, frozen at deploy time; display "Nm ago" relative on client via small script |

**Auth:** GitHub GraphQL requires a token (`GITHUB_TOKEN` Vercel env var, read:user + public_repo). All other sources are anonymous.

**Rebuild cadence:** Vercel cron hits `/api/rebuild` hook every 6h. Target freshness ≤ 6h on every metric.

**Cache fallback strategy:** Each fetcher writes its last-good response to `src/data/snapshots/{source}.json`, committed by CI. If a fetch fails on the next build, the fetcher falls back to the snapshot (with a console warning).

## 8. Truth-grounding rules

These are non-negotiable:

1. **No agent roster.** The site names exactly one agent: **Jarvis**, and only as the commit-author of dispatches that actually exist in `/src/content/jarvis/`.
2. **No fabricated metrics.** If a data source is not wired, render the slot as a visually-distinct placeholder (`[pypi stats]` dim italic) — never as a made-up number.
3. **Every shift-summary row links to real commits.** The narrative is Claude-generatable; the numbers and dates must be derived.
4. **Every writing entry links to its Substack URL.** No orphan titles.
5. **The "last commit N ago" display is computed from the most recent commit SHA at build time.** A CI check fails the build if the computed age is > 7 days (stale-site guard).

## 9. Component breakdown

Replacement / new components under `src/components/`:

- `Nav.astro` (update): add status strip, restructure to 3-col grid
- `Hero.astro` (rewrite): 2-col layout with heatmap slot
- `CommitHeatmap.astro` (**new**): 26×7 CSS grid cell renderer
- `Numerals.astro` (**new**): 4-cell big-number panel
- `Artifact.astro` (**new**, replaces current `Card.astro` usage for projects): single artifact card with status pill, stack labels, metric footer
- `ArtifactGrid.astro` (**new**): the §01 bordered grid
- `WritingRow.astro` (**new**, replaces `Writing.astro` list): 4-col ledger row
- `DispatchInset.astro` (**new**): inline latest-Jarvis-dispatch panel
- `Tape.astro` (**new**): unified stream renderer with ShiftSummary and Entry subtypes
- `ShiftSummary.astro` (**new**): amber-bordered roll-up row
- `StreamEntry.astro` (**new**): individual tagged row
- `BeliefsGrid.astro` (**new**): 4-cell rule panel (lift content from existing page)
- `Footer.astro` (update): live last-commit line, colophon link

Data/fetcher modules under `src/lib/data/`:

- `github.ts` (**new**)
- `npm.ts` (**new**)
- `pypi.ts` (**new**)
- `substack.ts` (**new**, extracted from `Writing.astro`)
- `shifts.ts` (**new**)
- `git.ts` (**new**)

Config under `src/config/`:

- `packages.ts` (**new**): hardcoded list of package identities `{npm: [...], pypi: [...]}` and artifact metadata (name, description, repo, stack, status)
- `stream-sources.ts` (**new**): tag colors, merge rules

Fonts (update `Layout.astro` + Google Fonts `<link>`):

- Atkinson Hyperlegible 400 / 700 / 400 italic / 700 italic
- Fraunces 400 / 500 / 600 / 300 italic / 400 italic (opsz variable)
- JetBrains Mono 400 / 500 / 600

Existing removals:

- `src/styles/base.css` — replace palette and typography sections (keep the scroll-reveal + reduced-motion blocks)
- `src/components/JarvisSpotlight.astro` — absorbed into `DispatchInset.astro`
- `src/components/Pill.astro` — retire or refactor (artifact cards use a different pill style)

## 10. Build & deploy

- **Framework:** Astro 5 (unchanged)
- **Deploy target:** Vercel (unchanged)
- **Build command:** `astro build` (unchanged)
- **New env vars:** `GITHUB_TOKEN` (read-only scope)
- **New Vercel cron:** `0 */6 * * *` (every 6h, top of hour) → `POST /api/rebuild` → triggers `vercel redeploy --prod`
- **Snapshots:** `src/data/snapshots/*.json` committed by CI using a GitHub Action that runs post-build and commits diffs

## 11. Risks & open questions

| Risk | Mitigation |
|---|---|
| GitHub GraphQL auth token expires / rate-limited | Snapshot fallback; log warning; alert via GitHub issue auto-opened by CI |
| PyPI download stats occasionally unavailable | Use `pypistats.org` API with a 2× retry + snapshot fallback |
| npm download counts are sometimes inaccurate | Accept the noise; add a colophon note "npm stats can lag ~24h" |
| Shift-summary heuristic (4h gap) may mis-cluster weekends | Iterate on the heuristic after seeing real output; consider manual overrides in a `shifts-overrides.json` |
| Fraunces at body weight may be harder for dyslexia even at smaller display sizes | Fraunces is restricted to >= 1.25rem by rule; Atkinson handles everything below |
| Placeholders visible for weeks if fetchers land slowly | This is the correct honesty posture; ship the UI with placeholders rather than delay the redesign |

**Open questions (resolve before implementation):**

- [ ] Confirm `GITHUB_TOKEN` scope and storage on Vercel
- [ ] Decide whether to keep `src/pages/projects.astro` as a redirect to `/artifacts` or delete
- [ ] Agree on the shift-summary 4h-gap heuristic or alternative
- [ ] Confirm that `/jarvis` log keeps its current path (yes by default)

## 12. Out of scope

- Switching frameworks (staying on Astro)
- Adding a CMS or admin UI
- Building a real-time update channel (WebSockets, SSE)
- Blog engine — Substack remains the CMS for essays
- OG image regeneration per page — keep existing static `og-default.svg`
- SEO optimizations beyond the existing `<head>` in `Layout.astro`

## 13. Success criteria

The redesign ships when:

1. All 7 pages render with the new palette, typography, and layout.
2. Hero heatmap, numerals, and status strip render real data from at least: GitHub (heatmap + commits + stars) and Substack. npm and PyPI may land in a follow-up and show placeholders meanwhile.
3. Dispatch inset renders the latest Jarvis entry automatically on every build.
4. Stream tape renders with at least 30 days of git-log-derived shift summaries and real essay/ship/log entries.
5. Lighthouse accessibility score ≥ 95 on the home page (contrast, font sizing).
6. Page weight (uncompressed) ≤ 200KB including fonts.
7. Renders cleanly on desktop (1440w), laptop (1280w), tablet (900w), and phone (390w).
