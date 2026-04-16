# Portfolio Signal Desk — Home Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the home page of the Astro portfolio as "The Signal Desk" — a dark-factory operator's dashboard, grounded in real `git log` / GitHub / npm / PyPI / Substack data, using Atkinson Hyperlegible + Fraunces typography.

**Architecture:** Astro 5 with typed data fetchers in `src/lib/data/*`, hardcoded config in `src/config/*`, and new composable components under `src/components/*`. Data is fetched at build time with JSON snapshot fallbacks committed to the repo. No backend runtime — everything is static HTML generated per deploy. Vitest runs unit tests against the pure data-parsing modules.

**Tech Stack:** Astro 5, TypeScript, Vitest, Atkinson Hyperlegible + Fraunces + JetBrains Mono (Google Fonts), Vercel deploy target, `node:child_process` `execFileSync` for local git parsing (argv-style — no shell interpolation).

**Scope of this plan:** Home page (`/`) end-to-end, plus a stub `/colophon` page and a restyled `/beliefs` page. The home page must render with real data from GitHub (when token present), Substack, Jarvis dispatches, and local-git shift summaries. `npm` / `pypi` fetchers are implemented but may show placeholders at launch. Sub-pages (`/artifacts`, `/writing`, `/stream`, `/jarvis`) and infrastructure (Vercel cron, snapshot CI, Lighthouse) are a follow-up plan.

**Reference mockup:** `docs/superpowers/mockups/2026-04-16-signal-desk-home.html` — locked visual source of truth.

**Spec:** `docs/superpowers/specs/2026-04-16-portfolio-redesign-design.md`

---

## File Structure

### New files

| Path | Responsibility |
|---|---|
| `src/config/packages.ts` | Canonical list of npm + pypi packages + artifact metadata |
| `src/config/stream-sources.ts` | Tag colors + shift-gap heuristic |
| `src/lib/data/git.ts` | Parse local `git log` via `execFileSync` |
| `src/lib/data/shifts.ts` | Cluster commits into shifts (4h gap) |
| `src/lib/data/substack.ts` | RSS parser (extracted from `Writing.astro`) |
| `src/lib/data/github.ts` | GitHub REST + GraphQL with snapshot fallback |
| `src/lib/data/npm.ts` | npm downloads fetcher |
| `src/lib/data/pypi.ts` | PyPI downloads fetcher |
| `src/lib/data/index.ts` | `loadSignalData()` aggregator |
| `src/data/snapshots/github.json` | Initial snapshot stub |
| `src/data/snapshots/npm.json` | Initial snapshot stub |
| `src/data/snapshots/pypi.json` | Initial snapshot stub |
| `src/components/StatusStrip.astro` | Live stats row in the nav |
| `src/components/CommitHeatmap.astro` | 26×7 commit calendar |
| `src/components/Numerals.astro` | 4-cell big-number panel |
| `src/components/Artifact.astro` | Single artifact card |
| `src/components/ArtifactGrid.astro` | 3-col bordered grid |
| `src/components/WritingRow.astro` | 4-col ledger row |
| `src/components/WritingBlock.astro` | Writing rows composer |
| `src/components/DispatchInset.astro` | Latest-Jarvis inline panel |
| `src/components/StreamEntry.astro` | Single tagged row |
| `src/components/ShiftSummary.astro` | Amber-bordered rollup row |
| `src/components/Tape.astro` | Unified stream renderer |
| `src/components/BeliefsGrid.astro` | 4-cell belief panel |
| `src/components/SectionHead.astro` | Numbered `§ NN · name · meta` |
| `src/pages/colophon.astro` | Metric-source table |
| `tests/lib/data/shifts.test.ts` | Shift clustering tests |
| `tests/lib/data/substack.test.ts` | RSS parsing tests |
| `tests/lib/data/git.test.ts` | git log parser tests |
| `vitest.config.ts` | Vitest config |

### Modified files

| Path | Change |
|---|---|
| `.gitignore` | Add `.superpowers/` |
| `package.json` | Add vitest + test scripts |
| `src/styles/base.css` | Replace palette, type, overlay |
| `src/layouts/Layout.astro` | Swap Google Fonts link |
| `src/components/Nav.astro` | Add status strip + new structure |
| `src/components/Footer.astro` | Live last-commit + colophon link |
| `src/components/Hero.astro` | Full rewrite: 2-col with heatmap |
| `src/pages/index.astro` | Compose new components |
| `src/pages/beliefs.astro` | Use `BeliefsGrid` |
| `src/content.config.ts` | Extend Jarvis schema with optional fields |

### Deleted files

| Path | Reason |
|---|---|
| `src/components/JarvisSpotlight.astro` | Absorbed into `DispatchInset.astro` |

---

## Phase 0 · Setup

### Task 0.1: Add `.superpowers/` to `.gitignore`

**Files:**
- Modify: `.gitignore`

- [ ] **Step 1: Read current .gitignore**

Run: `cat .gitignore 2>/dev/null || echo "(missing)"`

- [ ] **Step 2: Append entry**

Append to `.gitignore`:

```
# brainstorm visual companion workspace
.superpowers/
```

- [ ] **Step 3: Commit**

```bash
git add .gitignore
git commit -m "chore: ignore .superpowers brainstorm workspace"
```

---

### Task 0.2: Install Vitest + add scripts

**Files:**
- Modify: `package.json`
- Create: `vitest.config.ts`

- [ ] **Step 1: Install dev deps**

Run:

```bash
npm install --save-dev vitest
```

- [ ] **Step 2: Add test scripts**

Edit `package.json` `"scripts"`:

```json
{
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview",
    "astro": "astro",
    "test": "vitest run",
    "test:watch": "vitest"
  }
}
```

- [ ] **Step 3: Create `vitest.config.ts`**

Create `vitest.config.ts`:

```typescript
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['tests/**/*.test.ts'],
    environment: 'node'
  }
});
```

- [ ] **Step 4: Verify**

Run: `npm test`
Expected: exit 0 with "No test files found".

- [ ] **Step 5: Commit**

```bash
git add package.json package-lock.json vitest.config.ts
git commit -m "chore: add vitest for data-layer tests"
```

---

### Task 0.3: Scaffold directories

**Files:**
- Create: `src/lib/data/`, `src/config/`, `src/data/snapshots/`, `tests/lib/data/` with `.gitkeep`

- [ ] **Step 1: Create**

```bash
mkdir -p src/lib/data src/config src/data/snapshots tests/lib/data
touch src/lib/data/.gitkeep src/config/.gitkeep src/data/snapshots/.gitkeep tests/lib/data/.gitkeep
```

- [ ] **Step 2: Commit**

```bash
git add src/lib src/config src/data tests/lib
git commit -m "chore: scaffold data + config + tests dirs"
```

---

## Phase 1 · Palette & typography

### Task 1.1: Swap Google Fonts

**Files:**
- Modify: `src/layouts/Layout.astro:44-46`

- [ ] **Step 1: Replace the fonts link**

In `src/layouts/Layout.astro`, replace the existing `<link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono..." ... />` block with:

```html
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible:ital,wght@0,400;0,700;1,400;1,700&family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;0,9..144,600;1,9..144,300;1,9..144,400&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet" />
```

- [ ] **Step 2: Verify build**

Run: `npm run build`
Expected: success.

- [ ] **Step 3: Commit**

```bash
git add src/layouts/Layout.astro
git commit -m "feat(type): Atkinson Hyperlegible + Fraunces + JetBrains Mono"
```

---

### Task 1.2: Replace palette in `base.css`

**Files:**
- Modify: `src/styles/base.css:1-33` and body/heading declarations

- [ ] **Step 1: Replace the `:root` block**

Replace the `:root { ... }` block at the top of `src/styles/base.css` with:

```css
:root {
  --ink: #07090f;
  --ink-1: #0b0f18;
  --ink-2: #10141e;
  --ink-3: #151a26;
  --ivory: #f2eee6;
  --ivory-2: #d4cfc3;
  --dim: #8a8f9d;
  --dim-2: #5a5f6c;
  --line: rgba(242,238,230,0.07);
  --line-2: rgba(242,238,230,0.14);
  --line-3: rgba(242,238,230,0.22);
  --signal: #ff8a4c;
  --signal-deep: #ec6c4b;
  --pulse: #7de2a3;
  --hot: #ff5b5b;
  --cold: #6ca8ff;

  /* legacy aliases — keep existing pages rendering during migration */
  --bg: var(--ink);
  --accent: var(--signal);
  --accent-dim: rgba(255,138,76,0.15);
  --amber: var(--signal);
  --amber-dim: rgba(255,138,76,0.12);
  --text: var(--ivory);
  --border: var(--line);
  --border-hover: rgba(255,138,76,0.35);
  --card-bg: rgba(255,255,255,0.025);

  --gutter: 2rem;
  --max-w: 1320px;
  --max-w-narrow: 780px;
  --nav-height: 60px;

  --display: 'Fraunces', Georgia, serif;
  --body: 'Atkinson Hyperlegible', system-ui, -apple-system, sans-serif;
  --mono: 'JetBrains Mono', ui-monospace, monospace;

  --font-body: var(--body);
  --font-code: var(--mono);

  --fs-h1: clamp(2.8rem, 6vw, 5.6rem);
  --fs-h2: clamp(1.9rem, 3.4vw, 2.6rem);
  --fs-h3: 1.55rem;
  --fs-h4: 1.15rem;
  --fs-body: 15.5px;
  --fs-small: 13px;
  --fs-caption: 11.5px;
  --lh-tight: 1;
  --lh-body: 1.7;
}
```

- [ ] **Step 2: Replace the `body { ... }` block**

Replace the existing body rule (around lines 40-48) with:

```css
body {
  background: var(--ink);
  color: var(--ivory);
  font-family: var(--body);
  overflow-x: hidden;
  line-height: var(--lh-body);
  font-size: var(--fs-body);
  -webkit-font-smoothing: antialiased;
}
```

- [ ] **Step 3: Replace heading rules**

Replace the existing `h1, .h1 { ... }` through `h4, .h4 { ... }` with:

```css
h1, .h1 { font-family: var(--display); font-size: var(--fs-h1); line-height: 0.98; font-weight: 400; letter-spacing: -0.03em; font-variation-settings: "opsz" 144; }
h2, .h2 { font-family: var(--display); font-size: var(--fs-h2); line-height: 1.1; font-weight: 500; letter-spacing: -0.025em; font-variation-settings: "opsz" 144; }
h3, .h3 { font-family: var(--display); font-size: var(--fs-h3); line-height: 1.2; font-weight: 500; letter-spacing: -0.02em; font-variation-settings: "opsz" 144; }
h4, .h4 { font-family: var(--display); font-size: var(--fs-h4); line-height: 1.3; font-weight: 500; letter-spacing: -0.015em; font-variation-settings: "opsz" 144; }
em { font-style: italic; color: var(--signal); font-weight: 300; }
strong, b { font-weight: 700; color: var(--ivory); }
```

- [ ] **Step 4: Replace noise overlay with vertical scan grid**

Replace the `body::before { ... }` block with:

```css
body::before {
  content: '';
  position: fixed;
  inset: 0;
  z-index: 1;
  pointer-events: none;
  background-image: linear-gradient(to right, rgba(242,238,230,0.016) 1px, transparent 1px);
  background-size: 96px 96px;
}
```

- [ ] **Step 5: Verify visually**

Run: `npm run dev`, visit `http://localhost:4321/`.
Expected: palette has shifted (amber + ivory on deep ink). Type may still be off — that's fine. Kill with Ctrl-C.

- [ ] **Step 6: Commit**

```bash
git add src/styles/base.css
git commit -m "feat(palette): Signal Desk palette + display type scale"
```

---

### Task 1.3: Append utility classes

**Files:**
- Modify: `src/styles/base.css` (append to end)

- [ ] **Step 1: Append**

Append to the end of `src/styles/base.css`:

```css
/* ============================================================
   SIGNAL DESK UTILITIES
   ============================================================ */
.mono { font-family: var(--mono); }
.eyebrow { font-family: var(--body); font-size: 12px; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; color: var(--dim); }
.label { font-family: var(--mono); font-weight: 500; font-size: 11.5px; letter-spacing: 0.1em; text-transform: uppercase; color: var(--dim); }

.container-wide { max-width: var(--max-w); margin: 0 auto; padding: 0 var(--gutter); }

.section-head {
  padding: 56px 0 22px;
  display: grid;
  grid-template-columns: 90px 1fr auto;
  gap: 28px;
  align-items: baseline;
  border-top: 1px solid var(--line-2);
}
.section-head .sh-num { color: var(--signal); font-family: var(--mono); font-size: 12px; font-weight: 500; letter-spacing: 0.14em; }
.section-head .sh-name { font-family: var(--display); font-weight: 500; font-size: var(--fs-h2); letter-spacing: -0.025em; font-variation-settings: "opsz" 144; }
.section-head .sh-name em { font-style: italic; font-weight: 300; color: var(--signal); }
.section-head .sh-meta { color: var(--dim); font-size: 13px; max-width: 40ch; text-align: right; }

@media (max-width: 640px) {
  .section-head { grid-template-columns: 1fr; gap: 8px; }
  .section-head .sh-meta { text-align: left; }
}

::selection { background: var(--signal); color: var(--ink); }
```

- [ ] **Step 2: Commit**

```bash
git add src/styles/base.css
git commit -m "feat(base): utility classes for mono, eyebrow, section-head"
```

---

## Phase 2 · Config

### Task 2.1: `packages.ts` — artifact metadata + package list

**Files:**
- Create: `src/config/packages.ts`

- [ ] **Step 1: Write**

Create `src/config/packages.ts`:

```typescript
export type PackageIdentity = { name: string; registry: 'npm' | 'pypi' };
export type ArtifactStatus = 'live' | 'dev' | 'private';

export type Artifact = {
  slug: string;
  order: number;
  name: string;
  emphasisWord: string;
  description: string;
  stack: string;
  kind: string;
  status: ArtifactStatus;
  repo?: string;
  npmName?: string;
  pypiName?: string;
  url?: string;
  metricOverride?: string;
};

export const artifacts: Artifact[] = [
  { slug: 'potato', order: 1, name: 'Potato v3', emphasisWord: 'Potato',
    description: "Terminal cockpit for coding agents. Run Claude, Codex, or others in real PTYs. Roles, MCP coordination, one operator window.",
    stack: 'rust · ratatui · mcp', kind: '01 · Rust · TUI', status: 'live',
    repo: 'fraction12/potato-v3' },

  { slug: 'starglass', order: 2, name: 'Starglass', emphasisWord: 'Starglass',
    description: "Observation layer any CLI agent can emit into. Stdout, events, tool-calls — one timeline, zero plumbing.",
    stack: 'ts · mcp · skill', kind: '02 · TypeScript · Skill', status: 'live' },

  { slug: 'agenttk', order: 3, name: 'AgentTK', emphasisWord: 'AgentTK',
    description: "Agent-facing CLI primitives. Typed, discoverable, safe by construction — the argv you'd actually hand to a model.",
    stack: 'python · pypi · cli', kind: '03 · Python · PyPI', status: 'live' },

  { slug: 'agentplan', order: 4, name: 'agentplan', emphasisWord: 'agentplan',
    description: "Shared to-do system for parallel agents. Dependencies, priorities, atomic claims. Built after three Claudes duplicated a PR.",
    stack: 'python · sqlite · pypi', kind: '04 · Python · PyPI', status: 'live',
    repo: 'fraction12/agentplan', pypiName: 'agentplan' },

  { slug: 'openrank', order: 5, name: 'OpenRank', emphasisWord: 'OpenRank',
    description: 'Daily puzzles for AI agents with a live leaderboard and server-side timing. Because "did it work" is not "did it beat the others."',
    stack: 'astro · supabase · ts', kind: '05 · Astro · Live', status: 'live',
    repo: 'fraction12/open-rank', url: 'https://open-rank.com' },

  { slug: 'agentrem', order: 6, name: 'agentrem', emphasisWord: 'agentrem',
    description: 'Persistent reminders for AI agents. CLI plus MCP server. Agents remember what they promised.',
    stack: 'ts · sqlite · mcp · npm', kind: '06 · TypeScript · MCP', status: 'live',
    repo: 'fraction12/agentrem', npmName: 'agentrem' },

  { slug: 'clawk', order: 7, name: 'ClawK', emphasisWord: 'ClawK',
    description: 'Native macOS menu bar for OpenClaw — so background runs are observable without opening a single window.',
    stack: 'swift · swiftui', kind: '07 · Swift · macOS', status: 'live',
    repo: 'fraction12/ClawK' },

  { slug: 'agentsense', order: 8, name: 'AgentSense', emphasisWord: 'AgentSense',
    description: 'Durable memory for agents using entity extraction and relationship-aware context. Built for agents that need to remember last week.',
    stack: 'ts · sqlite · fts5', kind: '08 · TypeScript · FTS5', status: 'live',
    repo: 'fraction12/agentsense' },

  { slug: 'agent-office', order: 9, name: 'Agent Office', emphasisWord: 'Agent Office',
    description: 'Watch agents live — not logs, not dashboards, but actually see them moving through a room. OpenClaw-native spatial interface.',
    stack: 'godot · gdscript · openclaw', kind: '09 · Godot · Private', status: 'dev',
    metricOverride: '🔒 private' }
];

export const npmPackages: string[] = artifacts.filter(a => a.npmName).map(a => a.npmName as string);
export const pypiPackages: string[] = artifacts.filter(a => a.pypiName).map(a => a.pypiName as string);
export const GITHUB_USER = 'fraction12';
```

- [ ] **Step 2: Commit**

```bash
git add src/config/packages.ts
git commit -m "feat(config): artifact metadata + package identity list"
```

---

### Task 2.2: `stream-sources.ts`

**Files:**
- Create: `src/config/stream-sources.ts`

- [ ] **Step 1: Write**

Create `src/config/stream-sources.ts`:

```typescript
export type StreamTag = 'LOG' | 'SHIP' | 'ESSAY' | 'PROD';

export const TAG_COLORS: Record<StreamTag, string> = {
  LOG: 'var(--pulse)',
  SHIP: 'var(--signal)',
  ESSAY: '#d8b3f5',
  PROD: 'var(--cold)'
};

export const SHIFT_GAP_HOURS = 4;
export const TAPE_HOME_LIMIT = 12;
```

- [ ] **Step 2: Commit**

```bash
git add src/config/stream-sources.ts
git commit -m "feat(config): stream tag colors + 4h shift heuristic"
```

---

## Phase 3 · Data layer (TDD)

### Task 3.1: Write shift-clustering test

**Files:**
- Create: `tests/lib/data/shifts.test.ts`

- [ ] **Step 1: Write test**

Create `tests/lib/data/shifts.test.ts`:

```typescript
import { describe, it, expect } from 'vitest';
import { clusterShifts, type CommitRecord } from '../../../src/lib/data/shifts';

function mkCommit(sha: string, iso: string, filesChanged = 1, additions = 10, deletions = 2): CommitRecord {
  return { sha, timestamp: new Date(iso), author: 'Dushyant Garg', subject: 'test commit', filesChanged, additions, deletions };
}

describe('clusterShifts', () => {
  it('returns empty when no commits', () => {
    expect(clusterShifts([], 4)).toEqual([]);
  });

  it('groups commits within the gap window into a single shift', () => {
    const commits = [
      mkCommit('a', '2026-04-15T22:00:00Z'),
      mkCommit('b', '2026-04-15T23:30:00Z'),
      mkCommit('c', '2026-04-16T01:00:00Z')
    ];
    const shifts = clusterShifts(commits, 4);
    expect(shifts).toHaveLength(1);
    expect(shifts[0].commits).toHaveLength(3);
    expect(shifts[0].start.toISOString()).toBe('2026-04-15T22:00:00.000Z');
    expect(shifts[0].end.toISOString()).toBe('2026-04-16T01:00:00.000Z');
  });

  it('starts a new shift when gap exceeds threshold', () => {
    const commits = [
      mkCommit('a', '2026-04-15T02:00:00Z'),
      mkCommit('b', '2026-04-15T03:00:00Z'),
      mkCommit('c', '2026-04-15T13:00:00Z'),
      mkCommit('d', '2026-04-15T14:00:00Z')
    ];
    const shifts = clusterShifts(commits, 4);
    expect(shifts).toHaveLength(2);
    expect(shifts[0].commits.map(c => c.sha)).toEqual(['a', 'b']);
    expect(shifts[1].commits.map(c => c.sha)).toEqual(['c', 'd']);
  });

  it('sums additions and deletions across the shift', () => {
    const commits = [
      mkCommit('a', '2026-04-15T22:00:00Z', 2, 100, 20),
      mkCommit('b', '2026-04-15T23:00:00Z', 1, 50, 5)
    ];
    const shifts = clusterShifts(commits, 4);
    expect(shifts[0].additions).toBe(150);
    expect(shifts[0].deletions).toBe(25);
    expect(shifts[0].commitCount).toBe(2);
  });

  it('sorts unsorted input chronologically', () => {
    const commits = [
      mkCommit('c', '2026-04-15T01:00:00Z'),
      mkCommit('a', '2026-04-14T22:00:00Z'),
      mkCommit('b', '2026-04-14T23:00:00Z')
    ];
    const shifts = clusterShifts(commits, 4);
    expect(shifts).toHaveLength(1);
    expect(shifts[0].commits.map(c => c.sha)).toEqual(['a', 'b', 'c']);
  });
});
```

- [ ] **Step 2: Run; expect fail**

Run: `npm test`
Expected: FAIL with `Cannot find module '.../shifts'`.

---

### Task 3.2: Implement `shifts.ts`

**Files:**
- Create: `src/lib/data/shifts.ts`

- [ ] **Step 1: Write**

Create `src/lib/data/shifts.ts`:

```typescript
export type CommitRecord = {
  sha: string;
  timestamp: Date;
  author: string;
  subject: string;
  filesChanged: number;
  additions: number;
  deletions: number;
};

export type Shift = {
  start: Date;
  end: Date;
  commits: CommitRecord[];
  commitCount: number;
  additions: number;
  deletions: number;
};

export function clusterShifts(commits: CommitRecord[], gapHours: number): Shift[] {
  if (commits.length === 0) return [];
  const sorted = [...commits].sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
  const gapMs = gapHours * 60 * 60 * 1000;

  const shifts: Shift[] = [];
  let current: CommitRecord[] = [sorted[0]];

  for (let i = 1; i < sorted.length; i++) {
    const prev = current[current.length - 1];
    const curr = sorted[i];
    if (curr.timestamp.getTime() - prev.timestamp.getTime() > gapMs) {
      shifts.push(buildShift(current));
      current = [curr];
    } else {
      current.push(curr);
    }
  }
  shifts.push(buildShift(current));
  return shifts;
}

function buildShift(commits: CommitRecord[]): Shift {
  return {
    start: commits[0].timestamp,
    end: commits[commits.length - 1].timestamp,
    commits,
    commitCount: commits.length,
    additions: commits.reduce((s, c) => s + c.additions, 0),
    deletions: commits.reduce((s, c) => s + c.deletions, 0)
  };
}
```

- [ ] **Step 2: Run; expect pass**

Run: `npm test`
Expected: PASS (5 tests).

- [ ] **Step 3: Commit**

```bash
git add src/lib/data/shifts.ts tests/lib/data/shifts.test.ts
git commit -m "feat(data): shift clustering by commit-gap heuristic"
```

---

### Task 3.3: Write git-log parser test

**Files:**
- Create: `tests/lib/data/git.test.ts`

- [ ] **Step 1: Write test**

Create `tests/lib/data/git.test.ts`:

