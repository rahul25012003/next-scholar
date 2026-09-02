import {
  daysSince,
  daysUntil,
  stageIndex,
  type Priority,
  type StageKey,
  type StudentCase,
} from "./case";

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

/** Documents a stage cannot proceed without. */
const requiredDocuments: Partial<Record<StageKey, string[]>> = {
  documents: ["transcript", "passport", "english-test"],
  applications: ["transcript", "passport", "english-test"],
  offers: ["transcript", "passport", "english-test"],
  finance: ["funding"],
  visa: ["funding", "passport"],
};

const documentLabels: Record<string, string> = {
  transcript: "Academic transcript",
  passport: "Passport",
  "english-test": "English test result",
  funding: "Funding evidence",
  recommendation: "Letter of recommendation",
  other: "Supporting document",
};

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

  const required = requiredDocuments[record.stage] ?? [];
  for (const category of required) {
    const document = record.documents.find((item) => item.category === category);
    if (!document || document.status !== "Verified") {
      events.push({
        key: `${record.id}:missing_doc:${category}`,
        caseId: record.id,
        type: "missing_doc",
        priority: document?.status === "Issue found" ? "High" : "Normal",
        audience: "student_and_counselor",
        title: `${documentLabels[category]} is not verified`,
        detail: document
          ? `Currently marked ${document.status.toLowerCase()}.${document.issue ? ` ${document.issue}` : ""}`
          : "Not uploaded yet.",
        basis: `Required at the ${record.stage} stage`,
      });
    }
  }

  for (const document of record.documents) {
    if (!document.expiresOn) continue;
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
