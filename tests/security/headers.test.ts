import { readFileSync } from 'node:fs';
import { describe, it, expect } from 'vitest';

const config = JSON.parse(readFileSync(new URL('../../vercel.json', import.meta.url), 'utf8'));
const allRoutes = config.headers?.find((entry: { source: string }) => entry.source === '/(.*)');
const headers = new Map<string, string>((allRoutes?.headers ?? []).map((h: { key: string; value: string }) => [h.key.toLowerCase(), h.value]));

describe('portfolio response hardening', () => {
  it('prevents MIME sniffing on every route and asset', () => {
    expect(headers.get('x-content-type-options')).toBe('nosniff');
  });
  it('limits executable scripts and active embedding without blanket exceptions', () => {
    const policy = headers.get('content-security-policy');
    expect(policy).toBeDefined();
    const directives = new Map(policy!.split(';').map(part => {
      const [key, ...sources] = part.trim().split(/\s+/);
      return [key, sources];
    }));
    expect(directives.get('default-src')).toEqual(["'self'"]);
    expect(directives.get('script-src')).toEqual(["'self'"]);
    expect(directives.get('script-src-attr')).toEqual(["'none'"]);
    for (const key of ['object-src', 'frame-src', 'frame-ancestors', 'base-uri']) {
      expect(directives.get(key), key).toEqual(["'none'"]);
    }
    expect(policy).not.toMatch(/\*|unsafe-eval|https:;|http:/);
  });
  it('permits the actual fonts, decorative images, media, metrics and signup', () => {
    const policy = headers.get('content-security-policy') ?? '';
    const directives = new Map(policy.split(';').map(part => {
      const [key, ...sources] = part.trim().split(/\s+/);
      return [key, sources];
    }));
    expect(directives.get('style-src')).toEqual(["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com']);
    expect(directives.get('font-src')).toEqual(["'self'", 'https://fonts.gstatic.com']);
    expect(directives.get('img-src')).toEqual(["'self'", 'data:']);
    expect(directives.get('connect-src')).toEqual(["'self'"]);
    expect(directives.get('media-src')).toEqual(["'self'"]);
    expect(directives.get('form-action')).toEqual(["'self'", 'https://dushyantg.substack.com']);
  });
});
