import Link from "next/link";
import {
  ArrowUpRight,
  CalendarBlank,
  Prohibit,
  Warning,
  WarningCircle,
} from "@phosphor-icons/react/ssr";
import type {
  ChecklistItem,
  Figure,
  Intake,
  LanguageQualification,
  Requirement,
  TimelineStep,
  Verification,
} from "@/content/guides";
import { cn } from "@/lib/cn";

/**
 * The rendering blocks for a destination guide.
 *
 * Every one of them has the same job: print the number and print what makes it
 * safe to print. There is no variant of any block here that renders a figure
 * with its qualifier and source hidden, because a figure without them is the
 * thing this platform exists not to publish.
 */

export function GuideSection({
  id,
  eyebrow,
  title,
  lede,
  children,
}: {
  id: string;
  eyebrow?: string;
  title: string;
  lede?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-24 border-t border-line pt-10 md:pt-14">
      {eyebrow && (
        <p className="eyebrow text-pink">
          {eyebrow}
        </p>
      )}
      <h2 className="mt-2 text-blue-dark">
        {title}
      </h2>
      {lede && (
        <p className="mt-4 max-w-2xl leading-relaxed text-grey">{lede}</p>
      )}
      <div className="mt-7">{children}</div>
    </section>
  );
}

/**
 * The verification state of a whole guide.
 *
 * Rendered as a warning while `checkedBy` is null, which today is every guide.
 * That is the honest state and it stays visible rather than being softened into
 * a footnote, because a reader who assumes these figures were checked by a
 * named person this quarter would be wrong.
 */
export function VerificationBanner({ verification }: { verification: Verification }) {
  const checked = verification.checkedBy !== null;
  return (
    <div
      className={cn(
        "flex flex-col gap-3 rounded-card border p-5 sm:flex-row sm:items-start sm:gap-4",
        checked ? "border-verified/25 bg-verified-bg" : "border-pending/25 bg-pending-bg",
      )}
    >
      <WarningCircle
        size={20}
        weight="fill"
        aria-hidden
        className={cn("mt-0.5 shrink-0", checked ? "text-verified" : "text-pending")}
      />
      <div className="text-[0.875rem] leading-relaxed">
        <p className={cn("font-semibold", checked ? "text-verified" : "text-pending")}>
          {checked
            ? `Re-checked at source by ${verification.checkedBy} on ${verification.checkedOn}.`
            : "Not yet re-checked at source by a named person."}
        </p>
        <p className="mt-1 text-grey">
          Every figure below names the official body it came from and was written into
          this page on <span className="figures">{verification.statedOn}</span>. Nobody
          has since re-read the full set at source, and until someone has, treat each
          number as a planning figure to confirm rather than a decided one.{" "}
          {verification.cadence}
        </p>
      </div>
    </div>
  );
}

/** A published number, with its qualifier and its source attached. */
export function FigureRow({ figure, inr }: { figure: Figure; inr?: string }) {
  return (
    <div className="py-5 first:pt-0 last:pb-0">
      <div className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-1">
        <h3 className="text-blue-dark h--6">{figure.label}</h3>
        <p className="figures font-semibold text-blue-dark">
          {figure.value}
          {inr && (
            <span className="ml-2 text-[0.8125rem] font-normal text-grey">
              about {inr}
            </span>
          )}
        </p>
      </div>
      <p className="mt-2 max-w-prose text-[0.875rem] leading-relaxed text-grey">
        {figure.qualifier}
      </p>
      {figure.note && (
        <p className="mt-2 max-w-prose text-[0.875rem] leading-relaxed text-grey">
          {figure.note}
        </p>
      )}
      <p className="mt-2 text-[0.8125rem] text-grey">Source: {figure.source}</p>
    </div>
  );
}

export function FigureList({ figures }: { figures: Figure[] }) {
  return (
    <div className="divide-y divide-line rounded-panel border border-line bg-white p-6 md:p-7">
      {figures.map((figure) => (
        <FigureRow key={figure.label} figure={figure} />
      ))}
    </div>
  );
}

