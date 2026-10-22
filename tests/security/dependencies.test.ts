import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const lock = JSON.parse(readFileSync(new URL('../../package-lock.json', import.meta.url), 'utf8'));
const floors: Record<string, number[]> = {
  astro: [7, 2, 8],
  '@astrojs/vercel': [11, 0, 3],
  sharp: [0, 35, 5],
  vitest: [4, 1, 12],
};

// Advisory floors apply to every resolved copy, including nested native tooling.
function atLeast(version: string, floor: number[]) {
  const match = /^(\d+)\.(\d+)\.(\d+)$/.exec(version);
  if (!match) return false;
  const actual = match.slice(1).map(Number);
  for (let i = 0; i < 3; i++) {
    if (actual[i] !== floor[i]) return actual[i] > floor[i];
  }
  return true;
}

describe('resolved security dependency floors', () => {
  for (const [name, floor] of Object.entries(floors)) {
    it(`${name} has no affected resolved copy`, () => {
      const copies = Object.entries(lock.packages).filter(([key]) => key.endsWith(`node_modules/${name}`));
      expect(copies.length).toBeGreaterThan(0);
      for (const [key, value] of copies) {
        const version = (value as { version: string }).version;
        expect(atLeast(version, floor), `${key}: ${version} is below ${floor.join('.')}`).toBe(true);
      }
    });
  }
});
