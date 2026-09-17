import { enforceRetention, syncNotifications } from "@/data/store";
import { check, clientKey, policies } from "@/domain/rate-limit";
import { createHash, timingSafeEqual } from "node:crypto";

/** Hashing first gives equal lengths, so the compare leaks neither content nor length. */
const sameSecret = (given: string, want: string) =>
  timingSafeEqual(
    createHash("sha256").update(given).digest(),
    createHash("sha256").update(want).digest(),
  );

/**
 * The scheduled sweep. A cron hits this, it runs detection across every case,
 * queues what is new, resolves what has cleared, and deletes what has passed
 * its retention date (2.10).
 *
 * Retention runs first, so a case deleted this run cannot also get a fresh
 * notification queued for it a moment later.
 *
 * It is safe to call twice: detection reads stored values only, and the
 * notification planner dedupes on the event key, so a repeat run on unchanged
 * state queues nothing. A case already deleted is not found on the next run
 * either.
 *
 * Protected by a shared secret. Without one configured it refuses to run in
 * production rather than leaving an unauthenticated endpoint that walks every
 * case record.
 *
 * Scheduled daily at 03:00 by the cron entry in vercel.json. A platform cron
 * issues a GET, so both verbs run the same sweep behind the same check.
 */
export async function GET(request: Request): Promise<Response> {
  return POST(request);
}

export async function POST(request: Request): Promise<Response> {
  // Throttled ahead of the secret check, so a wrong secret cannot be retried in
  // a loop. A cron calls this once a day; six an hour is already generous.
  const limit = check(clientKey(request.headers), policies.sweep);
  if (!limit.allowed) {
    return Response.json(
      { ran: false, reason: "Rate limited." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfter) } },
    );
  }

  // Vercel Cron cannot send a custom header. It sends `Authorization: Bearer
  // $CRON_SECRET`, so that is accepted alongside the manual header.
  const secrets = [process.env.CRON_SECRET, process.env.SWEEP_SECRET].filter(
    (value): value is string => Boolean(value),
  );
  const presented =
    request.headers.get("x-sweep-secret") ??
    request.headers.get("authorization")?.match(/^Bearer (.+)$/)?.[1] ??
    "";

  if (secrets.length === 0) {
    if (process.env.NODE_ENV === "production") {
      return Response.json(
        {
          ran: false,
          reason:
            "Neither CRON_SECRET nor SWEEP_SECRET is configured. The sweep will not run unauthenticated in production.",
        },
        { status: 503 },
      );
    }
  } else if (!secrets.some((secret) => sameSecret(presented, secret))) {
    return Response.json({ ran: false, reason: "Bad secret." }, { status: 401 });
  }

  const retention = await enforceRetention();
  const result = await syncNotifications();

  return Response.json({
    ran: true,
    ...result,
    deletedForRetention: retention.deleted,
    note: "Counts describe notifications, not messages sent. Delivery depends on the channel providers, which report their own status on the operations dashboard.",
  });
}
