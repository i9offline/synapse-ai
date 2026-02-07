interface RateLimitEntry {
  count: number;
  resetAt: number;
}

interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
}

const store = new Map<string, RateLimitEntry>();

// Cleanup expired entries every 60s
const CLEANUP_INTERVAL = 60_000;
let cleanupTimer: ReturnType<typeof setInterval> | null = null;

function startCleanup() {
  if (cleanupTimer) return;
  cleanupTimer = setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of store) {
      if (entry.resetAt <= now) store.delete(key);
    }
  }, CLEANUP_INTERVAL);
  if (cleanupTimer && "unref" in cleanupTimer) cleanupTimer.unref();
}

function checkRateLimit(key: string, config: RateLimitConfig) {
  startCleanup();
  const now = Date.now();
  const entry = store.get(key);

  if (!entry || entry.resetAt <= now) {
    store.set(key, { count: 1, resetAt: now + config.windowMs });
    return { success: true, remaining: config.maxRequests - 1, resetAt: now + config.windowMs, limit: config.maxRequests };
  }

  if (entry.count >= config.maxRequests) {
    return { success: false, remaining: 0, resetAt: entry.resetAt, limit: config.maxRequests };
  }

  entry.count++;
  return { success: true, remaining: config.maxRequests - entry.count, resetAt: entry.resetAt, limit: config.maxRequests };
}

export const RATE_LIMITS = {
  chat: { windowMs: 60_000, maxRequests: 20 },
  sync: { windowMs: 60_000, maxRequests: 5 },
  upload: { windowMs: 60_000, maxRequests: 10 },
  default: { windowMs: 60_000, maxRequests: 60 },
} as const;

export type RateLimitTier = keyof typeof RATE_LIMITS;

export function rateLimitResponse(
  key: string,
  tier: RateLimitTier
): Response | null {
  const config = RATE_LIMITS[tier];
  const result = checkRateLimit(`${tier}:${key}`, config);

  if (!result.success) {
    const retryAfter = Math.ceil((result.resetAt - Date.now()) / 1000);
    return Response.json(
      { error: "Too many requests. Please try again later." },
      {
        status: 429,
        headers: {
          "Retry-After": String(retryAfter),
          "X-RateLimit-Limit": String(result.limit),
          "X-RateLimit-Remaining": "0",
          "X-RateLimit-Reset": String(Math.ceil(result.resetAt / 1000)),
        },
      }
    );
  }

  return null;
}
