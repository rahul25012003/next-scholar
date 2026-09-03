import { daysSince, type StudentCase } from "./case";

/**
 * Service levels, computed from stored timestamps.
 *
 * Every one of these is a subtraction over two dates that are already on the
 * record. Nothing here estimates, predicts or scores: a case is inside its
 * target, close to it, or past it, and the number of days is printed so the
 * state can be checked rather than trusted.
 *
 * The targets are ours and they are published here rather than living in
 * someone's head, because a service level nobody can quote is not one.
 */

export type SlaState = "within" | "due" | "breached" | "not-applicable";

export type SlaCheck = {
  id: string;
  label: string;
  state: SlaState;
  /** The target, in the words we would use to a client. */
  target: string;
  /** What actually happened, as a figure. */
  actual: string;
  detail: string;
};

export const slaTargets = {
  reply: {
    days: 2,
    label: "Reply to a student",
    statement: "A student who writes to us gets a substantive reply within two working days.",
  },
  stage: {
    days: 5,
    label: "Stage movement",
    statement:
      "A case does not sit in one stage for more than five days without either moving or a written note saying why it has not.",
  },
  documentReview: {
    days: 3,
    label: "Document review",
    statement: "An uploaded document is reviewed within three working days.",
  },
} as const;

function stateFor(elapsed: number, target: number): SlaState {
  if (elapsed > target) return "breached";
  if (elapsed >= target) return "due";
  return "within";
}

export function slaFor(record: StudentCase, now = new Date()): SlaCheck[] {
  const checks: SlaCheck[] = [];

  // The reply clock only runs when the student spoke last. A case where we
  // replied most recently is waiting on them, and counting that against us
  // would make the whole indicator meaningless.
  const studentWaiting =
    new Date(record.lastStudentContactAt).getTime() >
    new Date(record.lastCounselorReplyAt).getTime();
  const sinceContact = daysSince(record.lastStudentContactAt, now);

  checks.push({
    id: "reply",
    label: slaTargets.reply.label,
    state: studentWaiting
      ? stateFor(sinceContact, slaTargets.reply.days)
      : "not-applicable",
    target: `${slaTargets.reply.days} working days`,
    actual: studentWaiting ? `${sinceContact} days waiting` : "Waiting on the student",
    detail: studentWaiting
      ? sinceContact > slaTargets.reply.days
        ? "They wrote and have not had a substantive reply inside the target."
        : "Inside the target. The clock started when they last wrote."
      : "We replied after their last message, so this clock is not running.",
  });

  const stuck = daysSince(record.stageUpdatedAt, now);
  checks.push({
    id: "stage",
    label: slaTargets.stage.label,
    state: record.closedAt ? "not-applicable" : stateFor(stuck, slaTargets.stage.days),
    target: `${slaTargets.stage.days} days`,
    actual: `${stuck} days in ${record.stage.replace(/-/g, " ")}`,
    detail: record.closedAt
      ? "The case is closed, so stage movement is not expected."
      : stuck > slaTargets.stage.days
        ? "Either it moves or a note explains why it has not. A stage that sits silently is the failure this target exists to catch."
        : "Moving inside the target.",
  });

  const awaiting = record.documents.filter(
    (document) => document.status === "In review",
  );
  const oldest = awaiting
    .map((document) => daysSince(document.uploadedAt, now))
    .sort((a, b) => b - a)[0];

  checks.push({
    id: "documents",
    label: slaTargets.documentReview.label,
    state:
      oldest === undefined
        ? "not-applicable"
        : stateFor(oldest, slaTargets.documentReview.days),
    target: `${slaTargets.documentReview.days} working days`,
    actual:
      oldest === undefined
        ? "Nothing awaiting review"
        : `${awaiting.length} in review, oldest ${oldest} days`,
    detail:
      oldest === undefined
        ? "No document is sitting in review on this case."
        : oldest > slaTargets.documentReview.days
          ? "A document has been in review past the target. Only a named person can clear it, and nothing here will clear it for them."
          : "Inside the target.",
  });

  return checks;
}

/** The worst state across the checks, for a caseload row. */
export function worstSla(record: StudentCase, now = new Date()): SlaState {
  const states = slaFor(record, now).map((check) => check.state);
  if (states.includes("breached")) return "breached";
  if (states.includes("due")) return "due";
  if (states.includes("within")) return "within";
  return "not-applicable";
}

export const slaLabel: Record<SlaState, string> = {
  within: "Within target",
  due: "Due today",
  breached: "Past target",
  "not-applicable": "No clock running",
};
