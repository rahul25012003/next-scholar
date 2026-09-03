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
 * The route matters. Germany's public and private routes take different
 * documents and different steps, and until a case carried its route the private
 * applicant was silently checked against the public set. `requirementsFor` now
 * refuses to fall back to a sibling route: an unmatched route returns null, so
 * the checker says it does not know rather than checking the wrong list.
 */

export type RequirementSet = {
  destination: string;
  route: string;
  /** Named person who last checked this against the source. */
  curatedBy: string | null;
  curatedOn: string | null;
  /** The date the list was written into the repository. Never null. */
  statedOn: string;
  /** The official bodies these requirements come from. */
  sources: string[];
  documents: DocumentCategory[];
  steps: string[];
  /** Set where the route has a recognition gate ahead of the documents. */
  recognitionGate?: string;
};

export const requirementSets: RequirementSet[] = [
  {
    destination: "Germany",
    route: "Public universities",
    curatedBy: null,
    curatedOn: null,
    statedOn: "2026-09-03",
    sources: ["APS India", "uni-assist e.V.", "German Federal Foreign Office", "anabin"],
    documents: [
      "transcript",
      "passport",
      "english-test",
      "degree-recognition",
      "funding",
    ],
    steps: [
      "anabin recognition checked for the institution and the degree",
      "APS certificate issued",
      "dMAT sat, where the subject group and intake bring it into scope",
      "uni-assist or direct application submitted, whichever the university requires",
      "Blocked account opened and funded with EUR 11,904",
      "Health insurance arranged: travel cover before enrolment, statutory or private from it",
      "Visa appointment booked, which is the binding constraint on this route",
    ],
    recognitionGate:
      "anabin equivalence and subject credits decide eligibility before any document is collected. An H- institution changes the pathway entirely.",
  },
  {
    destination: "Germany",
    route: "Private universities",
    curatedBy: null,
    curatedOn: null,
    statedOn: "2026-09-03",
    sources: ["APS India", "Institution admission offices", "German Federal Foreign Office"],
    documents: ["transcript", "passport", "english-test", "funding"],
    steps: [
      "APS certificate issued",
      "Application submitted directly to the institution",
      "Offer accepted and any deposit paid",
      "Blocked account opened and funded with EUR 11,904",
      "Health insurance arranged",
      "Visa appointment booked",
    ],
    recognitionGate:
      "Private institutions decide equivalence themselves rather than through uni-assist, so the anabin question is asked of the institution rather than answered before applying.",
  },
  {
    destination: "United Kingdom",
    route: "Taught masters",
    curatedBy: null,
    curatedOn: null,
    statedOn: "2026-09-03",
    sources: [
      "UKVI Student route guidance",
      "UK Home Office",
      "University admission requirements",
    ],
    documents: ["transcript", "passport", "english-test", "recommendation", "funding"],
    steps: [
      "Personal statement written by the applicant",
      "References requested",
      "ATAS certificate obtained, where the subject requires one",
      "Deposit paid to hold the offer",
      "Funds held for 28 consecutive days, maintenance plus the unpaid tuition on the CAS",
      "CAS issued by the university",
      "TB test certificate obtained at an approved clinic",
      "Immigration Health Surcharge paid with the application",
    ],
  },
  {
    destination: "Ireland",
    route: "Taught masters",
    curatedBy: null,
    curatedOn: null,
    statedOn: "2026-09-03",
    sources: ["Irish Immigration Service Delivery", "University admission requirements"],
    documents: ["transcript", "passport", "english-test", "funding"],
    steps: [
      "Offer accepted, and its NFQ level recorded",
      "Six months of bank statements assembled, showing EUR 10,000 for year one",
      "EUR 6,000 of tuition paid, or the full fee where it is lower",
      "Private medical insurance purchased at EUR 25,000 accident and EUR 25,000 disease cover",
      "AVATS application submitted and the document file couriered",
    ],
  },
];

/**
 * The requirement set for a destination and route.
 *
 * Where a destination has more than one route and no route is supplied, this
 * returns null rather than the first match. A shortlist checked against the
 * wrong route is worse than one that says it does not know which route applies.
 */
export function requirementsFor(
  destination: string,
  route?: string | null,
): RequirementSet | null {
  const forDestination = requirementSets.filter(
    (set) => set.destination === destination,
  );
  if (forDestination.length === 0) return null;
  if (route) return forDestination.find((set) => set.route === route) ?? null;
  return forDestination.length === 1 ? forDestination[0] : null;
}

/** Every route on record for a destination, for a route picker. */
export function routesFor(destination: string): string[] {
  return requirementSets
    .filter((set) => set.destination === destination)
    .map((set) => set.route);
}
