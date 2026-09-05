import { stated, unknown, type Field } from "@/content/catalogue/types";

const ON = "2026-09-05";

/**
 * Scholarships, modelled the same way the catalogue is: a value with a source
 * and a date, or an absence with a reason. A funder's own cycle dates move
 * every year, and a scholarship page that prints last year's deadline as this
 * year's is worse than one that says plainly when to go and check.
 *
 * This is a short, hand-picked list of national or cross-institutional
 * schemes actually open to Indian students on our three routes, not a scrape.
 * A university's own named scholarships belong on its programme page once
 * someone has read it there, which nobody has done yet.
 */

export type Scholarship = {
  slug: string;
  name: string;
  /** The body that runs it, not us. */
  funder: string;
  destination: string;
  levels: ("bachelors" | "masters" | "phd")[];
  awardType: "full" | "partial" | "stipend";
  /** What it actually covers or pays, as published. */
  coverage: Field<string>;
  /** Framed as the historical cycle, because the current year's exact date is the funder's to publish. */
  deadline: Field<string>;
  eligibility: string;
  link: string;
  source: string;
  statedOn: string;
};

export const scholarships: Scholarship[] = [
  {
    slug: "chevening",
    name: "Chevening Scholarships",
    funder: "UK Foreign, Commonwealth and Development Office",
    destination: "united-kingdom",
    levels: ["masters"],
    awardType: "full",
    coverage: stated(
      "Tuition fees, a monthly stipend, return airfare and an arrival allowance for a one year taught Master's",
      "Chevening Secretariat",
      ON,
    ),
    deadline: stated(
      "Historically opens in August and closes in early November for entry the following autumn",
      "Chevening Secretariat",
      ON,
      "The current cycle's exact date is published on chevening.org each year, not stated here",
    ),
    eligibility:
      "Indian nationals with at least two years of work experience, returning to India for at least two years after the award. Highly competitive.",
    link: "https://www.chevening.org/scholarship/india/",
    source: "Chevening Secretariat",
    statedOn: ON,
  },
  {
    slug: "great-scholarships",
    name: "GREAT Scholarships",
    funder: "British Council, with partner UK universities",
    destination: "united-kingdom",
    levels: ["masters"],
    awardType: "partial",
    coverage: stated(
      "GBP 10,000 toward one year's tuition at a participating university, one award per partner institution",
      "British Council India",
      ON,
    ),
    deadline: unknown(
      "The partner list and each university's own deadline change every cycle. The British Council India page names the current partner universities and their dates."
    ),
    eligibility:
      "Indian nationals holding an offer at one of the year's participating universities, for the specific subject area each partner names.",
    link: "https://www.britishcouncil.in/study-uk/scholarships/great-scholarships",
    source: "British Council India",
    statedOn: ON,
  },
  {
    slug: "daad-masters",
    name: "DAAD Scholarships for Development-Related Postgraduate Courses (EPOS)",
    funder: "German Academic Exchange Service (DAAD)",
    destination: "germany",
    levels: ["masters", "phd"],
    awardType: "full",
    coverage: stated(
      "A monthly stipend (EUR 934 for Master's students at the time this was written), health insurance, and travel and study allowances",
      "DAAD",
      ON,
      "The stipend figure is revised periodically by DAAD and should be read against its current published rate, not this one",
    ),
    deadline: stated(
      "Varies by the specific EPOS programme; most close in the preceding autumn or winter for an autumn intake a year later",
      "DAAD",
      ON,
      "Each participating Master's programme sets and publishes its own deadline on the DAAD scholarship database",
    ),
    eligibility:
      "Graduates from developing countries, India included, applying to a DAAD-listed development-related Master's, usually with at least two years' relevant work experience.",
    link: "https://www2.daad.de/deutschland/stipendium/datenbank/en/",
    source: "DAAD",
    statedOn: ON,
  },
  {
    slug: "erasmus-mundus",
    name: "Erasmus Mundus Joint Master's Degrees",
    funder: "European Commission",
    destination: "germany",
    levels: ["masters"],
    awardType: "full",
    coverage: stated(
      "Full tuition (participation cost) plus a monthly stipend and travel allowance, for a two year Master's studied across at least two European countries",
      "European Commission, Erasmus+ programme",
      ON,
    ),
    deadline: unknown(
      "Each joint programme runs its own admissions cycle and deadline. The Erasmus Mundus catalogue lists every current programme with its own dates."
    ),
    eligibility:
      "Open worldwide, India included. Selection is by the consortium running each specific joint degree, not centrally.",
    link: "https://www.eacea.ec.europa.eu/scholarships/erasmus-mundus-catalogue_en",
    source: "European Commission",
    statedOn: ON,
  },
  {
    slug: "goi-ireland",
    name: "Government of Ireland International Education Scholarships",
    funder: "Higher Education Authority, Ireland",
    destination: "ireland",
    levels: ["masters", "phd"],
    awardType: "full",
    coverage: stated(
      "EUR 10,000 toward one year's tuition plus a EUR 10,000 living cost contribution, against the actual cost of the programme",
      "Higher Education Authority, Ireland",
      ON,
    ),
    deadline: stated(
      "Historically opens in the spring for the autumn intake of the same year",
      "Higher Education Authority, Ireland",
      ON,
      "The current cycle's exact date is published on hea.ie each year, not stated here",
    ),
    eligibility:
      "A small number of awards across all of Ireland's public universities and institutes of technology combined. Selection is centralised and highly competitive.",
    link: "https://hea.ie/funding-governance-performance/funding/student-funding/goi-scholarships/",
    source: "Higher Education Authority, Ireland",
    statedOn: ON,
  },
];

export function scholarshipsFor(destination: string): Scholarship[] {
  return scholarships.filter((item) => item.destination === destination);
}

export const scholarshipScope = {
  statedOn: ON,
  checkedBy: null as string | null,
  note: "Five national or cross-institutional schemes, chosen because each is well established and actually open to Indian students on our three routes. Deadlines move every year and are stated as historical cycles rather than a specific current date wherever the exact date is not already public for this year. This is not every scholarship that exists, and a university's own named awards are not yet on this list.",
};
