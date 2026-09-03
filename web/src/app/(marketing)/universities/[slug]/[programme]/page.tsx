import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "@phosphor-icons/react/ssr";
import { programmeFor, programmes } from "@/content/catalogue";
import { guideFor } from "@/content/guides";
import { currentShortlist } from "@/app/actions/shortlist";
import {
  CommissionBadge,
  CommissionNote,
  FieldValue,
  formatFee,
} from "@/components/catalogue/field";
import { SaveToShortlist } from "@/components/catalogue/save-button";
import { cn } from "@/lib/cn";

const intakeTone = {
  open: "bg-verified-bg text-verified",
  "closing-soon": "bg-pending-bg text-pending",
  closed: "bg-denied-bg text-denied",
  "not-yet-open": "bg-neutral-chip-bg text-neutral-chip",
} as const;

const intakeLabel = {
  open: "Open",
  "closing-soon": "Closing soon",
  closed: "Closed",
  "not-yet-open": "Not yet open",
} as const;

export function generateStaticParams() {
  return programmes.map((programme) => ({
    slug: programme.universitySlug,
    programme: programme.slug,
  }));
}

export async function generateMetadata(
  props: PageProps<"/universities/[slug]/[programme]">,
): Promise<Metadata> {
  const { programme: programmeSlug } = await props.params;
  const row = programmeFor(programmeSlug);
  if (!row) return {};
  return {
    title: `${row.name}, ${row.university.name}`,
    description: `${row.name} at ${row.university.name}: intakes, entry requirements, fee, and what we earn if you enrol.`,
    alternates: {
      canonical: `/universities/${row.university.slug}/${row.slug}`,
    },
  };
}