```typescript
import { describe, it, expect } from 'vitest';
import { getLastCommit, parseGitLogOutput } from '../../../src/lib/data/git';

describe('parseGitLogOutput', () => {
  it('parses a single commit with stat line', () => {
    const raw = [
      '---COMMIT---',
      'sha:abc123def',
      'ts:1713312000',
      'author:Dushyant Garg',
      'subject:fix: something',
      'stat: 2 files changed, 40 insertions(+), 5 deletions(-)'
    ].join('\n');
    const commits = parseGitLogOutput(raw);
    expect(commits).toHaveLength(1);
    expect(commits[0].sha).toBe('abc123def');
    expect(commits[0].additions).toBe(40);
    expect(commits[0].deletions).toBe(5);
    expect(commits[0].filesChanged).toBe(2);
    expect(commits[0].timestamp.getTime()).toBe(1713312000 * 1000);
  });

  it('parses multiple commits', () => {
    const raw = [
      '---COMMIT---',
      'sha:one', 'ts:1713312000', 'author:Dushyant Garg', 'subject:first',
      'stat: 1 file changed, 10 insertions(+)',
      '---COMMIT---',
      'sha:two', 'ts:1713312600', 'author:Dushyant Garg', 'subject:second',
      'stat: 3 files changed, 22 insertions(+), 4 deletions(-)'
    ].join('\n');
    const commits = parseGitLogOutput(raw);
    expect(commits).toHaveLength(2);
    expect(commits[1].additions).toBe(22);
    expect(commits[1].deletions).toBe(4);
  });

  it('handles commits with zero deletions', () => {
    const raw = [
      '---COMMIT---',
      'sha:aaa', 'ts:1713312000', 'author:a', 'subject:s',
      'stat: 1 file changed, 5 insertions(+)'
    ].join('\n');
    expect(parseGitLogOutput(raw)[0].deletions).toBe(0);
  });
});

describe('getLastCommit', () => {
  it('returns a well-formed record from the current repo', () => {
    const last = getLastCommit();
    expect(last.sha).toMatch(/^[0-9a-f]{7,40}$/);
    expect(last.timestamp).toBeInstanceOf(Date);
    expect(typeof last.subject).toBe('string');
  });
});
```

- [ ] **Step 2: Run; expect fail**

Run: `npm test`
Expected: FAIL (missing module).

---

### Task 3.4: Implement `git.ts` with `execFileSync`

**Files:**
- Create: `src/lib/data/git.ts`

- [ ] **Step 1: Write**

Create `src/lib/data/git.ts`:

```typescript
import { execFileSync } from 'node:child_process';
import type { CommitRecord } from './shifts';

const LOG_FORMAT = '---COMMIT---%nsha:%H%nts:%ct%nauthor:%an%nsubject:%s';

export function parseGitLogOutput(raw: string): CommitRecord[] {
  const blocks = raw.split('---COMMIT---').map(b => b.trim()).filter(Boolean);
  const commits: CommitRecord[] = [];

  for (const block of blocks) {
    const lines = block.split('\n');
    const map: Record<string, string> = {};
    let stat: string | null = null;

    for (const line of lines) {
      if (line.startsWith('stat:')) {
        stat = line.slice(5).trim();
        continue;
      }
      const colon = line.indexOf(':');
      if (colon > 0) {
        map[line.slice(0, colon)] = line.slice(colon + 1);
      }
    }

    if (!map.sha || !map.ts) continue;
    const { additions, deletions, filesChanged } = parseStat(stat);
    commits.push({
      sha: map.sha,
      timestamp: new Date(parseInt(map.ts, 10) * 1000),
      author: map.author ?? '',
      subject: map.subject ?? '',
      filesChanged,
      additions,
      deletions
    });
  }
  return commits;
}

function parseStat(stat: string | null): { additions: number; deletions: number; filesChanged: number } {
  if (!stat) return { additions: 0, deletions: 0, filesChanged: 0 };
  const files = /(\d+)\s+files?\s+changed/.exec(stat);
  const ins = /(\d+)\s+insertions?\(\+\)/.exec(stat);
  const del = /(\d+)\s+deletions?\(-\)/.exec(stat);
  return {
    additions: ins ? parseInt(ins[1], 10) : 0,
    deletions: del ? parseInt(del[1], 10) : 0,
    filesChanged: files ? parseInt(files[1], 10) : 0
  };
}

// Use execFileSync with argv — no shell interpolation, no injection surface.
function runGitArgs(args: string[]): string {
  return execFileSync('git', args, { encoding: 'utf8', maxBuffer: 10 * 1024 * 1024 });
}

export function getCommitHistory(sinceDays = 180): CommitRecord[] {
  const raw = runGitArgs([
    'log',
    `--since=${sinceDays} days ago`,
    '--shortstat',
    `--pretty=format:${LOG_FORMAT}`
  ]);
  return parseGitLogOutput(raw);
}

export function getLastCommit(): CommitRecord {
  const raw = runGitArgs([
    'log',
    '-1',
    '--shortstat',
    `--pretty=format:${LOG_FORMAT}`
  ]);
  const commits = parseGitLogOutput(raw);
  if (commits.length === 0) throw new Error('no commits found in this repo');
  return commits[0];
}

export function formatRelativeTime(from: Date, now: Date = new Date()): string {
  const seconds = Math.floor((now.getTime() - from.getTime()) / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}
```

- [ ] **Step 2: Run; expect pass**

Run: `npm test`
Expected: PASS (9 tests total).

- [ ] **Step 3: Commit**

```bash
git add src/lib/data/git.ts tests/lib/data/git.test.ts
git commit -m "feat(data): git log parser using execFileSync"
```

---

### Task 3.5: Extract + test Substack RSS parser

**Files:**
- Create: `src/lib/data/substack.ts`
- Create: `tests/lib/data/substack.test.ts`

- [ ] **Step 1: Write test**

Create `tests/lib/data/substack.test.ts`:

```typescript
import { describe, it, expect } from 'vitest';
import { parseFeed, stripHtml, getReadTimeMinutes } from '../../../src/lib/data/substack';

const SAMPLE = `<?xml version="1.0"?>
<rss><channel>
  <item>
    <title><![CDATA[Taste in AI means constraints]]></title>
    <link>https://dushyantg.substack.com/p/taste</link>
    <description><![CDATA[<p>Good AI products feel opinionated.</p>]]></description>
    <content:encoded><![CDATA[<p>Good AI products feel opinionated.</p><p>${'word '.repeat(450).trim()}</p>]]></content:encoded>
    <pubDate>Mon, 13 Apr 2026 10:00:00 +0000</pubDate>
  </item>
</channel></rss>`;

describe('stripHtml', () => {
  it('decodes entities and removes tags', () => {
    expect(stripHtml('<p>Hello &amp; goodbye</p>')).toBe('Hello & goodbye');
  });
  it('collapses whitespace', () => {
    expect(stripHtml('a\n\n\n b')).toBe('a b');
  });
});

describe('getReadTimeMinutes', () => {
  it('returns at least 1', () => {
    expect(getReadTimeMinutes('<p>hi</p>')).toBe(1);
  });
  it('rounds up based on 200 wpm', () => {
    const words = Array(450).fill('word').join(' ');
    expect(getReadTimeMinutes(words)).toBe(3);
  });
});

describe('parseFeed', () => {
  it('parses a single item feed', () => {
    const posts = parseFeed(SAMPLE);
    expect(posts).toHaveLength(1);
    expect(posts[0].title).toBe('Taste in AI means constraints');
    expect(posts[0].link).toBe('https://dushyantg.substack.com/p/taste');
    expect(posts[0].description).toContain('opinionated');
    expect(posts[0].dateLabel).toMatch(/April 13, 2026/);
    expect(posts[0].readTimeMinutes).toBeGreaterThanOrEqual(1);
  });
});
```

- [ ] **Step 2: Run; expect fail**

Run: `npm test`
Expected: FAIL.

- [ ] **Step 3: Write implementation**

Create `src/lib/data/substack.ts`:

```typescript
export type Essay = {
  title: string;
  link: string;
  description: string;
  dateLabel: string;
  publishedAt: Date;
  readTimeMinutes: number;
};

const FEED_URL = 'https://dushyantg.substack.com/feed';

export function decodeXml(input = ''): string {
  return input
    .replaceAll('&amp;', '&').replaceAll('&lt;', '<').replaceAll('&gt;', '>')
    .replaceAll('&quot;', '"').replaceAll('&#39;', "'");
}

export function stripHtml(input = ''): string {
  return decodeXml(input)
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function getReadTimeMinutes(content: string): number {
  const words = stripHtml(content).split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

export function formatDate(pubDate: string): { label: string; date: Date } {
  const parsed = new Date(pubDate);
  if (Number.isNaN(parsed.getTime())) return { label: 'Unknown date', date: new Date(0) };
  const label = new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).format(parsed);
  return { label, date: parsed };
}

function getTagValue(itemXml: string, tagName: string): string {
  const match = itemXml.match(new RegExp(`<${tagName}[^>]*>([\\s\\S]*?)<\\/${tagName}>`, 'i'));
  return match?.[1]?.trim() ?? '';
}

export function parseFeed(xml: string): Essay[] {
  const itemMatches = [...xml.matchAll(/<item>([\s\S]*?)<\/item>/gi)];
  return itemMatches
    .map(match => {
      const itemXml = match[1] ?? '';
      const title = stripHtml(getTagValue(itemXml, 'title'));
      const link = stripHtml(getTagValue(itemXml, 'link'));
      const descriptionRaw = getTagValue(itemXml, 'description');
      const contentRaw =
        getTagValue(itemXml, 'content:encoded') ||
        getTagValue(itemXml, 'content') ||
        descriptionRaw;
      const { label, date } = formatDate(getTagValue(itemXml, 'pubDate'));
      return {
        title,
        link,
        description: stripHtml(descriptionRaw),
        dateLabel: label,
        publishedAt: date,
        readTimeMinutes: getReadTimeMinutes(contentRaw)
      };
    })
    .filter(p => p.title && p.link);
}

export async function fetchEssays(): Promise<Essay[]> {
  try {
    const res = await fetch(FEED_URL);
    if (!res.ok) throw new Error(`substack feed ${res.status}`);
    return parseFeed(await res.text());
  } catch (err) {
    console.warn('[substack] fetch failed, returning empty:', err);
    return [];
  }
}
```

- [ ] **Step 4: Run; expect pass**

Run: `npm test`
Expected: PASS (13 tests total).

- [ ] **Step 5: Commit**

```bash
git add src/lib/data/substack.ts tests/lib/data/substack.test.ts
git commit -m "feat(data): substack RSS parser with tests"
```

---

### Task 3.6: GitHub fetcher + snapshot

**Files:**
- Create: `src/lib/data/github.ts`
- Create: `src/data/snapshots/github.json`

- [ ] **Step 1: Create snapshot stub**

Create `src/data/snapshots/github.json`:

```json
{
  "fetchedAt": null,
  "totalStars": null,
  "commits7d": null,
  "commits30d": null,
  "heatmap": null
}
```

- [ ] **Step 2: Write fetcher**

Create `src/lib/data/github.ts`:

```typescript
import fs from 'node:fs';
import path from 'node:path';
import { GITHUB_USER } from '../../config/packages';

const TOKEN = process.env.GITHUB_TOKEN || '';
const SNAPSHOT_PATH = path.join(process.cwd(), 'src/data/snapshots/github.json');

export type HeatmapCell = { date: string; count: number; level: 0 | 1 | 2 | 3 | 4 };

export type GithubSnapshot = {
  fetchedAt: string | null;
  totalStars: number | null;
  commits7d: number | null;
  commits30d: number | null;
  heatmap: HeatmapCell[] | null;
};

function readSnapshot(): GithubSnapshot {
  try { return JSON.parse(fs.readFileSync(SNAPSHOT_PATH, 'utf8')); }
  catch { return { fetchedAt: null, totalStars: null, commits7d: null, commits30d: null, heatmap: null }; }
}

export async function loadGithub(): Promise<GithubSnapshot> {
  if (!TOKEN) {
    console.warn('[github] GITHUB_TOKEN unset; using snapshot');
    return readSnapshot();
  }
  try {
    const [stars, heatmap] = await Promise.all([fetchTotalStars(), fetchHeatmap()]);
    const snapshot: GithubSnapshot = {
      fetchedAt: new Date().toISOString(),
      totalStars: stars,
      commits7d: heatmap.filter(c => withinDays(c.date, 7)).reduce((s, c) => s + c.count, 0),
      commits30d: heatmap.filter(c => withinDays(c.date, 30)).reduce((s, c) => s + c.count, 0),
      heatmap
    };
    try { fs.writeFileSync(SNAPSHOT_PATH, JSON.stringify(snapshot, null, 2)); } catch {}
    return snapshot;
  } catch (err) {
    console.warn('[github] fetch failed, using snapshot:', err);
    return readSnapshot();
  }
}

async function fetchTotalStars(): Promise<number> {
  const res = await fetch(`https://api.github.com/users/${GITHUB_USER}/repos?per_page=100&type=owner`, {
    headers: { Authorization: `Bearer ${TOKEN}`, Accept: 'application/vnd.github+json' }
  });
  if (!res.ok) throw new Error(`github repos ${res.status}`);
  const repos = await res.json() as Array<{ stargazers_count: number; fork: boolean }>;
  return repos.filter(r => !r.fork).reduce((s, r) => s + (r.stargazers_count || 0), 0);
}

