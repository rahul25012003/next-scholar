"use client";

import { useActionState } from "react";
import { WarningCircle } from "@phosphor-icons/react";
import { draftMessage, type DraftResult } from "@/app/actions/case";
import { Button } from "@/components/ui/button";

export function Copilot({ caseId }: { caseId: string }) {
  const [state, formAction, pending] = useActionState<DraftResult, FormData>(
    draftMessage,
    { status: "idle" },
  );

  return (
    <div className="px-6 py-5">
      {/* aria-disabled, not disabled, while drafting: a disabled button drops
          keyboard focus. The guard ignores a second press instead. */}
      <form
        action={formAction}
        onSubmit={(event) => {
          if (pending) event.preventDefault();
        }}
      >
        <input type="hidden" name="caseId" value={caseId} />
        <label htmlFor="intent" className="text-[0.875rem] font-medium text-blue-dark">
          Draft a message
        </label>
        <p className="mt-1 text-[0.8125rem] leading-relaxed text-grey">
          Say what the message should do, and you get a draft to edit. It cannot
          send anything, so nothing goes out until you send it yourself.
        </p>
        <input
          id="intent"
          name="intent"
          type="text"
          placeholder="Chase the passport renewal appointment date"
          className="mt-3 w-full rounded-card border border-line-strong bg-white px-3.5 py-2.5 text-[0.9375rem] text-blue-dark placeholder:text-grey focus:border-pink focus:outline-none focus:ring-2 focus:ring-pink/25"
        />
        <Button type="submit" className="mt-3" aria-disabled={pending} aria-busy={pending}>
          {pending ? "Drafting" : "Draft it"}
        </Button>
      </form>

      {state.status === "drafted" && (
        <div className="mt-4">
          {state.confidence === "low" && (
            <p className="mb-2 flex items-start gap-2 rounded-card border border-pending/25 bg-pending-bg/50 p-3 text-[0.8125rem] leading-relaxed text-grey">
              <WarningCircle size={16} weight="fill" className="mt-0.5 shrink-0 text-pending" aria-hidden />
              Low confidence. Read it carefully before you send any of it.
            </p>
          )}
          <textarea
            key={state.draft}
            defaultValue={state.draft}
            rows={6}
            aria-label="Draft message, editable before you send it"
            className="w-full rounded-card border border-line-strong bg-white px-3.5 py-2.5 text-[0.9375rem] leading-relaxed text-blue-dark focus:border-pink focus:outline-none focus:ring-2 focus:ring-pink/25"
          />
          <p className="mt-2 text-[0.75rem] text-grey">
            Machine written, {state.confidence} confidence. Edit it here, then
            send it yourself.
          </p>
        </div>
      )}

      {/* On the page before any result, so the result is read out when it
          arrives. A draft is announced in a line of its own: the draft itself
          sits in an editable box, which a live region does not read well. */}
      <div role="status" aria-live="polite">
        {state.status === "drafted" && (
          <span key={state.draft} className="sr-only">
            Draft ready, {state.confidence} confidence. Edit it in the box below the
            button, then send it yourself.
          </span>
        )}
        {(state.status === "unavailable" || state.status === "error") && (
          <p className="mt-4 rounded-card border border-line bg-light p-4 text-[0.875rem] leading-relaxed text-grey">
            {state.message}
          </p>
        )}
      </div>
    </div>
  );
}
