"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, Trash } from "@phosphor-icons/react";
import {
  cgpaToGpa,
  cgpaToMarks,
  cgpaToPercentage,
  gpaFromSubjects,
  gpaScales,
  gradePointOptions,
  percentageToCgpa,
  percentageToGpa,
  percentageToMarks,
  sgpaToCgpa,
  type Conversion,
  type GpaScale,
} from "@/domain/calculators";
import { Button } from "@/components/ui/button";
import { InputError, NumberField, ResultPanel } from "@/components/tools/working";
import { cn } from "@/lib/cn";

type VariantKey =
  | "cgpa-percentage"
  | "percentage-cgpa"
  | "cgpa-marks"
  | "cgpa-gpa"
  | "percentage-gpa"
  | "percentage-marks"
  | "sgpa-cgpa"
  | "gpa-calculator";

const variants: { key: VariantKey; label: string; note: string }[] = [
  { key: "cgpa-percentage", label: "CGPA to percentage", note: "The one application forms ask for most often." },
  { key: "percentage-cgpa", label: "Percentage to CGPA", note: "The same convention, run backwards." },
  { key: "cgpa-marks", label: "CGPA to marks", note: "Where a form wants marks obtained out of a total." },
  { key: "cgpa-gpa", label: "CGPA to GPA", note: "Onto a 4, 5 or 10 point GPA scale." },
  { key: "percentage-gpa", label: "Percentage to GPA", note: "Onto a 4, 5 or 10 point GPA scale." },
  { key: "percentage-marks", label: "Percentage to marks", note: "Straight arithmetic against a stated total." },
  { key: "sgpa-cgpa", label: "SGPA to CGPA", note: "Credit weighted, which is what your regulation almost certainly specifies." },
  { key: "gpa-calculator", label: "GPA calculator", note: "From individual subjects, their credits and their grades." },
];

