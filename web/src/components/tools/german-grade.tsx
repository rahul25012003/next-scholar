"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react";
import {
  germanBandFor,
  germanBands,
  gradeScalePresets,
  modifiedBavarian,
} from "@/domain/calculators";
import { InputError, NumberField, ResultPanel } from "@/components/tools/working";
import { cn } from "@/lib/cn";

/**
 * The German grade calculator.
 *
 * Degree and university are captured because a grade means nothing without
 * them, and they are printed back into the result so a student can paste the
 * whole thing into an email to a programme office. They are not sent anywhere:
 * this component makes no network call, there is no form action behind it, and
 * nothing typed here leaves the browser.
 */
export function GermanGradeCalculator() {
  const [preset, setPreset] = useState<string>("cgpa-10");
  const [degree, setDegree] = useState("");
  const [university, setUniversity] = useState("");
  const [obtained, setObtained] = useState("");
  const [max, setMax] = useState("10");
  const [passing, setPassing] = useState("4");

  const active = gradeScalePresets.find((item) => item.key === preset)!;

  const outcome = useMemo(() => {
    if (obtained.trim() === "") return null;
    return modifiedBavarian({
      obtained: Number(obtained),
      max: Number(max),
      passing: Number(passing),
    });
  }, [obtained, max, passing]);

  const applyPreset = (key: string) => {
    const next = gradeScalePresets.find((item) => item.key === key);
    if (!next) return;
    setPreset(key);
    setMax(String(next.max));
    setPassing(String(next.passing));
    setObtained("");
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[22rem_minmax(0,1fr)] lg:gap-10 lg:items-start">
      <form
        className="rounded-panel border border-line bg-white p-6 md:p-7"
        onSubmit={(event) => event.preventDefault()}
      >
        <fieldset>
          <legend className="text-[0.875rem] font-semibold text-blue-dark">
            What does your transcript print?
          </legend>
          <div className="mt-3 space-y-2">
            {gradeScalePresets.map((option) => (
              <button
                key={option.key}
                type="button"
                onClick={() => applyPreset(option.key)}
                aria-pressed={option.key === preset}
                className={cn(
                  "w-full rounded-input border p-3.5 text-left transition-colors",
                  option.key === preset
                    ? "border-blue-dark bg-light"
                    : "border-line hover:border-line-strong",
                )}
              >
                <span className="block text-[0.9375rem] font-medium text-blue-dark">
                  {option.label}
                </span>
                <span className="mt-0.5 block text-[0.8125rem] leading-snug text-grey">
                  {option.note}
                </span>
              </button>
            ))}
          </div>
          <p className="mt-3 text-[0.8125rem] leading-relaxed text-grey">
            Picking a scale prefills the maximum and the pass mark. Both stay editable,
            because your university&rsquo;s regulation is the authority on them and not us.
          </p>
        </fieldset>

        <div className="mt-7 space-y-5 border-t border-line pt-6">
          <NumberField
            label="Your grade"
            hint={`As printed on your transcript, out of ${max}.`}
            value={obtained}
            onChange={setObtained}
            min={0}
            max={Number(max)}
            step={active.step}
          />
          <div className="grid gap-5 sm:grid-cols-2">
            <NumberField
              label="Best possible grade"
              hint="Nmax in the formula."
              value={max}
              onChange={setMax}
              min={0}
              step={active.step}
            />
            <NumberField
              label="Minimum pass grade"
              hint="Nmin in the formula."
              value={passing}
              onChange={setPassing}
              min={0}
              step={active.step}
            />
          </div>
        </div>

        <div className="mt-7 space-y-5 border-t border-line pt-6">
          <label className="block">
            <span className="block text-[0.875rem] font-medium text-blue-dark">
              Your degree <span className="font-normal text-grey">optional</span>
            </span>
            <input
              value={degree}
              onChange={(event) => setDegree(event.target.value)}
              placeholder="B.E. Mechanical Engineering"
              className="mt-2 w-full rounded-card border border-line-strong bg-white px-3.5 py-2.5 text-blue-dark placeholder:text-grey"
            />
          </label>
          <label className="block">
            <span className="block text-[0.875rem] font-medium text-blue-dark">
              Your university <span className="font-normal text-grey">optional</span>
            </span>
            <input
              value={university}
              onChange={(event) => setUniversity(event.target.value)}
              placeholder="Visvesvaraya Technological University"
              className="mt-2 w-full rounded-card border border-line-strong bg-white px-3.5 py-2.5 text-blue-dark placeholder:text-grey"
            />
          </label>
          <p className="text-[0.8125rem] leading-relaxed text-grey">
            These two are printed back into the result so you can paste the whole thing
            into an email to a programme office. Nothing you type here is sent anywhere:
            this calculator runs entirely in your browser and there is no form behind it.
          </p>
        </div>
      </form>

      <div className="min-w-0 space-y-8">
        {outcome === null && (
          <div className="rounded-panel border border-dashed border-line-strong bg-light p-8 text-center">
            <p className="text-[0.9375rem] leading-relaxed text-grey">
              Enter your grade and the result appears here, with the formula, your own
              numbers substituted into it, and every step of the arithmetic.
            </p>
            <p className="mt-3 text-[0.875rem] text-grey">
              No signup, no email, no result held back.
            </p>
          </div>
        )}

        {outcome && "error" in outcome && <InputError message={outcome.error} />}

        {outcome && !("error" in outcome) && (
          <>
            <ResultPanel
              conversion={outcome}
              label="German grade equivalent"
              headline={`${germanBandFor(outcome.value).german} — ${germanBandFor(outcome.value).english}`}
            />

            {(degree || university) && (
              <p className="rounded-card border border-line bg-white px-5 py-4 text-[0.875rem] leading-relaxed text-grey">
                <span className="font-medium text-blue-dark">For the record.</span>{" "}
                {degree || "Degree not stated"}
                {university ? `, ${university}` : ""}: {obtained} out of {max} with a pass
                mark of {passing}, which converts to{" "}
                <span className="figures font-medium text-blue-dark">{outcome.display}</span> on
                the German scale.
              </p>
            )}

            <div>
              <h2 className="text-blue-dark h--5">
                Where your grade sits on the German scale
              </h2>
              <ol className="mt-4 divide-y divide-line overflow-hidden rounded-panel border border-line bg-white">
                {germanBands.map((band) => {
                  const isYours = band.key === germanBandFor(outcome.value).key;
                  return (
                    <li
                      key={band.key}
                      className={cn(
                        "flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 px-6 py-4",
                        isYours && "bg-light",
                      )}
                    >
                      <span>
                        <span
                          className={cn(
                            "text-[0.9375rem] font-semibold",
                            isYours ? "text-pink" : "text-blue-dark",
                          )}
                        >
                          {band.german}
                        </span>
                        <span className="ml-2 text-[0.875rem] text-grey">{band.english}</span>
                      </span>
                      <span className="figures text-[0.875rem] text-grey">
                        {band.range}
                        {isYours && (
                          <span className="ml-3 font-medium text-pink">Your grade</span>
                        )}
                      </span>
                    </li>
                  );
                })}
                <li className="px-6 py-4 text-[0.875rem] leading-relaxed text-grey">
                  Above 4.0 is <span className="italic">nicht ausreichend</span>, a fail, and
                  is not a converted grade at all. If the formula produced one, the pass mark
                  entered is probably not the one your university uses.
                </li>
              </ol>
            </div>

            <Link
              href="/tools/requirements-check?destination=germany"
              className="group flex items-start justify-between gap-5 rounded-card border border-line bg-white p-6 transition-[border-color,box-shadow] hover:border-pink hover:"
            >
              <span>
                <span className="block font-display font-semibold text-blue-dark">
                  Now check the rest of the German requirements
                </span>
                <span className="mt-1 block text-[0.875rem] leading-relaxed text-grey">
                  A grade is one gate. anabin recognition, subject credits, the language
                  level, the blocked account and the dMAT are the others, and the checklist
                  runs your profile against all of them.
                </span>
              </span>
              <ArrowRight
                size={17}
                weight="bold"
                aria-hidden
                className="mt-1 shrink-0 text-grey transition-[color,transform] group-hover:translate-x-0.5 group-hover:text-pink"
              />
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
