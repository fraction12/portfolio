import fs from 'node:fs';
import path from 'node:path';
import { pypiPackages } from '../../config/packages';

const SNAPSHOT_PATH = path.join(process.cwd(), 'src/data/snapshots/pypi.json');

export type PypiSnapshot = {
  fetchedAt: string | null;
  packages: Record<string, { downloadsLastMonth: number }>;
};

function readSnapshot(): PypiSnapshot {
  try { return JSON.parse(fs.readFileSync(SNAPSHOT_PATH, 'utf8')); }
  catch { return { fetchedAt: null, packages: {} }; }
}

export async function loadPypi(): Promise<PypiSnapshot> {
  if (pypiPackages.length === 0) return readSnapshot();
  try {
    const entries = await Promise.all(
      pypiPackages.map(async name => {
        const res = await fetch(`https://pypistats.org/api/packages/${encodeURIComponent(name)}/recent`);
        if (!res.ok) throw new Error(`pypi ${name} ${res.status}`);
        const json = await res.json() as { data: { last_month: number } };
        return [name, { downloadsLastMonth: json.data.last_month }] as const;
      })
    );
    const snapshot: PypiSnapshot = { fetchedAt: new Date().toISOString(), packages: Object.fromEntries(entries) };
    try { fs.writeFileSync(SNAPSHOT_PATH, JSON.stringify(snapshot, null, 2)); } catch {}
    return snapshot;
  } catch (err) {
    console.warn('[pypi] fetch failed, using snapshot:', err);
    return readSnapshot();
  }
}

export function totalPypiDownloads(s: PypiSnapshot): number {
  return Object.values(s.packages).reduce((t, p) => t + (p.downloadsLastMonth || 0), 0);
}
