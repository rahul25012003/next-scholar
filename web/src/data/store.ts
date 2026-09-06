import "server-only";

import type {
  ApplicationRecord,
  DocumentRecord,
  FollowUpTask,
  LogEntry,
  Priority,
  Source,
  StageKey,
  StudentCase,
} from "@/domain/case";
import { can, visibleCases, type Action, type Actor } from "@/domain/rbac";
import { auditFor, record as recordAudit } from "@/domain/audit";
import {
  withdraw,
  type ChannelConsent,
  type ConsentRecord,
  type ContactChannel,
  type DocumentCategory,
} from "@/domain/consent";
import {
  escalateOpen,
  planNotifications,
  resolveStale,
  type Channel as NotificationChannel,
  type DeliveryStatus,
  type Notification,
} from "@/domain/notifications";
import { deriveDocStatus } from "@/domain/completeness";
import { retentionFor, RETENTION_YEARS, RETENTION_CAVEAT } from "@/domain/retention";
import { byPriority, detectAll, type EventType } from "@/domain/events";
import type { Channel as CommsChannel, CommunicationRecord } from "@/domain/communications";
import { decideField, type Extraction, type StagedField } from "@/domain/extraction";
import { supabaseAdmin, supabaseConfigured } from "@/lib/supabase";
import { syntheticCases } from "./synthetic-cases";
import { syntheticConsents } from "./synthetic-consents";
import { syntheticCommunications } from "./synthetic-communications";
import { syntheticChannelConsents } from "./synthetic-channel-consents";

/**
 * The one place that knows where case records live.
 *
 * Two modes, chosen once per call by `supabaseConfigured()`, same as
 * `data/users.ts`: with a database connected, every function below queries
 * `supabase/migrations/0001_schema.sql`; without one, it reads the in-memory
 * copy of the synthetic fixtures a few lines down. Nothing above this file,
 * and no caller, needs to know which mode is live.
 *
 * Two rules this file exists to enforce, whatever the storage is underneath:
 * fabricated records never load in production unless someone explicitly asks
 * for a demo, and a case cannot be read without an actor, because a read that
 * nobody is accountable for is exactly what the audit trail is meant to catch.
 */

let records: StudentCase[] = syntheticCases.map((record) => ({ ...record }));
let consents: ConsentRecord[] = syntheticConsents.map((consent) => ({ ...consent }));
let communications: CommunicationRecord[] = syntheticCommunications.map((item) => ({
  ...item,
}));
let channelConsents: ChannelConsent[] = syntheticChannelConsents.map((item) => ({
  ...item,
}));
let extractions: Extraction[] = [];
let notifications: Notification[] = [];

export type StoreMode = "synthetic" | "empty";

export function storeMode(): StoreMode {
  const demoAllowed =
    process.env.NODE_ENV !== "production" ||
    process.env.NEXT_SCHOLAR_DEMO_DATA === "true";
  return demoAllowed ? "synthetic" : "empty";
}

export function storeNotice(): string {
  return storeMode() === "synthetic"
    ? "Synthetic records. Not real applicants, not real documents, not real figures. No database is connected yet."
    : "No case records. The platform is not connected to a database, and fabricated records are not served here.";
}

type CaseRow = {
  id: string;
  name: string;
  destination: string;
  route: string | null;
  intake: string;
  counselor: string;
  budget_inr: number | null;
  profile: StudentCase["profile"];
  stage: StageKey;
  stage_updated_at: string;
  priority: Priority;
  summary: string | null;
  summary_source: Source | null;
  suggested_action: string | null;
  suggested_action_source: Source | null;
  last_student_contact_at: string;
  last_counselor_reply_at: string;
  deadlines: StudentCase["deadlines"];
  tasks: FollowUpTask[];
  documents: DocumentRecord[];
  applications: ApplicationRecord[];
  visa: StudentCase["visa"];
  log: LogEntry[];
  closed_at: string | null;
  needs_manual_review: StudentCase["needsManualReview"];
  synthetic: boolean;
};

