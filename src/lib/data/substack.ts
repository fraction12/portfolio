import fs from 'node:fs';
import path from 'node:path';

export type Essay = {
  title: string;
  link: string;
  description: string;
  dateLabel: string;
  publishedAt: Date;
  readTimeMinutes: number;
};

export type SubstackSnapshot = {
  fetchedAt: string | null;
  essays: Essay[];
};

const FEED_URL = 'https://dushyantg.substack.com/feed';
const SNAPSHOT_PATH = path.join(process.cwd(), 'src/data/snapshots/substack.json');

function readSnapshot(): Essay[] {
  try {
    const raw = JSON.parse(fs.readFileSync(SNAPSHOT_PATH, 'utf8')) as { fetchedAt: string | null; essays: Array<Omit<Essay, 'publishedAt'> & { publishedAt: string }> };
    return raw.essays.map(e => ({ ...e, publishedAt: new Date(e.publishedAt) }));
  } catch { return []; }
}

function writeSnapshot(essays: Essay[]) {
  try {
    const data = { fetchedAt: new Date().toISOString(), essays: essays.map(e => ({ ...e, publishedAt: e.publishedAt.toISOString() })) };
    fs.writeFileSync(SNAPSHOT_PATH, JSON.stringify(data, null, 2));
  } catch {}
}

export function decodeXml(input = ''): string {
  return input
    .replaceAll('&amp;', '&').replaceAll('&lt;', '<').replaceAll('&gt;', '>')
    .replaceAll('&quot;', '"').replaceAll('&#39;', "'");
}

export function stripHtml(input = ''): string {
  return decodeXml(input)
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function getReadTimeMinutes(content: string): number {
  const words = stripHtml(content).split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

export function formatDate(pubDate: string): { label: string; date: Date } {
  const parsed = new Date(pubDate);
  if (Number.isNaN(parsed.getTime())) return { label: 'Unknown date', date: new Date(0) };
  const label = new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).format(parsed);
  return { label, date: parsed };
}

function getTagValue(itemXml: string, tagName: string): string {
  const match = itemXml.match(new RegExp(`<${tagName}[^>]*>([\\s\\S]*?)<\\/${tagName}>`, 'i'));
  return match?.[1]?.trim() ?? '';
}

export function parseFeed(xml: string): Essay[] {
  const itemMatches = [...xml.matchAll(/<item>([\s\S]*?)<\/item>/gi)];
  return itemMatches
    .map(match => {
      const itemXml = match[1] ?? '';
      const title = stripHtml(getTagValue(itemXml, 'title'));
      const link = stripHtml(getTagValue(itemXml, 'link'));
      const descriptionRaw = getTagValue(itemXml, 'description');
      const contentRaw =
        getTagValue(itemXml, 'content:encoded') ||
        getTagValue(itemXml, 'content') ||
        descriptionRaw;
      const { label, date } = formatDate(getTagValue(itemXml, 'pubDate'));
      return {
        title,
        link,
        description: stripHtml(descriptionRaw),
        dateLabel: label,
        publishedAt: date,
        readTimeMinutes: getReadTimeMinutes(contentRaw)
      };
    })
    .filter(p => p.title && p.link);
}

export async function fetchEssays(): Promise<Essay[]> {
  try {
    const res = await fetch(FEED_URL);
    if (!res.ok) throw new Error(`substack feed ${res.status}`);
    const essays = parseFeed(await res.text());
    writeSnapshot(essays);
    return essays;
  } catch (err) {
    console.warn('[substack] fetch failed, falling back to snapshot:', err);
    return readSnapshot();
  }
}
