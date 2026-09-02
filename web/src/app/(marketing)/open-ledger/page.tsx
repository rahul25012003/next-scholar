import type { Metadata } from "next";
import { WarningDiamond } from "@phosphor-icons/react/ssr";
import { PageHero } from "@/components/marketing/page-hero";
import { StatusChip } from "@/components/ui/chip";
import { Reveal } from "@/components/ui/reveal";
import { ButtonLink } from "@/components/ui/button";
import {
  disclosureFallbacks,
  ledgerMethodology,
  ledgerRows,
} from "@/content/ledger";
import { SOURCE_LABEL, isPublishable } from "@/content/types";
import type { VerificationStatus } from "@/content/types";
import { primaryCta } from "@/content/site";

export const metadata: Metadata = {
  title: "Open Ledger",
  description:
    "What Next Scholar earns from every university it recommends, with the source, the verification date and the status of each figure.",
};

const statusOrder: VerificationStatus[] = [
  "unverified",
  "outreach-sent",
  "permission-pending",
  "permission-denied",
  "verified-publishable",
  "verified-band-only",
  "disputed",
];

const statusExplainer: Record<VerificationStatus, string> = {
  unverified: "A market typical estimate. Never shown as confirmed, never published as an exact figure.",
  "outreach-sent": "A written permission request has gone to the university or aggregator.",
  "permission-pending": "They have the request and have not answered yet.",
  "permission-denied": "The figure is confirmed to us. They declined public disclosure of the amount.",
  "verified-publishable": "Confirmed in writing and cleared to publish as an exact figure.",
  "verified-band-only": "Confirmed in writing. Only a range may be published, at their request.",
  disputed: "A figure we believed correct is contested. Frozen from publication while it is resolved.",
};

