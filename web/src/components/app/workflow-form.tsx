"use client";

import { useActionState } from "react";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import type { WorkflowResult } from "@/app/actions/case-workflows";

type Action = (
  previous: WorkflowResult,
  formData: FormData,
) => Promise<WorkflowResult>;

/**
 * Shared shell for the case workflows. Each one is a person taking an action,
 * so each one gets a submit button, a result, and no silent success.
 */
export function WorkflowForm({
  action,
  caseId,
  title,
  description,
  submitLabel,
  children,
}: {
  action: Action;
  caseId: string;
  title: string;
  description: string;
  submitLabel: string;
  children: ReactNode;
}) {
  const [state, formAction, pending] = useActionState<WorkflowResult, FormData>(
    action,
    { status: "idle" },
  );

  return (
    <form action={formAction} className="border-t border-line px-6 py-5 first:border-t-0">
      <input type="hidden" name="caseId" value={caseId} />
      <h3 className="text-[0.9375rem] font-medium text-navy-900">{title}</h3>
      <p className="mt-1 text-[0.8125rem] leading-relaxed text-muted">{description}</p>

      <div className="mt-3 grid gap-2.5 sm:grid-cols-2">{children}</div>

      <Button type="submit" className="mt-3" disabled={pending}>
        {pending ? "Recording" : submitLabel}
      </Button>

      {state.status !== "idle" && (
        <p
          className={
            state.status === "done"
              ? "mt-3 text-[0.875rem] leading-relaxed text-ink-soft"
              : "mt-3 text-[0.875rem] leading-relaxed text-denied"
          }
          role="status"
        >
          {state.message}
        </p>
      )}
    </form>
  );
}

export const fieldClass =
  "w-full rounded-input border border-line-strong bg-paper px-3.5 py-2.5 text-[0.9375rem] text-navy-900 placeholder:text-muted/70 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/25";
