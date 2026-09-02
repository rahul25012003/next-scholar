import type { StudentCase } from "./case";
import { categoryLabel } from "./consent";
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
