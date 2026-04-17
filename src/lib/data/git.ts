import { execFileSync } from 'node:child_process';
import type { CommitRecord } from './shifts';

const LOG_FORMAT = '---COMMIT---%nsha:%H%nts:%ct%nauthor:%an%nsubject:%s';

export function parseGitLogOutput(raw: string): CommitRecord[] {
  const blocks = raw.split('---COMMIT---').map(b => b.trim()).filter(Boolean);
  const commits: CommitRecord[] = [];

  for (const block of blocks) {
    const lines = block.split('\n');
    const map: Record<string, string> = {};
    let stat: string | null = null;

    for (const line of lines) {
      if (line.startsWith('stat:')) {
        stat = line.slice(5).trim();
        continue;
      }
      const colon = line.indexOf(':');
      if (colon > 0) {
        map[line.slice(0, colon)] = line.slice(colon + 1);
      }
    }

    if (!map.sha || !map.ts) continue;
    const { additions, deletions, filesChanged } = parseStat(stat);
    commits.push({
      sha: map.sha,
      timestamp: new Date(parseInt(map.ts, 10) * 1000),
      author: map.author ?? '',
      subject: map.subject ?? '',
      filesChanged,
      additions,
      deletions
    });
  }
  return commits;
}

function parseStat(stat: string | null): { additions: number; deletions: number; filesChanged: number } {
  if (!stat) return { additions: 0, deletions: 0, filesChanged: 0 };
  const files = /(\d+)\s+files?\s+changed/.exec(stat);
  const ins = /(\d+)\s+insertions?\(\+\)/.exec(stat);
  const del = /(\d+)\s+deletions?\(-\)/.exec(stat);
  return {
    additions: ins ? parseInt(ins[1], 10) : 0,
    deletions: del ? parseInt(del[1], 10) : 0,
    filesChanged: files ? parseInt(files[1], 10) : 0
  };
}

function runGitArgs(args: string[]): string {
  return execFileSync('git', args, { encoding: 'utf8', maxBuffer: 10 * 1024 * 1024 });
}

export function getCommitHistory(sinceDays = 180): CommitRecord[] {
  const raw = runGitArgs([
    'log',
    `--since=${sinceDays} days ago`,
    '--shortstat',
    `--pretty=format:${LOG_FORMAT}`
  ]);
  return parseGitLogOutput(raw);
}

export function getLastCommit(): CommitRecord {
  const raw = runGitArgs([
    'log',
    '-1',
    '--shortstat',
    `--pretty=format:${LOG_FORMAT}`
  ]);
  const commits = parseGitLogOutput(raw);
  if (commits.length === 0) throw new Error('no commits found in this repo');
  return commits[0];
}

export function formatRelativeTime(from: Date, now: Date = new Date()): string {
  const seconds = Math.floor((now.getTime() - from.getTime()) / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}
