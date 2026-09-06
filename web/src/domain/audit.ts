import "server-only";

import { supabaseAdmin, supabaseConfigured } from "@/lib/supabase";
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
 *
 * Two modes, chosen once per call by `supabaseConfigured()`, same as
 * `data/users.ts`: with a database connected, every function below reads and
 * writes `supabase/migrations/0001_schema.sql`'s `audit_log` table, an
 * append-only table by design; without one, it reads and writes the in-memory
 * array a few lines down, which does not survive a restart. `resetAudit` and
 * `auditSize` stay in-memory only: they are test seams the application itself
 * never calls, and every test that uses them runs with no database configured.
 */

export type AuditAction =
  | "read"
  | "create"
  | "update"
  | "delete"
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

type AuditRow = {
  id: number;
  ts: string;
  actor_id: string;
  actor_name: string;
  actor_role: string;
  action: string;
  subject_type: string;
  subject_id: string;
  field: string | null;
  before_value: string | null;
  after_value: string | null;
  note: string | null;
};

function fromRow(row: AuditRow): AuditEntry {
  return {
    id: String(row.id),
    ts: row.ts,
    actorId: row.actor_id,
    actorName: row.actor_name,
    actorRole: row.actor_role as AuditEntry["actorRole"],
    action: row.action as AuditAction,
    subjectType: row.subject_type as AuditEntry["subjectType"],
    subjectId: row.subject_id,
    field: row.field ?? undefined,
    before: row.before_value ?? undefined,
    after: row.after_value ?? undefined,
    note: row.note ?? undefined,
  };
}

let entries: AuditEntry[] = [];
let counter = 0;

export async function record(entry: Omit<AuditEntry, "id" | "ts">): Promise<AuditEntry> {
  if (supabaseConfigured()) {
    const { data, error } = await supabaseAdmin()!
      .from("audit_log")
      .insert({
        actor_id: entry.actorId,
        actor_name: entry.actorName,
        actor_role: entry.actorRole,
        action: entry.action,
        subject_type: entry.subjectType,
        subject_id: entry.subjectId,
        field: entry.field ?? null,
        before_value: entry.before ?? null,
        after_value: entry.after ?? null,
        note: entry.note ?? null,
      })
      .select()
      .single<AuditRow>();
    if (error) throw error;
    return fromRow(data);
  }

  const stored: AuditEntry = {
    ...entry,
    id: `audit-${++counter}`,
    ts: new Date().toISOString(),
  };
  entries = [...entries, stored];
  return stored;
}

export async function auditFor(subjectId: string): Promise<AuditEntry[]> {
  if (supabaseConfigured()) {
    const { data, error } = await supabaseAdmin()!
      .from("audit_log")
      .select("*")
      .eq("subject_id", subjectId)
      .order("ts", { ascending: false })
      .returns<AuditRow[]>();
    if (error) throw error;
    return (data ?? []).map(fromRow);
  }

  return entries.filter((entry) => entry.subjectId === subjectId).reverse();
}

export async function recentAudit(limit = 50): Promise<AuditEntry[]> {
  if (supabaseConfigured()) {
    const { data, error } = await supabaseAdmin()!
      .from("audit_log")
      .select("*")
      .order("ts", { ascending: false })
      .limit(limit)
      .returns<AuditRow[]>();
    if (error) throw error;
    return (data ?? []).map(fromRow);
  }

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
