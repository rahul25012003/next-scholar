import Link from "next/link";
import Image from "next/image";
import { ArrowRight, CalendarBlank, Clock } from "@phosphor-icons/react/ssr";
import type { ProgrammeRow } from "@/content/catalogue";
import { nextDeadline } from "@/content/catalogue";
import { CommissionBadge, formatFee } from "@/components/catalogue/field";
import { SaveToShortlist } from "@/components/catalogue/save-button";
import { cn } from "@/lib/cn";

const intakeTone = {
  open: "bg-verified-bg text-verified",
  "closing-soon": "bg-pending-bg text-pending",
  closed: "bg-denied-bg text-denied",
  "not-yet-open": "bg-neutral-chip-bg text-neutral-chip",
} as const;

const intakeLabel = {
  open: "Open",
  "closing-soon": "Closing soon",
  closed: "Closed",
  "not-yet-open": "Not yet open",
} as const;

/**
 * A course row.
 *
 * Carries the fee marked indicative, the duration, the next intake with the
 * further dates expandable, and the commission band. The last of those is the
 * one neither benchmark prints anywhere, and it is not in a corner: it sits on
 * the same line as the fee, because they are the same kind of fact.
 */
export function CourseCard({
  row,
  saved,
  returnTo,
}: {
  row: ProgrammeRow;
  saved: boolean;
  returnTo: string;
}) {
  const upcoming = nextDeadline(row);
  const first = row.intakes[0];
  const rest = row.intakes.slice(1);

  return (
    <article className="rounded-panel border border-line bg-paper p-6 transition-shadow duration-300 hover:shadow-card">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex min-w-0 items-start gap-3.5">
          <span
            aria-hidden
            className="figures grid h-11 w-11 shrink-0 place-items-center rounded-input bg-blue-100 text-[0.75rem] font-bold text-navy-900"
          >
            {row.university.initials}
          </span>
          <div className="min-w-0">
            <h3 className="font-display text-[1.0625rem] font-bold leading-snug text-navy-900">
              <Link
                href={`/universities/${row.university.slug}/${row.slug}`}
                className="hover:text-blue-600"
              >
                {row.name}
              </Link>
            </h3>
            <p className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-[0.875rem] text-body">
              <Link
                href={`/universities/${row.university.slug}`}
                className="font-medium hover:text-blue-600"
              >
                {row.university.name}
              </Link>
              <span aria-hidden className="text-line-strong">
                ·
              </span>
              {row.university.city}
              <Image
                src={`https://flagcdn.com/w40/${row.university.flagCode}.png`}
                alt=""
                width={20}
                height={15}
                className="h-3 w-auto rounded-[2px] ring-1 ring-line"
              />
            </p>
          </div>
        </div>
        <SaveToShortlist
          programmeSlug={row.slug}
          saved={saved}
          returnTo={returnTo}
          className="shrink-0"
        />
      </div>

      <dl className="mt-5 grid gap-4 border-t border-line pt-4 sm:grid-cols-3">
        <div>
          <dt className="text-[0.75rem] text-muted">Tuition, per year</dt>
          <dd className="figures mt-0.5 text-[1.0625rem] font-semibold text-navy-900">
            {row.feePerYear.state === "stated"
              ? formatFee(row.feePerYear.value, row.currency)
              : "Not published here"}
          </dd>
          <dd className="mt-1 text-[0.75rem] leading-snug text-muted">
            {row.feePerYear.state === "stated"
              ? "Indicative. The programme's fee page governs."
              : row.feePerYear.reason}
          </dd>
        </div>
        <div>
          <dt className="text-[0.75rem] text-muted">Duration</dt>
          <dd className="figures mt-0.5 flex items-center gap-1.5 text-[1.0625rem] font-semibold text-navy-900">
            <Clock size={15} weight="bold" aria-hidden className="text-muted" />
            {row.durationMonths} months
          </dd>
          <dd className="mt-1 text-[0.75rem] leading-snug text-muted">
            {row.languageOfInstruction}
          </dd>
        </div>
        <div>
          <dt className="text-[0.75rem] text-muted">Next deadline</dt>
          <dd className="figures mt-0.5 flex items-center gap-1.5 text-[1.0625rem] font-semibold text-navy-900">
            <CalendarBlank size={15} weight="bold" aria-hidden className="text-muted" />
            {upcoming ?? "None ahead"}
          </dd>
          {first && (
            <dd className="mt-1.5">
              <span
                className={cn(
                  "rounded-input px-2 py-0.5 text-[0.6875rem] font-medium",
                  intakeTone[first.status],
                )}
              >
                {first.name}: {intakeLabel[first.status]}
              </span>
            </dd>
          )}
        </div>
      </dl>

      {rest.length > 0 && (
        <details className="mt-3">
          <summary className="cursor-pointer text-[0.8125rem] font-medium text-blue-600">
            {rest.length} further intake{rest.length === 1 ? "" : "s"}
          </summary>
          <ul className="mt-2 space-y-1.5">
            {rest.map((intake) => (
              <li key={intake.name} className="text-[0.8125rem] text-body">
                <span className="font-medium text-navy-900">{intake.name}</span>: apply by{" "}
                <span className="figures">{intake.applicationDeadline}</span>, teaching starts{" "}
                <span className="figures">{intake.teachingStarts}</span>
                {intake.campus ? `, ${intake.campus}` : ""}
              </li>
            ))}
          </ul>
        </details>
      )}

      <div className="mt-5 flex flex-wrap items-center justify-between gap-4 border-t border-line pt-4">
        <CommissionBadge university={row.university} />
        <Link
          href={`/universities/${row.university.slug}/${row.slug}`}
          className="group inline-flex items-center gap-1.5 text-[0.875rem] font-medium text-blue-600 hover:text-blue-500"
        >
          Course detail
          <ArrowRight
            size={14}
            weight="bold"
            aria-hidden
            className="transition-transform group-hover:translate-x-0.5"
          />
        </Link>
      </div>
    </article>
  );
}
