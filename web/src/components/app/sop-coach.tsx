"use client";

import { useActionState } from "react";
import { Question } from "@phosphor-icons/react";
import { coachSop, type CoachingResult } from "@/app/actions/student";
import { Button } from "@/components/ui/button";

export function SopCoach() {
  const [state, formAction, pending] = useActionState<CoachingResult, FormData>(
    coachSop,
    { status: "idle" },
  );

  return (
    <div className="px-6 py-5">
      <form action={formAction}>
        <label htmlFor="draft" className="text-[0.875rem] font-medium text-blue-dark">
          Paste what you have written so far
        </label>
        <p className="mt-1 text-[0.8125rem] leading-relaxed text-grey">
          You get questions and comments on structure. You will not get sentences
          to paste, and asking for them will not produce them. The statement has
          to be yours or it is worth nothing at the interview.
        </p>
        <textarea
          id="draft"
          name="draft"
          rows={6}
          placeholder="Your own draft, in your own words."
          className="mt-3 w-full rounded-card border border-line-strong bg-white px-3.5 py-2.5 text-[0.9375rem] leading-relaxed text-blue-dark placeholder:text-grey/70 focus:border-pink focus:outline-none focus:ring-2 focus:ring-pink/25"
        />
        <Button type="submit" className="mt-3" disabled={pending}>
          {pending ? "Reading" : "Get coaching questions"}
        </Button>
      </form>

      {state.status === "coached" && (
        <div className="mt-5" role="status">
          <p className="text-[0.875rem] font-medium text-blue-dark">
            Questions to answer in your next pass
          </p>
          <ul className="mt-3 space-y-2.5">
            {state.questions.map((question) => (
              <li key={question} className="flex items-start gap-2.5">
                <Question size={16} weight="bold" className="mt-1 shrink-0 text-pink" aria-hidden />
                <span className="text-[0.9375rem] leading-relaxed text-grey">
                  {question}
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-4 rounded-card bg-light p-4 text-[0.875rem] leading-relaxed text-grey">
            {state.feedback}
          </p>
        </div>
      )}

      {(state.status === "unavailable" || state.status === "error") && (
        <p className="mt-4 rounded-card border border-line bg-light p-4 text-[0.875rem] leading-relaxed text-grey" role="status">
          {state.message}
        </p>
      )}
    </div>
  );
}
