"use client";

import { useActionState } from "react";
import { summariseCommunication, type SummaryResult } from "@/app/actions/case-workflows";
import { Button } from "@/components/ui/button";

/**
 * Summarising one thread. The agent writes the summary field. The raw record
 * below it is never touched, which is why they are separate fields rather than
 * one field the agent rewrites.
 */
export function ThreadSummary({
  caseId,
  communicationId,
  existing,
}: {
  caseId: string;
  communicationId: string;
  existing: string | null;
}) {
  const [state, formAction, pending] = useActionState<SummaryResult, FormData>(
    summariseCommunication,
    { status: "idle" },
  );

  const line = state.status === "done" ? state.line : existing;

  return (
    <div className="mt-3">
      {/* The live regions are on the page before the result, so a new
          summary is read out when it arrives. */}
      <div role="status" aria-live="polite">
        {line && (
          <p className="rounded-card bg-light p-3 text-[0.875rem] leading-relaxed text-grey">
            {line}
            <span className="mt-1 block text-[0.75rem] text-grey">
              Machine written. The thread above is unchanged.
            </span>
          </p>
        )}
      </div>

      {/* aria-disabled, not disabled, while reading: a disabled button drops
          keyboard focus. The guard ignores a second press instead. */}
      {!line && (
        <form
          action={formAction}
          onSubmit={(event) => {
            if (pending) event.preventDefault();
          }}
        >
          <input type="hidden" name="communicationId" value={communicationId} />
          <input type="hidden" name="caseId" value={caseId} />
          <Button type="submit" variant="outline" aria-disabled={pending} aria-busy={pending}>
            {pending ? "Reading" : "Summarise this thread"}
          </Button>
        </form>
      )}

      <div role="status" aria-live="polite">
        {state.status === "unavailable" && (
          <p className="mt-2 text-[0.8125rem] leading-relaxed text-grey">{state.message}</p>
        )}
      </div>
    </div>
  );
}