function caseFromRow(row: CaseRow): StudentCase {
  return {
    id: row.id,
    name: row.name,
    destination: row.destination,
    route: row.route,
    intake: row.intake,
    counselor: row.counselor,
    budgetInr: row.budget_inr,
    profile: row.profile,
    stage: row.stage,
    stageUpdatedAt: row.stage_updated_at,
    // Never read off the row: recomputed by `all()` from the documents below.
    docStatus: "Not started",
    priority: row.priority,
    summary: row.summary,
    summarySource: row.summary_source,
    suggestedAction: row.suggested_action,
    suggestedActionSource: row.suggested_action_source,
    lastStudentContactAt: row.last_student_contact_at,
    lastCounselorReplyAt: row.last_counselor_reply_at,
    deadlines: row.deadlines,
    tasks: row.tasks,
    documents: row.documents,
    applications: row.applications,
    visa: row.visa,
    log: row.log,
    closedAt: row.closed_at,
    needsManualReview: row.needs_manual_review,
    synthetic: row.synthetic,
  };
}

function caseToRow(record: StudentCase): CaseRow {
  return {
    id: record.id,
    name: record.name,
    destination: record.destination,
    route: record.route,
    intake: record.intake,
    counselor: record.counselor,
    budget_inr: record.budgetInr,
    profile: record.profile,
    stage: record.stage,
    stage_updated_at: record.stageUpdatedAt,
    priority: record.priority,
    summary: record.summary,
    summary_source: record.summarySource,
    suggested_action: record.suggestedAction,
    suggested_action_source: record.suggestedActionSource,
    last_student_contact_at: record.lastStudentContactAt,
    last_counselor_reply_at: record.lastCounselorReplyAt,
    deadlines: record.deadlines,
    tasks: record.tasks,
    documents: record.documents,
    applications: record.applications,
    visa: record.visa,
    log: record.log,
    closed_at: record.closedAt,
    needs_manual_review: record.needsManualReview,
    synthetic: record.synthetic,
  };
}

/**
 * Writes one full case row. `counselor` is a display name (see
 * `supabase/migrations/0001_schema.sql`'s comment on `cases.counselor`), so
 * `counselor_id` is best-effort resolved from it by name on every save, the
 * "application's saveCase helper" that migration comment refers to. A name
 * that matches no counselor account resolves to null, same as an unresolved
 * reassignment in the schema's own edge case.
 */
async function saveCase(record: StudentCase): Promise<void> {
  if (supabaseConfigured()) {
    const client = supabaseAdmin()!;
    const { data: counselor, error: lookupError } = await client
      .from("users")
      .select("id")
      .eq("role", "counselor")
      .eq("name", record.counselor)
      .maybeSingle<{ id: string }>();
    if (lookupError) throw lookupError;

    const { error } = await client
      .from("cases")
      .update({ ...caseToRow(record), counselor_id: counselor?.id ?? null })
      .eq("id", record.id);
    if (error) throw error;
    return;
  }

  records = records.map((item) => (item.id === record.id ? record : item));
}

/**
 * The case level document status is derived here rather than stored, so the
 * roll-up cannot drift from the documents it summarises.
 */
async function all(): Promise<StudentCase[]> {
  if (supabaseConfigured()) {
    let query = supabaseAdmin()!.from("cases").select("*");
    if (storeMode() !== "synthetic") query = query.eq("synthetic", false);
    const { data, error } = await query.returns<CaseRow[]>();
    if (error) throw error;
    return (data ?? []).map((row) => {
      const record = caseFromRow(row);
      return { ...record, docStatus: deriveDocStatus(record) };
    });
  }

  if (storeMode() !== "synthetic") return [];
  return records.map((record) => ({
    ...record,
    docStatus: deriveDocStatus(record),
  }));
}

/** Scoped by the permission matrix, then logged. Both, every time. */
export async function listCases(actor: Actor): Promise<StudentCase[]> {
  const everything = await all();
  const scoped = visibleCases(actor, everything);
  await recordAudit({
    actorId: actor.id,
    actorName: actor.name,
    actorRole: actor.role,
    action: "read",
    subjectType: "case",
    subjectId: "caseload",
    note: `Listed ${scoped.length} of ${everything.length} cases`,
  });
  return scoped;
}

