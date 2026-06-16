import { getToolDetail, type ToolDetail } from './tool-details';

export const flagshipWorkSlugs = ['octocheck', 'deepclean', 'kv-capsules-pti', 'tradespec', 'openspec-studio', 'microcanvas', 'agentplan'] as const;

export const flagshipWorkProof: Record<string, string> = {
  octocheck:
    'A resident GitHub App controller that lets GitHub request work while local policy decides what actually runs.',
  deepclean:
    'A local maintainability system for fast-moving codebases: evidence first, source-safe PR context, and guarded cleanup lanes.',
  'kv-capsules-pti':
    'Research system for local agents that completed the selected repeated-work stream 13.8x faster by reusing quality-gated attention state.',
  tradespec:
    'Customer-facing AI workflow for estimating teams, with evidence-linked outputs and a clear private-alpha boundary.',
  'openspec-studio':
    'A visual workbench for spec-driven development: changes, tasks, validation, archive readiness, and runner state in one place.',
  microcanvas:
    'A display surface for agent-created artifacts, built around real rendering, verification, and screenshot evidence.',
  agentplan:
    'A shared task board for AI-native teams, with local durable state and claimable work for multiple agents.',
};

export const flagshipWorkDetails: ToolDetail[] = flagshipWorkSlugs
  .map(slug => getToolDetail(slug))
  .filter((detail): detail is ToolDetail => Boolean(detail));
