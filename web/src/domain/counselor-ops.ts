import { daysSince, daysUntil, type StudentCase } from "./case";
import { byPriority, detectEvents } from "./events";
import { checkCompleteness } from "./completeness";

/**
 * Counselor operations: the handover packet and the assignment suggestion.
 *
 * Both are deterministic. A handover is where cases get dropped, so the packet
 * is generated from stored state rather than from whoever is leaving
 * remembering to write it all down.
 */

export type HandoverPacket = {
  caseId: string;
  student: string;
  route: string;
  stage: string;
  daysAtStage: number;
  from: string;
  summary: string;
  summaryIsMachineWritten: boolean;
  openTasks: string[];
  pendingDocuments: string[];
  deadlines: { label: string; date: string; days: number }[];
  lastFive: { ts: string; text: string; author: string; source: string }[];
  /** Receipt is confirmed by the incoming counselor, not assumed. */
  acknowledgement: string;
};

export function buildHandoverPacket(record: StudentCase): HandoverPacket {
  const events = detectEvents(record).sort(byPriority);
  const completeness = checkCompleteness(record);

  return {
    caseId: record.id,
    student: record.name,
    route: `${record.destination}, ${record.intake}`,
    stage: record.stage,
    daysAtStage: daysSince(record.stageUpdatedAt),
    from: record.counselor,
    summary:
      record.summary ??
      "No machine summary on file. The log below is the whole of what is known.",
    summaryIsMachineWritten: record.summarySource === "ai",
    openTasks: events.map((event) => `${event.title}. ${event.detail}`),
    pendingDocuments:
      completeness.state === "checked"
        ? completeness.missing
        : [completeness.reason],
    deadlines: record.deadlines.map((deadline) => ({
      ...deadline,
      days: daysUntil(deadline.date),
    })),
    lastFive: record.log.slice(-5).reverse().map((entry) => ({
      ts: entry.ts.slice(0, 10),
      text: entry.text,
      author: entry.author,
      source: entry.source,
    })),
    acknowledgement:
      "The incoming counselor confirms receipt, and the student is told who now holds their case. Neither step happens automatically.",
  };
}

export type AssignmentSuggestion = {
  suggested: string | null;
  loads: { counselor: string; cases: number }[];
  note: string;
};

/**
 * Suggests the counselor with the lightest caseload. A suggestion is all it is:
 * a manager makes the assignment, and the override is logged like any other
 * write.
 */
export function suggestAssignment(cases: StudentCase[]): AssignmentSuggestion {
  const loads = Object.entries(
    cases.reduce<Record<string, number>>((totals, record) => {
      totals[record.counselor] = (totals[record.counselor] ?? 0) + 1;
      return totals;
    }, {}),
  )
    .map(([counselor, count]) => ({ counselor, cases: count }))
    .sort((a, b) => a.cases - b.cases);

  return {
    suggested: loads[0]?.counselor ?? null,
    loads,
    note:
      loads.length === 0
        ? "No counselor has a case yet, so there is nothing to balance against."
        : "Based on caseload size only. It does not account for how hard any individual case is, which is exactly why a manager decides.",
  };
}
