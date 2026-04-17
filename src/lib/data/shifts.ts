export type CommitRecord = {
  sha: string;
  timestamp: Date;
  author: string;
  authorEmail: string;
  subject: string;
  body: string;
  coAuthors: string[];
  isAgentAuthored: boolean;
  filesChanged: number;
  additions: number;
  deletions: number;
};

export type Shift = {
  start: Date;
  end: Date;
  commits: CommitRecord[];
  commitCount: number;
  additions: number;
  deletions: number;
};

export function clusterShifts(commits: CommitRecord[], gapHours: number): Shift[] {
  if (commits.length === 0) return [];
  const sorted = [...commits].sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
  const gapMs = gapHours * 60 * 60 * 1000;

  const shifts: Shift[] = [];
  let current: CommitRecord[] = [sorted[0]];

  for (let i = 1; i < sorted.length; i++) {
    const prev = current[current.length - 1];
    const curr = sorted[i];
    if (curr.timestamp.getTime() - prev.timestamp.getTime() > gapMs) {
      shifts.push(buildShift(current));
      current = [curr];
    } else {
      current.push(curr);
    }
  }
  shifts.push(buildShift(current));
  return shifts;
}

function buildShift(commits: CommitRecord[]): Shift {
  return {
    start: commits[0].timestamp,
    end: commits[commits.length - 1].timestamp,
    commits,
    commitCount: commits.length,
    additions: commits.reduce((s, c) => s + c.additions, 0),
    deletions: commits.reduce((s, c) => s + c.deletions, 0)
  };
}
