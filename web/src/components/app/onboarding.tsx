"use client";

import { useActionState, useState } from "react";
import { ArrowLeft, ArrowRight, CheckCircle, WarningCircle } from "@phosphor-icons/react";
import { guides } from "@/content/guides";
import { onboardingSteps, type OnboardingProfile } from "@/domain/onboarding";
import { saveOnboardingProfile, type OnboardingResult } from "@/app/actions/onboarding";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";

const field =
  "w-full rounded-input border border-line-strong bg-white px-3.5 py-2.5 text-[0.9375rem] text-blue-dark placeholder:text-grey/70 focus:border-pink focus:outline-none focus:ring-2 focus:ring-pink/25";

/**
 * The onboarding form.
 *
 * Progressive on purpose, and in a specific order: country first, which is a
 * choice rather than a disclosure, then the academic record, then money. The
 * long single form it replaces asked for a phone number in its second field.
 *
 * Every step is skippable and nothing is required. An unanswered field produces
 * a "needs checking" row on the checklist that follows, which is a true
 * statement, and that is a better outcome than a required field answered with a
 * guess. Only Master's admissions are handled, so that is recorded rather than
 * asked.
 */
export function OnboardingForm({ profile }: { profile: OnboardingProfile }) {
  const [state, formAction, pending] = useActionState<OnboardingResult, FormData>(
    saveOnboardingProfile,
    { status: "idle" },
  );
  const [step, setStep] = useState(0);
  const [destination, setDestination] = useState(profile.destination ?? "");
  const [scale, setScale] = useState<"cgpa" | "percentage">(profile.percentage === null ? "cgpa" : "percentage");

  const guide = guides.find((item) => item.slug === destination);
  const current = onboardingSteps[step];

  return (
    <form action={formAction} className="rounded-panel border border-line bg-white">
      <div className="border-b border-line px-6 py-5">
        <ol className="flex flex-wrap gap-x-6 gap-y-2">
          {onboardingSteps.map((item, index) => (
            <li key={item.id} className="flex items-center gap-2">
              <span
                aria-hidden
                className={cn(
                  "figures grid h-6 w-6 place-items-center rounded-full text-[0.75rem] font-semibold",
                  index === step
                    ? "bg-blue-dark text-white"
                    : index < step
                      ? "bg-verified-bg text-verified"
                      : "bg-light text-grey",
                )}
              >
                {index + 1}
              </span>
              <button
                type="button"
                onClick={() => setStep(index)}
                className={cn(
                  "text-[0.875rem] font-medium transition-colors",
                  index === step ? "text-blue-dark" : "text-grey hover:text-blue-dark",
                )}
              >
                {item.title}
              </button>
            </li>
          ))}
        </ol>
        <p className="mt-3 text-[0.8125rem] leading-relaxed text-grey">{current.blurb}</p>
      </div>

      {/* Every step's inputs stay mounted, so moving between steps never
          discards an answer and one submit carries the lot. */}
      <div className="px-6 py-6">
        <fieldset hidden={step !== 0} className="grid gap-6">
          <legend className="sr-only">Where you want to go</legend>

          <div className="grid gap-2">
            <span className="text-[0.875rem] font-medium text-blue-dark">Destination</span>
            <div className="flex flex-wrap gap-2">
              {guides.map((option) => (
                <label
                  key={option.slug}
                  className={cn(
                    "button cursor-pointer",
                    destination === option.slug
                      ? "button--selected"
                      : "button--light",
                  )}
                >
                  <input
                    type="radio"
                    name="destination"
                    value={option.slug}
                    checked={destination === option.slug}
                    onChange={(event) => setDestination(event.target.value)}
                    className="sr-only"
                  />
                  {option.country}
                </label>
              ))}
            </div>
            <p className="text-[0.8125rem] leading-relaxed text-grey">
              Not sure yet is a fine answer: read the guides first and come back. Nothing
              here is required, and leaving it blank holds nothing back.
            </p>
          </div>

          {guide && guide.routes.length > 1 && (
            <div className="grid gap-2">
              <label htmlFor="route" className="text-[0.875rem] font-medium text-blue-dark">
                Which route
              </label>
              <p className="text-[0.8125rem] leading-relaxed text-grey">
                {guide.country} has routes with different requirements. If you do not know
                yet, leave it.
              </p>
              <select id="route" name="route" defaultValue={profile.route ?? ""} className={field}>
                <option value="">Not decided yet</option>
                {guide.routes.map((route) => (
                  <option key={route.slug} value={route.name}>
                    {route.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          <input type="hidden" name="applyingFor" value="masters" />
          <p className="text-[0.8125rem] leading-relaxed text-grey">
            We help with Master&rsquo;s applications only. We do not handle undergraduate
            admissions.
          </p>

          <div className="grid gap-2">
            <label htmlFor="intake" className="text-[0.875rem] font-medium text-blue-dark">
              Which intake
            </label>
            <select id="intake" name="intake" defaultValue={profile.intake ?? ""} className={field}>
              <option value="">Not decided yet</option>
              {(guide?.intakes ?? []).map((intake) => (
                <option key={intake.name} value={`${intake.name}, teaching starts ${intake.teachingStarts}`}>
                  {intake.name}, teaching starts {intake.teachingStarts}
                </option>
              ))}
            </select>
            {guide && (
              <p className="text-[0.8125rem] leading-relaxed text-grey">
                Shown as dates, because a month name does not tell you when to submit
                anything.
              </p>
            )}
          </div>
        </fieldset>

        <fieldset hidden={step !== 1} className="grid gap-6">
          <legend className="sr-only">Your academic record</legend>

          <div className="grid gap-2">
            <label htmlFor="degree" className="text-[0.875rem] font-medium text-blue-dark">
              Your degree
            </label>
            <input
              id="degree"
              name="degree"
              defaultValue={profile.degree ?? ""}
              placeholder="BE Mechanical Engineering"
              className={field}
            />
          </div>

          <div className="grid gap-2">
            <span className="text-[0.875rem] font-medium text-blue-dark">Bachelor&rsquo;s CGPA</span>
            <div className="flex gap-2">
              <select
                name="scale"
                value={scale}
                onChange={(event) => setScale(event.target.value as typeof scale)}
                aria-label="Result scale"
                className="w-36 shrink-0 rounded-card border border-line-strong bg-white px-3 py-2.5 text-[0.9375rem] text-blue-dark"
              >
                <option value="cgpa">CGPA / 10</option>
                <option value="percentage">Percentage</option>
              </select>
              <input
                id="result"
                name="result"
                defaultValue={profile.percentage ?? ""}
                type="number"
                inputMode="decimal"
                step="0.01"
                min="0"
                max={scale === "cgpa" ? 10 : 100}
                placeholder={scale === "cgpa" ? "8.2" : "76"}
                className={cn(field, "figures")}
              />
            </div>
            <p className="text-[0.8125rem] leading-relaxed text-grey">
              A CGPA is converted with the CBSE 9.5 convention, which is not a standard.
              Once we have your transcript, we use your university&rsquo;s own conversion,
              which is the one that counts.
            </p>
          </div>

          <div className="grid gap-2">
            <label htmlFor="degreeYears" className="text-[0.875rem] font-medium text-blue-dark">
              How long your Bachelor&rsquo;s was
            </label>
            <select
              id="degreeYears"
              name="degreeYears"
              defaultValue={profile.degreeYears ? String(profile.degreeYears) : ""}
              className={field}
            >
              <option value="">Not stated</option>
              <option value="3">Three years</option>
              <option value="4">Four years</option>
            </select>
            {destination === "germany" && (
              <p className="text-[0.8125rem] leading-relaxed text-grey">
                This matters more for Germany than elsewhere, but your credits matter
                more than the years.
              </p>
            )}
          </div>

          <div className="grid gap-2">
            <span className="text-[0.875rem] font-medium text-blue-dark">
              English test, if you have sat one
            </span>
            <div className="flex flex-wrap gap-2">
              <select
                name="testName"
                defaultValue={profile.englishTest?.name ?? ""}
                aria-label="English test"
                className="w-36 shrink-0 rounded-card border border-line-strong bg-white px-3 py-2.5 text-[0.9375rem] text-blue-dark"
              >
                <option value="">Not sat yet</option>
                {["IELTS", "IELTS for UKVI", "TOEFL", "PTE", "Duolingo"].map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </select>
              <input
                name="overall"
                type="number"
                inputMode="decimal"
                step="0.5"
                min="0"
                defaultValue={profile.englishTest?.overall ?? ""}
                placeholder="Overall"
                aria-label="Overall score"
                className={cn(field, "figures w-28")}
              />
              <input
                name="lowestSection"
                type="number"
                inputMode="decimal"
                step="0.5"
                min="0"
                defaultValue={profile.englishTest?.lowestSection ?? ""}
                placeholder="Lowest section"
                aria-label="Lowest section score"
                className={cn(field, "figures w-36")}
              />
            </div>
            <p className="text-[0.8125rem] leading-relaxed text-grey">
              Your lowest section score decides whether you meet a per-section minimum. A
              good overall band can still fall short there.
            </p>
          </div>
        </fieldset>

        <fieldset hidden={step !== 2} className="grid gap-6">
          <legend className="sr-only">Money</legend>

          <div className="grid gap-2">
            <label htmlFor="fundsLakh" className="text-[0.875rem] font-medium text-blue-dark">
              What you can evidence, in lakh
            </label>
            <p className="text-[0.8125rem] leading-relaxed text-grey">
              Savings, family funds you can document, or a sanctioned education loan.
            </p>
            <input
              id="fundsLakh"
              name="fundsLakh"
              type="number"
              inputMode="decimal"
              step="0.5"
              min="0"
              defaultValue={profile.fundsInr ? profile.fundsInr / 100000 : ""}
              placeholder="15"
              className={cn(field, "figures")}
            />
          </div>

          <div className="grid gap-2">
            <label
              htmlFor="fundsHeldMonths"
              className="text-[0.875rem] font-medium text-blue-dark"
            >
              How long it has been in the account, in months
            </label>
            <p className="text-[0.8125rem] leading-relaxed text-grey">
              The UK looks at 28 consecutive days of statements and Ireland at six months.
              This answer most often decides whether a visa application is ready.
            </p>
            <input
              id="fundsHeldMonths"
              name="fundsHeldMonths"
              type="number"
              inputMode="numeric"
              step="1"
              min="0"
              defaultValue={profile.fundsHeldMonths ?? ""}
              placeholder="6"
              className={cn(field, "figures")}
            />
          </div>

          <p className="rounded-card bg-light px-4 py-3.5 text-[0.8125rem] leading-relaxed text-grey">
            This stays on your account, is not shared with any university, and is used only
            to check your answers against published requirements. You can change or clear it
            at any time, and the privacy policy covers the rest.
          </p>
        </fieldset>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 border-t border-line px-6 py-5">
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => setStep((value) => Math.max(0, value - 1))}
            disabled={step === 0}
          >
            <ArrowLeft size={15} weight="bold" aria-hidden />
            Back
          </Button>
          {step < onboardingSteps.length - 1 && (
            <Button type="button" variant="outline" onClick={() => setStep((value) => value + 1)}>
              Next
              <ArrowRight size={15} weight="bold" aria-hidden />
            </Button>
          )}
        </div>

        <div className="flex items-center gap-4">
          {state.status === "saved" && (
            <p className="flex items-center gap-1.5 text-[0.875rem] font-medium text-verified">
              <CheckCircle size={15} weight="fill" aria-hidden />
              Saved
            </p>
          )}
          {state.status === "error" && (
            <p className="flex items-center gap-1.5 text-[0.875rem] text-denied" role="alert">
              <WarningCircle size={15} weight="fill" aria-hidden />
              {state.message}
            </p>
          )}
          <Button type="submit" disabled={pending} aria-busy={pending}>
            {pending ? "Saving" : "Save what I have"}
          </Button>
        </div>
      </div>
    </form>
  );
}
