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
      <form action={formAction}>
        <label htmlFor="question" className="text-[0.875rem] font-medium text-blue-dark">
          Ask about your own application
        </label>
        <p className="mt-1 text-[0.8125rem] leading-relaxed text-grey">
          Answers come from your case record and the published policies, and they
          say which. Anything outside that goes to {counselor}. It will never tell
          you your chances, because nobody honestly can.
        </p>
        <textarea
          id="question"
          name="question"
          rows={2}
          placeholder="What happens if my passport renewal takes longer than the APS deadline?"
          className="mt-3 w-full rounded-card border border-line-strong bg-white px-3.5 py-2.5 text-[0.9375rem] text-blue-dark placeholder:text-grey/70 focus:border-pink focus:outline-none focus:ring-2 focus:ring-pink/25"
        />
        <Button type="submit" className="mt-3" disabled={pending}>
          {pending ? "Asking" : "Ask"}
        </Button>
      </form>

      {state.status === "answered" && (
        <div className="mt-4 rounded-card border border-line bg-light p-4" role="status">
          <p className="text-[0.9375rem] leading-relaxed text-grey">
            {state.answer}
          </p>
          <p className="mt-2.5 text-[0.75rem] text-grey">
            Based on: {state.basedOn}. Machine written, from your own record.
          </p>
        </div>
      )}

      {state.status === "routed" && (
        <div
          className="mt-4 flex items-start gap-2.5 rounded-card border border-line bg-light p-4"
          role="status"
        >
          <ArrowBendUpRight size={17} weight="bold" className="mt-0.5 shrink-0 text-pink" aria-hidden />
          <p className="text-[0.875rem] leading-relaxed text-grey">
            {state.message}
          </p>
        </div>
      )}

      {state.status === "error" && (
        <div className="mt-4 flex items-start gap-2.5 rounded-card border border-line bg-light p-4" role="alert">
          <Info size={17} weight="fill" className="mt-0.5 shrink-0 text-pending" aria-hidden />
          <p className="text-[0.875rem] leading-relaxed text-grey">
            {state.message}
          </p>
        </div>
      )}
    </div>
  );
}
