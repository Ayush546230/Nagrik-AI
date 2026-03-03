import { Redis } from "@upstash/redis";
import ngeohash from "ngeohash";

// ── Redis Client ──
export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

// ── Constants ──
const GEOHASH_PRECISION = 8; // ~40m x 20m cells
const DEDUP_TTL = 60 * 60 * 24 * 30; // 30 days
const RATE_LIMIT_WINDOW = 60 * 60; // 1 hour
const USER_LIMIT = Number(process.env.RATE_LIMIT_PER_HOUR ?? 5);

// ── Key Builders ──
const dedupKey = (category: string, geohash: string) =>
  `nagrik:dedup:${category}:${geohash}`;

const rateLimitKey = (userId: string) =>
  `nagrik:ratelimit:${userId}`;


// DEDUPLICATION


export interface DedupResult {
  isDuplicate: boolean;
  existingIncidentId?: string;
  geohash: string;
}

// Check if same issue already reported within ~20m radius
export async function checkDuplicate(
  lat: number,
  lng: number,
  category: string
): Promise<DedupResult> {
  const geohash = ngeohash.encode(lat, lng, GEOHASH_PRECISION);
  const neighbors = ngeohash.neighbors(geohash); // 8 surrounding cells
  const cellsToCheck = [geohash, ...Object.values(neighbors)];

  // Check all 9 cells in parallel
  const results = await Promise.all(
    cellsToCheck.map((cell) => redis.get<string>(dedupKey(category, cell)))
  );

  const existingId = results.find(Boolean);

  return {
    isDuplicate: !!existingId,
    existingIncidentId: existingId ?? undefined,
    geohash,
  };
}

// Register new incident in Redis for future dedup checks
export async function registerIncident(
  incidentId: string,
  lat: number,
  lng: number,
  category: string
): Promise<void> {
  const geohash = ngeohash.encode(lat, lng, GEOHASH_PRECISION);
  await redis.set(dedupKey(category, geohash), incidentId, {
    ex: DEDUP_TTL,
  });
}

// Remove from Redis when incident is resolved
export async function removeIncident(
  lat: number,
  lng: number,
  category: string
): Promise<void> {
  const geohash = ngeohash.encode(lat, lng, GEOHASH_PRECISION);
  await redis.del(dedupKey(category, geohash));
}


// RATE LIMITING


export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetIn: number;
}

// Max 5 reports per user per hour
export async function checkRateLimit(userId: string): Promise<RateLimitResult> {
  const key = rateLimitKey(userId);

  const count = await redis.incr(key);

  // Set TTL on first request
  if (count === 1) await redis.expire(key, RATE_LIMIT_WINDOW);

  if (count > USER_LIMIT) {
    await redis.decr(key);
    const resetIn = await redis.ttl(key);
    return { allowed: false, remaining: 0, resetIn };
  }

  const resetIn = await redis.ttl(key);
  return {
    allowed: true,
    remaining: USER_LIMIT - count,
    resetIn,
  };
}