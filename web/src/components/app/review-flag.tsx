"use client";

import { useActionState } from "react";
import { WarningCircle } from "@phosphor-icons/react";
import { clearReviewFlag, type ReviewResult } from "@/app/actions/case";
import { Button } from "@/components/ui/button";

/**
 * The manual review flag. An agent that could not classify a note leaves this
 * behind, so the failure sits on the case until a person says they have looked,
 * rather than living for one render inside a form and then vanishing.
 */
export function ReviewFlag({
  caseId,
  flag,
}: {
  caseId: string;
  flag: { at: string; note: string; reason: string };
}) {
  const [state, formAction, pending] = useActionState<ReviewResult, FormData>(
    clearReviewFlag,
    { status: "idle" },
  );

  if (state.status === "cleared") {
    return (
      <p className="px-6 py-5 text-[0.875rem] leading-relaxed text-grey" role="status">
        {state.message}
      </p>
    );
  }

  return (
    <div className="px-6 py-5">
      <div className="flex items-start gap-3">
        <WarningCircle size={20} weight="fill" className="mt-0.5 shrink-0 text-pending" aria-hidden />
        <div>
          <p className="text-[0.9375rem] font-medium text-blue-dark">
            A note on this case was never classified
          </p>
          <p className="mt-1.5 text-[0.875rem] leading-relaxed text-grey">
            {flag.reason}
          </p>
          <p className="mt-2 rounded-card bg-light p-3 text-[0.875rem] leading-relaxed text-grey">
            {flag.note}
          </p>
          <p className="figures mt-2 text-[0.75rem] text-grey">{flag.at.slice(0, 16).replace("T", " ")}</p>

          <form action={formAction} className="mt-3">
            <input type="hidden" name="caseId" value={caseId} />
            <Button type="submit" variant="outline" disabled={pending}>
              {pending ? "Clearing" : "I have read it"}
            </Button>
          </form>

          {state.status === "error" && (
            <p className="mt-2 text-[0.8125rem] text-denied" role="alert">
              {state.message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
