import {
  artifacts,
  CATEGORY_LABELS,
  type Artifact,
  type ArtifactCategory,
} from './packages';

export type ToolDetailLink = {
  label: string;
  href: string;
  external?: boolean;
};

export type ToolDemoMedia = {
  type: 'video' | 'image';
  status: 'none' | 'ready';
  label: string;
  caption: string;
  duration?: string;
  src?: string;
  poster?: string;
  embedUrl?: string;
  transcript?: string;
  alt?: string;
};

export type ToolDetailSection = {
  title: string;
  body: string[];
};

export type ToolDetail = {
  artifact: Artifact;
  slug: string;
  detailPath: string;
  categoryLabel: string;
  tagline: string;
  summary: string;
  audience: string;
  problem: string;
  statusNote: string;
  demo: ToolDemoMedia;
  sections: ToolDetailSection[];
  links: ToolDetailLink[];
};

type ToolDetailOverride = Partial<
  Omit<ToolDetail, 'artifact' | 'slug' | 'detailPath' | 'categoryLabel' | 'links'>
> & {
  links?: ToolDetailLink[];
};

const audienceByCategory: Record<ArtifactCategory, string> = {
  memory: 'Agent builders who need durable context, recall, and inspection across sessions.',
  libraries: 'Engineers building safer command surfaces and reusable primitives for agent-facing tools.',
  orchestration: 'People coordinating multiple agents, local runs, task queues, and handoffs.',
  'human-tools': 'Builders and operators who need practical interfaces around AI work instead of raw logs.',
  products: 'Teams with real operational workflows where AI needs to produce reviewable work.',
  experiments: 'Personal-product and early-stage product explorations that test a narrow workflow.',
};

const problemByCategory: Record<ArtifactCategory, string> = {
  memory: 'Agent work breaks down when useful context is trapped in one session or hidden in unstructured logs.',
  libraries: 'Agent-facing tools become brittle when commands, help text, and outputs are not designed as stable interfaces.',
  orchestration: 'Multi-agent work needs coordination boundaries, shared task state, and clear operating contracts.',
  'human-tools': 'AI systems need human-readable surfaces so builders can inspect, steer, and trust what is happening.',
  products: 'Real users need AI workflows that stay grounded in evidence and produce outputs they can actually use.',
  experiments: 'Early product ideas need fast, honest prototypes that reveal whether the workflow deserves more investment.',
};

const workflowByCategory: Record<ArtifactCategory, string> = {
  memory: 'Capture the important entities, preserve relationships, and return context when the next agent or session needs it.',
  libraries: 'Define the tool boundary, make commands discoverable, and keep outputs structured enough for humans and agents.',
  orchestration: 'Create the work item, claim or run it safely, and keep the surrounding system readable while agents operate.',
  'human-tools': 'Turn opaque activity into a visible surface where a person can inspect, decide, and continue the work.',
  products: 'Start from the user workflow, ground the AI output in source material, and hand back a reviewable artifact.',
  experiments: 'Prototype the loop, test the interaction, and keep only the parts that create a clearer user decision.',
};

const outputByCategory: Record<ArtifactCategory, string> = {
  memory: 'A more inspectable memory layer that can become part of a larger agent operating system.',
  libraries: 'Reusable primitives and source code that make the next tool easier to build correctly.',
  orchestration: 'A clearer operating surface for running, tracking, and recovering agent work.',
  'human-tools': 'A practical interface layer that makes AI-assisted work easier to understand and operate.',
  products: 'A product workflow that converts messy inputs into a useful, reviewable output.',
  experiments: 'A contained build with lessons that can inform the next product or system.',
};

function sections(
  whatItIs: string[],
  workflow: string[],
  output: string[],
): ToolDetailSection[] {
  return [
    { title: 'What it is', body: whatItIs },
    { title: 'Workflow', body: workflow },
    { title: 'Output', body: output },
  ];
}

