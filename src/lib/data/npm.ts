import fs from 'node:fs';
import path from 'node:path';
import { npmPackages } from '../../config/packages';

const SNAPSHOT_PATH = path.join(process.cwd(), 'src/data/snapshots/npm.json');

export type NpmSnapshot = {
  fetchedAt: string | null;
  packages: Record<string, { downloadsLastMonth: number }>;
};

function readSnapshot(): NpmSnapshot {
  try { return JSON.parse(fs.readFileSync(SNAPSHOT_PATH, 'utf8')); }
  catch { return { fetchedAt: null, packages: {} }; }
}

export async function loadNpm(): Promise<NpmSnapshot> {
  if (npmPackages.length === 0) return readSnapshot();
  try {
    const entries = await Promise.all(
      npmPackages.map(async name => {
        const res = await fetch(`https://api.npmjs.org/downloads/point/last-month/${encodeURIComponent(name)}`);
        if (!res.ok) throw new Error(`npm ${name} ${res.status}`);
        const json = await res.json() as { downloads: number };
        return [name, { downloadsLastMonth: json.downloads }] as const;
      })
    );
    const snapshot: NpmSnapshot = { fetchedAt: new Date().toISOString(), packages: Object.fromEntries(entries) };
    try { fs.writeFileSync(SNAPSHOT_PATH, JSON.stringify(snapshot, null, 2)); } catch {}
    return snapshot;
  } catch (err) {
    console.warn('[npm] fetch failed, using snapshot:', err);
    return readSnapshot();
  }
}

export function totalNpmDownloads(s: NpmSnapshot): number {
  return Object.values(s.packages).reduce((t, p) => t + (p.downloadsLastMonth || 0), 0);
}
