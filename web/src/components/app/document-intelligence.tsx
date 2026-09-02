"use client";

import { useActionState } from "react";
import { CheckCircle, Prohibit, WarningCircle } from "@phosphor-icons/react";
import {
  runExtraction,
  decideField,
  type ExtractionResult,
  type DecisionResult,
} from "@/app/actions/extraction";
import type { Extraction } from "@/domain/extraction";
import { Button } from "@/components/ui/button";

/**
 * The entry point for Document Intelligence, and the human gate on it.
 *
 * Nothing on this panel is authoritative. Each proposed value sits at pending
 * verification until a person confirms that specific field, and confirming is
 * an action recorded against their name.
 */
export function DocumentIntelligence({
  caseId,
  documentId,
  documentName,
  extraction,
}: {
  caseId: string;
  documentId: string;
  documentName: string;
  extraction: Extraction | null;
}) {
  const [state, formAction, pending] = useActionState<ExtractionResult, FormData>(
    runExtraction,
    { status: "idle" },
  );

  return (
    <div className="mt-3">
      {!extraction && (
        <form action={formAction}>
          <input type="hidden" name="caseId" value={caseId} />
          <input type="hidden" name="documentId" value={documentId} />
          <Button type="submit" variant="outline" disabled={pending}>
            {pending ? "Reading" : "Read the document"}
          </Button>
          <span className="sr-only">{documentName}</span>
        </form>
      )}

      {state.status === "unavailable" && (
        <div
          className="mt-3 flex items-start gap-2.5 rounded-card border border-line bg-surface p-4"
          role="status"
        >
          <Prohibit size={17} weight="bold" className="mt-0.5 shrink-0 text-navy-700" aria-hidden />
          <div>
            <p className="text-[0.875rem] leading-relaxed text-ink-soft">{state.reason}</p>
            <p className="mt-1.5 text-[0.8125rem] leading-relaxed text-muted">
              {state.fallback}
            </p>
          </div>
        </div>
      )}

      {state.status === "error" && (
        <p className="mt-3 text-[0.8125rem] text-denied" role="alert">
          {state.message}
        </p>
      )}

      {extraction && (
        <div className="mt-3 rounded-card border border-line bg-surface p-4">
          <p className="text-[0.8125rem] font-medium text-navy-900">
            Proposed values, none of them authoritative yet
          </p>
          <p className="mt-1 text-[0.75rem] leading-relaxed text-muted">
            {extraction.note} A confidence score describes the reading, not the
            truth. A high confidence value still needs a person behind it.
          </p>

          <ul className="mt-3 divide-y divide-line">
            {extraction.fields.map((field) => (
              <li key={field.name} className="py-3 first:pt-0 last:pb-0">
                <div className="flex flex-wrap items-baseline justify-between gap-3">
                  <div>
                    <p className="text-[0.875rem] font-medium text-navy-900">
                      {field.name}
                    </p>
                    <p className="figures text-[0.875rem] text-ink-soft">{field.value}</p>
                  </div>
                  <span className="text-[0.75rem] text-muted">
                    {field.confidence} confidence
                  </span>
                </div>

                {field.state === "pending-verification" ? (
                  <FieldDecision
                    caseId={caseId}
                    documentId={documentId}
                    fieldName={field.name}
                  />
                ) : (
                  <p
                    className={
                      field.state === "confirmed"
                        ? "mt-1.5 flex items-center gap-1.5 text-[0.75rem] text-verified"
                        : "mt-1.5 flex items-center gap-1.5 text-[0.75rem] text-muted"
                    }
                  >
                    {field.state === "confirmed" ? (
                      <CheckCircle size={13} weight="fill" aria-hidden />
                    ) : (
                      <WarningCircle size={13} weight="fill" aria-hidden />
                    )}
                    {field.state} by {field.decidedBy}
                  </p>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function FieldDecision({
  caseId,
  documentId,
  fieldName,
}: {
  caseId: string;
  documentId: string;
  fieldName: string;
}) {
  const [state, formAction, pending] = useActionState<DecisionResult, FormData>(
    decideField,
    { status: "idle" },
  );

  return (
    <div className="mt-2">
      <form action={formAction} className="flex flex-wrap gap-2">
        <input type="hidden" name="caseId" value={caseId} />
        <input type="hidden" name="documentId" value={documentId} />
        <input type="hidden" name="fieldName" value={fieldName} />
        <Button type="submit" name="decision" value="confirmed" disabled={pending}>
          Confirm
        </Button>
        <Button
          type="submit"
          name="decision"
          value="rejected"
          variant="outline"
          disabled={pending}
        >
          Reject
        </Button>
      </form>
      {state.status !== "idle" && (
        <p className="mt-2 text-[0.75rem] leading-relaxed text-muted" role="status">
          {state.message}
        </p>
      )}
    </div>
  );
}
