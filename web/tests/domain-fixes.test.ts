import { beforeEach, describe, expect, it } from "vitest";
import { decideExtractedField, listConsents, stageExtraction, withdrawConsent } from "@/data/store";
import { auditFor, resetAudit } from "@/domain/audit";
import { demoCounselor, demoStudent } from "@/domain/demo-actors";
import type { Actor } from "@/domain/rbac";
import { stageFields } from "@/domain/extraction";
import { applyCorrection } from "@/domain/case-operations";
import { detectEvents } from "@/domain/events";
import { planNotifications, resolveStale } from "@/domain/notifications";
import { findSensitiveInput } from "@/domain/agents/guards";
import { nextDeadline, programmes } from "@/content/catalogue";
import { syntheticCases } from "@/data/synthetic-cases";

/** One test per domain and data bug fixed in the audit, each failing before its fix. */

const outsider: Actor = {
  id: "user-counselor-2",
  name: "Karthik Menon",
  role: "counselor",
  assignedCaseIds: ["case-1043"],
};

beforeEach(() => {
  resetAudit();
});

describe("store guards", () => {
  it("withdraws consent only on a readable case, and never audits a no-op", async () => {
    expect(await withdrawConsent("consent-5", demoStudent)).toEqual([]);
    const theirs = await listConsents("case-1042", demoCounselor);
    expect(theirs.find((consent) => consent.id === "consent-5")?.withdrawnAt).toBeNull();

    // consent-4 is already withdrawn in the fixtures.
    await withdrawConsent("consent-4", demoStudent);
    expect((await auditFor("consent-4")).filter((e) => e.action === "withdraw-consent")).toHaveLength(0);
  });

  it("scopes an extraction decision to the caseload and refuses a second decision", async () => {
    await stageExtraction(
      stageFields("doc-fix", "case-1041", [{ name: "cgpa", value: "8.1", confidence: "high" }], "", false),
    );

    expect(await decideExtractedField("doc-fix", "cgpa", "confirmed", outsider)).toBeNull();
    expect(await decideExtractedField("doc-fix", "cgpa", "confirmed", demoCounselor)).not.toBeNull();
    expect(await decideExtractedField("doc-fix", "cgpa", "rejected", demoCounselor)).toBeNull();

    const decisions = (await auditFor("doc-fix")).filter((e) => e.field === "extraction.cgpa");
    expect(decisions).toHaveLength(1);
  });
});

describe("pure domain rules", () => {
  const plain = syntheticCases.find((record) => record.id === "case-1041")!;
  const daysAgo = (n: number) => new Date(Date.now() - n * 86_400_000).toISOString();

  it("refuses a correction that would log a change that never happened", () => {
    const reason = "Typed by a counselor.";
    expect(applyCorrection(plain, { field: "priority", value: "high", reason }, "A")).toBe(plain);
    expect(
      applyCorrection(plain, { field: "deadline", targetId: "No such deadline", value: "2027-01-01", reason }, "A"),
    ).toBe(plain);
    const label = plain.deadlines[0].label;
    expect(
      applyCorrection(plain, { field: "deadline", targetId: label, value: "next friday", reason }, "A"),
    ).toBe(plain);
  });

  it("does not escalate a case sitting at its outcome", () => {
    const events = detectEvents({ ...plain, stage: "outcome", stageUpdatedAt: daysAgo(30) });
    expect(events.some((event) => event.type === "escalation")).toBe(false);
  });

  it("gives an event that clears and recurs a fresh notification id", () => {
    const quiet = detectEvents({ ...plain, lastStudentContactAt: daysAgo(6) }).filter(
      (event) => event.type === "inactivity",
    );
    const resolved = resolveStale(planNotifications(quiet, []), []);
    const again = planNotifications(quiet, resolved);

    expect(again.length).toBeGreaterThan(0);
    const ids = [...resolved, ...again].map((item) => item.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("keeps a catalogue deadline open through its own day", () => {
    const row = {
      ...programmes[0],
      intakes: [{ ...programmes[0].intakes[0], applicationDeadline: "2026-12-04" }],
    };
    expect(nextDeadline(row, new Date("2026-12-04T15:00:00.000Z"))).toBe("2026-12-04");
    expect(nextDeadline(row, new Date("2026-12-05T00:00:00.000Z"))).toBeNull();
  });

  it("catches a lowercase passport number and ignores a year after 'years'", () => {
    expect(findSensitiveInput("Passport z1234567 scanned.")).not.toBeNull();
    expect(findSensitiveInput("A gap of two years 2021 to 2023, explained.")).toBeNull();
  });
});
