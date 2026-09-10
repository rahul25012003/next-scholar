"use client";

import { useActionState, useMemo, useState, useSyncExternalStore } from "react";
import Image from "next/image";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  Copy,
  Info,
  WarningCircle,
} from "@phosphor-icons/react";
import { submitIntake, type IntakeState } from "@/app/actions/intake";
import { intakeQuestions, intakeSteps } from "@/content/consultation";
import { guides } from "@/content/guides";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";

const DRAFT_KEY = "next-scholar.intake-draft";

const fieldBase =
  "w-full rounded-input border bg-paper px-3.5 py-2.5 text-[0.9375rem] text-navy-900 " +
  "placeholder:text-muted/70 transition-colors focus:border-blue-600 focus:outline-none " +
  "focus:ring-2 focus:ring-blue-600/25";

/** The answers live in this browser and nowhere else, so a reload keeps them. */
function subscribeToStorage(onChange: () => void) {
  window.addEventListener("storage", onChange);
  return () => window.removeEventListener("storage", onChange);
}

function readStoredDraft(): string | null {
  try {
    return window.localStorage.getItem(DRAFT_KEY);
  } catch {
    // A blocked or full store is not worth interrupting the form over.
    return null;
  }
}

/**
 * The consultation intake, in three steps.
 *
 * The order is the point. Step one is a choice between three countries, made by
 * clicking a photograph, and it discloses nothing about you. Step two is your
 * academic record. Step three is money. The single long form this replaces
 * opened with a request for your transcript details, which is a lot to ask of
 * someone still deciding whether this site is worth their attention.
 *
 * Every field stays mounted across the steps, so moving back never discards an
 * answer and one submit carries all of them. Nothing is sent anywhere: there is
 * no booking provider connected, and the form says so rather than showing a
 * confirmation screen for a booking that did not happen.
 */
