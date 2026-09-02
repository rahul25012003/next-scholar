import type { Metadata } from "next";
import { Prohibit, ShieldCheck, WarningDiamond } from "@phosphor-icons/react/ssr";
import { PageHero } from "@/components/marketing/page-hero";
import { Reveal } from "@/components/ui/reveal";
import {
  dataProtection,
  documentIntegrity,
  platformSafeguards,
} from "@/content/policy";
import { permanentDisclaimers } from "@/content/outcomes";
import { lastReviewed } from "@/content/site";

export const metadata: Metadata = {
  title: "Anti fraud and data protection",
  description:
    "Document integrity commitments, the safeguards enforced in the platform itself, and an honest account of what our data protection policy still does not cover.",
};

export default function AntiFraudPolicyPage() {
  return (
    <>
      <PageHero
        title="Anti fraud and data protection"
        lede="Two policies on one page. The first is finished and non negotiable. The second is an unfinished draft, published in that state rather than dressed up as complete."
        aside={
          <div className="rounded-panel border border-line bg-paper p-6">
            <p className="text-[0.8125rem] text-muted">Page last reviewed</p>
            <p className="figures mt-1 text-[1.25rem] font-semibold text-navy-900">
              {lastReviewed}
            </p>
            <p className="mt-3 text-[0.8125rem] leading-relaxed text-muted">
              The data protection half has not been through legal review. The
              open items below are listed as gaps, not as features.
            </p>
          </div>
        }
      />

      <section className="band bg-paper">
        <div className="shell grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <div>
            <h2 className="font-display text-[1.75rem] font-bold text-navy-900">
              Document integrity
            </h2>
            <p className="mt-4 text-[0.9375rem] leading-relaxed text-body">
              {documentIntegrity.intro}
            </p>
          </div>

          <ul className="space-y-px overflow-hidden rounded-panel border border-line">
            {documentIntegrity.commitments.map((commitment) => (
              <li
                key={commitment}
                className="flex gap-3.5 bg-paper px-6 py-5 odd:bg-surface"
              >
                <ShieldCheck
                  size={20}
                  weight="fill"
                  className="mt-0.5 shrink-0 text-blue-600"
                  aria-hidden
                />
                <span className="text-[0.9375rem] leading-relaxed text-ink-soft">
                  {commitment}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="band bg-surface">
        <div className="shell">
          <div className="max-w-2xl">
            <h2 className="font-display text-[1.75rem] font-bold text-navy-900 md:text-[2rem]">
              Enforced in the software, not in a promise
            </h2>
            <p className="mt-4 text-[0.9375rem] leading-relaxed text-body">
              {platformSafeguards.intro}
            </p>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {platformSafeguards.items.map((item, index) => (
              <Reveal key={item} delay={index * 0.05}>
                <div className="flex h-full gap-3.5 rounded-card border border-line bg-paper p-6">
                  <Prohibit
                    size={20}
                    weight="bold"
                    className="mt-0.5 shrink-0 text-navy-700"
                    aria-hidden
                  />
                  <p className="text-[0.9375rem] leading-relaxed text-ink-soft">
                    {item}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="band bg-paper">
        <div className="shell">
          <div className="rounded-panel border border-pending/25 bg-pending-bg/50 p-7 md:p-9">
            <div className="flex items-start gap-3.5">
              <WarningDiamond
                size={22}
                weight="fill"
                className="mt-0.5 shrink-0 text-pending"
                aria-hidden
              />
              <div className="max-w-3xl">
                <h2 className="font-display text-[1.25rem] font-bold text-navy-900">
                  Data protection, in draft
                </h2>
                <p className="mt-3 text-[0.9375rem] leading-relaxed text-ink-soft">
                  {dataProtection.statusNote}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-12 grid gap-12 lg:grid-cols-2 lg:gap-16">
            <div>
              <h3 className="font-display text-[1.25rem] font-bold text-navy-900">
                What we collect
              </h3>
              <p className="mt-3 text-[0.9375rem] leading-relaxed text-body">
                {dataProtection.collected.intro}
              </p>
              <ul className="mt-5 grid gap-2.5 sm:grid-cols-2">
                {dataProtection.collected.items.map((item) => (
                  <li
                    key={item}
                    className="rounded-input bg-surface px-3.5 py-2.5 text-[0.875rem] text-ink-soft"
                  >
                    {item}
                  </li>
                ))}
              </ul>

              <h3 className="mt-10 font-display text-[1.25rem] font-bold text-navy-900">
                Consent
              </h3>
              <p className="mt-3 text-[0.9375rem] leading-relaxed text-body">
                {dataProtection.consent}
              </p>

              <h3 className="mt-10 font-display text-[1.25rem] font-bold text-navy-900">
                Under the DPDP Act 2023
              </h3>
              <ul className="mt-4 divide-y divide-line border-t border-line">
                {dataProtection.dpdpItems.map((item) => (
                  <li key={item} className="py-3 text-[0.9375rem] leading-relaxed text-body">
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-display text-[1.25rem] font-bold text-navy-900">
                What this policy still does not answer
              </h3>
              <p className="mt-3 text-[0.9375rem] leading-relaxed text-body">
                Four gaps. Each one needs a real answer, and a lawyer, before
                the first student document is accepted.
              </p>
              <dl className="mt-6 space-y-5">
                {dataProtection.openItems.map((item) => (
                  <div
                    key={item.title}
                    className="rounded-card border border-line bg-surface p-5"
                  >
                    <dt className="font-display text-[1rem] font-bold text-navy-900">
                      {item.title}
                    </dt>
                    <dd className="mt-2 text-[0.9375rem] leading-relaxed text-body">
                      {item.body}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
      </section>

      <section className="band bg-surface">
        <div className="shell">
          <div className="max-w-3xl">
            <h2 className="font-display text-[1.75rem] font-bold text-navy-900">
              What we never promise
            </h2>
            <ul className="mt-6 divide-y divide-line-strong border-y border-line-strong">
              {permanentDisclaimers.map((line) => (
                <li
                  key={line}
                  className="py-4 text-[1.0625rem] leading-relaxed text-ink-soft"
                >
                  {line}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
