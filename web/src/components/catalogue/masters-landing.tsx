import Link from "next/link";
import { WarningCircle } from "@phosphor-icons/react/ssr";
import {
  courseSummaries,
  disciplines,
  filtersFromParams,
  programmes,
  sortOptions,
} from "@/content/catalogue";
import { rateFor } from "@/content/guides";
import { CourseExplorer } from "@/components/catalogue/course-explorer";
import { RelatedSearches } from "@/components/catalogue/related-searches";
import { countryInSentence } from "@/lib/country";

const ownLink: Record<string, string> = {
  germany: "/masters-in-germany",
  "united-kingdom": "/masters-in-uk",
  ireland: "/masters-in-ireland",
};

/**
 * "Masters in X": the same course list `/universities` renders, holding only
 * one country's courses, at its own URL with its own heading. No new data and
 * no separate filtering logic.
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
  const rows = programmes.filter((row) => row.university.destination === destinationSlug);
  const subjects = new Set(rows.flatMap((row) => row.disciplines));
  const sort =
    typeof searchParams.sort === "string" &&
    sortOptions.some((option) => option.key === searchParams.sort)
      ? searchParams.sort
      : "name";
  const path = ownLink[destinationSlug] ?? "/universities";
  const gbp = rateFor("GBP");
  const eur = rateFor("EUR");

  return (
    <>
      <section className="band pad-before">
        <div className="shell">
          <div className="Explorer__intro">
            <h1 className="h h--3 text-blue-dark">
              Master&rsquo;s courses in {countryInSentence(country)}
            </h1>
            <p className="max-w-2xl text-[1.0625rem] leading-relaxed text-grey">
              <span className="figures">{rows.length}</span> taught Master&rsquo;s courses we
              have picked out in {countryInSentence(country)}, from the same list as the{" "}
              <Link href="/universities" className="font-medium text-pink hover:text-blue-dark">
                full course search
              </Link>
              .
            </p>
          </div>

          <CourseExplorer
            courses={courseSummaries(rows)}
            destinations={[]}
            subjects={disciplines()
              .map((subject) => subject.name)
              .filter((name) => subjects.has(name))}
            initialFilters={{ ...filtersFromParams(searchParams), destinations: [] }}
            initialSort={sort}
            saved={savedSlugs}
            rates={{ GBP: gbp.inrPerUnit, EUR: eur.inrPerUnit }}
            ratesTakenOn={gbp.takenOn}
            today={new Date().toISOString().slice(0, 10)}
            basePath={path}
          />
        </div>
      </section>

      <section className="band">
        <div className="shell">
          <p className="flex max-w-3xl gap-3 leading-relaxed text-grey">
            <WarningCircle size={20} weight="fill" aria-hidden className="mt-0.5 shrink-0 text-pending" />
            <span>
              We list <span className="figures">{rows.length}</span> courses in{" "}
              {countryInSentence(country)}, chosen by hand. It is not every Master&rsquo;s
              programme in the country.
            </span>
          </p>
          <RelatedSearches exclude={path} />
        </div>
      </section>
    </>
  );
}
