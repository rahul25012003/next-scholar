"use client";

import { useMemo, useState } from "react";
import { ArrowCounterClockwise } from "@phosphor-icons/react";
import type { DestinationGuide, IndicativeRate } from "@/content/guides";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";

type Level = "low" | "mid" | "high";

const levels: { key: Level; label: string; note: string }[] = [
  { key: "low", label: "Careful", note: "The low end of every range: shared room, cooking at home, no discretionary travel." },
  { key: "mid", label: "Middle", note: "The midpoint of each range. A reasonable default for a first year." },
  { key: "high", label: "Comfortable", note: "The high end of every range: a better room, eating out, travel home." },
];

function pick(low: number, high: number, level: Level): number {
  if (level === "low") return low;
  if (level === "high") return high;
  return Math.round((low + high) / 2);
}

/**
 * The cost of living calculator.
 *
 * Ungated by policy, not by omission: there is no signup, no email capture and
 * no result withheld behind a form anywhere in this component, and there is not
 * meant to be. Withholding an arithmetic result until someone hands over a
 * phone number is the single sharpest conversion mechanic in this market and it
 * is the exact opposite of the position this business takes.
 *
 * Every line is editable, because our range is a published range and the
 * student's own rent is a fact. When they overwrite a line the total follows
 * their number, and the row says it has been changed so the published range is
 * still visible next to it.
 */
