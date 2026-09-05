import type { Metadata } from "next";
import Link from "next/link";
import { guides } from "@/content/guides";
import { outcomeLabel, publishableReviews, reviewsScope, type ReviewOutcome } from "@/content/reviews";
import { PageHero } from "@/components/marketing/page-hero";
import { ButtonLink } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Reviews",
  description:
    "Every review here is checked by a named member of staff against the actual case record before it is published, refusals included. No rating number, and nothing published while it is unchecked.",
  alternates: { canonical: "/reviews" },
};

const PAGE_SIZE = 10;

export default async function ReviewsPage(props: PageProps<"/reviews">) {
  const params = await props.searchParams;
  const destination = typeof params.destination === "string" ? params.destination : "";
  const outcome = typeof params.outcome === "string" ? (params.outcome as ReviewOutcome) : "";
  const page = Math.max(1, Number(params.page) || 1);

  const all = publishableReviews()
    .filter((review) => !destination || review.destination === destination)
    .filter((review) => !outcome || review.outcome === outcome)
    .sort((a, b) => (b.verifiedOn ?? "").localeCompare(a.verifiedOn ?? ""));

  const start = (page - 1) * PAGE_SIZE;
  const rows = all.slice(start, start + PAGE_SIZE);
  const totalPages = Math.max(1, Math.ceil(all.length / PAGE_SIZE));

  return (
    <>
      <PageHero
        title="Reviews"
        lede="Checked against the actual case record by a named member of staff before publication, refusals included. No star rating anywhere: a rating is a number we would have computed, and this page publishes what the reviewer actually said instead."
      />

      <section className="band bg-paper">
        <div className="shell">
          <form method="get" action="/reviews" className="flex flex-wrap items-end gap-4">
            <label className="block">
              <span className="block text-[0.8125rem] font-medium text-navy-900">Destination</span>
              <select
                name="destination"
                defaultValue={destination}
                className="mt-1.5 rounded-input border border-line-strong bg-paper px-3 py-2 text-[0.875rem] text-navy-900"
              >
                <option value="">All</option>
                {guides.map((guide) => (
                  <option key={guide.slug} value={guide.slug}>
                    {guide.country}
                  </option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="block text-[0.8125rem] font-medium text-navy-900">Outcome</span>
              <select
                name="outcome"
                defaultValue={outcome}
                className="mt-1.5 rounded-input border border-line-strong bg-paper px-3 py-2 text-[0.875rem] text-navy-900"
              >
                <option value="">All, refusals included</option>
                {(Object.keys(outcomeLabel) as ReviewOutcome[]).map((key) => (
                  <option key={key} value={key}>
                    {outcomeLabel[key]}
                  </option>
                ))}
              </select>
            </label>
            <button
              type="submit"
              className="rounded-full bg-blue-600 px-5 py-2.5 text-[0.875rem] font-medium text-white transition-colors hover:bg-blue-500"
            >
              Apply
            </button>
          </form>

          <p className="mt-6 max-w-2xl text-[0.9375rem] leading-relaxed text-body">
            {reviewsScope.note}
          </p>

          {rows.length === 0 ? (
            <div className="mt-8 rounded-panel border border-dashed border-line-strong bg-surface p-8">
              <h2 className="font-display text-[1.125rem] font-bold text-navy-900">
                No verified reviews published yet
              </h2>
              <p className="mt-2 max-w-2xl text-[0.9375rem] leading-relaxed text-body">
                No client has completed a real, checked outcome yet. This is the honest
                state rather than a placeholder quote, and it will change the day a real one
                clears verification.
              </p>
              <ButtonLink href="/our-numbers" className="mt-6">
                What we publish instead, today
              </ButtonLink>
            </div>
          ) : (
            <>
              <ul className="mt-8 grid gap-5 md:grid-cols-2">
                {rows.map((review) => {
                  const guide = guides.find((item) => item.slug === review.destination);
                  return (
                    <li key={review.id} className="rounded-panel border border-line bg-paper p-6">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <span className="rounded-input bg-surface px-2.5 py-1 text-[0.75rem] font-medium text-navy-900">
                          {outcomeLabel[review.outcome]}
                        </span>
                        <span className="text-[0.8125rem] text-muted">
                          {guide?.country ?? review.destination}
                          {review.route ? `, ${review.route}` : ""}
                        </span>
                      </div>
                      <p className="mt-4 text-[0.9375rem] leading-relaxed text-body">
                        &ldquo;{review.quote}&rdquo;
                      </p>
                      <p className="mt-4 text-[0.8125rem] text-muted">
                        {review.studentName}, {review.intake} intake
                      </p>
                      <p className="mt-1 text-[0.75rem] text-muted">
                        Checked by {review.verifiedBy} against the case record,{" "}
                        <span className="figures">{review.verifiedOn}</span>
                      </p>
                    </li>
                  );
                })}
              </ul>

              {totalPages > 1 && (
                <nav aria-label="Pagination" className="mt-8 flex justify-center gap-2">
                  {Array.from({ length: totalPages }, (_, index) => index + 1).map((number) => (
                    <Link
                      key={number}
                      href={`/reviews?${new URLSearchParams({
                        ...(destination ? { destination } : {}),
                        ...(outcome ? { outcome } : {}),
                        page: String(number),
                      }).toString()}`}
                      className={
                        number === page
                          ? "grid h-9 w-9 place-items-center rounded-full bg-blue-600 text-[0.875rem] font-medium text-white"
                          : "grid h-9 w-9 place-items-center rounded-full border border-line-strong text-[0.875rem] font-medium text-navy-900 hover:border-blue-600"
                      }
                    >
                      {number}
                    </Link>
                  ))}
                </nav>
              )}
            </>
          )}
        </div>
      </section>
    </>
  );
}
