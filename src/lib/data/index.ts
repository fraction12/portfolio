import { getCommitHistory, getLastCommit, formatRelativeTime } from './git';
import { clusterShifts } from './shifts';
import { fetchEssays, type Essay } from './substack';
import { loadGithub, type GithubSnapshot } from './github';
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

export async function loadSignalData(): Promise<SignalData> {
  const lastCommit = getLastCommit();
  const commits = getCommitHistory(182);
  const shifts = clusterShifts(commits, SHIFT_GAP_HOURS);

  const [essays, github, npm, pypi] = await Promise.all([
    fetchEssays(), loadGithub(), loadNpm(), loadPypi()
  ]);

  return {
    lastCommit,
    lastCommitRelative: formatRelativeTime(lastCommit.timestamp),
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