export async function getCase(
  id: string,
  actor: Actor,
): Promise<StudentCase | null> {
  const found = visibleCases(actor, await all()).find((item) => item.id === id) ?? null;
  await recordAudit({
    actorId: actor.id,
    actorName: actor.name,
    actorRole: actor.role,
    action: "read",
    subjectType: "case",
    subjectId: id,
    note: found ? "Opened the case record" : "Read refused by the permission matrix",
  });
  return found;
}

/**
 * Layer 4 of the build spec, and the rule the rest of the platform depends on:
 * a person's note is written before any agent runs on it. If the agent call
 * fails, the note is still there. Only the machine written enrichment is lost.
 */
export async function appendNote(
  caseId: string,
  entry: Omit<LogEntry, "ts"> & { ts?: string },
  actor: Actor,
): Promise<StudentCase | null> {
  const record = await getCase(caseId, actor);
  if (!record) return null;

  const logEntry: LogEntry = { ts: entry.ts ?? new Date().toISOString(), ...entry };
  const updated: StudentCase = { ...record, log: [...record.log, logEntry] };
  await saveCase(updated);

  await recordAudit({
    actorId: actor.id,
    actorName: actor.name,
    actorRole: actor.role,
    action: "create",
    subjectType: "case",
    subjectId: caseId,
    field: "log",
    after: logEntry.text,
  });

  return updated;
}

/**
 * Raises or clears the manual review flag. Raised by a failed agent run, and
 * cleared only by a person saying they have looked, so a failure cannot be
 * quietly buried by the next successful run.
 */
export async function flagForManualReview(
  caseId: string,
  note: string,
  reason: string,
): Promise<void> {
  const record = (await all()).find((item) => item.id === caseId);
  if (record) {
    await saveCase({
      ...record,
      needsManualReview: { at: new Date().toISOString(), note, reason },
    });
  }

  await recordAudit({
    actorId: "system",
    actorName: "System",
    actorRole: "system",
    action: "update",
    subjectType: "case",
    subjectId: caseId,
    field: "needsManualReview",
    after: reason,
    note: "Automatic classification failed. Flagged for a person.",
  });
}

export async function clearManualReview(
  caseId: string,
  actor: Actor,
): Promise<StudentCase | null> {
  const record = await getCase(caseId, actor);
  if (!record) return null;
  if (!can(actor, "case.note.write", record)) return null;

  const updated = { ...record, needsManualReview: null };
  await saveCase(updated);

  await recordAudit({
    actorId: actor.id,
    actorName: actor.name,
    actorRole: actor.role,
    action: "update",
    subjectType: "case",
    subjectId: caseId,
    field: "needsManualReview",
    before: record.needsManualReview?.reason,
    after: "cleared",
    note: "A person reviewed the note the agent could not classify",
  });

  return updated;
}

export async function attachSummary(
  caseId: string,
  summary: string,
  suggestedAction: string,
  agentName: string,
): Promise<void> {
  const record = (await all()).find((item) => item.id === caseId);
  const before = record?.summary ?? null;

  if (record) {
    await saveCase({
      ...record,
      summary,
      summarySource: "ai" as const,
      suggestedAction,
      suggestedActionSource: "ai" as const,
    });
  }

  await recordAudit({
    actorId: agentName,
    actorName: agentName,
    actorRole: "agent",
    action: "agent-run",
    subjectType: "case",
    subjectId: caseId,
    field: "summary",
    before: before ?? undefined,
    after: summary,
  });
}

/** Only a person reaches this. No agent capability maps to a document status. */
export async function markDocumentVerified(
  caseId: string,
  documentId: string,
  actor: Actor,
): Promise<StudentCase | null> {
  const record = await getCase(caseId, actor);
  if (!record) return null;

  const now = new Date().toISOString();
  const updated: StudentCase = {
    ...record,
    documents: record.documents.map((document) =>
      document.id === documentId
        ? {
            ...document,
            status: "Verified" as const,
            verifiedBy: actor.name,
            verifiedAt: now,
            issue: null,
          }
        : document,
    ),
  };
  await saveCase(updated);

  const document = record.documents.find((item) => item.id === documentId);
  await recordAudit({
    actorId: actor.id,
    actorName: actor.name,
    actorRole: actor.role,
    action: "verify",
    subjectType: "document",
    subjectId: documentId,
    field: "status",
    before: document?.status,
    after: "Verified",
    note: `On case ${caseId}, checked against the original`,
  });

  return updated;
}

