import { describe, it, expect } from 'vitest';
import { getLastCommit, getCommitHistory, parseGitLogOutput } from '../../../src/lib/data/git';

describe('parseGitLogOutput', () => {
  it('parses a single commit with stat line', () => {
    const raw = [
      '---COMMIT---',
      'sha:abc123def',
      'ts:1713312000',
      'author:Dushyant Garg',
      'subject:fix: something',
      'stat: 2 files changed, 40 insertions(+), 5 deletions(-)'
    ].join('\n');
    const commits = parseGitLogOutput(raw);
    expect(commits).toHaveLength(1);
    expect(commits[0].sha).toBe('abc123def');
    expect(commits[0].additions).toBe(40);
    expect(commits[0].deletions).toBe(5);
    expect(commits[0].filesChanged).toBe(2);
    expect(commits[0].timestamp.getTime()).toBe(1713312000 * 1000);
  });

  it('parses multiple commits', () => {
    const raw = [
      '---COMMIT---',
      'sha:one', 'ts:1713312000', 'author:Dushyant Garg', 'subject:first',
      'stat: 1 file changed, 10 insertions(+)',
      '---COMMIT---',
      'sha:two', 'ts:1713312600', 'author:Dushyant Garg', 'subject:second',
      'stat: 3 files changed, 22 insertions(+), 4 deletions(-)'
    ].join('\n');
    const commits = parseGitLogOutput(raw);
    expect(commits).toHaveLength(2);
    expect(commits[1].additions).toBe(22);
    expect(commits[1].deletions).toBe(4);
  });

  it('handles commits with zero deletions', () => {
    const raw = [
      '---COMMIT---',
      'sha:aaa', 'ts:1713312000', 'author:a', 'subject:s',
      'stat: 1 file changed, 5 insertions(+)'
    ].join('\n');
    expect(parseGitLogOutput(raw)[0].deletions).toBe(0);
  });

  it('parses --shortstat real output (no stat: prefix)', () => {
    // This is the exact format git log --shortstat emits
    const raw = [
      '---COMMIT---',
      'sha:real123',
      'ts:1713312000',
      'author:Dushyant Garg',
      'subject:feat: real commit',
      ' 3 files changed, 55 insertions(+), 12 deletions(-)'
    ].join('\n');
    const commits = parseGitLogOutput(raw);
    expect(commits).toHaveLength(1);
    expect(commits[0].additions).toBe(55);
    expect(commits[0].deletions).toBe(12);
    expect(commits[0].filesChanged).toBe(3);
  });

  it('extracts Co-Authored-By trailers from commit body', () => {
    const raw = [
      '---COMMIT---',
      'sha:zzz',
      'ts:1713312000',
      'author:Dushyant Garg',
      'email:dushyant@example.com',
      'subject:feat: something',
      '---BODY---',
      'Longer description here.',
      '',
      'Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>',
      '---ENDBODY---',
      ' 1 file changed, 10 insertions(+)'
    ].join('\n');
    const commits = parseGitLogOutput(raw);
    expect(commits).toHaveLength(1);
    expect(commits[0].coAuthors).toEqual(['Claude Opus 4.7 <noreply@anthropic.com>']);
    expect(commits[0].isAgentAuthored).toBe(true);
    expect(commits[0].additions).toBe(10);
  });

  it('marks commit as agent-authored when primary author matches pattern', () => {
    const raw = [
      '---COMMIT---',
      'sha:yyy',
      'ts:1713312000',
      'author:Jarvis',
      'email:jarvis@dushyant.ops',
      'subject:fix: nightly',
      '---BODY---',
      '',
      '---ENDBODY---',
      ' 2 files changed, 8 insertions(+), 1 deletion(-)'
    ].join('\n');
    const commits = parseGitLogOutput(raw);
    expect(commits[0].isAgentAuthored).toBe(true);
  });

  it('does not flag human commits without Co-Authored-By', () => {
    const raw = [
      '---COMMIT---',
      'sha:xxx',
      'ts:1713312000',
      'author:Dushyant Garg',
      'email:dushyant@example.com',
      'subject:refactor: trim',
      '---BODY---',
      'Just a pure human commit.',
      '---ENDBODY---',
      ' 1 file changed, 3 insertions(+)'
    ].join('\n');
    const commits = parseGitLogOutput(raw);
    expect(commits[0].coAuthors).toEqual([]);
    expect(commits[0].isAgentAuthored).toBe(false);
  });
});

describe('getLastCommit', () => {
  it('returns a well-formed record from the current repo', () => {
    const last = getLastCommit();
    expect(last.sha).toMatch(/^[0-9a-f]{7,40}$/);
    expect(last.timestamp).toBeInstanceOf(Date);
    expect(typeof last.subject).toBe('string');
  });

  it('parses non-zero additions from a real commit with changes', () => {
    // This commit (0.2: "add vitest") should have non-zero diff stats
    const commits = getCommitHistory(30);
    const withChanges = commits.find((c: any) => c.additions > 0 || c.deletions > 0);
    expect(withChanges).toBeDefined();
    expect((withChanges.additions + withChanges.deletions) > 0).toBe(true);
  });
});
