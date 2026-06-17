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

const CHECK_AND_INCREMENT_SCRIPT = `
local daily = tonumber(redis.call("GET", KEYS[1]) or "0")
local hourly = tonumber(redis.call("GET", KEYS[2]) or "0")
local global = tonumber(redis.call("GET", KEYS[3]) or "0")

local dailyLimit = tonumber(ARGV[1])
local hourlyLimit = tonumber(ARGV[2])
local globalLimit = tonumber(ARGV[3])
local ttlDay = tonumber(ARGV[4])
local ttlHour = tonumber(ARGV[5])

if global >= globalLimit then
  return {0, daily, hourly, global, 1}
end
if daily >= dailyLimit then
  return {0, daily, hourly, global, 2}
end
if hourly >= hourlyLimit then
  return {0, daily, hourly, global, 3}
end

daily = redis.call("INCR", KEYS[1])
if daily == 1 then redis.call("EXPIRE", KEYS[1], ttlDay) end

hourly = redis.call("INCR", KEYS[2])
if hourly == 1 then redis.call("EXPIRE", KEYS[2], ttlHour) end

global = redis.call("INCR", KEYS[3])
if global == 1 then redis.call("EXPIRE", KEYS[3], ttlDay) end

return {1, daily, hourly, global, 0}
`;

type RateLimitScriptResult = [allowed: number, daily: number, hourly: number, global: number, reasonCode: number];

export async function checkRateLimit(ip: string): Promise<RateLimitResult> {
  const r = getRedis();
  const keys = keySegments(ip);

  const DAILY_IP_LIMIT = 5;
  const HOURLY_IP_LIMIT = 2;
  const GLOBAL_DAILY_LIMIT = 100;

  if (!r) {
    // Without Redis we can't enforce real limits across serverless invocations.
    // Keep local development usable, but fail closed in production.
    if (process.env.NODE_ENV === 'production' || process.env.VERCEL_ENV === 'production') {
      return { allowed: false, reason: 'Rate limiter unavailable. Try again later.' };
    }
    return { allowed: true, remaining: { daily: DAILY_IP_LIMIT, hourly: HOURLY_IP_LIMIT, global: GLOBAL_DAILY_LIMIT } };
  }

  const ttlDay = 24 * 60 * 60;
  const ttlHour = 60 * 60;

  const [allowed, dailyIp, hourlyIp, globalDaily, reasonCode] = await r.eval<string[], RateLimitScriptResult>(
    CHECK_AND_INCREMENT_SCRIPT,
    [keys.dailyIp, keys.hourlyIp, keys.globalDaily],
    [
      DAILY_IP_LIMIT.toString(),
      HOURLY_IP_LIMIT.toString(),
      GLOBAL_DAILY_LIMIT.toString(),
      ttlDay.toString(),
      ttlHour.toString(),
    ]
  );

  const remainingDaily = Math.max(0, DAILY_IP_LIMIT - dailyIp);
  const remainingHourly = Math.max(0, HOURLY_IP_LIMIT - hourlyIp);
  const remainingGlobal = Math.max(0, GLOBAL_DAILY_LIMIT - globalDaily);

  if (allowed === 1) {
    return { allowed: true, remaining: { daily: remainingDaily, hourly: remainingHourly, global: remainingGlobal } };
  }

  if (reasonCode === 1) {
    return { allowed: false, reason: 'Global daily capacity reached. Try again tomorrow.' };
  }
  if (reasonCode === 2) {
    return { allowed: false, reason: 'Daily personal limit reached. Try again tomorrow.' };
  }
  if (reasonCode === 3) {
    return { allowed: false, reason: 'Hourly personal limit reached. Try again in an hour.' };
  }

  return { allowed: false, reason: 'Rate limit reached. Try again later.' };
}
