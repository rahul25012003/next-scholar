/**
 * Rate limiting.
 *
 * A fixed window counter, keyed by whatever the caller identifies the client
 * by. It exists because the sign-in action does a real scrypt hash on every
 * attempt, which means an unthrottled endpoint is both a credential stuffing
 * target and a way to burn the CPU of every other request on the box.
 *
 * ponytail: single-process in-memory counters. On one instance that is a real
 * limit; behind more than one it becomes a per-instance limit, which is weaker
 * than it looks. Move the counter to the database or an edge KV when a second
 * instance exists, and keep this interface.
 *
 * Two deliberate properties:
 *
 * It fails closed on the identifier. A caller we cannot identify is bucketed
 * under one shared key rather than waved through, so an absent header cannot be
 * used to bypass the limit.
 *
 * It does not distinguish success from failure on the sign-in path. Counting
 * only failures tells an attacker which attempts were right.
 */

type Window = { count: number; resetAt: number };

const windows = new Map<string, Window>();

/** Bounded, so a stream of unique keys cannot grow the map without limit. */
const MAX_KEYS = 10_000;

export type RateLimit = {
  allowed: boolean;
  remaining: number;
  /** Seconds until the window resets. Sent as Retry-After where relevant. */
  retryAfter: number;
};

export type Policy = { limit: number; windowSeconds: number };

/** The policies, named, so a caller cannot invent a generous one inline. */
export const policies = {
  /** Sign in and sign up. Deliberately tight: both do scrypt work. */
  auth: { limit: 8, windowSeconds: 300 } as Policy,
  /** The scheduled sweep. A cron hits it once a day; anything more is wrong. */
  sweep: { limit: 6, windowSeconds: 3600 } as Policy,
  /** Anything a signed-in student can trigger repeatedly from a form. */
  studentWrite: { limit: 40, windowSeconds: 300 } as Policy,
} as const;

export function check(
  key: string | null,
  policy: Policy,
  now = Date.now(),
): RateLimit {
  // An unidentifiable caller shares one bucket rather than escaping the limit.
  const bucket = `${policy.limit}:${policy.windowSeconds}:${key ?? "unidentified"}`;

  const existing = windows.get(bucket);

  if (!existing || existing.resetAt <= now) {
    if (windows.size >= MAX_KEYS) sweepExpired(now);
    windows.set(bucket, { count: 1, resetAt: now + policy.windowSeconds * 1000 });
    return { allowed: true, remaining: policy.limit - 1, retryAfter: 0 };
  }

  existing.count += 1;
  const retryAfter = Math.ceil((existing.resetAt - now) / 1000);

  if (existing.count > policy.limit) {
    return { allowed: false, remaining: 0, retryAfter };
  }

  return { allowed: true, remaining: policy.limit - existing.count, retryAfter };
}

function sweepExpired(now: number): void {
  for (const [key, window] of windows) {
    if (window.resetAt <= now) windows.delete(key);
  }
  // Still full of live windows: drop the oldest half rather than growing.
  if (windows.size >= MAX_KEYS) {
    const sorted = [...windows.entries()].sort((a, b) => a[1].resetAt - b[1].resetAt);
    for (const [key] of sorted.slice(0, Math.floor(sorted.length / 2))) {
      windows.delete(key);
    }
  }
}

/**
 * The client identifier, from the headers a proxy sets.
 *
 * Returns null rather than a fabricated value when no header is present, and
 * `check` buckets a null under one shared key. A spoofable header is a weak
 * identifier, which is why the limits above are set at a level that is
 * tolerable to share.
 */
export function clientKey(headers: Headers): string | null {
  const forwarded = headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first;
  }
  return headers.get("x-real-ip") ?? headers.get("cf-connecting-ip");
}

/** Test seam. Nothing in the application calls this. */
export function reset(): void {
  windows.clear();
}
