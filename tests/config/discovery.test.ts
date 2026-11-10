import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { toolDetails } from '../../src/config/tool-details';
import writingSnapshot from '../../src/data/snapshots/substack.json';
import { buildDiscoveryText, catalogPageUrls, catalogPageSize } from '../../src/lib/discovery';

const biography = readFileSync(new URL('../../src/data/llms.txt', import.meta.url), 'utf8');

describe('portfolio discovery documents', () => {
  it('links every public tool and bundled essay in both summaries', () => {
    for (const format of ['summary', 'full'] as const) {
      const text = buildDiscoveryText(biography, format);
      expect(text).toMatch(/^# Dushyant Garg\n\n> /);
      expect(text).toContain('AI product engineer');
      expect(text).toContain('Surround Sound Media');
      expect(text).toContain('Astro and Cloudflare Workers');
      expect(text).not.toContain('Astro and Vercel');
      expect(text).toContain('Essays are hosted on Substack.');
      for (const detail of toolDetails) {
        expect(text).toContain(`https://dushyantgarg.com${detail.detailPath}/`);
        expect(text).toContain(detail.summary);
      }
      for (const essay of writingSnapshot.essays) expect(text).toContain(essay.link);
      for (const match of text.matchAll(/\]\(([^)]+)\)/g)) {
        expect(new URL(match[1]).protocol).toBe('https:');
      }
      expect(text).not.toMatch(/https:\/\/dushyantgarg\.com\/writing\/[^\s)]+/);
    }
  });

  it('expands existing tool context and essay descriptions without article bodies', () => {
    const summary = buildDiscoveryText(biography, 'summary');
    const full = buildDiscoveryText(biography, 'full');
    expect(full.length).toBeGreaterThan(summary.length);
    for (const detail of toolDetails) {
      expect(full).toContain(detail.problem);
      expect(full).toContain(detail.statusNote);
      for (const link of detail.links) expect(full).toContain(new URL(link.href, 'https://dushyantgarg.com').href);
    }
    for (const essay of writingSnapshot.essays) {
      expect(full).toContain(essay.description);
      expect(full).toContain(essay.publishedAt.slice(0, 10));
    }
  });

  it('provides apex sitemap URLs for every catalog page', () => {
    expect(catalogPageUrls).toHaveLength(Math.ceil(toolDetails.length / catalogPageSize));
    expect(catalogPageUrls[0]).toBe('https://dushyantgarg.com/tools/');
    expect(catalogPageUrls.slice(1)).toEqual(
      Array.from({ length: catalogPageUrls.length - 1 }, (_, index) => `https://dushyantgarg.com/tools/?page=${index + 2}`),
    );
  });
});
