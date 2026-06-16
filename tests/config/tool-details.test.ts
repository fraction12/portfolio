import { describe, expect, it } from 'vitest';
import { isAgentAuthor } from '../../src/config/agents';
import { artifacts, npmPackages } from '../../src/config/packages';
import { getToolDetail, toolDetailSlugs, toolDetails } from '../../src/config/tool-details';

describe('tool detail content', () => {
  it('creates one detail page entry for each artifact', () => {
    expect(toolDetails).toHaveLength(artifacts.length);
    expect(new Set(toolDetailSlugs).size).toBe(artifacts.length);

    for (const artifact of artifacts) {
      const detail = getToolDetail(artifact.slug);
      expect(detail?.detailPath).toBe(`/tools/${artifact.slug}`);
      expect(detail?.summary.length).toBeGreaterThan(20);
      expect(detail?.demo.status).toBeDefined();
    }
  });

  it('keeps TradeSpec truthful and linked to the marketing site', () => {
    const detail = getToolDetail('tradespec');

    expect(detail?.statusNote).toMatch(/Private alpha/i);
    expect(detail?.links.some(link => link.href === 'https://tradespec-website.vercel.app')).toBe(true);
  });

  it('links verified public websites and avoids stale deployments', () => {
    expect(getToolDetail('agentplan')?.links.some(link => link.href === 'https://fraction12.github.io/agentplan/')).toBe(true);
    expect(getToolDetail('agentrem')?.links.some(link => link.href === 'https://fraction12.github.io/agentrem/')).toBe(true);
    expect(getToolDetail('eat')?.links.some(link => link.href === 'https://eat-ai.app')).toBe(true);
    expect(getToolDetail('eat')?.links.some(link => link.href === 'https://eat-tawny.vercel.app')).toBe(false);
  });

  it('keeps missing demo media out of public media slots', () => {
    const missingMedia = toolDetails.filter(detail => detail.demo.status === 'none');

    expect(missingMedia.length).toBeGreaterThan(0);
    expect(missingMedia.every(detail => !detail.demo.src && !detail.demo.poster && !detail.demo.embedUrl)).toBe(true);
  });

  it('attaches ready demo videos for tools that have final videos', () => {
    const readyMediaBySlug = {
      microcanvas: '/tool-media/microcanvas/microcanvas-demo.mp4',
      'openspec-studio': '/tool-media/openspec-studio/openspec-studio-demo.mp4',
      'kv-capsules-pti': '/tool-media/kv-capsules-pti/kv-capsules-pti-explainer.mp4',
      'spec-ui': '/tool-media/spec-ui/spec-ui-demo.mp4',
    };

    for (const [slug, src] of Object.entries(readyMediaBySlug)) {
      const detail = getToolDetail(slug);

      expect(detail?.demo.status).toBe('ready');
      expect(detail?.demo.src).toBe(src);
      expect(detail?.demo.poster).toMatch(/poster\.jpg$/);
    }
  });

  it('keeps the KV Capsules + PTI research claim visible and bounded', () => {
    const artifact = artifacts.find(candidate => candidate.slug === 'kv-capsules-pti');
    const detail = getToolDetail('kv-capsules-pti');
    const detailText = [
      detail?.summary,
      detail?.problem,
      detail?.statusNote,
      ...(detail?.sections.flatMap(section => section.body) ?? []),
    ].join(' ');

    expect(artifact?.metricOverride).toContain('13.8x');
    expect(detail?.detailPath).toBe('/tools/kv-capsules-pti');
    expect(detail?.demo.status).toBe('ready');
    expect(detail?.demo.src).toBe('/tool-media/kv-capsules-pti/kv-capsules-pti-explainer.mp4');
    expect(detail?.demo.poster).toBe('/tool-media/kv-capsules-pti/kv-capsules-pti-poster.jpg');
    expect(detail?.links.some(link => link.label === 'Read paper' && link.href.endsWith('.pdf'))).toBe(true);
    expect(detailText).toContain('13.8x faster');
    expect(detailText).toContain('14.2 minutes');
    expect(detailText).toContain('3.28 hours');
    expect(detailText).toContain('100/100');
    expect(detailText).toContain('0 leaks');
    expect(detailText).toContain('selected repeated-work stream');
    expect(detailText).toContain('not a prompt-identical');
  });

  it('attaches ready previews for tools that have public product surfaces', () => {
    const readyPreviewBySlug = {
      agentplan: '/tool-media/agentplan/agentplan-preview.jpg',
      agentrem: '/tool-media/agentrem/agentrem-preview.jpg',
      eat: '/tool-media/eat/eat-preview.jpg',
      openrank: '/tool-media/openrank/openrank-preview.jpg',
      tradespec: '/tool-media/tradespec/tradespec-preview.jpg',
      wireflow: '/tool-media/wireflow/wireflow-preview.jpg',
    };

    for (const [slug, src] of Object.entries(readyPreviewBySlug)) {
      const detail = getToolDetail(slug);

      expect(detail?.demo.type).toBe('image');
      expect(detail?.demo.status).toBe('ready');
      expect(detail?.demo.src).toBe(src);
      expect(detail?.demo.alt).toBeTruthy();
    }
  });
});

describe('portfolio config metadata', () => {
  it('detects ChatGPT-style agent authors', () => {
    expect(isAgentAuthor('ChatGPT <noreply@openai.com>')).toBe(true);
    expect(isAgentAuthor('OpenAI-GPT <agent@example.com>')).toBe(true);
    expect(isAgentAuthor('Dushyant Garg <dushyant@example.com>')).toBe(false);
  });

  it('keeps npm install commands represented in npmPackages', () => {
    const installableNpmArtifacts = artifacts.filter(artifact =>
      /^npm install(?:\s+-g)?\s+[\w@./-]+$/.test(artifact.installCommand ?? '')
    );

    expect(installableNpmArtifacts.length).toBeGreaterThan(0);
    for (const artifact of installableNpmArtifacts) {
      const parts = artifact.installCommand?.trim().split(/\s+/) ?? [];
      const installedName = parts[parts.length - 1];

      expect(artifact.npmName).toBe(installedName);
      expect(npmPackages).toContain(artifact.npmName);
    }
  });
});
