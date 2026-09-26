// Builds the web copies of the hero garden artwork.
// Sources (full-size PNGs) live in docs/assets/garden/source and are not deployed.
// Run: npm run garden:assets
import { mkdir } from 'node:fs/promises';
import sharp from 'sharp';

const SRC = 'docs/assets/garden/source';
const OUT = 'public/garden';

// The window pane is at most ~350 CSS px wide, so 1000 px covers 2x screens
// with room for the parallax overscan.
const layers = [
  ['layer-1-sky.png', 'sky.webp'],
  ['layer-2-distance.png', 'distance.webp'],
  ['layer-3-lawn.png', 'lawn.webp'],
  ['layer-4-midground.png', 'midground.webp'],
  // The insects are animated separately, so use the foreground without them.
  ['layer-5-foreground-clean.png', 'foreground.webp'],
];
const sprites = [
  'butterfly-swallowtail', 'butterfly-swallowtail-closed',
  'butterfly-admiral', 'butterfly-admiral-closed',
  'butterfly-blue', 'butterfly-blue-closed',
  'dragonfly', 'bee',
];

await mkdir(OUT, { recursive: true });
for (const [src, out] of layers) {
  const info = await sharp(`${SRC}/${src}`)
    .resize({ width: 1000 })
    .webp({ quality: 80, alphaQuality: 90, effort: 6 })
    .toFile(`${OUT}/${out}`);
  console.log(out, `${Math.round(info.size / 1024)} KB`);
}
for (const name of sprites) {
  const info = await sharp(`${SRC}/${name}.png`)
    .resize({ width: 200 })
    .webp({ quality: 85, alphaQuality: 95, effort: 6 })
    .toFile(`${OUT}/${name}.webp`);
  console.log(`${name}.webp`, `${Math.round(info.size / 1024)} KB`);
}
