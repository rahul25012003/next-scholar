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
      <form action={formAction}>
        <input type="hidden" name="caseId" value={caseId} />
        <label htmlFor="intent" className="text-[0.875rem] font-medium text-blue-dark">
          Draft a message
        </label>
        <p className="mt-1 text-[0.8125rem] leading-relaxed text-grey">
          Say what the message should do. You get a draft to edit. This has no
          send capability, here or in its permissions, so nothing leaves until
          you send it yourself.
        </p>
        <input
          id="intent"
          name="intent"
          type="text"
          placeholder="Chase the passport renewal appointment date"
          className="mt-3 w-full rounded-card border border-line-strong bg-white px-3.5 py-2.5 text-[0.9375rem] text-blue-dark placeholder:text-grey/70 focus:border-pink focus:outline-none focus:ring-2 focus:ring-pink/25"
        />
        <Button type="submit" className="mt-3" disabled={pending}>
          {pending ? "Drafting" : "Draft it"}
        </Button>
      </form>

      {state.status === "drafted" && (
        <div className="mt-4" role="status">
          {state.confidence === "low" && (
            <p className="mb-2 flex items-start gap-2 rounded-card border border-pending/25 bg-pending-bg/50 p-3 text-[0.8125rem] leading-relaxed text-grey">
              <WarningCircle size={16} weight="fill" className="mt-0.5 shrink-0 text-pending" aria-hidden />
              Low confidence. Read this one properly before you send any of it.
            </p>
          )}
          <textarea
            defaultValue={state.draft}
            rows={6}
            aria-label="Draft message, editable before you send it"
            className="w-full rounded-card border border-line-strong bg-white px-3.5 py-2.5 text-[0.9375rem] leading-relaxed text-blue-dark focus:border-pink focus:outline-none focus:ring-2 focus:ring-pink/25"
          />
          <p className="mt-2 text-[0.75rem] text-grey">
            Machine written, {state.confidence} confidence. Edit it here, then
            send it yourself. Nothing sends from this screen.
          </p>
        </div>
      )}

      {(state.status === "unavailable" || state.status === "error") && (
        <p
          className="mt-4 rounded-card border border-line bg-light p-4 text-[0.875rem] leading-relaxed text-grey"
          role="status"
        >
          {state.message}
        </p>
      )}
    </div>
  );
}