/**
 * Applies one of the case operations from `domain/case-operations`, checks the
 * permission first and records the result. Every workflow in section 8.10 goes
 * through this single door, so none of them can skip the audit trail.
 */
export async function mutateCase(
  caseId: string,
  actor: Actor,
  action: Action,
  transform: (record: StudentCase) => StudentCase,
  auditNote: string,
): Promise<StudentCase | null> {
  const record = await getCase(caseId, actor);
  if (!record) return null;
  if (!can(actor, action, record)) return null;

  const updated = transform(record);
  await saveCase(updated);

  await recordAudit({
    actorId: actor.id,
    actorName: actor.name,
    actorRole: actor.role,
    action: "update",
    subjectType: "case",
    subjectId: caseId,
    note: auditNote,
  });

  return updated;
}

type CommunicationRow = {
  id: string;
  case_id: string;
  channel: CommsChannel;
  direction: "inbound" | "outbound";
  occurred_at: string;
  participants: string;
  raw: string;
  summary: string | null;
  summary_source: Source | null;
  student_visible: boolean;
};

function communicationFromRow(row: CommunicationRow): CommunicationRecord {
  return {
    id: row.id,
    caseId: row.case_id,
    channel: row.channel,
    direction: row.direction,
    occurredAt: row.occurred_at,
    participants: row.participants,
    raw: row.raw,
    summary: row.summary,
    summarySource: row.summary_source,
    studentVisible: row.student_visible,
  };
}

export async function listCommunications(
  caseId: string,
  actor: Actor,
): Promise<CommunicationRecord[]> {
  const record = await getCase(caseId, actor);
  if (!record) return [];

  if (supabaseConfigured()) {
    let query = supabaseAdmin()!.from("communications").select("*").eq("case_id", caseId);
    if (actor.role === "student") query = query.eq("student_visible", true);
    const { data, error } = await query.returns<CommunicationRow[]>();
    if (error) throw error;
    return (data ?? []).map(communicationFromRow);
  }

  const scoped = communications.filter((item) => item.caseId === caseId);
  return actor.role === "student"
    ? scoped.filter((item) => item.studentVisible)
    : scoped;
}

/** The Communication Summary agent writes this field and nothing else. */
export async function attachThreadSummary(
  communicationId: string,
  line: string,
): Promise<void> {
  if (supabaseConfigured()) {
    const { error } = await supabaseAdmin()!
      .from("communications")
      .update({ summary: line, summary_source: "ai" })
      .eq("id", communicationId);
    if (error) throw error;
  } else {
    communications = communications.map((item) =>
      item.id === communicationId
        ? { ...item, summary: line, summarySource: "ai" as const }
        : item,
    );
  }

  await recordAudit({
    actorId: "communication-summary",
    actorName: "Communication Summary agent",
    actorRole: "agent",
    action: "agent-run",
    subjectType: "case",
    subjectId: communicationId,
    field: "communication.summary",
    after: line,
    note: "The raw record was not touched",
  });
}

export async function getCommunication(
  communicationId: string,
): Promise<CommunicationRecord | null> {
  if (supabaseConfigured()) {
    const { data, error } = await supabaseAdmin()!
      .from("communications")
      .select("*")
      .eq("id", communicationId)
      .maybeSingle<CommunicationRow>();
    if (error) throw error;
    return data ? communicationFromRow(data) : null;
  }

  return communications.find((item) => item.id === communicationId) ?? null;
}

type ExtractionRow = {
  document_id: string;
  case_id: string;
  extracted_at: string;
  fields: StagedField[];
  note: string;
  unreadable: boolean;
};

function extractionFromRow(row: ExtractionRow): Extraction {
  return {
    documentId: row.document_id,
    caseId: row.case_id,
    extractedAt: row.extracted_at,
    fields: row.fields,
    note: row.note,
    unreadable: row.unreadable,
  };
}

