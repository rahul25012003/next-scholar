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
    tuition: "No tuition fee",
    tuitionNote: "Semester contribution only",
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
    postStudy: "24 months",
    postStudyNote:
      "Third Level Graduate Programme. Confirm the current window against the Department of Justice before you plan around it.",
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
  title: string;
  body: string;
  /** Nothing here is treated as current until it is re-checked at source. */
  verified: false;
  source: string;
};

/**
 * The Policy Desk. Every line needs re-checking against the official source
 * before it is published as current, and a stale verification date is treated
 * as worse than no date at all.
 */
export const policyDesk: PolicyNote[] = [
  {
    destination: "United Kingdom",
    title: "Graduate Route shortens to 18 months in 2027",
    body: "For applications made on or after 1 January 2027 the post study window drops from 24 months to 18. PhD graduates keep 36 months. If your intake straddles that date, it changes the arithmetic on the whole plan.",
    verified: false,
    source: "UK Home Office immigration rules",
  },
  {
    destination: "Germany",
    title: "APS certificate is mandatory for Indian applicants",
    body: "The blocked account amount and the free appeal rules both need reconfirming for the current year before anyone budgets against them.",
    verified: false,
    source: "APS India, German Federal Foreign Office",
  },
  {
    destination: "Ireland",
    title: "Accommodation, not visa policy, is the planning bottleneck",
    body: "The Third Level Graduate Programme gives a defined post study window. The practical constraint students hit is housing supply in Dublin, Cork and Galway.",
    verified: false,
    source: "Irish Department of Justice, university housing offices",
  },
];
