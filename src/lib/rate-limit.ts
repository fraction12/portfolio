import { Redis } from '@upstash/redis';

let redis: Redis | null = null;

export function getRedis(): Redis | null {
  if (redis) return redis;
  // Support both Upstash-native and Vercel KV naming conventions.
  const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;
  if (!url || !token) return null;
  redis = new Redis({ url, token });
  return redis;
}

function hashIp(ip: string): string {
  // Simple non-cryptographic hash for IP. We don't need crypto here because
  // this is only used as a Redis key segment, not for authentication.
  let h = 0;
  for (let i = 0; i < ip.length; i++) {
    h = (h * 31 + ip.charCodeAt(i)) | 0;
  }
  return (h >>> 0).toString(16);
}

function keySegments(ip: string) {
  const now = new Date();
  const dayBucket = now.toISOString().slice(0, 10); // YYYY-MM-DD
  const hourBucket = `${dayBucket}-${now.getUTCHours().toString().padStart(2, '0')}`;
  const ipHash = hashIp(ip);
  return {
    dailyIp: `skill-play:ip:${ipHash}:daily:${dayBucket}`,
    hourlyIp: `skill-play:ip:${ipHash}:hourly:${hourBucket}`,
    globalDaily: `skill-play:global:daily:${dayBucket}`,
  };
}

export type RateLimitSuccess = { allowed: true; remaining: { daily: number; hourly: number; global: number } };
export type RateLimitFailure = { allowed: false; reason: string };
export type RateLimitResult = RateLimitSuccess | RateLimitFailure;

export function isRateLimited(result: RateLimitResult): result is RateLimitFailure {
  return !result.allowed;
}

export async function checkRateLimit(ip: string): Promise<RateLimitResult> {
  const r = getRedis();
  const keys = keySegments(ip);

  const DAILY_IP_LIMIT = 50;
  const HOURLY_IP_LIMIT = 20;
  const GLOBAL_DAILY_LIMIT = 500;

  if (!r) {
    // Without Redis we can't enforce real limits across serverless invocations.
    // Allow through but signal the operator to configure KV.
    return { allowed: true, remaining: { daily: DAILY_IP_LIMIT, hourly: HOURLY_IP_LIMIT, global: GLOBAL_DAILY_LIMIT } };
  }

  const ttlDay = 24 * 60 * 60;
  const ttlHour = 60 * 60;

  const [dailyIp, hourlyIp, globalDaily] = await Promise.all([
    r.incr(keys.dailyIp).then(n => r.expire(keys.dailyIp, ttlDay).then(() => n)),
    r.incr(keys.hourlyIp).then(n => r.expire(keys.hourlyIp, ttlHour).then(() => n)),
    r.incr(keys.globalDaily).then(n => r.expire(keys.globalDaily, ttlDay).then(() => n)),
  ]);

  const remainingDaily = Math.max(0, DAILY_IP_LIMIT - dailyIp);
  const remainingHourly = Math.max(0, HOURLY_IP_LIMIT - hourlyIp);
  const remainingGlobal = Math.max(0, GLOBAL_DAILY_LIMIT - globalDaily);

  if (globalDaily > GLOBAL_DAILY_LIMIT) {
    return { allowed: false, reason: 'Global daily capacity reached. Try again tomorrow.' };
  }
  if (dailyIp > DAILY_IP_LIMIT) {
    return { allowed: false, reason: 'Daily personal limit reached. Try again tomorrow.' };
  }
  if (hourlyIp > HOURLY_IP_LIMIT) {
    return { allowed: false, reason: 'Hourly personal limit reached. Try again in an hour.' };
  }

  return { allowed: true, remaining: { daily: remainingDaily, hourly: remainingHourly, global: remainingGlobal } };
}
