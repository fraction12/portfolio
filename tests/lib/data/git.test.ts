import { describe, it, expect } from 'vitest';
import { getLastCommit, parseGitLogOutput } from '../../../src/lib/data/git';

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
});

describe('getLastCommit', () => {
  it('returns a well-formed record from the current repo', () => {
    const last = getLastCommit();
    expect(last.sha).toMatch(/^[0-9a-f]{7,40}$/);
    expect(last.timestamp).toBeInstanceOf(Date);
    expect(typeof last.subject).toBe('string');
  });
});
