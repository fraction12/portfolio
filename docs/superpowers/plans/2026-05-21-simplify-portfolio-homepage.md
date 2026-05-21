# Simplify Portfolio Homepage Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the portfolio homepage read as a serious Product Manager / Builder site within the first 10 seconds.

**Architecture:** Keep the Astro page and existing design tokens. Replace the homepage hero's noisy terminal proof surface with a focused selected-proof component, simplify section labels and card density, then validate with tests, build, copy scan, and responsive local inspection.

**Tech Stack:** Astro 6, TypeScript data config, CSS modules imported through `src/styles/base.css`, Vitest.

---

### Task 1: Homepage Hero And Proof Surface

**Files:**
- Modify: `src/components/Hero.astro`
- Create: `src/components/SelectedProof.astro`
- Modify: `src/pages/index.astro`

- [x] **Step 1: Rewrite hero copy**

  Update `Hero.astro` to use the Product Manager / Builder positioning, the thesis `I turn ambiguous AI ideas into working products.`, and plain CTAs: `See selected work` and `Read the writing`.

- [x] **Step 2: Add selected proof**

  Create `SelectedProof.astro` as a quiet panel that accepts curated artifacts and renders three or four proof rows with plain descriptions, not metrics-terminal rows.

- [x] **Step 3: Wire proof into homepage**

  Replace `ColophonTerminal` usage on `index.astro` with `SelectedProof` while keeping the two-column first viewport.

### Task 2: Reduce Homepage Noise

**Files:**
- Modify: `src/pages/index.astro`
- Modify: `src/components/ToolCard.astro`
- Modify: `src/styles/components/card.css` if needed

- [x] **Step 1: Simplify section labels**

  Change homepage section heads from joke/punctuation labels to plain labels: `Selected Work`, `Writing`, `Contact`.

- [x] **Step 2: Tune project cards**

  Reduce install command prominence on homepage cards and make metadata less visually dominant while preserving external links.

- [x] **Step 3: Keep responsive polish**

  Add stable responsive rules for the hero/proof layout and selected work list so mobile stacks without crowded labels.

### Task 3: Selected Work Curation

**Files:**
- Modify: `src/pages/index.astro`

- [x] **Step 1: Keep featured set small**

  Use three or four high-signal artifacts from the existing data.

- [x] **Step 2: Preserve broader navigation**

  Keep the `/tools` link as the route to the full catalog.

### Task 4: Verification And OpenSpec Closeout

**Files:**
- Modify: `openspec/changes/simplify-portfolio-homepage/tasks.md`

- [x] **Step 1: Run tests**

  Run `npm test`.

- [x] **Step 2: Run build**

  Run `npm run build`.

- [x] **Step 3: Inspect local responsive layout**

  Start local dev or preview, then inspect desktop and mobile widths with available browser tooling or document the blocker.

- [x] **Step 4: Scan copy**

  Use `rg` to verify homepage copy does not contain forbidden non-metric/status phrases.

- [x] **Step 5: Mark only completed OpenSpec tasks**

  Update `openspec/changes/simplify-portfolio-homepage/tasks.md` after each verified task is actually complete.
