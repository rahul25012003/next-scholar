import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Sparkle } from "@phosphor-icons/react/ssr";
import { AppShell, EmptyState, Panel } from "@/components/app/shell";
import { NoteForm } from "@/components/app/note-form";
import { Copilot } from "@/components/app/copilot";
import { CaseWorkflows } from "@/components/app/case-workflows";
import { ThreadSummary } from "@/components/app/thread-summary";
import { DocumentIntelligence } from "@/components/app/document-intelligence";
import { ReviewFlag } from "@/components/app/review-flag";
import { StageControl, TaskControl, SummaryOverride } from "@/components/app/case-controls";
import { VerifyDocument } from "@/components/app/verify-document";
import { getCase, getExtraction, listCommunications } from "@/data/store";
import { demoCounselor } from "@/domain/demo-actors";
import { byPriority, detectEvents } from "@/domain/events";
import { assessRisk, RISK_DISCLAIMER } from "@/domain/risk";
import { agentAvailability } from "@/domain/agents/kernel";
import { daysSince } from "@/domain/case";
import { stages } from "@/content/process";
import { checkCompleteness } from "@/domain/completeness";
import { buildHandoverPacket } from "@/domain/counselor-ops";
import { proposeShortlist } from "@/domain/matching";
import { channelLabel, newestFirst } from "@/domain/communications";

