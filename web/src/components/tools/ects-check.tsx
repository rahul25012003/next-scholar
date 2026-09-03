"use client";

import { useState } from "react";
import { CheckCircle, Plus, Trash, WarningCircle } from "@phosphor-icons/react";
import { checkEcts, ECTS_LIMITS } from "@/domain/calculators";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";

/**
 * The ECTS credit check.
 *
 * German Master's admission is largely arithmetic on a transcript, and nothing
 * on this platform represented that until now. The default rows below are the
 * shape an engineering programme's module handbook usually takes, not a
 * specific programme's requirements: those are entered from the handbook,
 * because a general figure is exactly the kind of plausible number that gets
 * someone rejected on a technicality they were told not to worry about.
 */
const defaultAreas = [
  { name: "Core subject modules", required: "60", held: "" },
  { name: "Mathematics", required: "30", held: "" },
  { name: "Named technical prerequisites", required: "20", held: "" },
];

export function EctsCheck() {
  const [totalRequired, setTotalRequired] = useState("180");
  const [totalHeld, setTotalHeld] = useState("");
  const [areas, setAreas] = useState(defaultAreas);

  const started = totalHeld.trim() !== "" || areas.some((area) => area.held.trim() !== "");

  const result = started
    ? checkEcts({
        totalRequired: Number(totalRequired) || 0,
        totalHeld: Number(totalHeld) || 0,
        areas: areas
          .filter((area) => area.name.trim() !== "")
          .map((area) => ({
            name: area.name,
            required: Number(area.required) || 0,
            held: Number(area.held) || 0,
          })),
      })
    : null;

  const update = (index: number, patch: Partial<(typeof defaultAreas)[number]>) =>
    setAreas((current) =>
      current.map((item, i) => (i === index ? { ...item, ...patch } : item)),
    );

  return (
    <div className="grid gap-8 lg:grid-cols-[24rem_minmax(0,1fr)] lg:items-start lg:gap-10">
      <form
        className="rounded-panel border border-line bg-paper p-6 md:p-7"
        onSubmit={(event) => event.preventDefault()}
      >
        <fieldset>
          <legend className="text-[0.875rem] font-semibold text-navy-900">
            Total credits
          </legend>
          <div className="mt-3 grid grid-cols-2 gap-3">
            <label>
              <span className="block text-[0.75rem] text-muted">
                The programme requires
              </span>
              <input
                type="number"
                inputMode="numeric"
                min={0}
                step={1}
                value={totalRequired}
                onChange={(event) => setTotalRequired(event.target.value)}
                className="figures mt-1 w-full rounded-input border border-line-strong px-3 py-2 text-[0.9375rem] text-navy-900"
              />
            </label>
            <label>
              <span className="block text-[0.75rem] text-muted">Your transcript shows</span>
              <input
                type="number"
                inputMode="numeric"
                min={0}
                step={1}
                value={totalHeld}
                onChange={(event) => setTotalHeld(event.target.value)}
                className="figures mt-1 w-full rounded-input border border-line-strong px-3 py-2 text-[0.9375rem] text-navy-900"
              />
            </label>
          </div>
          <p className="mt-2.5 text-[0.8125rem] leading-relaxed text-muted">
            A German Bachelor&rsquo;s is 180 ECTS over three years and 240 over four. An Indian
            four year B.E. or B.Tech commonly maps to around 240 once converted, and a
            three year BSc or BCA to around 180.
          </p>
        </fieldset>

        <fieldset className="mt-7 border-t border-line pt-6">
          <legend className="text-[0.875rem] font-semibold text-navy-900">
            Credits by area
          </legend>
          <p className="mt-1 text-[0.8125rem] leading-relaxed text-muted">
            Take the required figures from the programme&rsquo;s module handbook. The rows below
            are the usual shape of an engineering requirement, not any real programme&rsquo;s.
          </p>
          <div className="mt-4 space-y-3">
            {areas.map((area, index) => (
              <div key={index} className="rounded-input border border-line p-3">
                <div className="flex items-end gap-2">
                  <label className="flex-1">
                    <span className="block text-[0.75rem] text-muted">Area</span>
                    <input
                      value={area.name}
                      onChange={(event) => update(index, { name: event.target.value })}
                      className="mt-1 w-full rounded-input border border-line-strong px-3 py-2 text-[0.9375rem] text-navy-900"
                    />
                  </label>
                  <button
                    type="button"
                    onClick={() => setAreas((current) => current.filter((_, i) => i !== index))}
                    disabled={areas.length <= 1}
                    aria-label={`Remove ${area.name || "this area"}`}
                    className="mb-1 grid h-9 w-9 shrink-0 place-items-center rounded-input border border-line text-muted transition-colors hover:border-denied hover:text-denied disabled:opacity-40"
                  >
                    <Trash size={15} aria-hidden />
                  </button>
                </div>
                <div className="mt-2.5 grid grid-cols-2 gap-2">
                  <label>
                    <span className="block text-[0.75rem] text-muted">Required</span>
                    <input
                      type="number"
                      inputMode="numeric"
                      min={0}
                      step={1}
                      value={area.required}
                      onChange={(event) => update(index, { required: event.target.value })}
                      className="figures mt-1 w-full rounded-input border border-line-strong px-3 py-2 text-[0.9375rem] text-navy-900"
                    />
                  </label>
                  <label>
                    <span className="block text-[0.75rem] text-muted">You have</span>
                    <input
                      type="number"
                      inputMode="numeric"
                      min={0}
                      step={1}
                      value={area.held}
                      onChange={(event) => update(index, { held: event.target.value })}
                      className="figures mt-1 w-full rounded-input border border-line-strong px-3 py-2 text-[0.9375rem] text-navy-900"
                    />
                  </label>
                </div>
              </div>
            ))}
          </div>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() =>
              setAreas((current) => [...current, { name: "", required: "0", held: "" }])
            }
          >
            <Plus size={14} weight="bold" aria-hidden />
            Add an area
          </Button>
        </fieldset>
      </form>

      <div className="min-w-0 space-y-8">
        {result === null ? (
          <div className="rounded-panel border border-dashed border-line-strong bg-surface p-8 text-center">
            <p className="text-[0.9375rem] leading-relaxed text-body">
              Enter what your transcript shows and the gap against each requirement appears
              here.
            </p>
            <p className="mt-3 text-[0.875rem] text-muted">
              It reports subtraction, not an admission verdict.
            </p>
          </div>
        ) : (
          <>
            <div className="overflow-hidden rounded-panel border border-line bg-paper">
              <table className="w-full border-collapse text-left">
                <caption className="sr-only">
                  Each stated credit requirement, what your transcript shows, and the gap.
                </caption>
                <thead>
                  <tr className="border-b border-line bg-surface">
                    <th scope="col" className="px-6 py-3 text-[0.75rem] font-semibold text-navy-900">
                      Requirement
                    </th>
                    <th scope="col" className="px-4 py-3 text-right text-[0.75rem] font-semibold text-navy-900">
                      Needs
                    </th>
                    <th scope="col" className="px-4 py-3 text-right text-[0.75rem] font-semibold text-navy-900">
                      You have
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-[0.75rem] font-semibold text-navy-900">
                      Gap
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  <Row
                    name="Total credits"
                    required={Number(totalRequired) || 0}
                    held={Number(totalHeld) || 0}
                    gap={result.totalGap}
                    met={result.meetsTotal}
                  />
                  {result.areas.map((area) => (
                    <Row
                      key={area.name}
                      name={area.name}
                      required={area.required}
                      held={area.held}
                      gap={area.gap}
                      met={area.met}
                    />
                  ))}
                </tbody>
              </table>
              <p className="figures border-t border-line bg-surface px-6 py-4 text-[0.9375rem] font-medium text-navy-900">
                {result.working.result}
              </p>
            </div>

            {result.shortfalls.length > 0 && (
              <div className="rounded-panel border border-pending/25 bg-pending-bg p-6">
                <h2 className="font-display text-[1.0625rem] font-bold text-pending">
                  What to ask the programme office
                </h2>
                <p className="mt-2 text-[0.9375rem] leading-relaxed text-body">
                  A shortfall is frequently fixable and it is a question rather than a
                  verdict. Ask, in writing, whether{" "}
                  {result.shortfalls
                    .map((item) => `${item.gap} credits in ${item.name.toLowerCase()}`)
                    .join(" and ")}{" "}
                  can be made up as conditional modules in the first year. Programmes answer
                  this, and the answer is often yes.
                </p>
              </div>
            )}

            <div className="rounded-panel border border-line bg-surface p-6 md:p-7">
              <h2 className="text-[0.8125rem] font-semibold uppercase tracking-wide text-muted">
                What this does not decide
              </h2>
              <ul className="mt-3 space-y-2">
                {ECTS_LIMITS.map((limit) => (
                  <li key={limit} className="flex gap-2.5 text-[0.875rem] leading-relaxed text-body">
                    <span aria-hidden className="mt-2 h-1 w-1 shrink-0 rounded-full bg-line-strong" />
                    {limit}
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function Row({
  name,
  required,
  held,
  gap,
  met,
}: {
  name: string;
  required: number;
  held: number;
  gap: number;
  met: boolean;
}) {
  return (
    <tr>
      <th scope="row" className="px-6 py-4 text-[0.9375rem] font-medium text-navy-900">
        {name}
      </th>
      <td className="figures px-4 py-4 text-right text-[0.9375rem] text-body">{required}</td>
      <td className="figures px-4 py-4 text-right text-[0.9375rem] text-body">{held}</td>
      <td className="px-6 py-4 text-right">
        <span
          className={cn(
            "inline-flex items-center gap-1.5 rounded-input px-2.5 py-1 text-[0.8125rem] font-medium",
            met ? "bg-verified-bg text-verified" : "bg-pending-bg text-pending",
          )}
        >
          {met ? (
            <CheckCircle size={13} weight="fill" aria-hidden />
          ) : (
            <WarningCircle size={13} weight="fill" aria-hidden />
          )}
          {met ? "Met" : `Short by ${gap}`}
        </span>
      </td>
    </tr>
  );
}
