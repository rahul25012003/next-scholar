import { daysUntil, type StudentCase } from "./case";
import { detectEvents } from "./events";

/**
 * Explainable bands, never a probability. A percentage here would contradict
 * the permanent commitment that no admission or visa outcome is predicted, so
 * no number is produced at any point in this file.
 */
export type RiskBand = "Steady" | "Watch" | "Needs attention";

export type RiskIndicator = {
  factor: string;
  band: RiskBand;
  /** The stored evidence this was read from. Always shown with the band. */
  evidence: string;
};

export const RISK_DISCLAIMER =
  "This is decision support, not a prediction or a guarantee.";

const bandRank: Record<RiskBand, number> = {
  Steady: 0,
  Watch: 1,
  "Needs attention": 2,
};

export function assessRisk(record: StudentCase, now = new Date()): {
  band: RiskBand;
  indicators: RiskIndicator[];
} {
  const events = detectEvents(record, now);
  const indicators: RiskIndicator[] = [];

  const nearestDeadline = record.deadlines
    .map((deadline) => ({ ...deadline, days: daysUntil(deadline.date, now) }))
    .filter((deadline) => deadline.days >= 0)
    .sort((a, b) => a.days - b.days)[0];

  const missing = events.filter((event) => event.type === "missing_doc");
  if (missing.length > 0) {
    const pressing = nearestDeadline && nearestDeadline.days <= 21;
    indicators.push({
      factor: "Documents not verified",
      band: pressing ? "Needs attention" : "Watch",
      evidence: `${missing.length} required ${missing.length === 1 ? "document is" : "documents are"} unverified${
        nearestDeadline ? `, with ${nearestDeadline.label} in ${nearestDeadline.days} days` : ""
      }.`,
    });
  }

  const funding = record.documents.find((document) => document.category === "funding");
  if (!funding || funding.status !== "Verified") {
    indicators.push({
      factor: "Funding evidence incomplete",
      band:
        nearestDeadline && nearestDeadline.days <= 30 ? "Needs attention" : "Watch",
      evidence: funding
        ? `Funding evidence is marked ${funding.status.toLowerCase()}.`
        : "No funding evidence on file yet.",
    });
  }

  const expiring = events.filter((event) => event.type === "expiry");
  for (const event of expiring) {
    indicators.push({
      factor: "Document approaching expiry",
      band: event.priority === "Urgent" ? "Needs attention" : "Watch",
      evidence: event.detail,
    });
  }

  const stagnation = events.find((event) => event.type === "stagnation");
  if (stagnation) {
    indicators.push({
      factor: "No stage progress",
      band: stagnation.priority === "High" ? "Needs attention" : "Watch",
      evidence: stagnation.detail,
    });
  }

  const flaggedIssue = record.documents.find(
    (document) => document.status === "Issue found",
  );
  if (flaggedIssue) {
    indicators.push({
      factor: "Inconsistency found in a document",
      band: "Needs attention",
      evidence:
        flaggedIssue.issue ??
        `${flaggedIssue.name} is marked issue found by a counselor.`,
    });
  }

  const band = indicators.reduce<RiskBand>(
    (worst, indicator) =>
      bandRank[indicator.band] > bandRank[worst] ? indicator.band : worst,
    "Steady",
  );

  return { band, indicators };
}
