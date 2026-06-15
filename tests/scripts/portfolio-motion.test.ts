import { describe, expect, it, vi } from 'vitest';
import { getRevealCandidates, prefersReducedMotion } from '../../src/scripts/portfolio-motion';

describe('portfolio motion helpers', () => {
  it('detects reduced motion preference', () => {
    const win = {
      matchMedia: vi.fn(() => ({ matches: true })),
    } as unknown as Window;

    expect(prefersReducedMotion(win)).toBe(true);
    expect(win.matchMedia).toHaveBeenCalledWith('(prefers-reduced-motion: reduce)');
  });

  it('does not reveal elements inside the hero motion root twice', () => {
    const outside = { closest: vi.fn(() => null) };
    const inside = { closest: vi.fn(() => ({})) };
    const root = {
      querySelectorAll: vi.fn(() => [outside, inside]),
    } as unknown as ParentNode;

    expect(getRevealCandidates(root)).toEqual([outside]);
  });
});
