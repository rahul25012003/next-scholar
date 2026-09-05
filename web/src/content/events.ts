import type { Measured } from "@/content/types";

/**
 * Events and webinars.
 *
 * Empty today because none is scheduled. A live registration counter is a
 * `Measured<number>`, the same shape used elsewhere on this site for a fact
 * that does not exist yet: `state: "pending"` with a reason, never a plausible
 * looking placeholder count. The benchmark this list was audited against runs
 * counters that never move, which is the specific thing this shape prevents.
 */

export type EventFormat = "online" | "in-person";

export type EventItem = {
  slug: string;
  title: string;
  /** A guide slug, or "all" for something not specific to one destination. */
  destination: string;
  startsAt: string;
  format: EventFormat;
  /** City, only set when the format is in-person. */
  city?: string;
  summary: string;
  registrationUrl: string | null;
  registeredCount: Measured<number>;
};

export const events: EventItem[] = [];

export function upcomingEvents(now = new Date(), list: EventItem[] = events): EventItem[] {
  return list
    .filter((event) => new Date(event.startsAt).getTime() >= now.getTime())
    .sort((a, b) => a.startsAt.localeCompare(b.startsAt));
}

export function pastEvents(now = new Date(), list: EventItem[] = events): EventItem[] {
  return list
    .filter((event) => new Date(event.startsAt).getTime() < now.getTime())
    .sort((a, b) => b.startsAt.localeCompare(a.startsAt));
}

export const eventsScope = {
  note: "Nothing is scheduled yet. When something is, it appears here with a real registration link, and a registered count only once one exists to report.",
};
