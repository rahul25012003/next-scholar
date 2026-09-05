"use server";

import { currentActor } from "@/domain/session";

import {
  getCase,
  grantChannelConsent,
  listChannelConsents,
  withdrawChannelConsent,
} from "@/data/store";
import { revalidatePath } from "next/cache";
import { answerStudentQuestion, coachStatement } from "@/domain/agents/implementations";
import { record as recordAudit } from "@/domain/audit";

export type GuidanceResult =
  | { status: "idle" }
  | { status: "answered"; answer: string; basedOn: string }
  | { status: "routed"; message: string }
  | { status: "error"; message: string };

/**
 * The Student Guidance agent, scoped to the signed in student's own case and
 * the published policy pages. It is not a general chatbot, and anything it does
 * not recognise goes to the counselor rather than being improvised.
 */
export async function askGuidance(
  _previous: GuidanceResult,
  formData: FormData,
): Promise<GuidanceResult> {
  const actor = await currentActor();
  if (!actor) return { status: "error", message: "You are not signed in." };

  const question = String(formData.get("question") ?? "").trim();
  if (question.length < 5) {
    return { status: "error", message: "Ask the question in a sentence." };
  }

  const record = actor.caseId
    ? await getCase(actor.caseId, actor)
    : null;

  if (!record) {
    return { status: "error", message: "No case is open for this account." };
  }

  const run = await answerStudentQuestion(record, question);

  if (run.status === "ok") {
    if (run.data.routeToCounselor) {
      return {
        status: "routed",
        message: `${record.counselor} will answer this one. It has been added to their queue.`,
      };
    }
    return { status: "answered", answer: run.data.answer, basedOn: run.data.basedOn };
  }

  if (run.status === "blocked") {
    await recordAudit({
      actorId: "student-guidance",
      actorName: "Student Guidance agent",
      actorRole: "agent",
      action: "agent-blocked",
      subjectType: "case",
      subjectId: record.id,
      note: run.violations.map((violation) => violation.rule).join("; "),
    });
    return {
      status: "routed",
      message: `That answer was discarded before you saw it, because it broke a rule this platform enforces: ${run.violations
        .map((violation) => violation.rule)
        .join("; ")}. ${record.counselor} will answer instead.`,
    };
  }

  return { status: "routed", message: `${run.reason} ${run.fallback}` };
}

export type CoachingResult =
  | { status: "idle" }
  | { status: "coached"; questions: string[]; feedback: string }
  | { status: "unavailable"; message: string }
  | { status: "error"; message: string };

/**
 * Coaching, never drafting. If the model returns anything that reads like prose
 * written in the student's voice, the kernel's ghostwriting check discards it
 * before it reaches this function's caller.
 */
export async function coachSop(
  _previous: CoachingResult,
  formData: FormData,
): Promise<CoachingResult> {
  const actor = await currentActor();
  if (!actor) return { status: "error", message: "You are not signed in." };

  const draft = String(formData.get("draft") ?? "").trim();
  if (draft.length < 40) {
    return {
      status: "error",
      message: "Write a paragraph of your own first. There is nothing to coach yet.",
    };
  }

  const run = await coachStatement(draft);

  if (run.status === "ok") {
    return {
      status: "coached",
      questions: run.data.questions,
      feedback: run.data.structuralFeedback,
    };
  }

  if (run.status === "blocked") {
    return {
      status: "unavailable",
      message:
        "That response was discarded because it started writing for you, which this agent is not allowed to do. Try asking it about a specific paragraph instead.",
    };
  }

  return { status: "unavailable", message: `${run.reason} ${run.fallback}` };
}

export type ChannelResult =
  | { status: "idle" }
  | { status: "changed"; message: string }
  | { status: "error"; message: string };

/**
 * A student changing their own contact preferences.
 *
 * The actor comes from the session and the case is checked against it, so a
 * submitted case id cannot move someone else's consent. A staff account is
 * refused outright: the notification planner fails closed on a missing opt in,
 * and a counsellor who could add one on a student's behalf would be routing
 * around exactly the control that makes the failure closed.
 */
export async function setChannelPreference(
  _previous: ChannelResult,
  formData: FormData,
): Promise<ChannelResult> {
  const actor = await currentActor();
  if (!actor) return { status: "error", message: "You are not signed in." };
  if (actor.role !== "student") {
    return {
      status: "error",
      message:
        "Only the student can change their own contact preferences. That is deliberate: consent a counsellor could add on someone's behalf is not consent.",
    };
  }

  const caseId = String(formData.get("caseId") ?? "");
  if (!caseId || caseId !== actor.caseId) {
    return { status: "error", message: "That case is not yours." };
  }

  const channel = String(formData.get("channel") ?? "");
  if (channel !== "email" && channel !== "whatsapp") {
    return { status: "error", message: "Unknown channel." };
  }

  const turningOn = String(formData.get("on") ?? "") === "on";

  if (turningOn) {
    const granted = await grantChannelConsent(caseId, channel, actor);
    if (!granted) return { status: "error", message: "That could not be recorded." };
    revalidatePath("/portal");
    return {
      status: "changed",
      message: `${channel === "email" ? "Email" : "WhatsApp"} is on. The opt in is timestamped against your name.`,
    };
  }

  const live = (await listChannelConsents(caseId, actor)).find(
    (consent) => consent.channel === channel && consent.withdrawnAt === null,
  );
  if (!live) {
    return { status: "changed", message: "That channel was already off." };
  }

  await withdrawChannelConsent(live.id, actor);
  revalidatePath("/portal");
  return {
    status: "changed",
    message: `${channel === "email" ? "Email" : "WhatsApp"} is off. The withdrawal is stamped rather than deleted, because the fact that consent once existed is part of the audit answer.`,
  };
}