export function IntakeForm() {
  const [state, formAction, pending] = useActionState<IntakeState, FormData>(
    submitIntake,
    { status: "idle" },
  );
  const [edits, setEdits] = useState<Record<string, string> | null>(null);
  const [copied, setCopied] = useState(false);
  const [step, setStep] = useState(0);

  const stored = useSyncExternalStore(subscribeToStorage, readStoredDraft, () => null);

  const restored = useMemo(() => {
    if (!stored) return {};
    try {
      return JSON.parse(stored) as Record<string, string>;
    } catch {
      return {};
    }
  }, [stored]);

  const draft = edits ?? restored;

  const update = (id: string, value: string) => {
    const next = { ...draft, [id]: value };
    setEdits(next);
    try {
      window.localStorage.setItem(DRAFT_KEY, JSON.stringify(next));
    } catch {
      // Same as above. The typed answer still lives in React state.
    }
  };

  const chosen = (draft.destinations ?? "").split(",").filter(Boolean);

  const toggleDestination = (slug: string) => {
    const next = chosen.includes(slug)
      ? chosen.filter((item) => item !== slug)
      : [...chosen, slug];
    update("destinations", next.join(","));
  };

  const copyAnswers = async () => {
    const text = [
      `Destinations of interest\n${chosen.length > 0 ? chosen.join(", ") : "Not decided yet"}`,
      ...intakeQuestions.map(
        (question) => `${question.label}\n${draft[question.id] ?? ""}`,
      ),
    ].join("\n\n");
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopied(false);
    }
  };

  const errors = state.status === "invalid" ? state.errors : {};

  /** Steps carrying an error, so a validation failure is findable. */
  const stepsWithErrors = new Set<number>(
    intakeQuestions
      .filter((question) => errors[question.id])
      .map((question) => question.step),
  );

  return (
    <form action={formAction} className="grid gap-7" noValidate>
      <input type="hidden" name="destinations" value={draft.destinations ?? ""} />

      <ol className="flex flex-wrap gap-x-6 gap-y-2 border-b border-line pb-5">
        {intakeSteps.map((item, index) => (
          <li key={item.id} className="flex items-center gap-2">
            <span
              aria-hidden
              className={cn(
                "figures grid h-6 w-6 place-items-center rounded-full text-[0.75rem] font-semibold",
                index === step
                  ? "bg-blue-600 text-white"
                  : stepsWithErrors.has(index)
                    ? "bg-denied-bg text-denied"
                    : index < step
                      ? "bg-verified-bg text-verified"
                      : "bg-surface-2 text-muted",
              )}
            >
              {index + 1}
            </span>
            <button
              type="button"
              onClick={() => setStep(index)}
              aria-current={index === step ? "step" : undefined}
              className={cn(
                "text-[0.9375rem] font-medium transition-colors",
                index === step ? "text-navy-900" : "text-muted hover:text-navy-900",
              )}
            >
              {item.title}
            </button>
            {stepsWithErrors.has(index) && index !== step && (
              <WarningCircle size={14} weight="fill" aria-hidden className="text-denied" />
            )}
          </li>
        ))}
      </ol>

      <p className="-mt-2 text-[0.875rem] leading-relaxed text-body">
        {intakeSteps[step].blurb}
      </p>

      {/* Step one: a choice, not a disclosure. */}
      <fieldset hidden={step !== 0} className="grid gap-5">
        <legend className="sr-only">Where you are considering</legend>

        <div>
          <span className="text-[0.9375rem] font-medium text-navy-900">
            Which of these are you considering?
          </span>
          <p className="mt-1 text-[0.8125rem] leading-relaxed text-body">
            Pick as many as apply, or none. Every one of them has a full guide on this site
            with the fees, the funding thresholds and what we earn on it, and you are welcome
            to read those instead of filling this in.
          </p>
          <div className="mt-3.5 grid gap-3 sm:grid-cols-3">
            {guides.map((guide) => {
              const active = chosen.includes(guide.slug);
              return (
                <button
                  key={guide.slug}
                  type="button"
                  onClick={() => toggleDestination(guide.slug)}
                  aria-pressed={active}
                  className={cn(
                    "group relative overflow-hidden rounded-card border-2 text-left transition-colors",
                    active ? "border-blue-600" : "border-line hover:border-line-strong",
                  )}
                >
                  <span className="flex items-center gap-3 p-4">
                    <Image
                      src={`https://flagcdn.com/w80/${guide.flagCode}.png`}
                      alt=""
                      width={40}
                      height={30}
                      className="h-5 w-auto shrink-0 rounded-xs ring-1 ring-line"
                    />
                    <span className="min-w-0">
                      <span className="block text-[0.9375rem] font-semibold text-navy-900">
                        {guide.country}
                      </span>
                      <span className="mt-0.5 block text-[0.75rem] leading-snug text-muted">
                        {guide.routes.length > 1
                          ? `${guide.routes.length} routes`
                          : guide.routes[0].name}
                      </span>
                    </span>
                    {active && (
                      <CheckCircle
                        size={18}
                        weight="fill"
                        aria-hidden
                        className="ml-auto shrink-0 text-blue-600"
                      />
                    )}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <Question
          question={intakeQuestions.find((item) => item.id === "targetIntake")!}
          draft={draft}
          errors={errors}
          update={update}
        />
      </fieldset>

      {([1, 2] as const).map((index) => (
        <fieldset key={index} hidden={step !== index} className="grid gap-7">
          <legend className="sr-only">{intakeSteps[index].title}</legend>
          {intakeQuestions
            .filter((question) => question.step === index)
            .map((question) => (
              <Question
                key={question.id}
                question={question}
                draft={draft}
                errors={errors}
                update={update}
              />
            ))}
        </fieldset>
      ))}

      <div className="flex flex-wrap items-center justify-between gap-4 border-t border-line pt-6">
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
          {step < intakeSteps.length - 1 ? (
            <Button type="button" onClick={() => setStep((value) => value + 1)}>
              Next
              <ArrowRight size={15} weight="bold" aria-hidden />
            </Button>
          ) : (
            <Button type="submit" disabled={pending}>
              {pending ? "Checking your answers" : "Check and continue"}
            </Button>
          )}
        </div>

        <Button type="button" variant="outline" onClick={copyAnswers}>
          {copied ? (
            <>
              <CheckCircle size={16} weight="fill" aria-hidden />
              Copied
            </>
          ) : (
            <>
              <Copy size={16} weight="bold" aria-hidden />
              Copy my answers
            </>
          )}
        </Button>
      </div>

      {stepsWithErrors.size > 0 && (
        <p className="text-[0.875rem] font-medium text-denied" role="alert">
          {stepsWithErrors.size === 1
            ? `Step ${[...stepsWithErrors][0] + 1} has an answer that needs fixing.`
            : `Steps ${[...stepsWithErrors].map((index) => index + 1).join(" and ")} have answers that need fixing.`}
        </p>
      )}

      {state.status === "not-live" && (
        <div className="rounded-panel border border-line bg-surface p-6" role="status">
          <div className="flex items-start gap-3">
            <Info size={20} weight="fill" className="mt-0.5 shrink-0 text-blue-600" aria-hidden />
            <div>
              <h3 className="font-display text-[1.0625rem] font-bold text-navy-900">
                Your answers are complete. Nothing was sent.
              </h3>
              <p className="mt-2 text-[0.9375rem] leading-relaxed text-body">{state.message}</p>
              <p className="mt-4 text-[0.875rem] font-medium text-navy-900">
                Still to connect before this form can take a booking
              </p>
              <ul className="mt-2 space-y-1.5">
                {state.missing.map((item) => (
                  <li key={item} className="text-[0.875rem] leading-relaxed text-body">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </form>
  );
}

function Question({
  question,
  draft,
  errors,
  update,
}: {
  question: (typeof intakeQuestions)[number];
  draft: Record<string, string>;
  errors: Record<string, string>;
  update: (id: string, value: string) => void;
}) {
  const error = errors[question.id];
  const describedBy =
    [question.help ? `${question.id}-help` : null, error ? `${question.id}-error` : null]
      .filter(Boolean)
      .join(" ") || undefined;

  return (
    <div className="grid gap-2">
      <label htmlFor={question.id} className="text-[0.9375rem] font-medium text-navy-900">
        {question.label}
      </label>
      {question.help && (
        <p id={`${question.id}-help`} className="text-[0.8125rem] leading-relaxed text-body">
          {question.help}
        </p>
      )}

      {question.type === "textarea" && (
        <textarea
          id={question.id}
          name={question.id}
          rows={3}
          placeholder={question.placeholder}
          value={draft[question.id] ?? ""}
          onChange={(event) => update(question.id, event.target.value)}
          aria-describedby={describedBy}
          aria-invalid={Boolean(error)}
          className={cn(fieldBase, error ? "border-denied" : "border-line-strong")}
        />
      )}

      {question.type === "text" && (
        <input
          id={question.id}
          name={question.id}
          type="text"
          inputMode="text"
          placeholder={question.placeholder}
          value={draft[question.id] ?? ""}
          onChange={(event) => update(question.id, event.target.value)}
          aria-describedby={describedBy}
          aria-invalid={Boolean(error)}
          className={cn(fieldBase, error ? "border-denied" : "border-line-strong")}
        />
      )}

      {question.type === "select" && (
        <select
          id={question.id}
          name={question.id}
          value={draft[question.id] ?? ""}
          onChange={(event) => update(question.id, event.target.value)}
          aria-describedby={describedBy}
          aria-invalid={Boolean(error)}
          className={cn(fieldBase, error ? "border-denied" : "border-line-strong")}
        >
          <option value="">Select one</option>
          {question.options?.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      )}

      {error && (
        <p id={`${question.id}-error`} className="text-[0.8125rem] font-medium text-denied">
          {error}
        </p>
      )}
    </div>
  );
}
