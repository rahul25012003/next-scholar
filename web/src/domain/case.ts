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

/**
 * A language qualification, of any language.
 *
 * The record previously held one field, `englishTest`, which meant TestDaF, DSH,
 * telc and Goethe could not be stored anywhere on a case. For the German route
 * that is not a missing nicety: the language certificate is the admission
 * condition, and a system that cannot record it cannot check it.
 */
export type LanguageTestResult = {
  /** "IELTS", "IELTS for UKVI", "TestDaF", "DSH", "telc", "Goethe-Zertifikat". */
  name: string;
  /** Exactly as the provider states it: "7.0", "TDN 4", "DSH-2", "C1". */
  score: string;
  language: "english" | "german";
  takenOn: string | null;
  /** Null means the provider states no expiry, not that nobody checked. */
  expiresOn: string | null;
};

/**
 * The German recognition question, which decides more Indian applications than
 * the language test does and which this record could not previously represent.
 *
 * Every field is nullable and null means unchecked. In particular `anabin` is
 * "not-checked" until a person has looked it up, because assuming H+ is how a
 * shortlist fills with universities the applicant cannot apply to.
 */
export type DegreeRecognition = {
  /** The anabin rating of the awarding institution. */
  anabin: "h-plus" | "h-plus-minus" | "h-minus" | "not-checked";
  /** Three or four year Bachelor's. The German gate is credits, not years. */
  bachelorYears: 3 | 4 | null;
  /** ECTS-equivalent total, where a conversion has actually been done. */
  totalCredits: number | null;
  /** Subject-wise credits a programme's module handbook asks for. */
  subjectCredits: { area: string; held: number }[];
  studienkolleg: "not-required" | "required" | "in-progress" | "completed" | "unknown";
  /** Only a named person may set this. No agent may write it. */
  checkedBy: string | null;
  checkedOn: string | null;
  note: string | null;
};

export type DocumentRecord = {
  id: string;
  name: string;
  category:
    | "transcript"
    | "passport"
    | "english-test"
    | "german-test"
    | "degree-recognition"
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
  /**
   * Set once an offer is on record, never cleared by a later outcome change,
   * so a declined offer's terms stay on the file they described. Compared
   * side by side once two or more applications on a case carry one.
   */
  offer?: {
    depositInr: number | null;
    depositDeadline: string | null;
    scholarshipNote: string | null;
  } | null;
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
  /**
   * The route within the destination, where a country splits into routes with
   * different requirements and different commission to us. Null where the
   * country has one route. Without this a German private applicant was checked
   * against the public university requirement set and nothing said so.
   */
  route: string | null;
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
    /** Every language qualification on file, English or German. */
    languageTests: LanguageTestResult[];
    /** Null until someone checks. Only meaningful on the German route today. */
    recognition: DegreeRecognition | null;
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

/**
 * Opens a case. This is the one gap `saveCase` in `data/store.ts` never
 * covered: every function that reaches a case, before this, assumed one
 * already existed, so a real lead had no path from a completed consultation
 * into the system at all, in either storage mode. Everything not yet known
 * (the academic profile, documents, applications) starts empty rather than
 * guessed, exactly like a synthetic fixture minus the fiction.
 */
export type NewCaseInput = {
  id: string;
  name: string;
  destination: string;
  route: string | null;
  intake: string;
  counselor: string;
  budgetInr: number | null;
};

export function createCase(input: NewCaseInput, author: string, now = new Date()): StudentCase {
  const nowIso = now.toISOString();
  return {
    id: input.id,
    name: input.name,
    destination: input.destination,
    route: input.route,
    intake: input.intake,
    counselor: input.counselor,
    budgetInr: input.budgetInr,
    profile: {
      degree: null,
      percentage: null,
      graduationYear: null,
      languageTests: [],
      recognition: null,
    },
    stage: "consultation",
    stageUpdatedAt: nowIso,
    docStatus: "Not started",
    priority: "Normal",
    summary: null,
    summarySource: null,
    suggestedAction: null,
    suggestedActionSource: null,
    lastStudentContactAt: nowIso,
    lastCounselorReplyAt: nowIso,
    deadlines: [],
    tasks: [],
    documents: [],
    applications: [],
    visa: { state: "not-started", note: null, decidedOn: null },
    log: [{ ts: nowIso, text: `Case opened by ${author}.`, source: "human", author }],
    closedAt: null,
    needsManualReview: null,
    synthetic: false,
  };
}

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

/** The English qualification, where one is on file. */
export function englishTestOf(record: StudentCase): LanguageTestResult | null {
  return record.profile.languageTests.find((test) => test.language === "english") ?? null;
}

/** The German qualification, where one is on file. */
export function germanTestOf(record: StudentCase): LanguageTestResult | null {
  return record.profile.languageTests.find((test) => test.language === "german") ?? null;
}