/**
 * Document Intelligence staging. Extractions live beside the case rather than
 * inside it, because nothing here is part of the authoritative record until a
 * person has promoted a specific field.
 */
export async function stageExtraction(extraction: Extraction): Promise<void> {
  if (supabaseConfigured()) {
    const { error } = await supabaseAdmin()!.from("extractions").upsert({
      document_id: extraction.documentId,
      case_id: extraction.caseId,
      extracted_at: extraction.extractedAt,
      fields: extraction.fields,
      note: extraction.note,
      unreadable: extraction.unreadable,
    });
    if (error) throw error;
  } else {
    extractions = [
      ...extractions.filter((item) => item.documentId !== extraction.documentId),
      extraction,
    ];
  }

  await recordAudit({
    actorId: "document-intelligence",
    actorName: "Document Intelligence agent",
    actorRole: "agent",
    action: "agent-run",
    subjectType: "document",
    subjectId: extraction.documentId,
    field: "extraction.staging",
    note: `${extraction.fields.length} field${extraction.fields.length === 1 ? "" : "s"} proposed, all pending verification`,
  });
}

export async function getExtraction(
  documentId: string,
): Promise<Extraction | null> {
  if (supabaseConfigured()) {
    const { data, error } = await supabaseAdmin()!
      .from("extractions")
      .select("*")
      .eq("document_id", documentId)
      .maybeSingle<ExtractionRow>();
    if (error) throw error;
    return data ? extractionFromRow(data) : null;
  }

  return extractions.find((item) => item.documentId === documentId) ?? null;
}

/**
 * Promoting or rejecting one proposed value. This is the human review the
 * agent's registry entry marks mandatory, and it is the only path by which an
 * extracted value stops being a proposal.
 */
export async function decideExtractedField(
  documentId: string,
  fieldName: string,
  decision: "confirmed" | "rejected",
  actor: Actor,
): Promise<Extraction | null> {
  const extraction = await getExtraction(documentId);
  if (!extraction) return null;
  if (!can(actor, "document.verify")) return null;

  const before = extraction.fields.find((field) => field.name === fieldName);
  const updated = decideField(extraction, fieldName, decision, actor.name);

  if (supabaseConfigured()) {
    const { error } = await supabaseAdmin()!
      .from("extractions")
      .update({ fields: updated.fields })
      .eq("document_id", documentId);
    if (error) throw error;
  } else {
    extractions = extractions.map((item) =>
      item.documentId === documentId ? updated : item,
    );
  }

  await recordAudit({
    actorId: actor.id,
    actorName: actor.name,
    actorRole: actor.role,
    action: decision === "confirmed" ? "verify" : "update",
    subjectType: "document",
    subjectId: documentId,
    field: `extraction.${fieldName}`,
    before: before?.state,
    after: decision,
    note: `Proposed value "${before?.value ?? ""}" ${decision} by a person`,
  });

  return updated;
}

/**
 * An aggregate a counselor may legitimately know without reading anyone else's
 * caseload: how their own load compares to the team's. Counts only, no records.
 */
export async function caseloadStats(
  actor: Actor,
): Promise<{ mine: number; teamAverage: number; counselors: number }> {
  const everything = await all();
  const mine = visibleCases(actor, everything).length;
  const counselors = new Set(everything.map((record) => record.counselor)).size;

  await recordAudit({
    actorId: actor.id,
    actorName: actor.name,
    actorRole: actor.role,
    action: "read",
    subjectType: "case",
    subjectId: "caseload-aggregate",
    note: "Counts only, no case records returned",
  });

  return {
    mine,
    teamAverage: counselors === 0 ? 0 : Math.round((everything.length / counselors) * 10) / 10,
    counselors,
  };
}

type ChannelConsentRow = {
  id: string;
  case_id: string;
  channel: ContactChannel;
  granted_at: string;
  granted_by: string;
  withdrawn_at: string | null;
};

