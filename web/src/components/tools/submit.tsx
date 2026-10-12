"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Results that change only when the reader presses Submit.
 *
 * Testers could not tell whether a tool had taken their details while it
 * recalculated on every keystroke, so each tool keeps what was last submitted
 * and renders its result from that. `dirty` says the form has moved on since,
 * and `round` counts submissions so the result can replay its arrival and be
 * brought into view on a narrow screen, where it sits below the form.
 *
 * Validation is the browser's own: a submit button runs every input's min,
 * max, step and required constraints before the submit event fires.
 */
export function useSubmitted<T>(inputs: T) {
  const [submitted, setSubmitted] = useState<T | null>(null);
  const [round, setRound] = useState(0);
  const resultsRef = useRef<HTMLDivElement>(null);
  const dirty = submitted !== null && JSON.stringify(inputs) !== JSON.stringify(submitted);

  useEffect(() => {
    if (round === 0) return;
    const results = resultsRef.current;
    // Side by side from 1024px, so only a stacked layout needs the scroll.
    const wide = window.matchMedia?.("(min-width: 1024px)").matches ?? true;
    if (!results || wide) return;
    results.scrollIntoView?.({ behavior: "smooth", block: "start" });
  }, [round]);

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(inputs);
    setRound((value) => value + 1);
  };

  return { submitted, dirty, round, onSubmit, resultsRef };
}

/** The Submit button and a plain line saying where the result stands. */
export function SubmitBar({
  round,
  dirty,
  label = "Submit",
}: {
  round: number;
  dirty: boolean;
  label?: string;
}) {
  return (
    <div className="mt-7 border-t border-line pt-6">
      {/* The large size's side padding is for a free-standing pill; across a
          narrow form it pushed the label onto two lines. */}
      <button
        type="submit"
        className="button button--lg inline-flex w-full items-center justify-center px-5"
      >
        {label}
      </button>
      <p role="status" className="mt-3 text-center text-[0.8125rem] leading-relaxed text-grey">
        {round === 0
          ? "Press Submit to see your result."
          : dirty
            ? "You changed a detail. Press Submit to update your result."
            : "Done. Your result is updated."}
      </p>
    </div>
  );
}
