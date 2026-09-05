import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "@phosphor-icons/react/ssr";
import { guides } from "@/content/guides";
import { scholarships, scholarshipScope } from "@/content/scholarships";
import { PageHero } from "@/components/marketing/page-hero";
import { cn } from "@/lib/cn";

export const metadata: Metadata = {
  title: "Scholarships",
  description:
    "National and cross-institutional scholarships actually open to Indian students going to the UK, Germany or Ireland, each with its funder, its coverage and its deadline cycle.",
  alternates: { canonical: "/scholarships" },
};

export default async function ScholarshipsPage(props: PageProps<"/scholarships">) {
  const params = await props.searchParams;
  const destination = typeof params.destination === "string" ? params.destination : "";
  const rows = destination
    ? scholarships.filter((item) => item.destination === destination)
    : scholarships;

  return (
    <>
      <PageHero
        title="Scholarships"
        lede="A short, hand-picked list of national or cross-institutional schemes, not a scrape of every university's marketing page. Every one names its funder, states its coverage, and is dated."
      />

      <section className="band bg-paper">
        <div className="shell">
          <div className="flex flex-wrap gap-2.5">
            <Link
              href="/scholarships"
              className={cn(
                "rounded-full border px-4 py-2 text-[0.875rem] font-medium transition-colors",
                destination === ""
                  ? "border-blue-600 bg-blue-600 text-white"
                  : "border-line-strong bg-paper text-navy-900 hover:border-blue-600 hover:text-blue-600",
              )}
            >
              All destinations
            </Link>
            {guides.map((guide) => (
              <Link
                key={guide.slug}
                href={`/scholarships?destination=${guide.slug}`}
                className={cn(
                  "rounded-full border px-4 py-2 text-[0.875rem] font-medium transition-colors",
                  destination === guide.slug
                    ? "border-blue-600 bg-blue-600 text-white"
                    : "border-line-strong bg-paper text-navy-900 hover:border-blue-600 hover:text-blue-600",
                )}
              >
                {guide.country}
              </Link>
            ))}
          </div>

          <p className="mt-6 max-w-2xl text-[0.9375rem] leading-relaxed text-body">
            {scholarshipScope.note}
          </p>

          {rows.length === 0 ? (
            <div className="mt-8 rounded-panel border border-dashed border-line-strong bg-surface p-8">
              <p className="text-[0.9375rem] leading-relaxed text-body">
                Nothing on this short list matches that filter yet. That is a gap in what we
                have curated, not a claim that no scholarship exists.
              </p>
            </div>
          ) : (
            <ul className="mt-8 grid gap-5 lg:grid-cols-2">
              {rows.map((scholarship) => {
                const guide = guides.find((item) => item.slug === scholarship.destination);
                return (
                  <li
                    key={scholarship.slug}
                    className="flex flex-col rounded-panel border border-line bg-paper p-6"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <h2 className="font-display text-[1.0625rem] font-bold text-navy-900">
                        {scholarship.name}
                      </h2>
                      {guide ? (
                        <Link
                          href={`/destinations/${guide.slug}`}
                          className="shrink-0 rounded-input bg-surface px-2.5 py-1 text-[0.75rem] font-medium text-navy-900 hover:bg-line"
                        >
                          {guide.country}
                        </Link>
                      ) : (
                        <span className="shrink-0 rounded-input bg-surface px-2.5 py-1 text-[0.75rem] font-medium text-navy-900">
                          {scholarship.destination}
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-[0.8125rem] text-muted">{scholarship.funder}</p>
                    <p className="mt-3 flex-1 text-[0.9375rem] leading-relaxed text-body">
                      {scholarship.coverage.state === "stated"
                        ? scholarship.coverage.value
                        : `Not stated here. ${scholarship.coverage.reason}`}
                    </p>
                    <p className="mt-3 text-[0.875rem] leading-relaxed text-muted">
                      <span className="font-medium text-navy-900">Deadline: </span>
                      {scholarship.deadline.state === "stated"
                        ? scholarship.deadline.value
                        : `Not stated here. ${scholarship.deadline.reason}`}
                    </p>
                    <p className="mt-2 text-[0.875rem] leading-relaxed text-body">
                      {scholarship.eligibility}
                    </p>
                    <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-3">
                      <a
                        href={scholarship.link}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="inline-flex items-center gap-1 text-[0.875rem] font-medium text-blue-600 hover:text-blue-500"
                      >
                        {scholarship.funder}&rsquo;s own page
                        <ArrowUpRight size={13} weight="bold" aria-hidden />
                      </a>
                      <span className="text-[0.75rem] text-muted">
                        Written down <span className="figures">{scholarship.statedOn}</span>
                      </span>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}

          <p className="mt-8 rounded-card border border-line bg-surface px-5 py-4 text-[0.8125rem] leading-relaxed text-muted">
            No admission chance, match score or fit percentage appears here, and none of
            these funders pay us anything for the listing. Read each scholarship&rsquo;s own
            page before you apply: deadlines and amounts are set by the funder and change
            every cycle.
          </p>
        </div>
      </section>
    </>
  );
}
