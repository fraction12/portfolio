import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
// `output: 'server'` makes every page SSR by default; pages that set
// `export const prerender = true` in their frontmatter opt back into static.
// Only index.astro, writing.astro, and colophon.astro are SSR (they need
// fresh GitHub/Substack data); everything else is prerendered.
//
// `site` is the canonical production origin. It drives canonical/OG URLs in
// the shared layout and the sitemap. Do not change without also updating
// docs/seo-operations.md.
export default defineConfig({
  site: 'https://dushyantgarg.com',
  output: 'server',
  adapter: vercel(),
  integrations: [
    // @astrojs/sitemap only auto-discovers prerendered routes under SSR,
    // so SSR pages (/, /writing, /colophon) are listed via customPages.
    sitemap({
      customPages: [
        'https://dushyantgarg.com/',
        'https://dushyantgarg.com/writing/',
        'https://dushyantgarg.com/colophon/',
      ],
    }),
  ],
});
