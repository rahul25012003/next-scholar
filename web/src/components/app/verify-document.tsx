"use client";

import { useActionState } from "react";
import { verifyDocument, type VerifyResult } from "@/app/actions/case";
import { Button } from "@/components/ui/button";

export function VerifyDocument({
  caseId,
  documentId,
  documentName,
}: {
  caseId: string;
  documentId: string;
  documentName: string;
}) {
  const [state, formAction, pending] = useActionState<VerifyResult, FormData>(
    verifyDocument,
    { status: "idle" },
  );

  return (
    <form action={formAction} className="text-right">
      <input type="hidden" name="caseId" value={caseId} />
      <input type="hidden" name="documentId" value={documentId} />
      <Button type="submit" variant="outline" disabled={pending}>
        {pending ? "Recording" : "Verify against original"}
      </Button>
      <span className="sr-only">{documentName}</span>
      {state.status !== "idle" && (
        <p
          className={
            state.status === "done"
              ? "mt-2 max-w-xs text-[0.75rem] leading-relaxed text-muted"
              : "mt-2 max-w-xs text-[0.75rem] leading-relaxed text-denied"
          }
          role="status"
        >
          {state.message}
        </p>
      )}
    </form>
  );
}
