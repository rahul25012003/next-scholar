"use client";

import { useState } from "react";
import { ieltsDescriptorFor, ieltsDescriptors, ieltsOverall } from "@/domain/calculators";
import { InputError, ResultPanel } from "@/components/tools/working";
import { cn } from "@/lib/cn";

const sections = [
  { key: "listening", label: "Listening" },
  { key: "reading", label: "Reading" },
  { key: "writing", label: "Writing" },
  { key: "speaking", label: "Speaking" },
] as const;

/** Every valid score, so the input cannot produce an impossible band. */
const options = Array.from({ length: 19 }, (_, index) => index * 0.5);

export function IeltsBandCalculator() {
  const [scores, setScores] = useState<Record<string, string>>({
    listening: "",
    reading: "",
    writing: "",
    speaking: "",
  });
  const [minimumPerSection, setMinimumPerSection] = useState("6");

  const complete = sections.every((section) => scores[section.key] !== "");
  const result = complete
    ? ieltsOverall({
        listening: Number(scores.listening),
        reading: Number(scores.reading),
        writing: Number(scores.writing),
        speaking: Number(scores.speaking),
      })
    : null;

  const minimum = Number(minimumPerSection);
  const belowMinimum = complete
    ? sections.filter((section) => Number(scores[section.key]) < minimum)
    : [];

  return (
    <div className="grid gap-8 lg:grid-cols-[22rem_minmax(0,1fr)] lg:items-start lg:gap-10">
      <form
        className="rounded-panel border border-line bg-paper p-6 md:p-7"
        onSubmit={(event) => event.preventDefault()}
      >
        <fieldset>
          <legend className="text-[0.875rem] font-semibold text-navy-900">
            Your four section scores
          </legend>
          <div className="mt-4 space-y-4">
            {sections.map((section) => (
              <label key={section.key} className="block">
                <span className="block text-[0.875rem] font-medium text-navy-900">
                  {section.label}
                </span>
                <select
                  value={scores[section.key]}
                  onChange={(event) =>
                    setScores((current) => ({ ...current, [section.key]: event.target.value }))
                  }
                  className="figures mt-1.5 w-full rounded-input border border-line-strong bg-paper px-3.5 py-2.5 text-[1rem] text-navy-900"
                >
                  <option value="">Not entered</option>
                  {options.map((option) => (
                    <option key={option} value={option}>
                      {option.toFixed(1)}
                    </option>
                  ))}
                </select>
              </label>
            ))}
          </div>
        </fieldset>

        <div className="mt-7 border-t border-line pt-6">
          <label className="block">
            <span className="block text-[0.875rem] font-medium text-navy-900">
              The minimum your university sets per section
            </span>
            <span className="mt-0.5 block text-[0.8125rem] leading-snug text-muted">
              Almost every offer sets one, and it is where a good overall band still fails.
              Enter the one from your offer condition.
            </span>
            <select
              value={minimumPerSection}
              onChange={(event) => setMinimumPerSection(event.target.value)}
              className="figures mt-2 w-full rounded-input border border-line-strong bg-paper px-3.5 py-2.5 text-[1rem] text-navy-900"
            >
              {options
                .filter((option) => option >= 4)
                .map((option) => (
                  <option key={option} value={option}>
                    {option.toFixed(1)} in each section
                  </option>
                ))}
            </select>
          </label>
        </div>

        <p className="mt-6 text-[0.8125rem] leading-relaxed text-muted">
          This calculates the band your four scores produce. It does not predict a band you
          have not sat for, and no tool on this site does.
        </p>
      </form>

      <div className="min-w-0 space-y-8">
        {result === null && (
          <div className="rounded-panel border border-dashed border-line-strong bg-surface p-8 text-center">
            <p className="text-[0.9375rem] leading-relaxed text-body">
              Enter all four section scores and your overall band appears here, with the
              rounding rule applied step by step.
            </p>
            <p className="mt-3 text-[0.875rem] text-muted">Ungated, like every tool here.</p>
          </div>
        )}

        {result && "error" in result && <InputError message={result.error} />}

        {result && !("error" in result) && (
          <>
            <ResultPanel
              conversion={result}
              label="Overall band"
              headline={`${ieltsDescriptorFor(result.value).name}`}
            />

            <div
              className={cn(
                "rounded-panel border p-6",
                belowMinimum.length === 0
                  ? "border-verified/25 bg-verified-bg"
                  : "border-pending/25 bg-pending-bg",
              )}
            >
              <h2
                className={cn(
                  "font-display text-[1.0625rem] font-bold",
                  belowMinimum.length === 0 ? "text-verified" : "text-pending",
                )}
              >
                {belowMinimum.length === 0
                  ? `Every section meets the ${minimum.toFixed(1)} minimum`
                  : `${belowMinimum.length} section${belowMinimum.length === 1 ? "" : "s"} below the ${minimum.toFixed(1)} minimum`}
              </h2>
              <p className="mt-2 text-[0.9375rem] leading-relaxed text-body">
                {belowMinimum.length === 0
                  ? "On these scores the per-section condition is met as well as the overall one. Check the offer for anything else attached to the language condition, such as a required test variant."
                  : `${belowMinimum.map((section) => section.label).join(" and ")} ${belowMinimum.length === 1 ? "is" : "are"} short. An overall band of ${result.display} does not satisfy a per-section condition on its own, and this is the most common reason a language condition is not met by someone who thinks it is.`}
              </p>
            </div>

            <div>
              <h2 className="font-display text-[1.25rem] font-bold text-navy-900">
                The nine bands, as the test provider describes them
              </h2>
              <ol className="mt-4 divide-y divide-line overflow-hidden rounded-panel border border-line bg-paper">
                {ieltsDescriptors.map((descriptor) => {
                  const isYours = descriptor.band === Math.floor(result.value);
                  return (
                    <li
                      key={descriptor.band}
                      className={cn("flex gap-5 px-6 py-4", isYours && "bg-blue-50")}
                    >
                      <span
                        className={cn(
                          "figures w-8 shrink-0 text-[1.0625rem] font-bold",
                          isYours ? "text-blue-600" : "text-navy-900",
                        )}
                      >
                        {descriptor.band}
                      </span>
                      <span>
                        <span
                          className={cn(
                            "block text-[0.9375rem] font-semibold",
                            isYours ? "text-blue-600" : "text-navy-900",
                          )}
                        >
                          {descriptor.name}
                          {isYours && (
                            <span className="ml-2 font-normal text-blue-600">Your band</span>
                          )}
                        </span>
                        <span className="mt-1 block text-[0.875rem] leading-relaxed text-body">
                          {descriptor.description}
                        </span>
                      </span>
                    </li>
                  );
                })}
              </ol>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