async function fetchHeatmap(): Promise<HeatmapCell[]> {
  const query = `
    query($login:String!) {
      user(login:$login) {
        contributionsCollection {
          contributionCalendar {
            weeks { contributionDays { date contributionCount } }
          }
        }
      }
    }
  `;
  const res = await fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers: { Authorization: `Bearer ${TOKEN}`, 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({ query, variables: { login: GITHUB_USER } })
  });
  if (!res.ok) throw new Error(`github graphql ${res.status}`);
  const json = await res.json() as any;
  const weeks = json?.data?.user?.contributionsCollection?.contributionCalendar?.weeks ?? [];
  const cells: HeatmapCell[] = [];
  for (const w of weeks) {
    for (const d of w.contributionDays) {
      cells.push({ date: d.date, count: d.contributionCount, level: bucketLevel(d.contributionCount) });
    }
  }
  return cells.slice(-182);
}

function bucketLevel(n: number): 0 | 1 | 2 | 3 | 4 {
  if (n === 0) return 0;
  if (n <= 2) return 1;
  if (n <= 5) return 2;
  if (n <= 10) return 3;
  return 4;
}

function withinDays(iso: string, days: number): boolean {
  const d = new Date(iso);
  const diff = (Date.now() - d.getTime()) / (1000 * 60 * 60 * 24);
  return diff <= days && diff >= 0;
}
```

- [ ] **Step 3: Commit**

```bash
git add src/lib/data/github.ts src/data/snapshots/github.json
git commit -m "feat(data): github fetcher with snapshot fallback"
```

---

### Task 3.7: npm fetcher + snapshot

**Files:**
- Create: `src/lib/data/npm.ts`
- Create: `src/data/snapshots/npm.json`

- [ ] **Step 1: Create snapshot**

Create `src/data/snapshots/npm.json`:

```json
{ "fetchedAt": null, "packages": {} }
```

- [ ] **Step 2: Write fetcher**

Create `src/lib/data/npm.ts`:

```typescript
import fs from 'node:fs';
import path from 'node:path';
import { npmPackages } from '../../config/packages';

const SNAPSHOT_PATH = path.join(process.cwd(), 'src/data/snapshots/npm.json');

export type NpmSnapshot = {
  fetchedAt: string | null;
  packages: Record<string, { downloadsLastMonth: number }>;
};

function readSnapshot(): NpmSnapshot {
  try { return JSON.parse(fs.readFileSync(SNAPSHOT_PATH, 'utf8')); }
  catch { return { fetchedAt: null, packages: {} }; }
}

export async function loadNpm(): Promise<NpmSnapshot> {
  if (npmPackages.length === 0) return readSnapshot();
  try {
    const entries = await Promise.all(
      npmPackages.map(async name => {
        const res = await fetch(`https://api.npmjs.org/downloads/point/last-month/${encodeURIComponent(name)}`);
        if (!res.ok) throw new Error(`npm ${name} ${res.status}`);
        const json = await res.json() as { downloads: number };
        return [name, { downloadsLastMonth: json.downloads }] as const;
      })
    );
    const snapshot: NpmSnapshot = { fetchedAt: new Date().toISOString(), packages: Object.fromEntries(entries) };
    try { fs.writeFileSync(SNAPSHOT_PATH, JSON.stringify(snapshot, null, 2)); } catch {}
    return snapshot;
  } catch (err) {
    console.warn('[npm] fetch failed, using snapshot:', err);
    return readSnapshot();
  }
}

export function totalNpmDownloads(s: NpmSnapshot): number {
  return Object.values(s.packages).reduce((t, p) => t + (p.downloadsLastMonth || 0), 0);
}
```

- [ ] **Step 3: Commit**

```bash
git add src/lib/data/npm.ts src/data/snapshots/npm.json
git commit -m "feat(data): npm downloads fetcher"
```

---

### Task 3.8: PyPI fetcher + snapshot

**Files:**
- Create: `src/lib/data/pypi.ts`
- Create: `src/data/snapshots/pypi.json`

- [ ] **Step 1: Create snapshot**

Create `src/data/snapshots/pypi.json`:

```json
{ "fetchedAt": null, "packages": {} }
```

- [ ] **Step 2: Write fetcher**

Create `src/lib/data/pypi.ts`:

```typescript
import fs from 'node:fs';
import path from 'node:path';
import { pypiPackages } from '../../config/packages';

const SNAPSHOT_PATH = path.join(process.cwd(), 'src/data/snapshots/pypi.json');

export type PypiSnapshot = {
  fetchedAt: string | null;
  packages: Record<string, { downloadsLastMonth: number }>;
};

function readSnapshot(): PypiSnapshot {
  try { return JSON.parse(fs.readFileSync(SNAPSHOT_PATH, 'utf8')); }
  catch { return { fetchedAt: null, packages: {} }; }
}

export async function loadPypi(): Promise<PypiSnapshot> {
  if (pypiPackages.length === 0) return readSnapshot();
  try {
    const entries = await Promise.all(
      pypiPackages.map(async name => {
        const res = await fetch(`https://pypistats.org/api/packages/${encodeURIComponent(name)}/recent`);
        if (!res.ok) throw new Error(`pypi ${name} ${res.status}`);
        const json = await res.json() as { data: { last_month: number } };
        return [name, { downloadsLastMonth: json.data.last_month }] as const;
      })
    );
    const snapshot: PypiSnapshot = { fetchedAt: new Date().toISOString(), packages: Object.fromEntries(entries) };
    try { fs.writeFileSync(SNAPSHOT_PATH, JSON.stringify(snapshot, null, 2)); } catch {}
    return snapshot;
  } catch (err) {
    console.warn('[pypi] fetch failed, using snapshot:', err);
    return readSnapshot();
  }
}

export function totalPypiDownloads(s: PypiSnapshot): number {
  return Object.values(s.packages).reduce((t, p) => t + (p.downloadsLastMonth || 0), 0);
}
```

- [ ] **Step 3: Commit**

```bash
git add src/lib/data/pypi.ts src/data/snapshots/pypi.json
git commit -m "feat(data): pypi downloads fetcher"
```

---

### Task 3.9: Data barrel + `loadSignalData`

**Files:**
- Create: `src/lib/data/index.ts`

- [ ] **Step 1: Write**

Create `src/lib/data/index.ts`:

```typescript
import { getCommitHistory, getLastCommit, formatRelativeTime } from './git';
import { clusterShifts } from './shifts';
import { fetchEssays, type Essay } from './substack';
import { loadGithub, type GithubSnapshot } from './github';
import { loadNpm, totalNpmDownloads, type NpmSnapshot } from './npm';
import { loadPypi, totalPypiDownloads, type PypiSnapshot } from './pypi';
import { SHIFT_GAP_HOURS } from '../../config/stream-sources';
import type { Shift, CommitRecord } from './shifts';

export type SignalData = {
  lastCommit: CommitRecord;
  lastCommitRelative: string;
  commits: CommitRecord[];
  shifts: Shift[];
  essays: Essay[];
  github: GithubSnapshot;
  npm: NpmSnapshot;
  pypi: PypiSnapshot;
  totalDownloadsLastMonth: number;
};

export async function loadSignalData(): Promise<SignalData> {
  const lastCommit = getLastCommit();
  const commits = getCommitHistory(182);
  const shifts = clusterShifts(commits, SHIFT_GAP_HOURS);

  const [essays, github, npm, pypi] = await Promise.all([
    fetchEssays(), loadGithub(), loadNpm(), loadPypi()
  ]);

  return {
    lastCommit,
    lastCommitRelative: formatRelativeTime(lastCommit.timestamp),
    commits,
    shifts,
    essays,
    github,
    npm,
    pypi,
    totalDownloadsLastMonth: totalNpmDownloads(npm) + totalPypiDownloads(pypi)
  };
}

export { formatRelativeTime };
export type { Essay, Shift, CommitRecord, GithubSnapshot, NpmSnapshot, PypiSnapshot };
```

- [ ] **Step 2: Verify tests still pass**

Run: `npm test`
Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add src/lib/data/index.ts
git commit -m "feat(data): loadSignalData aggregator"
```

---

## Phase 4 · Shared components

### Task 4.1: `SectionHead.astro`

**Files:**
- Create: `src/components/SectionHead.astro`

- [ ] **Step 1: Write**

Create `src/components/SectionHead.astro`:

```astro
---
interface Props {
  num: string;   // "§ 01"
  name: string;  // use *word* for italic-amber emphasis
  meta: string;
}
const { num, name, meta } = Astro.props;
const html = name.replace(/\*(.+?)\*/g, '<em>$1</em>');
---

<header class="section-head">
  <span class="sh-num">{num}</span>
  <span class="sh-name" set:html={html}></span>
  <span class="sh-meta">{meta}</span>
</header>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/SectionHead.astro
git commit -m "feat(ui): SectionHead with numbered markers"
```

---

### Task 4.2: `StatusStrip.astro`

**Files:**
- Create: `src/components/StatusStrip.astro`

- [ ] **Step 1: Write**

Create `src/components/StatusStrip.astro`:

```astro
---
interface StatusItem { label: string; value: string; tone?: 'live' | 'hot' | 'neutral' }
interface Props { items: StatusItem[] }
const { items } = Astro.props;
---

<div class="status-strip">
  {items.map(item => (
    <span class={`si ${item.tone ?? 'neutral'}`}>
      <em>{item.label}</em>
      <b>{item.value}</b>
    </span>
  ))}
</div>

<style>
  .status-strip { display: flex; gap: 22px; flex-wrap: wrap; font-family: var(--mono); color: var(--ivory-2); font-size: 12.5px; overflow: hidden; }
  .si em { font-style: normal; color: var(--dim); margin-right: 6px; font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; }
  .si b { color: var(--ivory); font-weight: 500; }
  .si.live b { color: var(--pulse); }
  .si.hot b { color: var(--signal); }
</style>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/StatusStrip.astro
git commit -m "feat(ui): StatusStrip component"
```

---

### Task 4.3: Rewrite `Nav.astro`

**Files:**
- Modify: `src/components/Nav.astro`

- [ ] **Step 1: Replace entire file**

Replace `src/components/Nav.astro` with:

