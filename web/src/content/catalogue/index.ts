import { germanUniversities } from "./germany";
import { irishUniversities } from "./ireland";
import { ukUniversities } from "./united-kingdom";
import type { Field, Programme, University } from "./types";

export * from "./types";

/**
 * The catalogue, and the queries over it.
 *
 * Seeded for exactly the three destinations this business covers. It is
 * deliberately small: fewer than thirty institutions whose pages have been read is worth
 * more than four hundred scraped ones, and a catalogue is the easiest place in
 * a product like this to accumulate figures nobody has ever checked.
 *
 * Everything below is a pure function over a static array. There is no ranking
 * model, no relevance score and no personalisation, because each of those would
 * be a place to put a thumb on the scale, on a page that also prints what we
 * earn from each institution.
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

export type Filters = {
  destinations: string[];
  disciplines: string[];
  levels: ("bachelors" | "masters")[];
  /** In the destination's own currency, so the two are not compared directly. */
  maxFeeGbp: number | null;
  maxFeeEur: number | null;
  /** Only institutions that pay us nothing. The filter nobody else offers. */
  zeroCommissionOnly: boolean;
  /** Hide institutions whose band runs above the category average. */
  hideAboveAverage: boolean;
  /** Only programmes with a published fee, for a student comparing costs. */
  publishedFeeOnly: boolean;
  query: string;
};

export const emptyFilters: Filters = {
  destinations: [],
  disciplines: [],
  levels: [],
  maxFeeGbp: null,
  maxFeeEur: null,
  zeroCommissionOnly: false,
  hideAboveAverage: false,
  publishedFeeOnly: false,
  query: "",
};

const feeValue = (field: Field<number>): number | null =>
  field.state === "stated" ? field.value : null;

/**
 * Filters, applied independently.
 *
 * Every clause reads from the same immutable filter object, so no filter can
 * clear another one. Both benchmarks have lists where choosing a destination
 * silently resets the subject, and it is not a rendering bug: it is what
 * happens when each control mutates shared state on change rather than the
 * whole set being applied at once.
 */
export function applyFilters(rows: ProgrammeRow[], filters: Filters): ProgrammeRow[] {
  const query = filters.query.trim().toLowerCase();

  return rows.filter((row) => {
    if (
      filters.destinations.length > 0 &&
      !filters.destinations.includes(row.university.destination)
    ) {
      return false;
    }

    if (
      filters.disciplines.length > 0 &&
      !row.disciplines.some((discipline) => filters.disciplines.includes(discipline))
    ) {
      return false;
    }

    if (filters.levels.length > 0 && !filters.levels.includes(row.level)) return false;

    const fee = feeValue(row.feePerYear);

    if (filters.publishedFeeOnly && fee === null) return false;

    if (filters.maxFeeGbp !== null && row.currency === "GBP") {
      if (fee === null || fee > filters.maxFeeGbp) return false;
    }
    if (filters.maxFeeEur !== null && row.currency === "EUR") {
      if (fee === null || fee > filters.maxFeeEur) return false;
    }

    if (filters.zeroCommissionOnly && row.university.commission.highInr > 0) return false;
    if (filters.hideAboveAverage && row.university.commission.aboveAverage) return false;

    if (query) {
      const haystack = [
        row.name,
        row.university.name,
        row.university.city,
        row.campus,
        ...row.disciplines,
      ]
        .join(" ")
        .toLowerCase();
      if (!haystack.includes(query)) return false;
    }

    return true;
  });
}

/** The earliest deadline still ahead of a given date, for the deadline sort. */
export function nextDeadline(row: ProgrammeRow, from = new Date()): string | null {
  const upcoming = row.intakes
    .map((intake) => intake.applicationDeadline)
    .filter((date) => new Date(date).getTime() >= from.getTime())
    .sort();
  return upcoming[0] ?? null;
}

/**
 * Sorting.
 *
 * A programme with no published fee sorts last on both fee orders rather than
 * being treated as free or as infinite, because either of those would be a
 * silent claim about a figure the institution has not published.
 */
