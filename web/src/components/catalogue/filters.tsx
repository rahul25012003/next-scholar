import Link from "next/link";
import { ArrowCounterClockwise, FunnelSimple } from "@phosphor-icons/react/ssr";
import { disciplines, sortOptions, type Filters } from "@/content/catalogue";
import { guides } from "@/content/guides";

/**
 * The filter rail.
 *
 * A plain GET form with an explicit Apply, and no client JavaScript anywhere in
 * it. That is not minimalism for its own sake: it means no control can clear
 * another one, because nothing changes until the form is submitted; it means
 * the result is a real URL you can send to someone; and it means the back
 * button does what a back button should. Both benchmarks have filter rails
 * where picking a destination silently resets the subject, which is what
 * happens when every control mutates shared state on change.
 */
export function FilterRail({
  filters,
  sort,
  resultCount,
}: {
  filters: Filters;
  sort: string;
  resultCount: number;
}) {
  const subjects = disciplines();

  return (
    <form
      method="get"
      action="/universities"
      className="rounded-panel border border-line bg-paper"
      aria-label="Filter courses"
    >
      <div className="flex items-center justify-between gap-4 border-b border-line px-5 py-4">
        <h2 className="flex items-center gap-2 font-display text-[0.9375rem] font-bold text-navy-900">
          <FunnelSimple size={16} weight="bold" aria-hidden />
          Filters
        </h2>
        <Link
          href="/universities"
          className="inline-flex items-center gap-1.5 text-[0.8125rem] font-medium text-muted transition-colors hover:text-blue-600"
        >
          <ArrowCounterClockwise size={13} weight="bold" aria-hidden />
          Reset
        </Link>
      </div>

      <div className="space-y-6 px-5 py-5">
        <div>
          <label
            htmlFor="q"
            className="block text-[0.8125rem] font-semibold text-navy-900"
          >
            Search
          </label>
          <input
            id="q"
            name="q"
            defaultValue={filters.query}
            placeholder="Course, university or city"
            className="mt-2 w-full rounded-input border border-line-strong bg-paper px-3 py-2 text-[0.875rem] text-navy-900 placeholder:text-muted"
          />
        </div>

        <fieldset>
          <legend className="text-[0.8125rem] font-semibold text-navy-900">Destination</legend>
          <div className="mt-2.5 space-y-2">
            {guides.map((guide) => (
              <Check
                key={guide.slug}
                name="destination"
                value={guide.slug}
                label={guide.country}
                checked={filters.destinations.includes(guide.slug)}
              />
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend className="text-[0.8125rem] font-semibold text-navy-900">Level</legend>
          <div className="mt-2.5 space-y-2">
            <Check
              name="level"
              value="masters"
              label="Master's"
              checked={filters.levels.includes("masters")}
            />
            <Check
              name="level"
              value="bachelors"
              label="Bachelor's"
              checked={filters.levels.includes("bachelors")}
            />
          </div>
        </fieldset>

        <fieldset>
          <legend className="text-[0.8125rem] font-semibold text-navy-900">
            Subject
          </legend>
          <div className="mt-2.5 space-y-2">
            {subjects.map((subject) => (
              <Check
                key={subject.name}
                name="discipline"
                value={subject.name}
                label={subject.name}
                note={String(subject.count)}
                checked={filters.disciplines.includes(subject.name)}
              />
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend className="text-[0.8125rem] font-semibold text-navy-900">
            Maximum annual tuition
          </legend>
          <p className="mt-1 text-[0.75rem] leading-snug text-muted">
            Set per currency, because £30,000 and €30,000 are different numbers and
            converting them here would hide that.
          </p>
          <div className="mt-2.5 grid grid-cols-2 gap-2">
            <label className="block">
              <span className="block text-[0.75rem] text-muted">UK, £</span>
              <input
                type="number"
                name="maxGbp"
                min={0}
                step={1000}
                defaultValue={filters.maxFeeGbp ?? ""}
                placeholder="30000"
                className="figures mt-1 w-full rounded-input border border-line-strong px-2.5 py-1.5 text-[0.875rem] text-navy-900"
              />
            </label>
            <label className="block">
              <span className="block text-[0.75rem] text-muted">EU, €</span>
              <input
                type="number"
                name="maxEur"
                min={0}
                step={1000}
                defaultValue={filters.maxFeeEur ?? ""}
                placeholder="25000"
                className="figures mt-1 w-full rounded-input border border-line-strong px-2.5 py-1.5 text-[0.875rem] text-navy-900"
              />
            </label>
          </div>
        </fieldset>

        <fieldset>
          <legend className="text-[0.8125rem] font-semibold text-navy-900">
            What we earn
          </legend>
          <p className="mt-1 text-[0.75rem] leading-snug text-muted">
            Neither benchmark offers this filter, because neither publishes the figure it
            would filter on.
          </p>
          <div className="mt-2.5 space-y-2">
            <Check
              name="zeroCommission"
              value="1"
              label="Only institutions that pay us nothing"
              checked={filters.zeroCommissionOnly}
            />
            <Check
              name="hideAboveAverage"
              value="1"
              label="Hide bands above the category average"
              checked={filters.hideAboveAverage}
            />
          </div>
        </fieldset>

        <fieldset>
          <legend className="text-[0.8125rem] font-semibold text-navy-900">
            Completeness
          </legend>
          <div className="mt-2.5 space-y-2">
            <Check
              name="publishedFee"
              value="1"
              label="Only courses with a fee we have written down"
              checked={filters.publishedFeeOnly}
            />
          </div>
        </fieldset>

        <div>
          <label htmlFor="sort" className="block text-[0.8125rem] font-semibold text-navy-900">
            Order by
          </label>
          <select
            id="sort"
            name="sort"
            defaultValue={sort}
            className="mt-2 w-full rounded-input border border-line-strong bg-paper px-3 py-2 text-[0.875rem] text-navy-900"
          >
            {sortOptions.map((option) => (
              <option key={option.key} value={option.key}>
                {option.label}
              </option>
            ))}
          </select>
          <p className="mt-2 text-[0.75rem] leading-snug text-muted">
            {sortOptions.find((option) => option.key === sort)?.note}
          </p>
        </div>
      </div>

      <div className="border-t border-line px-5 py-4">
        <button
          type="submit"
          className="w-full rounded-full bg-blue-600 px-5 py-2.5 text-[0.9375rem] font-medium text-white transition-colors hover:bg-blue-500"
        >
          Apply filters
        </button>
        <p className="mt-2.5 text-center text-[0.75rem] text-muted">
          Showing {resultCount} course{resultCount === 1 ? "" : "s"} on the current filters.
        </p>
      </div>
    </form>
  );
}

function Check({
  name,
  value,
  label,
  note,
  checked,
}: {
  name: string;
  value: string;
  label: string;
  note?: string;
  checked: boolean;
}) {
  return (
    <label className="flex items-start gap-2.5">
      <input
        type="checkbox"
        name={name}
        value={value}
        defaultChecked={checked}
        className="mt-0.5 h-4 w-4 shrink-0 accent-[var(--color-blue-600)]"
      />
      <span className="flex-1 text-[0.875rem] leading-snug text-body">{label}</span>
      {note && <span className="figures text-[0.75rem] text-muted">{note}</span>}
    </label>
  );
}