export default async function ProgrammePage(
  props: PageProps<"/universities/[slug]/[programme]">,
) {
  const { programme: programmeSlug } = await props.params;
  const row = programmeFor(programmeSlug);
  if (!row) notFound();

  const guide = guideFor(row.university.destination);
  const saved = await currentShortlist();
  const returnTo = `/universities/${row.university.slug}/${row.slug}`;

  return (
    <>
      <section className="border-b border-line bg-surface">
        <div className="shell py-10 md:py-14">
          <nav aria-label="Breadcrumb" className="text-[0.875rem] text-muted">
            <Link href="/universities" className="font-medium text-blue-600 hover:text-blue-500">
              All courses
            </Link>
            <span aria-hidden className="mx-2">
              /
            </span>
            <Link
              href={`/universities/${row.university.slug}`}
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              {row.university.name}
            </Link>
          </nav>

          <h1 className="mt-4 max-w-3xl font-display text-[1.875rem] font-extrabold leading-tight tracking-[-0.03em] text-navy-900 md:text-[2.5rem]">
            {row.name}
          </h1>
          <p className="mt-3 text-[1rem] text-body">
            {row.university.name}, {row.campus}. {row.durationMonths} months, taught in{" "}
            {row.languageOfInstruction}.
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-4">
            <CommissionBadge university={row.university} size="md" />
            <SaveToShortlist
              programmeSlug={row.slug}
              saved={saved.includes(row.slug)}
              returnTo={returnTo}
            />
          </div>
        </div>
      </section>

      <section className="bg-paper py-10 md:py-14">
        <div className="shell grid gap-10 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-start">
          <div className="min-w-0 space-y-9">
            <div>
              <h2 className="font-display text-[1.375rem] font-bold text-navy-900">
                Tuition
              </h2>
              <div className="mt-4 rounded-panel border border-line bg-paper p-6">
                <p className="figures text-[2rem] font-bold leading-none text-navy-900">
                  {row.feePerYear.state === "stated"
                    ? formatFee(row.feePerYear.value, row.currency)
                    : "Not published here"}
                  {row.feePerYear.state === "stated" && (
                    <span className="ml-2 font-sans text-[0.875rem] font-normal text-muted">
                      per year
                    </span>
                  )}
                </p>
                <p className="mt-3 text-[0.9375rem] leading-relaxed text-body">
                  {row.feeQualifier}
                </p>
                <div className="mt-4 border-t border-line pt-4">
                  <FieldValue field={row.feePerYear} render={() => null} />
                </div>
              </div>
            </div>

            <div>
              <h2 className="font-display text-[1.375rem] font-bold text-navy-900">
                Intakes
              </h2>
              <p className="mt-2 max-w-2xl text-[0.9375rem] leading-relaxed text-body">
                Deadlines as dates. Where a status is stated, the date it was established is
                stated with it, because an intake marked open six months ago is not evidence
                that it is open now.
              </p>
              <div className="mt-4 overflow-x-auto rounded-panel border border-line bg-paper">
                <table className="w-full min-w-[38rem] border-collapse text-left">
                  <caption className="sr-only">
                    Intakes for {row.name}, with application deadlines, start dates, campus
                    and status.
                  </caption>
                  <thead>
                    <tr className="border-b border-line bg-surface">
                      <th scope="col" className="px-5 py-3 text-[0.75rem] font-semibold text-navy-900">
                        Intake
                      </th>
                      <th scope="col" className="px-5 py-3 text-[0.75rem] font-semibold text-navy-900">
                        Apply by
                      </th>
                      <th scope="col" className="px-5 py-3 text-[0.75rem] font-semibold text-navy-900">
                        Teaching starts
                      </th>
                      <th scope="col" className="px-5 py-3 text-[0.75rem] font-semibold text-navy-900">
                        Campus
                      </th>
                      <th scope="col" className="px-5 py-3 text-[0.75rem] font-semibold text-navy-900">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-line">
                    {row.intakes.map((intake) => (
                      <tr key={intake.name}>
                        <th scope="row" className="px-5 py-4 text-[0.875rem] font-semibold text-navy-900">
                          {intake.name}
                        </th>
                        <td className="figures px-5 py-4 text-[0.875rem] text-body">
                          {intake.applicationDeadline}
                        </td>
                        <td className="figures px-5 py-4 text-[0.875rem] text-body">
                          {intake.teachingStarts}
                        </td>
                        <td className="px-5 py-4 text-[0.875rem] text-body">
                          {intake.campus ?? row.campus}
                        </td>
                        <td className="px-5 py-4">
                          <span
                            className={cn(
                              "inline-block rounded-input px-2 py-0.5 text-[0.6875rem] font-medium",
                              intakeTone[intake.status],
                            )}
                          >
                            {intakeLabel[intake.status]}
                          </span>
                          <span className="figures mt-1 block text-[0.6875rem] text-muted">
                            as of {intake.statusAsOf}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div>
              <h2 className="font-display text-[1.375rem] font-bold text-navy-900">
                Entry requirements
              </h2>
              <div className="mt-4 space-y-4">
                <div className="rounded-panel border border-line bg-paper p-6">
                  <h3 className="text-[0.8125rem] font-semibold uppercase tracking-wide text-muted">
                    The degree
                  </h3>
                  <div className="mt-2">
                    <FieldValue field={row.entryRequirement} />
                  </div>
                </div>
                <div className="rounded-panel border border-line bg-paper p-6">
                  <h3 className="text-[0.8125rem] font-semibold uppercase tracking-wide text-muted">
                    Subject prerequisites
                  </h3>
                  <div className="mt-2">
                    <FieldValue
                      field={row.prerequisites}
                      render={(value) => (
                        <span className="flex flex-wrap gap-2">
                          {value.map((item) => (
                            <span
                              key={item}
                              className="rounded-input bg-surface px-2.5 py-1 text-[0.8125rem] text-navy-900"
                            >
                              {item}
                            </span>
                          ))}
                        </span>
                      )}
                    />
                  </div>
                  {row.university.destination === "germany" && (
                    <p className="mt-4 border-t border-line pt-4 text-[0.875rem] leading-relaxed text-body">
                      On the German route these are not advisory. Admission is decided
                      largely on credit counts in exactly these areas, and a programme that
                      asks for 30 ECTS in mathematics and finds 18 rejects on that whatever
                      the overall grade was.{" "}
                      <Link
                        href="/tools/ects-check"
                        className="font-medium text-blue-600 hover:text-blue-500"
                      >
                        Check your credits against them
                      </Link>
                      .
                    </p>
                  )}
                </div>
                <div className="rounded-panel border border-line bg-paper p-6">
                  <h3 className="text-[0.8125rem] font-semibold uppercase tracking-wide text-muted">
                    Placement or internship
                  </h3>
                  <div className="mt-2">
                    <FieldValue field={row.placement} />
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h2 className="font-display text-[1.375rem] font-bold text-navy-900">
                Subjects
              </h2>
              <ul className="mt-3 flex flex-wrap gap-2">
                {row.disciplines.map((discipline) => (
                  <li key={discipline}>
                    <Link
                      href={`/universities?discipline=${encodeURIComponent(discipline)}`}
                      className="inline-block rounded-full border border-line-strong px-3.5 py-1.5 text-[0.875rem] text-navy-900 transition-colors hover:border-blue-600 hover:text-blue-600"
                    >
                      {discipline}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <aside className="grid gap-5 lg:sticky lg:top-24">
            <div className="rounded-panel border border-line bg-paper p-6">
              <h2 className="font-display text-[1rem] font-bold text-navy-900">
                What we earn if you enrol here
              </h2>
              <div className="mt-3">
                <CommissionBadge university={row.university} size="md" />
              </div>
              <div className="mt-4">
                <CommissionNote university={row.university} />
              </div>
              <Link
                href="/open-ledger"
                className="mt-4 inline-block text-[0.875rem] font-medium text-blue-600 hover:text-blue-500"
              >
                How the figure is verified
              </Link>
            </div>

            {guide && (
              <div className="rounded-panel border border-line bg-surface p-6">
                <h2 className="font-display text-[1rem] font-bold text-navy-900">
                  The rest of the {guide.country} route
                </h2>
                <ul className="mt-3 space-y-2.5 text-[0.875rem]">
                  <li>
                    <Link
                      href={`/destinations/${guide.slug}#funds`}
                      className="text-blue-600 hover:text-blue-500"
                    >
                      What the visa authority wants to see
                    </Link>
                  </li>
                  <li>
                    <Link
                      href={`/destinations/${guide.slug}#visa`}
                      className="text-blue-600 hover:text-blue-500"
                    >
                      Visa steps, in order
                    </Link>
                  </li>
                  <li>
                    <Link
                      href={`/tools/cost-of-living?destination=${guide.slug}`}
                      className="text-blue-600 hover:text-blue-500"
                    >
                      Cost of living in {row.university.city}
                    </Link>
                  </li>
                  <li>
                    <Link
                      href={`/tools/requirements-check?destination=${guide.slug}`}
                      className="text-blue-600 hover:text-blue-500"
                    >
                      Where you stand, requirement by requirement
                    </Link>
                  </li>
                </ul>
              </div>
            )}

            <div className="rounded-panel border border-line bg-surface p-6">
              <h2 className="font-display text-[1rem] font-bold text-navy-900">
                Comparing this with others
              </h2>
              <p className="mt-2 text-[0.875rem] leading-relaxed text-body">
                Save it and put it side by side with anything else on the catalogue, fee
                against fee and commission against commission.
              </p>
              <Link
                href="/shortlist"
                className="group mt-3 inline-flex items-center gap-1.5 text-[0.875rem] font-medium text-blue-600 hover:text-blue-500"
              >
                Your shortlist
                <ArrowRight
                  size={14}
                  weight="bold"
                  aria-hidden
                  className="transition-transform group-hover:translate-x-0.5"
                />
              </Link>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
