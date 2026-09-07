/**
 * Simple in-memory rate limiter for sensitive endpoints.
 * Not durable across instances — adequate for single-node CMS.
 */

type Bucket = {
  count: number;
  resetAt: number;
};

const buckets = new Map<string, Bucket>();

const DEFAULT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const DEFAULT_MAX_ATTEMPTS = 10;

export type RateLimitOptions = {
  windowMs?: number;
  maxAttempts?: number;
};

export function checkRateLimit(
  key: string,
  options: RateLimitOptions = {},
): {
  allowed: boolean;
  remaining: number;
  retryAfterSeconds: number;
} {
  const windowMs = options.windowMs ?? DEFAULT_WINDOW_MS;
  const maxAttempts = options.maxAttempts ?? DEFAULT_MAX_ATTEMPTS;
  const now = Date.now();
  let bucket = buckets.get(key);

  if (!bucket || now >= bucket.resetAt) {
    bucket = { count: 0, resetAt: now + windowMs };
    buckets.set(key, bucket);
  }

  if (bucket.count >= maxAttempts) {
    return {
      allowed: false,
      remaining: 0,
      retryAfterSeconds: Math.ceil((bucket.resetAt - now) / 1000),
    };
  }

  return {
    allowed: true,
    remaining: maxAttempts - bucket.count,
    retryAfterSeconds: Math.ceil((bucket.resetAt - now) / 1000),
  };
}

export function recordRateLimitHit(
  key: string,
  options: RateLimitOptions = {},
): void {
  const windowMs = options.windowMs ?? DEFAULT_WINDOW_MS;
  const now = Date.now();
  let bucket = buckets.get(key);

  if (!bucket || now >= bucket.resetAt) {
    bucket = { count: 1, resetAt: now + windowMs };
  } else {
    bucket.count += 1;
  }

  buckets.set(key, bucket);
}

export function clearRateLimit(key: string): void {
  buckets.delete(key);
}
