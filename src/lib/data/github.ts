import fs from 'node:fs';
import path from 'node:path';
import { GITHUB_USER, GITHUB_REPO } from '../../config/packages';
import { isAgentAuthor } from '../../config/agents';
import type { CommitRecord } from './shifts';

const TOKEN = process.env.GITHUB_TOKEN || '';
const HEATMAP_WEEK_COUNT = 28;
const SNAPSHOT_PATH = path.join(process.cwd(), 'src/data/snapshots/github.json');

export type HeatmapCell = { date: string; count: number; level: 0 | 1 | 2 | 3 | 4 };

export type GithubSnapshot = {
  fetchedAt: string | null;
  totalStars: number | null;
  commits7d: number | null;
  commits30d: number | null;
  heatmap: HeatmapCell[] | null;
};

export type GraphqlResponse<T> = {
  data?: T;
  errors?: Array<{ message?: string }>;
};

type HeatmapGraphqlData = {
  user?: {
    contributionsCollection?: {
      contributionCalendar?: {
        weeks?: Array<{ contributionDays?: Array<{ date: string; contributionCount: number }> }>;
      };
    };
  };
};

function readSnapshot(): GithubSnapshot {
  try { return JSON.parse(fs.readFileSync(SNAPSHOT_PATH, 'utf8')); }
  catch { return { fetchedAt: null, totalStars: null, commits7d: null, commits30d: null, heatmap: null }; }
}

function assertNoGraphqlErrors(json: GraphqlResponse<unknown>, label: string): void {
  if (Array.isArray(json.errors) && json.errors.length > 0) {
    const message = json.errors.map(err => err?.message).filter(Boolean).join('; ') || 'unknown GraphQL error';
    throw new Error(`${label}: ${message}`);
  }
}

export async function loadGithub(): Promise<GithubSnapshot> {
  if (!TOKEN) {
    console.warn('[github] GITHUB_TOKEN unset; using snapshot');
    return readSnapshot();
  }
  try {
    const [stars, heatmap] = await Promise.all([fetchTotalStars(), fetchHeatmap()]);
    const snapshot: GithubSnapshot = {
      fetchedAt: new Date().toISOString(),
      totalStars: stars,
      commits7d: heatmap.filter(c => withinDays(c.date, 7)).reduce((s, c) => s + c.count, 0),
      commits30d: heatmap.filter(c => withinDays(c.date, 30)).reduce((s, c) => s + c.count, 0),
      heatmap
    };
    try { fs.writeFileSync(SNAPSHOT_PATH, JSON.stringify(snapshot, null, 2)); } catch {}
    return snapshot;
  } catch (err) {
    console.warn('[github] fetch failed, using snapshot:', err);
    return readSnapshot();
  }
}

async function fetchTotalStars(): Promise<number> {
  const res = await fetch(`https://api.github.com/users/${GITHUB_USER}/repos?per_page=100&type=owner`, {
    headers: { Authorization: `Bearer ${TOKEN}`, Accept: 'application/vnd.github+json' },
    signal: AbortSignal.timeout(5000)
  });
  if (!res.ok) throw new Error(`github repos ${res.status}`);
  const repos = await res.json() as Array<{ stargazers_count: number; fork: boolean }>;
  return repos.filter(r => !r.fork).reduce((s, r) => s + (r.stargazers_count || 0), 0);
}

async function fetchHeatmap(): Promise<HeatmapCell[]> {
  const query = `
    query($login:String!) {
      user(login:$login) {
        contributionsCollection {
          contributionCalendar {
            weeks { contributionDays { date contributionCount } }
          }
        }
      }
    }
  `;
  const res = await fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers: { Authorization: `Bearer ${TOKEN}`, 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({ query, variables: { login: GITHUB_USER } }),
    signal: AbortSignal.timeout(5000)
  });
  if (!res.ok) throw new Error(`github graphql ${res.status}`);
  const json = await res.json() as GraphqlResponse<HeatmapGraphqlData>;
  return parseHeatmapResponse(json);
}

export function parseHeatmapResponse(json: GraphqlResponse<HeatmapGraphqlData>): HeatmapCell[] {
  assertNoGraphqlErrors(json, 'github heatmap graphql');
  const weeks = json.data?.user?.contributionsCollection?.contributionCalendar?.weeks;
  if (!Array.isArray(weeks)) throw new Error('github heatmap missing contribution weeks');
  const cells: HeatmapCell[] = [];
  for (const w of weeks) {
    if (!Array.isArray(w?.contributionDays)) throw new Error('github heatmap malformed contribution days');
    for (const d of w.contributionDays) {
      if (typeof d?.date !== 'string' || typeof d?.contributionCount !== 'number') {
        throw new Error('github heatmap malformed contribution day');
      }
      cells.push({ date: d.date, count: d.contributionCount, level: bucketLevel(d.contributionCount) });
    }
  }
  return cells.slice(-(HEATMAP_WEEK_COUNT * 7));
}

function bucketLevel(n: number): 0 | 1 | 2 | 3 | 4 {
  if (n === 0) return 0;
  if (n <= 2) return 1;
  if (n <= 5) return 2;
  if (n <= 10) return 3;
  return 4;
}

function withinDays(iso: string, days: number): boolean {
  const d = new Date(iso);
  const diff = (Date.now() - d.getTime()) / (1000 * 60 * 60 * 24);
  return diff <= days && diff >= 0;
}

/**
 * Parse a raw commit message into subject + body + extracted Co-Authored-By trailers.
 */
