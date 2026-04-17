export type Essay = {
  title: string;
  link: string;
  description: string;
  dateLabel: string;
  publishedAt: Date;
  readTimeMinutes: number;
};

const FEED_URL = 'https://dushyantg.substack.com/feed';

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
    return parseFeed(await res.text());
  } catch (err) {
    console.warn('[substack] fetch failed, returning empty:', err);
    return [];
  }
}
