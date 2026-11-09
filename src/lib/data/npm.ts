import bundledSnapshot from '../../data/snapshots/npm.json';
import { npmPackages } from '../../config/packages';

export type NpmSnapshot = {
  fetchedAt: string | null;
  packages: Record<string, { downloadsLastMonth: number }>;
};

let snapshot: NpmSnapshot = bundledSnapshot;

export async function loadNpm(): Promise<NpmSnapshot> {
  if (npmPackages.length === 0) return snapshot;
  try {
    const entries = await Promise.all(
      npmPackages.map(async name => {
        const res = await fetch(`https://api.npmjs.org/downloads/point/last-month/${encodeURIComponent(name)}`, {
          signal: AbortSignal.timeout(5000)
        });
        if (!res.ok) throw new Error(`npm ${name} ${res.status}`);
        const json = await res.json() as { downloads: number };
        return [name, { downloadsLastMonth: json.downloads }] as const;
      })
    );
    const latest: NpmSnapshot = { fetchedAt: new Date().toISOString(), packages: Object.fromEntries(entries) };
    snapshot = latest;
    return snapshot;
  } catch (err) {
    console.warn('[npm] fetch failed, using snapshot:', err);
    return snapshot;
  }
}

export function totalNpmDownloads(s: NpmSnapshot): number {
  return Object.values(s.packages).reduce((t, p) => t + (p.downloadsLastMonth || 0), 0);
}
