import type { StudentCase } from "./case";

/**
 * Public statistics are generated only from records with a final, human
 * confirmed outcome. Nothing is inferred, estimated or extrapolated, and the
 * categories never merge into a single success rate. A case still in progress
 * is neither a success nor a failure, so it is excluded from every rate rather
 * than counted as one.
 */

export type QuarterlyReport = {
  categories: { key: string; label: string; count: number; note: string }[];
  inProgress: number;
  excludedFromRates: string;
  publishable: boolean;
  blockedReason: string | null;
};

export function buildQuarterlyReport(cases: StudentCase[]): QuarterlyReport {
  const applications = cases.flatMap((record) => record.applications);

  const submitted = applications.filter((item) => item.submittedOn !== null).length;
  const offers = applications.filter((item) => item.outcome === "offer").length;
  const rejected = applications.filter((item) => item.outcome === "rejected").length;
  const withdrawn = applications.filter((item) => item.outcome === "withdrawn").length;
  const inProgress = cases.filter((record) => record.stage !== "outcome").length;
  const visaApproved = cases.filter((record) => record.visa.state === "approved").length;
  const visaRefused = cases.filter((record) => record.visa.state === "refused").length;
  const visaSubmitted = cases.filter((record) =>
    ["submitted", "approved", "refused"].includes(record.visa.state),
  ).length;

  const synthetic = cases.some((record) => record.synthetic);

  return {
    categories: [
      {
        key: "submitted",
        label: "Applications submitted",
        count: submitted,
        note: "Counted from a recorded submission date.",
      },
      {
        key: "offers",
        label: "Offers received",
        count: offers,
        note: "Counted from a recorded outcome, not from an expectation.",
      },
      {
        key: "rejected",
        label: "Applications rejected",
        count: rejected,
        note: "Published alongside offers, never separately.",
      },
      {
        key: "withdrawn",
        label: "Withdrawn by the student",
        count: withdrawn,
        note: "Its own category. Never folded into a refusal or a success.",
      },
      {
        key: "visa-submitted",
        label: "Visa applications submitted",
        count: visaSubmitted,
        note: "Counted from the visa state on the case, set by a person.",
      },
      {
        key: "visa-approved",
        label: "Visas approved",
        count: visaApproved,
        note: "Counted from a recorded decision, never from a stage reaching the end.",
      },
      {
        key: "visa-refused",
        label: "Visas refused",
        count: visaRefused,
        note: "Refusals publish on the same page as approvals, always.",
      },
    ],
    inProgress,
    excludedFromRates:
      "Cases still in progress are excluded from every published rate. In progress is not a result.",
    publishable: !synthetic,
    blockedReason: synthetic
      ? "This report was computed from synthetic records, so it cannot be published. A real report needs real cases with human confirmed outcomes and a founder sign off."
      : null,
  };
}