export function GradeConverter() {
  const [variant, setVariant] = useState<VariantKey>("cgpa-percentage");

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-[0.8125rem] font-semibold uppercase tracking-wide text-muted">
          Pick the conversion you need
        </h2>
        <div
          role="tablist"
          aria-label="Grade conversions"
          className="mt-3 flex flex-wrap gap-2"
        >
          {variants.map((option) => (
            <button
              key={option.key}
              type="button"
              role="tab"
              aria-selected={option.key === variant}
              onClick={() => setVariant(option.key)}
              className={cn(
                "rounded-full border px-4 py-2 text-[0.875rem] font-medium transition-colors",
                option.key === variant
                  ? "border-blue-600 bg-blue-600 text-white"
                  : "border-line-strong bg-paper text-navy-900 hover:border-blue-600 hover:text-blue-600",
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
        <p className="mt-3 text-[0.875rem] text-muted">
          {variants.find((option) => option.key === variant)!.note}
        </p>
      </div>

      {variant === "cgpa-percentage" && (
        <SingleInput
          label="Your CGPA"
          hint="On the 10 point scale."
          suffix="of 10"
          max={10}
          compute={(value) => cgpaToPercentage(value)}
          resultLabel="Percentage"
        />
      )}

      {variant === "percentage-cgpa" && (
        <SingleInput
          label="Your percentage"
          hint="As printed on your transcript."
          suffix="%"
          max={100}
          compute={(value) => percentageToCgpa(value)}
          resultLabel="CGPA on the 10 point scale"
        />
      )}

      {variant === "cgpa-marks" && (
        <TwoInputs
          first={{ label: "Your CGPA", hint: "On the 10 point scale.", suffix: "of 10", max: 10 }}
          second={{ label: "Total marks", hint: "What the whole course was out of.", suffix: "marks", initial: "800" }}
          compute={(a, b) => cgpaToMarks(a, b)}
          resultLabel="Marks obtained"
        />
      )}

      {variant === "cgpa-gpa" && (
        <ScaledInput
          label="Your CGPA"
          hint="On the 10 point scale."
          suffix="of 10"
          max={10}
          compute={(value, scale) => cgpaToGpa(value, scale)}
          resultLabel="GPA"
        />
      )}

      {variant === "percentage-gpa" && (
        <ScaledInput
          label="Your percentage"
          hint="As printed on your transcript."
          suffix="%"
          max={100}
          compute={(value, scale) => percentageToGpa(value, scale)}
          resultLabel="GPA"
        />
      )}

      {variant === "percentage-marks" && (
        <TwoInputs
          first={{ label: "Your percentage", hint: "As printed on your transcript.", suffix: "%", max: 100 }}
          second={{ label: "Total marks", hint: "What the whole course was out of.", suffix: "marks", initial: "800" }}
          compute={(a, b) => percentageToMarks(a, b)}
          resultLabel="Marks obtained"
        />
      )}

      {variant === "sgpa-cgpa" && <SgpaToCgpa />}
      {variant === "gpa-calculator" && <GpaCalculator />}

      <p className="rounded-card border border-line bg-surface px-5 py-4 text-[0.875rem] leading-relaxed text-body">
        <span className="font-medium text-navy-900">Applying to Germany?</span> None of these
        is the conversion a German university runs. That one is the{" "}
        <Link
          href="/tools/german-grade-calculator"
          className="font-medium text-blue-600 hover:text-blue-500"
        >
          Modified Bavarian Formula
        </Link>
        , and it produces a grade on the 1.0 to 4.0 scale rather than a percentage.
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * The input shapes. Four of the seven conversions are one number in,
 * one number out, so they share a component rather than four copies.
 * ------------------------------------------------------------------ */

function Shell({
  form,
  result,
  resultLabel,
}: {
  form: React.ReactNode;
  result: Conversion | { error: string } | null;
  resultLabel: string;
}) {
  return (
    <div className="grid gap-8 lg:grid-cols-[22rem_minmax(0,1fr)] lg:items-start lg:gap-10">
      <form
        className="rounded-panel border border-line bg-paper p-6 md:p-7"
        onSubmit={(event) => event.preventDefault()}
      >
        {form}
      </form>
      <div className="min-w-0">
        {result === null ? (
          <div className="rounded-panel border border-dashed border-line-strong bg-surface p-8 text-center">
            <p className="text-[0.9375rem] leading-relaxed text-body">
              Enter your figure and the result appears here with its full working.
            </p>
            <p className="mt-3 text-[0.875rem] text-muted">No signup. No email. Ever.</p>
          </div>
        ) : "error" in result ? (
          <InputError message={result.error} />
        ) : (
          <ResultPanel conversion={result} label={resultLabel} />
        )}
      </div>
    </div>
  );
}

function SingleInput({
  label,
  hint,
  suffix,
  max,
  compute,
  resultLabel,
}: {
  label: string;
  hint: string;
  suffix: string;
  max: number;
  compute: (value: number) => Conversion | { error: string };
  resultLabel: string;
}) {
  const [value, setValue] = useState("");
  return (
    <Shell
      resultLabel={resultLabel}
      result={value.trim() === "" ? null : compute(Number(value))}
      form={
        <NumberField
          label={label}
          hint={hint}
          suffix={suffix}
          value={value}
          onChange={setValue}
          min={0}
          max={max}
        />
      }
    />
  );
}

function TwoInputs({
  first,
  second,
  compute,
  resultLabel,
}: {
  first: { label: string; hint: string; suffix: string; max?: number };
  second: { label: string; hint: string; suffix: string; initial: string };
  compute: (a: number, b: number) => Conversion | { error: string };
  resultLabel: string;
}) {
  const [a, setA] = useState("");
  const [b, setB] = useState(second.initial);
  return (
    <Shell
      resultLabel={resultLabel}
      result={a.trim() === "" ? null : compute(Number(a), Number(b))}
      form={
        <div className="space-y-5">
          <NumberField
            label={first.label}
            hint={first.hint}
            suffix={first.suffix}
            value={a}
            onChange={setA}
            min={0}
            max={first.max}
          />
          <NumberField
            label={second.label}
            hint={second.hint}
            suffix={second.suffix}
            value={b}
            onChange={setB}
            min={1}
            step={1}
          />
        </div>
      }
    />
  );
}

function ScaledInput({
  label,
  hint,
  suffix,
  max,
  compute,
  resultLabel,
}: {
  label: string;
  hint: string;
  suffix: string;
  max: number;
  compute: (value: number, scale: GpaScale) => Conversion | { error: string };
  resultLabel: string;
}) {
  const [value, setValue] = useState("");
  const [scale, setScale] = useState<GpaScale>(4);
  return (
    <Shell
      resultLabel={`${resultLabel} on a ${scale} point scale`}
      result={value.trim() === "" ? null : compute(Number(value), scale)}
      form={
        <div className="space-y-6">
          <NumberField
            label={label}
            hint={hint}
            suffix={suffix}
            value={value}
            onChange={setValue}
            min={0}
            max={max}
          />
          <fieldset>
            <legend className="text-[0.875rem] font-medium text-navy-900">
              Which GPA scale does the form ask for?
            </legend>
            <div className="mt-2.5 flex flex-wrap gap-2">
              {gpaScales.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setScale(option)}
                  aria-pressed={option === scale}
                  className={cn(
                    "figures rounded-full border px-4 py-2 text-[0.875rem] font-medium transition-colors",
                    option === scale
                      ? "border-navy-900 bg-navy-900 text-white"
                      : "border-line-strong bg-paper text-navy-900 hover:border-navy-900",
                  )}
                >
                  {option}.0
                </button>
              ))}
            </div>
            <p className="mt-2.5 text-[0.8125rem] leading-relaxed text-muted">
              If the form does not say, 4.0 is the usual assumption in North America and
              10.0 is the usual one in India.
            </p>
          </fieldset>
        </div>
      }
    />
  );
}

function SgpaToCgpa() {
  const [rows, setRows] = useState([
    { sgpa: "", credits: "" },
    { sgpa: "", credits: "" },
  ]);

  const filled = rows.filter((row) => row.sgpa.trim() !== "");
  const result =
    filled.length === 0
      ? null
      : sgpaToCgpa(
          filled.map((row) => ({
            sgpa: Number(row.sgpa),
            credits: row.credits.trim() === "" ? undefined : Number(row.credits),
          })),
        );

  return (
    <Shell
      resultLabel="CGPA"
      result={result}
      form={
        <div>
          <p className="text-[0.875rem] font-medium text-navy-900">Each semester</p>
          <p className="mt-1 text-[0.8125rem] leading-relaxed text-muted">
            Credits are optional and they change the answer. Leave them blank and you get
            the unweighted mean, which is wrong whenever your semesters carried different
            loads. Fill them in and you get the figure your regulation actually specifies.
          </p>
          <div className="mt-4 space-y-3">
            {rows.map((row, index) => (
              <div key={index} className="flex items-end gap-2">
                <label className="flex-1">
                  <span className="block text-[0.75rem] text-muted">
                    Semester {index + 1} SGPA
                  </span>
                  <input
                    type="number"
                    inputMode="decimal"
                    min={0}
                    max={10}
                    step={0.01}
                    value={row.sgpa}
                    onChange={(event) =>
                      setRows((current) =>
                        current.map((item, i) =>
                          i === index ? { ...item, sgpa: event.target.value } : item,
                        ),
                      )
                    }
                    className="figures mt-1 w-full rounded-input border border-line-strong px-3 py-2 text-[0.9375rem] text-navy-900"
                  />
                </label>
                <label className="w-24">
                  <span className="block text-[0.75rem] text-muted">Credits</span>
                  <input
                    type="number"
                    inputMode="numeric"
                    min={0}
                    step={1}
                    value={row.credits}
                    onChange={(event) =>
                      setRows((current) =>
                        current.map((item, i) =>
                          i === index ? { ...item, credits: event.target.value } : item,
                        ),
                      )
                    }
                    className="figures mt-1 w-full rounded-input border border-line-strong px-3 py-2 text-[0.9375rem] text-navy-900"
                  />
                </label>
                <button
                  type="button"
                  onClick={() => setRows((current) => current.filter((_, i) => i !== index))}
                  disabled={rows.length <= 1}
                  aria-label={`Remove semester ${index + 1}`}
                  className="mb-1 grid h-9 w-9 shrink-0 place-items-center rounded-input border border-line text-muted transition-colors hover:border-denied hover:text-denied disabled:opacity-40"
                >
                  <Trash size={15} aria-hidden />
                </button>
              </div>
            ))}
          </div>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => setRows((current) => [...current, { sgpa: "", credits: "" }])}
          >
            <Plus size={14} weight="bold" aria-hidden />
            Add a semester
          </Button>
        </div>
      }
    />
  );
}

function GpaCalculator() {
  const [rows, setRows] = useState([
    { name: "", credits: "4", points: "9" },
    { name: "", credits: "3", points: "8" },
  ]);

  const usable = rows.filter((row) => row.credits.trim() !== "" && Number(row.credits) > 0);
  const result =
    usable.length === 0
      ? null
      : gpaFromSubjects(
          usable.map((row) => ({
            name: row.name,
            credits: Number(row.credits),
            points: Number(row.points),
          })),
        );

  return (
    <Shell
      resultLabel="Grade point average"
      result={result}
      form={
        <div>
          <p className="text-[0.875rem] font-medium text-navy-900">Each subject</p>
          <p className="mt-1 text-[0.8125rem] leading-relaxed text-muted">
            The grade points below are the common Indian 10 point mapping. Check the letter
            to point table in your own regulation, because they do differ.
          </p>
          <div className="mt-4 space-y-3">
            {rows.map((row, index) => (
              <div key={index} className="rounded-input border border-line p-3">
                <div className="flex items-end gap-2">
                  <label className="flex-1">
                    <span className="block text-[0.75rem] text-muted">
                      Subject <span className="text-muted">optional</span>
                    </span>
                    <input
                      value={row.name}
                      onChange={(event) =>
                        setRows((current) =>
                          current.map((item, i) =>
                            i === index ? { ...item, name: event.target.value } : item,
                          ),
                        )
                      }
                      className="mt-1 w-full rounded-input border border-line-strong px-3 py-2 text-[0.9375rem] text-navy-900"
                    />
                  </label>
                  <button
                    type="button"
                    onClick={() => setRows((current) => current.filter((_, i) => i !== index))}
                    disabled={rows.length <= 1}
                    aria-label={`Remove subject ${index + 1}`}
                    className="mb-1 grid h-9 w-9 shrink-0 place-items-center rounded-input border border-line text-muted transition-colors hover:border-denied hover:text-denied disabled:opacity-40"
                  >
                    <Trash size={15} aria-hidden />
                  </button>
                </div>
                <div className="mt-2.5 flex gap-2">
                  <label className="w-24">
                    <span className="block text-[0.75rem] text-muted">Credits</span>
                    <input
                      type="number"
                      inputMode="numeric"
                      min={0}
                      step={0.5}
                      value={row.credits}
                      onChange={(event) =>
                        setRows((current) =>
                          current.map((item, i) =>
                            i === index ? { ...item, credits: event.target.value } : item,
                          ),
                        )
                      }
                      className="figures mt-1 w-full rounded-input border border-line-strong px-3 py-2 text-[0.9375rem] text-navy-900"
                    />
                  </label>
                  <label className="flex-1">
                    <span className="block text-[0.75rem] text-muted">Grade</span>
                    <select
                      value={row.points}
                      onChange={(event) =>
                        setRows((current) =>
                          current.map((item, i) =>
                            i === index ? { ...item, points: event.target.value } : item,
                          ),
                        )
                      }
                      className="mt-1 w-full rounded-input border border-line-strong bg-paper px-3 py-2 text-[0.9375rem] text-navy-900"
                    >
                      {gradePointOptions.map((option) => (
                        <option key={option.letter} value={option.points}>
                          {option.letter} — {option.points} points
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
              </div>
            ))}
          </div>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() =>
              setRows((current) => [...current, { name: "", credits: "3", points: "8" }])
            }
          >
            <Plus size={14} weight="bold" aria-hidden />
            Add a subject
          </Button>
        </div>
      }
    />
  );
}