function channelConsentFromRow(row: ChannelConsentRow): ChannelConsent {
  return {
    id: row.id,
    caseId: row.case_id,
    channel: row.channel,
    grantedAt: row.granted_at,
    grantedBy: row.granted_by,
    withdrawnAt: row.withdrawn_at,
  };
}

async function allChannelConsents(): Promise<ChannelConsent[]> {
  if (supabaseConfigured()) {
    const { data, error } = await supabaseAdmin()!
      .from("channel_consents")
      .select("*")
      .returns<ChannelConsentRow[]>();
    if (error) throw error;
    return (data ?? []).map(channelConsentFromRow);
  }
  return channelConsents;
}

export async function listChannelConsents(
  caseId: string,
  actor: Actor,
): Promise<ChannelConsent[]> {
  const record = await getCase(caseId, actor);
  if (!record) return [];
  return (await allChannelConsents()).filter((consent) => consent.caseId === caseId);
}

/**
 * Opting a channel back on.
 *
 * Only the student whose case it is may do this. A counsellor cannot grant
 * consent to message someone on the student's behalf, which is the whole point
 * of recording it: the notification planner fails closed on a missing opt in,
 * and a staff member who could add one could route around that.
 *
 * A previous withdrawal is left in place rather than edited, and a new record
 * is written, because the fact that consent was once withdrawn is part of the
 * audit answer.
 */
export async function grantChannelConsent(
  caseId: string,
  channel: ContactChannel,
  actor: Actor,
): Promise<ChannelConsent | null> {
  const record = await getCase(caseId, actor);
  if (!record) return null;
  if (actor.role !== "student" || actor.caseId !== caseId) return null;

  const live = (await allChannelConsents()).find(
    (consent) =>
      consent.caseId === caseId &&
      consent.channel === channel &&
      consent.withdrawnAt === null,
  );
  if (live) return live;

  const granted: ChannelConsent = {
    id: `chan-${channel}-${Date.now()}`,
    caseId,
    channel,
    grantedAt: new Date().toISOString(),
    grantedBy: actor.name,
    withdrawnAt: null,
  };

  if (supabaseConfigured()) {
    const { error } = await supabaseAdmin()!.from("channel_consents").insert({
      id: granted.id,
      case_id: granted.caseId,
      channel: granted.channel,
      granted_at: granted.grantedAt,
      granted_by: granted.grantedBy,
      withdrawn_at: granted.withdrawnAt,
    });
    if (error) throw error;
  } else {
    channelConsents = [...channelConsents, granted];
  }

  await recordAudit({
    actorId: actor.id,
    actorName: actor.name,
    actorRole: actor.role,
    action: "grant-consent",
    subjectType: "consent",
    subjectId: granted.id,
    note: `Contact channel opted in: ${channel}`,
  });

  return granted;
}

export async function withdrawChannelConsent(
  consentId: string,
  actor: Actor,
): Promise<void> {
  const before = (await allChannelConsents()).find((consent) => consent.id === consentId);

  if (before && before.withdrawnAt === null) {
    const withdrawnAt = new Date().toISOString();
    if (supabaseConfigured()) {
      const { error } = await supabaseAdmin()!
        .from("channel_consents")
        .update({ withdrawn_at: withdrawnAt })
        .eq("id", consentId);
      if (error) throw error;
    } else {
      channelConsents = channelConsents.map((consent) =>
        consent.id === consentId ? { ...consent, withdrawnAt } : consent,
      );
    }
  }

  await recordAudit({
    actorId: actor.id,
    actorName: actor.name,
    actorRole: actor.role,
    action: "withdraw-consent",
    subjectType: "consent",
    subjectId: consentId,
    note: before ? `Contact channel: ${before.channel}` : undefined,
  });
}

type ConsentRow = {
  id: string;
  case_id: string;
  category: DocumentCategory;
  purpose: string;
  shared_with: string[];
  granted_at: string;
  granted_by: string;
  withdrawn_at: string | null;
};

function consentFromRow(row: ConsentRow): ConsentRecord {
  return {
    id: row.id,
    caseId: row.case_id,
    category: row.category,
    purpose: row.purpose,
    sharedWith: row.shared_with,
    grantedAt: row.granted_at,
    grantedBy: row.granted_by,
    withdrawnAt: row.withdrawn_at,
  };
}

