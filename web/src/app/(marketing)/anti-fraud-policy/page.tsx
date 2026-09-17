import type { Metadata } from "next";
import { Prohibit, ShieldCheck, WarningDiamond } from "@phosphor-icons/react/ssr";
import { PageHero } from "@/components/marketing/page-hero";
import { Reveal } from "@/components/ui/reveal";
import { staggerDelay } from "@/lib/stagger";
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
          <div className="rounded-panel border border-line bg-white p-6">
            <p className="text-[0.8125rem] text-grey">Page last reviewed</p>
            <p className="figures mt-1 text-[1.25rem] font-semibold text-blue-dark">
              {lastReviewed}
            </p>
            <p className="mt-3 text-[0.8125rem] leading-relaxed text-grey">
              The data protection half has not been through legal review. The
              open items below are listed as gaps, not as features.
            </p>
          </div>
        }
      />

      <section className="band">
        <div className="shell grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <div>
            <h2 className="text-blue-dark">
              Document integrity
            </h2>
            <p className="mt-4 text-[0.9375rem] leading-relaxed text-grey">
              {documentIntegrity.intro}
            </p>
          </div>

          <ul className="space-y-px overflow-hidden rounded-panel border border-line">
            {documentIntegrity.commitments.map((commitment) => (
              <li
                key={commitment}
                className="flex gap-3.5 bg-white px-6 py-5 odd:bg-light"
              >
                <ShieldCheck
                  size={20}
                  weight="fill"
                  className="mt-0.5 shrink-0 text-pink"
                  aria-hidden
                />
                <span className="text-[0.9375rem] leading-relaxed text-grey">
                  {commitment}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="band">
        <div className="shell">
          <div className="max-w-2xl">
            <h2 className="text-blue-dark">
              Enforced in the software, not in a promise
            </h2>
            <p className="mt-4 text-[0.9375rem] leading-relaxed text-grey">
              {platformSafeguards.intro}
            </p>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {platformSafeguards.items.map((item, index) => (
              <Reveal key={item} delay={staggerDelay(index, 0.05)}>
                <div className="flex h-full gap-3.5 rounded-card border border-line bg-white p-6">
                  <Prohibit
                    size={20}
                    weight="bold"
                    className="mt-0.5 shrink-0 text-blue-tint"
                    aria-hidden
                  />
                  <p className="text-[0.9375rem] leading-relaxed text-grey">
                    {item}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="band">
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
                <h2 className="text-blue-dark h--5">
                  Data protection, in draft
                </h2>
                <p className="mt-3 text-[0.9375rem] leading-relaxed text-grey">
                  {dataProtection.statusNote}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-12 grid gap-12 lg:grid-cols-2 lg:gap-16">
            <div>
              <h3 className="text-blue-dark h--5">
                What we collect
              </h3>
              <p className="mt-3 text-[0.9375rem] leading-relaxed text-grey">
                {dataProtection.collected.intro}
              </p>
              <ul className="mt-5 grid gap-2.5 sm:grid-cols-2">
                {dataProtection.collected.items.map((item) => (
                  <li
                    key={item}
                    className="rounded-card bg-light px-3.5 py-2.5 text-[0.875rem] text-grey"
                  >
                    {item}
                  </li>
                ))}
              </ul>

              <h3 className="mt-10 text-blue-dark h--5">
                Consent
              </h3>
              <p className="mt-3 text-[0.9375rem] leading-relaxed text-grey">
                {dataProtection.consent}
              </p>

              <h3 className="mt-10 text-blue-dark h--5">
                Under the DPDP Act 2023
              </h3>
              <ul className="mt-4 divide-y divide-line border-t border-line">
                {dataProtection.dpdpItems.map((item) => (
                  <li key={item} className="py-3 text-[0.9375rem] leading-relaxed text-grey">
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-blue-dark h--5">
                What this policy still does not answer
              </h3>
              <p className="mt-3 text-[0.9375rem] leading-relaxed text-grey">
                Four gaps. Each one needs a real answer, and a lawyer, before
                the first student document is accepted.
              </p>
              <dl className="mt-6 space-y-5">
                {dataProtection.openItems.map((item) => (
                  <div
                    key={item.title}
                    className="rounded-card border border-line bg-light p-5"
                  >
                    <dt className="font-display font-bold text-blue-dark">
                      {item.title}
                    </dt>
                    <dd className="mt-2 text-[0.9375rem] leading-relaxed text-grey">
                      {item.body}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
      </section>

      <section className="band">
        <div className="shell">
          <div className="max-w-3xl">
            <h2 className="text-blue-dark">
              What we never promise
            </h2>
            <ul className="mt-6 divide-y divide-line-strong border-y border-line-strong">
              {permanentDisclaimers.map((line) => (
                <li
                  key={line}
                  className="py-4 leading-relaxed text-grey"
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