export function sortProgrammes(rows: ProgrammeRow[], key: string): ProgrammeRow[] {
  const sorted = [...rows];

  const byFee = (direction: 1 | -1) => (a: ProgrammeRow, b: ProgrammeRow) => {
    const feeA = feeValue(a.feePerYear);
    const feeB = feeValue(b.feePerYear);
    if (feeA === null && feeB === null) return a.name.localeCompare(b.name);
    if (feeA === null) return 1;
    if (feeB === null) return -1;
    return (feeA - feeB) * direction;
  };

  switch (key) {
    case "fee-asc":
      return sorted.sort(byFee(1));
    case "fee-desc":
      return sorted.sort(byFee(-1));
    case "commission-asc":
      return sorted.sort(
        (a, b) =>
          a.university.commission.lowInr - b.university.commission.lowInr ||
          a.university.name.localeCompare(b.university.name),
      );
    case "commission-desc":
      return sorted.sort(
        (a, b) =>
          b.university.commission.highInr - a.university.commission.highInr ||
          a.university.name.localeCompare(b.university.name),
      );
    case "deadline":
      return sorted.sort((a, b) => {
        const dateA = nextDeadline(a);
        const dateB = nextDeadline(b);
        if (dateA === null && dateB === null) return 0;
        if (dateA === null) return 1;
        if (dateB === null) return -1;
        return dateA.localeCompare(dateB);
      });
    case "duration":
      return sorted.sort((a, b) => a.durationMonths - b.durationMonths);
    default:
      return sorted.sort(
        (a, b) =>
          a.university.name.localeCompare(b.university.name) ||
          a.name.localeCompare(b.name),
      );
  }
}

/** Reads filters out of a URL query string, so a filtered list is linkable. */
export function filtersFromParams(
  params: Record<string, string | string[] | undefined>,
): Filters {
  const list = (key: string): string[] => {
    const value = params[key];
    if (Array.isArray(value)) return value;
    if (typeof value === "string" && value !== "") return value.split(",");
    return [];
  };
  const number = (key: string): number | null => {
    const value = params[key];
    if (typeof value !== "string" || value === "") return null;
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  };
  const flag = (key: string): boolean => params[key] === "1" || params[key] === "true";

  return {
    destinations: list("destination"),
    disciplines: list("discipline"),
    levels: list("level").filter(
      (value): value is "bachelors" | "masters" =>
        value === "bachelors" || value === "masters",
    ),
    maxFeeGbp: number("maxGbp"),
    maxFeeEur: number("maxEur"),
    zeroCommissionOnly: flag("zeroCommission"),
    hideAboveAverage: flag("hideAboveAverage"),
    publishedFeeOnly: flag("publishedFee"),
    query: typeof params.q === "string" ? params.q : "",
  };
}

/** Turns filters back into a query string, for a shareable result page. */
export function paramsFromFilters(filters: Filters): string {
  const params = new URLSearchParams();
  if (filters.destinations.length) params.set("destination", filters.destinations.join(","));
  if (filters.disciplines.length) params.set("discipline", filters.disciplines.join(","));
  if (filters.levels.length) params.set("level", filters.levels.join(","));
  if (filters.maxFeeGbp !== null) params.set("maxGbp", String(filters.maxFeeGbp));
  if (filters.maxFeeEur !== null) params.set("maxEur", String(filters.maxFeeEur));
  if (filters.zeroCommissionOnly) params.set("zeroCommission", "1");
  if (filters.hideAboveAverage) params.set("hideAboveAverage", "1");
  if (filters.publishedFeeOnly) params.set("publishedFee", "1");
  if (filters.query) params.set("q", filters.query);
  return params.toString();
}

export function activeFilterCount(filters: Filters): number {
  return (
    filters.destinations.length +
    filters.disciplines.length +
    filters.levels.length +
    (filters.maxFeeGbp !== null ? 1 : 0) +
    (filters.maxFeeEur !== null ? 1 : 0) +
    (filters.zeroCommissionOnly ? 1 : 0) +
    (filters.hideAboveAverage ? 1 : 0) +
    (filters.publishedFeeOnly ? 1 : 0) +
    (filters.query ? 1 : 0)
  );
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
  note: "Twenty-eight institutions and thirty-five programmes, seeded by hand across the three destinations this business covers in full. It is not a complete list of universities in those countries and it does not claim to be. Institutions are added when their page has been read, not when a feed makes them available.",
  omissions: [
    "No institution appears here because it pays us. Nine of the twenty-eight pay us nothing at all, and they are on the list for the same reason as the rest.",
    "No ranking on this catalogue is ours. Every one names the body that published it and the year.",
    "No admission chance, match score or fit percentage appears anywhere, because we would have to invent it.",
  ],
};
