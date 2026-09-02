/**
 * The student case record. One shape, read by the student portal, the counselor
 * console and the operations dashboard, so a stage cannot mean one thing in
 * public and another thing internally.
 */

import { stages } from "@/content/process";

export type StageKey = (typeof stages)[number]["key"];

export type DocStatus = "Not started" | "In review" | "Issue found" | "Verified";
export type Priority = "Normal" | "High" | "Urgent";

/** Every write carries its author. A wrong status always has a traceable one. */
export type Source = "human" | "ai" | "system";

export type LogEntry = {
  ts: string;
  text: string;
  source: Source;
  /** Named staff member for human entries, agent name for machine entries. */
  author: string;
};

export type DocumentRecord = {
  id: string;
  name: string;
  category:
    | "transcript"
    | "passport"
    | "english-test"
    | "funding"
    | "recommendation"
    | "other";
  status: DocStatus;
  /** Every re-upload is a new version. Old versions are never overwritten. */
  version: number;
  uploadedAt: string;
  /** Only a named person can set this. No agent may write it. */
  verifiedBy: string | null;
  verifiedAt: string | null;
  expiresOn: string | null;
  issue: string | null;
};

/**
 * A follow up a counselor set for themselves. The spec's follow-up queue is
 * about these, not about lifecycle events: an event is something the system
 * noticed, a task is something a person decided to do later.
 */
export type FollowUpTask = {
  id: string;
  title: string;
  dueOn: string;
  createdBy: string;
  createdAt: string;
  completedAt: string | null;
  completedBy: string | null;
};

export type ApplicationRecord = {
  id: string;
  university: string;
  programme: string;
  destination: string;
  reference: string | null;
  portalUrl: string | null;
  submittedOn: string | null;
  outcome: "pending" | "offer" | "rejected" | "withdrawn" | "deferred";
  outcomeNote: string | null;
  /** Set when this application replaces an earlier one, never a fresh record. */
  supersedes?: string;
};

/** Tracked as its own field so the quarterly report counts, never assumes. */
export type VisaState =
  | "not-started"
  | "preparing"
  | "submitted"
  | "approved"
  | "refused";

export const visaLabel: Record<VisaState, string> = {
  "not-started": "Not started",
  preparing: "File in preparation",
  submitted: "Submitted, awaiting decision",
  approved: "Approved",
  refused: "Refused",
};

export type StudentCase = {
  id: string;
  name: string;
  destination: string;
  intake: string;
  counselor: string;
  /**
   * From the six question consultation intake. Every field is nullable, and
   * absent means unknown rather than zero, because matching on a value nobody
   * supplied is how a shortlist becomes fiction.
   */
  budgetInr: number | null;
  profile: {
    degree: string | null;
    /** Normalised to a percentage. A CGPA is converted on entry, not guessed. */
    percentage: number | null;
    graduationYear: number | null;
    englishTest: { name: string; score: string } | null;
  };
  stage: StageKey;
  stageUpdatedAt: string;
  docStatus: DocStatus;
  priority: Priority;
  /** Written by the Case Summary agent. Always labelled, always editable. */
  summary: string | null;
  summarySource: Source | null;
  suggestedAction: string | null;
  suggestedActionSource: Source | null;
  lastStudentContactAt: string;
  lastCounselorReplyAt: string;
  /** Deadlines the monitoring agent watches. Absent means absent, not zero. */
  deadlines: { label: string; date: string }[];
  tasks: FollowUpTask[];
  documents: DocumentRecord[];
  applications: ApplicationRecord[];
  visa: { state: VisaState; note: string | null; decidedOn: string | null };
  log: LogEntry[];
  /** Set only by a person closing the case. Starts the retention clock. */
  closedAt: string | null;
  /**
   * Raised when an agent failed on a note, so the failure is visible on the
   * caseload rather than living for one render inside a form. Cleared by a
   * person, never by a later successful run.
   */
  needsManualReview: { at: string; note: string; reason: string } | null;
  /** Marks fixture data so it can never be mistaken for a real applicant. */
  synthetic: boolean;
};

export const stageOrder: StageKey[] = stages.map((stage) => stage.key);

export function stageIndex(stage: StageKey): number {
  return stageOrder.indexOf(stage);
}

export function daysSince(iso: string, now = new Date()): number {
  const then = new Date(iso).getTime();
  return Math.floor((now.getTime() - then) / 86_400_000);
}

export function daysUntil(iso: string, now = new Date()): number {
  const then = new Date(iso).getTime();
  return Math.ceil((then - now.getTime()) / 86_400_000);
}
