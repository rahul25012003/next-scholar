import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react/ssr";
import { programmeFor, type ProgrammeRow } from "@/content/catalogue";
import { currentShortlist } from "@/app/actions/shortlist";
import { currentActor } from "@/domain/session";
import { findById } from "@/data/users";
import { toChecklistProfile } from "@/domain/onboarding";
import { runChecklist, tally } from "@/domain/eligibility";
import { CommissionBadge, formatFee } from "@/components/catalogue/field";
import { SaveToShortlist } from "@/components/catalogue/save-button";
import { nextDeadline } from "@/content/catalogue";
import { PageHero } from "@/components/marketing/page-hero";
import { ButtonLink } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Your shortlist",
  description:
    "Courses you saved, side by side: fee against fee, deadline against deadline, and what we earn on each one against what we earn on the others.",
  alternates: { canonical: "/shortlist" },
  robots: { index: false, follow: true },
};

export const dynamic = "force-dynamic";

export default async function ShortlistPage() {
  const actor = await currentActor();
  const slugs = await currentShortlist();
  const rows = slugs
    .map((slug) => programmeFor(slug))
    .filter((row): row is ProgrammeRow => row !== null);

  // Read against the destination each row actually is, not a single fixed
  // one, since a shortlist can span more than one country and the same
  // student profile is checked differently in each.
  const onboarding = actor ? (await findById(actor.id))?.onboarding : null;
  const baseProfile = onboarding ? toChecklistProfile(onboarding) : null;
  const eligibility = baseProfile
    ? rows.map((row) =>
        tally(runChecklist({ ...baseProfile, destination: row.university.destination })),
      )
    : null;

  return (
    <>
      <PageHero
        title="Your shortlist, side by side"
        lede="The comparison neither of the two largest platforms in this market offers, carrying the column neither of them publishes at all. Fee against fee, deadline against deadline, and what we earn on each one next to what we earn on the others."
      />

      <section className="bg-paper py-10 md:py-14">
        <div className="shell">
          {!actor && (
            <div className="rounded-panel border border-line bg-surface p-8">
              <h2 className="font-display text-[1.375rem] font-bold text-navy-900">
                A shortlist needs an account
              </h2>
              <p className="mt-3 max-w-2xl text-[0.9375rem] leading-relaxed text-body">
                It is the only thing on this site that does. Every fee, every requirement,
                every calculator and every commission figure works signed out and will keep
                working signed out. Saving a course to come back to needs somewhere to save
                it, and that is all an account is doing here.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <ButtonLink href="/signup?next=%2Fshortlist" size="lg">
                  Create an account
                </ButtonLink>
                <ButtonLink href="/login?next=%2Fshortlist" variant="outline" size="lg">
                  Sign in
                </ButtonLink>
                <ButtonLink href="/universities" variant="quiet" size="lg">
                  Browse the catalogue instead
                </ButtonLink>
              </div>
            </div>
          )}

          {actor && rows.length === 0 && (
            <div className="rounded-panel border border-dashed border-line-strong bg-surface p-8">
              <h2 className="font-display text-[1.375rem] font-bold text-navy-900">
                Nothing saved yet
              </h2>
              <p className="mt-3 max-w-2xl text-[0.9375rem] leading-relaxed text-body">
                Save a course from the catalogue and it appears here, compared against
                everything else you save. Nothing is recommended into this list by us: it
                holds what you put in it, in the order you put it in.
              </p>
              <ButtonLink href="/universities" size="lg" className="mt-6">
                Browse the catalogue
                <ArrowRight size={15} weight="bold" aria-hidden />
              </ButtonLink>
            </div>
          )}

          {actor && rows.length > 0 && (
            <>
              <div className="overflow-x-auto rounded-panel border border-line bg-paper">
                <table className="w-full border-collapse text-left">
                  <caption className="sr-only">
                    Your saved courses compared on fee, duration, deadline, language, the
                    commission we earn, and, if you have filled in your profile, where you
                    stand against each destination&rsquo;s own requirements.
                  </caption>
                  <thead>
                    <tr className="border-b border-line bg-surface">
                      <th
                        scope="col"
                        className="sticky left-0 z-10 min-w-[14rem] bg-surface px-5 py-3 text-[0.75rem] font-semibold text-navy-900"
                      >
                        Course
                      </th>
                      {rows.map((row) => (
                        <th
                          key={row.slug}
                          scope="col"
                          className="min-w-[15rem] px-5 py-4 align-top"
                        >
                          <Link
                            href={`/universities/${row.university.slug}/${row.slug}`}
                            className="block text-[0.9375rem] font-semibold text-navy-900 hover:text-blue-600"
                          >
                            {row.name}
                          </Link>
                          <span className="mt-1 block text-[0.8125rem] font-normal text-body">
                            {row.university.name}, {row.university.city}
                          </span>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-line">
                    <Row label="Tuition, per year">
                      {rows.map((row) => (
                        <td key={row.slug} className="px-5 py-4 align-top">
                          <span className="figures text-[1rem] font-semibold text-navy-900">
                            {row.feePerYear.state === "stated"
                              ? formatFee(row.feePerYear.value, row.currency)
                              : "Not published"}
                          </span>
                          <span className="mt-1 block text-[0.75rem] leading-snug text-muted">
                            {row.feePerYear.state === "stated"
                              ? "Indicative. The programme's fee page governs."
                              : row.feePerYear.reason}
                          </span>
                        </td>
                      ))}
                    </Row>

                    <Row label="Duration">
                      {rows.map((row) => (
                        <td key={row.slug} className="figures px-5 py-4 align-top text-[0.9375rem] text-body">
                          {row.durationMonths} months
                        </td>
                      ))}
                    </Row>

                    <Row label="Next deadline">
                      {rows.map((row) => (
                        <td key={row.slug} className="figures px-5 py-4 align-top text-[0.9375rem] text-body">
                          {nextDeadline(row) ?? "None ahead"}
                        </td>
                      ))}
                    </Row>

                    <Row label="Taught in">
                      {rows.map((row) => (
                        <td key={row.slug} className="px-5 py-4 align-top text-[0.9375rem] text-body">
                          {row.languageOfInstruction}
                        </td>
                      ))}
                    </Row>

                    <Row label="Entry requirement">
                      {rows.map((row) => (
                        <td key={row.slug} className="px-5 py-4 align-top text-[0.875rem] leading-relaxed text-body">
                          {row.entryRequirement.state === "stated"
                            ? row.entryRequirement.value
                            : row.entryRequirement.reason}
                        </td>
                      ))}
                    </Row>

                    <Row label="What we earn">
                      {rows.map((row) => (
                        <td key={row.slug} className="px-5 py-4 align-top">
                          <CommissionBadge university={row.university} />
                        </td>
                      ))}
                    </Row>

                    {eligibility && (
                      <Row label="Where you stand">
                        {rows.map((row, index) => {
                          const counts = eligibility[index];
                          return (
                            <td key={row.slug} className="px-5 py-4 align-top">
                              <p className="text-[0.875rem] leading-relaxed text-body">
                                <span className="font-medium text-verified">{counts.met} met</span>
                                {", "}
                                <span className="font-medium text-denied">{counts["not-met"]} not met</span>
                                {", "}
                                <span className="font-medium text-pending">{counts.unknown} we cannot tell</span>
                              </p>
                              <Link
                                href={`/tools/requirements-check?destination=${row.university.destination}`}
                                className="mt-1.5 inline-block text-[0.8125rem] font-medium text-blue-600 hover:text-blue-500"
                              >
                                See the full breakdown
                              </Link>
                            </td>
                          );
                        })}
                      </Row>
                    )}

                    <Row label="Saved">
                      {rows.map((row) => (
                        <td key={row.slug} className="px-5 py-4 align-top">
                          <SaveToShortlist
                            programmeSlug={row.slug}
                            saved
                            returnTo="/shortlist"
                            labelWhenSaved="Remove"
                          />
                        </td>
                      ))}
                    </Row>
                  </tbody>
                </table>
              </div>

              <div className="mt-8 grid gap-5 lg:grid-cols-2">
                <div className="rounded-panel border border-line bg-surface p-6">
                  <h2 className="font-display text-[1.125rem] font-bold text-navy-900">
                    What this comparison is not
                  </h2>
                  <p className="mt-2.5 text-[0.9375rem] leading-relaxed text-body">
                    It is not a ranking and there is no best row. Nothing here is ordered by
                    a fit score, because a fit score computed from a fee and a deadline
                    would be arithmetic dressed as judgement. The order is the order you
                    saved them in, including the &ldquo;Where you stand&rdquo; row: it reads
                    your own profile against each destination&rsquo;s own requirements and
                    states the counts, and the counts do not reorder anything either.
                  </p>
                </div>
                <div className="rounded-panel border border-line bg-surface p-6">
                  <h2 className="font-display text-[1.125rem] font-bold text-navy-900">
                    Read the commission row across
                  </h2>
                  <p className="mt-2.5 text-[0.9375rem] leading-relaxed text-body">
                    If one of these pays us several times what another does, that is
                    visible here before anyone gives you advice about it. That is the entire
                    reason the row exists, and it is why we publish it on a comparison page
                    rather than only on a policy page nobody reads.
                  </p>
                </div>
              </div>
            </>
          )}
        </div>
      </section>
    </>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <tr>
      <th
        scope="row"
        className="sticky left-0 z-10 bg-paper px-5 py-4 align-top text-[0.875rem] font-semibold text-navy-900"
      >
        {label}
      </th>
      {children}
    </tr>
  );
}
