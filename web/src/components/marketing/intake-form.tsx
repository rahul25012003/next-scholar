"use client";

import { useActionState, useMemo, useState, useSyncExternalStore } from "react";
import { CheckCircle, Copy, Info } from "@phosphor-icons/react";
import { submitIntake, type IntakeState } from "@/app/actions/intake";
import { intakeQuestions } from "@/content/consultation";
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

export function IntakeForm() {
  const [state, formAction, pending] = useActionState<IntakeState, FormData>(
    submitIntake,
    { status: "idle" },
  );
  const [edits, setEdits] = useState<Record<string, string> | null>(null);
  const [copied, setCopied] = useState(false);

  const stored = useSyncExternalStore(
    subscribeToStorage,
    readStoredDraft,
    () => null,
  );

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

  const copyAnswers = async () => {
    const text = intakeQuestions
      .map((question) => `${question.label}\n${draft[question.id] ?? ""}`)
      .join("\n\n");
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopied(false);
    }
  };

  const errors = state.status === "invalid" ? state.errors : {};

  return (
    <form action={formAction} className="grid gap-7" noValidate>
      {intakeQuestions.map((question) => {
        const error = errors[question.id];
        const describedBy =
          [question.help ? `${question.id}-help` : null, error ? `${question.id}-error` : null]
            .filter(Boolean)
            .join(" ") || undefined;

        return (
          <div key={question.id} className="grid gap-2">
            <label
              htmlFor={question.id}
              className="text-[0.9375rem] font-medium text-navy-900"
            >
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
      })}

      <div className="flex flex-wrap items-center gap-3 border-t border-line pt-6">
        <Button type="submit" size="lg" disabled={pending}>
          {pending ? "Checking your answers" : "Check and continue"}
        </Button>
        <Button type="button" variant="outline" size="lg" onClick={copyAnswers}>
          {copied ? (
            <>
              <CheckCircle size={17} weight="fill" aria-hidden />
              Copied
            </>
          ) : (
            <>
              <Copy size={17} weight="bold" aria-hidden />
              Copy my answers
            </>
          )}
        </Button>
      </div>

      {state.status === "not-live" && (
        <div className="rounded-panel border border-line bg-surface p-6" role="status">
          <div className="flex items-start gap-3">
            <Info size={20} weight="fill" className="mt-0.5 shrink-0 text-blue-600" aria-hidden />
            <div>
              <h3 className="font-display text-[1.0625rem] font-bold text-navy-900">
                Your answers are complete. Nothing was sent.
              </h3>
              <p className="mt-2 text-[0.9375rem] leading-relaxed text-body">
                {state.message}
              </p>
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
