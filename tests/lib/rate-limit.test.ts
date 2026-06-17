import { afterEach, describe, expect, it, vi } from 'vitest';

const redisMockState = vi.hoisted(() => ({
  instances: [] as Array<{ eval: ReturnType<typeof vi.fn> }>,
  evalResult: [1, 1, 1, 1, 0],
}));

vi.mock('@upstash/redis', () => ({
  Redis: vi.fn().mockImplementation(function Redis() {
    const instance = { eval: vi.fn(async () => redisMockState.evalResult) };
    redisMockState.instances.push(instance);
    return instance;
  }),
}));

const originalEnv = {
  UPSTASH_REDIS_REST_URL: process.env.UPSTASH_REDIS_REST_URL,
  UPSTASH_REDIS_REST_TOKEN: process.env.UPSTASH_REDIS_REST_TOKEN,
  NODE_ENV: process.env.NODE_ENV,
  VERCEL_ENV: process.env.VERCEL_ENV,
};

afterEach(() => {
  vi.clearAllMocks();
  vi.resetModules();
  redisMockState.instances = [];
  redisMockState.evalResult = [1, 1, 1, 1, 0];
  for (const [key, value] of Object.entries(originalEnv)) {
    if (value === undefined) {
      delete process.env[key];
    } else {
      process.env[key] = value;
    }
  }
});

describe('checkRateLimit', () => {
  it('uses one atomic script that checks limits before incrementing', async () => {
    process.env.UPSTASH_REDIS_REST_URL = 'https://example.upstash.io';
    process.env.UPSTASH_REDIS_REST_TOKEN = 'token';
    const { checkRateLimit } = await import('../../src/lib/rate-limit');

    redisMockState.evalResult = [0, 5, 1, 9, 2];

    const result = await checkRateLimit('203.0.113.5');

    expect(result).toEqual({ allowed: false, reason: 'Daily personal limit reached. Try again tomorrow.' });
    expect(redisMockState.instances[0].eval).toHaveBeenCalledTimes(1);
    const [script, keys, args] = redisMockState.instances[0].eval.mock.calls[0];
    expect(script).toContain('if daily >= dailyLimit then');
    expect(script).toContain('daily = redis.call("INCR", KEYS[1])');
    expect(keys).toHaveLength(3);
    expect(args).toEqual(['5', '2', '100', '86400', '3600']);
  });
});
