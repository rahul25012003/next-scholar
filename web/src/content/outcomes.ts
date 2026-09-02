import { type Measured, notYetOpen } from "./types";

/**
 * The reference layout this page borrows its shape from carries a row of large
 * numbers: a million satisfied students, six hundred thousand programmes. Next
 * Scholar has not taken a client yet, so the component keeps its shape and
 * carries only figures that are true on day one.
 */
export const dayOneFigures = [
  {
    value: "3",
    label: "Destinations covered end to end",
    detail: "The United Kingdom, Germany and Ireland. A country is added only when we can answer it without looking it up.",
    tone: "blue" as const,
  },
  {
    value: "11",
    label: "Stages from first call to arrival",
    detail: "Every stage has a named deliverable you receive.",
    tone: "mint" as const,
  },
  {
    value: "₹0",
    label: "Commission from German public universities",
    detail: "They pay agents nothing. That is why our fee on that route is flat.",
    tone: "peach" as const,
  },
  {
    value: "45 min",
    label: "Paid consultation before anything else",
    detail: "₹1,500, credited in full against the service fee if you proceed.",
    tone: "rose" as const,
  },
  {
    value: "0",
    label: "Figures published here without a source",
    detail: "Every number traces to a live source, a named person who entered it, or an empty state.",
    tone: "lilac" as const,
  },
];

export type OutcomeMetric = {
  key: string;
  label: string;
  value: Measured<number>;
};

/**
 * Deliberately empty. The prototype that preceded this brand carried invented
 * counts. Publishing zeros with an honest reason is the whole differentiator.
 */
export const outcomeMetrics: OutcomeMetric[] = [
  {
    key: "applications",
    label: "Applications submitted",
    value: notYetOpen("No client has been taken on yet"),
  },
  {
    key: "offers",
    label: "Offers received",
    value: notYetOpen("No applications submitted yet"),
  },
  {
    key: "visas-approved",
    label: "Visas approved",
    value: notYetOpen("No visa applications filed yet"),
  },
  {
    key: "visas-refused",
    label: "Visas refused",
    value: notYetOpen("Refusals are published on the same page as approvals"),
  },
  {
    key: "advised-against",
    label: "Applicants advised not to proceed",
    value: notYetOpen("Counted from the first consultation onward"),
  },
];

export const reportingRules = [
  "Public figures are generated only from records marked verified or carrying a final, human confirmed outcome. Nothing is inferred, estimated or extrapolated.",
  "Categories are reported separately and permanently. Applications, offers, enrolments, visa approvals, visa refusals and withdrawals never merge into one flattering success rate.",
  "Cases still in progress are excluded from any rate. In progress is neither a success nor a failure yet.",
  "The first quarterly report publishes after the first full quarter of operation, and it includes refusals and the applicants who were told not to proceed.",
];

export type Credential = {
  name: string;
  body: string;
  state: "planned" | "in-progress" | "held";
  timeline: string;
};

/** Claimed as in progress. Never as held. */
export const credentials: Credential[] = [
  {
    name: "ICEF ITAC",
    body: "Agent training and certification for international student recruitment.",
    state: "planned",
    timeline: "Target month 6 to 12",
  },
  {
    name: "British Council AQF",
    body: "Agent quality framework covering UK recruitment practice.",
    state: "planned",
    timeline: "Target month 6 to 12",
  },
  {
    name: "ICEF Agency Status",
    body: "Screened agency status, which requires an operating history to apply for.",
    state: "planned",
    timeline: "Target month 6 to 12",
  },
];

export const permanentDisclaimers = [
  "No guarantee of admission.",
  "No guarantee of a visa outcome. That holds for us, at any point in the future, under any management.",
  "No predicted admission or visa percentage is shown anywhere on this platform, to anyone.",
];
