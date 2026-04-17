import { getCommitHistory, formatRelativeTime } from './git';
import { clusterShifts } from './shifts';
import { fetchEssays, type Essay } from './substack';
import { loadGithub, fetchGithubCommits, type GithubSnapshot } from './github';
import { loadNpm, totalNpmDownloads, type NpmSnapshot } from './npm';
import { loadPypi, totalPypiDownloads, type PypiSnapshot } from './pypi';
import { SHIFT_GAP_HOURS } from '../../config/stream-sources';
import type { Shift, CommitRecord } from './shifts';

export type SignalData = {
  lastCommit: CommitRecord;
  lastCommitRelative: string;
  commits: CommitRecord[];
  shifts: Shift[];
  essays: Essay[];
  github: GithubSnapshot;
  npm: NpmSnapshot;
  pypi: PypiSnapshot;
  totalDownloadsLastMonth: number;
};

const SYNTHETIC_COMMIT: CommitRecord = {
  sha: '0000000',
  timestamp: new Date(0),
  author: 'unknown',
  authorEmail: '',
  subject: '(no commit data available)',
  body: '',
  coAuthors: [],
  isAgentAuthored: false,
  filesChanged: 0,
  additions: 0,
  deletions: 0
};

/** Try local git first, fall back to GitHub API when .git isn't available (e.g. on Vercel). */
async function loadCommitsWithFallback(sinceDays: number): Promise<CommitRecord[]> {
  try {
    return getCommitHistory(sinceDays);
  } catch (err) {
    console.warn('[commits] local git unavailable, falling back to GitHub API:', err instanceof Error ? err.message : err);
    return await fetchGithubCommits(sinceDays);
  }
}

// Memoize so Hero / Nav / Footer / index.astro don't re-trigger the full fetch set
// on every call within a single build.
let _cached: Promise<SignalData> | null = null;

export function loadSignalData(): Promise<SignalData> {
  if (!_cached) _cached = doLoadSignalData();
  return _cached;
}

async function doLoadSignalData(): Promise<SignalData> {
  const [commits, essays, github, npm, pypi] = await Promise.all([
    loadCommitsWithFallback(182),
    fetchEssays(),
    loadGithub(),
    loadNpm(),
    loadPypi()
  ]);

  const shifts = clusterShifts(commits, SHIFT_GAP_HOURS);
  const lastCommit = commits[0] ?? SYNTHETIC_COMMIT;

  return {
    lastCommit,
    lastCommitRelative: lastCommit === SYNTHETIC_COMMIT ? 'unknown' : formatRelativeTime(lastCommit.timestamp),
    commits,
    shifts,
    essays,
    github,
    npm,
    pypi,
    totalDownloadsLastMonth: totalNpmDownloads(npm) + totalPypiDownloads(pypi)
  };
}

export { formatRelativeTime };
export type { Essay, Shift, CommitRecord, GithubSnapshot, NpmSnapshot, PypiSnapshot };
