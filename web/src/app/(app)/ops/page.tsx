import type { Metadata } from "next";
import { AppShell, EmptyState, Panel } from "@/components/app/shell";
import { listCases, syncNotifications } from "@/data/store";
import { securityPosture, postureLabel, postureSummary } from "@/domain/security-posture";
import { recentAudit } from "@/domain/audit";
import { retentionFor, RETENTION_YEARS } from "@/domain/retention";
import { suggestAssignment } from "@/domain/counselor-ops";
import { demoFounder } from "@/domain/demo-actors";
import { byPriority, detectAll } from "@/domain/events";
import { daysSince, daysUntil } from "@/domain/case";
import { buildQuarterlyReport } from "@/domain/reporting";
import { providerStatus } from "@/domain/notifications";
import { agentAvailability } from "@/domain/agents/kernel";
import { agents, GLOBAL_PROHIBITIONS } from "@/domain/agents/registry";
import { StatusChip } from "@/components/ui/chip";
import { ledgerRows } from "@/content/ledger";
import { isPublishable } from "@/content/types";
import { stages } from "@/content/process";

export const metadata: Metadata = { title: "Operations" };

/** Reads live case state per request. Never a build time snapshot. */
export const dynamic = "force-dynamic";

export default async function OpsPage() {
  const all = await listCases(demoFounder);
  const events = detectAll(all).sort(byPriority);
  const report = buildQuarterlyReport(all);
  const availability = agentAvailability();
  const providers = providerStatus();
  const posture = securityPosture();
  const postureCounts = postureSummary();
  const sweep = await syncNotifications();
  const assignment = suggestAssignment(all);
  const audit = recentAudit(12);

  const perStage = stages.map((stage) => ({
    stage,
    cases: all.filter((record) => record.stage === stage.key),
  }));

  const workload = Object.entries(
    all.reduce<Record<string, number>>((totals, record) => {
      totals[record.counselor] = (totals[record.counselor] ?? 0) + 1;
      return totals;
    }, {}),
  );

  const stagnant = all
    .map((record) => ({ record, days: daysSince(record.stageUpdatedAt) }))
    .filter((entry) => entry.days >= 5)
    .sort((a, b) => b.days - a.days);

  const upcoming = all
    .flatMap((record) =>
      record.deadlines.map((deadline) => ({
        record,
        deadline,
        days: daysUntil(deadline.date),
      })),
    )
    .filter((entry) => entry.days >= 0)
    .sort((a, b) => a.days - b.days);

  const verified = ledgerRows.filter((row) => isPublishable(row.status)).length;
  const unverified = ledgerRows.filter((row) => row.status === "unverified").length;
  const denied = ledgerRows.filter((row) => row.status === "permission-denied").length;

  return (
    <AppShell actor={demoFounder} current="/ops">
      <div className="shell grid gap-6">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: "Active cases", value: all.length, note: "Across every counselor" },
            { label: "Open items", value: events.length, note: "Raised from stored values" },
            { label: "Ledger rows verified", value: `${verified} of ${ledgerRows.length}`, note: "Cleared for publication" },
            { label: "Awaiting outreach", value: unverified, note: "Still market estimates" },
          ].map((tile) => (
            <Panel key={tile.label} title={tile.label}>
              <div className="px-6 py-5">
                <p className="figures text-[1.75rem] font-semibold text-navy-900">
                  {tile.value}
                </p>
                <p className="mt-1 text-[0.8125rem] text-muted">{tile.note}</p>
              </div>
            </Panel>
          ))}
        </div>

        <Panel
          title="Security and data protection"
          description={`${postureCounts["in-code"]} implemented, ${postureCounts["needs-provider"]} waiting on infrastructure, ${postureCounts["needs-a-person"]} waiting on a person. No student document is accepted until this reads differently.`}
        >
          <ul className="divide-y divide-line">
            {posture.map((item) => (
              <li
                key={item.requirement}
                className="flex flex-wrap items-start justify-between gap-4 px-6 py-4"
              >
                <div className="max-w-2xl">
                  <p className="text-[0.9375rem] font-medium text-navy-900">
                    {item.requirement}
                  </p>
                  <p className="mt-1 text-[0.875rem] leading-relaxed text-body">
                    {item.detail}
                  </p>
                </div>
                <span
                  className={
                    item.state === "in-code"
                      ? "shrink-0 rounded-input bg-verified-bg px-2.5 py-1 text-[0.6875rem] font-medium text-verified"
                      : item.state === "needs-provider"
                        ? "shrink-0 rounded-input bg-pending-bg px-2.5 py-1 text-[0.6875rem] font-medium text-pending"
                        : "shrink-0 rounded-input bg-neutral-chip-bg px-2.5 py-1 text-[0.6875rem] font-medium text-neutral-chip"
                  }
                >
                  {postureLabel[item.state]}
                </span>
              </li>
            ))}
          </ul>
        </Panel>

        <Panel
          title="Pipeline"
          description="Where every active case sits across the eleven stages."
        >
          {all.length === 0 ? (
            <EmptyState
              headline="No cases"
              body="Nothing is loaded, and nothing has been generated to fill the pipeline."
            />
          ) : (
            <div className="grid gap-px bg-line sm:grid-cols-2 lg:grid-cols-4">
              {perStage.map(({ stage, cases }) => (
                <div key={stage.key} className="bg-paper px-5 py-4">
                  <p className="text-[0.8125rem] text-muted">{stage.name}</p>
                  <p
                    className={
                      cases.length > 0
                        ? "figures mt-1 text-[1.25rem] font-semibold text-navy-900"
                        : "figures mt-1 text-[1.25rem] font-semibold text-line-strong"
                    }
                  >
                    {cases.length}
                  </p>
                  {cases.length > 0 && (
                    <p className="mt-1 text-[0.75rem] leading-snug text-muted">
                      {cases.map((record) => record.name.split(" ")[0]).join(", ")}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </Panel>

        <div className="grid gap-6 lg:grid-cols-2">
          <Panel
            title="Counselor workload"
            description="Assignment suggestions follow caseload size. A manager can always override, and the override is logged."
          >
            {workload.length === 0 ? (
              <EmptyState headline="No assignments" body="No case is assigned to anyone." />
            ) : (
              <ul className="divide-y divide-line">
                {workload.map(([counselor, count]) => (
                  <li
                    key={counselor}
                    className="flex items-baseline justify-between gap-6 px-6 py-4"
                  >
                    <span className="text-[0.9375rem] text-navy-900">{counselor}</span>
                    <span className="figures text-[0.9375rem] font-semibold text-navy-900">
                      {count}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </Panel>

          <Panel
            title="Not moving"
            description="Cases with no stage change for five days or more. Closure is always a person's decision, never an automatic one."
          >
            {stagnant.length === 0 ? (
              <EmptyState
                headline="Everything is moving"
                body="No case has sat at the same stage past the threshold."
              />
            ) : (
              <ul className="divide-y divide-line">
                {stagnant.map(({ record, days }) => (
                  <li
                    key={record.id}
                    className="flex items-baseline justify-between gap-6 px-6 py-4"
                  >
                    <div>
                      <p className="text-[0.9375rem] text-navy-900">{record.name}</p>
                      <p className="text-[0.8125rem] capitalize text-muted">
                        {record.stage.replace("-", " ")}, {record.counselor}
                      </p>
                    </div>
                    <span className="figures shrink-0 text-[0.875rem] text-navy-900">
                      {days} days
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </Panel>
        </div>

        <Panel
          title="Deadlines across every case"
          description="Read from dates a person entered. A date that is not on file is shown as absent, never as zero."
        >
          {upcoming.length === 0 ? (
            <EmptyState
              headline="No deadlines on file"
              body="Nothing has been entered on any case."
            />
          ) : (
            <ul className="divide-y divide-line">
              {upcoming.map(({ record, deadline, days }) => (
                <li
                  key={record.id + deadline.label}
                  className="flex flex-wrap items-baseline justify-between gap-4 px-6 py-4"
                >
                  <div>
                    <p className="text-[0.9375rem] text-navy-900">{deadline.label}</p>
                    <p className="text-[0.8125rem] text-muted">
                      {record.name}, {record.destination}
                    </p>
                  </div>
                  <p className="figures text-[0.875rem] text-navy-900">
                    {deadline.date}, {days} {days === 1 ? "day" : "days"}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </Panel>

        <Panel
          title="Commission verification"
          description="The quarterly Open Ledger update, kept as a running status check instead of a scramble at the end of the quarter."
        >
          <div className="grid gap-px bg-line sm:grid-cols-3">
            {[
              { label: "Verified and publishable", value: verified },
              { label: "Unverified market estimates", value: unverified },
              { label: "Disclosure declined", value: denied },
            ].map((tile) => (
              <div key={tile.label} className="bg-paper px-6 py-5">
                <p className="figures text-[1.5rem] font-semibold text-navy-900">
                  {tile.value}
                </p>
                <p className="mt-1 text-[0.8125rem] text-muted">{tile.label}</p>
              </div>
            ))}
          </div>
          <ul className="divide-y divide-line border-t border-line">
            {ledgerRows.map((row) => (
              <li
                key={row.id}
                className="flex flex-wrap items-center justify-between gap-4 px-6 py-4"
              >
                <div>
                  <p className="text-[0.9375rem] text-navy-900">{row.relationship}</p>
                  <p className="figures text-[0.8125rem] text-muted">
                    {row.commissionDisplay}, reviewed {row.lastReviewDate}
                  </p>
                </div>
                <StatusChip status={row.status} />
              </li>
            ))}
          </ul>
          <p className="border-t border-line px-6 py-3 text-[0.75rem] leading-relaxed text-muted">
            Only a founder action can move a row to verified, and it is logged.
            No agent has a capability that reaches this table.
          </p>
        </Panel>

        <Panel
          title="Quarterly outcomes"
          description="Generated from records with a final, human confirmed outcome. Categories stay separate, permanently."
        >
          <div className="grid gap-px bg-line sm:grid-cols-2 lg:grid-cols-3">
            {report.categories.map((category) => (
              <div key={category.key} className="bg-paper px-6 py-5">
                <p className="figures text-[1.5rem] font-semibold text-navy-900">
                  {category.count}
                </p>
                <p className="mt-1 text-[0.875rem] font-medium text-navy-900">
                  {category.label}
                </p>
                <p className="mt-1 text-[0.75rem] leading-relaxed text-muted">
                  {category.note}
                </p>
              </div>
            ))}
          </div>
          <div className="border-t border-line px-6 py-4">
            <p className="text-[0.875rem] leading-relaxed text-body">
              {report.excludedFromRates} Currently{" "}
              <span className="figures">{report.inProgress}</span> in progress.
            </p>
            {report.blockedReason && (
              <p className="mt-2 text-[0.875rem] leading-relaxed text-pending">
                {report.blockedReason}
              </p>
            )}
          </div>
        </Panel>

        <Panel
          title="Agent governance"
          description={availability.note}
        >
          <div className="overflow-x-auto">
            <table className="w-full min-w-[54rem] border-collapse text-left">
              <thead>
                <tr className="border-b border-line">
                  {["Agent", "May write", "Human checkpoint", "Cannot do", "Runs on"].map(
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
                {agents.map((agent) => (
                  <tr key={agent.id} className="border-b border-line align-top last:border-b-0">
                    <td className="px-6 py-4">
                      <p className="text-[0.9375rem] font-medium text-navy-900">
                        {agent.name}
                      </p>
                      <p className="mt-1 max-w-xs text-[0.8125rem] leading-relaxed text-muted">
                        {agent.purpose}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <ul className="space-y-1">
                        {agent.writes.map((field) => (
                          <li key={field} className="figures text-[0.75rem] text-body">
                            {field}
                          </li>
                        ))}
                      </ul>
                    </td>
                    <td className="px-6 py-4 text-[0.8125rem] leading-relaxed text-body">
                      {agent.requiresHumanReview ? "Required. " : "Not gated. "}
                      {agent.humanReview}
                    </td>
                    <td className="px-6 py-4">
                      <ul className="space-y-1">
                        {agent.prohibitions.map((rule) => (
                          <li key={rule} className="text-[0.8125rem] leading-relaxed text-body">
                            {rule}
                          </li>
                        ))}
                      </ul>
                    </td>
                    <td className="px-6 py-4 text-[0.8125rem] text-body">
                      {agent.usesModel ? availability.model : "Rules only, no model"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="border-t border-line px-6 py-5">
            <p className="text-[0.875rem] font-medium text-navy-900">
              Applies to every agent above, without exception
            </p>
            <ul className="mt-3 grid gap-2 md:grid-cols-2">
              {GLOBAL_PROHIBITIONS.map((rule) => (
                <li key={rule} className="text-[0.875rem] leading-relaxed text-body">
                  {rule}
                </li>
              ))}
            </ul>
          </div>
        </Panel>

        <div className="grid gap-6 lg:grid-cols-2">
          <Panel
            title="Assignment suggestion"
            description="Caseload size only. A manager makes the call, and the override is logged like any other write."
          >
            <div className="px-6 py-5">
              <p className="text-[0.9375rem] text-navy-900">
                {assignment.suggested
                  ? `Next case suggested for ${assignment.suggested}`
                  : "Nothing to suggest yet"}
              </p>
              <ul className="mt-4 space-y-2">
                {assignment.loads.map((load) => (
                  <li
                    key={load.counselor}
                    className="flex items-baseline justify-between gap-6"
                  >
                    <span className="text-[0.875rem] text-body">{load.counselor}</span>
                    <span className="figures text-[0.875rem] text-navy-900">
                      {load.cases}
                    </span>
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-[0.75rem] leading-relaxed text-muted">
                {assignment.note}
              </p>
            </div>
          </Panel>

          <Panel
            title="Retention"
            description={`A written file is kept for ${RETENTION_YEARS} years after a case closes. The clock starts when a person closes it, never automatically.`}
          >
            <ul className="divide-y divide-line">
              {all.map((record) => {
                const retention = retentionFor(record.closedAt);
                return (
                  <li
                    key={record.id}
                    className="flex items-baseline justify-between gap-6 px-6 py-3.5"
                  >
                    <span className="text-[0.875rem] text-navy-900">{record.name}</span>
                    <span className="text-[0.8125rem] text-muted">
                      {retention.state === "open"
                        ? "Case open"
                        : retention.state === "retained"
                          ? `Held until ${retention.until}`
                          : `Deletable since ${retention.since}`}
                    </span>
                  </li>
                );
              })}
            </ul>
          </Panel>
        </div>

        <Panel
          title="Audit trail"
          description="Every read and write of a case, with who did it. Rendering this page wrote the first few entries."
        >
          <ul className="divide-y divide-line">
            {audit.map((entry) => (
              <li key={entry.id} className="flex flex-wrap items-baseline justify-between gap-4 px-6 py-3">
                <div>
                  <p className="text-[0.875rem] text-navy-900">
                    {entry.actorName} <span className="text-muted">({entry.actorRole})</span>{" "}
                    {entry.action} {entry.subjectType} {entry.subjectId}
                    {entry.field ? `, field ${entry.field}` : ""}
                  </p>
                  {entry.note && (
                    <p className="mt-0.5 text-[0.75rem] text-muted">{entry.note}</p>
                  )}
                </div>
                <span className="figures shrink-0 text-[0.75rem] text-muted">
                  {entry.ts.slice(11, 19)}
                </span>
              </li>
            ))}
          </ul>
        </Panel>

        <Panel
          title="Notification channels"
          description={`Last sweep queued ${sweep.queued} and left ${sweep.open} open. A repeat sweep on unchanged state queues nothing.`}
        >
          <ul className="divide-y divide-line">
            {providers.map((provider) => (
              <li
                key={provider.channel}
                className="flex flex-wrap items-center justify-between gap-4 px-6 py-4"
              >
                <div>
                  <p className="text-[0.9375rem] capitalize text-navy-900">
                    {provider.channel.replace("_", " ")}
                  </p>
                  <p className="mt-0.5 text-[0.8125rem] text-muted">
                    {provider.requirement}
                  </p>
                </div>
                <span
                  className={
                    provider.configured
                      ? "rounded-input bg-verified-bg px-2.5 py-1 text-[0.6875rem] font-medium text-verified"
                      : "rounded-input bg-pending-bg px-2.5 py-1 text-[0.6875rem] font-medium text-pending"
                  }
                >
                  {provider.configured ? "Configured" : "Not configured"}
                </span>
              </li>
            ))}
          </ul>
        </Panel>
      </div>
    </AppShell>
  );
}
