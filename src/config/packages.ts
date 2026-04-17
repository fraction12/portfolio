export type PackageIdentity = { name: string; registry: 'npm' | 'pypi' };
export type ArtifactStatus = 'live' | 'dev' | 'private';
export type ArtifactCategory =
  | 'memory'
  | 'libraries'
  | 'orchestration'
  | 'human-tools'
  | 'products'
  | 'experiments';

export type Artifact = {
  slug: string;
  order: number;          // order within its category
  category: ArtifactCategory;
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
  installCommand?: string;
};

export const CATEGORY_LABELS: Record<ArtifactCategory, string> = {
  'memory':        'Memory',
  'libraries':     'Libraries',
  'orchestration': 'Orchestration',
  'human-tools':   'Human Tools',
  'products':      'Products',
  'experiments':   'Experiments'
};

export const CATEGORY_BLURBS: Record<ArtifactCategory, string> = {
  'memory':        'Durable state for agents — what they carry across turns and sessions.',
  'libraries':     'SDKs and primitives for building agents.',
  'orchestration': 'Running and coordinating multiple agents.',
  'human-tools':   'GUIs, evals, and dev tooling for people who operate agents.',
  'products':      'Customer-facing SaaS. Shipped to real users.',
  'experiments':   "Things I built to learn something. Some worked, some didn't. The lessons travel."
};

export const CATEGORY_ORDER: ArtifactCategory[] = [
  'memory',
  'libraries',
  'orchestration',
  'human-tools',
  'products',
  'experiments'
];

