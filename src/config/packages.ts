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
  'memory':        'Durable context for agent systems.',
  'libraries':     'Reusable primitives for building safer tools.',
  'orchestration': 'Local coordination and task systems for multi-agent work.',
  'human-tools':   'Interfaces and utilities for people operating AI systems.',
  'products':      'Customer-facing product work.',
  'experiments':   'Smaller builds and parked ideas with useful lessons.'
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
    description: 'Knowledge-graph memory plugin for OpenClaw with entity extraction and relationship-aware context.',
    stack: 'typescript · sqlite · fts5', kind: 'typescript · mcp plugin', status: 'live',
    repo: 'fraction12/agentsense', installCommand: 'npm install agentsense' },

  { slug: 'agentrem', order: 2, category: 'memory',
    name: 'agentrem', emphasisWord: 'agentrem',
    description: 'Structured reminders CLI and MCP server for time, keyword, condition, recurrence, and priority workflows.',
    stack: 'typescript · mcp · npm', kind: 'typescript · cli + mcp', status: 'live',
    repo: 'fraction12/agentrem', npmName: 'agentrem', installCommand: 'npm install -g agentrem' },


  // ────────────── LIBRARIES ──────────────
  { slug: 'agenttk', order: 1, category: 'libraries',
    name: 'AgentTK', emphasisWord: 'AgentTK',
    description: 'Typed command-line primitives for building safer, more discoverable agent-facing tools.',
    stack: 'typescript · cli', kind: 'typescript · cli primitives', status: 'live',
    repo: 'fraction12/agenttk', installCommand: 'npm install agenttk' },

  { slug: 'starglass', order: 2, category: 'libraries',
    name: 'Starglass', emphasisWord: 'Starglass',
    description: 'Observation layer for agent systems that combines stdout, events, and tool calls into one timeline.',
    stack: 'typescript · mcp · skill', kind: 'typescript · mcp skill', status: 'live',
    repo: 'fraction12/starglass', installCommand: 'npm install starglass' },


  // ────────────── ORCHESTRATION ──────────────
  { slug: 'potato', order: 1, category: 'orchestration',
    name: 'Potato v3', emphasisWord: 'Potato',
    description: 'Local orchestration tool for running coding agents in real PTYs with roles and coordination boundaries.',
    stack: 'rust · ratatui · mcp', kind: 'rust · local orchestration', status: 'live',
    repo: 'fraction12/potato-v3', installCommand: 'cargo install potato-v3' },

  { slug: 'agentplan', order: 2, category: 'orchestration',
    name: 'agentplan', emphasisWord: 'agentplan',
    description: 'SQLite-backed task board for multiple agents with dependencies, priorities, and atomic claims.',
    stack: 'python · sqlite · pypi', kind: 'python · cli + lib', status: 'live',
    repo: 'fraction12/agentplan', pypiName: 'agentplan', installCommand: 'pip install agentplan' },


  // ────────────── HUMAN TOOLS ──────────────
  { slug: 'spec-ui', order: 1, category: 'human-tools',
    name: 'Spec UI', emphasisWord: 'Spec UI',
    description: 'Compiler that turns structured product specs into deterministic interactive prototypes.',
    stack: 'typescript · compiler · html', kind: 'typescript · spec compiler', status: 'live',
    repo: 'fraction12/spec-ui', installCommand: '# source available on GitHub — npm package not published' },

  { slug: 'microcanvas', order: 2, category: 'human-tools',
    name: 'Microcanvas', emphasisWord: 'Microcanvas',
    description: 'Viewer/runtime for opening, inspecting, and testing UI artifacts created by agents or code tools.',
    stack: 'typescript · native viewer · cli', kind: 'typescript · canvas runtime', status: 'live',
    repo: 'fraction12/microcanvas', installCommand: '# source available on GitHub — npm package not published' },

  { slug: 'openspec-studio', order: 3, category: 'human-tools',
    name: 'OpenSpec Studio', emphasisWord: 'OpenSpec Studio',
    description: 'Local-first desktop workbench for inspecting OpenSpec repositories, changes, specs, validation, and archive readiness.',
    stack: 'tauri · react · typescript · rust', kind: 'tauri · desktop workbench', status: 'live',
    repo: 'fraction12/openspec-studio', installCommand: '# build from source — npm run tauri:dev' },

  { slug: 'clawk', order: 4, category: 'human-tools',
    name: 'ClawK', emphasisWord: 'ClawK',
    description: 'Native macOS menu bar for monitoring OpenClaw sessions, heartbeats, memory, and background runs.',
    stack: 'swift · swiftui · macOS', kind: 'swift · macOS menubar', status: 'live',
    repo: 'fraction12/ClawK', installCommand: 'brew install fraction12/tap/clawk' },

  { slug: 'explain', order: 5, category: 'human-tools',
    name: 'explain', emphasisWord: 'explain',
    description: 'Codebase-to-architecture documentation generator for teams that need to understand what changed.',
    stack: 'typescript · ts-morph · gh action', kind: 'typescript · cli + gh action', status: 'live',
    repo: 'fraction12/explain', installCommand: 'npx fraction12/explain' },

  { slug: 'openrank', order: 6, category: 'human-tools',
    name: 'OpenRank', emphasisWord: 'OpenRank',
    description: 'Public benchmark platform for comparing agent performance on timed puzzles.',
    stack: 'astro · supabase · ts', kind: 'astro · web platform', status: 'live',
    repo: 'fraction12/open-rank', url: 'https://open-rank.com', installCommand: '# visit open-rank.com' },

  { slug: 'wireflow', order: 7, category: 'human-tools',
    name: 'WireFlow', emphasisWord: 'WireFlow',
    description: 'Planning and wireframing app for product flows, meetings, and implementation sketches.',
    stack: 'typescript · canvas', kind: 'typescript · web app', status: 'live',
    repo: 'fraction12/WireFlow', url: 'https://wire-flow.vercel.app', installCommand: '# visit wire-flow.vercel.app' },

  { slug: 'agent-office', order: 8, category: 'human-tools',
    name: 'Agent Office', emphasisWord: 'Agent Office',
    description: 'Spatial interface experiment for watching agent work as activity rather than logs.',
    stack: 'godot · gdscript · openclaw', kind: 'godot · spatial UI · private', status: 'dev',
    metricOverride: 'Private development', installCommand: '# private preview — reach out if interested' },

  { slug: 'hunt', order: 9, category: 'human-tools',
    name: 'Hunt', emphasisWord: 'Hunt',
    description: 'Personal CRM for roles, companies, applications, notes, and assisted lead triage.',
    stack: 'typescript · sqlite', kind: 'typescript · personal CRM', status: 'dev',
    metricOverride: 'In development',
    installCommand: '# private development preview' },


  // ────────────── PRODUCTS ──────────────
  { slug: 'tradespec', order: 1, category: 'products',
    name: 'TradeSpec AI', emphasisWord: 'TradeSpec',
    description: 'AI workflow for specialty-contractor estimates that turns plan sets into evidence-linked review packs.',
    stack: 'python · next.js · saas', kind: 'saas · alpha · customer pilot', status: 'private',
    url: 'https://tradespec-website.vercel.app',
    metricOverride: 'Private alpha', installCommand: '# alpha with a real customer — see the marketing site' },


  // ────────────── EXPERIMENTS ──────────────
  { slug: 'eat', order: 1, category: 'experiments',
    name: 'eat', emphasisWord: 'eat',
    description: 'Kitchen inventory and recipe discovery experiment with receipt scanning and inventory-aware matching.',
    stack: 'next.js · supabase · gpt-4 vision', kind: 'next.js · experiment', status: 'dev',
    repo: 'fraction12/eat', installCommand: '# source available on GitHub — deployment not currently public' },

  { slug: 'vault-mind', order: 2, category: 'experiments',
    name: 'Vault Mind', emphasisWord: 'Vault Mind',
    description: 'Parked local-model experiment for talking to a personal knowledge base through a CLI.',
    stack: 'go · local llm · cli', kind: 'go · experiment · parked', status: 'private',
    metricOverride: 'Parked experiment', installCommand: '# private experiment — see essays for the postmortem' }

];

export const npmPackages: string[] = artifacts.filter(a => a.npmName).map(a => a.npmName as string);
export const pypiPackages: string[] = artifacts.filter(a => a.pypiName).map(a => a.pypiName as string);
export const GITHUB_USER = 'fraction12';
export const GITHUB_REPO = 'portfolio';
