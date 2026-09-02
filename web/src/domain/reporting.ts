import type { StudentCase } from "./case";

/**
 * Public statistics are generated only from records with a final, human
 * confirmed outcome. Nothing is inferred, estimated or extrapolated, and the
 * categories never merge into a single success rate. A case still in progress
 * is neither a success nor a failure, so it is excluded from every rate rather
 * than counted as one.
 *
 * Every figure carries the ids it was computed from. A published number that
 * cannot be traced back to its records is a number nobody can defend when a
 * student, a university or a regulator asks where it came from.
 */

export type ReportCategory = {
  key: string;
  label: string;
  count: number;
  note: string;
  /** The record ids behind the count. */
  from: string[];
};

export type QuarterlyReport = {
  categories: ReportCategory[];
  inProgress: number;
  excludedFromRates: string;
  publishable: boolean;
  blockedReason: string | null;
  /** A published figure needs a named person behind it, like any other. */
  signedOffBy: string | null;
  signedOffAt: string | null;
};

export type SignOff = { by: string; at: string } | null;

export function buildQuarterlyReport(
  cases: StudentCase[],
  signOff: SignOff = null,
): QuarterlyReport {
  const applications = cases.flatMap((record) =>
    record.applications.map((application) => ({ record, application })),
  );

  const appsWhere = (
    predicate: (item: (typeof applications)[number]) => boolean,
  ): string[] => applications.filter(predicate).map((item) => item.application.id);

  const casesWhere = (predicate: (record: StudentCase) => boolean): string[] =>
    cases.filter(predicate).map((record) => record.id);

  // In progress means a person has not closed the case. Reaching the final
  // stage is not the same as having a confirmed outcome, and treating the stage
  // as a proxy is exactly the inference the reporting rule forbids.
  const inProgress = cases.filter((record) => record.closedAt === null).length;

  const category = (
    key: string,
    label: string,
    note: string,
    from: string[],
  ): ReportCategory => ({ key, label, note, from, count: from.length });

  const categories: ReportCategory[] = [
    category(
      "submitted",
      "Applications submitted",
      "Counted from a recorded submission date.",
      appsWhere((item) => item.application.submittedOn !== null),
    ),
    category(
      "offers",
      "Offers received",
      "Counted from a recorded outcome, not from an expectation.",
      appsWhere((item) => item.application.outcome === "offer"),
    ),
    category(
      "rejected",
      "Applications rejected",
      "Published alongside offers, never separately.",
      appsWhere((item) => item.application.outcome === "rejected"),
    ),
    category(
      "withdrawn",
      "Applications withdrawn",
      "An application pulled from a university. Not the same as a student who discontinued.",
      appsWhere((item) => item.application.outcome === "withdrawn"),
    ),
    category(
      "enrolled",
      "Enrolments confirmed",
      "A closed case with an approved visa. Never inferred from a stage.",
      casesWhere(
        (record) => record.closedAt !== null && record.visa.state === "approved",
      ),
    ),
    category(
      "discontinued",
      "Students who discontinued",
      "Closed without a visa application ever being filed. Its own category, never folded into a refusal.",
      casesWhere(
        (record) => record.closedAt !== null && record.visa.state === "not-started",
      ),
    ),
    category(
      "visa-submitted",
      "Visa applications submitted",
      "Counted from the visa state on the case, set by a person.",
      casesWhere((record) =>
        ["submitted", "approved", "refused"].includes(record.visa.state),
      ),
    ),
    category(
      "visa-approved",
      "Visas approved",
      "Counted from a recorded decision, never from a stage reaching the end.",
      casesWhere((record) => record.visa.state === "approved"),
    ),
    category(
      "visa-refused",
      "Visas refused",
      "Refusals publish on the same page as approvals, always.",
      casesWhere((record) => record.visa.state === "refused"),
    ),
  ];

  const synthetic = cases.some((record) => record.synthetic);

  return {
    categories,
    inProgress,
    excludedFromRates:
      "Cases still in progress are excluded from every published rate. In progress is not a result.",
    publishable: !synthetic && signOff !== null,
    blockedReason: synthetic
      ? "This report was computed from synthetic records, so it cannot be published. A real report needs real cases with human confirmed outcomes and a founder sign off."
      : signOff === null
        ? "No founder sign off on file. A quarterly report publishes when a named person has reviewed it, not when the numbers finish computing."
        : null,
    signedOffBy: signOff?.by ?? null,
    signedOffAt: signOff?.at ?? null,
  };
}