export const artifacts: Artifact[] = [

  // ────────────── MEMORY ──────────────
  { slug: 'agentsense', order: 1, category: 'memory',
    name: 'AgentSense', emphasisWord: 'AgentSense',
    description: 'Knowledge-graph memory plugin for OpenClaw — entity extraction plus relationship-aware context. Built for agents that need to remember last week.',
    stack: 'typescript · sqlite · fts5', kind: 'typescript · mcp plugin', status: 'live',
    repo: 'fraction12/agentsense', installCommand: 'npm install agentsense' },

  { slug: 'agentrem', order: 2, category: 'memory',
    name: 'agentrem', emphasisWord: 'agentrem',
    description: 'Structured reminders CLI + MCP server for AI agents — time, keyword, condition triggers with priority escalation, recurrence, and token budgets.',
    stack: 'typescript · mcp · npm', kind: 'typescript · cli + mcp', status: 'live',
    repo: 'fraction12/agentrem', npmName: 'agentrem', installCommand: 'npm install -g agentrem' },


  // ────────────── LIBRARIES ──────────────
  { slug: 'agenttk', order: 1, category: 'libraries',
    name: 'AgentTK', emphasisWord: 'AgentTK',
    description: "Agent-facing CLI primitives. Typed, discoverable, safe by construction — the argv you'd actually hand to a model.",
    stack: 'typescript · cli', kind: 'typescript · cli primitives', status: 'live',
    repo: 'fraction12/agenttk', installCommand: 'npm install agenttk' },

  { slug: 'starglass', order: 2, category: 'libraries',
    name: 'Starglass', emphasisWord: 'Starglass',
    description: 'Observation and dispatch layer for agent systems. Stdout, events, tool-calls — one timeline, zero plumbing.',
    stack: 'typescript · mcp · skill', kind: 'typescript · mcp skill', status: 'live',
    repo: 'fraction12/starglass', installCommand: 'npm install starglass' },


  // ────────────── ORCHESTRATION ──────────────
  { slug: 'potato', order: 1, category: 'orchestration',
    name: 'Potato v3', emphasisWord: 'Potato',
    description: 'Personal Orchestration Tool for Agentic Task Operations. Terminal cockpit for coding agents — run Claude, Codex, or others in real PTYs with roles and MCP coordination.',
    stack: 'rust · ratatui · mcp', kind: 'rust · tui cockpit', status: 'live',
    repo: 'fraction12/potato-v3', installCommand: 'cargo install potato-v3' },

  { slug: 'agentplan', order: 2, category: 'orchestration',
    name: 'agentplan', emphasisWord: 'agentplan',
    description: 'Shared to-do list for AI agents. Zero deps, pure Python. Dependencies, priorities, atomic claims — built after three Claudes duplicated a PR on my machine.',
    stack: 'python · sqlite · pypi', kind: 'python · cli + lib', status: 'live',
    repo: 'fraction12/agentplan', pypiName: 'agentplan', installCommand: 'pip install agentplan' },


  // ────────────── HUMAN TOOLS ──────────────
  { slug: 'clawk', order: 1, category: 'human-tools',
    name: 'ClawK', emphasisWord: 'ClawK',
    description: 'Native macOS menu bar for OpenClaw. Monitor sessions, heartbeats, memory, and cron jobs from your menu bar — background runs observable without opening a window.',
    stack: 'swift · swiftui · macOS', kind: 'swift · macOS menubar', status: 'live',
    repo: 'fraction12/ClawK', installCommand: 'brew install fraction12/tap/clawk' },

  { slug: 'explain', order: 2, category: 'human-tools',
    name: 'explain', emphasisWord: 'explain',
    description: 'Turn any TypeScript/JavaScript codebase into a living, human-readable architecture document. Push to main → GitHub Action runs → your entire codebase is explained in plain English. Built for PMs and founders who build with AI but need to understand what got built.',
    stack: 'typescript · ts-morph · gh action', kind: 'typescript · cli + gh action', status: 'live',
    repo: 'fraction12/explain', installCommand: 'npx fraction12/explain' },

  { slug: 'openrank', order: 3, category: 'human-tools',
    name: 'OpenRank', emphasisWord: 'OpenRank',
    description: 'The open benchmark for AI agents — daily puzzles, public rankings, server-side timing. Because "did it work" is not "did it beat the others."',
    stack: 'astro · supabase · ts', kind: 'astro · web platform', status: 'live',
    repo: 'fraction12/open-rank', url: 'https://open-rank.com', installCommand: '# visit open-rank.com' },

  { slug: 'wireflow', order: 4, category: 'human-tools',
    name: 'WireFlow', emphasisWord: 'WireFlow',
    description: 'Wireframing and planning app — imagine ExcaliDraw but better. Quick diagrams that stay legible when the meeting moves on.',
    stack: 'typescript · canvas', kind: 'typescript · web app', status: 'live',
    repo: 'fraction12/WireFlow', installCommand: '# clone + pnpm dev — deploy coming' },

  { slug: 'agent-office', order: 5, category: 'human-tools',
    name: 'Agent Office', emphasisWord: 'Agent Office',
    description: 'Watch agents live — not logs, not dashboards, but actually see them moving through a room. OpenClaw-native spatial interface, built in Godot.',
    stack: 'godot · gdscript · openclaw', kind: 'godot · spatial UI · private', status: 'dev',
    metricOverride: '🔒 private · in dev', installCommand: '# private preview — reach out if interested' },


  // ────────────── PRODUCTS ──────────────
  { slug: 'tradespec', order: 1, category: 'products',
    name: 'TradeSpec AI', emphasisWord: 'TradeSpec',
    description: 'AI workflow for trade estimates — faster, safer, grounded in messy contractor source inputs. In alpha with a real customer. Python service (LightningITB) + HTML frontend.',
    stack: 'python · saas · alpha', kind: 'saas · alpha · private', status: 'private',
    metricOverride: '🔒 alpha · 1 customer live', installCommand: '# in alpha with a customer — reach out for a demo' },


  // ────────────── EXPERIMENTS ──────────────
  { slug: 'eat', order: 1, category: 'experiments',
    name: 'eat', emphasisWord: 'eat',
    description: 'Kitchen inventory + recipe discovery. AI receipt scanning, 15 RSS feeds, inventory-aware recipe matching. My first Dark Factory build — I never looked at a line of the code. Agents wrote, reviewed, shipped.',
    stack: 'next.js · supabase · gpt-4 vision', kind: 'next.js · live app · dark factory', status: 'live',
    repo: 'fraction12/eat', url: 'https://eat-tawny.vercel.app', installCommand: '# visit eat-tawny.vercel.app' },

  { slug: 'vault-mind', order: 2, category: 'experiments',
    name: 'Vault Mind', emphasisWord: 'Vault Mind',
    description: 'CLI that talks to your Second Brain through a fine-tuned local model. Experiment parked — fine-tuning at scale was the wrong unit of work for the problem. The learnings are shipping as essays.',
    stack: 'go · local llm · cli', kind: 'go · experiment · parked', status: 'private',
    metricOverride: '🔒 parked · learnings published', installCommand: '# private experiment — see essays for the postmortem' }

];

export const npmPackages: string[] = artifacts.filter(a => a.npmName).map(a => a.npmName as string);
export const pypiPackages: string[] = artifacts.filter(a => a.pypiName).map(a => a.pypiName as string);
export const GITHUB_USER = 'fraction12';
export const GITHUB_REPO = 'portfolio';
