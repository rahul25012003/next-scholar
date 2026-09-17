import type { Metadata } from "next";
import {
  CheckCircle,
  Circle,
  Clock,
  WarningCircle,
  ArrowSquareOut,
} from "@phosphor-icons/react/ssr";
import { AppShell, EmptyState, Panel } from "@/components/app/shell";
import { NewAccountState } from "@/components/app/new-account";
import { emptyOnboarding } from "@/domain/onboarding";
import { findById } from "@/data/users";
import {
  getCase,
  listCommunications,
  listChannelConsents,
  listConsents,
  listNotifications,
} from "@/data/store";
import { AskGuidance } from "@/components/app/ask-guidance";
import { SopCoach } from "@/components/app/sop-coach";
import { ConsentList } from "@/components/app/consent-list";
import { ChannelPreferences } from "@/components/app/channel-preferences";
import { redirect } from "next/navigation";
import { currentActor } from "@/domain/session";
import { can } from "@/domain/rbac";
import { detectEvents, byPriority } from "@/domain/events";
import { daysUntil, stageIndex, visaLabel } from "@/domain/case";
import type { DocStatus, StudentCase } from "@/domain/case";
import { stages } from "@/content/process";
import { channelLabel, forStudent as studentVisible } from "@/domain/communications";

export const metadata: Metadata = { title: "Student portal" };

const statusTone: Record<DocStatus, string> = {
  Verified: "text-verified",
  "In review": "text-pending",
  "Issue found": "text-denied",
  "Not started": "text-grey",
};

const statusIcon: Record<DocStatus, typeof CheckCircle> = {
  Verified: CheckCircle,
  "In review": Clock,
  "Issue found": WarningCircle,
  "Not started": Circle,
};

/** Reads live case state per request. Never a build time snapshot. */
export const dynamic = "force-dynamic";

