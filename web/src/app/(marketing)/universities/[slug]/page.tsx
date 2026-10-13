import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, MapPin } from "@phosphor-icons/react/ssr";
import { universities, universityFor } from "@/content/catalogue";
import { guideFor } from "@/content/guides";
import { currentShortlist } from "@/app/actions/shortlist";
import {
  CommissionBadge,
  CommissionNote,
  FieldRow,
  FieldValue,
  formatFee,
} from "@/components/catalogue/field";
import { SaveToShortlist } from "@/components/catalogue/save-button";
import { cn } from "@/lib/cn";

const tabs = [
  { key: "overview", label: "Overview" },
  { key: "admissions", label: "Admissions" },
  { key: "rankings", label: "Rankings" },
  { key: "courses", label: "Courses and fees" },
] as const;

export function generateStaticParams() {
  return universities.map((university) => ({ slug: university.slug }));
}

export async function generateMetadata(
  props: PageProps<"/universities/[slug]">,
): Promise<Metadata> {
  const { slug } = await props.params;
  const university = universityFor(slug);
  if (!university) return {};
  return {
    title: university.name,
    description: university.summary.slice(0, 200),
    alternates: { canonical: `/universities/${university.slug}` },
  };
}

export default async function UniversityPage(props: PageProps<"/universities/[slug]">) {
  const { slug } = await props.params;
  const params = await props.searchParams;
  const university = universityFor(slug);
  if (!university) notFound();

  const active =
    typeof params.tab === "string" && tabs.some((tab) => tab.key === params.tab)
      ? params.tab
      : "overview";
  const guide = guideFor(university.destination);
  const saved = await currentShortlist();
  const returnTo = `/universities/${university.slug}`;

  return (
    <>
      <section className="band">
        <div className="shell">
          <Link
            href="/universities"
            className="text-[0.875rem] font-medium text-pink hover:text-blue-dark"
          >
            All courses
          </Link>

          <div className="mt-5 flex flex-wrap items-start gap-5">
            <span
              aria-hidden
              className="figures grid h-16 w-16 shrink-0 place-items-center rounded-card bg-blue-light font-bold text-blue-dark"
            >
              {university.initials}
            </span>
            <div className="min-w-0 flex-1">
              <h1 className="text-blue-dark">
                {university.name}
              </h1>
              <p className="mt-2 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[0.9375rem] text-grey">
                <MapPin size={15} weight="fill" aria-hidden className="text-grey" />
                {university.city}
                <Image
                  src={`https://flagcdn.com/w40/${university.flagCode}.png`}
                  alt=""
                  width={20}
                  height={15}
                  className="h-3.5 w-auto rounded-xs ring-1 ring-line"
                />
                <span aria-hidden className="text-line-strong">
                  ·
                </span>
                {university.type === "public" ? "Public" : "Private"} institution
                <span aria-hidden className="text-line-strong">
                  ·
                </span>
                {university.route}
              </p>
              <p className="mt-4 max-w-3xl leading-relaxed text-grey">
                {university.summary}
              </p>
              <div className="mt-5">
                <CommissionBadge university={university} size="md" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <nav
        aria-label="University sections"
        className="sticky top-18 z-20 border-b border-line bg-white/95"
      >
        <div className="shell flex gap-1 overflow-x-auto">
          {tabs.map((tab) => (
            <Link
              key={tab.key}
              href={`/universities/${university.slug}?tab=${tab.key}`}
              scroll={false}
              aria-current={tab.key === active ? "page" : undefined}
              className={cn(
                "whitespace-nowrap border-b-2 px-4 py-3.5 text-[0.9375rem] font-medium transition-colors",
                tab.key === active
                  ? "border-blue-dark text-pink-dark"
                  : "border-transparent text-grey hover:text-blue-dark",
              )}
            >
              {tab.label}
            </Link>
          ))}
        </div>
      </nav>

      <section className="band">
        <div className="shell grid gap-10 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-start">
          <div className="min-w-0">
            {active === "overview" && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-blue-dark">
                    The institution
                  </h2>
                  <dl className="mt-4 divide-y divide-line rounded-panel border border-line bg-white px-6">
                    <FieldRow
                      label="Established"
                      field={university.highlights.established}
                      render={(value) => <span className="figures">{value}</span>}
                    />
                    <FieldRow
                      label="Total students"
                      field={university.highlights.totalStudents}
                      render={(value) => (
                        <span className="figures">About {value.toLocaleString("en-GB")}</span>
                      )}
                    />
                    <FieldRow
                      label="International students"
                      field={university.highlights.internationalStudents}
                    />
                    <FieldRow
                      label="Staff to student ratio"
                      field={university.highlights.staffRatio}
                    />
                    <FieldRow
                      label="Acceptance rate"
                      field={university.highlights.acceptanceRate}
                    />
                    <FieldRow
                      label="Accreditation"
                      field={university.highlights.accreditation}
                    />
                  </dl>
                </div>

                <div>
                  <h2 className="text-blue-dark">
                    Tuition position
                  </h2>
                  <div className="mt-4 rounded-panel border border-line bg-white p-6">
                    <FieldValue field={university.tuitionNote} />
                  </div>
                </div>

                <div>
                  <h2 className="text-blue-dark">
                    What we have not checked
                  </h2>
                  <p className="mt-2 max-w-2xl text-[0.9375rem] leading-relaxed text-grey">
                    We list these so you do not have to find the gaps yourself.
                  </p>
                  <ul className="mt-4 space-y-2.5">
                    {university.notChecked.map((line) => (
                      <li
                        key={line}
                        className="flex gap-2.5 text-[0.9375rem] leading-relaxed text-grey"
                      >
                        <span
                          aria-hidden
                          className="mt-2.5 h-1 w-1 shrink-0 rounded-full bg-pending"
                        />
                        {line}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {active === "admissions" && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-blue-dark">
                    Exam requirements
                  </h2>
                  <p className="mt-2 max-w-2xl text-[0.9375rem] leading-relaxed text-grey">
                    For Master&rsquo;s study. &ldquo;Not required&rdquo; is a clear answer; it
                    is not the same as an answer we do not have.
                  </p>
                  <div className="mt-4 overflow-x-auto rounded-panel border border-line bg-white">
                    <table className="w-full border-collapse text-left">
                      <caption className="sr-only">
                        Exam requirements for Master&rsquo;s study at {university.name}.
                      </caption>
                      <thead>
                        <tr className="border-b border-line bg-light">
                          <th
                            scope="col"
                            className="px-5 py-3 text-[0.75rem] font-semibold text-blue-dark"
                          >
                            Exam
                          </th>
                          <th
                            scope="col"
                            className="px-5 py-3 text-[0.75rem] font-semibold text-blue-dark"
                          >
                            Master&rsquo;s
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-line">
                        {university.exams.map((exam) => (
                          <tr key={exam.exam} className="align-top">
                            <th
                              scope="row"
                              className="px-5 py-4 text-[0.875rem] font-semibold text-blue-dark"
                            >
                              {exam.exam}
                            </th>
                            <td className="px-5 py-4">
                              <FieldValue field={exam.postgraduate} />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {guide && (
                  <div className="rounded-panel border border-line bg-light p-6">
                    <h2 className="text-blue-dark h--5">
                      The rest of the {guide.country} route
                    </h2>
                    <p className="mt-2 text-[0.9375rem] leading-relaxed text-grey">
                      An offer is only one step. The country, not this university, sets the
                      rest: the funding amount, visa documents, language certificate and
                      timeline.
                    </p>
                    <Link
                      href={`/destinations/${guide.slug}`}
                      className="group mt-4 inline-flex items-center gap-1.5 text-[0.9375rem] font-medium text-pink hover:text-blue-dark"
                    >
                      The {guide.country} guide
                      <ArrowRight
                        size={14}
                        weight="bold"
                        aria-hidden
                        className="transition-transform group-hover:translate-x-0.5"
                      />
                    </Link>
                  </div>
                )}
              </div>
            )}

            {active === "rankings" && (
              <div>
                <h2 className="text-blue-dark">
                  Rankings
                </h2>
                <p className="mt-2 max-w-2xl text-[0.9375rem] leading-relaxed text-grey">
                  Each one names who published it, the year and what it ranks within. None is
                  ours, and none tells you whether a programme is right for you.
                </p>
                {university.rankings.length === 0 ? (
                  <div className="mt-4 rounded-panel border border-dashed border-line-strong bg-light p-6">
                    <p className="text-[0.9375rem] leading-relaxed text-grey">
                      We show no ranking for this institution. It is not in the world tables
                      we cite, and we will not make one up.
                    </p>
                  </div>
                ) : (
                  <ul className="mt-4 divide-y divide-line rounded-panel border border-line bg-white">
                    {university.rankings.map((ranking) => (
                      <li key={`${ranking.body}-${ranking.year}-${ranking.scope}`} className="p-6">
                        <p className="text-[0.9375rem] font-semibold text-blue-dark">
                          {ranking.rank}
                        </p>
                        <p className="mt-1 text-[0.875rem] text-grey">
                          {ranking.body}, <span className="figures">{ranking.year}</span>.{" "}
                          {ranking.scope}.
                        </p>
                        <p className="mt-1 text-[0.75rem] text-grey">Source: {ranking.source}</p>
                      </li>
                    ))}
                  </ul>
                )}
                <p className="mt-5 max-w-2xl text-[0.875rem] leading-relaxed text-grey">
                  We give a band where published sources disagree, and an exact position only
                  where the institution published one. Positions move every year, and an
                  out-of-date exact number misleads more than a band.
                </p>
              </div>
            )}

            {active === "courses" && (
              <div>
                <h2 className="text-blue-dark">
                  Courses in this catalogue
                </h2>
                <p className="mt-2 max-w-2xl text-[0.9375rem] leading-relaxed text-grey">
                  Not every course this university runs, only the ones we have read up on.
                  If a course is missing, we have not added it; it may still exist.
                </p>
                <div className="mt-5 grid gap-5">
                  {university.programmes.map((programme) => (
                    <article
                      key={programme.slug}
                      className="rounded-panel border border-line bg-white p-6"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-4">
                        <h3 className="text-blue-dark h--6">
                          <Link
                            href={`/universities/${university.slug}/${programme.slug}`}
                            className="hover:text-pink"
                          >
                            {programme.name}
                          </Link>
                        </h3>
                        <SaveToShortlist
                          programmeSlug={programme.slug}
                          saved={saved.includes(programme.slug)}
                          returnTo={returnTo}
                        />
                      </div>
                      <dl className="mt-4 grid gap-4 sm:grid-cols-3">
                        <div>
                          <dt className="text-[0.75rem] text-grey">Tuition, per year</dt>
                          <dd className="figures mt-0.5 font-semibold text-blue-dark">
                            {programme.feePerYear.state === "stated"
                              ? formatFee(programme.feePerYear.value, programme.currency)
                              : "Not published here"}
                          </dd>
                          {programme.feePerYear.state === "unknown" && (
                            <dd className="mt-1 text-[0.75rem] leading-snug text-grey">
                              {programme.feePerYear.reason}
                            </dd>
                          )}
                        </div>
                        <div>
                          <dt className="text-[0.75rem] text-grey">Duration</dt>
                          <dd className="figures mt-0.5 font-semibold text-blue-dark">
                            {programme.durationMonths} months
                          </dd>
                        </div>
                        <div>
                          <dt className="text-[0.75rem] text-grey">Taught in</dt>
                          <dd className="mt-0.5 text-[0.9375rem] text-blue-dark">
                            {programme.languageOfInstruction}
                          </dd>
                        </div>
                      </dl>
                      <Link
                        href={`/universities/${university.slug}/${programme.slug}`}
                        className="group mt-4 inline-flex items-center gap-1.5 text-[0.875rem] font-medium text-pink hover:text-blue-dark"
                      >
                        Intake table and entry requirements
                        <ArrowRight
                          size={14}
                          weight="bold"
                          aria-hidden
                          className="transition-transform group-hover:translate-x-0.5"
                        />
                      </Link>
                    </article>
                  ))}
                </div>
              </div>
            )}
          </div>

          <aside className="grid gap-5 lg:sticky lg:top-32">
            <div className="rounded-panel border border-line bg-white p-6">
              <h2 className="text-blue-dark h--6">
                What we earn here
              </h2>
              <div className="mt-3">
                <CommissionBadge university={university} size="md" />
              </div>
              <div className="mt-4">
                <CommissionNote university={university} />
              </div>
            </div>

            {guide && (
              <div className="rounded-panel border border-line bg-light p-6">
                <h2 className="text-blue-dark h--6">
                  Cost of living, {university.city}
                </h2>
                <p className="mt-2 text-[0.875rem] leading-relaxed text-grey">
                  Line by line and editable, with a source for every range. No signup, like
                  every tool here.
                </p>
                <Link
                  href={`/tools/cost-of-living?destination=${guide.slug}`}
                  className="mt-3 inline-block text-[0.875rem] font-medium text-pink hover:text-blue-dark"
                >
                  Work out the year
                </Link>
              </div>
            )}

            <div className="rounded-panel border border-line bg-light p-6">
              <h2 className="text-blue-dark h--6">
                Check yourself against the route
              </h2>
              <p className="mt-2 text-[0.875rem] leading-relaxed text-grey">
                Each published requirement shows as Met, Not met yet or Needs checking. No
                score and no chance of admission.
              </p>
              <Link
                href={`/tools/requirements-check?destination=${university.destination}`}
                className="mt-3 inline-block text-[0.875rem] font-medium text-pink hover:text-blue-dark"
              >
                Run the checklist
              </Link>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
