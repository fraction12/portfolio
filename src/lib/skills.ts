import htmlDiagramsRaw from '../data/skills/html-diagrams.md?raw';

export type AgentId = 'codex' | 'claude-code' | 'openclaw' | 'hermes' | 'cursor' | 'gemini-cli';

export type Skill = {
  slug: string;
  name: string;
  description: string;
  version: string;
  author: string;
  license: string;
  repo: string;
  agents: AgentId[];
  content: string;
  downloadUrl: string;
};

const AGENTS: AgentId[] = ['codex', 'claude-code', 'openclaw', 'hermes', 'cursor', 'gemini-cli'];
export { AGENTS };

function parseSkillMarkdown(slug: string, raw: string): Skill {
  const match = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) throw new Error(`Skill ${slug} missing frontmatter`);

  const front = match[1];
  const content = match[2].trim();

  const get = (key: string) => {
    const line = front.split('\n').find(l => l.startsWith(`${key}:`));
    return line ? line.slice(key.length + 1).trim() : '';
  };

  const agentsRaw = get('agents');
  const agents = agentsRaw
    ? (agentsRaw
        .replace(/[\[\]]/g, '')
        .split(',')
        .map(s => s.trim())
        .filter((s): s is AgentId => AGENTS.includes(s as AgentId)))
    : AGENTS;

  return {
    slug,
    name: get('name') || slug,
    description: get('description').replace(/^"|"$/g, ''),
    version: get('version') || '0.1.0',
    author: get('author') || 'Dushyant Garg',
    license: get('license') || 'MIT',
    repo: get('repo') || '',
    agents,
    content,
    downloadUrl: get('downloadUrl') || '',
  };
}

export function normalizeDownloadUrl(skill: Skill): string | null {
  if (skill.downloadUrl) return skill.downloadUrl;
  const repo = skill.repo;
  if (!repo) return null;
  // Convert a GitHub tree/blob URL to the raw SKILL.md URL.
  const githubMatch = repo.match(/https:\/\/github\.com\/([^/]+)\/([^/]+)\/(?:tree|blob)\/([^/]+)\/(.+)/);
  if (githubMatch) {
    const [, owner, repoName, branch, path] = githubMatch;
    return `https://github.com/${owner}/${repoName}/raw/${branch}/${path}/SKILL.md`;
  }
  return `${repo.replace(/\/?$/, '')}/SKILL.md`;
}

export function loadSkill(slug: string): Skill {
  switch (slug) {
    case 'html-diagrams':
      return parseSkillMarkdown(slug, htmlDiagramsRaw);
    default:
      throw new Error(`Unknown skill slug: ${slug}`);
  }
}

export function listSkills(): Skill[] {
  return [loadSkill('html-diagrams')];
}

export function getSkill(slug: string): Skill | undefined {
  const skills = listSkills();
  return skills.find(s => s.slug === slug);
}

export function getAgentLabel(id: AgentId): string {
  const labels: Record<AgentId, string> = {
    codex: 'Codex CLI',
    'claude-code': 'Claude Code',
    openclaw: 'OpenClaw',
    hermes: 'Hermes',
    cursor: 'Cursor',
    'gemini-cli': 'Gemini CLI',
  };
  return labels[id];
}

export function getInstallCommand(skill: Skill, agent: AgentId): string {
  const repo = skill.repo || `https://github.com/fraction12/agent-skills`;
  switch (agent) {
    case 'codex':
      return `gh skill install ${repo.replace(/^https?:\/\/github\.com\//, '')} ${skill.slug}`;
    case 'claude-code':
      return `git clone ${repo} .tmp-skills && cp -r .tmp-skills/skills/${skill.slug} .claude/skills/${skill.slug} && rm -rf .tmp-skills`;
    case 'openclaw':
      return `openclaw skill install ${skill.slug}`;
    case 'hermes':
      return `hermes skills install ${repo} ${skill.slug}`;
    case 'cursor':
      return `git clone ${repo} .tmp-skills && cp -r .tmp-skills/skills/${skill.slug} .cursor/skills/${skill.slug} && rm -rf .tmp-skills`;
    case 'gemini-cli':
      return `git clone ${repo} .tmp-skills && cp -r .tmp-skills/skills/${skill.slug} .gemini/skills/${skill.slug} && rm -rf .tmp-skills`;
  }
}

export function getSystemPrompt(skill: Skill, agent: AgentId): string {
  const agentLabel = getAgentLabel(agent);
  return [
    `You are simulating the ${agentLabel} coding agent.`,
    `The user has installed the "${skill.name}" skill and is testing it in a browser playground.`,
    `Follow the skill instructions below exactly. Be concise, practical, and produce whatever artifact the skill describes.`,
    '',
    '--- SKILL INSTRUCTIONS ---',
    '',
    skill.content,
  ].join('\n');
}
