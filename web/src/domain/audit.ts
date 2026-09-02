import type { Role } from "./rbac";

/**
 * The audit trail. Every read and every write of a sensitive field is recorded
 * with who did it, when, and what changed.
 *
 * This is the answer to the only question that matters when a status or a
 * figure is disputed later: who set this, and on what date. Section 8.9 of the
 * build spec extends the human/ai tag to every record type, and the one real
 * risk it names is applying the discipline to some features and not others, so
 * the store cannot be read without passing an actor through this module.
 */

export type AuditAction =
  | "read"
  | "create"
  | "update"
  | "verify"
  | "withdraw-consent"
  | "grant-consent"
  | "reject-upload"
  | "agent-run"
  | "agent-blocked";

export type AuditEntry = {
  id: string;
  ts: string;
  actorId: string;
  actorName: string;
  actorRole: Role | "system" | "agent";
  action: AuditAction;
  subjectType: "case" | "document" | "consent" | "commission" | "report";
  subjectId: string;
  /** The specific field touched, where the action was narrower than the record. */
  field?: string;
  before?: string;
  after?: string;
  note?: string;
};

let entries: AuditEntry[] = [];
let counter = 0;

export function record(entry: Omit<AuditEntry, "id" | "ts">): AuditEntry {
  const stored: AuditEntry = {
    ...entry,
    id: `audit-${++counter}`,
    ts: new Date().toISOString(),
  };
  entries = [...entries, stored];
  return stored;
}

export function auditFor(subjectId: string): AuditEntry[] {
  return entries.filter((entry) => entry.subjectId === subjectId).reverse();
}

export function recentAudit(limit = 50): AuditEntry[] {
  return entries.slice(-limit).reverse();
}

export function auditSize(): number {
  return entries.length;
}

/** Test seam. Nothing in the application calls this. */
export function resetAudit(): void {
  entries = [];
  counter = 0;
}
