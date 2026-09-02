"use server";

import { revalidatePath } from "next/cache";
import { decideExtractedField, getCase, stageExtraction } from "@/data/store";
import { demoCounselor } from "@/domain/demo-actors";
import { extractFromDocument } from "@/domain/agents/implementations";
import { stageFields } from "@/domain/extraction";
import { record as recordAudit } from "@/domain/audit";

export type ExtractionResult =
  | { status: "idle" }
  | { status: "staged"; count: number; note: string }
  | { status: "unavailable"; reason: string; fallback: string }
  | { status: "error"; message: string };

/**
 * Runs Document Intelligence over one stored document.
 *
 * Everything it proposes lands in the staging area marked pending verification.
 * Nothing it returns is authoritative, and nothing reaches the case record until
 * a person promotes a specific field. When the document pipeline is not
 * connected the agent refuses to run at all, and this reports why rather than
 * inventing values from nothing.
 */
export async function runExtraction(
  _previous: ExtractionResult,
  formData: FormData,
): Promise<ExtractionResult> {
  const caseId = String(formData.get("caseId") ?? "");
  const documentId = String(formData.get("documentId") ?? "");

  const record = await getCase(caseId, demoCounselor);
  if (!record) {
    return { status: "error", message: "That case is not readable by this account." };
  }

  const document = record.documents.find((item) => item.id === documentId);
  if (!document) {
    return { status: "error", message: "That document is not on this case." };
  }

  // The stored file itself. There is no document storage connected, so there is
  // nothing to hand the agent, and the agent refuses on exactly that basis.
  const run = await extractFromDocument(documentId, "");

  if (run.status === "unavailable") {
    return { status: "unavailable", reason: run.reason, fallback: run.fallback };
  }

  if (run.status === "blocked") {
    recordAudit({
      actorId: "document-intelligence",
      actorName: "Document Intelligence agent",
      actorRole: "agent",
      action: "agent-blocked",
      subjectType: "document",
      subjectId: documentId,
      note: run.violations.map((violation) => violation.rule).join("; "),
    });
    return {
      status: "unavailable",
      reason: `The reading was discarded: ${run.violations.map((violation) => violation.rule).join("; ")}.`,
      fallback: "Enter the values by hand. The document is stored and unchanged.",
    };
  }

  const extraction = stageFields(
    documentId,
    caseId,
    run.data.fields,
    run.data.note,
    run.data.unreadable,
  );
  await stageExtraction(extraction);
  revalidatePath(`/console/${caseId}`);

  return {
    status: "staged",
    count: extraction.fields.length,
    note: run.data.unreadable
      ? "The document could not be read cleanly. Manual entry is required."
      : run.data.note,
  };
}

export type DecisionResult =
  | { status: "idle" }
  | { status: "done"; message: string }
  | { status: "error"; message: string };

/**
 * The human review the agent's registry entry marks mandatory. Confirming is a
 * person putting their name to one specific value, which is why it happens per
 * field rather than per document.
 */
export async function decideField(
  _previous: DecisionResult,
  formData: FormData,
): Promise<DecisionResult> {
  const caseId = String(formData.get("caseId") ?? "");
  const documentId = String(formData.get("documentId") ?? "");
  const fieldName = String(formData.get("fieldName") ?? "");
  const decision = String(formData.get("decision") ?? "") as "confirmed" | "rejected";

  if (!fieldName || (decision !== "confirmed" && decision !== "rejected")) {
    return { status: "error", message: "Nothing to decide." };
  }

  const updated = await decideExtractedField(documentId, fieldName, decision, demoCounselor);
  if (!updated) {
    return { status: "error", message: "Not permitted, or nothing staged for that document." };
  }

  revalidatePath(`/console/${caseId}`);

  return {
    status: "done",
    message:
      decision === "confirmed"
        ? `Confirmed against your name. It is authoritative now because you said so, not because the reading was confident.`
        : "Rejected. The proposal stays in the record as something a person turned down.",
  };
}
