import { describe, it, expect } from 'vitest';
import { parseFeed, stripHtml, getReadTimeMinutes } from '../../../src/lib/data/substack';

const SAMPLE = `<?xml version="1.0"?>
<rss><channel>
  <item>
    <title><![CDATA[Taste in AI means constraints]]></title>
    <link>https://dushyantg.substack.com/p/taste</link>
    <description><![CDATA[<p>Good AI products feel opinionated.</p>]]></description>
    <content:encoded><![CDATA[<p>Good AI products feel opinionated.</p><p>${'word '.repeat(450).trim()}</p>]]></content:encoded>
    <pubDate>Mon, 13 Apr 2026 10:00:00 +0000</pubDate>
  </item>
</channel></rss>`;

describe('stripHtml', () => {
  it('decodes entities and removes tags', () => {
    expect(stripHtml('<p>Hello &amp; goodbye</p>')).toBe('Hello & goodbye');
  });
  it('collapses whitespace', () => {
    expect(stripHtml('a\n\n\n b')).toBe('a b');
  });
});

describe('getReadTimeMinutes', () => {
  it('returns at least 1', () => {
    expect(getReadTimeMinutes('<p>hi</p>')).toBe(1);
  });
  it('rounds up based on 200 wpm', () => {
    const words = Array(450).fill('word').join(' ');
    expect(getReadTimeMinutes(words)).toBe(3);
  });
});

describe('parseFeed', () => {
  it('parses a single item feed', () => {
    const posts = parseFeed(SAMPLE);
    expect(posts).toHaveLength(1);
    expect(posts[0].title).toBe('Taste in AI means constraints');
    expect(posts[0].link).toBe('https://dushyantg.substack.com/p/taste');
    expect(posts[0].description).toContain('opinionated');
    expect(posts[0].dateLabel).toMatch(/April 13, 2026/);
    expect(posts[0].readTimeMinutes).toBeGreaterThanOrEqual(1);
  });
});
