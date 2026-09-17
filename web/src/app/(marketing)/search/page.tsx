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

      <section className="band">
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
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-grey"
                />
                <input
                  id="q"
                  name="q"
                  defaultValue={query}
                  autoFocus
                  placeholder="Blocked account, 28 day rule, dMAT, mechanical engineering"
                  className="w-full rounded-full border border-line-strong bg-white py-3 pl-11 pr-4 text-blue-dark placeholder:text-grey focus:border-pink focus:outline-none focus:ring-2 focus:ring-pink/25"
                />
              </div>
              <button
                type="submit"
                className="shrink-0 button"
              >
                Search
              </button>
            </div>
          </form>

          {query === "" && (
            <div className="mt-8 rounded-panel border border-line bg-light p-6">
              <h2 className="text-blue-dark h--6">
                What is searchable
              </h2>
              <dl className="mt-4 grid gap-3 sm:grid-cols-2">
                {summary.map((item) => (
                  <div key={item.kind} className="flex items-baseline justify-between gap-4">
                    <dt className="text-[0.9375rem] text-grey">{item.kind}</dt>
                    <dd className="figures text-[0.9375rem] font-semibold text-blue-dark">
                      {item.count}
                    </dd>
                  </div>
                ))}
              </dl>
              <p className="mt-5 text-[0.875rem] leading-relaxed text-grey">
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
              <p className="mt-6 text-[0.875rem] text-grey">
                {results.length} result{results.length === 1 ? "" : "s"} for{" "}
                <span className="font-medium text-blue-dark">{query}</span>.
              </p>

              {results.length === 0 ? (
                <div className="mt-5 rounded-panel border border-dashed border-line-strong bg-light p-8">
                  <h2 className="text-blue-dark h--5">
                    Nothing on this site matches that
                  </h2>
                  <p className="mt-2 text-[0.9375rem] leading-relaxed text-grey">
                    This searches {total} records across three destinations. If you were
                    looking for a fourth country, we do not cover one: a destination goes on
                    this site when its whole guide can be filled in, and that takes weeks per
                    country rather than an afternoon.
                  </p>
                  <div className="mt-5 flex flex-wrap gap-4 text-[0.9375rem]">
                    <Link
                      href="/destinations"
                      className="font-medium text-pink hover:text-blue-dark"
                    >
                      The three destinations
                    </Link>
                    <Link href="/tools" className="font-medium text-pink hover:text-blue-dark">
                      The free tools
                    </Link>
                    <Link href="/guides" className="font-medium text-pink hover:text-blue-dark">
                      The written guides
                    </Link>
                  </div>
                </div>
              ) : (
                <ul className="mt-5 divide-y divide-line rounded-panel border border-line bg-white">
                  {results.map((result) => (
                    <li key={result.href + result.title} className="p-5 md:p-6">
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
                        <span className="rounded-card bg-light px-2 py-0.5 text-[0.6875rem] font-medium text-neutral-chip">
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
                          <span className="text-[0.75rem] text-grey">
                            {result.minutes} min read
                          </span>
                        )}
                      </div>
                      <h2 className="mt-2 text-blue-dark h--6">
                        <Link href={result.href} className="hover:text-pink">
                          {result.title}
                        </Link>
                      </h2>
                      <p className="mt-1.5 text-[0.9375rem] leading-relaxed text-grey">
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
