"use client";

import { openCase } from "@/app/actions/case-workflows";
import { WorkflowForm, fieldClass } from "@/components/app/workflow-form";

/**
 * How a real lead, once a consultation has actually happened, gets a case at
 * all. Lives on the caseload page rather than a case page, because there is
 * no case yet.
 */
export function OpenCaseForm() {
  return (
    <WorkflowForm
      action={openCase}
      caseId=""
      title="Open a new case"
      description="For a lead who has already had their consultation. This does not book anything or take a payment; it only opens the record a counsellor works from next."
      submitLabel="Open the case"
    >
      <input
        name="name"
        type="text"
        placeholder="Student's full name"
        className={fieldClass}
        aria-label="Student's full name"
      />
      <input
        name="destination"
        type="text"
        placeholder="Destination, e.g. Germany"
        className={fieldClass}
        aria-label="Destination"
      />
      <input
        name="route"
        type="text"
        placeholder="Route, if the destination has more than one"
        className={fieldClass}
        aria-label="Route within the destination"
      />
      <input
        name="intake"
        type="text"
        placeholder="Target intake, e.g. October 2027"
        className={fieldClass}
        aria-label="Target intake"
      />
      <input
        name="counselor"
        type="text"
        placeholder="Assigned counsellor's name"
        className={fieldClass}
        aria-label="Assigned counsellor"
      />
      <input
        name="budgetInr"
        type="text"
        inputMode="numeric"
        placeholder="Stated budget in rupees, if known"
        className={fieldClass}
        aria-label="Budget in rupees"
      />
    </WorkflowForm>
  );
}
