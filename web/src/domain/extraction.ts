import type { Source } from "./case";

/**
 * The staging area for Document Intelligence.
 *
 * The agent proposes field values. Nothing it proposes is authoritative, and
 * nothing becomes authoritative without a named person confirming that specific
 * value. That is the whole mechanism: the agent writes here, a human promotes,
 * and the two acts are recorded separately so a wrong value always has an owner.
 *
 * A confidence score is a property of the reading, not of the truth. A high
 * confidence field still needs confirming.
 */

export type Confidence = "high" | "medium" | "low";

export type FieldState = "pending-verification" | "confirmed" | "rejected";

export type StagedField = {
  name: string;
  value: string;
  confidence: Confidence;
  state: FieldState;
  /** Set only when a person promotes or rejects it. */
  decidedBy: string | null;
  decidedAt: string | null;
  source: Source;
};

export type Extraction = {
  documentId: string;
  caseId: string;
  extractedAt: string;
  fields: StagedField[];
  /** The agent's own note, including whether the document was readable. */
  note: string;
  unreadable: boolean;
};

export function stageFields(
  documentId: string,
  caseId: string,
  proposed: { name: string; value: string; confidence: Confidence }[],
  note: string,
  unreadable: boolean,
  now = new Date(),
): Extraction {
  return {
    documentId,
    caseId,
    extractedAt: now.toISOString(),
    note,
    unreadable,
    fields: proposed.map((field) => ({
      ...field,
      state: "pending-verification" as const,
      decidedBy: null,
      decidedAt: null,
      source: "ai" as const,
    })),
  };
}

export function decideField(
  extraction: Extraction,
  fieldName: string,
  decision: "confirmed" | "rejected",
  by: string,
  now = new Date(),
): Extraction {
  return {
    ...extraction,
    fields: extraction.fields.map((field) =>
      field.name === fieldName && field.state === "pending-verification"
        ? {
            ...field,
            state: decision,
            decidedBy: by,
            decidedAt: now.toISOString(),
          }
        : field,
    ),
  };
}

/** Only confirmed fields are authoritative. Everything else is a proposal. */
export function authoritativeFields(extraction: Extraction): StagedField[] {
  return extraction.fields.filter((field) => field.state === "confirmed");
}

export function pendingCount(extraction: Extraction): number {
  return extraction.fields.filter((field) => field.state === "pending-verification")
    .length;
}