export function RequirementList({ items }: { items: Requirement[] }) {
  return (
    <div className="grid gap-5 md:grid-cols-2">
      {items.map((item) => (
        <article
          key={item.title}
          className=" flex flex-col rounded-card border border-line bg-white p-6"
        >
          <h3 className="text-blue-dark h--6">
            {item.title}
          </h3>
          {item.appliesTo && (
            <p className="mt-2 text-[0.8125rem] font-medium text-pink">
              Applies to: {item.appliesTo}
            </p>
          )}
          <p className="mt-3 flex-1 text-[0.9375rem] leading-relaxed text-grey">{item.body}</p>
          <p className="mt-4 border-t border-line pt-3 text-[0.8125rem] text-grey">
            Source: {item.source}
          </p>
        </article>
      ))}
    </div>
  );
}

/**
 * A numbered sequence. The blocking note is the reason this is a list of steps
 * and not a list of documents: what a student needs to know is not only what
 * comes next but what stops if it is late.
 */
export function Checklist({
  items,
  ordered = true,
}: {
  items: ChecklistItem[];
  ordered?: boolean;
}) {
  const List = ordered ? "ol" : "ul";
  return (
    <List className="divide-y divide-line overflow-hidden rounded-panel border border-line bg-white">
      {items.map((item, index) => (
        <li key={item.id} className="flex gap-5 p-6">
          <span
            aria-hidden
            className="figures grid h-7 w-7 shrink-0 place-items-center rounded-full bg-blue-light text-[0.8125rem] font-semibold text-blue-dark"
          >
            {ordered ? index + 1 : "•"}
          </span>
          <div className="min-w-0">
            <h3 className="text-blue-dark h--6">{item.title}</h3>
            <p className="mt-1.5 text-[0.9375rem] leading-relaxed text-grey">{item.detail}</p>
            {item.blocks && (
              <p className="mt-2.5 inline-flex items-start gap-1.5 rounded-card bg-pending-bg px-2.5 py-1.5 text-[0.8125rem] leading-snug text-pending">
                <Prohibit size={14} weight="fill" aria-hidden className="mt-0.5 shrink-0" />
                <span>
                  <span className="font-semibold">Holds up:</span> {item.blocks}
                </span>
              </p>
            )}
            <p className="mt-2.5 text-[0.8125rem] text-grey">Source: {item.source}</p>
          </div>
        </li>
      ))}
    </List>
  );
}

