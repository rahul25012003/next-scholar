"use client";

import { useActionState } from "react";
import { draftMessage, type DraftResult } from "@/app/actions/case";
import { Button } from "@/components/ui/button";

export function Copilot({ caseId }: { caseId: string }) {
  const [state, formAction, pending] = useActionState<DraftResult, FormData>(
    draftMessage,
    { status: "idle" },
  );

  return (
    <div className="px-6 py-5">
      <form action={formAction}>
        <input type="hidden" name="caseId" value={caseId} />
        <label htmlFor="intent" className="text-[0.875rem] font-medium text-navy-900">
          Draft a message
        </label>
        <p className="mt-1 text-[0.8125rem] leading-relaxed text-muted">
          Say what the message should do. You get a draft to edit. This has no
          send capability, here or in its permissions, so nothing leaves until
          you send it yourself.
        </p>
        <input
          id="intent"
          name="intent"
          type="text"
          placeholder="Chase the passport renewal appointment date"
          className="mt-3 w-full rounded-input border border-line-strong bg-paper px-3.5 py-2.5 text-[0.9375rem] text-navy-900 placeholder:text-muted/70 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/25"
        />
        <Button type="submit" className="mt-3" disabled={pending}>
          {pending ? "Drafting" : "Draft it"}
        </Button>
      </form>

      {state.status === "drafted" && (
        <div className="mt-4" role="status">
          <textarea
            readOnly
            rows={6}
            value={state.draft}
            aria-label="Draft message, editable before you send it"
            className="w-full rounded-input border border-line-strong bg-surface px-3.5 py-2.5 text-[0.9375rem] leading-relaxed text-navy-900"
          />
          <p className="mt-2 text-[0.75rem] text-muted">
            Machine written, {state.confidence} confidence. Copy it, change what
            is wrong, and send it yourself.
          </p>
        </div>
      )}

      {(state.status === "unavailable" || state.status === "error") && (
        <p
          className="mt-4 rounded-card border border-line bg-surface p-4 text-[0.875rem] leading-relaxed text-ink-soft"
          role="status"
        >
          {state.message}
        </p>
      )}
    </div>
  );
}
