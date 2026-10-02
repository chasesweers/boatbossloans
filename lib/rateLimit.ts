// Fixed-window, in-memory limiter (playbook §7.5). Good enough for one serverless instance;
// on Vercel each instance has its own memory, so treat it as a speed bump, not a wall.
// Swap for a shared store (e.g. Upstash Redis) or Cloudflare Turnstile if abuse shows up.

interface Options {
  limit: number;
  windowMs: number;
  now?: () => number;
}

export function createRateLimiter({ limit, windowMs, now = Date.now }: Options) {
  const hits = new Map<string, { count: number; resetAt: number }>();

  return {
    check(key: string): boolean {
      const t = now();
      const entry = hits.get(key);
      if (!entry || t > entry.resetAt) {
        hits.set(key, { count: 1, resetAt: t + windowMs });
        return true;
      }
      if (entry.count >= limit) return false;
      entry.count++;
      return true;
    },
  };
}

export type RateLimiter = ReturnType<typeof createRateLimiter>;