async function allConsents(): Promise<ConsentRecord[]> {
  if (supabaseConfigured()) {
    const { data, error } = await supabaseAdmin()!
      .from("consents")
      .select("*")
      .returns<ConsentRow[]>();
    if (error) throw error;
    return (data ?? []).map(consentFromRow);
  }
  return consents;
}

export async function listConsents(
  caseId: string,
  actor: Actor,
): Promise<ConsentRecord[]> {
  const record = await getCase(caseId, actor);
  if (!record) return [];
  return (await allConsents()).filter((consent) => consent.caseId === caseId);
}

export async function withdrawConsent(
  consentId: string,
  actor: Actor,
): Promise<ConsentRecord[]> {
  const before = (await allConsents()).find((consent) => consent.id === consentId);

  if (before && before.withdrawnAt === null) {
    if (supabaseConfigured()) {
      const { error } = await supabaseAdmin()!
        .from("consents")
        .update({ withdrawn_at: new Date().toISOString() })
        .eq("id", consentId);
      if (error) throw error;
    } else {
      consents = withdraw(consents, consentId);
    }
  }

  await recordAudit({
    actorId: actor.id,
    actorName: actor.name,
    actorRole: actor.role,
    action: "withdraw-consent",
    subjectType: "consent",
    subjectId: consentId,
    field: "withdrawnAt",
    before: "null",
    after: new Date().toISOString(),
    note: before ? `Category: ${before.category}` : undefined,
  });

  return (await allConsents()).filter((consent) => consent.caseId === before?.caseId);
}

/**
 * The founder signing off a quarterly report. A figure nobody has put their
 * name to does not publish, however finished the arithmetic looks.
 *
 * There is no dedicated table for this: the sign-off is exactly the audit
 * entry this writes, so reading the most recent one back (`auditFor` is
 * already newest first) is the sign-off, in either storage mode.
 */
export async function signOffReport(actor: Actor): Promise<boolean> {
  if (!can(actor, "report.publish")) return false;

  const at = new Date().toISOString().slice(0, 10);
  await recordAudit({
    actorId: actor.id,
    actorName: actor.name,
    actorRole: actor.role,
    action: "update",
    subjectType: "report",
    subjectId: "quarterly",
    after: at,
    note: "Quarterly report signed off for publication",
  });
  return true;
}

export async function currentSignOff(): Promise<{ by: string; at: string } | null> {
  const [latest] = await auditFor("quarterly");
  return latest ? { by: latest.actorName, at: latest.after ?? "" } : null;
}

type NotificationRow = {
  id: string;
  event_key: string;
  case_id: string;
  type: EventType;
  priority: Priority;
  channel: NotificationChannel;
  delivery_status: DeliveryStatus;
  body: string;
  created_at: string;
  resolved_at: string | null;
};

function notificationFromRow(row: NotificationRow): Notification {
  return {
    id: row.id,
    eventKey: row.event_key,
    caseId: row.case_id,
    type: row.type,
    priority: row.priority,
    channel: row.channel,
    deliveryStatus: row.delivery_status,
    body: row.body,
    createdAt: row.created_at,
    resolvedAt: row.resolved_at,
    source: "system",
  };
}

function notificationToRow(item: Notification): NotificationRow {
  return {
    id: item.id,
    event_key: item.eventKey,
    case_id: item.caseId,
    type: item.type,
    priority: item.priority,
    channel: item.channel,
    delivery_status: item.deliveryStatus,
    body: item.body,
    created_at: item.createdAt,
    resolved_at: item.resolvedAt,
  };
}

async function allNotifications(): Promise<Notification[]> {
  if (supabaseConfigured()) {
    const { data, error } = await supabaseAdmin()!
      .from("notifications")
      .select("*")
      .returns<NotificationRow[]>();
    if (error) throw error;
    return (data ?? []).map(notificationFromRow);
  }
  return notifications;
}

/**
 * Runs detection across every case, queues what is new and resolves what has
 * cleared. Intended to be called by a scheduled sweep, and safe to call twice:
 * a repeat run on unchanged state produces nothing.
 */
