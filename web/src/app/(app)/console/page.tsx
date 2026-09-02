import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react/ssr";
import { AppShell, EmptyState, Panel } from "@/components/app/shell";
import { caseloadStats, listCases } from "@/data/store";
import { redirect } from "next/navigation";
import { currentActor } from "@/domain/session";
import { byPriority, detectEvents } from "@/domain/events";
import { daysSince } from "@/domain/case";
import type { Priority } from "@/domain/case";
import { assessRisk, RISK_DISCLAIMER } from "@/domain/risk";

export const metadata: Metadata = { title: "Counselor console" };

const priorityTone: Record<Priority, string> = {
  Urgent: "bg-denied-bg text-denied",
  High: "bg-pending-bg text-pending",
  Normal: "bg-neutral-chip-bg text-neutral-chip",
};

/** Reads live case state per request. Never a build time snapshot. */
export const dynamic = "force-dynamic";

export default async function ConsolePage() {
  const actor = await currentActor();
  if (!actor) redirect("/login");
  if (actor.role === "student") redirect("/portal");

  const mine = await listCases(actor);
  const { teamAverage } = await caseloadStats(actor);

  const rows = mine
    .map((record) => {
      const events = detectEvents(record).sort(byPriority);
      return {
        record,
        events,
        risk: assessRisk(record),
        stuckFor: daysSince(record.stageUpdatedAt),
      };
    })
    .sort((a, b) => {
      const rank: Record<Priority, number> = { Urgent: 0, High: 1, Normal: 2 };
      const byRank = rank[a.record.priority] - rank[b.record.priority];
      return byRank !== 0 ? byRank : b.stuckFor - a.stuckFor;
    });

  const followUps = rows
    .flatMap((row) => row.events)
    .filter((event) => event.audience === "counselor" && event.type !== "escalation")
    .sort(byPriority);

  const escalations = rows
    .flatMap((row) => row.events)
    .filter((event) => event.type === "escalation" || event.audience === "manager");

  return (
    <AppShell actor={actor} current="/console">
      <div className="shell grid gap-6">
        <div className="grid gap-6 lg:grid-cols-3">
          <Panel title="Your caseload">
            <div className="px-6 py-5">
              <p className="figures text-[1.75rem] font-semibold text-navy-900">
                {mine.length}
              </p>
              <p className="mt-1 text-[0.8125rem] text-muted">
                Team average {teamAverage}. Reassignment is a manager action.
              </p>
            </div>
          </Panel>
          <Panel title="Waiting on you">
            <div className="px-6 py-5">
              <p className="figures text-[1.75rem] font-semibold text-navy-900">
                {followUps.length}
              </p>
              <p className="mt-1 text-[0.8125rem] text-muted">
                Raised from stored dates and timestamps, never from a guess.
              </p>
            </div>
          </Panel>
          <Panel title="Escalated">
            <div className="px-6 py-5">
              <p className="figures text-[1.75rem] font-semibold text-navy-900">
                {escalations.length}
              </p>
              <p className="mt-1 text-[0.8125rem] text-muted">
                A manager decides the response. Nothing resolves itself.
              </p>
            </div>
          </Panel>
        </div>

        <Panel
          title="Cases assigned to you"
          description="Sorted by priority, then by how long a case has sat without moving."
        >
          {rows.length === 0 ? (
            <EmptyState
              headline="No cases assigned"
              body="Your caseload is empty. Nothing has been generated to fill the table."
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[52rem] border-collapse text-left">
                <thead>
                  <tr className="border-b border-line">
                    {["Student", "Route", "Stage", "Documents", "Open items", "Risk", ""].map(
                      (heading) => (
                        <th
                          key={heading}
                          scope="col"
                          className="px-6 py-3 text-[0.75rem] font-semibold text-muted"
                        >
                          {heading}
                        </th>
                      ),
                    )}
                  </tr>
                </thead>
                <tbody>
                  {rows.map(({ record, events, risk, stuckFor }) => (
                    <tr key={record.id} className="border-b border-line last:border-b-0">
                      <td className="px-6 py-4">
                        <p className="text-[0.9375rem] font-medium text-navy-900">
                          {record.name}
                        </p>
                        <span
                          className={`mt-1 inline-block rounded-input px-2 py-0.5 text-[0.6875rem] font-medium ${priorityTone[record.priority]}`}
                        >
                          {record.priority}
                        </span>
                        {record.needsManualReview && (
                          <span className="mt-1 ml-1.5 inline-block rounded-input bg-pending-bg px-2 py-0.5 text-[0.6875rem] font-medium text-pending">
                            Needs a person
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-[0.875rem] text-body">
                        {record.destination}
                        <span className="mt-0.5 block text-[0.8125rem] text-muted">
                          {record.intake}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-[0.875rem] capitalize text-body">
                        {record.stage.replace("-", " ")}
                        <span className="figures mt-0.5 block text-[0.8125rem] text-muted">
                          {stuckFor} days here
                        </span>
                      </td>
                      <td className="px-6 py-4 text-[0.875rem] text-body">
                        {record.docStatus}
                      </td>
                      <td className="figures px-6 py-4 text-[0.875rem] text-navy-900">
                        {events.length}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={
                            risk.band === "Needs attention"
                              ? "rounded-input bg-denied-bg px-2.5 py-1 text-[0.6875rem] font-medium text-denied"
                              : risk.band === "Watch"
                                ? "rounded-input bg-pending-bg px-2.5 py-1 text-[0.6875rem] font-medium text-pending"
                                : "rounded-input bg-verified-bg px-2.5 py-1 text-[0.6875rem] font-medium text-verified"
                          }
                        >
                          {risk.band}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link
                          href={`/console/${record.id}`}
                          className="inline-flex items-center gap-1.5 text-[0.875rem] font-medium text-blue-600 hover:text-blue-500"
                        >
                          Open
                          <ArrowRight size={14} weight="bold" aria-hidden />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <p className="border-t border-line px-6 py-3 text-[0.75rem] text-muted">
            {RISK_DISCLAIMER}
          </p>
        </Panel>

        <div className="grid gap-6 lg:grid-cols-2">
          <Panel
            title="Follow up queue"
            description="Each item names the stored value it was read from."
          >
            {followUps.length === 0 ? (
              <EmptyState
                headline="Nothing waiting"
                body="No stored date or timestamp on your caseload has crossed a threshold."
              />
            ) : (
              <ul className="divide-y divide-line">
                {followUps.map((event) => (
                  <li key={event.key} className="px-6 py-4">
                    <div className="flex items-start justify-between gap-4">
                      <p className="text-[0.9375rem] font-medium text-navy-900">
                        {event.title}
                      </p>
                      <span
                        className={`shrink-0 rounded-input px-2 py-0.5 text-[0.6875rem] font-medium ${priorityTone[event.priority]}`}
                      >
                        {event.priority}
                      </span>
                    </div>
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

          <Panel
            title="Escalations"
            description="Raised to a manager. The system never reassigns, resolves or closes."
          >
            {escalations.length === 0 ? (
              <EmptyState
                headline="Nothing escalated"
                body="No case has passed the second stagnation or response threshold."
              />
            ) : (
              <ul className="divide-y divide-line">
                {escalations.map((event) => (
                  <li key={event.key} className="px-6 py-4">
                    <p className="text-[0.9375rem] font-medium text-navy-900">
                      {event.title}
                    </p>
                    <p className="mt-1 text-[0.875rem] leading-relaxed text-body">
                      {event.detail}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </Panel>
        </div>
      </div>
    </AppShell>
  );
}
