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
  installCommand?: string;
};

export const artifacts: Artifact[] = [
  { slug: 'potato', order: 1, name: 'Potato v3', emphasisWord: 'Potato',
    description: "Terminal cockpit for coding agents. Run Claude, Codex, or others in real PTYs. Roles, MCP coordination, one operator window.",
    stack: 'rust · ratatui · mcp', kind: '01 · Rust · TUI', status: 'live',
    repo: 'fraction12/potato-v3', installCommand: 'cargo install potato-v3' },

  { slug: 'starglass', order: 2, name: 'Starglass', emphasisWord: 'Starglass',
    description: "Observation layer any CLI agent can emit into. Stdout, events, tool-calls — one timeline, zero plumbing.",
    stack: 'ts · mcp · skill', kind: '02 · TypeScript · Skill', status: 'live',
    installCommand: 'npm install starglass' },

  { slug: 'agenttk', order: 3, name: 'AgentTK', emphasisWord: 'AgentTK',
    description: "Agent-facing CLI primitives. Typed, discoverable, safe by construction — the argv you'd actually hand to a model.",
    stack: 'python · pypi · cli', kind: '03 · Python · PyPI', status: 'live',
    installCommand: 'pip install agenttk' },

  { slug: 'agentplan', order: 4, name: 'agentplan', emphasisWord: 'agentplan',
    description: "Shared to-do system for parallel agents. Dependencies, priorities, atomic claims. Built after three Claudes duplicated a PR.",
    stack: 'python · sqlite · pypi', kind: '04 · Python · PyPI', status: 'live',
    repo: 'fraction12/agentplan', pypiName: 'agentplan', installCommand: 'pip install agentplan' },

  { slug: 'openrank', order: 5, name: 'OpenRank', emphasisWord: 'OpenRank',
    description: 'Daily puzzles for AI agents with a live leaderboard and server-side timing. Because "did it work" is not "did it beat the others."',
    stack: 'astro · supabase · ts', kind: '05 · Astro · Live', status: 'live',
    repo: 'fraction12/open-rank', url: 'https://open-rank.com', installCommand: '# visit open-rank.com' },

  { slug: 'agentrem', order: 6, name: 'agentrem', emphasisWord: 'agentrem',
    description: 'Persistent reminders for AI agents. CLI plus MCP server. Agents remember what they promised.',
    stack: 'ts · sqlite · mcp · npm', kind: '06 · TypeScript · MCP', status: 'live',
    repo: 'fraction12/agentrem', npmName: 'agentrem', installCommand: 'npm install -g agentrem' },

  { slug: 'clawk', order: 7, name: 'ClawK', emphasisWord: 'ClawK',
    description: 'Native macOS menu bar for OpenClaw — so background runs are observable without opening a single window.',
    stack: 'swift · swiftui', kind: '07 · Swift · macOS', status: 'live',
    repo: 'fraction12/ClawK', installCommand: '# brew — coming soon; build from source for now' },

  { slug: 'agentsense', order: 8, name: 'AgentSense', emphasisWord: 'AgentSense',
    description: 'Durable memory for agents using entity extraction and relationship-aware context. Built for agents that need to remember last week.',
    stack: 'ts · sqlite · fts5', kind: '08 · TypeScript · FTS5', status: 'live',
    repo: 'fraction12/agentsense', installCommand: 'npm install agentsense' },

  { slug: 'agent-office', order: 9, name: 'Agent Office', emphasisWord: 'Agent Office',
    description: 'Watch agents live — not logs, not dashboards, but actually see them moving through a room. OpenClaw-native spatial interface.',
    stack: 'godot · gdscript · openclaw', kind: '09 · Godot · Private', status: 'dev',
    metricOverride: '🔒 private', installCommand: '# private preview — reach out if interested' }
];

export const npmPackages: string[] = artifacts.filter(a => a.npmName).map(a => a.npmName as string);
export const pypiPackages: string[] = artifacts.filter(a => a.pypiName).map(a => a.pypiName as string);
export const GITHUB_USER = 'fraction12';
