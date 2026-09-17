import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react/ssr";
import { AppShell, EmptyState, Panel } from "@/components/app/shell";
import { OpenCaseForm } from "@/components/app/open-case-form";
import { caseloadStats, listCases } from "@/data/store";
import { redirect } from "next/navigation";
import { currentActor } from "@/domain/session";
import { byPriority, detectEvents } from "@/domain/events";
import { daysSince } from "@/domain/case";
import type { Priority } from "@/domain/case";
import { assessRisk, RISK_DISCLAIMER } from "@/domain/risk";
import { slaLabel, worstSla, type SlaState } from "@/domain/sla";
import { stages } from "@/content/process";

export const metadata: Metadata = { title: "Counselor console" };

const priorityTone: Record<Priority, string> = {
  Urgent: "bg-denied-bg text-denied",
  High: "bg-pending-bg text-pending",
  Normal: "bg-neutral-chip-bg text-neutral-chip",
};

/** Reads live case state per request. Never a build time snapshot. */
export const dynamic = "force-dynamic";

const rank: Record<Priority, number> = { Urgent: 0, High: 1, Normal: 2 };
const slaRank: Record<SlaState, number> = {
  breached: 0,
  due: 1,
  within: 2,
  "not-applicable": 3,
};

/**
 * Sort options, each stating what it orders by. The default is the one a
 * counsellor actually needs on opening the page, and it is named rather than
 * being an unexplained "smart" order.
 */
const sorts = [
  { key: "priority", label: "Priority, then how long it has been stuck" },
  { key: "sla", label: "Service level, worst first" },
  { key: "stuck", label: "Longest without moving" },
  { key: "open", label: "Most open items" },
  { key: "name", label: "Student name, A to Z" },
];

