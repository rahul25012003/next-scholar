import type { Metadata } from "next";
import Link from "next/link";
import { Info, WarningCircle } from "@phosphor-icons/react/ssr";
import {
  catalogueScope,
  courseSummaries,
  disciplines,
  filtersFromParams,
  programmes,
  sortOptions,
  universities,
} from "@/content/catalogue";
import { guides, rateFor } from "@/content/guides";
import { currentShortlist } from "@/app/actions/shortlist";
import { CourseExplorer } from "@/components/catalogue/course-explorer";
import { RelatedSearches } from "@/components/catalogue/related-searches";

export const metadata: Metadata = {
  title: "Master's courses",
  description: `${programmes.length} taught Master's courses at ${universities.length} universities in the UK, Germany and Ireland, with fees, deadlines and what we earn side by side.`,
  alternates: { canonical: "/universities" },
};

export default async function UniversitiesPage(props: PageProps<"/universities">) {
  const params = await props.searchParams;
  const initialFilters = filtersFromParams(params);
  const sort =
    typeof params.sort === "string" && sortOptions.some((option) => option.key === params.sort)
      ? params.sort
      : "name";
  const saved = await currentShortlist();
  const gbp = rateFor("GBP");
  const eur = rateFor("EUR");

  return (
    <>
      <section className="band pad-before">
        <div className="shell">
          <div className="Explorer__intro">
            <h1 className="h h--3 text-blue-dark">Master&rsquo;s courses</h1>
            <p className="max-w-2xl text-[1.0625rem] leading-relaxed text-grey">
              <span className="figures">{programmes.length}</span> taught Master&rsquo;s
              courses at <span className="figures">{universities.length}</span> universities
              in the UK, Germany and Ireland, compared side by side.
            </p>
          </div>

          <CourseExplorer
            courses={courseSummaries()}
            destinations={guides.map((guide) => ({
              slug: guide.slug,
              country: guide.country,
              flagCode: guide.flagCode,
            }))}
            subjects={disciplines().map((subject) => subject.name)}
            initialFilters={initialFilters}
            initialSort={sort}
            saved={saved}
            rates={{ GBP: gbp.inrPerUnit, EUR: eur.inrPerUnit }}
            ratesTakenOn={gbp.takenOn}
            today={new Date().toISOString().slice(0, 10)}
          />
        </div>
      </section>

      <section className="band">
        <div className="shell">
          <div className="grid gap-10 lg:grid-cols-2 lg:gap-14">
            <div>
              <h2 className="flex items-center gap-2 text-blue-dark h--5">
                <Info size={19} weight="fill" aria-hidden className="text-blue" />
                About this list
              </h2>
              <p className="mt-3 leading-relaxed text-grey">{catalogueScope.note}</p>
              <p className="mt-3 text-[0.875rem] text-grey">
                Written down <span className="figures">{catalogueScope.statedOn}</span>. Not
                yet re-checked at source by a named person.
              </p>
            </div>
            <div>
              <h2 className="flex items-center gap-2 text-blue-dark h--5">
                <WarningCircle size={19} weight="fill" aria-hidden className="text-pending" />
                What this list does not do
              </h2>
              <ul className="mt-3 space-y-2.5">
                {catalogueScope.omissions.map((line) => (
                  <li key={line} className="flex gap-2.5 leading-relaxed text-grey">
                    <span aria-hidden className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-tint" />
                    {line}
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-[0.9375rem] leading-relaxed text-grey">
                Our earnings figures are market estimates, except at German public
                universities, where the figure is a confirmed zero. How we check them, and
                how to dispute one, is on the{" "}
                <Link href="/open-ledger" className="font-medium text-pink hover:text-blue-dark">
                  Open Ledger
                </Link>
                .
              </p>
            </div>
          </div>

          <RelatedSearches />
        </div>
      </section>
    </>
  );
}