```astro
---
import StatusStrip from './StatusStrip.astro';
import { loadSignalData } from '../lib/data';
import { totalNpmDownloads } from '../lib/data/npm';
import { totalPypiDownloads } from '../lib/data/pypi';

interface Props { current?: 'home' | 'artifacts' | 'writing' | 'stream' | 'beliefs' | 'jarvis' | 'projects' }
const { current = 'home' } = Astro.props;

const data = await loadSignalData();
const commits7d = data.github.commits7d ?? '—';
const downloads30d = totalNpmDownloads(data.npm) + totalPypiDownloads(data.pypi);

const items = [
  { label: 'Repo', value: `live · last commit ${data.lastCommitRelative}`, tone: 'live' as const },
  { label: 'Shipped 30d', value: '11' },
  { label: 'Commits 7d', value: String(commits7d), tone: 'hot' as const },
  { label: 'Downloads 30d', value: downloads30d > 0 ? downloads30d.toLocaleString() : '—' }
];

const navLinks: Array<{ href: string; label: string; key: Props['current'] }> = [
  { href: '/', label: 'Index', key: 'home' },
  { href: '/projects', label: 'Artifacts', key: 'projects' },
  { href: '/writing', label: 'Writing', key: 'writing' },
  { href: '/jarvis', label: 'Stream', key: 'jarvis' },
  { href: '/beliefs', label: 'Beliefs', key: 'beliefs' }
];
---

<nav class="topbar">
  <div class="topbar-inner">
    <a href="/" class="mark" aria-label="Home">
      <span class="pulse" aria-hidden="true"></span>
      Dushyant Garg
    </a>
    <StatusStrip items={items} />
    <div class="nav-links">
      {navLinks.map(link => (
        <a href={link.href} class={current === link.key ? 'active' : ''}>{link.label}</a>
      ))}
    </div>
  </div>
</nav>

<style>
  .topbar { position: sticky; top: 0; z-index: 100; background: rgba(7,9,15,0.88); backdrop-filter: blur(20px); border-bottom: 1px solid var(--line-2); }
  .topbar-inner { max-width: var(--max-w); margin: 0 auto; padding: 14px 32px; display: grid; grid-template-columns: auto 1fr auto; gap: 32px; align-items: center; }
  .mark { display: flex; align-items: center; gap: 10px; font-family: var(--display); font-weight: 500; font-size: 19px; letter-spacing: -0.01em; color: var(--ivory); text-decoration: none; }
  .mark .pulse { width: 8px; height: 8px; border-radius: 50%; background: var(--pulse); box-shadow: 0 0 10px rgba(125,226,163,0.7); animation: pulse 1.8s ease-in-out infinite; }
  @keyframes pulse { 0%,100% { opacity: 1; transform: scale(1) } 50% { opacity: 0.45; transform: scale(0.85) } }
  .nav-links { display: flex; gap: 26px; }
  .nav-links a { color: var(--ivory-2); font-weight: 700; font-size: 13px; padding: 4px 2px; text-decoration: none; border-bottom: 1px solid transparent; }
  .nav-links a:hover, .nav-links a.active { border-color: var(--signal); color: var(--ivory); }
  @media (max-width: 1080px) { .topbar-inner { grid-template-columns: auto 1fr; } .nav-links { display: none; } }
  @media (max-width: 640px) { .topbar-inner { grid-template-columns: 1fr; gap: 10px; padding: 12px 22px; } }
</style>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/Nav.astro
git commit -m "feat(nav): Signal Desk nav with status strip"
```

---

### Task 4.4: Rewrite `Footer.astro`

**Files:**
- Modify: `src/components/Footer.astro`

- [ ] **Step 1: Replace entire file**

Replace `src/components/Footer.astro` with:

```astro
---
import { loadSignalData } from '../lib/data';
const data = await loadSignalData();
const year = new Date().getFullYear();
---

<footer class="site-footer">
  <div class="fl">
    © {year} <b>Dushyant Garg</b> · shipped at the pace of agents
    <div class="sig-line">site derived from this repo · last commit {data.lastCommitRelative} · <a href="/colophon">colophon →</a></div>
  </div>
  <div class="fr">
    <a href="https://github.com/fraction12" target="_blank" rel="noopener">GitHub</a>
    <a href="https://dushyantg.substack.com" target="_blank" rel="noopener">Substack</a>
    <a href="https://linkedin.com/in/dushyantgarg" target="_blank" rel="noopener">LinkedIn</a>
    <a href="/colophon">Colophon</a>
  </div>
</footer>

<style>
  .site-footer { border-top: 1px solid var(--line-2); padding: 32px 32px 48px; max-width: var(--max-w); margin: 0 auto; font-family: var(--body); font-size: 13px; color: var(--dim); display: grid; grid-template-columns: 1fr auto; gap: 24px; position: relative; z-index: 2; }
  .fl b { color: var(--ivory); font-weight: 700; }
  .fl .sig-line { color: var(--signal); margin-top: 6px; font-family: var(--mono); font-size: 12px; }
  .fl .sig-line a { color: var(--signal); text-decoration: none; }
  .fl .sig-line a:hover { text-decoration: underline; }
  .fr a { margin-left: 26px; color: var(--dim); font-weight: 700; text-decoration: none; }
  .fr a:hover { color: var(--ivory); }
  @media (max-width: 640px) { .site-footer { grid-template-columns: 1fr; padding: 32px 22px 40px; } .fr a { margin-left: 0; margin-right: 18px; } }
</style>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/Footer.astro
git commit -m "feat(footer): live last-commit + colophon link"
```

---

## Phase 5 · Hero cluster

### Task 5.1: `CommitHeatmap.astro`

**Files:**
- Create: `src/components/CommitHeatmap.astro`

- [ ] **Step 1: Write**

Create `src/components/CommitHeatmap.astro`:

