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
    tuition: "£12.5k to £46k",
    tuitionNote: "First year tuition, taught masters",
    postStudy: "18 months",
    postStudyNote:
      "For applications from 1 January 2027, the Graduate Route drops from 24 months to 18 (PhD graduates keep 36). Check the current Home Office guidance before you rely on this.",
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
      "Deposit deadlines come fast once an offer arrives, so we plan the money at the shortlist stage, not after the offer.",
  },
  {
    slug: "germany-public",
    country: "Germany",
    route: "Public universities",
    flagCode: "de",
    intakes: "October, April",
    tuition: "No fee in most states",
    tuitionNote:
      "Most states charge no tuition, but Baden-Wurttemberg (Stuttgart, KIT, Heidelberg, Freiburg, Tubingen, Mannheim) charges non-EU students EUR 1,500 a semester, or EUR 6,000 for a four semester Master's, and in Bavaria TUM has charged non-EU students since the 2024/25 winter semester. Everyone also pays a semester fee of EUR 100 to EUR 400, which usually includes a transport ticket.",
    postStudy: "18 months",
    commission: {
      display: "₹0",
      lowInr: 0,
      highInr: 0,
      status: "verified-publishable",
      source: "direct-written-confirmation",
      note: "German public universities do not pay agents, and a zero needs no one's permission to publish, so this figure is confirmed.",
    },
    clientFee: "₹45,000",
    clientFeeInr: 45000,
    clientFeeNote:
      "A flat advisory fee, because the university pays us nothing.",
    planningNote:
      "APS certification and the blocked account each take months. Start both well before you apply.",
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
      note: "This range is above the category average. A private university can still make your shortlist, but you will see this flag in writing before we recommend it.",
    },
    clientFee: "₹25,000",
    clientFeeInr: 25000,
    planningNote:
      "The public route is free. If a private university is on your shortlist, it is because a specific course fits you, and we say why in writing.",
  },
  {
    slug: "ireland",
    country: "Ireland",
    flagCode: "ie",
    intakes: "September, January",
    tuition: "€12k to €28k",
    tuitionNote: "First year tuition, taught masters",
    postStudy: "12 + 12 months",
    postStudyNote:
      "Under the Third Level Graduate Programme, a Level 9 or higher graduate gets 12 months, renewable once for 12 more: 24 at most, not 24 up front. We used to show a flat 24 here, which was wrong.",
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
      "Finding housing, not the visa, is the hard part here. Start looking before you accept the offer.",
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
    body: "APS India is bringing in a new Digital Master Test (dMAT). From the summer semester 2027 intake, Indian Bachelor's holders applying for a Master's in Engineering, Commerce, Business, Finance or Economics must take it. It costs EUR 150 on top of the APS fee. There is no pass or fail: universities read your score alongside your transcript. If you registered with or sent documents to APS India before 29 June 2026, you are exempt.",
    verified: false,
    source: "APS India",
    effectiveFrom: "Summer semester 2027 intake",
    isNew: true,
  },
  {
    destination: "United Kingdom",
    guideSlug: "united-kingdom",
    title: "Graduate Route shortens to 18 months in 2027",
    body: "For applications made on or after 1 January 2027, you can stay 18 months after your course, down from 24. PhD graduates keep 36 months. If your timeline crosses that date, it changes your whole plan.",
    verified: false,
    source: "UK Home Office immigration rules",
    effectiveFrom: "1 January 2027",
  },
  {
    destination: "Germany",
    guideSlug: "germany",
    title: "Blocked account: EUR 11,904 for the year, EUR 992 a month",
    body: "We used to list this figure as unknown, but it is the legal minimum a student visa applicant must deposit for the first year, linked to the maximum BAfoG grant. The monthly amount is the most you can withdraw, not a budget, and in Munich rent alone can be more. APS certification is still required for every Indian applicant, and it is the first thing to start.",
    verified: false,
    source: "German Federal Foreign Office, APS India",
  },
  {
    destination: "Ireland",
    guideSlug: "ireland",
    title: "Post study is 12 months renewable once, not a flat 24",
    body: "A Level 9 or higher graduate gets 12 months of Stamp 1G, renewable once for another 12. We published a flat 24 months before, which was wrong. On this route, the real problem is finding housing in Dublin, Cork and Galway, not the visa.",
    verified: false,
    source: "Irish Immigration Service Delivery, university housing offices",
  },
];
