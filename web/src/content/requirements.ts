import type { DocumentCategory } from "@/domain/consent";

/**
 * Human curated application requirements.
 *
 * The Application Completeness agent checks a case against this list and
 * nothing else. It cannot invent a requirement, and a programme that is not on
 * this list returns "requirements not yet verified in system" rather than a
 * plausible guess, because a guessed requirement is how a student misses a real
 * one.
 *
 * Every entry needs re-checking at the institution's own admissions page before
 * a student is told an application is complete.
 */

export type RequirementSet = {
  destination: string;
  route: string;
  /** Named person who last checked this against the source. */
  curatedBy: string | null;
  curatedOn: string | null;
  documents: DocumentCategory[];
  steps: string[];
};

export const requirementSets: RequirementSet[] = [
  {
    destination: "Germany",
    route: "Public universities",
    curatedBy: null,
    curatedOn: null,
    documents: ["transcript", "passport", "english-test", "funding"],
    steps: [
      "APS certificate issued",
      "uni-assist application submitted",
      "Blocked account opened and funded",
      "Health insurance arranged",
    ],
  },
  {
    destination: "United Kingdom",
    route: "Taught masters",
    curatedBy: null,
    curatedOn: null,
    documents: ["transcript", "passport", "english-test", "recommendation"],
    steps: [
      "Personal statement written by the applicant",
      "References requested",
      "Deposit paid to hold the offer",
      "CAS issued by the university",
    ],
  },
  {
    destination: "Ireland",
    route: "Taught masters",
    curatedBy: null,
    curatedOn: null,
    documents: ["transcript", "passport", "english-test", "funding"],
    steps: [
      "Offer accepted",
      "Tuition deposit paid",
      "Proof of funds assembled for the visa file",
      "Accommodation secured",
    ],
  },
];

export function requirementsFor(
  destination: string,
  route?: string,
): RequirementSet | null {
  return (
    requirementSets.find(
      (set) =>
        set.destination === destination && (route ? set.route === route : true),
    ) ?? null
  );
}
