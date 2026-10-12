import type { Metadata } from "next";
import type { CSSProperties } from "react";
import {
  ArrowSquareOut,
  Bell,
  CalendarBlank,
  ChatCircleDots,
  ChatsCircle,
  CheckCircle,
  Circle,
  Clock,
  ClockCounterClockwise,
  Envelope,
  Files,
  GraduationCap,
  ListChecks,
  Path,
  PencilLine,
  ShieldCheck,
  Stamp,
  UserCircle,
  WarningCircle,
} from "@phosphor-icons/react/ssr";
import { AppShell, EmptyState, PageHead, Panel, Stat } from "@/components/app/shell";
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

  const firstName = actor.name.split(" ")[0];

  if (!record || !can(actor, "case.read", record)) {
    const user = await findById(actor.id);
    return (
      <AppShell actor={actor} current="/portal">
        <PageHead eyebrow="Student portal" title={`Hello, ${firstName}`} />
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

  // The four things a student opens this page to find out, read off the same
  // record the panels below show in full. Nothing here is estimated.
  const verified = record.documents.filter((document) => document.status === "Verified").length;
  const nextDeadline = [...record.deadlines]
    .map((deadline) => ({ ...deadline, days: daysUntil(deadline.date) }))
    .filter((deadline) => deadline.days >= 0)
    .sort((a, b) => a.days - b.days)[0];

  return (
    <AppShell actor={actor} current="/portal">
      <PageHead
        eyebrow="Student portal"
        title={`Hello, ${firstName}`}
        lede="Everything we hold on your case is on this page, and so is everything that is waiting on you."
      />
      <div className="shell mb-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Stat
          label="Your stage"
          icon={<Path size={22} weight="duotone" />}
          value={`${currentIndex + 1} of ${stages.length}`}
          note={currentStage.name}
        />
        <Stat
          label="Waiting on you"
          icon={<ListChecks size={22} weight="duotone" />}
          value={forStudent.length}
          note={forStudent.length === 0 ? "Your counsellor has the next move" : "Listed under what needs doing next"}
        />
        <Stat
          label="Next deadline"
          icon={<CalendarBlank size={22} weight="duotone" />}
          value={nextDeadline ? `${nextDeadline.days} ${nextDeadline.days === 1 ? "day" : "days"}` : "None"}
          note={nextDeadline ? `${nextDeadline.label}, ${nextDeadline.date}` : "No deadline has been entered"}
        />
        <Stat
          label="Documents verified"
          icon={<Files size={22} weight="duotone" />}
          value={`${verified} of ${record.documents.length}`}
          note="Each checked by a named person"
        />
      </div>

      <div className="shell grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        {/* content-start, like the column beside it. Without it this column
            stretched to the taller one's height and shared the difference
            between its panels as blank white space. */}
        <div className="grid content-start gap-6">
          <Panel
            icon={<Path size={22} weight="duotone" />}
            title="Where your application is"
            description={`${currentStage.name}. ${currentStage.summary}`}
          >
            <div className="px-6 py-6">
              <div className="mb-6">
                <p className="small figures mb-2 font-bold text-blue-dark">
                  Stage {currentIndex + 1} of {stages.length}
                </p>
                {/* One segment per stage; the list below names them. */}
                <ol className="Stage-track" aria-hidden>
                  {stages.map((stage, index) => (
                    <li
                      key={stage.key}
                      className={
                        index < currentIndex
                          ? "Stage-track__seg is-done"
                          : index === currentIndex
                            ? "Stage-track__seg is-current"
                            : "Stage-track__seg"
                      }
                      style={{ "--i": index } as CSSProperties}
                    />
                  ))}
                </ol>
              </div>

              <ol className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {stages.map((stage, index) => {
                  const done = index < currentIndex;
                  const active = index === currentIndex;
                  return (
                    <li
                      key={stage.key}
                      aria-current={active ? "step" : undefined}
                      className={
                        active
                          ? "flex items-center gap-2 rounded-input bg-light px-3 py-2"
                          : "flex items-center gap-2 rounded-input px-3 py-2"
                      }
                    >
                      {done ? (
                        <CheckCircle size={16} weight="fill" className="shrink-0 text-verified" aria-hidden />
                      ) : active ? (
                        <span className="Stage-pulse">
                          <Circle size={16} weight="fill" className="text-pink" aria-hidden />
                        </span>
                      ) : (
                        <Circle size={16} weight="regular" className="shrink-0 text-line-strong" aria-hidden />
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
            icon={<ListChecks size={22} weight="duotone" />}
            title="What needs doing next"
            description="Only the items that need something from you. Everything else sits with your counsellor."
          >
            {forStudent.length === 0 ? (
              <EmptyState
                headline="Nothing is waiting on you"
                body="Your counsellor has the next move. You will see it here when that changes."
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
            icon={<Files size={22} weight="duotone" />}
            title="Your documents"
            description="A document is verified only when a named person at Next Scholar has checked it against the original. No automated system can set that."
          >
            {record.documents.length === 0 ? (
              <EmptyState
                headline="No documents uploaded yet"
                body="Your counsellor will tell you which ones to send, and in what order."
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
            icon={<ChatCircleDots size={22} weight="duotone" />}
            title="Questions"
            description="The only place here where a machine answers you, and only from your own record."
          >
            <AskGuidance counselor={record.counselor} />
          </Panel>

          <Panel
            icon={<PencilLine size={22} weight="duotone" />}
            title="Your statement of purpose"
            description="Coaching only. Nothing here writes it for you."
          >
            <SopCoach />
          </Panel>
        </div>

        <div className="grid content-start gap-6">
          <Panel icon={<CalendarBlank size={22} weight="duotone" />} title="Deadlines">
            {record.deadlines.length === 0 ? (
              <EmptyState
                headline="No deadlines on file"
                body="None has been entered yet. That does not mean there are none."
              />
            ) : (
              <ul className="divide-y divide-line">
                {record.deadlines.map((deadline) => {
                  const days = daysUntil(deadline.date);
                  return (
                    <li
                      key={deadline.label}
                      className="flex items-center justify-between gap-4 px-6 py-4"
                    >
                      <div>
                        <p className="text-[0.9375rem] font-medium text-blue-dark">
                          {deadline.label}
                        </p>
                        <p className="figures mt-1 text-[0.8125rem] text-grey">{deadline.date}</p>
                      </div>
                      {/* How close it is, readable without doing the subtraction. */}
                      <span
                        className={
                          days <= 21
                            ? "figures shrink-0 rounded-input bg-denied-bg px-3 py-1 text-[0.8125rem] font-bold text-denied"
                            : "figures shrink-0 rounded-input bg-light px-3 py-1 text-[0.8125rem] font-bold text-blue-dark"
                        }
                      >
                        {days} {days === 1 ? "day" : "days"}
                      </span>
                    </li>
                  );
                })}
              </ul>
            )}
          </Panel>

          <Panel
            icon={<Stamp size={22} weight="duotone" />}
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

          <Panel icon={<UserCircle size={22} weight="duotone" />} title="Your counsellor">
            <div className="px-6 py-5">
              <p className="flex items-center gap-3 text-[0.9375rem] font-medium text-blue-dark">
                <span className="Avatar" aria-hidden>
                  {record.counselor
                    .split(" ")
                    .map((part) => part[0])
                    .slice(0, 2)
                    .join("")}
                </span>
                {record.counselor}
              </p>
              <p className="mt-3 text-[0.8125rem] leading-relaxed text-grey">
                Messages sent through the portal reach them directly. A public phone
                line and email will follow once the company is registered.
              </p>
            </div>
          </Panel>

          <Panel
            icon={<Bell size={22} weight="duotone" />}
            title="Notifications"
            description="Raised from dates and timestamps already on your file."
          >
            {notifications.length === 0 ? (
              <EmptyState
                headline="Nothing outstanding"
                body="Nothing on your case has reached a reminder point."
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
            icon={<ShieldCheck size={22} weight="duotone" />}
            title="What you have agreed to share"
            description="For each type of document, with who it goes to. You can withdraw at any time."
          >
            {consents.length === 0 ? (
              <EmptyState
                headline="No consent on file"
                body="Nothing has been collected. Nothing can be, without your written consent first."
              />
            ) : (
              <ConsentList consents={consents} />
            )}
          </Panel>

          <Panel
            icon={<Envelope size={22} weight="duotone" />}
            title="How we may contact you"
            description="Your permission for each channel. Turning one off stops messages on it completely."
          >
            <ChannelPreferences caseId={record.id} consents={channelConsents} />
          </Panel>

          <Panel
            icon={<ChatsCircle size={22} weight="duotone" />}
            title="What you and your counsellor have said"
            description="Your messages with us. Internal notes about your case are not shown, as they are not addressed to you."
          >
            {threads.length === 0 ? (
              <EmptyState
                headline="Nothing yet"
                body="Messages between you and your counsellor appear here."
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
            icon={<ClockCounterClockwise size={22} weight="duotone" />}
            title="What has happened"
            description="Written by people. Anything machine written is labelled."
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
      icon={<GraduationCap size={22} weight="duotone" />}
      title="Applications and offers"
      description="Every reference number and portal login we hold for you. We never show a chance of admission or a visa, here or anywhere else."
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
                  className="mt-3 inline-flex items-center gap-1.5 text-[0.8125rem] font-medium text-pink hover:text-blue-dark"
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
