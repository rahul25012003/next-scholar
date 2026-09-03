import type { Metadata } from "next";
import Link from "next/link";
import { MagnifyingGlass } from "@phosphor-icons/react/ssr";
import { corpusSummary, search } from "@/domain/search";
import { PageHero } from "@/components/marketing/page-hero";

export const metadata: Metadata = {
  title: "Search",
  description:
    "Search every guide, course, university, tool and policy on this site. Results that carry a commission figure carry it here too.",
  alternates: { canonical: "/search" },
  robots: { index: false, follow: true },
};

export default async function SearchPage(props: PageProps<"/search">) {
  const params = await props.searchParams;
  const query = typeof params.q === "string" ? params.q : "";
  const results = search(query);
  const summary = corpusSummary();
  const total = summary.reduce((sum, item) => sum + item.count, 0);

  return (
    <>
      <PageHero
        title="Search"
        lede={`Everything on this site, in one place: ${total} records across guides, courses, universities, written pieces, tools and policies. A result that carries a commission figure carries it here too, because a course found through a search box is the same course.`}
      />

      <section className="bg-paper py-10 md:py-14">
        <div className="shell max-w-3xl">
          <form method="get" action="/search" role="search">
            <label htmlFor="q" className="sr-only">
              Search this site
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <MagnifyingGlass
                  size={17}
                  weight="bold"
                  aria-hidden
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted"
                />
                <input
                  id="q"
                  name="q"
                  defaultValue={query}
                  autoFocus
                  placeholder="Blocked account, 28 day rule, dMAT, mechanical engineering"
                  className="w-full rounded-full border border-line-strong bg-paper py-3 pl-11 pr-4 text-[1rem] text-navy-900 placeholder:text-muted focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/25"
                />
              </div>
              <button
                type="submit"
                className="shrink-0 rounded-full bg-blue-600 px-6 text-[0.9375rem] font-medium text-white transition-colors hover:bg-blue-500"
              >
                Search
              </button>
            </div>
          </form>

          {query === "" && (
            <div className="mt-8 rounded-panel border border-line bg-surface p-6">
              <h2 className="font-display text-[1.0625rem] font-bold text-navy-900">
                What is searchable
              </h2>
              <dl className="mt-4 grid gap-3 sm:grid-cols-2">
                {summary.map((item) => (
                  <div key={item.kind} className="flex items-baseline justify-between gap-4">
                    <dt className="text-[0.9375rem] text-body">{item.kind}</dt>
                    <dd className="figures text-[0.9375rem] font-semibold text-navy-900">
                      {item.count}
                    </dd>
                  </div>
                ))}
              </dl>
              <p className="mt-5 text-[0.875rem] leading-relaxed text-muted">
                The search is a plain scan over the site&rsquo;s own content, scored by where
                the match landed: a title beats a summary, which beats the body. There is no
                relevance tuning, no click signal and no personalisation, because each of
                those would be a place to quietly promote a result on a site that also
                publishes what it earns from each one.
              </p>
            </div>
          )}

          {query !== "" && (
            <>
              <p className="mt-6 text-[0.875rem] text-muted">
                {results.length} result{results.length === 1 ? "" : "s"} for{" "}
                <span className="font-medium text-navy-900">{query}</span>.
              </p>

              {results.length === 0 ? (
                <div className="mt-5 rounded-panel border border-dashed border-line-strong bg-surface p-8">
                  <h2 className="font-display text-[1.125rem] font-bold text-navy-900">
                    Nothing on this site matches that
                  </h2>
                  <p className="mt-2 text-[0.9375rem] leading-relaxed text-body">
                    This searches {total} records across three destinations. If you were
                    looking for a fourth country, we do not cover one: a destination goes on
                    this site when its whole guide can be filled in, and that takes weeks per
                    country rather than an afternoon.
                  </p>
                  <div className="mt-5 flex flex-wrap gap-4 text-[0.9375rem]">
                    <Link
                      href="/destinations"
                      className="font-medium text-blue-600 hover:text-blue-500"
                    >
                      The three destinations
                    </Link>
                    <Link href="/tools" className="font-medium text-blue-600 hover:text-blue-500">
                      The free tools
                    </Link>
                    <Link href="/guides" className="font-medium text-blue-600 hover:text-blue-500">
                      The written guides
                    </Link>
                  </div>
                </div>
              ) : (
                <ul className="mt-5 divide-y divide-line rounded-panel border border-line bg-paper">
                  {results.map((result) => (
                    <li key={result.href + result.title} className="p-5 md:p-6">
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
                        <span className="rounded-input bg-surface px-2 py-0.5 text-[0.6875rem] font-medium text-neutral-chip">
                          {result.kind}
                        </span>
                        {result.commission && (
                          <span
                            className={
                              result.commission === "₹0"
                                ? "rounded-input bg-verified-bg px-2 py-0.5 text-[0.6875rem] font-medium text-verified"
                                : "rounded-input bg-neutral-chip-bg px-2 py-0.5 text-[0.6875rem] font-medium text-neutral-chip"
                            }
                          >
                            We earn <span className="figures">{result.commission}</span>
                          </span>
                        )}
                        {result.minutes && (
                          <span className="text-[0.75rem] text-muted">
                            {result.minutes} min read
                          </span>
                        )}
                      </div>
                      <h2 className="mt-2 font-display text-[1.0625rem] font-bold leading-snug text-navy-900">
                        <Link href={result.href} className="hover:text-blue-600">
                          {result.title}
                        </Link>
                      </h2>
                      <p className="mt-1.5 text-[0.9375rem] leading-relaxed text-body">
                        {result.detail}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </>
          )}
        </div>
      </section>
    </>
  );
}
