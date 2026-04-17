import fs from 'node:fs';
import path from 'node:path';
import { GITHUB_USER } from '../../config/packages';

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
