import {
  daysSince,
  daysUntil,
  stageIndex,
  type Priority,
  type StudentCase,
} from "./case";
import { categoryLabel } from "./consent";
import { requiredAtStage } from "./completeness";

export type EventType =
  | "deadline"
  | "missing_doc"
  | "expiry"
  | "university_delay"
  | "stagnation"
  | "inactivity"
  | "followup_due"
  | "sla_breach"
  | "escalation";

export type Audience =
  | "student"
  | "counselor"
  | "manager"
  | "student_and_counselor";

export type LifecycleEvent = {
  /** Stable across re-detection, so an open event is updated, never duplicated. */
  key: string;
  caseId: string;
  type: EventType;
  priority: Priority;
  audience: Audience;
  title: string;
  detail: string;
  /** The stored value the event was derived from. Nothing here is invented. */
  basis: string;
};

/**
 * Required documents come from the curated requirement list, not from a second
 * copy kept here. The two used to disagree, which meant a case could read as
 * complete on one screen and incomplete on another.
 */

/** How long a university may sit on an application before it is chased. */
const universitySilenceDays: Record<string, number> = {
  "United Kingdom": 21,
  Germany: 35,
  Ireland: 21,
};

const STAGNATION_DAYS = 5;
const INACTIVITY_DAYS = 5;
const SLA_HOURS = 24;
const ESCALATION_DAYS = 10;

/**
 * Detection reads stored state only: a stage timestamp a person set, a deadline
 * a person entered, a document status a person assigned. Automation raises
 * visibility. It never invents the state it is looking at.
 */
