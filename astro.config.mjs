import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';

// https://astro.build/config
// `output: 'server'` makes every page SSR by default; pages that set
// `export const prerender = true` in their frontmatter opt back into static.
// Only index.astro and colophon.astro are SSR (they need fresh GitHub data);
// everything else (writing, jarvis, beliefs, projects) is prerendered.
export default defineConfig({
  output: 'server',
  adapter: vercel(),
});
