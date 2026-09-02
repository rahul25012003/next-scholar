/**
 * Ten narrow agents, each with a declared boundary. The boundary is not advice
 * given to a model in a prompt. `writes` is the complete set of fields the
 * kernel will accept from an agent, and anything else it returns is dropped and
 * logged as a violation, so an agent cannot quietly grow into a job it was not
 * given.
 */

export type AgentId =
  | "case-summary"
  | "document-intelligence"
  | "application-completeness"
  | "deadline-monitor"
  | "university-matching"
  | "counselor-copilot"
  | "student-guidance"
  | "communication-summary"
  | "sop-coach"
  | "escalation";

/** Field paths on the case record. Nothing outside this list is writable. */
export type WritableField =
  | "summary"
  | "suggestedAction"
  | "extraction.staging"
  | "checklist"
  | "notification.queue"
  | "shortlist.proposal"
  | "draft.text"
  | "answer.text"
  | "communication.summary"
  | "coaching.questions"
  | "escalation.queue";

export type AgentDefinition = {
  id: AgentId;
  name: string;
  purpose: string;
  inputs: string[];
  output: string;
  writes: WritableField[];
  /** True where a human must approve before the output has any effect. */
  requiresHumanReview: boolean;
  humanReview: string;
  onFailure: string;
  prohibitions: string[];
  usesModel: boolean;
};

/**
 * Global prohibitions. These apply to every agent without exception and are
 * checked by the kernel on every output, not just documented here.
 */
export const GLOBAL_PROHIBITIONS = [
  "Fabricating a university requirement that no human has verified",
  "Inventing a statistic or an outcome number",
  "Creating or altering a document of any kind",
  "Guaranteeing or implying an admission or visa probability",
  "Taking a high impact action alone: submitting an application, marking a document verified, contacting a student, closing a case",
  "Fabricating or inferring a financial or source of funds figure",
  "Ghostwriting a statement of purpose or anything meant to carry the student's own voice",
];

