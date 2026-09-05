"use client";

import { useActionState } from "react";

import { createTask, finishTask, rewriteSummary, setStage } from "@/app/actions/case-workflows";
import { resummarise } from "@/app/actions/case";
import { WorkflowForm, fieldClass } from "@/components/app/workflow-form";
import { stages } from "@/content/process";
import type { FollowUpTask } from "@/domain/case";
import type { WorkflowResult } from "@/app/actions/case-workflows";

/**
 * The manual controls the spec asks to exist before any agent does: a person
 * moving the stage, a person setting a follow up, a person rewriting a machine
 * written summary. None of them are automated, and all of them are logged.
 */
export function StageControl({ caseId, current }: { caseId: string; current: string }) {
  return (
    <WorkflowForm
      action={setStage}
      caseId={caseId}
      title="Move the stage"
      description="A person moves a case. Nothing here advances on a timer, and the stagnation clock restarts from the move."
      submitLabel="Move it"
    >
      <select name="stage" defaultValue={current} className={fieldClass} aria-label="Stage">
        {stages.map((stage) => (
          <option key={stage.key} value={stage.key}>
            {stage.name}
          </option>
        ))}
      </select>
    </WorkflowForm>
  );
}

export function TaskControl({
  caseId,
  tasks,
}: {
  caseId: string;
  tasks: FollowUpTask[];
}) {
  const open = tasks.filter((task) => !task.completedAt);
  const done = tasks.filter((task) => task.completedAt);

  return (
    <>
      {open.length > 0 && (
        <ul className="divide-y divide-line border-b border-line">
          {open.map((task) => (
            <li key={task.id} className="flex flex-wrap items-center justify-between gap-3 px-6 py-4">
              <div>
                <p className="text-[0.9375rem] text-navy-900">{task.title}</p>
                <p className="figures text-[0.75rem] text-muted">
                  Due {task.dueOn}, set by {task.createdBy}
                </p>
              </div>
              <CompleteTask caseId={caseId} taskId={task.id} />
            </li>
          ))}
        </ul>
      )}

      {done.length > 0 && (
        <ul className="divide-y divide-line border-b border-line">
          {done.map((task) => (
            <li key={task.id} className="px-6 py-3">
              <p className="text-[0.875rem] text-muted line-through">{task.title}</p>
              <p className="figures text-[0.75rem] text-muted">
                Done by {task.completedBy}
              </p>
            </li>
          ))}
        </ul>
      )}

      <WorkflowForm
        action={createTask}
        caseId={caseId}
        title="Set a follow up"
        description="It appears in your queue on the day it is due, and stays there until you close it."
        submitLabel="Set it"
      >
        <input
          name="title"
          type="text"
          placeholder="Chase the bank for the sanction letter"
          className={fieldClass}
          aria-label="What the follow up is"
        />
        <input name="dueOn" type="date" className={fieldClass} aria-label="Due date" />
      </WorkflowForm>
    </>
  );
}

function CompleteTask({ caseId, taskId }: { caseId: string; taskId: string }) {
  const [state, formAction, pending] = useActionState<WorkflowResult, FormData>(
    finishTask,
    { status: "idle" },
  );

  return (
    <form action={formAction} className="text-right">
      <input type="hidden" name="caseId" value={caseId} />
      <input type="hidden" name="taskId" value={taskId} />
      <button
        type="submit"
        disabled={pending}
        className="rounded-full border border-line-strong px-4 py-1.5 text-[0.8125rem] font-medium text-navy-900 transition-colors hover:border-blue-600 hover:text-blue-600 disabled:opacity-55"
      >
        {pending ? "Saving" : "Done"}
      </button>
      {state.status === "error" && (
        <p className="mt-1 text-[0.75rem] text-denied" role="alert">
          {state.message}
        </p>
      )}
    </form>
  );
}

export function SummaryOverride({
  caseId,
  current,
}: {
  caseId: string;
  current: string | null;
}) {
  return (
    <WorkflowForm
      action={rewriteSummary}
      caseId={caseId}
      title="Rewrite it yourself"
      description="An overridden summary stops being labelled machine written, because a person wrote it."
      submitLabel="Save as mine"
    >
      <textarea
        name="summary"
        rows={3}
        defaultValue={current ?? ""}
        placeholder="What is actually going on with this case."
        className={`${fieldClass} sm:col-span-2`}
        aria-label="Case summary"
      />
    </WorkflowForm>
  );
}

/**
 * The one-click version of what already happens on every note: the same
 * agent, over the case as it stands right now, without waiting for a new
 * note to trigger it.
 */
export function ResummariseButton({ caseId }: { caseId: string }) {
  return (
    <WorkflowForm
      action={resummarise}
      caseId={caseId}
      title="Read the case again"
      description="Runs the Case Summary agent now, over the case as it stands, rather than waiting for the next note."
      submitLabel="Summarise now"
    >
      <></>
    </WorkflowForm>
  );
}
