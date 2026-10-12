import { fold } from "@/lib/fold";
import type { VerificationStatus } from "@/content/types";

/**
 * The catalogue's queries, apart from its data.
 *
 * Everything here is a pure function over whatever rows it is handed, so the
 * course list can run the same filters in the browser, instantly, as the
 * server runs to render the first view from the URL. Nothing in this file
 * imports the catalogue itself, which keeps the forty-five universities out of
 * the browser's download.
 *
 * There is no ranking model, no relevance score and no personalisation, because
 * each of those would be a place to put a thumb on the scale, on a page that
 * also prints what we earn from each institution.
 */

/** The fields the queries read. A full programme row has all of them. */
export type QueryRow = {
  name: string;
  campus?: string;
  disciplines: string[];
  level: "bachelors" | "masters";
  currency: "GBP" | "EUR";
  durationMonths: number;
  feePerYear: { state: "stated"; value: number } | { state: "unknown" };
  intakes: { applicationDeadline: string }[];
  university: {
    name: string;
    city: string;
    destination: string;
    commission: { lowInr: number; highInr: number; aboveAverage?: boolean };
  };
};

/**
 * A course as the list shows it: the query fields plus what a row prints.
 * Built on the server from the full record, so the browser gets a few
 * hundred bytes a course instead of every sourced field behind it.
 */
export type CourseSummary = Omit<QueryRow, "intakes" | "university"> & {
  slug: string;
  languageOfInstruction: string;
  intakes: {
    name: string;
    applicationDeadline: string;
    status: "open" | "closing-soon" | "closed" | "not-yet-open";
  }[];
  university: QueryRow["university"] & {
    slug: string;
    flagCode: string;
    commission: QueryRow["university"]["commission"] & {
      display: string;
      status: VerificationStatus;
    };
  };
};

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

export const feeValue = (field: QueryRow["feePerYear"]): number | null =>
  field.state === "stated" ? field.value : null;

/**
 * What a student types, and what the catalogue calls it. Short forms are
 * expanded so "cs" finds Computer Science, and a country's other names find
 * its courses. Each alias is matched as a whole word, never inside one.
 */
const aliases: Record<string, string[]> = {
  cs: ["computer science"],
  cse: ["computer science"],
  ai: ["artificial intelligence"],
  ml: ["machine learning"],
  ds: ["data science"],
  ee: ["electrical"],
  ece: ["electrical"],
  mech: ["mechanical"],
  mba: ["business", "management"],
  uk: ["united kingdom"],
  britain: ["united kingdom"],
  england: ["united kingdom"],
  scotland: ["united kingdom"],
  deutschland: ["germany"],
  german: ["germany"],
  irish: ["ireland"],
};

const countryNames: Record<string, string> = {
  "united-kingdom": "united kingdom",
  germany: "germany",
  ireland: "ireland",
};

/**
 * Search as separate words, every one of which must match somewhere: "data
 * science germany" finds the German data science courses, where a single
 * phrase would have found nothing.
 */
function matchesQuery(row: QueryRow, query: string): boolean {
  const words = fold(query).split(/\s+/).filter(Boolean);
  if (words.length === 0) return true;
  const haystack = fold(
    [
      row.name,
      row.university.name,
      row.university.city,
      row.campus ?? "",
      countryNames[row.university.destination] ?? row.university.destination,
      ...row.disciplines,
    ].join(" "),
  );
  const starts = haystack.split(/[^a-z0-9]+/);
  // A short word matches only where a word begins: "cs" must not find
  // "analytics", nor "ai" find "maintenance".
  const found = (term: string) =>
    term.length <= 3 && !term.includes(" ")
      ? starts.some((part) => part.startsWith(term))
      : haystack.includes(term);
  return words.every((word) => [word, ...(aliases[word] ?? [])].some(found));
}

/**
 * Filters, applied independently.
 *
 * Every clause reads from the same immutable filter object, so no filter can
 * clear another one. Both benchmarks have lists where choosing a destination
 * silently resets the subject, and it is not a rendering bug: it is what
 * happens when each control mutates shared state on change rather than the
 * whole set being applied at once.
 */
export function applyFilters<T extends QueryRow>(rows: T[], filters: Filters): T[] {
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

    return matchesQuery(row, filters.query);
  });
}

/**
 * The earliest deadline still ahead of a given date, for the deadline sort.
 * A deadline is a calendar day, so it stays open through that whole day rather
 * than closing at the first minute of it.
 */
export function nextDeadline(row: Pick<QueryRow, "intakes">, from: Date | string = new Date()): string | null {
  const day = typeof from === "string" ? from : from.toISOString().slice(0, 10);
  const today = Date.parse(day);
  const upcoming = row.intakes
    .map((intake) => intake.applicationDeadline)
    .filter((date) => new Date(date).getTime() >= today)
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
export function sortProgrammes<T extends QueryRow>(
  rows: T[],
  key: string,
  today: Date | string = new Date(),
): T[] {
  const sorted = [...rows];

  const byFee = (direction: 1 | -1) => (a: T, b: T) => {
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
        const dateA = nextDeadline(a, today);
        const dateB = nextDeadline(b, today);
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
    if (Array.isArray(value)) return value.flatMap((item) => item.split(","));
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

export function formatFee(amount: number, currency: "GBP" | "EUR"): string {
  const symbol = currency === "GBP" ? "£" : "€";
  if (amount === 0) return "No tuition fee";
  return `${symbol}${amount.toLocaleString("en-GB")}`;
}

/** "2027-06-30" as a reader says it, "30 Jun 2027", the same on server and browser. */
export function formatDay(iso: string): string {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${iso}T00:00:00Z`));
}

/** Rupees as an Indian reader counts them: ₹17.9 lakh, or ₹85,000 under a lakh. */
export function formatLakh(rupees: number): string {
  if (rupees < 100000) return `₹${(Math.round(rupees / 1000) * 1000).toLocaleString("en-IN")}`;
  const lakh = rupees / 100000;
  return `₹${lakh >= 100 ? Math.round(lakh).toLocaleString("en-IN") : lakh.toFixed(1)} lakh`;
}
