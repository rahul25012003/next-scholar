import type {
  ApplicationRecord,
  LogEntry,
  StageKey,
  StudentCase,
  VisaState,
} from "./case";

/**
 * The operational workflows from section 8.10 of the build spec.
 *
 * Every one of them is a pure transformation that returns a new case record
 * with a log entry appended. Three rules hold across all of them:
 *
 *  - Nothing is deleted. A withdrawn application stays on the record marked
 *    withdrawn, and a corrected value keeps its old value in the log.
 *  - Nothing resolves itself. Each function is called by a person taking an
 *    action, never by a timer or an agent.
 *  - Every change says who made it and why, because the reason is the part
 *    that is impossible to reconstruct six months later.
 */

function withEntry(
  record: StudentCase,
  text: string,
  author: string,
  now: Date,
): StudentCase {
  const entry: LogEntry = {
    ts: now.toISOString(),
    text,
    source: "human",
    author,
  };
  return { ...record, log: [...record.log, entry] };
}

export type CorrectableField =
  | "intake"
  | "destination"
  | "priority"
  | "budgetInr"
  | "name"
  | "counselor"
  | "deadline"
  | "reference";

export type Correction = {
  field: CorrectableField;
  /**
   * Set only when the field lives inside a list rather than on the case
   * directly: the deadline's label for "deadline", the application's id for
   * "reference".
   */
  targetId?: string;
  value: string;
  reason: string;
};

/**
 * A correction records what the value was, what it became, and why. The old
 * value is never silently overwritten, which is the difference between a
 * correction and a cover up.
 */
export function applyCorrection(
  record: StudentCase,
  correction: Correction,
  author: string,
  now = new Date(),
): StudentCase {
  const next: StudentCase = { ...record };
  let before: string;

  if (correction.field === "budgetInr") {
    before = String(record.budgetInr ?? "not set");
    const parsed = Number(correction.value.replace(/[^\d]/g, ""));
    next.budgetInr = Number.isFinite(parsed) && parsed > 0 ? parsed : null;
  } else if (correction.field === "priority") {
    before = record.priority;
    next.priority = correction.value as StudentCase["priority"];
  } else if (correction.field === "deadline") {
    const target = record.deadlines.find((item) => item.label === correction.targetId);
    before = target?.date ?? "not set";
    next.deadlines = record.deadlines.map((item) =>
      item.label === correction.targetId ? { ...item, date: correction.value } : item,
    );
  } else if (correction.field === "reference") {
    const target = record.applications.find((item) => item.id === correction.targetId);
    before = target?.reference ?? "not set";
    next.applications = record.applications.map((item) =>
      item.id === correction.targetId ? { ...item, reference: correction.value } : item,
    );
  } else {
    before = String(record[correction.field] ?? "not set");
    next[correction.field] = correction.value;
  }

  const label = correction.targetId ? `${correction.field} (${correction.targetId})` : correction.field;
  return withEntry(
    next,
    `Corrected ${label} from "${before}" to "${correction.value}". Reason: ${correction.reason}`,
    author,
    now,
  );
}

export type ClosureOutcome =
  | "enrolled"
  | "withdrawn-by-student"
  | "visa-refused"
  | "advised-not-to-proceed"
  | "lost-contact";

export const closureLabel: Record<ClosureOutcome, string> = {
  enrolled: "Enrolled",
  "withdrawn-by-student": "Withdrawn by the student",
  "visa-refused": "Visa refused",
  "advised-not-to-proceed": "Advised not to proceed",
  "lost-contact": "Contact lost",
};

/**
 * Closure is always a person's decision. There is no path in this codebase that
 * closes an inactive case automatically, deliberately, because a case that goes
 * quiet is a case that needs a phone call rather than a status change.
 */
export function closeCase(
  record: StudentCase,
  outcome: ClosureOutcome,
  reason: string,
  author: string,
  now = new Date(),
): StudentCase {
  const closed: StudentCase = {
    ...record,
    stage: "outcome",
    stageUpdatedAt: now.toISOString(),
    closedAt: now.toISOString(),
  };

  return withEntry(
    closed,
    `Case closed as ${closureLabel[outcome].toLowerCase()}. ${reason} The retention clock starts today, and the outcome enters the quarterly report either way.`,
    author,
    now,
  );
}

/**
 * A deferral holds the case and moves every deadline with the intake, rather
 * than leaving dates behind that quietly become wrong.
 */
export function deferIntake(
  record: StudentCase,
  newIntake: string,
  shiftDays: number,
  author: string,
  now = new Date(),
): StudentCase {
  const shifted = record.deadlines.map((deadline) => {
    const moved = new Date(deadline.date);
    moved.setDate(moved.getDate() + shiftDays);
    return { ...deadline, date: moved.toISOString().slice(0, 10) };
  });

  return withEntry(
    { ...record, intake: newIntake, deadlines: shifted },
    `Deferred from ${record.intake} to ${newIntake}. ${shifted.length} deadline${shifted.length === 1 ? "" : "s"} recalculated by ${shiftDays} days.`,
    author,
    now,
  );
}

export function withdrawApplication(
  record: StudentCase,
  applicationId: string,
  reason: string,
  author: string,
  now = new Date(),
): StudentCase {
  const application = record.applications.find((item) => item.id === applicationId);
  if (!application) return record;

  return withEntry(
    {
      ...record,
      applications: record.applications.map((item) =>
        item.id === applicationId
          ? { ...item, outcome: "withdrawn" as const, outcomeNote: reason }
          : item,
      ),
    },
    `Withdrew the ${application.university} application. Reason: ${reason} The record stays on file, marked withdrawn.`,
    author,
    now,
  );
}

