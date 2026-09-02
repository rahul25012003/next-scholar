"use server";

import { getCase } from "@/data/store";
import { demoStudent } from "@/domain/demo-actors";
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
  const question = String(formData.get("question") ?? "").trim();
  if (question.length < 5) {
    return { status: "error", message: "Ask the question in a sentence." };
  }

  const record = demoStudent.caseId
    ? await getCase(demoStudent.caseId, demoStudent)
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
    recordAudit({
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
