"use client";

import { useState } from "react";
import { Check, Copy, WarningCircle } from "@phosphor-icons/react";
import type { Conversion, Working } from "@/domain/calculators";
import { Button } from "@/components/ui/button";

/**
 * A result, and the arithmetic that produced it.
 *
 * The working is not an appendix. It is the reason we can publish a conversion
 * at all: nobody has to take our number on trust, because the substituted
 * formula and every intermediate step are on the page next to it. A calculator
 * that shows only its answer is asking to be believed, and this platform is
 * built on not asking that.
 */
export function ResultPanel({
  conversion,
  label,
  headline,
}: {
  conversion: Conversion;
  label: string;
  /** Optional line under the figure, such as the German band name. */
  headline?: string;
}) {
  return (
    <div className="overflow-hidden rounded-panel border border-line bg-white">
      <div className="flex flex-wrap items-end justify-between gap-6 border-b border-line bg-light p-6 md:p-7">
        <div>
          <p className="eyebrow text-grey">
            {label}
          </p>
          <p className="figures mt-2 text-[2.5rem] font-bold leading-none text-blue-dark">
            {conversion.display}
          </p>
          {headline && (
            <p className="mt-2 text-[0.9375rem] font-medium text-pink">{headline}</p>
          )}
        </div>
        <CopyWorking working={conversion.working} />
      </div>

      {conversion.clamped && (
        <p className="flex items-start gap-2.5 border-b border-line bg-pending-bg px-6 py-4 text-[0.875rem] leading-relaxed text-pending md:px-7">
          <WarningCircle size={17} weight="fill" aria-hidden className="mt-0.5 shrink-0" />
          {conversion.clamped}
        </p>
      )}

      <div className="p-6 md:p-7">
        <h3 className="eyebrow text-grey">
          The arithmetic, on your numbers
        </h3>
        <dl className="mt-4 space-y-3">
          <div>
            <dt className="text-[0.8125rem] text-grey">The formula</dt>
            <dd className="figures mt-1 text-[0.9375rem] text-blue-dark">
              {conversion.working.formula}
            </dd>
          </div>
          <div>
            <dt className="text-[0.8125rem] text-grey">With your figures in it</dt>
            <dd className="figures mt-1 text-[0.9375rem] font-medium text-blue-dark">
              {conversion.working.substituted}
            </dd>
          </div>
        </dl>

        <ol className="mt-5 space-y-2 border-t border-line pt-5">
          {conversion.working.steps.map((step, index) => (
            <li key={index} className="flex gap-3">
              <span
                aria-hidden
                className="figures mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-light text-[0.6875rem] font-semibold text-neutral-chip"
              >
                {index + 1}
              </span>
              <span className="figures text-[0.9375rem] leading-relaxed text-grey">{step}</span>
            </li>
          ))}
        </ol>

        <p className="figures mt-5 rounded-card bg-light px-5 py-4 text-[0.9375rem] font-medium text-blue-dark">
          {conversion.working.result}
        </p>
      </div>

      <div className="border-t border-line bg-light p-6 md:p-7">
        <p className="text-[0.875rem] leading-relaxed text-grey">
          <span className="font-semibold text-blue-dark">Source.</span> {conversion.source}
        </p>
        <h3 className="mt-5 eyebrow text-grey">
          What this does not decide
        </h3>
        <ul className="mt-3 space-y-2">
          {conversion.limits.map((limit) => (
            <li
              key={limit}
              className="flex gap-2.5 text-[0.875rem] leading-relaxed text-grey"
            >
              <span aria-hidden className="mt-2 h-1 w-1 shrink-0 rounded-full bg-line-strong" />
              {limit}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/** Copies the working, not the answer, because the working is the useful part. */
function CopyWorking({ working }: { working: Working }) {
  const [copied, setCopied] = useState(false);

  const text = [
    working.formula,
    working.substituted,
    ...working.steps.map((step, index) => `${index + 1}. ${step}`),
    working.result,
    "",
    "Calculated at Next Scholar. The institution's own conversion is the one that counts.",
  ].join("\n");

  return (
    <Button
      variant="outline"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        } catch {
          // A blocked clipboard is not an error worth interrupting anyone over.
          // The working is on screen and can be read or screenshotted.
          setCopied(false);
        }
      }}
    >
      {copied ? (
        <Check size={15} weight="bold" aria-hidden />
      ) : (
        <Copy size={15} weight="bold" aria-hidden />
      )}
      {copied ? "Copied" : "Copy the working"}
    </Button>
  );
}

/** The shared error line, so every calculator refuses input the same way. */
export function InputError({ message }: { message: string }) {
  return (
    <p
      role="status"
      className="flex items-start gap-2.5 rounded-card border border-pending/25 bg-pending-bg px-5 py-4 text-[0.875rem] leading-relaxed text-pending"
    >
      <WarningCircle size={17} weight="fill" aria-hidden className="mt-0.5 shrink-0" />
      {message}
    </p>
  );
}

/** The label and number input pattern every calculator on the site uses. */
export function NumberField({
  label,
  hint,
  value,
  onChange,
  min,
  max,
  step = 0.01,
  suffix,
}: {
  label: string;
  hint?: string;
  value: string;
  onChange: (next: string) => void;
  min?: number;
  max?: number;
  step?: number;
  suffix?: string;
}) {
  return (
    <label className="block">
      <span className="block text-[0.875rem] font-medium text-blue-dark">{label}</span>
      {hint && <span className="mt-0.5 block text-[0.8125rem] leading-snug text-grey">{hint}</span>}
      <span className="mt-2 flex items-center gap-2">
        <input
          type="number"
          inputMode="decimal"
          value={value}
          min={min}
          max={max}
          step={step}
          onChange={(event) => onChange(event.target.value)}
          className="figures w-full rounded-card border border-line-strong bg-white px-3.5 py-2.5 text-blue-dark placeholder:text-grey"
        />
        {suffix && <span className="shrink-0 text-[0.875rem] text-grey">{suffix}</span>}
      </span>
    </label>
  );
}