export function detectEvents(record: StudentCase, now = new Date()): LifecycleEvent[] {
  const events: LifecycleEvent[] = [];

  const applyingOnward = [
    "applications",
    "offers",
    "finance",
    "visa",
    "pre-departure",
  ];
  if (record.deadlines.length === 0 && applyingOnward.includes(record.stage)) {
    events.push({
      key: `${record.id}:deadline:none-on-file`,
      caseId: record.id,
      type: "deadline",
      priority: "High",
      audience: "counselor",
      title: "No deadline is on file for this case",
      detail:
        "A case at this stage runs against dates. None have been entered, so nothing can be watched. Absent is not the same as none.",
      basis: "The deadline list on the case record is empty",
    });
  }

  for (const deadline of record.deadlines) {
    const days = daysUntil(deadline.date, now);
    if (days < 0 || days > 30) continue;
    const priority: Priority = days <= 3 ? "Urgent" : days <= 14 ? "High" : "Normal";
    events.push({
      key: `${record.id}:deadline:${deadline.label}`,
      caseId: record.id,
      type: "deadline",
      priority,
      audience: "student_and_counselor",
      title: `${deadline.label} in ${days} ${days === 1 ? "day" : "days"}`,
      detail: `Due ${deadline.date}.`,
      basis: `Deadline entered on the case record: ${deadline.date}`,
    });
  }

  for (const task of record.tasks) {
    if (task.completedAt) continue;
    const due = daysUntil(task.dueOn, now);
    if (due > 0) continue;
    events.push({
      key: `${record.id}:followup_due:${task.id}`,
      caseId: record.id,
      type: "followup_due",
      priority: due <= -3 ? "High" : "Normal",
      audience: "counselor",
      title:
        due === 0
          ? `Follow up due today: ${task.title}`
          : `Follow up ${Math.abs(due)} ${Math.abs(due) === 1 ? "day" : "days"} overdue: ${task.title}`,
      detail: `Set by ${task.createdBy} for ${task.dueOn}.`,
      basis: "A follow up task a person created on this case",
    });
  }

  const required = requiredAtStage(record.destination, record.stage, record.route);
  for (const category of required) {
    const document = record.documents.find((item) => item.category === category);
    if (!document || document.status !== "Verified") {
      events.push({
        key: `${record.id}:missing_doc:${category}`,
        caseId: record.id,
        type: "missing_doc",
        priority: document?.status === "Issue found" ? "High" : "Normal",
        audience: "student_and_counselor",
        title: `${categoryLabel[category]} is not verified`,
        detail: document
          ? `Currently marked ${document.status.toLowerCase()}.${document.issue ? ` ${document.issue}` : ""}`
          : "Not uploaded yet.",
        basis: `Required at the ${record.stage} stage`,
      });
    }
  }

  for (const document of record.documents) {
    if (!document.expiresOn) {
      if (document.category === "passport" || document.category === "english-test") {
        events.push({
          key: `${record.id}:expiry:missing:${document.id}`,
          caseId: record.id,
          type: "expiry",
          priority: "Normal",
          audience: "counselor",
          title: `No expiry date on file for ${document.name}`,
          detail:
            "This document type expires, and the date has not been recorded, so nothing is watching it.",
          basis: "The expiry field on the document is empty",
        });
      }
      continue;
    }
    const days = daysUntil(document.expiresOn, now);
    if (days < 0 || days > 60) continue;
    events.push({
      key: `${record.id}:expiry:${document.id}`,
      caseId: record.id,
      type: "expiry",
      priority: days <= 7 ? "Urgent" : days <= 30 ? "High" : "Normal",
      audience: "student_and_counselor",
      title: `${document.name} expires in ${days} ${days === 1 ? "day" : "days"}`,
      detail: `Valid until ${document.expiresOn}. Renewal takes longer than the window left.`,
      basis: `Expiry date recorded on the document`,
    });
  }

  const waitingOnUniversity =
    record.stage === "applications" || record.stage === "offers";
  if (waitingOnUniversity) {
    const limit = universitySilenceDays[record.destination] ?? 28;
    for (const application of record.applications) {
      if (application.outcome !== "pending" || !application.submittedOn) continue;
      const waiting = daysSince(application.submittedOn, now);
      if (waiting < limit) continue;
      events.push({
        key: `${record.id}:university_delay:${application.id}`,
        caseId: record.id,
        type: "university_delay",
        priority: "Normal",
        audience: "counselor",
        title: `${application.university} has been silent for ${waiting} days`,
        detail: `Submitted ${application.submittedOn}. The threshold for ${record.destination} is ${limit} days.`,
        basis: "Submission date recorded on the application",
      });
    }
  }

  const stuckFor = daysSince(record.stageUpdatedAt, now);
  if (stuckFor >= STAGNATION_DAYS && stageIndex(record.stage) < 10) {
    events.push({
      key: `${record.id}:stagnation`,
      caseId: record.id,
      type: "stagnation",
      priority: stuckFor >= ESCALATION_DAYS ? "High" : "Normal",
      audience: "counselor",
      title: `No stage change for ${stuckFor} days`,
      detail: `Still at ${record.stage}. Last moved ${record.stageUpdatedAt}.`,
      basis: "Stage timestamp on the case record",
    });
  }

  const quietFor = daysSince(record.lastStudentContactAt, now);
  if (quietFor >= INACTIVITY_DAYS) {
    events.push({
      key: `${record.id}:inactivity`,
      caseId: record.id,
      type: "inactivity",
      priority: quietFor >= ESCALATION_DAYS ? "High" : "Normal",
      audience: quietFor >= ESCALATION_DAYS ? "counselor" : "student",
      title: `No response from the student for ${quietFor} days`,
      detail: `Last heard from ${record.lastStudentContactAt}.`,
      basis: "Last student contact timestamp",
    });
  }

  const replyGapHours =
    (new Date(record.lastCounselorReplyAt).getTime() <
    new Date(record.lastStudentContactAt).getTime()
      ? new Date(now).getTime() - new Date(record.lastStudentContactAt).getTime()
      : 0) / 3_600_000;

  if (replyGapHours > SLA_HOURS) {
    const overdueDays = Math.floor(replyGapHours / 24);
    events.push({
      key: `${record.id}:sla_breach`,
      caseId: record.id,
      type: "sla_breach",
      priority: overdueDays >= 3 ? "Urgent" : "High",
      audience: overdueDays >= 3 ? "manager" : "counselor",
      title: `Student has been waiting ${Math.round(replyGapHours)} hours for a reply`,
      detail: `They wrote on ${record.lastStudentContactAt}. The response threshold is ${SLA_HOURS} hours.`,
      basis: "Student contact and counselor reply timestamps",
    });
  }

  if (stuckFor >= ESCALATION_DAYS) {
    events.push({
      key: `${record.id}:escalation`,
      caseId: record.id,
      type: "escalation",
      priority: "Urgent",
      audience: "manager",
      title: `Escalated after ${stuckFor} days without movement`,
      detail:
        "Raised to a manager for a decision. No automated step resolves, reassigns or closes this.",
      basis: "Stagnation past the second threshold",
    });
  }

  return events;
}

export function detectAll(cases: StudentCase[], now = new Date()): LifecycleEvent[] {
  return cases.flatMap((record) => detectEvents(record, now));
}

const priorityRank: Record<Priority, number> = { Urgent: 0, High: 1, Normal: 2 };

export function byPriority(a: LifecycleEvent, b: LifecycleEvent): number {
  return priorityRank[a.priority] - priorityRank[b.priority];
}