```astro
---
import type { HeatmapCell } from '../lib/data/github';

interface Props { cells: HeatmapCell[] | null }
const { cells } = Astro.props;

function buildCells(input: HeatmapCell[] | null): HeatmapCell[] {
  if (input && input.length > 0) return input.slice(-182);
  const out: HeatmapCell[] = [];
  const today = new Date();
  for (let i = 182 - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    out.push({ date: d.toISOString().slice(0, 10), count: 0, level: 0 });
  }
  return out;
}

const heat = buildCells(cells);
const firstDate = heat[0]?.date ?? '';
const lastDate = heat[heat.length - 1]?.date ?? '';
const firstLabel = firstDate ? new Date(firstDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '';
const lastLabel = lastDate ? `${new Date(lastDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} · today` : 'today';
---

<div class="hm-wrap">
  <div class="hm-head">
    <span class="l">Commit tape · last 182 days</span>
    <span class="r">source · github · ↻ every 6h</span>
  </div>
  <div class="heatmap">
    {heat.map((c, i) => (
      <div class={`hm-cell${c.level > 0 ? ` l${c.level}` : ''}${i === heat.length - 1 ? ' today' : ''}`} title={`${c.date} · ${c.count} commits`}></div>
    ))}
  </div>
  <div class="hm-legend">
    <span>{firstLabel}</span>
    <span class="hm-scale">
      <span>less</span>
      <span class="c l0"></span>
      <span class="c l1"></span>
      <span class="c l2"></span>
      <span class="c l3"></span>
      <span class="c l4"></span>
      <span>more</span>
    </span>
    <span>{lastLabel}</span>
  </div>
</div>

<style>
  .hm-head { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 14px; font-family: var(--mono); font-size: 11px; }
  .hm-head .l { color: var(--signal); font-weight: 500; letter-spacing: 0.12em; text-transform: uppercase; }
  .hm-head .r { color: var(--dim); }
  .heatmap { display: grid; grid-template-columns: repeat(26, 1fr); grid-auto-rows: 14px; gap: 3px; }
  .hm-cell { border-radius: 2px; background: rgba(242,238,230,0.05); aspect-ratio: 1; }
  .hm-cell.l1 { background: rgba(255,138,76,0.14); }
  .hm-cell.l2 { background: rgba(255,138,76,0.30); }
  .hm-cell.l3 { background: rgba(255,138,76,0.58); }
  .hm-cell.l4 { background: rgba(255,138,76,0.92); box-shadow: 0 0 6px rgba(255,138,76,0.3); }
  .hm-cell.today { outline: 1px solid var(--ivory); }
  .hm-legend { margin-top: 14px; display: flex; justify-content: space-between; align-items: center; font-family: var(--mono); font-size: 11px; color: var(--dim); }
  .hm-scale { display: flex; gap: 3px; align-items: center; }
  .hm-scale .c { width: 11px; height: 11px; border-radius: 2px; background: rgba(242,238,230,0.05); }
  .hm-scale .c.l1 { background: rgba(255,138,76,0.14); }
  .hm-scale .c.l2 { background: rgba(255,138,76,0.30); }
  .hm-scale .c.l3 { background: rgba(255,138,76,0.58); }
  .hm-scale .c.l4 { background: rgba(255,138,76,0.92); }
</style>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/CommitHeatmap.astro
git commit -m "feat(hero): 182-day commit heatmap"
```

---

### Task 5.2: `Numerals.astro`

**Files:**
- Create: `src/components/Numerals.astro`

- [ ] **Step 1: Write**

Create `src/components/Numerals.astro`:

```astro
---
interface Cell {
  label: string;
  value: string | number;
  sub?: string;
  tone?: 'signal' | 'ivory';
  subTone?: 'up' | 'down' | 'neutral';
  placeholder?: boolean;
}
interface Props { cells: Cell[] }
const { cells } = Astro.props;
---

<div class="numerals">
  {cells.map(cell => (
    <div class="cell">
      <div class="lab">{cell.label}</div>
      <div class={`val ${cell.tone ?? 'ivory'}`}>
        {cell.placeholder ? <span class="ph">—</span> : cell.value}
      </div>
      {cell.sub && <div class={`sub ${cell.subTone ?? 'neutral'}`}>{cell.sub}</div>}
    </div>
  ))}
</div>

<style>
  .numerals { margin-top: 30px; display: grid; grid-template-columns: repeat(4, 1fr); border: 1px solid var(--line-2); }
  .cell { padding: 18px 20px; border-right: 1px solid var(--line-2); position: relative; }
  .cell:last-child { border-right: 0; }
  .cell::before { content: ''; position: absolute; top: 0; left: 0; width: 20px; height: 1px; background: var(--signal); }
  .lab { font-family: var(--body); font-weight: 700; font-size: 11.5px; color: var(--dim); letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 10px; }
  .val { font-family: var(--display); font-size: 2.6rem; line-height: 1; font-weight: 500; letter-spacing: -0.025em; font-variation-settings: "opsz" 72; }
  .val.signal { color: var(--signal); }
  .val.ivory { color: var(--ivory); }
  .val .ph { color: var(--dim-2); font-weight: 400; font-size: 1.2rem; }
  .sub { font-family: var(--mono); font-size: 11px; margin-top: 6px; letter-spacing: 0.04em; }
  .sub.up { color: var(--pulse); }
  .sub.down { color: var(--hot); }
  .sub.neutral { color: var(--dim); }
  @media (max-width: 1080px) {
    .numerals { grid-template-columns: repeat(2, 1fr); }
    .cell:nth-child(2) { border-right: 0; }
    .cell:nth-child(3), .cell:nth-child(4) { border-top: 1px solid var(--line-2); }
  }
  @media (max-width: 640px) { .numerals { grid-template-columns: 1fr; } .cell { border-right: 0; border-bottom: 1px solid var(--line-2); } }
</style>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/Numerals.astro
git commit -m "feat(hero): Numerals big-number panel"
```

---

### Task 5.3: Rewrite `Hero.astro`

**Files:**
- Modify: `src/components/Hero.astro`

- [ ] **Step 1: Replace entire file**

Replace `src/components/Hero.astro` with:

```astro
---
import CommitHeatmap from './CommitHeatmap.astro';
import Numerals from './Numerals.astro';
import { loadSignalData } from '../lib/data';

const data = await loadSignalData();

const numeralCells = [
  { label: 'Commits · 30d',
    value: data.github.commits30d !== null ? data.github.commits30d : 0,
    placeholder: data.github.commits30d === null,
    tone: 'signal' as const,
    sub: data.github.commits30d !== null ? 'real-time from github' : '[github api pending]',
    subTone: data.github.commits30d !== null ? 'up' as const : 'neutral' as const },
  { label: 'Packages · 30d', value: 11, sub: '6 live · 5 in dev', subTone: 'neutral' as const },
  { label: 'Stars across repos',
    value: data.github.totalStars ?? 0,
    placeholder: data.github.totalStars === null,
    sub: data.github.totalStars !== null ? 'github aggregate' : '[github api pending]',
    subTone: 'neutral' as const },
  { label: 'Downloads · 30d',
    value: data.totalDownloadsLastMonth > 0 ? data.totalDownloadsLastMonth.toLocaleString() : 0,
    placeholder: data.totalDownloadsLastMonth === 0,
    sub: data.totalDownloadsLastMonth > 0 ? 'npm + pypi' : '[registry data pending]',
    subTone: data.totalDownloadsLastMonth > 0 ? 'up' as const : 'neutral' as const }
];
---

<section class="hero">
  <div class="hero-l">
    <div class="hero-kick"><span class="blink"></span>Product builder · Applied AI research</div>
    <h1 class="hero-line">I ship at the <em>pace</em> of agents.</h1>
    <p class="hero-sub">
      Applied AI research, shipped weekly. The graph on the right is <b>six months</b> of real commits —
      <b>most happened while I was asleep</b>. I run a one-person lab where agents do a lot of the typing
      and I do the thinking, the taste, and the cut.
      <span class="hint">Everything on this page is grounded in <code>git log</code>.</span>
    </p>
    <div class="hero-links">
      <a href="#artifacts" class="primary">See what I ship →</a>
      <a href="https://github.com/fraction12" target="_blank" rel="noopener">GitHub ↗</a>
      <a href="https://dushyantg.substack.com" target="_blank" rel="noopener">Substack ↗</a>
      <a href="https://linkedin.com/in/dushyantgarg" target="_blank" rel="noopener">LinkedIn ↗</a>
      <a href="https://www.npmjs.com/~fraction12" target="_blank" rel="noopener">npm ↗</a>
    </div>
  </div>

  <div class="hero-r">
    <CommitHeatmap cells={data.github.heatmap} />
    <Numerals cells={numeralCells} />
  </div>
</section>

<style>
  .hero { padding: 72px 0 64px; display: grid; grid-template-columns: 1fr 1.1fr; gap: 64px; align-items: end; border-bottom: 1px solid var(--line-2); }
  .hero-kick { color: var(--signal); font-family: var(--mono); font-size: 12px; letter-spacing: 0.16em; text-transform: uppercase; margin-bottom: 30px; display: flex; align-items: center; gap: 10px; font-weight: 500; }
  .hero-kick .blink { width: 6px; height: 6px; background: var(--signal); animation: blink 1.1s step-end infinite; }
  @keyframes blink { 50% { opacity: 0 } }
  .hero-line { font-family: var(--display); font-weight: 400; font-size: var(--fs-h1); line-height: 0.98; letter-spacing: -0.03em; margin-bottom: 30px; font-variation-settings: "opsz" 144; }
  .hero-line em { font-style: italic; font-weight: 300; color: var(--signal); }
  .hero-sub { font-family: var(--body); font-size: 17px; line-height: 1.65; color: var(--ivory-2); max-width: 54ch; }
  .hero-sub b { color: var(--ivory); font-weight: 700; }
  .hero-sub .hint { color: var(--signal); font-weight: 400; }
  .hero-sub code { font-family: var(--mono); font-size: 0.92em; }
  .hero-links { margin-top: 32px; display: flex; gap: 12px; flex-wrap: wrap; }
  .hero-links a { font-size: 13px; font-weight: 700; padding: 10px 16px; border: 1px solid var(--line-2); color: var(--ivory); transition: all .2s; text-decoration: none; border-radius: 2px; }
  .hero-links a:hover { border-color: var(--signal); color: var(--signal); }
  .hero-links a.primary { background: var(--signal); color: var(--ink); border-color: var(--signal); }
  .hero-links a.primary:hover { background: transparent; color: var(--signal); }
  @media (max-width: 1080px) { .hero { grid-template-columns: 1fr; gap: 48px; padding: 56px 0 48px; } }
</style>
```

- [ ] **Step 2: Verify dev server renders**

Run: `npm run dev`, visit `http://localhost:4321/`.
Expected: hero renders with line + sub + heatmap (empty grid if no token) + numerals. Kill with Ctrl-C.

- [ ] **Step 3: Commit**

```bash
git add src/components/Hero.astro
git commit -m "feat(hero): Signal Desk hero with heatmap + numerals"
```

---

## Phase 6 · Home sections

### Task 6.1: `Artifact.astro` + `ArtifactGrid.astro`

**Files:**
- Create: `src/components/Artifact.astro`
- Create: `src/components/ArtifactGrid.astro`

- [ ] **Step 1: Create `Artifact.astro`**

Create `src/components/Artifact.astro`:

```astro
---
import type { Artifact as ArtifactT } from '../config/packages';

interface Props {
  artifact: ArtifactT;
  metric: string | null;
  metricPlaceholder?: string;
}
const { artifact, metric, metricPlaceholder } = Astro.props;

const parts = artifact.name.split(artifact.emphasisWord);
const pre = parts[0] ?? '';
const post = parts.slice(1).join(artifact.emphasisWord) ?? '';
const statusLabel = artifact.status === 'live' ? 'Live' : artifact.status === 'dev' ? 'In Dev' : 'Private';
---

<article class="artifact">
  <div class="ah">
    <span>{artifact.kind}</span>
    <span class={`st ${artifact.status}`}>{statusLabel}</span>
  </div>
  <h3 class="a-title">{pre}<em>{artifact.emphasisWord}</em>{post}</h3>
  <p class="a-desc">{artifact.description}</p>
  <div class="a-foot">
    <span class="stack">{artifact.stack}</span>
    {metric
      ? <span class="met">{metric}</span>
      : <span class="met ph">{metricPlaceholder ?? '[metric pending]'}</span>}
  </div>
</article>

<style>
  .artifact { background: var(--ink-1); padding: 24px 24px 68px; position: relative; min-height: 240px; transition: background .2s; }
  .artifact:hover { background: var(--ink-2); }
  .ah { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; font-family: var(--mono); font-size: 11px; color: var(--dim); letter-spacing: 0.06em; }
  .st.live { color: var(--pulse); font-weight: 500; }
  .st.live::before { content: '● '; animation: pulse 2s infinite; }
  .st.dev { color: var(--signal); font-weight: 500; }
  .st.dev::before { content: '◐ '; }
  .a-title { font-family: var(--display); font-weight: 500; font-size: 1.7rem; letter-spacing: -0.025em; margin: 0 0 12px; font-variation-settings: "opsz" 144; }
  .a-title em { font-style: italic; font-weight: 300; color: var(--signal); }
  .a-desc { color: var(--ivory-2); font-size: 14.5px; line-height: 1.6; max-width: 44ch; }
  .a-foot { position: absolute; bottom: 20px; left: 24px; right: 24px; display: flex; justify-content: space-between; font-family: var(--mono); font-size: 11.5px; letter-spacing: 0.03em; padding-top: 12px; border-top: 1px solid var(--line); }
  .stack { color: var(--ivory-2); }
  .met { color: var(--signal); font-weight: 500; }
  .met.ph { color: var(--dim-2); font-style: italic; font-weight: 400; }
  @keyframes pulse { 0%,100% { opacity: 1 } 50% { opacity: 0.45 } }
</style>
```

- [ ] **Step 2: Create `ArtifactGrid.astro`**

Create `src/components/ArtifactGrid.astro`:

```astro
---
import Artifact from './Artifact.astro';
import { artifacts, type Artifact as ArtifactT } from '../config/packages';
import { loadSignalData } from '../lib/data';

const data = await loadSignalData();

function metricFor(a: ArtifactT): { metric: string | null; placeholder: string } {
  if (a.metricOverride) return { metric: a.metricOverride, placeholder: '' };
  if (a.npmName) {
    const d = data.npm.packages[a.npmName]?.downloadsLastMonth;
    if (typeof d === 'number') return { metric: `↓ ${d.toLocaleString()} per mo`, placeholder: '' };
    return { metric: null, placeholder: '[npm stats pending]' };
  }
  if (a.pypiName) {
    const d = data.pypi.packages[a.pypiName]?.downloadsLastMonth;
    if (typeof d === 'number') return { metric: `↓ ${d.toLocaleString()} per mo`, placeholder: '' };
    return { metric: null, placeholder: '[pypi stats pending]' };
  }
  if (a.url) return { metric: `${a.url.replace('https://', '')} ↗`, placeholder: '' };
  return { metric: null, placeholder: '[gh stats pending]' };
}

const sorted = [...artifacts].sort((a, b) => a.order - b.order);
---

<div class="art-grid">
  {sorted.map(a => {
    const { metric, placeholder } = metricFor(a);
    return <Artifact artifact={a} metric={metric} metricPlaceholder={placeholder} />;
  })}
</div>

<style>
  .art-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1px; background: var(--line-2); border: 1px solid var(--line-2); }
  @media (max-width: 1080px) { .art-grid { grid-template-columns: repeat(2, 1fr); } }
  @media (max-width: 640px) { .art-grid { grid-template-columns: 1fr; } }
</style>
```

- [ ] **Step 3: Commit**

```bash
git add src/components/Artifact.astro src/components/ArtifactGrid.astro
git commit -m "feat(artifacts): card + bordered 3-col grid"
```

---

### Task 6.2: `WritingRow.astro` + `WritingBlock.astro`

**Files:**
- Create: `src/components/WritingRow.astro`
- Create: `src/components/WritingBlock.astro`

- [ ] **Step 1: Create `WritingRow.astro`**

Create `src/components/WritingRow.astro`:

```astro
---
import type { Essay } from '../lib/data';

interface Props { essay: Essay; entryNumber: string }
const { essay, entryNumber } = Astro.props;

function escapeHtml(s: string) {
  return s.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]!));
}
const titleHtml = essay.title.includes('*')
  ? escapeHtml(essay.title).replace(/\*(.+?)\*/g, '<em>$1</em>')
  : escapeHtml(essay.title);
---

<a class="w-row" href={essay.link} target="_blank" rel="noopener">
  <div class="w-date">{essay.dateLabel}</div>
  <div class="w-entry">{entryNumber}</div>
  <div class="w-title-cell">
    <span class="t" set:html={titleHtml}></span>
    <span class="sub">{essay.description}</span>
  </div>
  <div class="w-time">{essay.readTimeMinutes} min</div>
</a>

<style>
  .w-row { display: grid; grid-template-columns: 110px 90px 1fr 90px; gap: 28px; padding: 22px 0; border-bottom: 1px solid var(--line); align-items: baseline; text-decoration: none; color: inherit; transition: padding-left .25s, background .25s; }
  .w-row:hover { padding-left: 10px; background: rgba(255,138,76,0.025); }
  .w-row:hover .t { color: var(--signal); }
  .w-date { font-family: var(--mono); font-size: 12.5px; color: var(--dim); }
  .w-entry { font-family: var(--mono); font-weight: 500; font-size: 12px; color: var(--signal); letter-spacing: 0.1em; text-transform: uppercase; }
  .w-title-cell .t { font-family: var(--display); font-weight: 500; font-size: 1.45rem; letter-spacing: -0.015em; color: var(--ivory); font-variation-settings: "opsz" 144; transition: color .25s; line-height: 1.25; display: block; }
  .w-title-cell .t :global(em) { font-style: italic; font-weight: 300; color: var(--signal); }
  .w-title-cell .sub { display: block; font-family: var(--body); font-weight: 400; color: var(--dim); font-size: 14px; margin-top: 6px; }
  .w-time { font-family: var(--mono); font-size: 11.5px; color: var(--dim); text-align: right; }
  @media (max-width: 640px) { .w-row { grid-template-columns: 1fr; gap: 4px; } .w-time { text-align: left; } }
</style>
```

- [ ] **Step 2: Create `WritingBlock.astro`**

Create `src/components/WritingBlock.astro`:

```astro
---
import WritingRow from './WritingRow.astro';
import type { Essay } from '../lib/data';

interface Props { essays: Essay[]; limit?: number }
const { essays, limit = 4 } = Astro.props;

const shown = essays.slice(0, limit);
const start = shown.length;
---

{shown.length === 0
  ? <div class="empty">No essays pulled from Substack yet.</div>
  : <div class="w-table">
      {shown.map((e, i) => (
        <WritingRow essay={e} entryNumber={`Entry ${String(start - i).padStart(3, '0')}`} />
      ))}
    </div>
}

<style>
  .w-table { border-top: 1px solid var(--line-2); }
  .empty { padding: 24px; color: var(--dim); border-top: 1px dashed var(--line-2); border-bottom: 1px dashed var(--line-2); }
</style>
```

- [ ] **Step 3: Commit**

```bash
git add src/components/WritingRow.astro src/components/WritingBlock.astro
git commit -m "feat(writing): writing row + block for Substack data"
```

---

### Task 6.3: `DispatchInset.astro` + Jarvis content-schema extension

**Files:**
- Create: `src/components/DispatchInset.astro`
- Modify: `src/content.config.ts`

- [ ] **Step 1: Read current Jarvis schema**

Run: `cat src/content.config.ts`
Identify how the `jarvis` collection schema is defined.

- [ ] **Step 2: Extend schema with optional dispatch fields**

Modify the Jarvis collection `schema` in `src/content.config.ts` to include four optional fields:

```typescript
// Inside the jarvis collection definition:
schema: z.object({
  title: z.string(),
  date: z.date(),
  dispatchNumber: z.number().optional(),
  shiftDuration: z.string().optional(),
  diff: z.string().optional(),
  nextRun: z.string().optional()
})
```

Preserve any additional existing fields — merge, don't replace wholesale.

- [ ] **Step 3: Write `DispatchInset.astro`**

Create `src/components/DispatchInset.astro`:

```astro
---
import { getCollection } from 'astro:content';
import { getLastCommit } from '../lib/data/git';

const entries = await getCollection('jarvis');
const sorted = entries.sort((a, b) => (b.data.date?.getTime() ?? 0) - (a.data.date?.getTime() ?? 0));
const latest = sorted[0];

const commit = getLastCommit();
const shortSha = commit.sha.slice(0, 7);

const rawBody = latest?.body ?? '';
const paragraphs = rawBody.split(/\n\n+/).filter(p => p.trim().length > 0).slice(0, 3);

const dispatchNum = latest?.data.dispatchNumber;
const dispatchLabel = typeof dispatchNum === 'number' ? String(dispatchNum).padStart(3, '0') : '—';
---

{latest && (
  <div class="dispatch-inset">
    <div class="di-meta">
      <div><span class="k">Jarvis.log</span></div>
      <div>Dispatch {dispatchLabel}</div>
      <div>{latest.data.date?.toLocaleString('en-US', { month: 'short', day: 'numeric' })} · {latest.data.date?.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })} UTC</div>
      <div style="margin-top:12px">Author · <span style="color:var(--ivory)">Jarvis</span></div>
      <div>Commit · <span style="color:var(--signal)">{shortSha}</span></div>
    </div>

    <div>
      <h3 class="di-title" set:html={(latest.data.title ?? '').replace(/\*(.+?)\*/g, '<em>$1</em>')}></h3>
      {paragraphs.map(p => (
        <p set:html={p.replace(/\*\*(.+?)\*\*/g, '<b>$1</b>').replace(/\*(.+?)\*/g, '<em>$1</em>')}></p>
      ))}
      <a class="read-full" href={`/jarvis#${latest.slug}`}>Read full dispatch →</a>
    </div>

    <div class="sig">
      <div class="h">Shift</div>
      <div class="v">{latest.data.shiftDuration ?? '—'}</div>
      <div class="h">Diff</div>
      <div class="v">{latest.data.diff ?? '—'}</div>
      <div class="h">Next run</div>
      <div class="v">{latest.data.nextRun ?? '—'}</div>
    </div>
  </div>
)}

