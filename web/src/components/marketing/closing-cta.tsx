import { ButtonLink } from "@/components/ui/button";
import { bookingIntegration, consultation } from "@/content/consultation";
import { primaryCta } from "@/content/site";

export function ClosingCta() {
  return (
    <section className="band bg-paper">
      <div className="shell">
        <div className="grid gap-10 rounded-panel border border-line bg-surface px-7 py-11 md:px-12 md:py-14 lg:grid-cols-[1.2fr_1fr] lg:items-center lg:gap-16">
          <div>
            <h2 className="font-display text-3xl font-bold text-navy-900 md:text-[2.25rem]">
              Start with 45 paid minutes
            </h2>
            <p className="mt-5 max-w-xl text-[1.0625rem] leading-relaxed text-body">
              {consultation.price} for the call, {consultation.creditNote.toLowerCase()}{" "}
              {consultation.promise}
            </p>
            <p className="mt-4 max-w-xl text-[0.9375rem] leading-relaxed text-muted">
              {consultation.includesUncomfortable}
            </p>
          </div>

          <div className="lg:justify-self-end">
            <ButtonLink href={primaryCta.href} size="lg" className="w-full sm:w-auto">
              {primaryCta.label}
            </ButtonLink>
            {!bookingIntegration.live && (
              <p className="mt-4 max-w-xs text-[0.8125rem] leading-relaxed text-muted">
                Scheduling and payment are not connected yet. The form records
                your request and answers, and says so on the page.
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