export default function OpenLedgerPage() {
  const verifiedCount = ledgerRows.filter((row) => isPublishable(row.status)).length;

  return (
    <>
      <PageHero
        title="The Open Ledger"
        lede="Every commission Next Scholar earns, per university relationship, with the evidence behind it and the date it was last confirmed. Including the relationships that pay us nothing."
        aside={
          <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-panel border border-line bg-line">
            <div className="bg-paper p-5">
              <dt className="text-[0.8125rem] text-muted">Rows published</dt>
              <dd className="figures mt-1.5 text-2xl font-semibold text-navy-900">
                {ledgerRows.length}
              </dd>
            </div>
            <div className="bg-paper p-5">
              <dt className="text-[0.8125rem] text-muted">Verified so far</dt>
              <dd className="figures mt-1.5 text-2xl font-semibold text-navy-900">
                {verifiedCount}
              </dd>
            </div>
          </dl>
        }
      />

      <section className="band bg-paper">
        <div className="shell">
          <Reveal>
            <div className="rounded-panel border border-pending/25 bg-pending-bg/50 p-7 md:p-9">
              <div className="flex items-start gap-3.5">
                <WarningDiamond
                  size={22}
                  weight="fill"
                  className="mt-0.5 shrink-0 text-pending"
                  aria-hidden
                />
                <div>
                  <h2 className="font-display text-[1.25rem] font-bold text-navy-900">
                    Read this before the table
                  </h2>
                  <p className="mt-3 max-w-3xl text-[0.9375rem] leading-relaxed text-ink-soft">
                    {ledgerMethodology.blocker}
                  </p>
                </div>
              </div>
            </div>
          </Reveal>

          <div className="mt-12 overflow-x-auto">
            <table className="w-full min-w-[56rem] border-collapse text-left">
              <caption className="sr-only">
                Commission, client fee and verification status per university
                relationship
              </caption>
              <thead>
                <tr className="border-b border-line-strong">
                  {[
                    "Relationship",
                    "Contract",
                    "We earn",
                    "You pay us",
                    "Source",
                    "Verified",
                    "Status",
                  ].map((heading) => (
                    <th
                      key={heading}
                      scope="col"
                      className="pb-3 pr-6 text-[0.8125rem] font-semibold text-muted last:pr-0"
                    >
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {ledgerRows.map((row) => (
                  <tr key={row.id} className="border-b border-line align-top">
                    <td className="py-5 pr-6">
                      <p className="text-[0.9375rem] font-medium text-navy-900">
                        {row.relationship}
                      </p>
                      <p className="mt-0.5 text-[0.8125rem] text-muted">
                        {row.destination}
                      </p>
                      {row.aboveAverage && (
                        <span className="mt-2 inline-flex items-center gap-1 rounded-input bg-pending-bg px-2 py-1 text-[0.6875rem] font-medium text-pending">
                          <WarningDiamond size={12} weight="fill" aria-hidden />
                          Above category average
                        </span>
                      )}
                    </td>
                    <td className="py-5 pr-6 text-[0.875rem] text-body">
                      {row.contractType}
                    </td>
                    <td className="figures py-5 pr-6 text-[0.9375rem] font-semibold text-navy-900">
                      {row.commissionDisplay}
                    </td>
                    <td className="figures py-5 pr-6 text-[0.875rem] text-body">
                      {row.clientFee}
                    </td>
                    <td className="py-5 pr-6 text-[0.875rem] text-body">
                      {SOURCE_LABEL[row.source]}
                      {row.evidence && (
                        <span className="mt-1 block text-[0.8125rem] text-muted">
                          {row.evidence}
                        </span>
                      )}
                    </td>
                    <td className="py-5 pr-6 text-[0.875rem]">
                      {row.verificationDate ? (
                        <>
                          <span className="figures text-body">
                            {row.verificationDate}
                          </span>
                          <span className="mt-0.5 block text-[0.8125rem] text-muted">
                            by {row.verifiedBy}
                          </span>
                        </>
                      ) : (
                        <span className="text-muted">Not yet</span>
                      )}
                      <span className="mt-1 block text-[0.75rem] text-muted">
                        Reviewed <span className="figures">{row.lastReviewDate}</span>
                      </span>
                    </td>
                    <td className="py-5">
                      <StatusChip status={row.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-8 grid gap-5 lg:grid-cols-2">
            {ledgerRows
              .filter((row) => row.note)
              .map((row) => (
                <div
                  key={row.id}
                  className="rounded-card border border-line bg-surface p-5"
                >
                  <p className="text-[0.875rem] font-medium text-navy-900">
                    {row.relationship}
                  </p>
                  <p className="mt-1.5 text-[0.875rem] leading-relaxed text-body">
                    {row.note}
                  </p>
                </div>
              ))}
          </div>
        </div>
      </section>

      <section className="band bg-surface">
        <div className="shell grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <h2 className="font-display text-[1.75rem] font-bold text-navy-900">
              How a figure gets on this page
            </h2>
            <p className="mt-4 text-[0.9375rem] leading-relaxed text-body">
              Nothing skips straight to published. A row moves through these
              states, and only two of them permit an exact number.
            </p>
            <dl className="mt-8 divide-y divide-line border-t border-line">
              {statusOrder.map((status) => (
                <div key={status} className="py-4">
                  <dt>
                    <StatusChip status={status} />
                  </dt>
                  <dd className="mt-2 text-[0.9375rem] leading-relaxed text-body">
                    {statusExplainer[status]}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <div>
            <h2 className="font-display text-[1.75rem] font-bold text-navy-900">
              What you see when a university says no
            </h2>
            <p className="mt-4 text-[0.9375rem] leading-relaxed text-body">
              Most partner agreements restrict disclosure by default. That
              changes what we can print. It does not change whether the
              relationship is disclosed at all.
            </p>
            <dl className="mt-8 divide-y divide-line border-t border-line">
              {disclosureFallbacks.map((entry) => (
                <div key={entry.response} className="py-5">
                  <dt className="text-[0.9375rem] font-semibold text-navy-900">
                    {entry.response}
                  </dt>
                  <dd className="mt-1.5 text-[0.9375rem] leading-relaxed text-body">
                    {entry.shown}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      <section className="band bg-paper">
        <div className="shell">
          <div className="grid gap-10 lg:grid-cols-[1fr_1fr] lg:gap-16">
            <div>
              <h2 className="font-display text-[1.75rem] font-bold text-navy-900">
                The flagging rule
              </h2>
              <p className="mt-4 text-[0.9375rem] leading-relaxed text-body">
                {ledgerMethodology.flaggingRule}
              </p>
              <h2 className="mt-10 font-display text-[1.75rem] font-bold text-navy-900">
                Update cadence
              </h2>
              <p className="mt-4 text-[0.9375rem] leading-relaxed text-body">
                {ledgerMethodology.cadence}
              </p>
            </div>

            <div className="rounded-panel border border-line bg-surface p-7">
              <h2 className="font-display text-[1.125rem] font-bold text-navy-900">
                What is recorded for every row
              </h2>
              <p className="mt-3 text-[0.875rem] leading-relaxed text-body">
                Nine fields per university relationship, held in the operations
                console and projected onto this page.
              </p>
              <ul className="mt-6 grid gap-2.5 sm:grid-cols-2">
                {ledgerMethodology.schemaFields.map((field) => (
                  <li
                    key={field}
                    className="rounded-input bg-paper px-3.5 py-2.5 text-[0.875rem] text-ink-soft"
                  >
                    {field}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-14 flex flex-wrap items-center gap-4 border-t border-line pt-10">
            <ButtonLink href={primaryCta.href} size="lg">
              {primaryCta.label}
            </ButtonLink>
            <ButtonLink href="/zero-commission" variant="outline" size="lg">
              See who pays us nothing
            </ButtonLink>
          </div>
        </div>
      </section>
    </>
  );
}
