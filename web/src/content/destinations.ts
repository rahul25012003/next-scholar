import type { CommissionSource, VerificationStatus } from "./types";

export type DestinationRow = {
  slug: string;
  country: string;
  /** Set when a country splits into routes that pay us differently. */
  route?: string;
  flagCode: string;
  intakes: string;
  tuition: string;
  tuitionNote?: string;
  postStudy: string;
  postStudyNote?: string;
  commission: {
    display: string;
    /** The same band as a number, so the chart and the card cannot drift apart. */
    lowInr: number;
    highInr: number;
    status: VerificationStatus;
    source: CommissionSource;
    /** Set when the figure is more than double the category average. */
    aboveAverage?: boolean;
    note?: string;
  };
  clientFee: string;
  clientFeeInr: number;
  clientFeeNote?: string;
  /** The thing a Bengaluru applicant actually plans around for this route. */
  planningNote: string;
};

/**
 * Phase 1 covers exactly three destinations. A country is added only once its
 * full profile can be answered without looking anything up, so the list stays
 * short on purpose.
 *
 * Every commission figure below is a market typical estimate. None of them are
 * confirmed contract terms, and none may be presented as confirmed until a
 * university or aggregator has confirmed the number in writing and permitted
 * its publication.
 */
export const destinations: DestinationRow[] = [
  {
    slug: "united-kingdom",
    country: "United Kingdom",
    flagCode: "gb",
    intakes: "September, January",
    tuition: "£14k to £38k",
    tuitionNote: "First year tuition, taught masters",
    postStudy: "18 months",
    postStudyNote:
      "The Graduate Route shortens from 24 months to 18 for applications made on or after 1 January 2027. PhD graduates keep 36 months. Re-check against the current Home Office guidance before you rely on this.",
    commission: {
      display: "₹1.5L to ₹2.5L",
      lowInr: 150000,
      highInr: 250000,
      status: "unverified",
      source: "market-estimate",
    },
    clientFee: "₹25,000",
    clientFeeInr: 25000,
    planningNote:
      "Deposit deadlines move faster than most applicants expect once an offer lands, so the finance conversation starts at shortlist, not at offer.",
  },
  {
    slug: "germany-public",
    country: "Germany",
    route: "Public universities",
    flagCode: "de",
    intakes: "October, April",
    tuition: "No fee, except Baden-Wurttemberg",
    tuitionNote:
      "Fifteen of the sixteen federal states charge no tuition. Baden-Wurttemberg charges non-EU students EUR 1,500 per semester, which is EUR 6,000 across a four semester Master's, and Stuttgart, KIT, Heidelberg, Freiburg, Tubingen and Mannheim are all in that state. Everyone also pays a semester contribution of EUR 100 to EUR 400, which usually includes a transport ticket.",
    postStudy: "18 months",
    commission: {
      display: "₹0",
      lowInr: 0,
      highInr: 0,
      status: "verified-publishable",
      source: "direct-written-confirmation",
      note: "German public universities do not pay agents. There is no permission to seek for publishing a zero, so this one is confirmed.",
    },
    clientFee: "₹45,000",
    clientFeeInr: 45000,
    clientFeeNote:
      "Flat advisory fee. We earn nothing from the university on this route, which is the entire reason the fee exists.",
    planningNote:
      "APS certification and the blocked account run on their own clocks. Both need to start months before the application itself.",
  },
  {
    slug: "germany-private",
    country: "Germany",
    route: "Private universities",
    flagCode: "de",
    intakes: "October, April",
    tuition: "Varies by institution",
    postStudy: "18 months",
    commission: {
      display: "₹1.3L to ₹3.5L",
      lowInr: 130000,
      highInr: 350000,
      status: "unverified",
      source: "market-estimate",
      aboveAverage: true,
      note: "This band runs above the category average. That does not rule a private university out of a shortlist, but you will see the flag in writing before it is recommended, not after.",
    },
    clientFee: "₹25,000",
    clientFeeInr: 25000,
    planningNote:
      "The public route is free and pays us nothing. If a private university is on your shortlist, the reason will be a specific programme fit, stated in writing.",
  },
  {
    slug: "ireland",
    country: "Ireland",
    flagCode: "ie",
    intakes: "September, January",
    tuition: "€12k to €26k",
    tuitionNote: "First year tuition, taught masters",
    postStudy: "12 + 12 months",
    postStudyNote:
      "Third Level Graduate Programme. A Level 9 or higher graduate gets 12 months, renewable once for a further 12, so 24 at most rather than 24 up front. A Level 8 honours bachelor graduate gets 12 months with no renewal. We previously published a flat 24 here, which was wrong on both counts.",
    commission: {
      display: "₹90k to ₹1.6L",
      lowInr: 90000,
      highInr: 160000,
      status: "unverified",
      source: "market-estimate",
    },
    clientFee: "₹25,000",
    clientFeeInr: 25000,
    planningNote:
      "Accommodation availability, not visa policy, is the practical bottleneck. Housing search starts before the offer is accepted.",
  },
];