export const agents: AgentDefinition[] = [
  {
    id: "case-summary",
    name: "Case Summary",
    purpose: "Turn a case log into a short brief a counselor or manager can read in one pass.",
    inputs: ["Case record", "Log entries", "Stage and days in stage"],
    output: "Two to four sentences plus one suggested next step, both labelled as machine written.",
    writes: ["summary", "suggestedAction"],
    requiresHumanReview: false,
    humanReview: "Editable at any time by the counselor. Never shown to the student as written.",
    onFailure: "Falls back to a message pointing at the raw log. It does not guess.",
    prohibitions: ["Cannot alter stage, document status or priority"],
    usesModel: true,
  },
  {
    id: "document-intelligence",
    name: "Document Intelligence",
    purpose: "Read an uploaded document and propose structured field values with a confidence for each.",
    inputs: ["An uploaded document"],
    output: "Proposed values in a staging area, marked pending verification.",
    writes: ["extraction.staging"],
    requiresHumanReview: true,
    humanReview: "Mandatory. No extracted value becomes authoritative until a named person confirms it.",
    onFailure: "Marks the document for manual entry. The file is still stored.",
    prohibitions: [
      "Cannot mark a document verified",
      "Cannot alter the stored file",
      "Cannot infer a value that is not present in the document",
    ],
    usesModel: true,
  },
  {
    id: "application-completeness",
    name: "Application Completeness",
    purpose: "Check a case against the human curated requirement list for a programme.",
    inputs: ["Case record", "Verified documents", "Requirement list"],
    output: "Checklist status and the specific missing items.",
    writes: ["checklist"],
    requiresHumanReview: true,
    humanReview: "A counselor confirms before a student is told an application is complete.",
    onFailure: "An unlisted programme returns requirements not yet verified in system. It never guesses a requirement.",
    prohibitions: [
      "Cannot invent a requirement",
      "Cannot mark an application ready to submit",
    ],
    usesModel: false,
  },
  {
    id: "deadline-monitor",
    name: "Deadline and Expiry Monitor",
    purpose: "Watch stored dates and raise alerts at fixed thresholds.",
    inputs: ["Dates recorded on the case"],
    output: "Alert events queued for notification.",
    writes: ["notification.queue"],
    requiresHumanReview: false,
    humanReview: "Not needed to raise an alert. Required for every response to one.",
    onFailure: "A missing date reports date not on file. It is never silently skipped.",
    prohibitions: [
      "Cannot change a deadline",
      "Cannot submit anything",
      "Cannot close a case",
    ],
    usesModel: false,
  },
  {
    id: "university-matching",
    name: "University Matching",
    purpose: "Propose a ranked shortlist, each entry carrying its reason and its commission status.",
    inputs: ["Student profile", "Verified university data", "Stated preferences"],
    output: "A ranked proposal with a stated reason and flagged assumptions per entry.",
    writes: ["shortlist.proposal"],
    requiresHumanReview: true,
    humanReview: "A counselor reviews the proposal before it reaches the student at the shortlist stage.",
    onFailure: "A destination without enough verified data is excluded, and the exclusion says why.",
    prohibitions: [
      "Cannot write to the Open Ledger",
      "Cannot omit a commission figure from a recommendation",
      "Cannot recommend on an unverified commission estimate without flagging it",
    ],
    usesModel: false,
  },
  {
    id: "counselor-copilot",
    name: "Counselor Copilot",
    purpose: "Draft replies, follow ups and handover notes for a counselor to edit and send.",
    inputs: ["Case history", "Communication history"],
    output: "Draft text only.",
    writes: ["draft.text"],
    requiresHumanReview: true,
    humanReview: "The counselor sends it manually. The agent has no send capability at all.",
    onFailure: "A low confidence draft carries a visible warning.",
    prohibitions: [
      "Cannot send anything",
      "Cannot promise an outcome",
    ],
    usesModel: true,
  },
  {
    id: "student-guidance",
    name: "Student Guidance",
    purpose: "Answer a student's process questions from their own case data and the published policy pages.",
    inputs: ["The signed in student's own case record", "Published policy content"],
    output: "A plain language answer that names its source.",
    writes: ["answer.text"],
    requiresHumanReview: false,
    humanReview: "Anything it does not recognise is routed to the assigned counselor.",
    onFailure: "Routes to a counselor rather than improvising.",
    prohibitions: [
      "Cannot state a visa or admission probability",
      "Cannot answer about another student",
      "Is not a general purpose chatbot and does not replace the paid consultation",
    ],
    usesModel: true,
  },
  {
    id: "communication-summary",
    name: "Communication Summary",
    purpose: "Condense an email, call or message thread into one dated history line.",
    inputs: ["Raw communication records"],
    output: "A dated summary line per interaction.",
    writes: ["communication.summary"],
    requiresHumanReview: false,
    humanReview: "Spot checked rather than reviewed per item. Always editable.",
    onFailure: "An unclear thread returns a pointer to the raw thread.",
    prohibitions: ["Cannot delete or edit the raw record"],
    usesModel: true,
  },
  {
    id: "sop-coach",
    name: "Statement of Purpose Coaching",
    purpose: "Help a student develop their own statement through structured questions.",
    inputs: ["The student's own answers", "Programme and destination context"],
    output: "Follow up questions and structural feedback. Never prose for the student to use.",
    writes: ["coaching.questions"],
    requiresHumanReview: true,
    humanReview: "The finished statement is still reviewed by a counselor before submission.",
    onFailure: "If asked to write it, it declines and returns to coaching questions.",
    prohibitions: [
      "Never drafts statement content",
      "Never writes first person prose on the student's behalf",
      "Has no write access to any official document field",
    ],
    usesModel: true,
  },
  {
    id: "escalation",
    name: "Escalation",
    purpose: "Detect SLA breaches and prolonged stagnation, and raise them to a manager.",
    inputs: ["Case timestamps", "SLA thresholds"],
    output: "An escalation event and a manager notification.",
    writes: ["escalation.queue"],
    requiresHumanReview: false,
    humanReview: "A manager decides the response. The agent never resolves anything.",
    onFailure: "An ambiguous breach escalates anyway. It errs towards visibility.",
    prohibitions: [
      "Cannot reassign a case",
      "Cannot contact the student",
      "Cannot close or resolve an escalation",
    ],
    usesModel: false,
  },
];

export const agentById = new Map(agents.map((agent) => [agent.id, agent]));
