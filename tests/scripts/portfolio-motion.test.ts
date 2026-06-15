import { describe, expect, it, vi } from 'vitest';
import { prefersReducedMotion } from '../../src/scripts/portfolio-motion';

describe('portfolio motion helpers', () => {
  it('detects reduced motion preference', () => {
    const win = {
      matchMedia: vi.fn(() => ({ matches: true })),
    } as unknown as Window;

    expect(prefersReducedMotion(win)).toBe(true);
    expect(win.matchMedia).toHaveBeenCalledWith('(prefers-reduced-motion: reduce)');
  });
});
