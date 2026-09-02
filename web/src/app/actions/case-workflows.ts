"use server";

import { revalidatePath } from "next/cache";
import {
  attachThreadSummary,
  getCommunication,
  mutateCase,
} from "@/data/store";
import { demoCounselor, demoFounder } from "@/domain/demo-actors";
import {
  applyCorrection,
  closeCase,
  deferIntake,
  reassignTo,
  recordApplicationOutcome,
  recordVisaOutcome,
  startReapplication,
  withdrawApplication,
  type ClosureOutcome,
  type CorrectableField,
} from "@/domain/case-operations";
import { summariseThread } from "@/domain/agents/implementations";
import type { VisaState } from "@/domain/case";
import type { ApplicationRecord } from "@/domain/case";

export type WorkflowResult =
  | { status: "idle" }
  | { status: "done"; message: string }
  | { status: "error"; message: string };

const refreshed = (caseId: string) => {
  revalidatePath(`/console/${caseId}`);
  revalidatePath("/console");
  revalidatePath("/portal");
  revalidatePath("/ops");
};

/**
 * Section 8.10's workflows, each behind a person pressing a button. None of
 * them run on a schedule, and every one of them writes a log entry naming who
 * acted and why before the state changes.
 */

export async function recordVisa(
  _previous: WorkflowResult,
  formData: FormData,
): Promise<WorkflowResult> {
  const caseId = String(formData.get("caseId") ?? "");
  const state = String(formData.get("state") ?? "") as VisaState;
  const note = String(formData.get("note") ?? "").trim();

  if (!state) return { status: "error", message: "Choose the outcome." };
  if ((state === "approved" || state === "refused") && note.length < 4) {
    return {
      status: "error",
      message: "A decision needs a reason recorded with it. It goes in the quarterly report.",
    };
  }

  const updated = await mutateCase(
    caseId,
    demoCounselor,
    "case.stage.write",
    (record) => recordVisaOutcome(record, state, note, demoCounselor.name),
    `Visa outcome recorded as ${state}`,
  );

  if (!updated) return { status: "error", message: "Not permitted on this case." };
  refreshed(caseId);

  return {
    status: "done",
    message:
      state === "refused"
        ? "Refusal recorded. It enters the quarterly report alongside the approvals, and the case is reviewed for a reapplication or an appeal."
        : "Recorded, and the quarterly report now counts it.",
  };
}

export async function recordOffer(
  _previous: WorkflowResult,
  formData: FormData,
): Promise<WorkflowResult> {
  const caseId = String(formData.get("caseId") ?? "");
  const applicationId = String(formData.get("applicationId") ?? "");
  const outcome = String(formData.get("outcome") ?? "") as ApplicationRecord["outcome"];
  const note = String(formData.get("note") ?? "").trim();

  if (!applicationId || !outcome) {
    return { status: "error", message: "Pick an application and an outcome." };
  }

  const updated = await mutateCase(
    caseId,
    demoCounselor,
    "case.stage.write",
    (record) =>
      outcome === "withdrawn"
        ? withdrawApplication(record, applicationId, note || "No reason given.", demoCounselor.name)
        : recordApplicationOutcome(record, applicationId, outcome, note, demoCounselor.name),
    `Application ${applicationId} recorded as ${outcome}`,
  );

  if (!updated) return { status: "error", message: "Not permitted on this case." };
  refreshed(caseId);

  return {
    status: "done",
    message:
      outcome === "withdrawn"
        ? "Marked withdrawn. The application stays on the record rather than disappearing from it."
        : "Recorded against the application.",
  };
}

export async function reapply(
  _previous: WorkflowResult,
  formData: FormData,
): Promise<WorkflowResult> {
  const caseId = String(formData.get("caseId") ?? "");
  const supersedes = String(formData.get("supersedes") ?? "");
  const university = String(formData.get("university") ?? "").trim();
  const programme = String(formData.get("programme") ?? "").trim();

  if (!supersedes || university.length < 3 || programme.length < 3) {
    return { status: "error", message: "Name the earlier application, the university and the programme." };
  }

  const updated = await mutateCase(
    caseId,
    demoCounselor,
    "case.stage.write",
    (record) =>
      startReapplication(
        record,
        supersedes,
        { id: `app-${Date.now()}`, university, programme },
        demoCounselor.name,
      ),
    `Reapplication opened, linked to ${supersedes}`,
  );

  if (!updated) return { status: "error", message: "Not permitted on this case." };
  refreshed(caseId);

  return {
    status: "done",
    message: "Opened and linked to the application it replaces, so the history reads as one story.",
  };
}

