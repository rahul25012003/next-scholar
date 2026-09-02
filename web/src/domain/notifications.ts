import type { Priority } from "./case";
import type { EventType, LifecycleEvent } from "./events";

export type Channel =
  | "in_app"
  | "email"
  | "whatsapp"
  | "counselor_alert"
  | "manager_escalation";

export type DeliveryStatus = "queued" | "sent" | "delivered" | "failed" | "retried";

export type Notification = {
  id: string;
  /** Same value as the event key, which is what makes dedupe work. */
  eventKey: string;
  caseId: string;
  type: EventType;
  priority: Priority;
  channel: Channel;
  deliveryStatus: DeliveryStatus;
  body: string;
  createdAt: string;
  resolvedAt: string | null;
  source: "system";
};

/**
 * In app is the system of record and always fires. Everything else is an
 * additional attempt that may fail without losing the notification.
 */
const extraChannels: Record<EventType, Channel[]> = {
  deadline: ["whatsapp", "counselor_alert"],
  expiry: ["whatsapp", "counselor_alert"],
  missing_doc: ["email", "counselor_alert"],
  university_delay: ["counselor_alert"],
  stagnation: ["counselor_alert"],
  inactivity: ["whatsapp", "counselor_alert"],
  followup_due: ["counselor_alert"],
  sla_breach: ["counselor_alert"],
  escalation: ["manager_escalation", "email"],
};

/**
 * WhatsApp carries reminders and nudges only. The body is built from these
 * templates rather than from event detail text, so a document status or a
 * financial figure cannot reach the channel even by accident.
 */
const whatsappTemplates: Partial<Record<EventType, string>> = {
  deadline: "A deadline on your Next Scholar application is close. Open your portal for the details.",
  expiry: "A document on your file is close to expiry. Open your portal for the details.",
  inactivity: "Your counselor is waiting to hear from you. Open your portal when you can.",
};

export function bodyFor(event: LifecycleEvent, channel: Channel): string {
  if (channel === "whatsapp") {
    return (
      whatsappTemplates[event.type] ??
      "There is an update on your Next Scholar application. Open your portal for the details."
    );
  }
  return `${event.title}. ${event.detail}`;
}

/**
 * One active notification per underlying event, updated rather than recreated.
 * Re-running detection on an unchanged case produces no new rows.
 */
export function planNotifications(
  events: LifecycleEvent[],
  existing: Notification[],
  now = new Date(),
): Notification[] {
  const open = new Set(
    existing.filter((item) => !item.resolvedAt).map((item) => `${item.eventKey}:${item.channel}`),
  );

  const planned: Notification[] = [];
  for (const event of events) {
    const channels: Channel[] = ["in_app", ...(extraChannels[event.type] ?? [])];
    for (const channel of channels) {
      const dedupeKey = `${event.key}:${channel}`;
      if (open.has(dedupeKey)) continue;
      planned.push({
        id: dedupeKey,
        eventKey: event.key,
        caseId: event.caseId,
        type: event.type,
        priority: event.priority,
        channel,
        deliveryStatus: "queued",
        body: bodyFor(event, channel),
        createdAt: now.toISOString(),
        resolvedAt: null,
        source: "system",
      });
    }
  }
  return planned;
}

/** Notifications whose underlying event has cleared are resolved, not deleted. */
export function resolveStale(
  existing: Notification[],
  events: LifecycleEvent[],
  now = new Date(),
): Notification[] {
  const live = new Set(events.map((event) => event.key));
  return existing.map((item) =>
    item.resolvedAt || live.has(item.eventKey)
      ? item
      : { ...item, resolvedAt: now.toISOString() },
  );
}

export type ProviderStatus = {
  channel: Channel;
  configured: boolean;
  requirement: string;
};

/**
 * Delivery providers are not connected. Rather than logging a pretend send, the
 * queue reports which channel is unavailable and why, and the in app record
 * still exists so nothing is silently dropped.
 */
export function providerStatus(): ProviderStatus[] {
  return [
    { channel: "in_app", configured: true, requirement: "Rendered from the case record" },
    {
      channel: "email",
      configured: Boolean(process.env.TRANSACTIONAL_EMAIL_KEY),
      requirement: "TRANSACTIONAL_EMAIL_KEY, plus a verified sending domain",
    },
    {
      channel: "whatsapp",
      configured: Boolean(process.env.WHATSAPP_BUSINESS_TOKEN),
      requirement: "WHATSAPP_BUSINESS_TOKEN, approved templates, and a recorded opt in per student",
    },
    {
      channel: "counselor_alert",
      configured: true,
      requirement: "Rendered on the console dashboard",
    },
    {
      channel: "manager_escalation",
      configured: true,
      requirement: "Rendered on the operations dashboard",
    },
  ];
}
