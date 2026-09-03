/**
 * The per-destination guide model.
 *
 * One shape, read by the marketing destination pages, the ungated tools, the
 * student portal checklist and the Application Completeness agent, so a funding
 * threshold cannot be one number on the public page and another number in the
 * check that decides whether a student's file is ready.
 *
 * Two rules the shapes below exist to enforce:
 *
 * 1. Every figure names the official body it came from. There is no field for
 *    an unsourced number, so one cannot be added without changing this file.
 * 2. Nothing claims a verification that has not happened. `checkedBy` stays
 *    null until a named person has re-read the whole set at source, and the
 *    renderer prints that null as a visible warning rather than hiding it.
 */

/** A published number, with the thing that makes it safe to publish attached. */
export type Figure = {
  label: string;
  /** The figure as printed, including its unit and period. */
  value: string;
  /**
   * What the figure is and is not: whether it is a statutory minimum, a
   * typical range, or an indicative estimate. Rendered with the value, never
   * separated from it.
   */
  qualifier: string;
  /** The official body that sets or publishes this number. */
  source: string;
  note?: string;
};

/** A requirement that is a rule rather than a number. */
export type Requirement = {
  title: string;
  body: string;
  source: string;
  /** Set when the rule only applies to some applicants. */
  appliesTo?: string;
};

/** A step in a sequence, so a checklist can be ticked rather than only read. */
export type ChecklistItem = {
  id: string;
  title: string;
  detail: string;
  /** What holds this step up if it is late. Absent means nothing does. */
  blocks?: string;
  source: string;
};

export type LanguageQualification = {
  name: string;
  /** The accepted levels or scores, exactly as the accepting body states them. */
  accepted: string;
  validity: string;
  note?: string;
  source: string;
};

export type Intake = {
  name: string;
  /** A date, not a month name, because a month name is not a deadline. */
  applicationDeadline: string;
  deadlineNote: string;
  teachingStarts: string;
  /** Whether we believe the intake is currently open. Dated, so it can be checked. */
  status: "open" | "closing-soon" | "closed" | "not-yet-open";
  statusAsOf: string;
  source: string;
};

export type TimelineStep = {
  monthsBefore: [number, number];
  title: string;
  detail: string;
};

export type CostLine = {
  id: string;
  label: string;
  /** Monthly, in the destination currency, as a range. */
  low: number;
  high: number;
  note?: string;
  /** A line a student can switch off, e.g. a car, or on, e.g. a dependant. */
  optional?: boolean;
};

export type CityCosts = {
  slug: string;
  name: string;
  note: string;
  lines: CostLine[];
};

export type LivingCosts = {
  currency: "EUR" | "GBP";
  symbol: "€" | "£";
  qualifier: string;
  source: string;
  cities: CityCosts[];
};

/**
 * The INR conversion. A live rate is a live number, and we do not have a rate
 * API connected, so the rate used is published with the date it was taken and
 * the output is labelled indicative everywhere it appears.
 */
export type IndicativeRate = {
  currency: "EUR" | "GBP";
  inrPerUnit: number;
  takenOn: string;
  source: string;
};

export type Verification = {
  /** The date these values were written into this repository. */
  statedOn: string;
  /** Null until a named person re-reads the entire set at source. */
  checkedBy: string | null;
  checkedOn: string | null;
  /** How often the set is meant to be re-read. */
  cadence: string;
};

export type RouteSummary = {
  slug: string;
  name: string;
  /** Which destination row in content/destinations.ts this route maps to. */
  destinationSlug: string;
  summary: string;
};

export type DestinationGuide = {
  slug: string;
  country: string;
  flagCode: string;
  currency: "EUR" | "GBP";
  symbol: "€" | "£";
  headline: string;
  lede: string;
  verification: Verification;
  routes: RouteSummary[];
  tuition: Figure[];
  living: LivingCosts;
  /** The financial requirement the visa authority applies, as figures. */
  funds: Figure[];
  visaFees: Figure[];
  language: LanguageQualification[];
  academic: Requirement[];
  intakes: Intake[];
  timeline: TimelineStep[];
  visaSteps: ChecklistItem[];
  visaDocuments: ChecklistItem[];
  postArrival: ChecklistItem[];
  workRights: Requirement[];
  postStudy: Requirement[];
  insurance: Requirement[];
  /** What actually goes wrong, named. Not a list of tips. */
  pitfalls: { title: string; body: string }[];
  faqs: { q: string; a: string }[];
};

/**
 * The fifteen sections, in the order every destination guide renders them. A
 * guide that cannot fill a section renders the section with its reason, so a
 * gap is visible rather than silently skipped.
 */
export const guideSections = [
  { id: "routes", title: "Routes" },
  { id: "tuition", title: "Tuition" },
  { id: "living", title: "Cost of living" },
  { id: "funds", title: "Money the visa authority wants to see" },
  { id: "academic", title: "Academic requirements" },
  { id: "language", title: "Language qualifications" },
  { id: "intakes", title: "Intakes and deadlines" },
  { id: "timeline", title: "Timeline" },
  { id: "visa", title: "Visa: steps and documents" },
  { id: "fees", title: "Visa fees and charges" },
  { id: "insurance", title: "Health insurance" },
  { id: "arrival", title: "After you arrive" },
  { id: "work", title: "Work rights" },
  { id: "post-study", title: "After you graduate" },
  { id: "pitfalls", title: "What goes wrong" },
] as const;

export type GuideSectionId = (typeof guideSections)[number]["id"];
