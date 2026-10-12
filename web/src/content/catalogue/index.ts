import { germanUniversities } from "./germany";
import { irishUniversities } from "./ireland";
import { ukUniversities } from "./united-kingdom";
import type { Programme, University } from "./types";
import type { CourseSummary } from "./query";

export * from "./types";
export * from "./query";

/**
 * The catalogue, and the queries over it.
 *
 * Seeded for exactly the three destinations this business covers. It is
 * deliberately small: forty-five institutions whose pages have been read is worth
 * more than four hundred scraped ones, and a catalogue is the easiest place in
 * a product like this to accumulate figures nobody has ever checked.
 *
 * The filters and sorts over it live in ./query, apart from the data, so the
 * course list can run them in the browser without downloading the catalogue.
 */
export const universities: University[] = [
  ...ukUniversities,
  ...germanUniversities,
  ...irishUniversities,
];

export type ProgrammeRow = Programme & { university: University };

export const programmes: ProgrammeRow[] = universities.flatMap((university) =>
  university.programmes.map((programme) => ({ ...programme, university })),
);

/**
 * The courses as the list shows them: only what a row prints and the filters
 * read, so the browser receives a few kilobytes rather than every sourced
 * field behind each course.
 */
export function courseSummaries(rows: ProgrammeRow[] = programmes): CourseSummary[] {
  return rows.map((row) => {
    const { university } = row;
    return {
      slug: row.slug,
      name: row.name,
      campus: row.campus,
      disciplines: row.disciplines,
      level: row.level,
      currency: row.currency,
      durationMonths: row.durationMonths,
      languageOfInstruction: row.languageOfInstruction,
      feePerYear:
        row.feePerYear.state === "stated"
          ? { state: "stated", value: row.feePerYear.value }
          : { state: "unknown" },
      intakes: row.intakes.map(({ name, applicationDeadline, status }) => ({
        name,
        applicationDeadline,
        status,
      })),
      university: {
        slug: university.slug,
        name: university.name,
        city: university.city,
        destination: university.destination,
        flagCode: university.flagCode,
        commission: {
          display: university.commission.display,
          status: university.commission.status,
          lowInr: university.commission.lowInr,
          highInr: university.commission.highInr,
          aboveAverage: university.commission.aboveAverage,
        },
      },
    };
  });
}

export function universityFor(slug: string): University | null {
  return universities.find((item) => item.slug === slug) ?? null;
}

export function programmeFor(slug: string): ProgrammeRow | null {
  return programmes.find((item) => item.slug === slug) ?? null;
}

export function universitiesIn(destination: string): University[] {
  return universities.filter((item) => item.destination === destination);
}

/** Every discipline in the catalogue, alphabetical, with a count. */
export function disciplines(): { name: string; count: number }[] {
  const counts = new Map<string, number>();
  for (const programme of programmes) {
    for (const discipline of programme.disciplines) {
      counts.set(discipline, (counts.get(discipline) ?? 0) + 1);
    }
  }
  return [...counts.entries()]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

/**
 * What the catalogue does not contain, stated on the page rather than implied
 * by an empty result. A student who searches for a country we do not cover
 * should be told that, not shown zero results.
 */
export const catalogueScope = {
  destinations: ["United Kingdom", "Germany", "Ireland"],
  statedOn: "2026-09-10",
  checkedBy: null as string | null,
  note: "Forty-five institutions and fifty-two programmes, seeded by hand across the three destinations this business covers in full. It is not a complete list of universities in those countries and it does not claim to be. Institutions are added when their page has been read, not when a feed makes them available.",
  omissions: [
    "No institution appears here because it pays us. Fifteen of the forty-five pay us nothing at all, and they are on the list for the same reason as the rest.",
    "No ranking on this catalogue is ours. Every one names the body that published it and the year.",
    "No admission chance, match score or fit percentage appears anywhere, because we would have to invent it.",
  ],
};
