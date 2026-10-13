import type { Metadata } from "next";
import Link from "next/link";
import { universities } from "@/content/catalogue";
import { guides } from "@/content/guides";
import { PageHero } from "@/components/marketing/page-hero";
import { cn } from "@/lib/cn";

export const metadata: Metadata = {
  title: "Rankings",
  description:
    "Every published ranking for the forty-five institutions in our catalogue, each with its source and year. Listed A to Z, not by rank.",
  alternates: { canonical: "/universities/rankings" },
};

const rankingBodies = ["QS World University Rankings", "QS Subject Rankings", "THE World University Rankings"];

const countryName: Record<string, string> = {
  "united-kingdom": "United Kingdom",
  germany: "Germany",
  ireland: "Ireland",
};

export default async function RankingsPage(props: PageProps<"/universities/rankings">) {
  const params = await props.searchParams;
  const query = (typeof params.q === "string" ? params.q : "").trim().toLowerCase();
  const destination = typeof params.destination === "string" ? params.destination : "";
  const body = typeof params.body === "string" ? params.body : "";

  const rows = [...universities]
    .filter((university) => !destination || university.destination === destination)
    .filter(
      (university) => !body || university.rankings.some((ranking) => ranking.body === body),
    )
    .filter((university) => {
      if (!query) return true;
      return (
        university.name.toLowerCase().includes(query) ||
        university.city.toLowerCase().includes(query)
      );
    })
    .sort((a, b) => a.name.localeCompare(b.name));

  return (
    <>
      <PageHero
        title="Rankings, as published"
        lede="Listed A to Z, not by rank. QS and Times Higher use different scales, so we do not average them or sort by them."
      />

      <section className="band">
        <div className="shell">
          <form method="get" action="/universities/rankings" className="grid gap-4">
            {destination && <input type="hidden" name="destination" value={destination} />}
            {body && <input type="hidden" name="body" value={body} />}
            <input
              type="text"
              name="q"
              defaultValue={typeof params.q === "string" ? params.q : ""}
              placeholder="Search by institution or city"
              aria-label="Search by institution or city"
              className="w-full max-w-md rounded-card border border-line-strong bg-white px-3.5 py-2.5 text-[0.9375rem] text-blue-dark placeholder:text-grey"
            />

            <div className="flex flex-wrap items-center gap-2.5">
              <span className="text-[0.8125rem] font-medium text-grey">Destination</span>
              <FilterPill href="/universities/rankings" active={!destination} label="All" q={query} body={body} />
              {guides.map((guide) => (
                <FilterPill
                  key={guide.slug}
                  href="/universities/rankings"
                  active={destination === guide.slug}
                  label={guide.country}
                  paramName="destination"
                  paramValue={guide.slug}
                  q={query}
                  body={body}
                />
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <span className="text-[0.8125rem] font-medium text-grey">Ranking body</span>
              <FilterPill href="/universities/rankings" active={!body} label="All" q={query} destination={destination} />
              {rankingBodies.map((item) => (
                <FilterPill
                  key={item}
                  href="/universities/rankings"
                  active={body === item}
                  label={item}
                  paramName="body"
                  paramValue={item}
                  q={query}
                  destination={destination}
                />
              ))}
            </div>

            <div>
              <button
                type="submit"
                className="button"
              >
                Search
              </button>
            </div>
          </form>

          <p className="mt-6 text-[0.8125rem] text-grey">
            {rows.length} of {universities.length} institutions match.
          </p>

          <div className="mt-4 overflow-x-auto rounded-panel border border-line">
            <table className="table-stack w-full border-collapse text-left md:min-w-[42rem]">
              <caption className="sr-only">
                Every published ranking for each institution in the catalogue, filtered by the
                controls above
              </caption>
              <thead>
                <tr className="border-b border-line bg-light">
                  <th scope="col" className="px-5 py-3.5 text-[0.8125rem] font-semibold text-blue-dark">
                    Institution
                  </th>
                  <th scope="col" className="px-5 py-3.5 text-[0.8125rem] font-semibold text-blue-dark">
                    Published rankings
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.map((university) => (
                  <tr key={university.slug} className="border-b border-line last:border-0">
                    <td className="px-5 py-4 align-top">
                      <Link
                        href={`/universities/${university.slug}`}
                        className="font-medium text-blue-dark hover:text-pink"
                      >
                        {university.name}
                      </Link>
                      <p className="mt-0.5 text-[0.8125rem] text-grey">
                        {university.city}, {countryName[university.destination] ?? university.destination}
                      </p>
                    </td>
                    <td data-label="Published rankings" className="px-5 py-4 align-top">
                      {university.rankings.length === 0 ? (
                        <span className="text-[0.875rem] text-grey">
                          Nothing published that we have checked yet.
                        </span>
                      ) : (
                        <ul className="space-y-1.5">
                          {university.rankings.map((ranking) => (
                            <li
                              key={`${ranking.body}-${ranking.year}-${ranking.scope}`}
                              className="text-[0.875rem] leading-relaxed text-grey"
                            >
                              <span className="font-medium text-blue-dark">{ranking.rank}</span>{" "}
                              in {ranking.scope}, {ranking.body}{" "}
                              <span className="figures">{ranking.year}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </td>
                  </tr>
                ))}
                {rows.length === 0 && (
                  <tr>
                    <td colSpan={2} className="px-5 py-8 text-center text-[0.9375rem] text-grey">
                      Nothing matches those filters in this catalogue.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <p className="mt-6 max-w-2xl text-[0.875rem] leading-relaxed text-grey">
            Forty-five institutions, chosen by hand. See{" "}
            <Link href="/universities" className="font-medium text-pink hover:text-blue-dark">
              the full catalogue
            </Link>{" "}
            for fees and courses.
          </p>
        </div>
      </section>
    </>
  );
}

function FilterPill({
  href,
  active,
  label,
  paramName,
  paramValue,
  q,
  destination,
  body,
}: {
  href: string;
  active: boolean;
  label: string;
  paramName?: "destination" | "body";
  paramValue?: string;
  q?: string;
  destination?: string;
  body?: string;
}) {
  const params = new URLSearchParams();
  if (q) params.set("q", q);
  if (paramName === "destination" ? paramValue : destination) {
    params.set("destination", paramName === "destination" ? paramValue! : destination!);
  }
  if (paramName === "body" ? paramValue : body) {
    params.set("body", paramName === "body" ? paramValue! : body!);
  }
  const url = params.toString() ? `${href}?${params.toString()}` : href;

  return (
    <Link
      href={url}
      className={cn(
        "button",
        active
          ? "button--selected"
          : "button--light",
      )}
    >
      {label}
    </Link>
  );
}
