import { describe, expect, it } from 'vitest';
import { getSkill, listSkills } from '../../src/lib/skills';

describe('skill registry', () => {
  it('discovers skill markdown files through the shared registry', () => {
    const skills = listSkills();

    expect(skills.map(skill => skill.slug)).toContain('html-diagrams');
    expect(getSkill('html-diagrams')?.name).toBe('html-diagrams');
  });

  it('returns undefined for unknown skill slugs', () => {
    expect(getSkill('missing-skill')).toBeUndefined();
  });
});
