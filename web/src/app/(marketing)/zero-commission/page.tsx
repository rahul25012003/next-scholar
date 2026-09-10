import type { Metadata } from "next";
import Image from "next/image";
import { CheckCircle, Clock } from "@phosphor-icons/react/ssr";
import { PageHero } from "@/components/marketing/page-hero";
import { Reveal } from "@/components/ui/reveal";
import { staggerDelay } from "@/lib/stagger";
import { ButtonLink } from "@/components/ui/button";
import {
  selfApplySteps,
  zeroCommissionEntries,
  zeroCommissionRationale,
} from "@/content/zero-commission";
import { primaryCta } from "@/content/site";

export const metadata: Metadata = {
  title: "Zero commission list",
  description:
    "Universities and systems that pay agents nothing, and how to apply to them directly without paying anyone a commission.",
};

export default function ZeroCommissionPage() {
  return (
    <>
      <PageHero
        title="Where we earn nothing"
        lede="Some universities pay agents no commission at all. You can apply to them yourself, for free, and this page tells you how. It is the cheapest proof we have that the shortlist is not commission driven."
      />

      <section className="band bg-paper">
        <div className="shell">
          <div className="grid gap-5 lg:grid-cols-3">
            {zeroCommissionEntries.map((entry, index) => (
              <Reveal key={entry.destination + entry.headline} delay={staggerDelay(index, 0.07)}>
                <article className="flex h-full flex-col rounded-panel border border-line bg-paper p-7 shadow-card">
                  <div className="flex items-center gap-3">
                    <Image
                      src={`https://flagcdn.com/w80/${entry.flagCode}.png`}
                      alt=""
                      width={40}
                      height={30}
                      className="h-6 w-auto rounded-xs ring-1 ring-line"
                    />
                    <h2 className="font-display text-[1.125rem] font-bold text-navy-900">
                      {entry.destination}
                    </h2>
                    {entry.state === "verified" ? (
                      <span className="ml-auto inline-flex items-center gap-1.5 rounded-input bg-verified-bg px-2.5 py-1 text-[0.6875rem] font-medium text-verified">
                        <CheckCircle size={13} weight="fill" aria-hidden />
                        Verified
                      </span>
                    ) : (
                      <span className="ml-auto inline-flex items-center gap-1.5 rounded-input bg-pending-bg px-2.5 py-1 text-[0.6875rem] font-medium text-pending">
                        <Clock size={13} weight="fill" aria-hidden />
                        Not ready
                      </span>
                    )}
                  </div>

                  <h3 className="mt-5 font-display text-[1.0625rem] font-bold leading-snug text-navy-900">
                    {entry.headline}
                  </h3>
                  <p className="mt-3 flex-1 text-[0.9375rem] leading-relaxed text-body">
                    {entry.body}
                  </p>
                  {entry.ourFee && (
                    <p className="mt-5 rounded-card bg-surface p-4 text-[0.875rem] leading-relaxed text-ink-soft">
                      {entry.ourFee}
                    </p>
                  )}
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="band bg-surface">
        <div className="shell">
          <div className="max-w-2xl">
            <h2 className="font-display text-3xl font-bold text-navy-900 md:text-[2.25rem]">
              How to apply without us
            </h2>
            <p className="mt-5 text-[1.0625rem] leading-relaxed text-body">
              Five steps. None of them need a consultancy, and the last one is
              the only place a fee is worth paying.
            </p>
          </div>

          <ol className="mt-12 grid gap-x-10 gap-y-8 md:grid-cols-2 lg:grid-cols-3">
            {selfApplySteps.map((step, index) => (
              <Reveal key={step.title} delay={staggerDelay(index, 0.05)} as="li">
                <div className="border-t border-line-strong pt-5">
                  <h3 className="font-display text-[1.0625rem] font-bold leading-snug text-navy-900">
                    {step.title}
                  </h3>
                  <p className="mt-2.5 text-[0.9375rem] leading-relaxed text-body">
                    {step.body}
                  </p>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      <section className="band bg-paper">
        <div className="shell">
          <div className="rounded-panel bg-navy-900 px-7 py-11 text-white md:px-12 md:py-14">
            <div className="max-w-3xl">
              <h2 className="font-display text-[1.75rem] font-bold text-white md:text-[2rem]">
                Why publish a page that costs us money
              </h2>
              <p className="mt-5 text-[1.0625rem] leading-relaxed text-white/75">
                {zeroCommissionRationale}
              </p>
              <div className="mt-9 flex flex-wrap gap-3">
                <ButtonLink
                  href={primaryCta.href}
                  size="lg"
                  className="bg-white text-navy-900 hover:bg-blue-100"
                >
                  {primaryCta.label}
                </ButtonLink>
                <ButtonLink
                  href="/open-ledger"
                  size="lg"
                  variant="outline"
                  className="border-white/25 bg-transparent text-white hover:border-white hover:text-white"
                >
                  Read the Open Ledger
                </ButtonLink>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