export default async function ConsolePage(props: PageProps<"/console">) {
  const actor = await currentActor();
  if (!actor) redirect("/login");
  if (actor.role === "student") redirect("/portal");

  const params = await props.searchParams;
  const text = (key: string) => (typeof params[key] === "string" ? params[key] : "");
  const query = text("q").trim().toLowerCase();
  const stageFilter = text("stage");
  const priorityFilter = text("priority");
  const slaFilter = text("sla");
  const sort = text("sort") || "priority";

  const mine = await listCases(actor);
  const { teamAverage } = await caseloadStats(actor);

  const all = mine.map((record) => ({
    record,
    events: detectEvents(record).sort(byPriority),
    risk: assessRisk(record),
    stuckFor: daysSince(record.stageUpdatedAt),
    sla: worstSla(record),
  }));

  const rows = all
    .filter(({ record, sla }) => {
      if (query) {
        const haystack = [record.name, record.destination, record.route ?? "", record.intake]
          .join(" ")
          .toLowerCase();
        if (!haystack.includes(query)) return false;
      }
      if (stageFilter && record.stage !== stageFilter) return false;
      if (priorityFilter && record.priority !== priorityFilter) return false;
      if (slaFilter && sla !== slaFilter) return false;
      return true;
    })
    .sort((a, b) => {
      if (sort === "sla") {
        return (
          slaRank[a.sla] - slaRank[b.sla] ||
          rank[a.record.priority] - rank[b.record.priority]
        );
      }
      if (sort === "stuck") return b.stuckFor - a.stuckFor;
      if (sort === "open") return b.events.length - a.events.length;
      if (sort === "name") return a.record.name.localeCompare(b.record.name);
      const byRank = rank[a.record.priority] - rank[b.record.priority];
      return byRank !== 0 ? byRank : b.stuckFor - a.stuckFor;
    });

  const filtered = rows.length !== all.length;

  const followUps = all
    .flatMap((row) => row.events)
    .filter((event) => event.audience === "counselor" && event.type !== "escalation")
    .sort(byPriority);

  const escalations = all
    .flatMap((row) => row.events)
    .filter((event) => event.type === "escalation" || event.audience === "manager");

  return (
    <AppShell actor={actor} current="/console">
      <h1 className="sr-only">Counselor console</h1>
      <div className="shell grid gap-6">
        <div className="grid gap-6 lg:grid-cols-3">
          <Panel title="Your caseload">
            <div className="px-6 py-5">
              <p className="figures text-[1.75rem] font-semibold text-blue-dark">
                {mine.length}
              </p>
              <p className="mt-1 text-[0.8125rem] text-grey">
                Team average {teamAverage}. Reassignment is a manager action.
              </p>
            </div>
          </Panel>
          <Panel title="Waiting on you">
            <div className="px-6 py-5">
              <p className="figures text-[1.75rem] font-semibold text-blue-dark">
                {followUps.length}
              </p>
              <p className="mt-1 text-[0.8125rem] text-grey">
                Raised from stored dates and timestamps, never from a guess.
              </p>
            </div>
          </Panel>
          <Panel title="Escalated">
            <div className="px-6 py-5">
              <p className="figures text-[1.75rem] font-semibold text-blue-dark">
                {escalations.length}
              </p>
              <p className="mt-1 text-[0.8125rem] text-grey">
                A manager decides the response. Nothing resolves itself.
              </p>
            </div>
          </Panel>
        </div>

        <Panel
          title="Cases assigned to you"
          description={`${sorts.find((option) => option.key === sort)?.label}. Filtering changes this table only: the follow up and escalation counts above always read your whole caseload.`}
          action={
            <form method="get" action="/console" className="flex flex-wrap items-end gap-2">
              <label className="block">
                <span className="block text-[0.6875rem] text-grey">Search</span>
                <input
                  name="q"
                  defaultValue={query}
                  placeholder="Name, route or intake"
                  className="mt-1 w-44 rounded-card border border-line-strong px-2.5 py-1.5 text-[0.8125rem] text-blue-dark"
                />
              </label>
              <label className="block">
                <span className="block text-[0.6875rem] text-grey">Stage</span>
                <select
                  name="stage"
                  defaultValue={stageFilter}
                  className="mt-1 rounded-card border border-line-strong bg-white px-2.5 py-1.5 text-[0.8125rem] text-blue-dark"
                >
                  <option value="">Any</option>
                  {stages.map((stage) => (
                    <option key={stage.key} value={stage.key}>
                      {stage.name}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block">
                <span className="block text-[0.6875rem] text-grey">Priority</span>
                <select
                  name="priority"
                  defaultValue={priorityFilter}
                  className="mt-1 rounded-card border border-line-strong bg-white px-2.5 py-1.5 text-[0.8125rem] text-blue-dark"
                >
                  <option value="">Any</option>
                  {["Urgent", "High", "Normal"].map((value) => (
                    <option key={value} value={value}>
                      {value}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block">
                <span className="block text-[0.6875rem] text-grey">Service level</span>
                <select
                  name="sla"
                  defaultValue={slaFilter}
                  className="mt-1 rounded-card border border-line-strong bg-white px-2.5 py-1.5 text-[0.8125rem] text-blue-dark"
                >
                  <option value="">Any</option>
                  {(["breached", "due", "within", "not-applicable"] as SlaState[]).map(
                    (value) => (
                      <option key={value} value={value}>
                        {slaLabel[value]}
                      </option>
                    ),
                  )}
                </select>
              </label>
              <label className="block">
                <span className="block text-[0.6875rem] text-grey">Order by</span>
                <select
                  name="sort"
                  defaultValue={sort}
                  className="mt-1 rounded-card border border-line-strong bg-white px-2.5 py-1.5 text-[0.8125rem] text-blue-dark"
                >
                  {sorts.map((option) => (
                    <option key={option.key} value={option.key}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
              <button
                type="submit"
                className="button"
              >
                Apply
              </button>
              {filtered && (
                <Link
                  href="/console"
                  className="px-1 py-2 text-[0.8125rem] font-medium text-grey hover:text-pink"
                >
                  Clear
                </Link>
              )}
            </form>
          }
        >
          {rows.length === 0 ? (
            <EmptyState
              headline={filtered ? "Nothing matches those filters" : "No cases assigned"}
              body={
                filtered
                  ? `You have ${all.length} case${all.length === 1 ? "" : "s"}, and none of them matches. Clear the filters to see the rest.`
                  : "Your caseload is empty. Nothing has been generated to fill the table."
              }
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[52rem] border-collapse text-left">
                <thead>
                  <tr className="border-b border-line">
                    {[
                      "Student",
                      "Route",
                      "Stage",
                      "Documents",
                      "Service level",
                      "Open items",
                      "Risk",
                      "",
                    ].map(
                      (heading) => (
                        <th
                          key={heading}
                          scope="col"
                          className="px-6 py-3 text-[0.75rem] font-semibold text-grey"
                        >
                          {heading}
                        </th>
                      ),
                    )}
                  </tr>
                </thead>
                <tbody>
                  {rows.map(({ record, events, risk, stuckFor, sla }) => (
                    <tr key={record.id} className="border-b border-line last:border-b-0">
                      <td className="px-6 py-4">
                        <p className="text-[0.9375rem] font-medium text-blue-dark">
                          {record.name}
                        </p>
                        <span
                          className={`mt-1 inline-block rounded-input px-2 py-0.5 text-[0.6875rem] font-medium ${priorityTone[record.priority]}`}
                        >
                          {record.priority}
                        </span>
                        {record.needsManualReview && (
                          <span className="mt-1 ml-1.5 inline-block rounded-card bg-pending-bg px-2 py-0.5 text-[0.6875rem] font-medium text-pending">
                            Needs a person
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-[0.875rem] text-grey">
                        {record.destination}
                        {record.route ? `, ${record.route}` : ""}
                        <span className="mt-0.5 block text-[0.8125rem] text-grey">
                          {record.intake}
                        </span>
                        {!record.route && (
                          <span className="mt-1 inline-block rounded-card bg-pending-bg px-2 py-0.5 text-[0.6875rem] font-medium text-pending">
                            No route set
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-[0.875rem] capitalize text-grey">
                        {record.stage.replace("-", " ")}
                        <span className="figures mt-0.5 block text-[0.8125rem] text-grey">
                          {stuckFor} days here
                        </span>
                      </td>
                      <td className="px-6 py-4 text-[0.875rem] text-grey">
                        {record.docStatus}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={
                            sla === "breached"
                              ? "rounded-input bg-denied-bg px-2.5 py-1 text-[0.6875rem] font-medium text-denied"
                              : sla === "due"
                                ? "rounded-input bg-pending-bg px-2.5 py-1 text-[0.6875rem] font-medium text-pending"
                                : sla === "within"
                                  ? "rounded-input bg-verified-bg px-2.5 py-1 text-[0.6875rem] font-medium text-verified"
                                  : "rounded-input bg-neutral-chip-bg px-2.5 py-1 text-[0.6875rem] font-medium text-neutral-chip"
                          }
                        >
                          {slaLabel[sla]}
                        </span>
                      </td>
                      <td className="figures px-6 py-4 text-[0.875rem] text-blue-dark">
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
                          className="inline-flex items-center gap-1.5 text-[0.875rem] font-medium text-pink hover:text-blue"
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
          <p className="border-t border-line px-6 py-3 text-[0.75rem] text-grey">
            {RISK_DISCLAIMER}
          </p>
        </Panel>

        <Panel title="Open a case">
          <OpenCaseForm />
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
                      <p className="text-[0.9375rem] font-medium text-blue-dark">
                        {event.title}
                      </p>
                      <span
                        className={`shrink-0 rounded-input px-2 py-0.5 text-[0.6875rem] font-medium ${priorityTone[event.priority]}`}
                      >
                        {event.priority}
                      </span>
                    </div>
                    <p className="mt-1 text-[0.875rem] leading-relaxed text-grey">
                      {event.detail}
                    </p>
                    <p className="mt-1.5 text-[0.75rem] text-grey">
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
                    <p className="text-[0.9375rem] font-medium text-blue-dark">
                      {event.title}
                    </p>
                    <p className="mt-1 text-[0.875rem] leading-relaxed text-grey">
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
