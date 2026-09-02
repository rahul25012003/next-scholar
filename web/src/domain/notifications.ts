import type { Priority } from "./case";
import type { EventType, LifecycleEvent } from "./events";
import { channelAllowed, type ChannelConsent, type ContactChannel } from "./consent";

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
const optInChannels: Channel[] = ["whatsapp", "email"];

export function planNotifications(
  events: LifecycleEvent[],
  existing: Notification[],
  channelConsents: ChannelConsent[] = [],
  now = new Date(),
): Notification[] {
  const open = new Set(
    existing.filter((item) => !item.resolvedAt).map((item) => `${item.eventKey}:${item.channel}`),
  );

  const planned: Notification[] = [];
  for (const event of events) {
    const channels: Channel[] = ["in_app", ...(extraChannels[event.type] ?? [])];
    for (const channel of channels) {
      // A messaging channel needs a recorded opt in. No consent, no message.
      if (
        optInChannels.includes(channel) &&
        !channelAllowed(channelConsents, event.caseId, channel as ContactChannel)
      ) {
        continue;
      }

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

/**
 * The escalating part of an escalating reminder sequence.
 *
 * A deadline crosses thirty days, then fourteen, then three, and the event's
 * priority rises each time while its key stays the same. Dedupe alone would
 * mean one Normal priority message at thirty days and silence afterwards, which
 * is the opposite of a sequence. An open notification whose event has become
 * more urgent is updated and re-queued for delivery.
 */
export function escalateOpen(
  existing: Notification[],
  events: LifecycleEvent[],
  now = new Date(),
): { next: Notification[]; escalated: number } {
  const rank: Record<Priority, number> = { Normal: 0, High: 1, Urgent: 2 };
  const byKey = new Map(events.map((event) => [event.key, event]));
  let escalated = 0;

  const next = existing.map((item) => {
    if (item.resolvedAt) return item;
    const event = byKey.get(item.eventKey);
    if (!event || rank[event.priority] <= rank[item.priority]) return item;

    escalated += 1;
    return {
      ...item,
      priority: event.priority,
      body: bodyFor(event, item.channel),
      deliveryStatus: "queued" as const,
      createdAt: now.toISOString(),
    };
  });

  return { next, escalated };
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
