import { describe, expect, it, vi } from 'vitest';
import { getDetailPreviewLayout, getRevealCandidates, prefersReducedMotion } from '../../src/scripts/portfolio-motion';

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

  it('keeps the detail preview clear of the copy column on desktop', () => {
    const layout = getDetailPreviewLayout({
      viewportWidth: 1728,
      viewportHeight: 1015,
      copyRight: 742,
    });

    expect(layout.left - layout.width / 2).toBeGreaterThanOrEqual(802);
    expect(layout.left + layout.width / 2).toBeLessThanOrEqual(1680);
  });

  it('uses the available right rail when the copy column is wide', () => {
    const layout = getDetailPreviewLayout({
      viewportWidth: 1200,
      viewportHeight: 800,
      copyRight: 620,
    });

    expect(layout.left - layout.width / 2).toBeGreaterThanOrEqual(662);
    expect(layout.left + layout.width / 2).toBeLessThanOrEqual(1164);
  });
});
