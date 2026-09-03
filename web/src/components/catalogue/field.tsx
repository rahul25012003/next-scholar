import { Info, WarningDiamond } from "@phosphor-icons/react/ssr";
import type { Field, University } from "@/content/catalogue";
import { StatusChip } from "@/components/ui/chip";
import { cn } from "@/lib/cn";

/**
 * Rendering a catalogue field.
 *
 * There are two shapes and both are rendered. An unknown is not hidden and not
 * printed as a dash: it prints its reason, because "we have not checked" and
 * "the institution does not publish it" are different facts and a student
 * deciding where to spend an application fee needs to know which one applies.
 */
export function FieldValue<T>({
  field,
  render,
  className,
}: {
  field: Field<T>;
  render?: (value: T) => React.ReactNode;
  className?: string;
}) {
  if (field.state === "unknown") {
    return (
      <span className={cn("text-[0.875rem] leading-relaxed text-muted", className)}>
        Not stated here. {field.reason}
      </span>
    );
  }

  return (
    <span className={className}>
      <span className="text-[0.9375rem] text-navy-900">
        {render ? render(field.value) : String(field.value)}
      </span>
      {field.qualifier && (
        <span className="mt-1 block text-[0.8125rem] leading-relaxed text-muted">
          {field.qualifier}
        </span>
      )}
      <span className="mt-1 block text-[0.75rem] text-muted">
        {field.source}, written down {field.statedOn}
      </span>
    </span>
  );
}

/** A definition row that keeps the source attached to the value. */
export function FieldRow<T>({
  label,
  field,
  render,
}: {
  label: string;
  field: Field<T>;
  render?: (value: T) => React.ReactNode;
}) {
  return (
    <div className="grid gap-1.5 py-4 sm:grid-cols-[12rem_minmax(0,1fr)] sm:gap-6">
      <dt className="text-[0.875rem] font-medium text-navy-900">{label}</dt>
      <dd>
        <FieldValue field={field} render={render} />
      </dd>
    </div>
  );
}

/**
 * The commission badge.
 *
 * On every card, every profile and every row, without exception. Neither
 * benchmark publishes this anywhere, and a catalogue that shows a fee but not
 * what the person recommending it earns is the specific omission this business
 * was built to correct.
 */
export function CommissionBadge({
  university,
  size = "sm",
}: {
  university: University;
  size?: "sm" | "md";
}) {
  const zero = university.commission.highInr === 0;
  return (
    <span className="inline-flex flex-wrap items-center gap-1.5">
      <span
        className={cn(
          "inline-flex items-center gap-1.5 rounded-input px-2.5 py-1 font-medium",
          size === "sm" ? "text-[0.6875rem]" : "text-[0.8125rem]",
          zero ? "bg-verified-bg text-verified" : "bg-neutral-chip-bg text-neutral-chip",
        )}
      >
        We earn{" "}
        <span className="figures font-semibold">{university.commission.display}</span>
      </span>
      <StatusChip status={university.commission.status} />
      {university.commission.aboveAverage && (
        <span
          className={cn(
            "inline-flex items-center gap-1 rounded-input bg-pending-bg px-2 py-1 font-medium text-pending",
            size === "sm" ? "text-[0.6875rem]" : "text-[0.8125rem]",
          )}
        >
          <WarningDiamond size={12} weight="fill" aria-hidden />
          Above category average
        </span>
      )}
    </span>
  );
}

/** The paragraph under the badge, where there is room for it. */
export function CommissionNote({ university }: { university: University }) {
  return (
    <p className="flex gap-2.5 rounded-card bg-surface px-4 py-3.5 text-[0.8125rem] leading-relaxed text-body">
      <Info size={15} weight="fill" aria-hidden className="mt-0.5 shrink-0 text-blue-600" />
      <span>{university.commission.note}</span>
    </p>
  );
}

export function formatFee(amount: number, currency: "GBP" | "EUR"): string {
  const symbol = currency === "GBP" ? "£" : "€";
  if (amount === 0) return "No tuition fee";
  return `${symbol}${amount.toLocaleString("en-GB")}`;
}
