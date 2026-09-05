import type { Metadata } from "next";
import { guides } from "@/content/guides";
import { eventsScope, pastEvents, upcomingEvents } from "@/content/events";
import { PageHero } from "@/components/marketing/page-hero";
import { ButtonLink } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Events and webinars",
  description:
    "Nothing invented while nothing is scheduled: a live registration count appears only once a real one exists to report.",
  alternates: { canonical: "/events" },
};

export default function EventsPage() {
  const upcoming = upcomingEvents();
  const past = pastEvents();

  return (
    <>
      <PageHero
        title="Events and webinars"
        lede="Nothing is scheduled today. When something is, it appears here with a real registration link and, once registrations exist, a real count rather than one that starts at a plausible-looking number and never moves."
      />

      <section className="band bg-paper">
        <div className="shell">
          <p className="max-w-2xl text-[0.9375rem] leading-relaxed text-body">
            {eventsScope.note}
          </p>

          {upcoming.length === 0 ? (
            <div className="mt-8 rounded-panel border border-dashed border-line-strong bg-surface p-8">
              <h2 className="font-display text-[1.125rem] font-bold text-navy-900">
                Nothing scheduled
              </h2>
              <p className="mt-2 max-w-2xl text-[0.9375rem] leading-relaxed text-body">
                No webinar or in-person session is booked at the moment. Every guide and
                every calculator on this site works without one.
              </p>
              <ButtonLink href="/book-consultation" className="mt-6">
                Book a consultation instead
              </ButtonLink>
            </div>
          ) : (
            <ul className="mt-8 grid gap-5 md:grid-cols-2">
              {upcoming.map((event) => {
                const guide = guides.find((item) => item.slug === event.destination);
                return (
                  <li key={event.slug} className="rounded-panel border border-line bg-paper p-6">
                    <h2 className="font-display text-[1.0625rem] font-bold text-navy-900">
                      {event.title}
                    </h2>
                    <p className="mt-1 text-[0.8125rem] text-muted">
                      {guide?.country ?? "All destinations"} ·{" "}
                      {event.format === "online" ? "Online" : event.city ?? "In person"}
                    </p>
                    <p className="mt-3 text-[0.9375rem] leading-relaxed text-body">
                      {event.summary}
                    </p>
                    <p className="figures mt-3 text-[0.875rem] font-medium text-navy-900">
                      {new Date(event.startsAt).toLocaleString("en-IN", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </p>
                    <p className="mt-1 text-[0.8125rem] text-muted">
                      {event.registeredCount.state === "measured"
                        ? `${event.registeredCount.value} registered as of ${event.registeredCount.asOf}`
                        : event.registeredCount.reason}
                    </p>
                    {event.registrationUrl && (
                      <ButtonLink href={event.registrationUrl as never} className="mt-4">
                        Register
                      </ButtonLink>
                    )}
                  </li>
                );
              })}
            </ul>
          )}

          {past.length > 0 && (
            <div className="mt-12 border-t border-line pt-8">
              <h2 className="text-[0.75rem] font-semibold uppercase tracking-wide text-muted">
                Past
              </h2>
              <ul className="mt-4 space-y-2">
                {past.map((event) => (
                  <li key={event.slug} className="text-[0.9375rem] text-body">
                    {event.title} —{" "}
                    <span className="figures text-muted">
                      {new Date(event.startsAt).toLocaleDateString("en-IN", { dateStyle: "medium" })}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
