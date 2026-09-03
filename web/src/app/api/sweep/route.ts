import { syncNotifications } from "@/data/store";
import { check, clientKey, policies } from "@/domain/rate-limit";

/**
 * The scheduled sweep. A cron hits this, it runs detection across every case,
 * queues what is new and resolves what has cleared.
 *
 * It is safe to call twice: detection reads stored values only, and the
 * notification planner dedupes on the event key, so a repeat run on unchanged
 * state queues nothing.
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

  const configured = process.env.SWEEP_SECRET;

  if (!configured) {
    if (process.env.NODE_ENV === "production") {
      return Response.json(
        {
          ran: false,
          reason:
            "SWEEP_SECRET is not configured. The sweep will not run unauthenticated in production.",
        },
        { status: 503 },
      );
    }
  } else if (request.headers.get("x-sweep-secret") !== configured) {
    return Response.json({ ran: false, reason: "Bad secret." }, { status: 401 });
  }

  const result = await syncNotifications();

  return Response.json({
    ran: true,
    ...result,
    note: "Counts describe notifications, not messages sent. Delivery depends on the channel providers, which report their own status on the operations dashboard.",
  });
}