export type PolicyNote = {
  destination: string;
  /** The guide this note links through to for the full detail. */
  guideSlug: string;
  title: string;
  body: string;
  /** Nothing here is treated as current until it is re-checked at source. */
  verified: false;
  source: string;
  /**
   * Set when the note has a date attached that changes a plan. A dated change
   * is read differently from a standing rule, so it is rendered differently.
   */
  effectiveFrom?: string;
  /** Set when the note is a new requirement rather than a change to an old one. */
  isNew?: boolean;
};

/**
 * The Policy Desk. Every line needs re-checking against the official source
 * before it is published as current, and a stale verification date is treated
 * as worse than no date at all.
 *
 * The dMAT note is here because the site did not mention it at all, and the
 * population it applies to, Indian Bachelor's holders applying for Master's in
 * engineering, commerce, finance, economics or business, is very close to a
 * description of our stated audience.
 */
export const policyDesk: PolicyNote[] = [
  {
    destination: "Germany",
    guideSlug: "germany",
    title: "dMAT becomes mandatory for the summer semester 2027 intake",
    body: "APS India is introducing a Digital Master Test. From the summer semester 2027 intake it is required of Indian Bachelor's holders applying for a Master's in Engineering, Commerce, Business, Finance or Economics. It costs EUR 150 on top of the APS fee, and it is not pass or fail: it produces a score report universities read alongside your transcript. Anyone who registered with or submitted documents to APS India before 29 June 2026 is exempt under the transitional rule.",
    verified: false,
    source: "APS India",
    effectiveFrom: "Summer semester 2027 intake",
    isNew: true,
  },
  {
    destination: "United Kingdom",
    guideSlug: "united-kingdom",
    title: "Graduate Route shortens to 18 months in 2027",
    body: "For applications made on or after 1 January 2027 the post study window drops from 24 months to 18. PhD graduates keep 36 months. If your intake straddles that date, it changes the arithmetic on the whole plan.",
    verified: false,
    source: "UK Home Office immigration rules",
    effectiveFrom: "1 January 2027",
  },
  {
    destination: "Germany",
    guideSlug: "germany",
    title: "Blocked account: EUR 11,904 for the year, EUR 992 a month",
    body: "This figure was previously listed here as unknown, and it is not: it is the statutory minimum a student visa applicant must deposit for the first year, tied to the maximum BAfoG grant. The monthly release is a ceiling on withdrawals rather than a budget, and in Munich the rent alone can exceed it. APS certification remains mandatory for every Indian applicant and remains the first clock to start.",
    verified: false,
    source: "German Federal Foreign Office, APS India",
  },
  {
    destination: "Ireland",
    guideSlug: "ireland",
    title: "Post study is 12 months renewable once, not a flat 24",
    body: "A Level 9 or higher graduate gets 12 months of Stamp 1G, renewable once for a further 12. A Level 8 honours bachelor graduate gets 12 months with no renewal. We published a flat 24 months, which was wrong on both counts. The practical constraint on this route remains housing supply in Dublin, Cork and Galway rather than visa policy.",
    verified: false,
    source: "Irish Immigration Service Delivery, university housing offices",
  },
];
