import type { Metadata } from "next";
import Link from "next/link";
import { universities } from "@/content/catalogue";
import { PageHero } from "@/components/marketing/page-hero";

export const metadata: Metadata = {
  title: "Rankings",
  description:
    "Every ranking published for the fifteen institutions in our catalogue, each naming its own body and year. Sorted alphabetically, never by rank, because comparing a rank from one body against a rank from another would be inventing a number nobody published.",
  alternates: { canonical: "/universities/rankings" },
};

export default function RankingsPage() {
  const rows = [...universities].sort((a, b) => a.name.localeCompare(b.name));

  return (
    <>
      <PageHero
        title="Rankings, as published"
        lede="Alphabetical by institution, not by rank. A QS band and a Times Higher band are not the same scale, and averaging or reordering by them would be a number we invented rather than one anybody published."
      />

      <section className="band bg-paper">
        <div className="shell">
          <div className="overflow-x-auto rounded-panel border border-line">
            <table className="w-full min-w-[42rem] border-collapse text-left">
              <caption className="sr-only">
                Every published ranking for each institution in the catalogue
              </caption>
              <thead>
                <tr className="border-b border-line bg-surface">
                  <th scope="col" className="px-5 py-3.5 text-[0.8125rem] font-semibold text-navy-900">
                    Institution
                  </th>
                  <th scope="col" className="px-5 py-3.5 text-[0.8125rem] font-semibold text-navy-900">
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
                        className="font-medium text-navy-900 hover:text-blue-600"
                      >
                        {university.name}
                      </Link>
                      <p className="mt-0.5 text-[0.8125rem] text-muted">
                        {university.city}, {university.destination === "united-kingdom" ? "United Kingdom" : university.destination === "germany" ? "Germany" : "Ireland"}
                      </p>
                    </td>
                    <td className="px-5 py-4 align-top">
                      {university.rankings.length === 0 ? (
                        <span className="text-[0.875rem] text-muted">
                          Nothing published that we have checked yet.
                        </span>
                      ) : (
                        <ul className="space-y-1.5">
                          {university.rankings.map((ranking) => (
                            <li
                              key={`${ranking.body}-${ranking.year}-${ranking.scope}`}
                              className="text-[0.875rem] leading-relaxed text-body"
                            >
                              <span className="font-medium text-navy-900">{ranking.rank}</span>{" "}
                              in {ranking.scope}, {ranking.body}{" "}
                              <span className="figures">{ranking.year}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="mt-6 max-w-2xl text-[0.875rem] leading-relaxed text-muted">
            Fifteen institutions, seeded by hand. See{" "}
            <Link href="/universities" className="font-medium text-blue-600 hover:text-blue-500">
              the full catalogue
            </Link>{" "}
            for fees, commission and courses.
          </p>
        </div>
      </section>
    </>
  );
}
