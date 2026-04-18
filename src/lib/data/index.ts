import { getCommitHistory, formatRelativeTime } from './git';
import { clusterShifts } from './shifts';
import { fetchEssays, type Essay } from './substack';
import { loadGithub, fetchGithubCommits, fetchAllRepoCommits, type GithubSnapshot } from './github';
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

/**
 * Resolve recent commits for the hero terminal / footer.
 * Priority:
 *   1. Cross-repo via GitHub GraphQL (captures public + private if token has repo scope)
 *   2. Single-repo via GitHub REST (portfolio only, still works with public_repo scope)
 *   3. Local git log (only works on dev boxes with .git present — not on Vercel)
 */
async function loadCommits(limit: number): Promise<CommitRecord[]> {
  const crossRepo = await fetchAllRepoCommits(limit);
  if (crossRepo.length > 0) return crossRepo;

  const singleRepo = await fetchGithubCommits(180, limit);
  if (singleRepo.length > 0) return singleRepo.slice(0, limit);

  try {
    return getCommitHistory(180).slice(0, limit);
  } catch {
    return [];
  }
}

/**
 * Short-lived in-process memoization. Within a single render (frontmatter
 * executes once per request but each component calls loadSignalData()
 * separately), we dedupe to one set of API calls. Across requests served
 * by a warm serverless instance, the TTL keeps data fresh.
 */
const SIGNAL_TTL_MS = 60_000;
let _cached: { ts: number; data: Promise<SignalData> } | null = null;

export function loadSignalData(): Promise<SignalData> {
  const now = Date.now();
  if (_cached && now - _cached.ts < SIGNAL_TTL_MS) return _cached.data;
  const pending = doLoadSignalData();
  const entry = { ts: now, data: pending };
  _cached = entry;
  // Don't let a rejection pin the cache for the full TTL — clear so the
  // next request retries instead of seeing a 60 s window of cached failure.
  pending.catch(() => { if (_cached === entry) _cached = null; });
  return pending;
}

async function doLoadSignalData(): Promise<SignalData> {
  const [commits, essays, github, npm, pypi] = await Promise.all([
    loadCommits(12),
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
