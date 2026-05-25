import { afterEach, describe, expect, it, vi } from 'vitest';

const originalToken = process.env.GITHUB_TOKEN;

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
  if (originalToken === undefined) {
    delete process.env.GITHUB_TOKEN;
  } else {
    process.env.GITHUB_TOKEN = originalToken;
  }
  vi.resetModules();
});

describe('parseHeatmapResponse', () => {
  it('throws on GraphQL errors instead of returning an empty heatmap', async () => {
    const { parseHeatmapResponse } = await import('../../../src/lib/data/github');

    expect(() => parseHeatmapResponse({ errors: [{ message: 'rate limited' }], data: null as never })).toThrow(/rate limited/);
  });

  it('requires contribution weeks to be present', async () => {
    const { parseHeatmapResponse } = await import('../../../src/lib/data/github');

    expect(() => parseHeatmapResponse({ data: { user: null as never } })).toThrow(/missing contribution weeks/);
  });
});

describe('fetchAllRepoCommits', () => {
  it('requests at least the caller limit per repository before merging histories', async () => {
    process.env.GITHUB_TOKEN = 'test-token';
    const fetchMock = vi.fn(async (_url: string, init: RequestInit) => {
      const body = JSON.parse(String(init.body));

      expect(body.variables.historyLimit).toBe(12);
      expect(body.query).toContain('history(first: $historyLimit)');

      return new Response(JSON.stringify({
        data: {
          viewer: {
            repositories: {
              nodes: [
                {
                  defaultBranchRef: {
                    target: {
                      history: {
                        nodes: Array.from({ length: 12 }, (_, index) => ({
                          oid: `repo-a-${index}`,
                          committedDate: new Date(Date.UTC(2026, 0, 13 - index)).toISOString(),
                          message: `commit ${index}`,
                          author: { name: 'Dushyant Garg', email: 'dushyant@example.com' },
                        })),
                      },
                    },
                  },
                },
              ],
            },
          },
        },
      }));
    });
    vi.stubGlobal('fetch', fetchMock);

    const { fetchAllRepoCommits } = await import('../../../src/lib/data/github');
    const commits = await fetchAllRepoCommits(12);

    expect(commits).toHaveLength(12);
    expect(commits[commits.length - 1].sha).toBe('repo-a-11');
  });
});
