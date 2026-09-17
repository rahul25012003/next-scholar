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
      {line && (
        <p className="rounded-card bg-light p-3 text-[0.875rem] leading-relaxed text-grey">
          {line}
          <span className="mt-1 block text-[0.75rem] text-grey">
            Machine written. The thread above is unchanged.
          </span>
        </p>
      )}

      {!line && (
        <form action={formAction}>
          <input type="hidden" name="communicationId" value={communicationId} />
          <input type="hidden" name="caseId" value={caseId} />
          <Button type="submit" variant="outline" disabled={pending}>
            {pending ? "Reading" : "Summarise this thread"}
          </Button>
        </form>
      )}

      {state.status === "unavailable" && (
        <p className="mt-2 text-[0.8125rem] leading-relaxed text-grey" role="status">
          {state.message}
        </p>
      )}
    </div>
  );
}