export async function defer(
  _previous: WorkflowResult,
  formData: FormData,
): Promise<WorkflowResult> {
  const caseId = String(formData.get("caseId") ?? "");
  const newIntake = String(formData.get("intake") ?? "").trim();
  const shiftDays = Number(formData.get("shiftDays") ?? 0);

  if (newIntake.length < 4 || !Number.isFinite(shiftDays) || shiftDays === 0) {
    return { status: "error", message: "Give the new intake and how far the dates move." };
  }

  const updated = await mutateCase(
    caseId,
    demoCounselor,
    "case.stage.write",
    (record) => deferIntake(record, newIntake, shiftDays, demoCounselor.name),
    `Deferred to ${newIntake}`,
  );

  if (!updated) return { status: "error", message: "Not permitted on this case." };
  refreshed(caseId);

  return {
    status: "done",
    message: `Deferred. Every deadline on the case moved with it, rather than being left behind to go quietly wrong.`,
  };
}

export async function correct(
  _previous: WorkflowResult,
  formData: FormData,
): Promise<WorkflowResult> {
  const caseId = String(formData.get("caseId") ?? "");
  const field = String(formData.get("field") ?? "") as CorrectableField;
  const value = String(formData.get("value") ?? "").trim();
  const reason = String(formData.get("reason") ?? "").trim();

  if (!field || !value || reason.length < 4) {
    return {
      status: "error",
      message: "A correction needs the new value and the reason for it. The reason is the part nobody can reconstruct later.",
    };
  }

  const updated = await mutateCase(
    caseId,
    demoCounselor,
    "case.note.write",
    (record) => applyCorrection(record, { field, value, reason }, demoCounselor.name),
    `Corrected ${field}`,
  );

  if (!updated) return { status: "error", message: "Not permitted on this case." };
  refreshed(caseId);

  return {
    status: "done",
    message: "Corrected. The old value is in the log with the reason, not overwritten.",
  };
}

export async function close(
  _previous: WorkflowResult,
  formData: FormData,
): Promise<WorkflowResult> {
  const caseId = String(formData.get("caseId") ?? "");
  const outcome = String(formData.get("outcome") ?? "") as ClosureOutcome;
  const reason = String(formData.get("reason") ?? "").trim();

  if (!outcome || reason.length < 4) {
    return { status: "error", message: "Closing a case needs an outcome and a reason." };
  }

  const updated = await mutateCase(
    caseId,
    demoFounder,
    "escalation.resolve",
    (record) => closeCase(record, outcome, reason, demoFounder.name),
    `Case closed as ${outcome}`,
  );

  if (!updated) return { status: "error", message: "Not permitted on this case." };
  refreshed(caseId);

  return {
    status: "done",
    message:
      "Closed, with the retention clock started. Nothing closes a case automatically, however quiet it goes.",
  };
}

export async function reassign(
  _previous: WorkflowResult,
  formData: FormData,
): Promise<WorkflowResult> {
  const caseId = String(formData.get("caseId") ?? "");
  const counselor = String(formData.get("counselor") ?? "").trim();
  const reason = String(formData.get("reason") ?? "").trim();

  if (counselor.length < 3 || reason.length < 4) {
    return { status: "error", message: "Name the counselor and the reason." };
  }

  const updated = await mutateCase(
    caseId,
    demoFounder,
    "case.reassign",
    (record) => reassignTo(record, counselor, reason, demoFounder.name),
    `Reassigned to ${counselor}`,
  );

  if (!updated) return { status: "error", message: "Not permitted on this case." };
  refreshed(caseId);

  return {
    status: "done",
    message: "Reassigned. The handover packet goes with it and the student is told who holds their case now.",
  };
}

export type SummaryResult =
  | { status: "idle" }
  | { status: "done"; line: string }
  | { status: "unavailable"; message: string };

/**
 * The Communication Summary agent. It writes one dated line and cannot reach
 * the raw record, which stays exactly as it was received.
 */
export async function summariseCommunication(
  _previous: SummaryResult,
  formData: FormData,
): Promise<SummaryResult> {
  const communicationId = String(formData.get("communicationId") ?? "");
  const caseId = String(formData.get("caseId") ?? "");

  const communication = await getCommunication(communicationId);
  if (!communication) {
    return { status: "unavailable", message: "That thread is not on file." };
  }

  const run = await summariseThread(
    communication.raw,
    communication.occurredAt.slice(0, 10),
  );

  if (run.status === "ok") {
    await attachThreadSummary(communicationId, run.data.line);
    revalidatePath(`/console/${caseId}`);
    return { status: "done", line: run.data.line };
  }

  if (run.status === "blocked") {
    return {
      status: "unavailable",
      message: `Summary discarded: ${run.violations.map((violation) => violation.rule).join("; ")}. The raw thread is unchanged.`,
    };
  }

  return { status: "unavailable", message: `${run.reason} ${run.fallback}` };
}
