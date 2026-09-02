"use server";

import { revalidatePath } from "next/cache";
import {
  appendNote,
  attachSummary,
  clearManualReview,
  flagForManualReview,
  getCase,
  markDocumentVerified,
  withdrawConsent,
} from "@/data/store";
import { findSensitiveInput } from "@/domain/agents/guards";
import { demoCounselor, demoStudent } from "@/domain/demo-actors";
import { assertCan, PermissionError } from "@/domain/rbac";
import { summariseCase, draftReply } from "@/domain/agents/implementations";
import { record as recordAudit } from "@/domain/audit";

export type NoteResult =
  | { status: "idle" }
  | { status: "saved"; note: string; agent: string }
  | { status: "error"; message: string };

/**
 * The order in this function is the point of it.
 *
 * The counselor's note is written to the record first, unconditionally. Only
 * then does an agent run over it. If the agent is unavailable, misbehaves, or
 * returns something outside its permitted fields, the note is already saved and
 * the counselor is told the enrichment failed. The human's words are never the
 * thing that gets lost.
 */
export async function addNote(
  _previous: NoteResult,
  formData: FormData,
): Promise<NoteResult> {
  const caseId = String(formData.get("caseId") ?? "");
  const text = String(formData.get("note") ?? "").trim();

  if (text.length < 3) {
    return { status: "error", message: "Write the note before saving it." };
  }

  const record = await getCase(caseId, demoCounselor);
  if (!record) {
    return { status: "error", message: "That case is not readable by this account." };
  }

  try {
    assertCan(demoCounselor, "case.note.write", record);
  } catch (error) {
    if (error instanceof PermissionError) {
      return { status: "error", message: error.message };
    }
    throw error;
  }

  const saved = await appendNote(
    caseId,
    { text, source: "human", author: demoCounselor.name },
    demoCounselor,
  );

  if (!saved) return { status: "error", message: "The note could not be saved." };

  // The input side of the never-send rule, checked rather than requested. The
  // note is already saved at this point, so refusing here costs the machine
  // reading of it and nothing else.
  const sensitive = findSensitiveInput(text);
  if (sensitive) {
    await flagForManualReview(
      caseId,
      text,
      `Not sent to a model: ${sensitive.rule.toLowerCase()}`,
    );
    revalidatePath(`/console/${caseId}`);
    revalidatePath("/console");
    return {
      status: "saved",
      note: text,
      agent: `Your note is saved. It was not sent to a model, because it looks like it contains something that must never leave this system: ${sensitive.evidence}. Set the priority and document status yourself, then clear the review flag.`,
    };
  }

  const run = await summariseCase(saved);
  let agentOutcome: string;

  if (run.status === "ok") {
    await attachSummary(caseId, run.data.summary, run.data.suggestedAction, "Case Summary agent");
    agentOutcome = "Case summary updated, labelled as machine written.";
  } else if (run.status === "blocked") {
    recordAudit({
      actorId: "case-summary",
      actorName: "Case Summary agent",
      actorRole: "agent",
      action: "agent-blocked",
      subjectType: "case",
      subjectId: caseId,
      note: run.violations.map((violation) => violation.rule).join("; "),
    });
    agentOutcome = `Summary discarded. It broke a prohibition: ${run.violations
      .map((violation) => violation.rule)
      .join("; ")}.`;
    await flagForManualReview(caseId, text, agentOutcome);
  } else {
    agentOutcome = `No summary this time. ${run.reason} Your note is saved either way.`;
    await flagForManualReview(caseId, text, run.reason);
  }

  revalidatePath(`/console/${caseId}`);
  revalidatePath("/console");

  return { status: "saved", note: text, agent: agentOutcome };
}

export type VerifyResult =
  | { status: "idle" }
  | { status: "done"; message: string }
  | { status: "error"; message: string };

/**
 * Document verification is a named person's action. There is no agent path into
 * this function, and the registry grants no agent a capability that could reach
 * it, so the only way a document becomes verified is a human doing it here.
 */
