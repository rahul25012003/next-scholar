"use client";

import { useActionState } from "react";
import { Prohibit, UploadSimple } from "@phosphor-icons/react";
import { attemptUpload, type UploadResult } from "@/app/actions/upload";
import { categoryLabel, type DocumentCategory } from "@/domain/consent";
import { Button } from "@/components/ui/button";
import { fieldClass } from "@/components/app/workflow-form";

const categories: DocumentCategory[] = [
  "transcript",
  "passport",
  "english-test",
  "funding",
  "recommendation",
  "other",
];

/**
 * The upload control. It refuses everything today, and says which precondition
 * refused it, which is more use than a control that looks like it works.
 */
export function UploadDocument({ caseId }: { caseId: string }) {
  const [state, formAction, pending] = useActionState<UploadResult, FormData>(
    attemptUpload,
    { status: "idle" },
  );

  return (
    <form action={formAction} className="border-t border-line px-6 py-5">
      <input type="hidden" name="caseId" value={caseId} />
      <h3 className="text-blue-dark h--6">Add a document</h3>
      <p className="mt-1 text-[0.8125rem] leading-relaxed text-grey">
        Consent for the category, an allowlisted file type, a size ceiling and a
        malware scan. All four, or it is not stored.
      </p>

      <div className="mt-3 grid gap-2.5 sm:grid-cols-2">
        <select name="category" defaultValue="" className={fieldClass} aria-label="Document type">
          <option value="">What is it</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {categoryLabel[category]}
            </option>
          ))}
        </select>
        <input
          type="file"
          name="file"
          accept=".pdf,.jpg,.jpeg,.png"
          className={`${fieldClass} file:mr-3 file:rounded-full file:border-0 file:bg-light file:px-3 file:py-1 file:text-[0.8125rem] file:text-blue-dark`}
          aria-label="File"
        />
      </div>

      <Button type="submit" className="mt-3" disabled={pending}>
        <UploadSimple size={16} weight="bold" aria-hidden />
        {pending ? "Checking" : "Try to add it"}
      </Button>

      {state.status === "refused" && (
        <div
          className="mt-3 flex items-start gap-2.5 rounded-card border border-pending/25 bg-pending-bg/50 p-4"
          role="status"
        >
          <Prohibit size={17} weight="bold" className="mt-0.5 shrink-0 text-pending" aria-hidden />
          <div>
            <p className="text-[0.875rem] font-medium text-blue-dark">
              Refused at the {state.blocker} check
            </p>
            <p className="mt-1 text-[0.875rem] leading-relaxed text-grey">
              {state.reason}
            </p>
          </div>
        </div>
      )}

      {(state.status === "accepted" || state.status === "error") && (
        <p className="mt-3 text-[0.875rem] leading-relaxed text-grey" role="status">
          {state.message}
        </p>
      )}
    </form>
  );
}
