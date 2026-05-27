import { getToolDetail, type ToolDetail } from './tool-details';

export const flagshipWorkSlugs = ['deepclean', 'tradespec', 'openspec-studio', 'microcanvas', 'agentplan'] as const;

export const flagshipWorkProof: Record<string, string> = {
  deepclean:
    'A local cleanup-report CLI for fast-moving codebases: evidence first, no source edits, and agent-ready plans under `.deepclean/`.',
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
