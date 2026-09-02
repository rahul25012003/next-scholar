import "server-only";

import type { LogEntry, StudentCase } from "@/domain/case";
import { can, visibleCases, type Action, type Actor } from "@/domain/rbac";
import { record as recordAudit } from "@/domain/audit";
import { withdraw, type ChannelConsent, type ConsentRecord } from "@/domain/consent";
import {
  escalateOpen,
  planNotifications,
  resolveStale,
  type Notification,
} from "@/domain/notifications";
import { deriveDocStatus } from "@/domain/completeness";
import { byPriority, detectAll } from "@/domain/events";
import type { CommunicationRecord } from "@/domain/communications";
import { decideField, type Extraction } from "@/domain/extraction";
import { syntheticCases } from "./synthetic-cases";
import { syntheticConsents } from "./synthetic-consents";
import { syntheticCommunications } from "./synthetic-communications";
import { syntheticChannelConsents } from "./synthetic-channel-consents";

/**
 * The one place that knows where case records live.
 *
 * Today that is an in memory copy of the synthetic fixtures. The migration path
 * from the build spec is to replace the bodies below with Supabase queries under
 * row level security, at which point nothing above this file changes.
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
let reportSignOff: { by: string; at: string } | null = null;

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

/**
 * The case level document status is derived here rather than stored, so the
 * roll-up cannot drift from the documents it summarises.
 */
function all(): StudentCase[] {
  if (storeMode() !== "synthetic") return [];
  return records.map((record) => ({
    ...record,
    docStatus: deriveDocStatus(record),
  }));
}

/** Scoped by the permission matrix, then logged. Both, every time. */
export async function listCases(actor: Actor): Promise<StudentCase[]> {
  const scoped = visibleCases(actor, all());
  recordAudit({
    actorId: actor.id,
    actorName: actor.name,
    actorRole: actor.role,
    action: "read",
    subjectType: "case",
    subjectId: "caseload",
    note: `Listed ${scoped.length} of ${all().length} cases`,
  });
  return scoped;
}

export async function getCase(
  id: string,
  actor: Actor,
): Promise<StudentCase | null> {
  const found = visibleCases(actor, all()).find((item) => item.id === id) ?? null;
  recordAudit({
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
  records = records.map((item) => (item.id === caseId ? updated : item));

  recordAudit({
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
  records = records.map((record) =>
    record.id === caseId
      ? {
          ...record,
          needsManualReview: { at: new Date().toISOString(), note, reason },
        }
      : record,
  );

  recordAudit({
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
  records = records.map((item) => (item.id === caseId ? updated : item));

  recordAudit({
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
  const before = records.find((item) => item.id === caseId)?.summary ?? null;
  records = records.map((record) =>
    record.id === caseId
      ? {
          ...record,
          summary,
          summarySource: "ai" as const,
          suggestedAction,
          suggestedActionSource: "ai" as const,
        }
      : record,
  );

  recordAudit({
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
  records = records.map((item) => (item.id === caseId ? updated : item));

  const document = record.documents.find((item) => item.id === documentId);
  recordAudit({
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
  records = records.map((item) => (item.id === caseId ? updated : item));

  recordAudit({
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

export async function listCommunications(
  caseId: string,
  actor: Actor,
): Promise<CommunicationRecord[]> {
  const record = await getCase(caseId, actor);
  if (!record) return [];

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
  communications = communications.map((item) =>
    item.id === communicationId
      ? { ...item, summary: line, summarySource: "ai" as const }
      : item,
  );

  recordAudit({
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
  return communications.find((item) => item.id === communicationId) ?? null;
}

/**
 * Document Intelligence staging. Extractions live beside the case rather than
 * inside it, because nothing here is part of the authoritative record until a
 * person has promoted a specific field.
 */
export async function stageExtraction(extraction: Extraction): Promise<void> {
  extractions = [
    ...extractions.filter((item) => item.documentId !== extraction.documentId),
    extraction,
  ];

  recordAudit({
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
  extractions = extractions.map((item) =>
    item.documentId === documentId ? updated : item,
  );

  recordAudit({
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
  const everything = all();
  const mine = visibleCases(actor, everything).length;
  const counselors = new Set(everything.map((record) => record.counselor)).size;

  recordAudit({
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

export async function listChannelConsents(
  caseId: string,
  actor: Actor,
): Promise<ChannelConsent[]> {
  const record = await getCase(caseId, actor);
  if (!record) return [];
  return channelConsents.filter((consent) => consent.caseId === caseId);
}

export async function withdrawChannelConsent(
  consentId: string,
  actor: Actor,
): Promise<void> {
  const before = channelConsents.find((consent) => consent.id === consentId);
  channelConsents = channelConsents.map((consent) =>
    consent.id === consentId && consent.withdrawnAt === null
      ? { ...consent, withdrawnAt: new Date().toISOString() }
      : consent,
  );

  recordAudit({
    actorId: actor.id,
    actorName: actor.name,
    actorRole: actor.role,
    action: "withdraw-consent",
    subjectType: "consent",
    subjectId: consentId,
    note: before ? `Contact channel: ${before.channel}` : undefined,
  });
}

export async function listConsents(
  caseId: string,
  actor: Actor,
): Promise<ConsentRecord[]> {
  const record = await getCase(caseId, actor);
  if (!record) return [];
  return consents.filter((consent) => consent.caseId === caseId);
}

export async function withdrawConsent(
  consentId: string,
  actor: Actor,
): Promise<ConsentRecord[]> {
  const before = consents.find((consent) => consent.id === consentId);
  consents = withdraw(consents, consentId);

  recordAudit({
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

  return consents.filter((consent) => consent.caseId === before?.caseId);
}

/**
 * Runs detection across every case, queues what is new and resolves what has
 * cleared. Intended to be called by a scheduled sweep, and safe to call twice:
 * a repeat run on unchanged state produces nothing.
 */
/**
 * The founder signing off a quarterly report. A figure nobody has put their
 * name to does not publish, however finished the arithmetic looks.
 */
export async function signOffReport(actor: Actor): Promise<boolean> {
  if (!can(actor, "report.publish")) return false;

  reportSignOff = { by: actor.name, at: new Date().toISOString().slice(0, 10) };
  recordAudit({
    actorId: actor.id,
    actorName: actor.name,
    actorRole: actor.role,
    action: "update",
    subjectType: "report",
    subjectId: "quarterly",
    after: reportSignOff.at,
    note: "Quarterly report signed off for publication",
  });
  return true;
}

export function currentSignOff(): { by: string; at: string } | null {
  return reportSignOff;
}

export async function syncNotifications(): Promise<{
  queued: number;
  escalated: number;
  resolved: number;
  open: number;
}> {
  const events = detectAll(all()).sort(byPriority);
  const previouslyOpen = notifications.filter((item) => !item.resolvedAt).length;

  // An open reminder whose event has become more urgent is re-queued, so a
  // deadline sequence actually escalates instead of firing once at thirty days.
  const { next: escalatedRows, escalated } = escalateOpen(notifications, events);
  const planned = planNotifications(events, escalatedRows, channelConsents);

  notifications = resolveStale([...escalatedRows, ...planned], events);
  const openNow = notifications.filter((item) => !item.resolvedAt).length;

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
  const scopedIds = new Set(visibleCases(actor, all()).map((item) => item.id));
  return notifications
    .filter((item) => !item.resolvedAt)
    .filter((item) => scopedIds.has(item.caseId))
    .filter((item) => (caseId ? item.caseId === caseId : true));
}
