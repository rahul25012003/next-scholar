import type { Metadata } from "next";
import Link from "next/link";
import { WarningCircle } from "@phosphor-icons/react/ssr";
import {
  applyFilters,
  activeFilterCount,
  catalogueScope,
  filtersFromParams,
  programmes,
  sortOptions,
  sortProgrammes,
} from "@/content/catalogue";
import { currentShortlist } from "@/app/actions/shortlist";
import { FilterRail } from "@/components/catalogue/filters";
import { CourseCard } from "@/components/catalogue/course-card";
import { RelatedSearches } from "@/components/catalogue/related-searches";
import { PageHero } from "@/components/marketing/page-hero";

export const metadata: Metadata = {
  title: "Courses and universities",
  description:
    "Fifty-two Master's courses across forty-five universities in the UK, Germany and Ireland.",
  alternates: { canonical: "/universities" },
};

export default async function UniversitiesPage(props: PageProps<"/universities">) {
  const params = await props.searchParams;
  const filters = filtersFromParams(params);
  const sort = typeof params.sort === "string" ? params.sort : "name";

  const filtered = applyFilters(programmes, filters);
  const rows = sortProgrammes(filtered, sort);
  const saved = await currentShortlist();
  const activeCount = activeFilterCount(filters);

  const query = new URLSearchParams(
    Object.entries(params).flatMap(([key, value]) =>
      typeof value === "string" ? [[key, value] as [string, string]] : [],
    ),
  ).toString();
  const returnTo = query ? `/universities?${query}` : "/universities";

  return (
    <>
      <PageHero
        title="Master's courses and universities"
        lede="Fifty-two courses at forty-five universities, across three destinations."
        aside={
          <div className="rounded-panel border border-line bg-white p-6">
            <p className="text-[0.8125rem] font-semibold text-blue-dark">
              What this catalogue is
            </p>
            <p className="mt-2 text-[0.875rem] leading-relaxed text-grey">
              {catalogueScope.note}
            </p>
            <p className="mt-3 text-[0.8125rem] text-grey">
              Written down <span className="figures">{catalogueScope.statedOn}</span>. Not yet
              re-checked at source by a named person.
            </p>
          </div>
        }
      />

      <section className="band">
        <div className="shell grid gap-8 lg:grid-cols-[17rem_minmax(0,1fr)] lg:gap-10 lg:items-start">
          <div className="lg:sticky lg:top-24">
            <details className="lg:hidden">
              <summary className="cursor-pointer rounded-card border border-line bg-light px-5 py-3.5 text-[0.9375rem] font-semibold text-blue-dark">
                Filters{activeCount > 0 ? ` (${activeCount} applied)` : ""}
              </summary>
              <div className="mt-3">
                <FilterRail filters={filters} sort={sort} resultCount={rows.length} />
              </div>
            </details>
            <div className="hidden lg:block">
              <FilterRail filters={filters} sort={sort} resultCount={rows.length} />
            </div>
          </div>

          <div className="min-w-0">
            <div className="flex flex-wrap items-baseline justify-between gap-4">
              <h2 className="text-blue-dark">
                {rows.length} course{rows.length === 1 ? "" : "s"}
                {activeCount > 0 && (
                  <span className="ml-2 text-[0.875rem] font-normal text-grey">
                    from {programmes.length}, on {activeCount} filter
                    {activeCount === 1 ? "" : "s"}
                  </span>
                )}
              </h2>
              <p className="text-[0.8125rem] text-grey">
                Ordered by {sortOptions.find((option) => option.key === sort)?.label.toLowerCase()}
              </p>
            </div>

            {rows.length === 0 ? (
              <div className="mt-6 rounded-panel border border-dashed border-line-strong bg-light p-8">
                <h3 className="text-blue-dark h--5">
                  Nothing matches those filters
                </h3>
                <p className="mt-2 max-w-2xl text-[0.9375rem] leading-relaxed text-grey">
                  We list forty-five institutions across three destinations, chosen by hand.
                  An empty result usually means we have not added that combination, not that
                  no such course exists.
                </p>
                <Link
                  href="/universities"
                  className="mt-4 inline-block text-[0.9375rem] font-medium text-pink hover:text-blue-dark"
                >
                  Clear the filters
                </Link>
              </div>
            ) : (
              <div className="mt-6 grid gap-5">
                {rows.map((row) => (
                  <CourseCard
                    key={row.slug}
                    row={row}
                    saved={saved.includes(row.slug)}
                    returnTo={returnTo}
                  />
                ))}
              </div>
            )}

            <div className="mt-10 rounded-panel border border-line bg-light p-6 md:p-7">
              <h2 className="flex items-center gap-2 text-blue-dark h--5">
                <WarningCircle size={18} weight="fill" aria-hidden className="text-pending" />
                What this catalogue does not do
              </h2>
              <ul className="mt-4 space-y-2.5">
                {catalogueScope.omissions.map((line) => (
                  <li
                    key={line}
                    className="flex gap-2.5 text-[0.9375rem] leading-relaxed text-grey"
                  >
                    <span
                      aria-hidden
                      className="mt-2.5 h-1 w-1 shrink-0 rounded-full bg-line-strong"
                    />
                    {line}
                  </li>
                ))}
              </ul>
              <p className="mt-5 text-[0.875rem] leading-relaxed text-grey">
                Our commission figures here are market estimates, not contract terms, except
                at German public universities, where the figure is a confirmed zero. How we
                check them, and how to dispute one, is on the{" "}
                <Link
                  href="/open-ledger"
                  className="font-medium text-pink hover:text-blue-dark"
                >
                  Open Ledger
                </Link>
                .
              </p>
            </div>

            <RelatedSearches />
          </div>
        </div>
      </section>
    </>
  );
}
