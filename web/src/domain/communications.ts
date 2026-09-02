import type { Source } from "./case";

/**
 * Communication history, kept separately from the internal case log.
 *
 * Two audiences read this. A counselor needs the raw thread. A student needs a
 * readable history of what passed between them and us, which is not the same
 * thing as our internal notes, so each record says whether it belongs in the
 * student's view at all.
 *
 * The Communication Summary agent writes only the summary line. It cannot touch
 * the raw record, which is the whole point of keeping them as separate fields.
 */

export type Channel = "email" | "whatsapp" | "call" | "portal";

export const channelLabel: Record<Channel, string> = {
  email: "Email",
  whatsapp: "WhatsApp",
  call: "Call",
  portal: "Portal message",
};

export type CommunicationRecord = {
  id: string;
  caseId: string;
  channel: Channel;
  direction: "inbound" | "outbound";
  occurredAt: string;
  participants: string;
  /** Never edited or deleted by anything, agent or otherwise. */
  raw: string;
  summary: string | null;
  summarySource: Source | null;
  /** False for anything that is an internal exchange about the student. */
  studentVisible: boolean;
};

export function forStudent(records: CommunicationRecord[]): CommunicationRecord[] {
  return records
    .filter((record) => record.studentVisible)
    .sort((a, b) => b.occurredAt.localeCompare(a.occurredAt));
}

export function newestFirst(records: CommunicationRecord[]): CommunicationRecord[] {
  return [...records].sort((a, b) => b.occurredAt.localeCompare(a.occurredAt));
}