export function LanguageTable({ items }: { items: LanguageQualification[] }) {
  return (
    <div className="overflow-x-auto rounded-panel border border-line bg-white">
      <table className="w-full min-w-[44rem] border-collapse text-left">
        <caption className="sr-only">
          Accepted language qualifications, the levels each is accepted at, and how long
          each remains valid.
        </caption>
        <thead>
          <tr className="border-b border-line bg-light">
            <th scope="col" className="px-6 py-3.5 text-[0.8125rem] font-semibold text-blue-dark">
              Qualification
            </th>
            <th scope="col" className="px-6 py-3.5 text-[0.8125rem] font-semibold text-blue-dark">
              Accepted at
            </th>
            <th scope="col" className="px-6 py-3.5 text-[0.8125rem] font-semibold text-blue-dark">
              Validity
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-line">
          {items.map((item) => (
            <tr key={item.name} className="align-top">
              <th scope="row" className="px-6 py-5 text-[0.9375rem] font-semibold text-blue-dark">
                {item.name}
                <span className="mt-1.5 block text-[0.75rem] font-normal text-grey">
                  {item.source}
                </span>
              </th>
              <td className="px-6 py-5 text-[0.875rem] leading-relaxed text-grey">
                {item.accepted}
                {item.note && (
                  <span className="mt-2 block text-[0.8125rem] text-grey">{item.note}</span>
                )}
              </td>
              <td className="px-6 py-5 text-[0.875rem] leading-relaxed text-grey">
                {item.validity}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const intakeTone: Record<Intake["status"], { label: string; className: string }> = {
  open: { label: "Open", className: "bg-verified-bg text-verified" },
  "closing-soon": { label: "Closing soon", className: "bg-pending-bg text-pending" },
  closed: { label: "Closed", className: "bg-denied-bg text-denied" },
  "not-yet-open": { label: "Not yet open", className: "bg-neutral-chip-bg text-neutral-chip" },
};

/**
 * Intakes as dates.
 *
 * A month name is not a deadline, and "September intake" has never told anyone
 * when to submit anything. Every row here carries the actual date, the status of
 * that date, and the day the status was last established.
 */
export function IntakeTable({ intakes }: { intakes: Intake[] }) {
  return (
    <div className="grid gap-5 md:grid-cols-2">
      {intakes.map((intake) => {
        const tone = intakeTone[intake.status];
        return (
          <article key={intake.name} className="rounded-card border border-line bg-white p-6">
            <div className="flex items-start justify-between gap-4">
              <h3 className="text-blue-dark h--5">
                {intake.name}
              </h3>
              <span
                className={cn(
                  "shrink-0 rounded-input px-2.5 py-1 text-[0.6875rem] font-medium",
                  tone.className,
                )}
              >
                {tone.label}
              </span>
            </div>
            <dl className="mt-5 divide-y divide-line">
              <div className="flex items-baseline justify-between gap-4 pb-3">
                <dt className="text-[0.875rem] text-grey">Common application deadline</dt>
                <dd className="figures text-[0.9375rem] font-semibold text-blue-dark">
                  {intake.applicationDeadline}
                </dd>
              </div>
              <div className="flex items-baseline justify-between gap-4 py-3">
                <dt className="text-[0.875rem] text-grey">Teaching starts</dt>
                <dd className="figures text-[0.9375rem] font-semibold text-blue-dark">
                  {intake.teachingStarts}
                </dd>
              </div>
            </dl>
            <p className="mt-4 text-[0.875rem] leading-relaxed text-grey">
              {intake.deadlineNote}
            </p>
            <p className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-[0.8125rem] text-grey">
              <CalendarBlank size={13} weight="bold" aria-hidden />
              Status established <span className="figures">{intake.statusAsOf}</span>. Source:{" "}
              {intake.source}
            </p>
          </article>
        );
      })}
    </div>
  );
}

export function Timeline({ steps }: { steps: TimelineStep[] }) {
  return (
    <ol className="relative space-y-6 border-l border-line pl-7">
      {steps.map((step) => (
        <li key={step.title} className="relative">
          <span
            aria-hidden
            className="absolute -left-[2.1rem] top-1.5 grid h-4 w-4 place-items-center rounded-full border-2 border-blue-dark bg-white"
          />
          <p className="figures text-[0.8125rem] font-medium text-pink">
            {step.monthsBefore[0]} to {step.monthsBefore[1]} months before you fly
          </p>
          <h3 className="mt-1 text-blue-dark h--6">
            {step.title}
          </h3>
          <p className="mt-1.5 max-w-2xl text-[0.9375rem] leading-relaxed text-grey">
            {step.detail}
          </p>
        </li>
      ))}
    </ol>
  );
}

/** What goes wrong, named. Not a list of tips. */
export function Pitfalls({ items }: { items: { title: string; body: string }[] }) {
  return (
    <ul className="grid gap-4 md:grid-cols-2">
      {items.map((item) => (
        <li
          key={item.title}
          className="flex gap-4 rounded-card border border-line bg-white p-5"
        >
          <Warning size={18} weight="fill" aria-hidden className="mt-0.5 shrink-0 text-pending" />
          <div>
            <h3 className="text-blue-dark h--6">{item.title}</h3>
            <p className="mt-1.5 text-[0.875rem] leading-relaxed text-grey">{item.body}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}

export function ToolLink({
  href,
  title,
  note,
}: {
  href: string;
  title: string;
  note: string;
}) {
  return (
    <Link
      href={href}
      className="group flex items-start justify-between gap-5 rounded-card border border-line bg-white p-5 transition-[border-color,box-shadow] hover:border-pink hover:"
    >
      <span>
        <span className="block text-[0.9375rem] font-semibold text-blue-dark">{title}</span>
        <span className="mt-1 block text-[0.875rem] leading-relaxed text-grey">{note}</span>
      </span>
      <ArrowUpRight
        size={16}
        weight="bold"
        aria-hidden
        className="mt-1 shrink-0 text-grey transition-[color,transform] group-hover:-translate-y-0.5 group-hover:text-pink"
      />
    </Link>
  );
}