/**
 * A reapplication is linked to the application it replaces, not filed as an
 * unrelated new record, so the history reads as one story.
 */
export function startReapplication(
  record: StudentCase,
  supersedes: string,
  next: { id: string; university: string; programme: string },
  author: string,
  now = new Date(),
): StudentCase {
  const previous = record.applications.find((item) => item.id === supersedes);

  const application: ApplicationRecord = {
    id: next.id,
    university: next.university,
    programme: next.programme,
    destination: record.destination,
    reference: null,
    portalUrl: null,
    submittedOn: null,
    outcome: "pending",
    outcomeNote: null,
    supersedes,
  };

  return withEntry(
    { ...record, applications: [...record.applications, application] },
    `Reapplication opened at ${next.university}, linked to the earlier ${previous?.university ?? "application"}.`,
    author,
    now,
  );
}

export function recordApplicationOutcome(
  record: StudentCase,
  applicationId: string,
  outcome: ApplicationRecord["outcome"],
  note: string,
  author: string,
  now = new Date(),
): StudentCase {
  const application = record.applications.find((item) => item.id === applicationId);
  if (!application) return record;

  return withEntry(
    {
      ...record,
      applications: record.applications.map((item) =>
        item.id === applicationId ? { ...item, outcome, outcomeNote: note } : item,
      ),
    },
    `${application.university}: ${outcome}. ${note}`,
    author,
    now,
  );
}

/**
 * The visa result, recorded when it happens. A refusal is recorded the same way
 * an approval is, because the quarterly report publishes both.
 */
export function recordVisaOutcome(
  record: StudentCase,
  state: VisaState,
  note: string,
  author: string,
  now = new Date(),
): StudentCase {
  const decided = state === "approved" || state === "refused";

  return withEntry(
    {
      ...record,
      visa: {
        state,
        note: note || null,
        decidedOn: decided ? now.toISOString().slice(0, 10) : null,
      },
    },
    `Visa ${state.replace("-", " ")}. ${note}${
      state === "refused"
        ? " The refusal enters the quarterly report, and the case is reviewed for a reapplication or an appeal."
        : ""
    }`,
    author,
    now,
  );
}

/** Reassignment is a manager action, and the handover packet goes with it. */
export function reassignTo(
  record: StudentCase,
  counselor: string,
  reason: string,
  author: string,
  now = new Date(),
): StudentCase {
  return withEntry(
    { ...record, counselor },
    `Reassigned from ${record.counselor} to ${counselor}. Reason: ${reason} The handover packet goes with it, and the student is told who now holds their case.`,
    author,
    now,
  );
}

export function changeStage(
  record: StudentCase,
  stage: StageKey,
  author: string,
  now = new Date(),
): StudentCase {
  if (stage === record.stage) return record;

  return withEntry(
    { ...record, stage, stageUpdatedAt: now.toISOString() },
    `Stage moved from ${record.stage} to ${stage}.`,
    author,
    now,
  );
}

/** A counselor setting themselves a follow up. */
export function addTask(
  record: StudentCase,
  task: { id: string; title: string; dueOn: string },
  author: string,
  now = new Date(),
): StudentCase {
  return withEntry(
    {
      ...record,
      tasks: [
        ...record.tasks,
        {
          ...task,
          createdBy: author,
          createdAt: now.toISOString(),
          completedAt: null,
          completedBy: null,
        },
      ],
    },
    `Follow up set for ${task.dueOn}: ${task.title}`,
    author,
    now,
  );
}

/** Completing one. The task stays on the record, stamped. */
export function completeTask(
  record: StudentCase,
  taskId: string,
  author: string,
  now = new Date(),
): StudentCase {
  const task = record.tasks.find((item) => item.id === taskId);
  if (!task || task.completedAt) return record;

  return withEntry(
    {
      ...record,
      tasks: record.tasks.map((item) =>
        item.id === taskId
          ? { ...item, completedAt: now.toISOString(), completedBy: author }
          : item,
      ),
    },
    `Follow up done: ${task.title}`,
    author,
    now,
  );
}

/**
 * A manager overriding a machine written summary.
 *
 * The interface has always said the summary is editable. Until now it was not,
 * which made the claim the same kind of promise this platform exists to avoid.
 * An overridden summary stops being machine written, because a person wrote it.
 */
export function overrideSummary(
  record: StudentCase,
  summary: string,
  author: string,
  now = new Date(),
): StudentCase {
  return withEntry(
    {
      ...record,
      summary,
      summarySource: "human",
    },
    `Case summary rewritten by hand, replacing the machine written one.`,
    author,
    now,
  );
}

/**
 * A manager reviewing an escalation and recording the decision.
 *
 * Escalations are recomputed from timestamps, so "resolved" is not a flag that
 * silences them. It records that a person looked and what they decided, and the
 * escalation clears when the underlying condition does.
 */
export function reviewEscalation(
  record: StudentCase,
  decision: string,
  author: string,
  now = new Date(),
): StudentCase {
  return withEntry(
    record,
    `Escalation reviewed. Decision: ${decision} The case still raises it until the underlying condition clears.`,
    author,
    now,
  );
}