export function CostOfLivingCalculator({
  guide,
  rate,
}: {
  guide: DestinationGuide;
  rate: IndicativeRate;
}) {
  const [citySlug, setCitySlug] = useState(guide.living.cities[0].slug);
  const [level, setLevel] = useState<Level>("mid");
  const [excluded, setExcluded] = useState<string[]>(() =>
    guide.living.cities[0].lines.filter((line) => line.optional).map((line) => line.id),
  );
  const [overrides, setOverrides] = useState<Record<string, number>>({});

  const city = guide.living.cities.find((item) => item.slug === citySlug)!;
  const symbol = guide.living.symbol;

  const rows = useMemo(
    () =>
      city.lines.map((line) => {
        const key = `${city.slug}:${line.id}`;
        const suggested = pick(line.low, line.high, level);
        const value = overrides[key] ?? suggested;
        return {
          ...line,
          key,
          suggested,
          value,
          overridden: overrides[key] !== undefined && overrides[key] !== suggested,
          included: !excluded.includes(line.id),
        };
      }),
    [city, level, overrides, excluded],
  );

  const monthly = rows
    .filter((row) => row.included)
    .reduce((total, row) => total + row.value, 0);

  const reset = () => {
    setOverrides({});
    setLevel("mid");
    setExcluded(city.lines.filter((line) => line.optional).map((line) => line.id));
  };

  const livingInr = Math.round(monthly * 12 * rate.inrPerUnit);
  const [tuitionInr, setTuitionInr] = useState(0);
  const [fundsInr, setFundsInr] = useState(0);
  const firstYearInr = livingInr + tuitionInr;
  const gapInr = Math.max(0, firstYearInr - fundsInr);
  const surplusInr = Math.max(0, fundsInr - firstYearInr);

  return (
    <div className="rounded-panel border border-line bg-white">
      <div className="border-b border-line p-6 md:p-7">
        <fieldset>
          <legend className="text-[0.8125rem] font-semibold text-blue-dark">City</legend>
          <p className="mt-1 text-[0.875rem] text-grey">
            Rent moves more than every other line combined, so the city is the first
            choice rather than a detail.
          </p>
          <div className="mt-3.5 flex flex-wrap gap-2">
            {guide.living.cities.map((option) => (
              <button
                key={option.slug}
                type="button"
                onClick={() => {
                  setCitySlug(option.slug);
                  setExcluded(
                    option.lines.filter((line) => line.optional).map((line) => line.id),
                  );
                }}
                aria-pressed={option.slug === citySlug}
                className={cn(
                  "button",
                  option.slug === citySlug
                    ? "button--selected"
                    : "button--light",
                )}
              >
                {option.name}
              </button>
            ))}
          </div>
          <p className="mt-3.5 text-[0.875rem] leading-relaxed text-grey">{city.note}</p>
        </fieldset>

        <fieldset className="mt-7">
          <legend className="text-[0.8125rem] font-semibold text-blue-dark">
            Starting point
          </legend>
          <div className="mt-3 flex flex-wrap gap-2">
            {levels.map((option) => (
              <button
                key={option.key}
                type="button"
                onClick={() => {
                  setLevel(option.key);
                  setOverrides({});
                }}
                aria-pressed={option.key === level}
                className={cn(
                  "button",
                  option.key === level
                    ? "button--selected"
                    : "button--light",
                )}
              >
                {option.label}
              </button>
            ))}
          </div>
          <p className="mt-3 text-[0.875rem] leading-relaxed text-grey">
            {levels.find((option) => option.key === level)!.note}
          </p>
        </fieldset>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[38rem] border-collapse text-left">
          <caption className="sr-only">
            Monthly cost of living in {city.name}, by line item, with the published range
            and your own figure for each.
          </caption>
          <thead>
            <tr className="border-b border-line bg-light">
              <th scope="col" className="px-6 py-3 text-[0.75rem] font-semibold text-blue-dark">
                Line item
              </th>
              <th scope="col" className="px-6 py-3 text-[0.75rem] font-semibold text-blue-dark">
                Our published range
              </th>
              <th scope="col" className="px-6 py-3 text-right text-[0.75rem] font-semibold text-blue-dark">
                Your figure, per month
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {rows.map((row) => (
              <tr key={row.id} className={cn(!row.included && "opacity-50")}>
                <th scope="row" className="px-6 py-4 align-top">
                  <span className="flex items-start gap-2.5">
                    {row.optional ? (
                      <input
                        type="checkbox"
                        checked={row.included}
                        onChange={(event) =>
                          setExcluded((current) =>
                            event.target.checked
                              ? current.filter((id) => id !== row.id)
                              : [...current, row.id],
                          )
                        }
                        aria-label={`Include ${row.label}`}
                        className="mt-1 h-4 w-4 shrink-0 accent-[var(--color-blue-dark)]"
                      />
                    ) : null}
                    <span>
                      <span className="block text-[0.9375rem] font-medium text-blue-dark">
                        {row.label}
                      </span>
                      {row.note && (
                        <span className="mt-1 block max-w-sm text-[0.8125rem] leading-snug text-grey">
                          {row.note}
                        </span>
                      )}
                      {row.optional && (
                        <span className="mt-1 block text-[0.75rem] text-grey">
                          Optional line. Switch it off if it does not apply to you.
                        </span>
                      )}
                    </span>
                  </span>
                </th>
                <td className="figures whitespace-nowrap px-6 py-4 align-top text-[0.875rem] text-grey">
                  {row.low === row.high
                    ? `${symbol}${row.low}`
                    : `${symbol}${row.low} to ${symbol}${row.high}`}
                </td>
                <td className="px-6 py-4 align-top text-right">
                  <label className="inline-flex items-center gap-1.5">
                    <span className="sr-only">{row.label}, your figure per month</span>
                    <span aria-hidden className="text-[0.9375rem] text-grey">
                      {symbol}
                    </span>
                    <input
                      type="number"
                      min={0}
                      step={5}
                      inputMode="numeric"
                      value={row.value}
                      disabled={!row.included}
                      onChange={(event) =>
                        setOverrides((current) => ({
                          ...current,
                          [row.key]: Math.max(0, Number(event.target.value) || 0),
                        }))
                      }
                      className="figures w-24 rounded-card border border-line-strong px-2.5 py-1.5 text-right text-[0.9375rem] text-blue-dark disabled:bg-light"
                    />
                  </label>
                  {row.overridden && (
                    <span className="mt-1 block text-[0.75rem] text-pink">
                      Your figure, not ours
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot className="border-t-2 border-line-strong">
            <tr>
              <th scope="row" className="px-6 py-5 text-[0.9375rem] font-semibold text-blue-dark">
                Per month
              </th>
              <td />
              <td className="figures px-6 py-5 text-right text-[1.25rem] font-bold text-blue-dark">
                {symbol}
                {monthly.toLocaleString("en-IN")}
              </td>
            </tr>
            <tr className="border-t border-line">
              <th scope="row" className="px-6 py-5 text-[0.9375rem] font-semibold text-blue-dark">
                Per year, twelve months
                <span className="mt-1 block text-[0.8125rem] font-normal text-grey">
                  Tuition is not included. It is a separate figure on the guide page.
                </span>
              </th>
              <td />
              <td className="px-6 py-5 text-right">
                <span className="figures block text-[1.25rem] font-bold text-blue-dark">
                  {symbol}
                  {(monthly * 12).toLocaleString("en-IN")}
                </span>
                <span className="figures mt-1 block text-[0.875rem] text-grey">
                  about ₹
                  {Math.round(
                    (monthly * 12 * rate.inrPerUnit) / 1000,
                  ).toLocaleString("en-IN")}
                  ,000
                </span>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      <div className="border-t border-line p-6 md:p-7">
        <h3 className="text-blue-dark h--6">
          Add tuition and funds to see the first year whole
        </h3>
        <p className="mt-1 text-[0.8125rem] leading-relaxed text-grey">
          Living cost carries over from above. Tuition is your own figure, not ours: it
          depends on the exact programme, which is a separate, sourced number on the
          university and course pages, not something this tool can look up for you.
        </p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="text-[0.8125rem] font-medium text-blue-dark">
              Annual tuition, in rupees
            </span>
            <span className="mt-1.5 flex items-center gap-1.5">
              <span aria-hidden className="text-[0.9375rem] text-grey">
                ₹
              </span>
              <input
                type="number"
                min={0}
                step={1000}
                inputMode="numeric"
                value={tuitionInr || ""}
                onChange={(event) => setTuitionInr(Math.max(0, Number(event.target.value) || 0))}
                placeholder="From the course page"
                className="figures w-full rounded-card border border-line-strong px-2.5 py-1.5 text-[0.9375rem] text-blue-dark"
              />
            </span>
          </label>
          <label className="block">
            <span className="text-[0.8125rem] font-medium text-blue-dark">
              Funds you can show, in rupees
            </span>
            <span className="mt-1.5 flex items-center gap-1.5">
              <span aria-hidden className="text-[0.9375rem] text-grey">
                ₹
              </span>
              <input
                type="number"
                min={0}
                step={1000}
                inputMode="numeric"
                value={fundsInr || ""}
                onChange={(event) => setFundsInr(Math.max(0, Number(event.target.value) || 0))}
                placeholder="Savings, loan sanction, sponsor"
                className="figures w-full rounded-card border border-line-strong px-2.5 py-1.5 text-[0.9375rem] text-blue-dark"
              />
            </span>
          </label>
        </div>
        <p className="figures mt-4 text-[0.9375rem] text-blue-dark">
          First year, living plus tuition: <span className="font-bold">₹{firstYearInr.toLocaleString("en-IN")}</span>
          {" "}(₹{livingInr.toLocaleString("en-IN")} living + ₹{tuitionInr.toLocaleString("en-IN")} tuition).
        </p>
        {fundsInr > 0 && (
          <p className={cn("figures mt-1.5 text-[0.9375rem] font-medium", gapInr > 0 ? "text-denied" : "text-verified")}>
            {gapInr > 0
              ? `Shortfall of ₹${gapInr.toLocaleString("en-IN")} against the funds shown so far.`
              : `Covered, with ₹${surplusInr.toLocaleString("en-IN")} to spare against this estimate.`}
          </p>
        )}
        <p className="mt-2 text-[0.8125rem] text-grey">
          This is not the visa authority&rsquo;s blocked-account or funds requirement, which is a
          separate, stricter figure on the destination guide. Scholarships for{" "}
          <a href={`/scholarships?destination=${guide.slug}`} className="text-pink underline">
            {guide.country}
          </a>{" "}
          are not included here either.
        </p>
      </div>

      <div className="flex flex-col gap-4 border-t border-line p-6 md:flex-row md:items-start md:justify-between md:p-7">
        <div className="max-w-2xl space-y-2 text-[0.8125rem] leading-relaxed text-grey">
          <p>
            <span className="font-medium text-grey">What this is.</span>{" "}
            {guide.living.qualifier}
          </p>
          <p>
            <span className="font-medium text-grey">Where the ranges come from.</span>{" "}
            {guide.living.source}. Written into this page on{" "}
            <span className="figures">{guide.verification.statedOn}</span> and not since
            re-checked by a named person.
          </p>
          <p>
            <span className="font-medium text-grey">The rupee figure is indicative.</span>{" "}
            Converted at ₹{rate.inrPerUnit} to the {guide.currency === "EUR" ? "euro" : "pound"},
            a rate recorded by hand on{" "}
            <span className="figures">{rate.takenOn}</span>. No exchange rate service is
            connected to this site, so the rupee column moves only when someone edits it.
          </p>
        </div>
        <Button variant="outline" onClick={reset} className="shrink-0">
          <ArrowCounterClockwise size={15} weight="bold" aria-hidden />
          Reset to our figures
        </Button>
      </div>
    </div>
  );
}
