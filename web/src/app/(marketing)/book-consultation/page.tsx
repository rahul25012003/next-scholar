import type { Metadata } from "next";
import { Info } from "@phosphor-icons/react/ssr";
import { PageHero } from "@/components/marketing/page-hero";
import { IntakeForm } from "@/components/marketing/intake-form";
import { bookingIntegration, consultation } from "@/content/consultation";
import { stages } from "@/content/process";

export const metadata: Metadata = {
  title: "Book a consultation",
  description:
    "A 45 minute paid consultation, ₹1,500, credited in full against the service fee. Six questions, then a written assessment within 24 hours.",
};

export default function BookConsultationPage() {
  const consultationStage = stages[0];

  return (
    <>
      <PageHero
        title="Book a consultation"
        lede="Forty five minutes, structured around six questions. Within 24 hours you get a written assessment with two or three ranked destinations, the reasoning, and the risks attached to each."
        aside={
          <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-panel border border-line bg-line">
            <div className="bg-paper p-5">
              <dt className="text-[0.8125rem] text-muted">Length</dt>
              <dd className="figures mt-1.5 text-[1.375rem] font-semibold text-navy-900">
                {consultation.duration}
              </dd>
            </div>
            <div className="bg-paper p-5">
              <dt className="text-[0.8125rem] text-muted">Fee</dt>
              <dd className="figures mt-1.5 text-[1.375rem] font-semibold text-navy-900">
                {consultation.price}
              </dd>
              <dd className="mt-1.5 text-[0.75rem] leading-snug text-muted">
                {consultation.creditNote}
              </dd>
            </div>
          </dl>
        }
      />

      <section className="band bg-paper">
        <div className="shell grid gap-12 lg:grid-cols-[1fr_1.15fr] lg:gap-16">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <div className="rounded-panel border border-blue-600/20 bg-blue-50/60 p-6">
              <div className="flex items-start gap-3">
                <Info size={20} weight="fill" className="mt-0.5 shrink-0 text-blue-600" aria-hidden />
                <div>
                  <h2 className="font-display text-[1.0625rem] font-bold text-navy-900">
                    This form cannot book you a slot yet
                  </h2>
                  <p className="mt-2 text-[0.9375rem] leading-relaxed text-ink-soft">
                    Scheduling and payment are not connected, and no personal
                    detail is stored anywhere until the data protection work is
                    finished. Fill this in to see the questions the call will
                    actually cover, and keep your answers.
                  </p>
                  <ul className="mt-4 space-y-1.5">
                    {bookingIntegration.needed.map((item) => (
                      <li key={item} className="text-[0.8125rem] leading-relaxed text-body">
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <h2 className="font-display text-[1.25rem] font-bold text-navy-900">
                What the call produces
              </h2>
              <p className="mt-3 text-[0.9375rem] leading-relaxed text-body">
                {consultationStage.deliverable}
              </p>
              <p className="mt-4 text-[0.9375rem] leading-relaxed text-body">
                {consultation.includesUncomfortable}
              </p>
            </div>
          </div>

          <div>
            <h2 className="font-display text-[1.5rem] font-bold text-navy-900">
              The six questions
            </h2>
            <p className="mt-3 text-[0.9375rem] leading-relaxed text-body">
              Asked in this order, on the call and here. The last one matters
              more than it looks.
            </p>
            <div className="mt-8">
              <IntakeForm />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
