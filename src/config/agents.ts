/**
 * Patterns for detecting agent-authored commits via Co-Authored-By trailers
 * or primary author. Case-insensitive substring match against "Name <email>".
 */
export const AGENT_NAME_PATTERNS: RegExp[] = [
  /\bclaude\b/i,
  /\bjarvis\b/i,
  /\banthropic\b/i,
  /\bcodex\b/i,
  /\bgpt\b/i,
  /\bgemini\b/i
];

/**
 * Display label for agent-authored commits. All agent co-authors are surfaced
 * under one neutral label in any internal data surfaces.
 */
export const AGENT_DISPLAY_NAME = 'Agent';
export const AGENT_DISPLAY_EMAIL = 'agent@dushyant.ops';

export function isAgentAuthor(nameAndEmail: string): boolean {
  return AGENT_NAME_PATTERNS.some(p => p.test(nameAndEmail));
}
