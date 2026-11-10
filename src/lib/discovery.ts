import { toolDetails } from '../config/tool-details';
import writingSnapshot from '../data/snapshots/substack.json';

export const catalogPageSize = 9;
export const portfolioOrigin = 'https://dushyantgarg.com';

export const catalogPageUrls = Array.from(
  { length: Math.ceil(toolDetails.length / catalogPageSize) },
  (_, index) => `${portfolioOrigin}/tools/${index === 0 ? '' : `?page=${index + 1}`}`,
);

function markdownLabel(text: string): string {
  return text.replace(/\s+/g, ' ').replace(/([\\\[\]])/g, '\\$1');
}

export function buildDiscoveryText(biography: string, format: 'summary' | 'full'): string {
  const tools = toolDetails.map(detail => {
    const url = new URL(`${detail.detailPath}/`, portfolioOrigin).href;
    const link = `[${markdownLabel(detail.artifact.name)}](${url})`;
    if (format === 'summary') return `- ${link}: ${detail.summary}`;

    return [
      `### ${link}`,
      '',
      detail.summary,
      '',
      `Audience: ${detail.audience}`,
      '',
      `Access: ${detail.statusNote}`,
      '',
      `Stack: ${detail.artifact.stack}`,
      '',
      '#### Problem',
      '',
      detail.problem,
      '',
      ...detail.sections.flatMap(section => [`#### ${section.title}`, '', ...section.body.flatMap(paragraph => [paragraph, ''])]),
      ...detail.links.map(item => `- [${markdownLabel(item.label)}](${new URL(item.href, portfolioOrigin).href})`),
    ].join('\n');
  });

  const essays = writingSnapshot.essays.map(essay => {
    const link = `[${markdownLabel(essay.title)}](${essay.link})`;
    return format === 'summary'
      ? `- ${link}`
      : [`### ${link}`, '', `Published ${essay.publishedAt.slice(0, 10)}.`, '', essay.description].join('\n');
  });

  return [
    biography.trim(),
    '',
    '## Work',
    '',
    `[Work catalog](${portfolioOrigin}/tools/). The following entries come from the same catalog as the public tool pages.`,
    '',
    tools.join(format === 'summary' ? '\n' : '\n\n'),
    '',
    '## Writing',
    '',
    `[Writing index](${portfolioOrigin}/writing/) and [Substack](https://dushyantg.substack.com).`,
    '',
    'Essays are hosted on Substack. These entries use the repository\'s bundled writing snapshot, not full article bodies. The writing index fetches the latest feed.',
    '',
    essays.join(format === 'summary' ? '\n' : '\n\n'),
    '',
    '## Machine-readable files',
    '',
    `- [Concise portfolio summary](${portfolioOrigin}/llms.txt)`,
    `- [Expanded portfolio summary](${portfolioOrigin}/llms-full.txt)`,
    `- [Sitemap](${portfolioOrigin}/sitemap.xml)`,
    '',
  ].join('\n');
}
