"use client";

import { useActionState } from "react";
import { CheckCircle, WarningCircle } from "@phosphor-icons/react";
import { addNote, type NoteResult } from "@/app/actions/case";
import { Button } from "@/components/ui/button";

export function NoteForm({ caseId }: { caseId: string }) {
  const [state, formAction, pending] = useActionState<NoteResult, FormData>(addNote, {
    status: "idle",
  });

  return (
    <form action={formAction} className="px-6 py-5">
      <input type="hidden" name="caseId" value={caseId} />
      <label htmlFor="note" className="text-[0.875rem] font-medium text-blue-dark">
        Add a note
      </label>
      <p className="mt-1 text-[0.8125rem] leading-relaxed text-grey">
        Describe the situation, not the contents of a document. No passport
        number, no bank figure, no transcript text leaves this box.
      </p>
      <textarea
        id="note"
        name="note"
        rows={3}
        placeholder="Bank statement date does not match the sponsor letter. Asked for a reissue."
        className="mt-3 w-full rounded-card border border-line-strong bg-white px-3.5 py-2.5 text-[0.9375rem] text-blue-dark placeholder:text-grey/70 focus:border-pink focus:outline-none focus:ring-2 focus:ring-pink/25"
      />
      <div className="mt-3 flex flex-wrap items-center gap-3">
        <Button type="submit" disabled={pending}>
          {pending ? "Saving" : "Save note"}
        </Button>
        <p className="text-[0.8125rem] text-grey">
          Saved before any agent runs on it.
        </p>
      </div>

      {state.status === "saved" && (
        <div className="mt-4 flex items-start gap-2.5 rounded-card border border-line bg-light p-4" role="status">
          <CheckCircle size={17} weight="fill" className="mt-0.5 shrink-0 text-verified" aria-hidden />
          <div>
            <p className="text-[0.875rem] font-medium text-blue-dark">
              Note saved to the case log.
            </p>
            <p className="mt-1 text-[0.875rem] leading-relaxed text-grey">
              {state.agent}
            </p>
          </div>
        </div>
      )}

      {state.status === "error" && (
        <div className="mt-4 flex items-start gap-2.5 rounded-card border border-denied/25 bg-denied-bg/50 p-4" role="alert">
          <WarningCircle size={17} weight="fill" className="mt-0.5 shrink-0 text-denied" aria-hidden />
          <p className="text-[0.875rem] leading-relaxed text-grey">
            {state.message}
          </p>
        </div>
      )}
    </form>
  );
}
