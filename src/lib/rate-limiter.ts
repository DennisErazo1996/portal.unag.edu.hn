/**
 * Sliding window rate limiter (in-memory).
 * Works within a warm serverless instance. For cross-instance persistence,
 * replace the store with Upstash Redis or similar.
 */

interface WindowEntry {
  timestamps: number[];
}

const store = new Map<string, WindowEntry>();

const WINDOW_MS = 60_000; // 1 minute
const MAX_REQUESTS = 10;  // per window per IP

/** Purge entries older than the window to keep memory bounded. */
function purgeExpired(entry: WindowEntry, now: number): void {
  const cutoff = now - WINDOW_MS;
  entry.timestamps = entry.timestamps.filter((t) => t > cutoff);
}

/**
 * Returns true if the request is allowed, false if rate-limited.
 * Also returns the number of remaining requests in the current window.
 */
export function checkRateLimit(ip: string): {
  allowed: boolean;
  remaining: number;
  resetInMs: number;
} {
  const now = Date.now();
  const entry = store.get(ip) ?? { timestamps: [] };

  purgeExpired(entry, now);

  if (entry.timestamps.length >= MAX_REQUESTS) {
    const oldest = entry.timestamps[0];
    const resetInMs = WINDOW_MS - (now - oldest);
    store.set(ip, entry);
    return { allowed: false, remaining: 0, resetInMs };
  }

  entry.timestamps.push(now);
  store.set(ip, entry);

  const remaining = MAX_REQUESTS - entry.timestamps.length;
  return { allowed: true, remaining, resetInMs: 0 };
}

/** Extract the real client IP from Vercel/Astro request headers. */
export function getClientIp(request: Request): string {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0].trim() ??
    request.headers.get('x-real-ip') ??
    'unknown'
  );
}
