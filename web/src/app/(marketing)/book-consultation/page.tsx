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
            <div className="bg-white p-5">
              <dt className="text-[0.8125rem] text-grey">Length</dt>
              <dd className="figures mt-1.5 text-[1.375rem] font-semibold text-blue-dark">
                {consultation.duration}
              </dd>
            </div>
            <div className="bg-white p-5">
              <dt className="text-[0.8125rem] text-grey">Fee</dt>
              <dd className="figures mt-1.5 text-[1.375rem] font-semibold text-blue-dark">
                {consultation.price}
              </dd>
              <dd className="mt-1.5 text-[0.75rem] leading-snug text-grey">
                {consultation.creditNote}
              </dd>
            </div>
          </dl>
        }
      />

      <section className="band">
        <div className="shell grid gap-12 lg:grid-cols-[1fr_1.15fr] lg:gap-16">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <div className="rounded-panel border border-blue-dark/20 bg-light/60 p-6">
              <div className="flex items-start gap-3">
                <Info size={20} weight="fill" className="mt-0.5 shrink-0 text-pink" aria-hidden />
                <div>
                  <h2 className="text-blue-dark h--6">
                    This form cannot book you a slot yet
                  </h2>
                  <p className="mt-2 text-[0.9375rem] leading-relaxed text-grey">
                    Scheduling and payment are not connected, and no personal
                    detail is stored anywhere until the data protection work is
                    finished. Fill this in to see the questions the call will
                    actually cover, and keep your answers.
                  </p>
                  <ul className="mt-4 space-y-1.5">
                    {bookingIntegration.needed.map((item) => (
                      <li key={item} className="text-[0.8125rem] leading-relaxed text-grey">
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <h2 className="text-blue-dark h--5">
                What the call produces
              </h2>
              <p className="mt-3 text-[0.9375rem] leading-relaxed text-grey">
                {consultationStage.deliverable}
              </p>
              <p className="mt-4 text-[0.9375rem] leading-relaxed text-grey">
                {consultation.includesUncomfortable}
              </p>
            </div>
          </div>

          <div>
            <h2 className="text-blue-dark">
              The six questions
            </h2>
            <p className="mt-3 text-[0.9375rem] leading-relaxed text-grey">
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
