"use client";

import {
  addPreDepartureChecklist,
  correct,
  defer,
  linkStudent,
  reapply,
  recordOffer,
  recordVisa,
} from "@/app/actions/case-workflows";
import { WorkflowForm, fieldClass } from "@/components/app/workflow-form";
import { visaLabel } from "@/domain/case";
import type { ApplicationRecord, VisaState } from "@/domain/case";

const visaStates: VisaState[] = [
  "not-started",
  "preparing",
  "submitted",
  "approved",
  "refused",
];

export function CaseWorkflows({
  caseId,
  applications,
}: {
  caseId: string;
  applications: ApplicationRecord[];
}) {
  return (
    <>
      <WorkflowForm
        action={linkStudent}
        caseId={caseId}
        title="Link a student account"
        description="Connects the student's own account to this case, so their portal has something to show. Needed whichever order this and their signup happened in: opening a case and creating an account have no way to find each other on their own."
        submitLabel="Link it"
      >
        <input
          name="email"
          type="email"
          placeholder="Student's account email"
          className={`${fieldClass} sm:col-span-2`}
          aria-label="Student's account email"
        />
      </WorkflowForm>

      <WorkflowForm
        action={recordVisa}
        caseId={caseId}
        title="Record a visa outcome"
        description="An approval and a refusal are recorded the same way, because the quarterly report publishes both."
        submitLabel="Record the outcome"
      >
        <select name="state" defaultValue="" className={fieldClass} aria-label="Visa state">
          <option value="">Select a state</option>
          {visaStates.map((state) => (
            <option key={state} value={state}>
              {visaLabel[state]}
            </option>
          ))}
        </select>
        <input
          name="note"
          type="text"
          placeholder="What the decision said"
          className={fieldClass}
          aria-label="Note on the visa decision"
        />
      </WorkflowForm>

      {applications.length > 0 && (
        <>
          <WorkflowForm
            action={recordOffer}
            caseId={caseId}
            title="Record an application outcome"
            description="A withdrawal marks the application withdrawn. It never removes it from the record."
            submitLabel="Record it"
          >
            <select
              name="applicationId"
              defaultValue=""
              className={fieldClass}
              aria-label="Application"
            >
              <option value="">Select an application</option>
              {applications.map((application) => (
                <option key={application.id} value={application.id}>
                  {application.university}
                </option>
              ))}
            </select>
            <select name="outcome" defaultValue="" className={fieldClass} aria-label="Outcome">
              <option value="">Select an outcome</option>
              <option value="offer">Offer</option>
              <option value="rejected">Rejected</option>
              <option value="deferred">Deferred</option>
              <option value="withdrawn">Withdrawn</option>
            </select>
            <input
              name="note"
              type="text"
              placeholder="Conditions, reasons, anything the student needs"
              className={`${fieldClass} sm:col-span-2`}
              aria-label="Note on the outcome"
            />
            <p className="text-[0.75rem] text-muted sm:col-span-2">
              The three fields below are only saved when the outcome is Offer.
            </p>
            <input
              name="depositInr"
              type="text"
              inputMode="numeric"
              placeholder="Deposit amount, INR"
              className={fieldClass}
              aria-label="Deposit amount in rupees"
            />
            <input
              name="depositDeadline"
              type="date"
              className={fieldClass}
              aria-label="Deposit deadline"
            />
            <input
              name="scholarshipNote"
              type="text"
              placeholder="Scholarship attached, if any"
              className={`${fieldClass} sm:col-span-2`}
              aria-label="Scholarship attached to the offer"
            />
          </WorkflowForm>

          <WorkflowForm
            action={reapply}
            caseId={caseId}
            title="Open a reapplication"
            description="Linked to the application it replaces, so the history reads as one story rather than two unrelated records."
            submitLabel="Open it"
          >
            <select
              name="supersedes"
              defaultValue=""
              className={fieldClass}
              aria-label="Application being replaced"
            >
              <option value="">Replaces which application</option>
              {applications.map((application) => (
                <option key={application.id} value={application.id}>
                  {application.university}
                </option>
              ))}
            </select>
            <input
              name="university"
              type="text"
              placeholder="University"
              className={fieldClass}
              aria-label="University"
            />
            <input
              name="programme"
              type="text"
              placeholder="Programme"
              className={`${fieldClass} sm:col-span-2`}
              aria-label="Programme"
            />
          </WorkflowForm>
        </>
      )}

      <WorkflowForm
        action={defer}
        caseId={caseId}
        title="Defer to a later intake"
        description="Every deadline on the case moves with the intake, rather than being left behind to go quietly wrong."
        submitLabel="Defer"
      >
        <input
          name="intake"
          type="text"
          placeholder="April 2028"
          className={fieldClass}
          aria-label="New intake"
        />
        <input
          name="shiftDays"
          type="number"
          placeholder="Days to move the dates"
          className={fieldClass}
          aria-label="Days to shift the deadlines"
        />
      </WorkflowForm>

      <WorkflowForm
        action={addPreDepartureChecklist}
        caseId={caseId}
        title="Add the pre-departure checklist"
        description="Accommodation, insurance, flights, banking and an arrival briefing, the five items the pre-departure stage already promises. Appears in the follow up queue below, same as any other task. Safe to click twice: nothing already on the case is duplicated."
        submitLabel="Add it"
      >
        <input
          name="dueOn"
          type="date"
          className={fieldClass}
          aria-label="Due by"
        />
      </WorkflowForm>

      <WorkflowForm
        action={correct}
        caseId={caseId}
        title="Correct a value"
        description="The old value stays in the log with your reason. A correction is not an overwrite."
        submitLabel="Correct it"
      >
        <select name="field" defaultValue="" className={fieldClass} aria-label="Field">
          <option value="">Which field</option>
          <option value="name">Name</option>
          <option value="intake">Intake</option>
          <option value="destination">Destination</option>
          <option value="priority">Priority</option>
          <option value="budgetInr">Budget</option>
          <option value="counselor">Counsellor</option>
          <option value="deadline">A deadline (name it below)</option>
          <option value="reference">An application reference (name the application below)</option>
        </select>
        <input
          name="value"
          type="text"
          placeholder="New value"
          className={fieldClass}
          aria-label="New value"
        />
        <input
          name="targetId"
          type="text"
          placeholder="Deadline label or application id, only for those two"
          className={`${fieldClass} sm:col-span-2`}
          aria-label="Which deadline or application this correction is on"
        />
        <input
          name="reason"
          type="text"
          placeholder="Why it changed"
          className={`${fieldClass} sm:col-span-2`}
          aria-label="Reason for the correction"
        />
      </WorkflowForm>
    </>
  );
}
