import type { DocStatus, StudentCase } from "./case";
import { categoryLabel, type DocumentCategory } from "./consent";
import { requirementsFor, routesFor } from "@/content/requirements";

/**
 * The Application Completeness agent. Deterministic, and deliberately unable to
 * say an application is ready.
 *
 * It compares a case against the human curated requirement list and reports
 * what is missing. Whether that means "ready to submit" is a counselor's call,
 * so this module has no such state to return.
 */

export type CompletenessResult =
  | {
      state: "unknown";
      reason: string;
    }
  | {
      state: "checked";
      route: string;
      curatedBy: string | null;
      curatedOn: string | null;
      /** When the list was written down, which is never null even when nobody has re-checked it. */
      statedOn: string;
      sources: string[];
      recognitionGate: string | null;
      documents: { label: string; present: boolean; status: string }[];
      steps: string[];
      missing: string[];
      /** Never "ready". A person decides that. */
      note: string;
    };

export function checkCompleteness(record: StudentCase): CompletenessResult {
  const set = requirementsFor(record.destination, record.route);

  if (!set) {
    const routes = routesFor(record.destination);
    // Two different unknowns, and telling them apart is the point. One is a
    // destination we have never curated. The other is a destination with more
    // than one route where nobody has said which route this case is on, and
    // answering that with the public university list would be a guess wearing
    // a checklist's clothes.
    return {
      state: "unknown",
      reason:
        routes.length > 1 && !record.route
          ? `${record.destination} splits into ${routes.length} routes with different requirements: ${routes.join(", ")}. This case has no route recorded, so there is no list to check it against. Set the route on the case first.`
          : record.route
            ? `No curated requirement list exists for ${record.destination}, ${record.route}. Nothing has been guessed in its place.`
            : `Requirements for ${record.destination} are not yet verified in this system. Nothing has been guessed in their place.`,
    };
  }

  const documents = set.documents.map((category) => {
    const held = record.documents.find((document) => document.category === category);
    return {
      label: categoryLabel[category],
      present: held?.status === "Verified",
      status: held ? held.status : "Not uploaded",
    };
  });

  const missing = documents
    .filter((document) => !document.present)
    .map((document) => document.label);

  return {
    state: "checked",
    route: set.route,
    curatedBy: set.curatedBy,
    curatedOn: set.curatedOn,
    statedOn: set.statedOn,
    sources: set.sources,
    recognitionGate: set.recognitionGate ?? null,
    documents,
    steps: set.steps,
    missing,
    note: set.curatedOn
      ? "Checked against the curated requirement list. A counselor confirms before a student is told anything is complete."
      : "This requirement list has never been checked at source by a named person, so treat it as a draft rather than as the university's word.",
  };
}

/**
 * The case level document status, derived rather than stored.
 *
 * It used to be a field that `markDocumentVerified` never updated, so the
 * roll-up drifted from the documents it claimed to summarise the moment anyone
 * verified anything. Deriving it means the two cannot disagree.
 */
export function deriveDocStatus(record: StudentCase): DocStatus {
  const set = requirementsFor(record.destination, record.route);
  const required = set?.documents ?? [];

  if (record.documents.length === 0) return "Not started";
  if (record.documents.some((document) => document.status === "Issue found")) {
    return "Issue found";
  }

  const held = required.map((category) =>
    record.documents.find((document) => document.category === category),
  );

  if (required.length > 0 && held.every((document) => document?.status === "Verified")) {
    return "Verified";
  }

  return "In review";
}

/** The document categories a stage cannot proceed without, from one source. */
export function requiredAtStage(
  destination: string,
  stage: StudentCase["stage"],
  route?: string | null,
): DocumentCategory[] {
  const set = requirementsFor(destination, route);
  if (!set) return [];

  const financeOnward = ["finance", "visa", "pre-departure", "arrival", "outcome"];
  if (financeOnward.includes(stage)) return set.documents;

  const applying = ["documents", "applications", "offers"];
  if (applying.includes(stage)) {
    return set.documents.filter((category) => category !== "funding");
  }

  return [];
}
