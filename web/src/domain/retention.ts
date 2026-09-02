/**
 * Retention and deletion.
 *
 * The published policy commits to a written file per student for five years.
 * That commitment is only real if something enforces the far end of it, so the
 * period is computed here and a case past it is reported as eligible for
 * deletion rather than quietly kept forever.
 *
 * The five year figure is the business's own commitment. It has not been cross
 * checked against what the DPDP Act actually requires, which may be shorter or
 * longer, and the policy page says so. That check is a legal task, not an
 * engineering one, so the constant carries the caveat rather than hiding it.
 */

export const RETENTION_YEARS = 5;

export const RETENTION_CAVEAT =
  "Five years is the commitment Next Scholar published. It still needs cross checking against the DPDP Act, which may require a shorter or longer period.";

export type RetentionState =
  | { state: "open"; note: string }
  | { state: "retained"; until: string; daysRemaining: number }
  | { state: "deletable"; since: string; daysOverdue: number };

export function retentionFor(
  closedAt: string | null,
  now = new Date(),
): RetentionState {
  if (!closedAt) {
    return {
      state: "open",
      note: "The case is open, so the retention clock has not started.",
    };
  }

  const until = new Date(closedAt);
  until.setFullYear(until.getFullYear() + RETENTION_YEARS);
  const days = Math.ceil((until.getTime() - now.getTime()) / 86_400_000);

  return days > 0
    ? { state: "retained", until: until.toISOString().slice(0, 10), daysRemaining: days }
    : {
        state: "deletable",
        since: until.toISOString().slice(0, 10),
        daysOverdue: Math.abs(days),
      };
}
