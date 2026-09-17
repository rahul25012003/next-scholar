import Link from "next/link";
import { WarningCircle } from "@phosphor-icons/react/ssr";
import {
  applyFilters,
  filtersFromParams,
  programmes,
  sortOptions,
  sortProgrammes,
} from "@/content/catalogue";
import { FilterRail } from "@/components/catalogue/filters";
import { CourseCard } from "@/components/catalogue/course-card";
import { RelatedSearches } from "@/components/catalogue/related-searches";
import { PageHero } from "@/components/marketing/page-hero";

const ownLink: Record<string, string> = {
  germany: "/masters-in-germany",
  "united-kingdom": "/masters-in-uk",
  ireland: "/masters-in-ireland",
};

/**
 * "Masters in X", one filtered view of the same catalogue `/universities`
 * renders, given its own URL and its own copy. No new data and no separate
 * filtering logic: the destination is pinned into the same `Filters` object
 * the shared filter rail and course card already know how to read.
 */
export async function MastersLanding({
  destinationSlug,
  country,
  searchParams,
  savedSlugs,
}: {
  destinationSlug: string;
  country: string;
  searchParams: Record<string, string | string[] | undefined>;
  savedSlugs: string[];
}) {
  const filters = { ...filtersFromParams(searchParams), destinations: [destinationSlug] };
  const sort = typeof searchParams.sort === "string" ? searchParams.sort : "name";
  const rows = sortProgrammes(applyFilters(programmes, filters), sort);
  const total = programmes.filter((row) => row.university.destination === destinationSlug).length;

  return (
    <>
      <PageHero
        title={`Masters courses in ${country}`}
        lede={`Every taught Master's we have curated in ${country}, with what we earn from the institution printed next to the fee. This is the same catalogue as the full course search, filtered to this one destination.`}
      />

      <section className="band">
        <div className="shell grid gap-8 lg:grid-cols-[17rem_minmax(0,1fr)] lg:gap-10 lg:items-start">
          <div className="lg:sticky lg:top-24">
            <details className="lg:hidden">
              <summary className="cursor-pointer rounded-card border border-line bg-light px-5 py-3.5 text-[0.9375rem] font-semibold text-blue-dark">
                Filters
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
                {rows.length} course{rows.length === 1 ? "" : "s"} in {country}
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
                  {total} course{total === 1 ? "" : "s"} exist in {country} in this catalogue;
                  the extra filters have narrowed the list to nothing.
                </p>
                <Link
                  href={`/universities?destination=${destinationSlug}`}
                  className="mt-4 inline-block text-[0.9375rem] font-medium text-pink hover:text-blue"
                >
                  Clear the extra filters
                </Link>
              </div>
            ) : (
              <div className="mt-6 grid gap-5">
                {rows.map((row) => (
                  <CourseCard
                    key={row.slug}
                    row={row}
                    saved={savedSlugs.includes(row.slug)}
                    returnTo={`/universities?destination=${destinationSlug}`}
                  />
                ))}
              </div>
            )}

            <div className="mt-10 rounded-panel border border-line bg-light p-6 md:p-7 flex gap-3">
              <WarningCircle size={18} weight="fill" aria-hidden className="mt-0.5 shrink-0 text-pending" />
              <p className="text-[0.9375rem] leading-relaxed text-grey">
                This is {total} course{total === 1 ? "" : "s"} across our catalogue for{" "}
                {country}, seeded by hand. It is not a complete list of every Master&rsquo;s
                programme in the country.{" "}
                <Link
                  href="/universities"
                  className="font-medium text-pink hover:text-blue"
                >
                  Search the full catalogue, all three destinations
                </Link>
                .
              </p>
            </div>

            <RelatedSearches exclude={ownLink[destinationSlug]} />
          </div>
        </div>
      </section>
    </>
  );
}
