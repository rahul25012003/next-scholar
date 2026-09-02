import type { DocStatus, StudentCase } from "./case";
import { categoryLabel, type DocumentCategory } from "./consent";
import { requirementsFor } from "@/content/requirements";

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
      curatedBy: string | null;
      curatedOn: string | null;
      documents: { label: string; present: boolean; status: string }[];
      steps: string[];
      missing: string[];
      /** Never "ready". A person decides that. */
      note: string;
    };

export function checkCompleteness(record: StudentCase): CompletenessResult {
  const set = requirementsFor(record.destination);

  if (!set) {
    return {
      state: "unknown",
      reason: `Requirements for ${record.destination} are not yet verified in this system. Nothing has been guessed in their place.`,
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
    curatedBy: set.curatedBy,
    curatedOn: set.curatedOn,
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
  const set = requirementsFor(record.destination);
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
): DocumentCategory[] {
  const set = requirementsFor(destination);
  if (!set) return [];

  const financeOnward = ["finance", "visa", "pre-departure", "arrival", "outcome"];
  if (financeOnward.includes(stage)) return set.documents;

  const applying = ["documents", "applications", "offers"];
  if (applying.includes(stage)) {
    return set.documents.filter((category) => category !== "funding");
  }

  return [];
}
