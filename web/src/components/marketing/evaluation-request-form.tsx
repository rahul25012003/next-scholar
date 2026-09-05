"use client";

import { useActionState, useMemo, useState, useSyncExternalStore, type ReactNode } from "react";
import { CheckCircle, Copy, Info } from "@phosphor-icons/react";
import {
  requestProfileEvaluation,
  type ProfileEvaluationState,
} from "@/app/actions/profile-evaluation";
import { guides } from "@/content/guides";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";

const DRAFT_KEY = "next-scholar.evaluation-draft";

const fieldBase =
  "w-full rounded-input border border-line-strong bg-paper px-3.5 py-2.5 text-[0.9375rem] text-navy-900 " +
  "placeholder:text-muted/70 transition-colors focus:border-blue-600 focus:outline-none " +
  "focus:ring-2 focus:ring-blue-600/25";

function subscribeToStorage(onChange: () => void) {
  window.addEventListener("storage", onChange);
  return () => window.removeEventListener("storage", onChange);
}

function readStoredDraft(): string | null {
  try {
    return window.localStorage.getItem(DRAFT_KEY);
  } catch {
    return null;
  }
}

/**
 * The request for a person to read what the checklist above already computed.
 *
 * There is no contact channel connected to send the answer back on and no
 * store for an anonymous visitor's details ahead of the security and DPDP
 * foundation, so this form does exactly what the consultation intake does: it
 * validates, keeps the draft in this browser only, and says so, with a copy
 * button so the visit is not wasted.
 */
export function EvaluationRequestForm() {
  const [state, formAction, pending] = useActionState<ProfileEvaluationState, FormData>(
    requestProfileEvaluation,
    { status: "idle" },
  );
  const [edits, setEdits] = useState<Record<string, string> | null>(null);
  const [copied, setCopied] = useState(false);

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
  const chosen = (draft.destinations ?? "").split(",").filter(Boolean);

  const update = (id: string, value: string) => {
    const next = { ...draft, [id]: value };
    setEdits(next);
    try {
      window.localStorage.setItem(DRAFT_KEY, JSON.stringify(next));
    } catch {
      // The typed answer still lives in React state either way.
    }
  };

  const toggleDestination = (slug: string) => {
    const next = chosen.includes(slug)
      ? chosen.filter((item) => item !== slug)
      : [...chosen, slug];
    update("destinations", next.join(","));
  };

  const copyAnswers = async () => {
    const text = [
      `Name\n${draft.name ?? ""}`,
      `Email\n${draft.email ?? ""}`,
      `Destinations\n${chosen.length > 0 ? chosen.join(", ") : "Not decided yet"}`,
      `Details\n${draft.details ?? ""}`,
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

  return (
    <form action={formAction} className="grid gap-5" noValidate>
      <input type="hidden" name="destinations" value={draft.destinations ?? ""} />

      <div className="grid gap-5 sm:grid-cols-2">
        <Field id="name" label="Your name" error={errors.name}>
          <input
            id="name"
            name="name"
            type="text"
            value={draft.name ?? ""}
            onChange={(event) => update("name", event.target.value)}
            className={cn(fieldBase, errors.name ? "border-denied" : "")}
          />
        </Field>
        <Field id="email" label="Your email" error={errors.email}>
          <input
            id="email"
            name="email"
            type="email"
            value={draft.email ?? ""}
            onChange={(event) => update("email", event.target.value)}
            className={cn(fieldBase, errors.email ? "border-denied" : "")}
          />
        </Field>
      </div>

      <div>
        <span className="text-[0.9375rem] font-medium text-navy-900">
          Which destination should we check against?
        </span>
        <div className="mt-2.5 flex flex-wrap gap-2">
          {guides.map((guide) => {
            const active = chosen.includes(guide.slug);
            return (
              <button
                key={guide.slug}
                type="button"
                onClick={() => toggleDestination(guide.slug)}
                aria-pressed={active}
                className={cn(
                  "rounded-full border px-4 py-2 text-[0.875rem] font-medium transition-colors",
                  active
                    ? "border-blue-600 bg-blue-600 text-white"
                    : "border-line-strong bg-paper text-navy-900 hover:border-blue-600 hover:text-blue-600",
                )}
              >
                {guide.country}
              </button>
            );
          })}
        </div>
      </div>

      <Field
        id="details"
        label="Your percentage or CGPA, your language test result if you have one, and anything else worth checking"
        error={errors.details}
      >
        <textarea
          id="details"
          name="details"
          rows={4}
          placeholder="76%, or 8.1 CGPA on a 10 point scale. IELTS 7.0, overall, no band below 6.5. Four year B.Tech, graduating 2027."
          value={draft.details ?? ""}
          onChange={(event) => update("details", event.target.value)}
          className={cn(fieldBase, errors.details ? "border-denied" : "")}
        />
      </Field>

      <label className="flex items-start gap-2.5">
        <input
          type="checkbox"
          name="consent"
          checked={draft.consent === "on"}
          onChange={(event) => update("consent", event.target.checked ? "on" : "")}
          className="mt-1 h-4 w-4 shrink-0 accent-[var(--color-blue-600)]"
        />
        <span className="text-[0.875rem] leading-snug text-body">
          I agree to be contacted about this request.
          {errors.consent && (
            <span className="mt-0.5 block text-[0.8125rem] font-medium text-denied">
              {errors.consent}
            </span>
          )}
        </span>
      </label>

      <div className="flex flex-wrap items-center gap-3 border-t border-line pt-5">
        <Button type="submit" disabled={pending}>
          {pending ? "Checking your answers" : "Check and continue"}
        </Button>
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
                Still to connect before this form can deliver a reply
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

function Field({
  id,
  label,
  error,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div className="grid gap-2">
      <label htmlFor={id} className="text-[0.9375rem] font-medium text-navy-900">
        {label}
      </label>
      {children}
      {error && <p className="text-[0.8125rem] font-medium text-denied">{error}</p>}
    </div>
  );
}
