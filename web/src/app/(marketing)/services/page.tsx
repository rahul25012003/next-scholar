import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle, Prohibit } from "@phosphor-icons/react/ssr";
import { services, servicesIntro, type Availability, type Remuneration } from "@/content/services";
import { PageHero } from "@/components/marketing/page-hero";
import { Reveal } from "@/components/ui/reveal";
import { staggerDelay } from "@/lib/stagger";
import { ButtonLink } from "@/components/ui/button";
import { primaryCta } from "@/content/site";
import { cn } from "@/lib/cn";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Everything we do, what each service costs you and what we earn on it. No hidden referral fees, and nothing shown as bookable when it is not.",
  alternates: { canonical: "/services" },
};

const groups = [
  "Before you commit",
  "The engagement",
  "Specific help",
  "Introductions",
] as const;

const groupBlurb: Record<(typeof groups)[number], string> = {
  "Before you commit":
    "Two services, and one is free. Neither ties you to anything afterwards.",
  "The engagement": "The full service, on a signed agreement that sets out the scope in writing.",
  "Specific help": "Specific pieces of work inside an engagement, each with a clear result.",
  Introductions:
    "Nobody pays us for any of these introductions today. If that changes, the figure will appear here before the introduction is made.",
};

export default function ServicesPage() {
  return (
    <>
      <PageHero
        title={servicesIntro.headline}
        lede={servicesIntro.lede}
        aside={
          <div className="rounded-panel border border-line bg-white p-6">
            <p className="text-[0.8125rem] font-semibold text-blue-dark">
              The four rules on this page
            </p>
            <ul className="mt-3 space-y-2.5">
              {servicesIntro.rules.map((rule) => (
                <li key={rule} className="text-[0.875rem] leading-relaxed text-grey">
                  {rule}
                </li>
              ))}
            </ul>
          </div>
        }
      />

      <section className="band">
        <div className="shell space-y-14">
          {groups.map((group) => {
            const rows = services.filter((service) => service.group === group);
            if (rows.length === 0) return null;
            return (
              <div key={group}>
                <h2 className="text-blue-dark">
                  {group}
                </h2>
                <p className="mt-2 max-w-2xl text-[0.9375rem] leading-relaxed text-grey">
                  {groupBlurb[group]}
                </p>

                <div className="mt-7 grid gap-5 lg:grid-cols-2">
                  {rows.map((service, index) => (
                    <Reveal key={service.slug} delay={staggerDelay(index, 0.05)}>
                      <article
                        id={service.slug}
                        className="flex h-full scroll-mt-24 flex-col rounded-panel border border-line bg-white p-7"
                      >
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <h3 className="text-blue-dark h--5">
                            {service.name}
                          </h3>
                          <AvailabilityChip availability={service.availability} />
                        </div>

                        <p className="mt-3 text-[0.9375rem] leading-relaxed text-grey">
                          {service.summary}
                        </p>

                        <div className="mt-5">
                          <h4 className="eyebrow text-grey">
                            What you get
                          </h4>
                          <ul className="mt-2.5 space-y-2">
                            {service.includes.map((item) => (
                              <li
                                key={item}
                                className="flex gap-2.5 text-[0.875rem] leading-relaxed text-grey"
                              >
                                <CheckCircle
                                  size={15}
                                  weight="fill"
                                  aria-hidden
                                  className="mt-0.5 shrink-0 text-verified"
                                />
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="mt-5">
                          <h4 className="eyebrow text-grey">
                            What it is not
                          </h4>
                          <ul className="mt-2.5 space-y-2">
                            {service.excludes.map((item) => (
                              <li
                                key={item}
                                className="flex gap-2.5 text-[0.875rem] leading-relaxed text-grey"
                              >
                                <Prohibit
                                  size={15}
                                  weight="fill"
                                  aria-hidden
                                  className="mt-0.5 shrink-0 text-grey"
                                />
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="mt-6 flex-1" />

                        <RemunerationBlock remuneration={service.remuneration} />

                        <p className="mt-3 text-[0.8125rem] leading-relaxed text-grey">
                          {service.availability.detail}
                        </p>

                        {service.cta && (
                          <ButtonLink href={service.cta.href} variant="outline" className="mt-4 self-start">
                            {service.cta.label}
                          </ButtonLink>
                        )}
                      </article>
                    </Reveal>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="band">
        <div className="shell max-w-3xl">
          <h2 className="text-blue-dark">
            Why the loan section says we earn nothing
          </h2>
          <p className="mt-5 leading-relaxed text-grey">
            Loan referrals are among the most reliably paid in this industry, and almost
            nobody publishes the figure. A consultancy secretly paid by the lender it
            recommends is selling you a loan, not advising you.
          </p>
          <p className="mt-4 leading-relaxed text-grey">
            We take nothing from any lender today. If that changes, the figure will appear
            here and wherever the lender is named, before any introduction is made.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink href={primaryCta.href} size="lg">
              {primaryCta.label}
            </ButtonLink>
            <ButtonLink href="/open-ledger" variant="outline" size="lg">
              What we earn from universities
            </ButtonLink>
          </div>
          <p className="mt-8 text-[0.875rem] leading-relaxed text-grey">
            Fees, refunds and cancellation windows are on the{" "}
            <Link href="/refund-policy" className="font-medium text-pink hover:text-blue-dark">
              refund policy
            </Link>
            . What governs an engagement is in the{" "}
            <Link href="/terms" className="font-medium text-pink hover:text-blue-dark">
              terms of use
            </Link>
            , and the bodies we are not affiliated with are named on the{" "}
            <Link
              href="/non-affiliation"
              className="font-medium text-pink hover:text-blue-dark"
            >
              non affiliation disclaimer
            </Link>
            .
          </p>
        </div>
      </section>
    </>
  );
}

function AvailabilityChip({ availability }: { availability: Availability }) {
  const label =
    availability.state === "live"
      ? "Available now"
      : availability.state === "with-engagement"
        ? "Inside an engagement"
        : "Not running yet";
  return (
    <span
      className={cn(
        "shrink-0 rounded-input px-2.5 py-1 text-[0.6875rem] font-medium",
        availability.state === "live"
          ? "bg-verified-bg text-verified"
          : availability.state === "with-engagement"
            ? "bg-neutral-chip-bg text-neutral-chip"
            : "bg-pending-bg text-pending",
      )}
    >
      {label}
    </span>
  );
}

function RemunerationBlock({ remuneration }: { remuneration: Remuneration }) {
  const headline =
    remuneration.kind === "none"
      ? "We earn nothing on this"
      : remuneration.kind === "client-fee"
        ? `You pay: ${remuneration.price}`
        : `A partner pays us: ${remuneration.weEarn}`;

  return (
    <div
      className={cn(
        "rounded-card p-4",
        remuneration.kind === "referral" ? "bg-pending-bg" : "bg-light",
      )}
    >
      <p
        className={cn(
          "text-[0.875rem] font-semibold",
          remuneration.kind === "referral" ? "text-pending" : "text-blue-dark",
        )}
      >
        {headline}
      </p>
      <p className="mt-1.5 text-[0.8125rem] leading-relaxed text-grey">
        {remuneration.detail}
      </p>
    </div>
  );
}