const overrideBySlug: Record<string, ToolDetailOverride> = {
  agentsense: {
    tagline: 'Knowledge-graph memory for OpenClaw.',
    summary:
      'AgentSense watches OpenClaw conversations, extracts people, projects, tools, and decisions, then stores them as a relationship graph the agent can query later.',
    audience:
      'OpenClaw users who need agent memory to answer relationship questions, not only semantic text search.',
    problem:
      'Chunked markdown memory can find what was said, but it struggles to answer who is connected to what, which tools belong to which project, and how past decisions relate.',
    statusNote: 'Public OpenClaw plugin; requires OpenClaw 2026.2.17+ and Node.js 20+.',
    demo: {
      type: 'video',
      status: 'none',
      label: 'AgentSense memory graph demo',
      duration: '75 sec target',
      caption:
        'Show a conversation becoming entities and relationships, then query it through graph_search, /graph, and auto-recall.',
    },
    sections: sections(
      [
        'A knowledge-graph memory plugin for OpenClaw that turns conversation history into persistent entities and relationships.',
        'The useful unit is not another note. It is a navigable map of people, projects, tools, and decisions.',
      ],
      [
        'OpenClaw runs with AgentSense enabled, the extraction cron observes memory, entities are written into SQLite, and the agent can query the graph when context is needed.',
        'The plugin keeps the existing memory tools intact while adding graph_search, a Telegram /graph command, and auto-recall behavior.',
      ],
      [
        'The output is a relationship-aware memory layer that helps an agent recover context like project ownership, tool relationships, and decision history.',
      ],
    ),
  },
  agentrem: {
    tagline: 'Structured reminders for agents that need to remember at the right time.',
    summary:
      'agentrem is a SQLite-backed CLI and MCP server for reminders with time, keyword, condition, session, heartbeat, recurrence, priority, and token-budget aware retrieval.',
    audience:
      'AI agents, Codex/Claude operators, and local workflows that need reminders to survive across sessions.',
    problem:
      'Static notes and memory files can store reminders, but they do not wake up on time, trigger on conditions, or fit reminder recall into a bounded context window.',
    statusNote: 'Public npm package, CLI, native notification flow, and MCP server.',
    demo: {
      type: 'image',
      status: 'ready',
      label: 'agentrem website preview',
      src: '/tool-media/agentrem/agentrem-preview.jpg',
      alt: 'agentrem website showing the install command, status badges, and agent reminder positioning.',
      caption:
        'The public agentrem site explains the reminder CLI and MCP server, including install flow and agent-focused positioning.',
    },
    sections: sections(
      [
        'A reminder system built for agents rather than humans alone: JSON-first, searchable, triggerable, and persistent.',
        'It handles one-off reminders, recurring reminders, priority escalation, and agent-specific namespaces.',
      ],
      [
        'An agent adds reminders when the user says "remind me" or "next time", checks on session start, and can block with watch mode until something fires.',
        'Triggered reminders can surface through CLI output, native notifications, hooks, or MCP.',
      ],
      [
        'The output is a reliable follow-up queue that agents can query without scraping prose or overflowing the context window.',
      ],
    ),
  },
  agenttk: {
    tagline: 'A TypeScript toolkit for deterministic, agent-friendly CLIs.',
    summary:
      'AgentTK provides the runtime plumbing for agent-authored command-line tools: command dispatch, built-in help, structured result envelopes, human output, dry-run semantics, recovery helpers, and test utilities.',
    audience:
      'Engineers and coding agents building small operational CLIs that need predictable behavior for both humans and agents.',
    problem:
      'Agent-authored tools often reimplement command parsing, error envelopes, help text, dry runs, and tests differently every time.',
    statusNote: 'Public npm toolkit for TypeScript CLIs.',
    demo: {
      type: 'video',
      status: 'none',
      label: 'AgentTK CLI contract demo',
      duration: '70 sec target',
      caption:
        'Show a tiny tool defining commands, returning structured success/failure envelopes, rendering help, and running a safe dry-run mutation.',
    },
    sections: sections(
      [
        'A small framework for building deterministic CLIs that agents can operate safely.',
        'It is not a CLI generator. The agent still writes the domain tool; AgentTK supplies the reusable runtime contract.',
      ],
      [
        'Define commands, attach help metadata, return ok/fail envelopes, layer concise human output over JSON, and test the behavior without shell-heavy tests.',
      ],
      [
        'The output is a CLI surface with predictable dispatch, structured results, recovery guidance, and safer mutation semantics.',
      ],
    ),
  },
  starglass: {
    tagline: 'Observation runtime for agent systems watching changing external state.',
    summary:
      'Starglass turns polling, checkpointing, duplicate suppression, and event dispatch into a source-agnostic runtime for long-lived agent watchers.',
    audience:
      'Agent infrastructure teams building background monitors, evaluation loops, and restart-safe observation pipelines.',
    problem:
      'Watching external systems sounds simple until runs restart, sources churn, payloads duplicate, and downstream agents need stable event identity instead of raw snapshots.',
    statusNote: 'Public TypeScript runtime for observation-heavy agent systems.',
    demo: {
      type: 'video',
      status: 'none',
      label: 'Starglass observation loop demo',
      duration: '90 sec target',
      caption:
        'Show an HTTP/feed/filesystem source producing a normalized event, checkpointing compact state, and dispatching to a downstream handler.',
    },
    sections: sections(
      [
        'An observation layer for systems that need to monitor external state and turn meaningful change into normalized events.',
        'Built-in source families cover HTTP, feeds, and filesystem inputs.',
      ],
      [
        'Define an observation target, choose or implement a SourceAdapter, let the runtime execute the poll, persist compact checkpoints, dedupe, and hand normalized events downstream.',
      ],
      [
        'The output is a stable event envelope with enough identity and compact state to resume safely after cron jobs, restarts, or long-running watch loops.',
      ],
    ),
  },
  potato: {
    tagline: 'A terminal cockpit for coordinating real coding agents.',
    summary:
      'Potato runs Codex, Claude Code, and generic CLI agents in project-aware panes with roles, shared task state, MCP coordination tools, git awareness, and OpenSpec task visibility.',
    audience:
      'Builders running multiple coding agents who need coordination without becoming the human router between terminals.',
    problem:
      'Multi-agent work quickly turns into too many terminals, copy-pasted context, unclear ownership, and no trustworthy view of who is doing what.',
    statusNote: 'Public Rust project; requires Rust and at least one installed agent CLI.',
    demo: {
      type: 'video',
      status: 'none',
      label: 'Potato multi-agent cockpit demo',
      duration: '90 sec target',
      caption:
        'Show role setup, side-by-side Codex/Claude panes, task claiming, agent messaging, and OpenSpec task visibility in one session.',
    },
    sections: sections(
      [
        'A project-local cockpit for running real coding agents side by side while preserving their native terminal behavior.',
        'It adds coordination state, roles, task visibility, and MCP tools around the agents instead of replacing them with a fake chat UI.',
      ],
      [
        'Define roles, launch a session, let agents use shared MCP tools for messages/tasks/context, and watch their panes, git state, and project tasks in one TUI.',
      ],
      [
        'The output is a more controlled multi-agent work session with shared context and fewer human routing chores.',
      ],
    ),
  },
  agentplan: {
    tagline: 'A local task board any AI tool can drive.',
    summary:
      'agentplan is a SQLite-backed planning and ticket board for AI agents, with spaces, docs, dependencies, atomic ticket claiming, model tiers, plugins, and a live dashboard.',
    audience:
      'Teams or solo builders coordinating Claude, Codex, and other agents on the same repo or project.',
    problem:
      'Agents can plan, but without shared durable task state they duplicate work, lose dependencies, and need the user to manually coordinate the queue.',
    statusNote: 'Public PyPI package with CLI, local storage, plugins, and optional dashboard.',
    demo: {
      type: 'image',
      status: 'ready',
      label: 'agentplan website preview',
      src: '/tool-media/agentplan/agentplan-preview.jpg',
      alt: 'agentplan website showing project management for AI-native teams and the PyPI install command.',
      caption:
        'The public agentplan site frames the project as a shared task board for AI-native teams and points visitors to install and docs.',
    },
    sections: sections(
      [
        'A shared planning layer for AI work sessions: projects, spaces, docs, tickets, dependencies, notes, logs, and status.',
        'It is local-first and designed so multiple AI tools can work from the same backlog.',
      ],
      [
        'Create a project, break work into tickets, assign model tiers, claim the next ticket, log progress, and inspect state from the CLI or dashboard.',
      ],
      [
        'The output is an explicit, claimable work queue with enough structure for multiple agents to avoid stepping on each other.',
      ],
    ),
  },
  'spec-ui': {
    tagline: 'A compiler from product specs to deterministic HTML prototypes.',
    summary:
      'Spec UI turns agent-authored markdown specs into standalone, portable HTML prototypes with a bounded grammar for SaaS, web-app, and marketing-page review.',
    audience:
      'Product builders and agents who need a reviewable UI artifact from a written spec before committing to implementation.',
    problem:
      'Specs are easy to write but hard to inspect visually; free-form generated prototypes are easy to make but hard to reproduce or review deterministically.',
    statusNote: 'Public source; compiler foundation exists, package is not currently published.',
    demo: {
      type: 'video',
      status: 'ready',
      label: 'Spec UI compile demo',
      duration: '46 sec',
      src: '/tool-media/spec-ui/spec-ui-demo.mp4',
      poster: '/tool-media/spec-ui/spec-ui-demo-poster.jpg',
      caption:
        'A short walkthrough of Spec UI turning a structured markdown spec package into a deterministic standalone HTML prototype.',
    },
    sections: sections(
      [
        'A spec-to-prototype compiler that translates structured markdown packages into portable HTML and IR artifacts.',
        'The grammar focuses on bounded SaaS/web-app and marketing-page layouts rather than arbitrary free-form generation.',
      ],
      [
        'Initialize or discover a spec package, validate the source grammar, compile to IR/HTML, and hand the artifact to a human reviewer or agent workflow.',
      ],
      [
        'The output is a deterministic prototype that can be inspected, shared, and regenerated from source instead of treated as a one-off mockup.',
      ],
    ),
  },
  microcanvas: {
    tagline: 'A reliable display surface for AI-generated artifacts.',
    summary:
      'Microcanvas renders supported files, opens them in a viewer, tracks the active surface, and gives agents status, verify, update, and snapshot commands for visual proof.',
    audience:
      'Coding agents and operators who need a predictable way to show, refresh, and verify local artifacts.',
    problem:
      'Agents often create files they cannot reliably present or inspect; screenshots, rendered HTML, diagrams, markdown, and CSVs all need a stable surface.',
    statusNote: 'Public early-stage macOS-first tool with CLI and native-viewer support.',
    demo: {
      type: 'video',
      status: 'ready',
      label: 'Microcanvas render and verify demo',
      duration: '15 sec',
      src: '/tool-media/microcanvas/microcanvas-demo.mp4',
      poster: '/tool-media/microcanvas/microcanvas-demo-poster.jpg',
      caption:
        'A short walkthrough of Microcanvas rendering local artifacts into an inspectable surface and giving the agent visual proof it can point back to.',
    },
    sections: sections(
      [
        'A tiny stagehand for AI tools: render a supported local file, activate the result, and keep track of the current surface.',
        'Supported content includes HTML, Markdown, Mermaid, PDF, CSV, images, text, JSON, JS, TS, and other wrapped artifacts.',
      ],
      [
        'Use show to render and activate a file, update to refresh the same surface, status to inspect runtime state, verify to confirm the active viewer, and snapshot to capture evidence.',
      ],
      [
        'The output is a Microcanvas-owned surface with JSON state, optional native verification, and screenshot evidence when the viewer supports it.',
      ],
    ),
  },
  'openspec-studio': {
    tagline: 'A local-first desktop workbench for OpenSpec repositories.',
    summary:
      'OpenSpec Studio points at a local repository, reads its openspec directory, and turns proposals, specs, tasks, validation, archive readiness, and source artifacts into a fast inspection surface.',
    audience:
      'People already using, evaluating, or maintaining OpenSpec workspaces who want a visual workbench beside their editor and AI coding assistant.',
    problem:
      'Spec-driven work creates proposals, designs, tasks, spec deltas, validation output, archive state, and source files. Without an inspection surface, the user has to keep jumping through folders and CLI output to know what is real.',
    statusNote:
      'Public alpha source; OpenSpec-only today; build from source because public binary installers are not shipped yet.',
    demo: {
      type: 'video',
      status: 'ready',
      label: 'OpenSpec Studio workbench demo',
      duration: '44 sec',
      src: '/tool-media/openspec-studio/openspec-studio-demo.mp4',
      poster: '/tool-media/openspec-studio/openspec-studio-demo-poster.jpg',
      caption:
        'A short walkthrough of opening an OpenSpec workspace, inspecting changes and artifacts, checking validation state, and using Studio as the local truth surface beside agent work.',
    },
    sections: sections(
      [
        'A Tauri and React desktop app for inspecting local OpenSpec repositories.',
        'The OpenSpec files and CLI remain the source of truth; Studio is the window that makes that state easier to understand.',
      ],
      [
        'Open a local repo, let Studio index openspec/, scan active and archived changes, inspect proposal/design/tasks/spec deltas, run validation, and archive only when the CLI-backed state is clean.',
        'The current alpha also includes optional Studio Runner dispatch for sending one selected change to a local signed runner.',
      ],
      [
        'The output is a local workbench that makes spec-driven development easier to trust: board state, artifact previews, validation diagnostics, archive readiness, and bounded runner state in one place.',
      ],
    ),
  },
  clawk: {
    tagline: 'A native macOS menu bar companion for OpenClaw.',
    summary:
      'ClawK surfaces OpenClaw sessions, subagents, heartbeats, memory, crons, model usage, canvas state, settings, and direct message composition from the macOS menu bar.',
    audience:
      'OpenClaw operators who want local visibility and control without opening logs or remembering gateway endpoints.',
    problem:
      'Agent systems can be running, scheduled, and writing memory in the background, but the operator often lacks a compact live view of health, context, and activity.',
    statusNote: 'Public macOS app; requires macOS 14+ and a local OpenClaw gateway.',
    demo: {
      type: 'video',
      status: 'none',
      label: 'ClawK mission-control demo',
      duration: '90 sec target',
      caption:
        'Show gateway setup, active sessions, heartbeat history, memory browsing, canvas controls, and sending a message from the menu bar.',
    },
    sections: sections(
      [
        'A SwiftUI menu bar app that turns a local OpenClaw installation into an inspectable operating surface.',
        'It covers sessions, subagents, memory browsing, memory vitals, cron activity, model usage, canvas controls, and settings.',
      ],
      [
        'Launch ClawK, connect to the local gateway with a token, monitor active agent state, inspect memory/canvas surfaces, and send a message without leaving the menu bar workflow.',
      ],
      [
        'The output is local operational visibility for an OpenClaw system: health, memory, scheduled work, and direct operator actions.',
      ],
    ),
  },
  explain: {
    tagline: 'Architecture documentation generated from a TypeScript/JavaScript codebase.',
    summary:
      'explain parses a codebase, summarizes files and entities with an LLM, builds dependency views and changelogs, and publishes a static architecture site.',
    audience:
      'PMs, founders, and AI-assisted builders who need to understand what got built without reading every line of code.',
    problem:
      'AI-assisted codebases can move fast enough that the product owner loses the architecture map, especially when changes land through many files.',
    statusNote: 'Public TypeScript/JavaScript-focused tool and GitHub Action workflow.',
    demo: {
      type: 'video',
      status: 'none',
      label: 'explain architecture site demo',
      duration: '90 sec target',
      caption:
        'Show a push to main triggering analysis, entity extraction, LLM explanations, dependency graph generation, and a static site output.',
    },
    sections: sections(
      [
        'A codebase-to-architecture documentation generator for TypeScript and JavaScript projects.',
        'It extracts functions, components, types, constants, routes, imports, and source links, then turns them into readable documentation.',
      ],
      [
        'Run from the CLI or GitHub Action, parse source with ts-morph, detect changed files, send stateless explanation calls, and publish a multi-page static site.',
      ],
      [
        'The output is an architecture document with file summaries, entity pages, dependency graph, changelog, source links, and a JSON report.',
      ],
    ),
  },
  openrank: {
    tagline: 'A public daily benchmark for AI agents.',
    summary:
      'OpenRank gives agents a daily puzzle, REST API, timed sessions, ranked submissions, practice mode, and public leaderboards by correctness, speed, and efficiency.',
    audience:
      'Agent builders who want a lightweight public benchmark loop instead of private ad hoc puzzle runs.',
    problem:
      'It is hard to compare agents when challenges, timing, scoring, and leaderboard visibility are all handled differently.',
    statusNote: 'Live public benchmark platform at open-rank.com.',
    demo: {
      type: 'image',
      status: 'ready',
      label: 'OpenRank web preview',
      src: '/tool-media/openrank/openrank-preview.jpg',
      alt: 'OpenRank homepage showing benchmark actions and leaderboard summary.',
      caption:
        'The public OpenRank surface for agent benchmarks, timed puzzles, API docs, and leaderboards.',
    },
    sections: sections(
      [
        'A daily puzzle platform built for AI agents, with ranked and practice modes.',
        'Agents fetch challenges, solve them, submit answers, and get score feedback through a public API.',
      ],
      [
        'Create an account and agent key for ranked submissions, start a challenge for server-side timing, solve the puzzle, submit, and compare on the leaderboard.',
      ],
      [
        'The output is a public benchmark record that can capture correctness, speed, efficiency, and feedback by puzzle.',
      ],
    ),
  },
  wireflow: {
    tagline: 'A browser canvas for product flows, wireframes, and planning sketches.',
    summary:
      'WireFlow is a Next.js canvas app with shapes, frames, components, layers, documentation panels, export flows, and an MCP bridge for agent-assisted planning.',
    audience:
      'Product builders who need to sketch flows, annotate decisions, and keep planning artifacts close to implementation work.',
    problem:
      'Product sketches often live in separate tools or throwaway screenshots, making it harder for agents and implementers to connect the plan to the build.',
    statusNote: 'Public web app and source repo; live surface available at wire-flow.vercel.app.',
    demo: {
      type: 'image',
      status: 'ready',
      label: 'WireFlow canvas preview',
      src: '/tool-media/wireflow/wireflow-preview.jpg',
      alt: 'WireFlow canvas interface with frames, toolbars, and component panels.',
      caption:
        'The live WireFlow canvas for sketching frames, flow elements, components, and planning artifacts.',
    },
    sections: sections(
      [
        'A planning and wireframing canvas built with Next.js and React.',
        'The source includes shape tools, frames, component groups, layers, documentation panels, image export, keyboard shortcuts, persistence, and an MCP bridge.',
      ],
      [
        'Open the canvas, create frames, place shapes/text/arrows, group reusable components, annotate elements, and export or persist the workspace.',
      ],
      [
        'The output is a structured visual plan that can be reviewed by humans and potentially driven or inspected by agents.',
      ],
    ),
  },
  'agent-office': {
    tagline: 'A spatial interface experiment for observing agent work.',
    summary:
      'Agent Office explores what it feels like to watch agent activity as a spatial workspace rather than a stream of logs.',
    audience:
      'Builders exploring richer supervision surfaces for long-running or multi-agent workflows.',
    problem:
      'Logs and chat transcripts are dense but poor at showing where attention, activity, and responsibility are moving over time.',
    statusNote: 'Private development experiment.',
    demo: {
      type: 'video',
      status: 'none',
      label: 'Agent Office spatial workflow demo',
      duration: '60 sec target',
      caption:
        'Show the spatial workspace concept, agent activity zones, and how an operator would scan work at a glance.',
    },
    sections: sections(
      [
        'A private interface experiment around agent work as visible activity.',
        'The goal is to learn whether spatial layout can make background agent work easier to monitor than logs alone.',
      ],
      [
        'Represent agents, tasks, and state changes spatially, then let the operator understand activity by scanning the scene.',
      ],
      [
        'The output is currently a design and interaction signal rather than a public product.',
      ],
    ),
  },
  hunt: {
    tagline: 'A local-first CRM for running a serious job search.',
    summary:
      'Hunt is a private TypeScript/SQLite CRM for companies, jobs, people, applications, touchpoints, evidence, assets, role snapshots, tailoring packets, and review surfaces.',
    audience:
      'A product-builder job search where sourcing, warm paths, applications, evidence, and follow-up decisions need to stay organized.',
    problem:
      'A real job hunt quickly becomes scattered across postings, people, notes, applications, assets, and follow-ups unless the workflow has a durable source of truth.',
    statusNote: 'Private local-first development project; not a public repo.',
    demo: {
      type: 'video',
      status: 'none',
      label: 'Hunt CRM review loop demo',
      duration: '90 sec target',
      caption:
        'Show capturing a company/job/person, reviewing next actions, checking follow-ups/warm paths, and generating a readiness packet.',
    },
    sections: sections(
      [
        'A local-first CRM for job-search operations, built around structured records rather than scattered notes.',
        'The private repo includes a domain CLI, launcher, API/web runtime, safety backups, and review commands.',
      ],
      [
        'Capture companies, jobs, people, applications, touchpoints, evidence, and assets, then review inbox, next actions, pipeline, followups, stale items, warm paths, and summary.',
      ],
      [
        'The output is a local SQLite source of truth plus packet/readiness artifacts that help decide what to do next.',
      ],
    ),
  },
  tradespec: {
    tagline: 'Evidence-linked bid review for specialty contractors.',
    summary:
      'TradeSpec helps lightning protection estimators review plan sets, extract scope, and produce source-linked handoff packs without turning expert judgment into a black box.',
    audience:
      'Specialty contractors and estimating teams reviewing bid packages under time pressure.',
    problem:
      'Estimators lose hours on first-pass plan review, scope extraction, and handoff prep before they can decide what actually needs expert attention.',
    statusNote:
      'Private alpha with customer-pilot work; the public surface is the marketing site, not a self-serve app.',
    demo: {
      type: 'image',
      status: 'ready',
      label: 'TradeSpec website preview',
      src: '/tool-media/tradespec/tradespec-preview.jpg',
      alt: 'TradeSpec marketing site showing lightning protection bid reviews traced to source.',
      caption:
        'The public TradeSpec surface explains the evidence-linked review workflow without exposing customer or private plan material.',
    },
    sections: [
      {
        title: 'What it is',
        body: [
          'A product workflow for turning plan sets and bid documents into a structured review pack.',
          'The product keeps outputs tied to plan evidence so estimators can inspect the reasoning instead of trusting a floating summary.',
        ],
      },
      {
        title: 'Workflow',
        body: [
          'Upload bid material, extract scope and notes, review evidence-linked findings, and hand off a starter pack for estimator judgment.',
          'The useful product boundary is not full automation. It is a faster first pass that keeps the expert in control.',
        ],
      },
      {
        title: 'Output',
        body: [
          'The intended output is a review-ready packet: scope summary, notes, source evidence, and exportable handoff material.',
        ],
      },
    ],
  },
  eat: {
    tagline: 'Kitchen inventory and recipe discovery from what you already have.',
    summary:
      'Eat tracks groceries, scans receipts with GPT-4 Vision, syncs inventory through Supabase, and matches recipes from RSS feeds against available ingredients.',
    audience:
      'Home cooks who want inventory-aware meal ideas without manually reconciling receipts, pantry items, and recipe tabs.',
    problem:
      'Kitchen planning breaks when grocery inventory and recipe discovery live in separate places, especially after receipts, quantities, and favorites drift out of date.',
    statusNote: 'Live public web app with source available on GitHub.',
    demo: {
      type: 'image',
      status: 'ready',
      label: 'Eat website preview',
      src: '/tool-media/eat/eat-preview.jpg',
      alt: 'Eat web app landing page with recipe URL checker and magic-link sign-in.',
      caption:
        'The live Eat web app helps users stop asking what is for dinner by checking recipes against their food workflow.',
    },
    sections: sections(
      [
        'A smart kitchen management app for inventory tracking and recipe discovery.',
        'The repo combines receipt scanning, manual inventory editing, RSS recipe feeds, favorites, filtering, and feedback.',
      ],
      [
        'Upload a receipt or add items manually, keep quantities/categories/prices updated, pull recipes from default feeds, then filter by what can be made from current inventory.',
      ],
      [
        'The output is a synced inventory, recipe matches, favorites, low-stock/summary stats, and a better decision about what to cook next.',
      ],
    ),
  },
  'vault-mind': {
    tagline: 'A parked local-model experiment for talking to a personal knowledge base.',
    summary:
      'Vault Mind explored a CLI-first way to query a personal knowledge base with a local model, then stayed parked after the useful lessons were learned.',
    audience:
      'Builders experimenting with private personal-memory interfaces and local LLM workflows.',
    problem:
      'Personal notes become hard to use when recall depends on remembering filenames, folders, or the exact wording of an old thought.',
    statusNote: 'Parked private experiment.',
    demo: {
      type: 'video',
      status: 'none',
      label: 'Vault Mind local recall demo',
      duration: '60 sec target',
      caption:
        'If revived, show ingesting a small note set, asking a grounded question, and inspecting the returned local context.',
    },
    sections: sections(
      [
        'A private experiment around conversational access to a personal knowledge base.',
        'The point was to test the shape of local recall, not to ship a polished public memory product.',
      ],
      [
        'Index local notes, ask questions through a CLI, and inspect whether the local-model answers are useful enough to change the workflow.',
      ],
      [
        'The output was product learning about local knowledge-base interfaces and the limits of an early CLI-first memory loop.',
      ],
    ),
  },
};

