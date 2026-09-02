"use client";

import { close, reassign } from "@/app/actions/case-workflows";
import { WorkflowForm, fieldClass } from "@/components/app/workflow-form";
import { closureLabel, type ClosureOutcome } from "@/domain/case-operations";

const outcomes: ClosureOutcome[] = [
  "enrolled",
  "withdrawn-by-student",
  "visa-refused",
  "advised-not-to-proceed",
  "lost-contact",
];

/**
 * The two actions a manager holds that a counselor does not: moving a case to
 * someone else, and closing one. Both are decisions, so both need a reason, and
 * neither has an automatic path.
 */
export function ManagerActions({
  caseId,
  counselors,
}: {
  caseId: string;
  counselors: string[];
}) {
  return (
    <>
      <WorkflowForm
        action={reassign}
        caseId={caseId}
        title="Reassign"
        description="The handover packet goes with it, and the student is told who holds their case now."
        submitLabel="Reassign"
      >
        <select name="counselor" defaultValue="" className={fieldClass} aria-label="New counselor">
          <option value="">Move it to</option>
          {counselors.map((counselor) => (
            <option key={counselor} value={counselor}>
              {counselor}
            </option>
          ))}
        </select>
        <input
          name="reason"
          type="text"
          placeholder="Why it is moving"
          className={fieldClass}
          aria-label="Reason for reassignment"
        />
      </WorkflowForm>

      <WorkflowForm
        action={close}
        caseId={caseId}
        title="Close the case"
        description="Starts the retention clock. Nothing here closes a quiet case on its own, because a case that goes quiet needs a phone call, not a status change."
        submitLabel="Close it"
      >
        <select name="outcome" defaultValue="" className={fieldClass} aria-label="Closing outcome">
          <option value="">Closing outcome</option>
          {outcomes.map((outcome) => (
            <option key={outcome} value={outcome}>
              {closureLabel[outcome]}
            </option>
          ))}
        </select>
        <input
          name="reason"
          type="text"
          placeholder="What happened"
          className={fieldClass}
          aria-label="Reason for closing"
        />
      </WorkflowForm>
    </>
  );
}
