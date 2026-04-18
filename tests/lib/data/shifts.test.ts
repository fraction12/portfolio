import { describe, it, expect } from 'vitest';
import { clusterShifts, type CommitRecord } from '../../../src/lib/data/shifts';

function mkCommit(sha: string, iso: string, filesChanged = 1, additions = 10, deletions = 2): CommitRecord {
  return {
    sha,
    timestamp: new Date(iso),
    author: 'Dushyant Garg',
    authorEmail: '',
    subject: 'test commit',
    body: '',
    coAuthors: [],
    isAgentAuthored: false,
    filesChanged,
    additions,
    deletions
  };
}

describe('clusterShifts', () => {
  it('returns empty when no commits', () => {
    expect(clusterShifts([], 4)).toEqual([]);
  });

  it('groups commits within the gap window into a single shift', () => {
    const commits = [
      mkCommit('a', '2026-04-15T22:00:00Z'),
      mkCommit('b', '2026-04-15T23:30:00Z'),
      mkCommit('c', '2026-04-16T01:00:00Z')
    ];
    const shifts = clusterShifts(commits, 4);
    expect(shifts).toHaveLength(1);
    expect(shifts[0].commits).toHaveLength(3);
    expect(shifts[0].start.toISOString()).toBe('2026-04-15T22:00:00.000Z');
    expect(shifts[0].end.toISOString()).toBe('2026-04-16T01:00:00.000Z');
  });

  it('starts a new shift when gap exceeds threshold', () => {
    const commits = [
      mkCommit('a', '2026-04-15T02:00:00Z'),
      mkCommit('b', '2026-04-15T03:00:00Z'),
      mkCommit('c', '2026-04-15T13:00:00Z'),
      mkCommit('d', '2026-04-15T14:00:00Z')
    ];
    const shifts = clusterShifts(commits, 4);
    expect(shifts).toHaveLength(2);
    expect(shifts[0].commits.map(c => c.sha)).toEqual(['a', 'b']);
    expect(shifts[1].commits.map(c => c.sha)).toEqual(['c', 'd']);
  });

  it('sums additions and deletions across the shift', () => {
    const commits = [
      mkCommit('a', '2026-04-15T22:00:00Z', 2, 100, 20),
      mkCommit('b', '2026-04-15T23:00:00Z', 1, 50, 5)
    ];
    const shifts = clusterShifts(commits, 4);
    expect(shifts[0].additions).toBe(150);
    expect(shifts[0].deletions).toBe(25);
    expect(shifts[0].commitCount).toBe(2);
  });

  it('sorts unsorted input chronologically', () => {
    const commits = [
      mkCommit('c', '2026-04-15T01:00:00Z'),
      mkCommit('a', '2026-04-14T22:00:00Z'),
      mkCommit('b', '2026-04-14T23:00:00Z')
    ];
    const shifts = clusterShifts(commits, 4);
    expect(shifts).toHaveLength(1);
    expect(shifts[0].commits.map(c => c.sha)).toEqual(['a', 'b', 'c']);
  });
});
