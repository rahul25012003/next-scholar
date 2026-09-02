import { syncNotifications } from "@/data/store";

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
 */
export async function POST(request: Request): Promise<Response> {
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