export async function syncNotifications(): Promise<{
  queued: number;
  escalated: number;
  resolved: number;
  open: number;
}> {
  const events = detectAll(await all()).sort(byPriority);
  const existing = await allNotifications();
  const previouslyOpen = existing.filter((item) => !item.resolvedAt).length;

  // An open reminder whose event has become more urgent is re-queued, so a
  // deadline sequence actually escalates instead of firing once at thirty days.
  const { next: escalatedRows, escalated } = escalateOpen(existing, events);
  const planned = planNotifications(events, escalatedRows, await allChannelConsents());
  const resolved = resolveStale([...escalatedRows, ...planned], events);

  if (supabaseConfigured()) {
    if (resolved.length > 0) {
      const { error } = await supabaseAdmin()!
        .from("notifications")
        .upsert(resolved.map(notificationToRow));
      if (error) throw error;
    }
  } else {
    notifications = resolved;
  }

  const openNow = resolved.filter((item) => !item.resolvedAt).length;

  return {
    queued: planned.length,
    escalated,
    resolved: Math.max(previouslyOpen + planned.length - openNow, 0),
    open: openNow,
  };
}

export async function listNotifications(
  caseId: string | null,
  actor: Actor,
): Promise<Notification[]> {
  await syncNotifications();
  const scopedIds = new Set(visibleCases(actor, await all()).map((item) => item.id));
  return (await allNotifications())
    .filter((item) => !item.resolvedAt)
    .filter((item) => scopedIds.has(item.caseId))
    .filter((item) => (caseId ? item.caseId === caseId : true));
}

/**
 * 2.10: the clock `domain/retention.ts` computes now has an enforcement path.
 * Intended to be called by the scheduled sweep, alongside `syncNotifications`,
 * and safe to call twice: a case already deleted is not found on the next run.
 *
 * A student account can hold `case_id` pointing at the row being deleted
 * (`users_case_id_fkey` in `supabase/migrations/0001_schema.sql`), so that
 * link is cleared first rather than left to fail the delete. The other child
 * tables (`consents`, `channel_consents`, `communications`, `extractions`,
 * `notifications`) are declared `on delete cascade`, so Supabase mode drops
 * them for free; in-memory mode does the same cleanup by hand, so a demo run
 * cannot leave a row pointing at a case that no longer exists.
 *
 * What this does not yet do: prune the audit trail for the same case, which
 * the retention policy also promises after five years. `audit_log` addresses
 * its rows by subject, not by case, across document, consent, commission and
 * report entries as well as case ones, and reconstructing which of those
 * belong to one case reliably is a separate, harder problem than deleting the
 * case file itself. `content/legal.ts` states that gap rather than implying
 * it is closed.
 */
export async function enforceRetention(now = new Date()): Promise<{ deleted: string[] }> {
  const deletable = (await all()).filter(
    (record) => retentionFor(record.closedAt, now).state === "deletable",
  );

  for (const record of deletable) {
    if (supabaseConfigured()) {
      const client = supabaseAdmin()!;
      const { error: unlinkError } = await client
        .from("users")
        .update({ case_id: null })
        .eq("case_id", record.id);
      if (unlinkError) throw unlinkError;

      const { error } = await client.from("cases").delete().eq("id", record.id);
      if (error) throw error;
    } else {
      records = records.filter((item) => item.id !== record.id);
      consents = consents.filter((item) => item.caseId !== record.id);
      channelConsents = channelConsents.filter((item) => item.caseId !== record.id);
      communications = communications.filter((item) => item.caseId !== record.id);
      extractions = extractions.filter((item) => item.caseId !== record.id);
      notifications = notifications.filter((item) => item.caseId !== record.id);
    }

    await recordAudit({
      actorId: "system",
      actorName: "System",
      actorRole: "system",
      action: "delete",
      subjectType: "case",
      subjectId: record.id,
      note: `Deleted by the scheduled retention sweep. Closed ${record.closedAt}, past the ${RETENTION_YEARS} year retention period. ${RETENTION_CAVEAT}`,
    });
  }

  return { deleted: deletable.map((record) => record.id) };
}
