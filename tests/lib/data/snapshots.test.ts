import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import githubSnapshot from '../../../src/data/snapshots/github.json';
import npmSnapshot from '../../../src/data/snapshots/npm.json';
import pypiSnapshot from '../../../src/data/snapshots/pypi.json';
import substackSnapshot from '../../../src/data/snapshots/substack.json';

beforeEach(() => {
  vi.resetModules();
  vi.spyOn(console, 'warn').mockImplementation(() => {});
});

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
});

describe('bundled snapshot fallback', () => {
  it('serves GitHub data without a token', async () => {
    vi.stubEnv('GITHUB_TOKEN', '');
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
    const { loadGithub } = await import('../../../src/lib/data/github');

    expect(await loadGithub()).toEqual(githubSnapshot);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('serves all bundled data when upstream services fail', async () => {
    vi.stubEnv('GITHUB_TOKEN', 'test-token');
    vi.stubGlobal('fetch', vi.fn(async () => new Response('Unavailable', { status: 503 })));
    const [{ loadGithub }, { loadNpm }, { loadPypi }, { fetchEssays }] = await Promise.all([
      import('../../../src/lib/data/github'),
      import('../../../src/lib/data/npm'),
      import('../../../src/lib/data/pypi'),
      import('../../../src/lib/data/substack'),
    ]);

    expect(await loadGithub()).toEqual(githubSnapshot);
    expect(await loadNpm()).toEqual(npmSnapshot);
    expect(await loadPypi()).toEqual(pypiSnapshot);
    const essays = await fetchEssays();
    expect(essays.map(essay => essay.link)).toEqual(substackSnapshot.essays.map(essay => essay.link));
    expect(essays[0].publishedAt).toBeInstanceOf(Date);
  });

  it('keeps successful GitHub data for later upstream failures in the same isolate', async () => {
    vi.stubEnv('GITHUB_TOKEN', 'test-token');
    vi.stubGlobal('fetch', vi.fn(async (url: string) => new Response(JSON.stringify(
      url.includes('/users/')
        ? [{ stargazers_count: 42, fork: false }]
        : { data: { user: { contributionsCollection: { contributionCalendar: { weeks: [
          { contributionDays: [{ date: new Date().toISOString().slice(0, 10), contributionCount: 5 }] },
        ] } } } } },
    ))));
    const { loadGithub } = await import('../../../src/lib/data/github');

    const latest = await loadGithub();
    expect(latest.totalStars).toBe(42);
    expect(latest.heatmap?.[0].count).toBe(5);
    vi.stubGlobal('fetch', vi.fn(async () => new Response('Unavailable', { status: 503 })));
    expect(await loadGithub()).toEqual(latest);
  });

  it('keeps successful package metrics for later upstream failures in the same isolate', async () => {
    vi.stubGlobal('fetch', vi.fn(async (url: string) => new Response(JSON.stringify(
      url.includes('npmjs.org') ? { downloads: 1234 } : { data: { last_month: 5678 } },
    ))));
    const [{ loadNpm }, { loadPypi }] = await Promise.all([
      import('../../../src/lib/data/npm'),
      import('../../../src/lib/data/pypi'),
    ]);

    const [npm, pypi] = await Promise.all([loadNpm(), loadPypi()]);
    expect(Object.values(npm.packages).every(p => p.downloadsLastMonth === 1234)).toBe(true);
    expect(Object.values(pypi.packages).every(p => p.downloadsLastMonth === 5678)).toBe(true);
    expect(Object.keys(npm.packages).length).toBeGreaterThan(0);
    expect(Object.keys(pypi.packages).length).toBeGreaterThan(0);
    vi.stubGlobal('fetch', vi.fn(async () => new Response('Unavailable', { status: 503 })));
    expect(await loadNpm()).toEqual(npm);
    expect(await loadPypi()).toEqual(pypi);
  });

  it('keeps successful essays for later upstream failures in the same isolate', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => new Response(`<rss><channel><item>
      <title>Fresh essay</title><link>https://dushyantg.substack.com/p/fresh</link>
      <description>Fresh content</description><pubDate>Mon, 09 Nov 2026 10:00:00 GMT</pubDate>
    </item></channel></rss>`)));
    const { fetchEssays } = await import('../../../src/lib/data/substack');

    const latest = await fetchEssays();
    expect(latest[0].title).toBe('Fresh essay');
    vi.stubGlobal('fetch', vi.fn(async () => new Response('Unavailable', { status: 503 })));
    expect(await fetchEssays()).toEqual(latest);
  });
});
