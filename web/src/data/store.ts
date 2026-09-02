import "server-only";

import type { LogEntry, StudentCase } from "@/domain/case";
import { visibleCases, type Actor } from "@/domain/rbac";
import { record as recordAudit } from "@/domain/audit";
import { withdraw, type ConsentRecord } from "@/domain/consent";
import {
  planNotifications,
  resolveStale,
  type Notification,
} from "@/domain/notifications";
import { byPriority, detectAll } from "@/domain/events";
import { syntheticCases } from "./synthetic-cases";
import { syntheticConsents } from "./synthetic-consents";

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

function all(): StudentCase[] {
  return storeMode() === "synthetic" ? records : [];
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
export async function syncNotifications(): Promise<{
  queued: number;
  resolved: number;
  open: number;
}> {
  const events = detectAll(all()).sort(byPriority);
  const planned = planNotifications(events, notifications);
  const previouslyOpen = notifications.filter((item) => !item.resolvedAt).length;

  notifications = resolveStale([...notifications, ...planned], events);
  const openNow = notifications.filter((item) => !item.resolvedAt).length;

  return {
    queued: planned.length,
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