function statusNoteFor(artifact: Artifact): string {
  if (artifact.metricOverride) return artifact.metricOverride;
  if (artifact.status === 'private') return 'Private or limited-access build.';
  if (artifact.status === 'dev') return 'In development; useful as a product and systems signal.';
  return 'Live/public artifact with source or product surface available.';
}

function externalLinksFor(artifact: Artifact): ToolDetailLink[] {
  const links: ToolDetailLink[] = [];

  if (artifact.url) {
    links.push({
      label: artifact.slug === 'tradespec'
        ? 'Marketing site'
        : artifact.slug === 'eat'
          ? 'Live app'
          : artifact.url.includes('github.io')
            ? 'Website'
            : 'Live surface',
      href: artifact.url,
      external: true,
    });
  }

  if (artifact.repo) {
    links.push({
      label: 'GitHub',
      href: `https://github.com/${artifact.repo}`,
      external: true,
    });
  }

  return links;
}

function defaultDemoFor(): ToolDemoMedia {
  return {
    type: 'video',
    status: 'none',
    label: '',
    caption: '',
  };
}

function defaultSectionsFor(artifact: Artifact): ToolDetailSection[] {
  return [
    {
      title: 'What it is',
      body: [artifact.description],
    },
    {
      title: 'Workflow',
      body: [workflowByCategory[artifact.category]],
    },
    {
      title: 'Output',
      body: [outputByCategory[artifact.category]],
    },
  ];
}

function buildToolDetail(artifact: Artifact): ToolDetail {
  const override = overrideBySlug[artifact.slug] ?? {};

  return {
    artifact,
    slug: artifact.slug,
    detailPath: `/tools/${artifact.slug}`,
    categoryLabel: CATEGORY_LABELS[artifact.category],
    tagline: override.tagline ?? artifact.description,
    summary: override.summary ?? artifact.description,
    audience: override.audience ?? audienceByCategory[artifact.category],
    problem: override.problem ?? problemByCategory[artifact.category],
    statusNote: override.statusNote ?? statusNoteFor(artifact),
    demo: override.demo ?? defaultDemoFor(),
    sections: override.sections ?? defaultSectionsFor(artifact),
    links: override.links ?? externalLinksFor(artifact),
  };
}

export const toolDetails: ToolDetail[] = artifacts.map(buildToolDetail);
export const toolDetailSlugs = toolDetails.map(detail => detail.slug);

export function getToolDetail(slug: string | undefined): ToolDetail | undefined {
  if (!slug) return undefined;
  return toolDetails.find(detail => detail.slug === slug);
}

export function hasToolDetail(slug: string): boolean {
  return toolDetailSlugs.includes(slug);
}