export async function verifyDocument(
  _previous: VerifyResult,
  formData: FormData,
): Promise<VerifyResult> {
  const caseId = String(formData.get("caseId") ?? "");
  const documentId = String(formData.get("documentId") ?? "");

  const record = await getCase(caseId, demoCounselor);
  if (!record) {
    return { status: "error", message: "That case is not readable by this account." };
  }

  try {
    assertCan(demoCounselor, "document.verify", record);
  } catch (error) {
    if (error instanceof PermissionError) {
      return { status: "error", message: error.message };
    }
    throw error;
  }

  const document = record.documents.find((item) => item.id === documentId);
  if (!document) return { status: "error", message: "That document is not on this case." };

  await markDocumentVerified(caseId, documentId, demoCounselor);
  await appendNote(
    caseId,
    {
      text: `Marked ${document.name} verified against the original.`,
      source: "human",
      author: demoCounselor.name,
    },
    demoCounselor,
  );

  revalidatePath(`/console/${caseId}`);
  revalidatePath("/portal");

  return {
    status: "done",
    message: `Verified against the original, recorded against ${demoCounselor.name}.`,
  };
}

export type DraftResult =
  | { status: "idle" }
  | { status: "drafted"; draft: string; confidence: string }
  | { status: "unavailable"; message: string }
  | { status: "error"; message: string };

/**
 * The copilot writes a draft and nothing else. It has no send capability, in
 * this function or in its registry entry, so the counselor sends it by hand or
 * it does not get sent.
 */
export async function draftMessage(
  _previous: DraftResult,
  formData: FormData,
): Promise<DraftResult> {
  const caseId = String(formData.get("caseId") ?? "");
  const intent = String(formData.get("intent") ?? "").trim();

  if (intent.length < 4) {
    return { status: "error", message: "Say what the message should do." };
  }

  const record = await getCase(caseId, demoCounselor);
  if (!record) {
    return { status: "error", message: "That case is not readable by this account." };
  }

  const run = await draftReply(record, intent);

  if (run.status === "ok") {
    return {
      status: "drafted",
      draft: run.data.draft,
      confidence: run.data.confidence,
    };
  }

  if (run.status === "blocked") {
    return {
      status: "unavailable",
      message: `Draft discarded. It broke a prohibition: ${run.violations
        .map((violation) => violation.rule)
        .join("; ")}.`,
    };
  }

  return { status: "unavailable", message: `${run.reason} ${run.fallback}` };
}

export type ReviewResult =
  | { status: "idle" }
  | { status: "cleared"; message: string }
  | { status: "error"; message: string };

/** A person saying they have looked at the note the agent could not classify. */
export async function clearReviewFlag(
  _previous: ReviewResult,
  formData: FormData,
): Promise<ReviewResult> {
  const caseId = String(formData.get("caseId") ?? "");
  const updated = await clearManualReview(caseId, demoCounselor);

  if (!updated) return { status: "error", message: "Not permitted on this case." };

  revalidatePath(`/console/${caseId}`);
  revalidatePath("/console");

  return {
    status: "cleared",
    message: "Cleared against your name. The note stays in the log either way.",
  };
}

export type ConsentResult =
  | { status: "idle" }
  | { status: "withdrawn"; message: string }
  | { status: "error"; message: string };

/** A student withdrawing consent for one document category. */
export async function withdrawConsentAction(
  _previous: ConsentResult,
  formData: FormData,
): Promise<ConsentResult> {
  const consentId = String(formData.get("consentId") ?? "");
  if (!consentId) return { status: "error", message: "No consent record named." };

  await withdrawConsent(consentId, demoStudent);
  revalidatePath("/portal");

  return {
    status: "withdrawn",
    message:
      "Consent withdrawn and stamped with the time. Nothing new will be collected in that category, and your counselor has been notified.",
  };
}