function parseCommitMessage(msg: string) {
  const firstNL = msg.indexOf('\n');
  const subject = firstNL === -1 ? msg : msg.slice(0, firstNL);
  const body = firstNL === -1 ? '' : msg.slice(firstNL + 1).trim();

  const coAuthors: string[] = [];
  const trailerRe = /^\s*Co-?Authored-?By\s*:\s*(.+?)\s*$/gim;
  let m: RegExpExecArray | null;
  while ((m = trailerRe.exec(body)) !== null) coAuthors.push(m[1].trim());

  return { subject, body, coAuthors };
}

/**
 * Fetch recent commits from a single repo. Used as a fallback when we don't
 * have repo-scope access (can only see public repos).
 *
 * Stats are 0 — the /commits endpoint doesn't include them.
 */
export async function fetchGithubCommits(sinceDays = 180, perPage = 100): Promise<CommitRecord[]> {
  if (!TOKEN) {
    console.warn('[github-commits] GITHUB_TOKEN unset; returning empty');
    return [];
  }
  try {
    const since = new Date(Date.now() - sinceDays * 86400000).toISOString();
    const url = `https://api.github.com/repos/${GITHUB_USER}/${GITHUB_REPO}/commits?per_page=${perPage}&since=${encodeURIComponent(since)}`;
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${TOKEN}`, Accept: 'application/vnd.github+json' },
      signal: AbortSignal.timeout(5000)
    });
    if (!res.ok) throw new Error(`github commits ${res.status}`);
    const data = await res.json() as Array<{
      sha: string;
      commit: {
        author: { name: string; email: string; date: string };
        message: string;
      };
    }>;

    return data.map(c => {
      const { subject, body, coAuthors } = parseCommitMessage(c.commit.message ?? '');
      const author = c.commit.author.name ?? '';
      const authorEmail = c.commit.author.email ?? '';
      const primaryKey = `${author} <${authorEmail}>`;
      const isAgent = isAgentAuthor(primaryKey) || coAuthors.some(x => isAgentAuthor(x));

      return {
        sha: c.sha,
        timestamp: new Date(c.commit.author.date),
        author,
        authorEmail,
        subject,
        body,
        coAuthors,
        isAgentAuthored: isAgent,
        filesChanged: 0,
        additions: 0,
        deletions: 0
      };
    });
  } catch (err) {
    console.warn('[github-commits] fetch failed:', err instanceof Error ? err.message : err);
    return [];
  }
}

/**
 * Fetch recent commits across ALL repos the token can see (public + private
 * if scope is `repo`, public-only if scope is `public_repo`).
 *
 * Uses a single GraphQL query: viewer.repositories(...).defaultBranchRef.history.
 * Merges the per-repo histories, sorts by committedDate, returns top `limit`.
 */
export async function fetchAllRepoCommits(limit = 12): Promise<CommitRecord[]> {
  if (!TOKEN) {
    console.warn('[github-commits-all] GITHUB_TOKEN unset; returning empty');
    return [];
  }

  const historyLimit = Math.max(10, limit);
  const query = `
    query($historyLimit: Int!) {
      viewer {
        repositories(first: 20, orderBy: {field: PUSHED_AT, direction: DESC}, affiliations: [OWNER], isFork: false) {
          nodes {
            nameWithOwner
            isPrivate
            defaultBranchRef {
              target {
                ... on Commit {
                  history(first: $historyLimit) {
                    nodes {
                      oid
                      committedDate
                      message
                      author { name email }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  `;

  try {
    const res = await fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${TOKEN}`,
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify({ query, variables: { historyLimit } }),
      signal: AbortSignal.timeout(5000)
    });
    if (!res.ok) throw new Error(`github graphql ${res.status}`);
    const json = await res.json() as GraphqlResponse<{
      viewer?: {
        repositories?: {
          nodes?: Array<{
            defaultBranchRef?: {
              target?: {
                history?: {
                  nodes?: Array<{
                    oid: string;
                    committedDate: string;
                    message?: string;
                    author?: { name?: string; email?: string };
                  }>;
                };
              };
            };
          }>;
        };
      };
    }>;
    assertNoGraphqlErrors(json, 'github commits graphql');
    const repos = json.data?.viewer?.repositories?.nodes;
    if (!Array.isArray(repos)) throw new Error('github commits missing repositories');

    const all: CommitRecord[] = [];
    for (const r of repos) {
      const history = r?.defaultBranchRef?.target?.history?.nodes ?? [];
      if (!Array.isArray(history)) throw new Error('github commits malformed history');
      for (const c of history) {
        if (typeof c?.oid !== 'string' || typeof c?.committedDate !== 'string') {
          throw new Error('github commits malformed commit node');
        }
        const { subject, body, coAuthors } = parseCommitMessage(c.message ?? '');
        const author = c.author?.name ?? '';
        const authorEmail = c.author?.email ?? '';
        const primaryKey = `${author} <${authorEmail}>`;
        const isAgent = isAgentAuthor(primaryKey) || coAuthors.some(x => isAgentAuthor(x));

        all.push({
          sha: c.oid,
          timestamp: new Date(c.committedDate),
          author,
          authorEmail,
          subject,
          body,
          coAuthors,
          isAgentAuthored: isAgent,
          filesChanged: 0,
          additions: 0,
          deletions: 0
        });
      }
    }

    // Sort newest first and cap
    all.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    return all.slice(0, limit);
  } catch (err) {
    console.warn('[github-commits-all] fetch failed:', err instanceof Error ? err.message : err);
    return [];
  }
}
