import fs from 'node:fs';
import path from 'node:path';
import { GITHUB_USER, GITHUB_REPO } from '../../config/packages';
import { isAgentAuthor } from '../../config/agents';
import type { CommitRecord } from './shifts';

const TOKEN = process.env.GITHUB_TOKEN || '';
const SNAPSHOT_PATH = path.join(process.cwd(), 'src/data/snapshots/github.json');

export type HeatmapCell = { date: string; count: number; level: 0 | 1 | 2 | 3 | 4 };

export type GithubSnapshot = {
  fetchedAt: string | null;
  totalStars: number | null;
  commits7d: number | null;
  commits30d: number | null;
  heatmap: HeatmapCell[] | null;
};

function readSnapshot(): GithubSnapshot {
  try { return JSON.parse(fs.readFileSync(SNAPSHOT_PATH, 'utf8')); }
  catch { return { fetchedAt: null, totalStars: null, commits7d: null, commits30d: null, heatmap: null }; }
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
    headers: { Authorization: `Bearer ${TOKEN}`, Accept: 'application/vnd.github+json' }
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
    body: JSON.stringify({ query, variables: { login: GITHUB_USER } })
  });
  if (!res.ok) throw new Error(`github graphql ${res.status}`);
  const json = await res.json() as any;
  const weeks = json?.data?.user?.contributionsCollection?.contributionCalendar?.weeks ?? [];
  const cells: HeatmapCell[] = [];
  for (const w of weeks) {
    for (const d of w.contributionDays) {
      cells.push({ date: d.date, count: d.contributionCount, level: bucketLevel(d.contributionCount) });
    }
  }
  return cells.slice(-182);
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
 * Fetch recent commits from GitHub as a fallback when local `git log` is
 * unavailable (Vercel strips `.git` after checkout). Returns empty on any
 * failure. Stats (additions/deletions/filesChanged) are set to 0 — the
 * /commits endpoint doesn't include them. The home-page CommitTerminal
 * doesn't display stats, so this is fine for that surface.
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
      headers: { Authorization: `Bearer ${TOKEN}`, Accept: 'application/vnd.github+json' }
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
      const msg = c.commit.message ?? '';
      const firstNL = msg.indexOf('\n');
      const subject = firstNL === -1 ? msg : msg.slice(0, firstNL);
      const body = firstNL === -1 ? '' : msg.slice(firstNL + 1).trim();

      const coAuthors: string[] = [];
      const trailerRe = /^\s*Co-?Authored-?By\s*:\s*(.+?)\s*$/gim;
      let m: RegExpExecArray | null;
      while ((m = trailerRe.exec(body)) !== null) coAuthors.push(m[1].trim());

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
