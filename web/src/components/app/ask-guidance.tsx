"use client";

import { useActionState } from "react";
import { ArrowBendUpRight, Info } from "@phosphor-icons/react";
import { askGuidance, type GuidanceResult } from "@/app/actions/student";
import { Button } from "@/components/ui/button";

export function AskGuidance({ counselor }: { counselor: string }) {
  const [state, formAction, pending] = useActionState<GuidanceResult, FormData>(
    askGuidance,
    { status: "idle" },
  );

  return (
    <div className="px-6 py-5">
      {/* aria-disabled, not disabled, while asking: a disabled button drops
          keyboard focus. The guard ignores a second press instead. */}
      <form
        action={formAction}
        onSubmit={(event) => {
          if (pending) event.preventDefault();
        }}
      >
        <label htmlFor="question" className="text-[0.875rem] font-medium text-blue-dark">
          Ask about your own application
        </label>
        <p className="mt-1 text-[0.8125rem] leading-relaxed text-grey">
          Answers come from your case record and our published policies, and say
          which. Anything else goes to {counselor}, and it never tells you your chances.
        </p>
        <textarea
          id="question"
          name="question"
          rows={2}
          placeholder="What happens if my passport renewal takes longer than the APS deadline?"
          className="mt-3 w-full rounded-card border border-line-strong bg-white px-3.5 py-2.5 text-[0.9375rem] text-blue-dark placeholder:text-grey focus:border-pink focus:outline-none focus:ring-2 focus:ring-pink/25"
        />
        <Button type="submit" className="mt-3" aria-disabled={pending} aria-busy={pending}>
          {pending ? "Asking" : "Ask"}
        </Button>
      </form>

      {/* The live regions are on the page before the answer, so it is read
          out when it arrives. */}
      <div role="status" aria-live="polite">
        {state.status === "answered" && (
          <div className="mt-4 rounded-card border border-line bg-light p-4">
            <p className="text-[0.9375rem] leading-relaxed text-grey">
              {state.answer}
            </p>
            <p className="mt-2.5 text-[0.75rem] text-grey">
              Based on: {state.basedOn}. Machine written, from your own record.
            </p>
          </div>
        )}

        {state.status === "routed" && (
          <div className="mt-4 flex items-start gap-2.5 rounded-card border border-line bg-light p-4">
            <ArrowBendUpRight size={17} weight="bold" className="mt-0.5 shrink-0 text-pink" aria-hidden />
            <p className="text-[0.875rem] leading-relaxed text-grey">
              {state.message}
            </p>
          </div>
        )}
      </div>

      <div role="alert">
        {state.status === "error" && (
          <div className="mt-4 flex items-start gap-2.5 rounded-card border border-line bg-light p-4">
            <Info size={17} weight="fill" className="mt-0.5 shrink-0 text-pending" aria-hidden />
            <p className="text-[0.875rem] leading-relaxed text-grey">
              {state.message}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
