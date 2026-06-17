---
name: html-diagrams
description: "Create polished, portable single-file HTML diagrams for workflows, systems, architectures, maps, timelines, and visual explanations."
version: 1.0.0
author: Dushyant Garg
license: MIT
repo: https://github.com/fraction12/agent-skills/tree/main/skills/html-diagrams
agents: [codex, claude-code, openclaw, hermes, cursor, gemini-cli]
---

# HTML Diagrams

Use this skill when the user wants a diagram that should be visually polished, shareable, printable, or easier to control than Mermaid.

Prefer a self-contained `.html` artifact with embedded CSS and optional inline SVG for connectors. The file must open locally without a build step.

## Use For

- Architecture and system maps
- Agent, workflow, and process diagrams
- Swimlanes, timelines, comparisons, and layered maps
- Visual explanations intended for screenshots, docs, decks, or sharing
- Cases where Mermaid or Graphviz layout would be too rigid or visually plain

## Avoid For

- User explicitly asks for Mermaid, Graphviz, Excalidraw, or another format
- Tiny diagrams where text or Markdown is enough
- Dense graph layouts where automatic graph layout is more important than presentation
- Interactive apps; this skill is for diagram artifacts, not full tools

## Workflow

1. Clarify the diagram goal, audience, and output path if they are unclear.
2. Pick the closest pattern from `references/examples.md`.
3. Use the primitives in `references/primitives.md`; do not invent a new visual system unless the user asked for a distinct style.
4. Start from `assets/diagram.css` or embed its contents into the output file.
5. Add inline SVG only for connectors, arrows, braces, or annotations that CSS cannot handle cleanly.
6. Keep the output portable: one `.html` file, no remote assets, no external fonts, no build tooling.
7. Verify the file opens and that text does not overlap at a desktop width. If browser tooling is available, screenshot it.

## Output Contract

- Save exactly one primary `.html` file unless the user asks for variants.
- Embed CSS in a `<style>` block.
- Use semantic sections and readable class names.
- Include a short legend when colors, line styles, or badges encode meaning.
- Use `@media print` rules and avoid content that disappears in print.
- Include a small footer with the diagram title and generation date only when useful for sharing.
