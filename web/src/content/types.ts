/**
 * Honesty rules expressed as types.
 *
 * Guardrail 7 of the build spec: every number on the platform traces to a live
 * API call, an authenticated staff entry, or an explicit pending state. There
 * is no fourth option, so there is no content shape here that lets a figure be
 * published without a status attached to it.
 */

/** The seven states a commission figure can occupy. It never skips to published. */
export type VerificationStatus =
  | "unverified"
  | "outreach-sent"
  | "permission-pending"
  | "permission-denied"
  | "verified-publishable"
  | "verified-band-only"
  | "disputed";

export const STATUS_LABEL: Record<VerificationStatus, string> = {
  unverified: "Unverified market estimate",
  "outreach-sent": "Outreach sent",
  "permission-pending": "Permission pending",
  "permission-denied": "Disclosure declined by university",
  "verified-publishable": "Verified, cleared for publication",
  "verified-band-only": "Verified, band only",
  disputed: "Disputed, frozen",
};

export const STATUS_TONE: Record<
  VerificationStatus,
  "verified" | "pending" | "denied" | "neutral"
> = {
  unverified: "pending",
  "outreach-sent": "neutral",
  "permission-pending": "pending",
  "permission-denied": "denied",
  "verified-publishable": "verified",
  "verified-band-only": "verified",
  disputed: "denied",
};

/** Only these two states may print an exact figure to the public site. */
export function isPublishable(status: VerificationStatus): boolean {
  return status === "verified-publishable" || status === "verified-band-only";
}

/**
 * Source of a commission figure. A figure sourced from "market-estimate" can
 * never be rendered as if it were confirmed, whatever its status says.
 */
export type CommissionSource =
  | "signed-partner-agreement"
  | "aggregator-statement"
  | "direct-written-confirmation"
  | "market-estimate";

export const SOURCE_LABEL: Record<CommissionSource, string> = {
  "signed-partner-agreement": "Signed partner agreement",
  "aggregator-statement": "Aggregator statement",
  "direct-written-confirmation": "Direct written confirmation",
  "market-estimate": "Market estimate, not a contract term",
};

/**
 * A number that does not exist yet. The site renders the same component either
 * way, so an empty metric keeps its shape instead of being quietly dropped or
 * filled with a plausible looking guess.
 */
export type Measured<T> =
  | { state: "measured"; value: T; asOf: string }
  | { state: "pending"; reason: string };

export const notYetOpen = (reason: string): Measured<never> => ({
  state: "pending",
  reason,
});

/**
 * Whether a date this site is relying on is old enough to need a fresh look.
 * 90 days matches the ledger's own stated cadence in `content/ledger.ts`:
 * "Every row is re-verified and republished each quarter... A stale
 * verification date is treated as worse than no date." Generic rather than
 * ledger-specific because that same rule applies to any dated, decision
 * critical fact on this site, not only a commission figure.
 */
export const STALE_AFTER_DAYS = 90;

export function isStale(dateStr: string, now = new Date(), thresholdDays = STALE_AFTER_DAYS): boolean {
  const days = (now.getTime() - new Date(dateStr).getTime()) / 86_400_000;
  return days > thresholdDays;
}