<style>
  .dispatch-inset { border: 1px solid var(--line-2); background: var(--ink-1); padding: 30px 36px; display: grid; grid-template-columns: 140px 1fr 200px; gap: 32px; margin-top: 24px; }
  .di-meta { font-family: var(--mono); font-size: 11.5px; color: var(--dim); line-height: 2; }
  .di-meta .k { color: var(--signal); font-weight: 500; letter-spacing: 0.08em; text-transform: uppercase; }
  .di-title { font-family: var(--display); font-weight: 500; font-size: 1.65rem; letter-spacing: -0.02em; margin: 0 0 14px; line-height: 1.15; font-variation-settings: "opsz" 144; }
  .di-title em { font-style: italic; font-weight: 300; color: var(--signal); }
  .dispatch-inset p { font-family: var(--body); font-size: 15.5px; line-height: 1.65; color: var(--ivory-2); margin: 0 0 10px; max-width: 64ch; }
  .dispatch-inset p b { color: var(--ivory); font-weight: 700; }
  .dispatch-inset p em { font-style: italic; color: var(--signal); font-weight: 400; }
  .read-full { display: inline-block; margin-top: 10px; font-family: var(--mono); font-size: 12px; color: var(--signal); text-decoration: none; letter-spacing: 0.08em; text-transform: uppercase; font-weight: 500; }
  .read-full:hover { text-decoration: underline; }
  .sig { font-family: var(--mono); font-size: 11.5px; color: var(--dim); line-height: 1.8; border-left: 1px solid var(--line-2); padding-left: 18px; }
  .sig .h { color: var(--signal); margin-bottom: 4px; font-weight: 500; letter-spacing: 0.08em; text-transform: uppercase; }
  .sig .v { color: var(--ivory); font-weight: 500; margin-bottom: 14px; }
  @media (max-width: 1080px) { .dispatch-inset { grid-template-columns: 1fr; gap: 18px; } }
</style>
```

- [ ] **Step 4: Verify build**

Run: `npm run build`
Expected: success; existing jarvis entries still parse (new fields are optional).

- [ ] **Step 5: Commit**

```bash
git add src/components/DispatchInset.astro src/content.config.ts
git commit -m "feat(dispatch): inline latest-Jarvis dispatch component"
```

---

### Task 6.4: `ShiftSummary.astro` + `StreamEntry.astro` + `Tape.astro`

**Files:**
- Create: `src/components/ShiftSummary.astro`
- Create: `src/components/StreamEntry.astro`
- Create: `src/components/Tape.astro`

- [ ] **Step 1: Create `ShiftSummary.astro`**

Create `src/components/ShiftSummary.astro`:

```astro
---
interface Props { whenLabel: string; narrative: string; metrics: string }
const { whenLabel, narrative, metrics } = Astro.props;
---

<div class="shift-summary">
  <span class="when">{whenLabel}</span>
  <span class="what" set:html={narrative.replace(/\*\*(.+?)\*\*/g, '<b>$1</b>')}></span>
  <span class="metr" set:html={metrics.replace(/\*\*(.+?)\*\*/g, '<b>$1</b>')}></span>
</div>

<style>
  .shift-summary { display: grid; grid-template-columns: 110px 1fr auto; gap: 28px; padding: 14px 0 14px 18px; border-bottom: 1px solid var(--line); border-left: 3px solid var(--signal); background: rgba(255,138,76,0.035); align-items: baseline; }
  .when { font-family: var(--mono); font-weight: 500; font-size: 12px; color: var(--signal); letter-spacing: 0.08em; text-transform: uppercase; }
  .what { font-size: 14.5px; color: var(--ivory-2); }
  .what b { color: var(--ivory); font-weight: 700; }
  .metr { font-family: var(--mono); font-size: 12px; color: var(--dim); }
  .metr b { color: var(--signal); font-weight: 500; }
</style>
```

- [ ] **Step 2: Create `StreamEntry.astro`**

Create `src/components/StreamEntry.astro`:

```astro
---
import type { StreamTag } from '../config/stream-sources';

interface Props { date: string; tag: StreamTag; title: string; sub?: string; meta?: string; href?: string }
const { date, tag, title, sub, meta, href } = Astro.props;
const Tag = href ? 'a' : 'div';
---

<Tag class="sr" href={href} target={href?.startsWith('http') ? '_blank' : undefined} rel={href?.startsWith('http') ? 'noopener' : undefined}>
  <span class="d">{date}</span>
  <span class={`tag ${tag.toLowerCase()}`}>{tag}</span>
  <span class="tt">{title}{sub && <span class="sub"> — {sub}</span>}</span>
  <span class="r">{meta}</span>
</Tag>

<style>
  .sr { display: grid; grid-template-columns: 80px 90px 1fr auto; gap: 22px; padding: 12px 0; border-bottom: 1px solid var(--line); align-items: baseline; text-decoration: none; color: inherit; }
  .sr:hover { background: rgba(255,138,76,0.025); }
  .d { font-family: var(--mono); font-size: 12.5px; color: var(--dim); }
  .tag { font-family: var(--mono); font-weight: 500; font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase; color: var(--signal); }
  .tag.log { color: var(--pulse); }
  .tag.essay { color: #d8b3f5; }
  .tag.prod { color: var(--cold); }
  .tag.ship { color: var(--signal); }
  .tt { color: var(--ivory); font-size: 14.5px; }
  .sub { color: var(--dim); }
  .r { font-family: var(--mono); font-size: 11.5px; color: var(--dim-2); }
</style>
```

- [ ] **Step 3: Create `Tape.astro`**

Create `src/components/Tape.astro`:

```astro
---
import ShiftSummary from './ShiftSummary.astro';
import StreamEntry from './StreamEntry.astro';
import type { Shift, Essay } from '../lib/data';
import type { StreamTag } from '../config/stream-sources';
import { getCollection } from 'astro:content';
import { TAPE_HOME_LIMIT } from '../config/stream-sources';

interface Props { shifts: Shift[]; essays: Essay[]; limit?: number }
const { shifts, essays, limit = TAPE_HOME_LIMIT } = Astro.props;

type Entry = { date: Date; tag: StreamTag; title: string; sub?: string; meta?: string; href?: string };

const jarvisEntries = await getCollection('jarvis');

const entries: Entry[] = [
  ...essays.map(e => ({ date: e.publishedAt, tag: 'ESSAY' as StreamTag, title: e.title, meta: `${e.readTimeMinutes} min`, href: e.link })),
  ...jarvisEntries.map(j => ({
    date: j.data.date as Date,
    tag: 'LOG' as StreamTag,
    title: `Jarvis dispatch ${typeof j.data.dispatchNumber === 'number' ? String(j.data.dispatchNumber).padStart(3, '0') : ''}`,
    sub: j.data.title,
    meta: 'read →',
    href: `/jarvis#${j.slug}`
  }))
];

entries.sort((a, b) => b.date.getTime() - a.date.getTime());
const capped = entries.slice(0, limit);

function formatMD(d: Date) {
  return `${String(d.getMonth() + 1).padStart(2, '0')}/${String(d.getDate()).padStart(2, '0')}`;
}

function shiftLabel(shift: Shift) {
  const d = shift.start;
  const label = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  const h = d.getUTCHours();
  const bucket = h < 6 ? 'overnight' : h < 12 ? 'morning' : h < 18 ? 'afternoon' : 'evening';
  return `${label} · ${bucket}`;
}

function shiftMetrics(shift: Shift) {
  return `**+${shift.additions.toLocaleString()} / −${shift.deletions.toLocaleString()} loc** · ${shift.commitCount} commits`;
}

function shiftNarrative(shift: Shift) {
  const prefixes = shift.commits.map(c => c.subject.split(':')[0]).filter(Boolean);
  const unique = Array.from(new Set(prefixes)).slice(0, 3).join(', ');
  return `**Shift summary** — ${shift.commitCount} commits${unique ? ` across ${unique}` : ''}.`;
}

const recentShifts = [...shifts].sort((a, b) => b.start.getTime() - a.start.getTime()).slice(0, 2);
---

<div class="tape">
  {recentShifts.map(shift => (
    <ShiftSummary whenLabel={shiftLabel(shift)} narrative={shiftNarrative(shift)} metrics={shiftMetrics(shift)} />
  ))}

  {capped.map(entry => (
    <StreamEntry date={formatMD(entry.date)} tag={entry.tag} title={entry.title} sub={entry.sub} meta={entry.meta} href={entry.href} />
  ))}

  <a class="see-all" href="/jarvis">See full tape →</a>
</div>

<style>
  .tape { border-top: 1px solid var(--line-2); }
  .see-all { display: inline-flex; align-items: center; gap: 10px; margin-top: 30px; font-family: var(--body); font-weight: 700; font-size: 13px; color: var(--signal); border: 1px solid var(--line-2); padding: 12px 18px; text-decoration: none; letter-spacing: 0.02em; }
  .see-all:hover { border-color: var(--signal); }
</style>
```

- [ ] **Step 4: Commit**

```bash
git add src/components/ShiftSummary.astro src/components/StreamEntry.astro src/components/Tape.astro
git commit -m "feat(tape): unified stream with shift-summary rollups"
```

---

### Task 6.5: `BeliefsGrid.astro`

**Files:**
- Create: `src/components/BeliefsGrid.astro`

- [ ] **Step 1: Write**

Create `src/components/BeliefsGrid.astro`:

```astro
---
const beliefs = [
  { n: '01', text: '*MAP* over motivation. Map the work, act in small loops, publish results early.' },
  { n: '02', text: 'Taste in AI means *constraints*. If an agent cannot explain what it changed, it has not earned trust.' },
  { n: '03', text: 'One ticket, *one turn*. Speed is real only when quality survives contact.' },
  { n: '04', text: 'Build for the *next tired* version of yourself. Future me should resume instantly.' }
];
---

<div class="b-grid">
  {beliefs.map(b => (
    <div class="b-cell">
      <div class="bn">Rule · {b.n}</div>
      <div class="bt" set:html={b.text.replace(/\*(.+?)\*/g, '<em>$1</em>')}></div>
    </div>
  ))}
</div>

<style>
  .b-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1px; background: var(--line-2); border: 1px solid var(--line-2); }
  .b-cell { background: var(--ink-1); padding: 24px 22px 26px; min-height: 170px; }
  .bn { font-family: var(--mono); font-weight: 500; font-size: 11.5px; color: var(--signal); letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 14px; }
  .bt { font-family: var(--display); font-weight: 400; font-size: 1.25rem; line-height: 1.4; color: var(--ivory); font-variation-settings: "opsz" 144; }
  .bt em { font-style: italic; color: var(--signal); font-weight: 500; }
  @media (max-width: 1080px) { .b-grid { grid-template-columns: repeat(2, 1fr); } }
  @media (max-width: 640px) { .b-grid { grid-template-columns: 1fr; } }
