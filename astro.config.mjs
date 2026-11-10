import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import sitemap from '@astrojs/sitemap';
import { copyFile } from 'node:fs/promises';
import { catalogPageUrls } from './src/lib/discovery.ts';

// https://astro.build/config
// `output: 'server'` makes every page SSR by default; pages that set
// `export const prerender = true` in their frontmatter opt back into static.
// Only index.astro, writing.astro, and tools.astro are SSR (they need
// fresh GitHub / Substack / package-registry data); everything else is
// prerendered.
//
// `site` is the canonical production origin. It drives canonical/OG URLs in
// the shared layout and the sitemap. Do not change without also updating
// docs/seo-operations.md.
export default defineConfig({
  site: 'https://dushyantgarg.com',
  output: 'server',
  // Preserve Astro 6 whitespace behavior across the security upgrade.
  compressHTML: true,
  // CSP permits local script files, so do not inline small processed scripts.
  vite: { build: { assetsInlineLimit: 0 } },
  adapter: cloudflare({ imageService: 'compile' }),
  session: false,
  integrations: [
    sitemap({
      filter: page => !/\.(?:txt|xml)\/?$/.test(new URL(page).pathname),
      customPages: [
        'https://dushyantgarg.com/',
        ...catalogPageUrls,
        'https://dushyantgarg.com/writing/',
      ],
    }),
    {
      name: 'sitemap-alias',
      hooks: {
        'astro:build:done': async ({ dir }) => {
          await copyFile(new URL('sitemap-index.xml', dir), new URL('sitemap.xml', dir));
        },
      },
    },
  ],
});