export default async function CaseDetailPage(props: PageProps<"/console/[caseId]">) {
  const { caseId } = await props.params;
  const record = await getCase(caseId, demoCounselor);

  // A case outside this counselor's caseload is a 404, not a 403. The store has
  // already refused the read and logged the refusal; answering "you may not see
  // this" would confirm the record exists to someone who may not know that.
  if (!record) notFound();

  const events = detectEvents(record).sort(byPriority);
  const risk = assessRisk(record);
  const stage = stages.find((item) => item.key === record.stage);
  const agents = agentAvailability();
  const completeness = checkCompleteness(record);
  const handover = buildHandoverPacket(record);
  const shortlist = record.budgetInr
    ? proposeShortlist({ budgetInr: record.budgetInr })
    : null;
  const threads = newestFirst(await listCommunications(record.id, demoCounselor));
  const extractions = await Promise.all(
    record.documents.map(async (document) => [
      document.id,
      await getExtraction(document.id),
    ] as const),
  );
  const extractionFor = new Map(extractions);

  return (
    <AppShell actor={demoCounselor} current="/console">
      <div className="shell grid gap-6">
        <div>
          <Link
            href="/console"
            className="inline-flex items-center gap-1.5 text-[0.875rem] font-medium text-blue-600 hover:text-blue-500"
          >
            <ArrowLeft size={14} weight="bold" aria-hidden />
            All cases
          </Link>
          <h1 className="mt-3 font-display text-[1.75rem] font-bold text-navy-900">
            {record.name}
          </h1>
          <p className="mt-1 text-[0.9375rem] text-body">
            {record.destination}, {record.intake}. At {stage?.name.toLowerCase()} for{" "}
            <span className="figures">{daysSince(record.stageUpdatedAt)}</span> days.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
          <div className="grid content-start gap-6">
            <Panel
              title="Case summary"
              description="Written by the Case Summary agent. It can write these two fields and nothing else."
            >
              <div className="px-6 py-5">
                {record.summary ? (
                  <>
                    <div className="flex items-start gap-2.5">
                      <Sparkle size={16} weight="fill" className="mt-1 shrink-0 text-blue-600" aria-hidden />
                      <p className="text-[0.9375rem] leading-relaxed text-ink-soft">
                        {record.summary}
                      </p>
                    </div>
                    {record.suggestedAction && (
                      <p className="mt-4 rounded-card bg-surface p-4 text-[0.875rem] leading-relaxed text-ink-soft">
                        Suggested next step: {record.suggestedAction}
                      </p>
                    )}
                    <p className="mt-3 text-[0.75rem] text-muted">
                      {record.summarySource === "human"
                        ? "Written by a person."
                        : "Machine written. It cannot change the stage, the priority or a document status."}
                    </p>
                  </>
                ) : (
                  <div>
                    <p className="text-[0.9375rem] leading-relaxed text-body">
                      No machine summary on this case. Read the log below.
                    </p>
                    <p className="mt-2 text-[0.8125rem] leading-relaxed text-muted">
                      {agents.note}
                    </p>
                  </div>
                )}
              </div>
            </Panel>

            {record.needsManualReview && (
              <Panel
                title="Needs a person"
                description="Nothing falls through quietly. A note an agent could not read stays flagged here until someone says they have read it."
              >
                <ReviewFlag caseId={record.id} flag={record.needsManualReview} />
              </Panel>
            )}

            <Panel title="Notes">
              <NoteForm caseId={record.id} />
              <SummaryOverride caseId={record.id} current={record.summary} />
            </Panel>

            <Panel
              title="Follow ups"
              description="Things you decided to do later. An event is what the system noticed; this is what you chose."
            >
              <TaskControl caseId={record.id} tasks={record.tasks} />
            </Panel>

            <Panel
              title="Draft a message"
              description="The copilot writes. You send. It holds no send capability at all."
            >
              <Copilot caseId={record.id} />
            </Panel>

            <Panel
              title="Completeness"
              description="Checked against the human curated requirement list, and nothing else."
            >
              {completeness.state === "unknown" ? (
                <EmptyState headline="Requirements not verified" body={completeness.reason} />
              ) : (
                <div className="px-6 py-5">
                  <ul className="divide-y divide-line">
                    {completeness.documents.map((document) => (
                      <li
                        key={document.label}
                        className="flex items-baseline justify-between gap-6 py-2.5 first:pt-0"
                      >
                        <span className="text-[0.9375rem] text-ink-soft">
                          {document.label}
                        </span>
                        <span
                          className={
                            document.present
                              ? "text-[0.8125rem] font-medium text-verified"
                              : "text-[0.8125rem] font-medium text-pending"
                          }
                        >
                          {document.status}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <p className="mt-4 text-[0.8125rem] leading-relaxed text-muted">
                    {completeness.note}
                  </p>
                  <p className="mt-2 text-[0.8125rem] leading-relaxed text-muted">
                    Remaining process steps: {completeness.steps.join(". ")}.
                  </p>
                </div>
              )}
            </Panel>

            <Panel
              title="Documents"
              description="Reading a document proposes values. Confirming one is a person putting their name to it. No agent has a capability that reaches either the document status or the case record."
            >
              {record.documents.length === 0 ? (
                <EmptyState
                  headline="No documents"
                  body="Nothing has been uploaded to this case yet."
                />
              ) : (
                <ul className="divide-y divide-line">
                  {record.documents.map((document) => (
                    <li
                      key={document.id}
                      className="flex flex-wrap items-start justify-between gap-4 px-6 py-4"
                    >
                      <div>
                        <p className="text-[0.9375rem] font-medium text-navy-900">
                          {document.name}
                        </p>
                        <p className="mt-0.5 text-[0.8125rem] text-muted">
                          {document.status}, version {document.version}
                          {document.verifiedBy ? `, by ${document.verifiedBy}` : ""}
                        </p>
                        {document.issue && (
                          <p className="mt-1.5 max-w-md text-[0.875rem] leading-relaxed text-denied">
                            {document.issue}
                          </p>
                        )}
                        <DocumentIntelligence
                          caseId={record.id}
                          documentId={document.id}
                          documentName={document.name}
                          extraction={extractionFor.get(document.id) ?? null}
                        />
                      </div>
                      {document.status !== "Verified" && (
                        <VerifyDocument
                          caseId={record.id}
                          documentId={document.id}
                          documentName={document.name}
                        />
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </Panel>

            <Panel
              title="Communication history"
              description="The raw thread, kept as received. The summary line beside it is written by an agent that cannot edit what it summarises."
            >
              {threads.length === 0 ? (
                <EmptyState
                  headline="No correspondence"
                  body="Nothing has passed between this student and us yet."
                />
              ) : (
                <ul className="divide-y divide-line">
                  {threads.map((thread) => (
                    <li key={thread.id} className="px-6 py-5">
                      <div className="flex flex-wrap items-baseline justify-between gap-3">
                        <p className="text-[0.875rem] font-medium text-navy-900">
                          {channelLabel[thread.channel]}, {thread.direction}
                        </p>
                        <p className="figures text-[0.75rem] text-muted">
                          {thread.occurredAt.slice(0, 10)}
                        </p>
                      </div>
                      <p className="mt-0.5 text-[0.75rem] text-muted">
                        {thread.participants}
                      </p>
                      <p className="mt-2 text-[0.9375rem] leading-relaxed text-ink-soft">
                        {thread.raw}
                      </p>
                      <ThreadSummary
                        caseId={record.id}
                        communicationId={thread.id}
                        existing={thread.summary}
                      />
                    </li>
                  ))}
                </ul>
              )}
            </Panel>

            <Panel
              title="Case operations"
              description="Every one of these is a person taking an action. None of them run on a timer, and each writes its reason into the log before the state changes."
            >
              <StageControl caseId={record.id} current={record.stage} />
              <CaseWorkflows caseId={record.id} applications={record.applications} />
            </Panel>

            <Panel
              title="Case log"
              description="Every entry carries whether a person or a machine wrote it."
            >
              <ol className="divide-y divide-line">
                {[...record.log].reverse().map((entry) => (
                  <li key={entry.ts + entry.text} className="px-6 py-4">
                    <p className="text-[0.9375rem] leading-relaxed text-ink-soft">
                      {entry.text}
                    </p>
                    <p className="figures mt-1.5 text-[0.75rem] text-muted">
                      {entry.ts.slice(0, 16).replace("T", " ")}, {entry.author},{" "}
                      {entry.source === "human" ? "written by a person" : `written by ${entry.source}`}
                    </p>
                  </li>
                ))}
              </ol>
            </Panel>
          </div>

          <div className="grid content-start gap-6">
            <Panel
              title="Risk indicators"
              description={RISK_DISCLAIMER}
            >
              <div className="px-6 py-5">
                <span
                  className={
                    risk.band === "Needs attention"
                      ? "inline-block rounded-input bg-denied-bg px-2.5 py-1 text-[0.75rem] font-medium text-denied"
                      : risk.band === "Watch"
                        ? "inline-block rounded-input bg-pending-bg px-2.5 py-1 text-[0.75rem] font-medium text-pending"
                        : "inline-block rounded-input bg-verified-bg px-2.5 py-1 text-[0.75rem] font-medium text-verified"
                  }
                >
                  {risk.band}
                </span>
                {risk.indicators.length === 0 ? (
                  <p className="mt-4 text-[0.875rem] leading-relaxed text-body">
                    Nothing on this case has crossed a threshold.
                  </p>
                ) : (
                  <ul className="mt-4 space-y-4">
                    {risk.indicators.map((indicator) => (
                      <li key={indicator.factor + indicator.evidence}>
                        <p className="text-[0.875rem] font-medium text-navy-900">
                          {indicator.factor}
                        </p>
                        <p className="mt-1 text-[0.875rem] leading-relaxed text-body">
                          {indicator.evidence}
                        </p>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </Panel>

            <Panel title="Open items">
              {events.length === 0 ? (
                <EmptyState
                  headline="Nothing open"
                  body="No stored date or timestamp on this case has crossed a threshold."
                />
              ) : (
                <ul className="divide-y divide-line">
                  {events.map((event) => (
                    <li key={event.key} className="px-6 py-4">
                      <p className="text-[0.875rem] font-medium text-navy-900">
                        {event.title}
                      </p>
                      <p className="mt-1 text-[0.875rem] leading-relaxed text-body">
                        {event.detail}
                      </p>
                      <p className="mt-1.5 text-[0.75rem] text-muted">
                        Read from: {event.basis}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </Panel>

            {shortlist && (
              <Panel
                title="Shortlist proposal"
                description="Every entry states its reason and carries the commission we would earn. A counselor reviews before the student sees it."
              >
                <ul className="divide-y divide-line">
                  {shortlist.proposals.map((proposal) => (
                    <li key={proposal.destination + (proposal.route ?? "")} className="px-6 py-4">
                      <p className="text-[0.9375rem] font-medium text-navy-900">
                        {proposal.destination}
                        {proposal.route ? `, ${proposal.route}` : ""}
                      </p>
                      <ul className="mt-2 space-y-1">
                        {proposal.reasons.map((reason) => (
                          <li key={reason} className="text-[0.875rem] leading-relaxed text-body">
                            {reason}
                          </li>
                        ))}
                      </ul>
                      <p className="figures mt-2 text-[0.8125rem] text-navy-900">
                        We earn {proposal.commission.display}
                      </p>
                      <p className="text-[0.75rem] text-muted">
                        {proposal.commission.statusLabel}
                        {proposal.commission.flag ? `, ${proposal.commission.flag.toLowerCase()}` : ""}
                      </p>
                    </li>
                  ))}
                  {shortlist.excluded.map((entry) => (
                    <li key={entry.destination} className="px-6 py-4">
                      <p className="text-[0.9375rem] text-muted">
                        {entry.destination}, excluded
                      </p>
                      <p className="mt-1 text-[0.875rem] leading-relaxed text-body">
                        {entry.why}
                      </p>
                    </li>
                  ))}
                </ul>
              </Panel>
            )}

            <Panel
              title="Handover packet"
              description="Generated from stored state, so a case changing hands does not depend on anyone remembering."
            >
              <div className="px-6 py-5">
                <p className="text-[0.875rem] leading-relaxed text-ink-soft">
                  {handover.summary}
                </p>
                <dl className="mt-4 space-y-2">
                  <div>
                    <dt className="text-[0.75rem] text-muted">Open tasks</dt>
                    <dd className="figures text-[0.875rem] text-navy-900">
                      {handover.openTasks.length}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-[0.75rem] text-muted">Documents outstanding</dt>
                    <dd className="text-[0.875rem] text-navy-900">
                      {handover.pendingDocuments.length === 0
                        ? "None"
                        : handover.pendingDocuments.join(", ")}
                    </dd>
                  </div>
                </dl>
                <p className="mt-4 text-[0.75rem] leading-relaxed text-muted">
                  {handover.acknowledgement}
                </p>
              </div>
            </Panel>

            <Panel title="Applications">
              {record.applications.length === 0 ? (
                <EmptyState
                  headline="None submitted"
                  body="Nothing has been filed on this case yet."
                />
              ) : (
                <ul className="divide-y divide-line">
                  {record.applications.map((application) => (
                    <li key={application.id} className="px-6 py-4">
                      <p className="text-[0.9375rem] font-medium text-navy-900">
                        {application.university}
                      </p>
                      <p className="mt-0.5 text-[0.875rem] text-body">
                        {application.programme}
                      </p>
                      <p className="figures mt-1.5 text-[0.75rem] text-muted">
                        {application.reference ?? "No reference"},{" "}
                        {application.outcome}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </Panel>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
