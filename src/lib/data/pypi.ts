import bundledSnapshot from '../../data/snapshots/pypi.json';
import { pypiPackages } from '../../config/packages';

export type PypiSnapshot = {
  fetchedAt: string | null;
  packages: Record<string, { downloadsLastMonth: number }>;
};

let snapshot: PypiSnapshot = bundledSnapshot;

export async function loadPypi(): Promise<PypiSnapshot> {
  if (pypiPackages.length === 0) return snapshot;
  try {
    const entries = await Promise.all(
      pypiPackages.map(async name => {
        const res = await fetch(`https://pypistats.org/api/packages/${encodeURIComponent(name)}/recent`, {
          signal: AbortSignal.timeout(5000)
        });
        if (!res.ok) throw new Error(`pypi ${name} ${res.status}`);
        const json = await res.json() as { data: { last_month: number } };
        return [name, { downloadsLastMonth: json.data.last_month }] as const;
      })
    );
    const latest: PypiSnapshot = { fetchedAt: new Date().toISOString(), packages: Object.fromEntries(entries) };
    snapshot = latest;
    return snapshot;
  } catch (err) {
    console.warn('[pypi] fetch failed, using snapshot:', err);
    return snapshot;
  }
}

export function totalPypiDownloads(s: PypiSnapshot): number {
  return Object.values(s.packages).reduce((t, p) => t + (p.downloadsLastMonth || 0), 0);
}
