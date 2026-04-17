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
 * in the UI under this single persona name — matches how the site talks about
 * the long-running agent in the footer ("agents commit to this repo").
 */
export const AGENT_DISPLAY_NAME = 'Jarvis';
export const AGENT_DISPLAY_EMAIL = 'jarvis@dushyant.ops';

export function isAgentAuthor(nameAndEmail: string): boolean {
  return AGENT_NAME_PATTERNS.some(p => p.test(nameAndEmail));
}