export default async function PortalPage() {
  const actor = await currentActor();
  if (!actor) redirect("/login");
  if (actor.role !== "student") redirect("/console");

  const record = actor.caseId ? await getCase(actor.caseId, actor) : null;

  if (!record || !can(actor, "case.read", record)) {
    const user = await findById(actor.id);
    return (
      <AppShell actor={actor} current="/portal">
      <h1 className="sr-only">Student portal</h1>
        <div className="shell">
          <NewAccountState
            name={actor.name}
            profile={user?.onboarding ?? emptyOnboarding()}
          />
        </div>
      </AppShell>
    );
  }

  const events = detectEvents(record).sort(byPriority);
  const forStudent = events.filter(
    (event) => event.audience === "student" || event.audience === "student_and_counselor",
  );
  const currentIndex = stageIndex(record.stage);
  const currentStage = stages[currentIndex];
  const consents = await listConsents(record.id, actor);
  const notifications = await listNotifications(record.id, actor);
  const channelConsents = await listChannelConsents(record.id, actor);
  const threads = studentVisible(await listCommunications(record.id, actor));

  return (
    <AppShell actor={actor} current="/portal">
      <h1 className="sr-only">Student portal</h1>
      <div className="shell grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <div className="grid gap-6">
          <Panel
            title="Where your application is"
            description={`${currentStage.name}. ${currentStage.summary}`}
          >
            <div className="px-6 py-6">
              <ol className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {stages.map((stage, index) => {
                  const done = index < currentIndex;
                  const active = index === currentIndex;
                  return (
                    <li
                      key={stage.key}
                      className={
                        active
                          ? "flex items-center gap-2 rounded-input bg-light px-3 py-2"
                          : "flex items-center gap-2 rounded-input px-3 py-2"
                      }
                    >
                      {done ? (
                        <CheckCircle size={16} weight="fill" className="shrink-0 text-verified" aria-hidden />
                      ) : (
                        <Circle
                          size={16}
                          weight={active ? "fill" : "regular"}
                          className={active ? "shrink-0 text-pink" : "shrink-0 text-line-strong"}
                          aria-hidden
                        />
                      )}
                      <span
                        className={
                          active
                            ? "text-[0.875rem] font-medium text-blue-dark"
                            : done
                              ? "text-[0.875rem] text-grey"
                              : "text-[0.875rem] text-grey"
                        }
                      >
                        {stage.name}
                      </span>
                    </li>
                  );
                })}
              </ol>

              <div className="mt-6 rounded-card border border-line bg-light p-5">
                <p className="text-[0.8125rem] font-medium text-grey">
                  What we owe you at this stage
                </p>
                <p className="mt-1.5 text-[0.9375rem] leading-relaxed text-grey">
                  {currentStage.deliverable}
                </p>
              </div>
            </div>
          </Panel>

          <Panel
            title="What needs doing next"
            description="Only the items that need something from you. Everything else sits with your counselor."
          >
            {forStudent.length === 0 ? (
              <EmptyState
                headline="Nothing is waiting on you"
                body="Your counselor has the next move. You will see it here when that changes."
              />
            ) : (
              <ul className="divide-y divide-line">
                {forStudent.map((event) => (
                  <li key={event.key} className="flex items-start gap-3.5 px-6 py-4">
                    <WarningCircle
                      size={18}
                      weight="fill"
                      className={
                        event.priority === "Urgent"
                          ? "mt-0.5 shrink-0 text-denied"
                          : event.priority === "High"
                            ? "mt-0.5 shrink-0 text-pending"
                            : "mt-0.5 shrink-0 text-pink"
                      }
                      aria-hidden
                    />
                    <div>
                      <p className="text-[0.9375rem] font-medium text-blue-dark">
                        {event.title}
                      </p>
                      <p className="mt-1 text-[0.875rem] leading-relaxed text-grey">
                        {event.detail}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </Panel>

          <Panel
            title="Your documents"
            description="A document is verified only when a named person at Next Scholar has checked it against the original. No automated system can set that."
          >
            {record.documents.length === 0 ? (
              <EmptyState
                headline="No documents uploaded yet"
                body="Your counselor will tell you which ones to send, and in what order."
              />
            ) : (
              <ul className="divide-y divide-line">
                {record.documents.map((document) => {
                  const Icon = statusIcon[document.status];
                  return (
                    <li
                      key={document.id}
                      className="flex flex-wrap items-start justify-between gap-4 px-6 py-4"
                    >
                      <div className="flex items-start gap-3.5">
                        <Icon
                          size={18}
                          weight="fill"
                          className={`mt-0.5 shrink-0 ${statusTone[document.status]}`}
                          aria-hidden
                        />
                        <div>
                          <p className="text-[0.9375rem] font-medium text-blue-dark">
                            {document.name}
                          </p>
                          <p className="mt-0.5 text-[0.8125rem] text-grey">
                            Version {document.version}
                            {document.verifiedBy
                              ? `, verified by ${document.verifiedBy}`
                              : ", not verified yet"}
                          </p>
                          {document.issue && (
                            <p className="mt-1.5 max-w-md text-[0.875rem] leading-relaxed text-denied">
                              {document.issue}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`text-[0.8125rem] font-medium ${statusTone[document.status]}`}>
                          {document.status}
                        </p>
                        {document.expiresOn && (
                          <p className="figures mt-0.5 text-[0.75rem] text-grey">
                            Expires {document.expiresOn}
                          </p>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </Panel>

          <Offers record={record} />

          <Panel
            title="Questions"
            description="The one place a machine answers you here, and only from your own record."
          >
            <AskGuidance counselor={record.counselor} />
          </Panel>

          <Panel
            title="Your statement of purpose"
            description="Coaching only. Nothing here writes it for you, by design and by permission."
          >
            <SopCoach />
          </Panel>
        </div>

        <div className="grid content-start gap-6">
          <Panel title="Deadlines">
            {record.deadlines.length === 0 ? (
              <EmptyState
                headline="No deadlines on file"
                body="Nothing has been entered. That means nothing is known, not that nothing exists."
              />
            ) : (
              <ul className="divide-y divide-line">
                {record.deadlines.map((deadline) => {
                  const days = daysUntil(deadline.date);
                  return (
                    <li key={deadline.label} className="px-6 py-4">
                      <p className="text-[0.9375rem] font-medium text-blue-dark">
                        {deadline.label}
                      </p>
                      <p className="figures mt-1 text-[0.8125rem] text-grey">
                        {deadline.date}, {days} {days === 1 ? "day" : "days"} away
                      </p>
                    </li>
                  );
                })}
              </ul>
            )}
          </Panel>

          <Panel
            title="Visa"
            description="Recorded by a person when it happens. Nothing here is predicted."
          >
            <div className="px-6 py-5">
              <p className="text-[0.9375rem] font-medium text-blue-dark">
                {visaLabel[record.visa.state]}
              </p>
              <p className="mt-1.5 text-[0.875rem] leading-relaxed text-grey">
                {record.visa.note ??
                  "The visa file is built after an offer is accepted and the funding is in place."}
              </p>
              {record.visa.decidedOn && (
                <p className="figures mt-1.5 text-[0.75rem] text-grey">
                  Decided {record.visa.decidedOn}
                </p>
              )}
            </div>
          </Panel>

          <Panel title="Your counselor">
            <div className="px-6 py-5">
              <p className="text-[0.9375rem] font-medium text-blue-dark">
                {record.counselor}
              </p>
              <p className="mt-1 text-[0.8125rem] leading-relaxed text-grey">
                Messages sent through the portal reach them directly. A published
                phone line and email arrive with the registered entity.
              </p>
            </div>
          </Panel>

          <Panel
            title="Notifications"
            description="Raised from dates and timestamps already on your file."
          >
            {notifications.length === 0 ? (
              <EmptyState
                headline="Nothing outstanding"
                body="No threshold on your case has been crossed."
              />
            ) : (
              <ul className="divide-y divide-line">
                {notifications
                  .filter((item) => item.channel === "in_app")
                  .map((item) => (
                    <li key={item.id} className="px-6 py-4">
                      <p className="text-[0.875rem] leading-relaxed text-grey">
                        {item.body}
                      </p>
                      <p className="figures mt-1.5 text-[0.75rem] text-grey">
                        {item.createdAt.slice(0, 10)}, {item.priority.toLowerCase()} priority
                      </p>
                    </li>
                  ))}
              </ul>
            )}
          </Panel>

          <Panel
            title="What you have agreed to share"
            description="Per document category, naming who it goes to. Withdrawable at any time."
          >
            {consents.length === 0 ? (
              <EmptyState
                headline="No consent on file"
                body="Nothing has been collected, because nothing may be collected without your written consent first."
              />
            ) : (
              <ConsentList consents={consents} />
            )}
          </Panel>

          <Panel
            title="How we may contact you"
            description="The permission, recorded per channel. The notification planner refuses to queue a message on a channel with no live opt in, so turning one off actually stops messages rather than filtering them."
          >
            <ChannelPreferences caseId={record.id} consents={channelConsents} />
          </Panel>

          <Panel
            title="What you and your counselor have said"
            description="Your correspondence with us. Internal notes about your case are not shown here, because they are not addressed to you."
          >
            {threads.length === 0 ? (
              <EmptyState
                headline="Nothing yet"
                body="Messages between you and your counselor appear here."
              />
            ) : (
              <ul className="divide-y divide-line">
                {threads.map((thread) => (
                  <li key={thread.id} className="px-6 py-4">
                    <div className="flex flex-wrap items-baseline justify-between gap-3">
                      <p className="text-[0.8125rem] font-medium text-blue-dark">
                        {channelLabel[thread.channel]}
                        {thread.direction === "inbound" ? ", from you" : ", from us"}
                      </p>
                      <p className="figures text-[0.75rem] text-grey">
                        {thread.occurredAt.slice(0, 10)}
                      </p>
                    </div>
                    <p className="mt-1.5 text-[0.875rem] leading-relaxed text-grey">
                      {thread.raw}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </Panel>

          <Panel
            title="What has happened"
            description="Written by people. Machine written entries are labelled as such."
          >
            <ol className="divide-y divide-line">
              {[...record.log].reverse().map((entry) => (
                <li key={entry.ts + entry.text} className="px-6 py-4">
                  <p className="text-[0.875rem] leading-relaxed text-grey">
                    {entry.text}
                  </p>
                  <p className="figures mt-1.5 text-[0.75rem] text-grey">
                    {entry.ts.slice(0, 10)}, {entry.author}
                    {entry.source === "ai" ? ", machine written" : ""}
                  </p>
                </li>
              ))}
            </ol>
          </Panel>
        </div>
      </div>
    </AppShell>
  );
}

function Offers({ record }: { record: StudentCase }) {
  const decided = record.applications.filter((item) => item.outcome !== "withdrawn");

  return (
    <Panel
      title="Applications and offers"
      description="Every reference number and portal login we hold on your behalf. No admission or visa likelihood is shown here, or anywhere else."
    >
      {decided.length === 0 ? (
        <EmptyState
          headline="No applications submitted yet"
          body="They appear here the moment one is filed, with the reference number attached."
        />
      ) : (
        <ul className="divide-y divide-line">
          {decided.map((application) => (
            <li key={application.id} className="px-6 py-5">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-[0.9375rem] font-medium text-blue-dark">
                    {application.university}
                  </p>
                  <p className="mt-0.5 text-[0.875rem] text-grey">
                    {application.programme}
                  </p>
                </div>
                <span
                  className={
                    application.outcome === "offer"
                      ? "rounded-input bg-verified-bg px-2.5 py-1 text-[0.6875rem] font-medium capitalize text-verified"
                      : application.outcome === "rejected"
                        ? "rounded-input bg-denied-bg px-2.5 py-1 text-[0.6875rem] font-medium capitalize text-denied"
                        : "rounded-input bg-neutral-chip-bg px-2.5 py-1 text-[0.6875rem] font-medium capitalize text-neutral-chip"
                  }
                >
                  {application.outcome}
                </span>
              </div>

              <dl className="mt-4 grid gap-x-8 gap-y-2 sm:grid-cols-2">
                <div className="flex items-baseline gap-3">
                  <dt className="text-[0.8125rem] text-grey">Reference</dt>
                  <dd className="figures text-[0.8125rem] text-blue-dark">
                    {application.reference ?? "Not issued"}
                  </dd>
                </div>
                <div className="flex items-baseline gap-3">
                  <dt className="text-[0.8125rem] text-grey">Submitted</dt>
                  <dd className="figures text-[0.8125rem] text-blue-dark">
                    {application.submittedOn ?? "Not yet"}
                  </dd>
                </div>
              </dl>

              {application.outcomeNote && (
                <p className="mt-3 text-[0.875rem] leading-relaxed text-grey">
                  {application.outcomeNote}
                </p>
              )}

              {application.portalUrl && (
                <a
                  href={application.portalUrl}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="mt-3 inline-flex items-center gap-1.5 text-[0.8125rem] font-medium text-pink hover:text-blue"
                >
                  <ArrowSquareOut size={14} weight="bold" aria-hidden />
                  {application.portalUrl}
                </a>
              )}
            </li>
          ))}
        </ul>
      )}
    </Panel>
  );
}