</style>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/BeliefsGrid.astro
git commit -m "feat(beliefs): 4-cell belief grid component"
```

---

## Phase 7 · Home page assembly + colophon

### Task 7.1: Rewrite `src/pages/index.astro`

**Files:**
- Modify: `src/pages/index.astro`

- [ ] **Step 1: Replace entire file**

Replace `src/pages/index.astro` with:

```astro
---
import Layout from '../layouts/Layout.astro';
import Hero from '../components/Hero.astro';
import SectionHead from '../components/SectionHead.astro';
import ArtifactGrid from '../components/ArtifactGrid.astro';
import WritingBlock from '../components/WritingBlock.astro';
import DispatchInset from '../components/DispatchInset.astro';
import Tape from '../components/Tape.astro';
import BeliefsGrid from '../components/BeliefsGrid.astro';
import { loadSignalData } from '../lib/data';

const data = await loadSignalData();
---

<Layout current="home" title="Dushyant Garg" description="Product builder and applied AI researcher shipping at the pace of agents. Grounded in git log.">
  <main class="sd-main">
    <Hero />

    <section id="artifacts">
      <SectionHead num="§ 01" name="What I *ship*" meta="9 live · 2 private · updated continuously" />
      <ArtifactGrid />
    </section>

    <section id="writing">
      <SectionHead num="§ 02" name="What I *think*" meta="Substack, auto-synced · long form plus dispatches" />
      <WritingBlock essays={data.essays} limit={4} />
      <DispatchInset />
    </section>

    <section id="tape">
      <SectionHead num="§ 03" name="The *tape*" meta={`${data.essays.length + data.commits.length} entries · reverse-chron · derived from git log and rss`} />
      <Tape shifts={data.shifts} essays={data.essays} limit={12} />
    </section>

    <section id="beliefs">
      <SectionHead num="§ 04" name="Beliefs" meta="four rules · tested nightly" />
      <BeliefsGrid />
    </section>
  </main>
</Layout>

<style>
  .sd-main { max-width: var(--max-w); margin: 0 auto; padding: 0 32px; position: relative; z-index: 2; }
  .sd-main > section { padding: 0 0 64px; }
  @media (max-width: 640px) { .sd-main { padding: 0 22px; } }
</style>
```

- [ ] **Step 2: Create stub colophon page**

Create `src/pages/colophon.astro`:

```astro
---
import Layout from '../layouts/Layout.astro';
import SectionHead from '../components/SectionHead.astro';
import { loadSignalData } from '../lib/data';
const data = await loadSignalData();

const rows = [
  { label: 'Last commit', value: `${data.lastCommit.sha.slice(0, 7)} · ${data.lastCommitRelative}`, source: 'local git log' },
  { label: 'Commits (7d)', value: data.github.commits7d ?? '—', source: 'github graphql · contributionsCollection' },
  { label: 'Commits (30d)', value: data.github.commits30d ?? '—', source: 'github graphql · contributionsCollection' },
  { label: 'Stars (all repos)', value: data.github.totalStars ?? '—', source: 'github rest · /users/{user}/repos' },
  { label: 'npm downloads (30d)', value: Object.keys(data.npm.packages).length === 0 ? '—' : Object.values(data.npm.packages).reduce((t, p) => t + p.downloadsLastMonth, 0).toLocaleString(), source: 'api.npmjs.org/downloads/point/last-month' },
  { label: 'pypi downloads (30d)', value: Object.keys(data.pypi.packages).length === 0 ? '—' : Object.values(data.pypi.packages).reduce((t, p) => t + p.downloadsLastMonth, 0).toLocaleString(), source: 'pypistats.org/api/packages/{pkg}/recent' },
  { label: 'Essays', value: data.essays.length, source: 'dushyantg.substack.com/feed (rss)' },
  { label: 'Shift summaries', value: data.shifts.length, source: 'local git log + 4-hour gap clustering' }
];
---

<Layout current="home" title="Colophon — Dushyant Garg" description="Every metric on this site, with its source.">
  <main class="col-main">
    <SectionHead num="§" name="Colophon" meta="every metric · every source" />
    <p class="intro">
      This site is derived from a public repository and a handful of public APIs. Every number on the home page
      maps to one of the sources below. If a source is unwired, you'll see an italic placeholder — not a made-up figure.
    </p>
    <table>
      <thead><tr><th>Metric</th><th>Current value</th><th>Source</th></tr></thead>
      <tbody>
        {rows.map(r => (
          <tr>
            <td>{r.label}</td>
            <td class="v">{r.value}</td>
            <td class="s">{r.source}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </main>
</Layout>

<style>
  .col-main { max-width: 880px; margin: 0 auto; padding: 0 32px; position: relative; z-index: 2; }
  .intro { color: var(--ivory-2); margin: 24px 0 32px; font-size: 16px; line-height: 1.7; max-width: 62ch; }
  table { width: 100%; border-collapse: collapse; border: 1px solid var(--line-2); }
  th, td { padding: 12px 16px; border-bottom: 1px solid var(--line); text-align: left; vertical-align: top; }
  th { color: var(--signal); font-family: var(--mono); font-size: 11.5px; letter-spacing: 0.1em; text-transform: uppercase; font-weight: 500; }
  td { font-family: var(--body); font-size: 14.5px; color: var(--ivory-2); }
  td.v { font-family: var(--mono); color: var(--ivory); font-weight: 500; }
  td.s { font-family: var(--mono); color: var(--dim); font-size: 12.5px; }
  @media (max-width: 640px) { .col-main { padding: 0 22px; } table { font-size: 13px; } th, td { padding: 10px 12px; } }
</style>
```

- [ ] **Step 3: Verify build**

Run: `npm run build`
Expected: success.

- [ ] **Step 4: Commit**

```bash
git add src/pages/index.astro src/pages/colophon.astro
git commit -m "feat(home): compose Signal Desk home + colophon stub"
```

---

## Phase 8 · Retirements + beliefs restyle

### Task 8.1: Delete `JarvisSpotlight.astro`

**Files:**
- Delete: `src/components/JarvisSpotlight.astro`

- [ ] **Step 1: Confirm no references**

Run: `grep -r "JarvisSpotlight" src/`
Expected: no matches.

- [ ] **Step 2: Delete and commit**

```bash
git rm src/components/JarvisSpotlight.astro
git commit -m "chore: retire JarvisSpotlight (absorbed into DispatchInset)"
```

---

### Task 8.2: Restyle `/beliefs` using `BeliefsGrid`

**Files:**
- Modify: `src/pages/beliefs.astro`

- [ ] **Step 1: Replace**

Replace `src/pages/beliefs.astro` with:

```astro
---
import Layout from '../layouts/Layout.astro';
import SectionHead from '../components/SectionHead.astro';
import BeliefsGrid from '../components/BeliefsGrid.astro';
---

<Layout current="beliefs" title="Beliefs — Dushyant Garg" description="Four rules tested nightly.">
  <main class="beliefs-main">
    <SectionHead num="§" name="Beliefs" meta="four rules · tested nightly · every agent reads them" />
    <BeliefsGrid />
  </main>
</Layout>

<style>
  .beliefs-main { max-width: var(--max-w); margin: 0 auto; padding: 0 32px; position: relative; z-index: 2; }
  @media (max-width: 640px) { .beliefs-main { padding: 0 22px; } }
</style>
```

- [ ] **Step 2: Commit**

```bash
git add src/pages/beliefs.astro
git commit -m "feat(beliefs): restyle /beliefs page with BeliefsGrid"
```

---

## Phase 9 · Verification

### Task 9.1: Full build + preview walkthrough

- [ ] **Step 1: Run all tests**

Run: `npm test`
Expected: PASS (13+ tests).

- [ ] **Step 2: Production build**

Run: `npm run build`
Expected: success, no type errors.

- [ ] **Step 3: Preview + walk through**

Run: `npm run preview`, visit `http://localhost:4321/`.

Check each section (tick as verified):
- [ ] Nav: mark, 4-item status strip, 5 nav links
- [ ] Hero: kicker, hero line with italic amber *pace*, sub copy, 1 primary + 4 secondary CTAs
- [ ] Heatmap: 26×7 cell grid
- [ ] Numerals: 4 cells (placeholders where data unwired)
- [ ] §01 Artifacts: 9 cards with titles, descriptions, stacks, metrics or placeholders
- [ ] §02 Writing: 4 essay rows + dispatch inset below
- [ ] §03 Tape: ≥1 shift summary + entries + "See full tape →"
- [ ] §04 Beliefs: 4 cells
- [ ] Footer: copyright, last-commit line, colophon link, external links

Visit `/colophon` — table renders with 8 rows.
Visit `/beliefs` — restyled grid renders.
Visit `/writing`, `/projects`, `/jarvis` — existing pages still render (sub-page restyles deferred).

Kill with Ctrl-C.

- [ ] **Step 4: Responsive spot-check**

In preview, resize browser to each breakpoint and verify:
- [ ] 1080px: hero → single col, artifact grid → 2-col, beliefs → 2-col, numerals → 2×2, nav links hide
- [ ] 640px: everything → single col, status strip wraps

- [ ] **Step 5: Final status**

Run: `git status`
Expected: working tree clean (all commits made).

---

## Out of scope (follow-up plan)

- Restyle `/writing`, `/jarvis`, `/projects` as Signal Desk pages
- Add `/artifacts` and `/stream` full-index pages
- Vercel cron for periodic rebuilds (`0 */6 * * *`)
- GitHub Action for snapshot refresh
- CI stale-site guard (fail if `lastCommit.age > 7 days`)
- Lighthouse audit + accessibility contrast sweep
- OG image regeneration per page

---

## Self-review

**Spec coverage:**
- §3 positioning → Task 5.3 (hero copy)
- §4 palette + type → Tasks 1.1, 1.2, 1.3
- §5 IA (home + colophon + beliefs only) → Tasks 7.1, 8.2
- §6.1 nav + status strip → Tasks 4.2, 4.3
- §6.2 hero + heatmap + numerals → Tasks 5.1, 5.2, 5.3
- §6.3 artifacts → Task 6.1
- §6.4 writing + dispatch → Tasks 6.2, 6.3
- §6.5 tape → Task 6.4
- §6.6 beliefs → Task 6.5
- §6.7 footer → Task 4.4
- §7 data sources → Tasks 3.1–3.9
- §8 truth rules → enforced by placeholder/snapshot patterns in fetchers
- §9 components → all tasked

Sub-page IA from spec §5 (`/artifacts`, `/stream`, restyles of `/writing`, `/jarvis`) is deferred and listed in Out-of-scope.

**Placeholder scan:** No `TBD` / `TODO` / vague-handler instructions remain. Every code step contains complete code.

**Type consistency:** `CommitRecord`, `Shift`, `Essay`, `SignalData`, `Artifact`, `HeatmapCell`, `GithubSnapshot`, `NpmSnapshot`, `PypiSnapshot`, `StreamTag` are defined once and imported with identical names everywhere.

**Shell-safety:** `src/lib/data/git.ts` uses `execFileSync('git', [...args])` — argv-style, no shell interpolation, no injection surface.
