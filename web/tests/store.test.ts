import { beforeEach, describe, expect, it } from "vitest";
import {
  appendNote,
  mutateCase,
  caseloadStats,
  getCase,
  listCases,
  listConsents,
  listNotifications,
  markDocumentVerified,
  syncNotifications,
  withdrawConsent,
} from "@/data/store";
import { auditFor, recentAudit, resetAudit } from "@/domain/audit";
import { demoCounselor, demoFounder, demoStudent } from "@/domain/demo-actors";

/**
 * The store is where the two structural promises meet: a read is scoped by the
 * permission matrix, and a read is recorded. These tests exercise both through
 * the real module rather than through a copy of its rules.
 */

beforeEach(() => {
  resetAudit();
});

describe("reads are scoped and recorded", () => {
  it("returns only the student's own case, and logs the read", async () => {
    const cases = await listCases(demoStudent);
    expect(cases.map((item) => item.id)).toEqual(["case-1041"]);

    const entries = recentAudit();
    expect(entries).toHaveLength(1);
    expect(entries[0].actorRole).toBe("student");
    expect(entries[0].action).toBe("read");
  });

  it("refuses a case outside the caseload and records the refusal too", async () => {
    const denied = await getCase("case-1043", demoCounselor);
    expect(denied).toBeNull();

    const entry = auditFor("case-1043")[0];
    expect(entry.note).toContain("refused");
  });

  it("lets a founder read everything", async () => {
    const cases = await listCases(demoFounder);
    expect(cases.length).toBeGreaterThan(2);
  });

  it("returns counts without records for the caseload aggregate", async () => {
    const stats = await caseloadStats(demoCounselor);
    expect(stats.mine).toBe(2);
    expect(stats.teamAverage).toBeGreaterThan(0);
  });
});

describe("writes carry their author", () => {
  it("records a note against the person who wrote it", async () => {
    const updated = await appendNote(
      "case-1041",
      { text: "Called the passport office, appointment is on the 14th.", source: "human", author: demoCounselor.name },
      demoCounselor,
    );

    expect(updated?.log.at(-1)?.author).toBe(demoCounselor.name);
    expect(updated?.log.at(-1)?.source).toBe("human");

    const write = auditFor("case-1041").find((entry) => entry.action === "create");
    expect(write?.actorName).toBe(demoCounselor.name);
    expect(write?.field).toBe("log");
  });

  it("refuses to write a note onto a case the actor cannot read", async () => {
    const result = await appendNote(
      "case-1043",
      { text: "Should not land.", source: "human", author: demoCounselor.name },
      demoCounselor,
    );
    expect(result).toBeNull();
  });

  it("stamps document verification with the person who did it", async () => {
    const updated = await markDocumentVerified("case-1041", "doc-2", demoCounselor);
    const document = updated?.documents.find((item) => item.id === "doc-2");

    expect(document?.status).toBe("Verified");
    expect(document?.verifiedBy).toBe(demoCounselor.name);

    const entry = auditFor("doc-2")[0];
    expect(entry.action).toBe("verify");
    expect(entry.before).toBeDefined();
    expect(entry.after).toBe("Verified");
  });
});

describe("case operations are gated by the permission matrix", () => {
  it("refuses a reassignment attempted by a counselor", async () => {
    const result = await mutateCase(
      "case-1041",
      demoCounselor,
      "case.reassign",
      (record) => ({ ...record, counselor: "Someone Else" }),
      "should not happen",
    );
    expect(result).toBeNull();
  });

  it("refuses a closure attempted by a counselor", async () => {
    const result = await mutateCase(
      "case-1041",
      demoCounselor,
      "escalation.resolve",
      (record) => ({ ...record, closedAt: new Date().toISOString() }),
      "should not happen",
    );
    expect(result).toBeNull();
  });

  it("lets a founder do both, and records it", async () => {
    const result = await mutateCase(
      "case-1042",
      demoFounder,
      "case.reassign",
      (record) => ({ ...record, counselor: "Karthik Menon" }),
      "Reassigned to Karthik Menon",
    );

    expect(result?.counselor).toBe("Karthik Menon");
    const entry = auditFor("case-1042").find((item) => item.action === "update");
    expect(entry?.note).toContain("Karthik Menon");
  });

  it("refuses to touch a case the actor cannot read at all", async () => {
    const result = await mutateCase(
      "case-1043",
      demoCounselor,
      "case.note.write",
      (record) => record,
      "should not happen",
    );
    expect(result).toBeNull();
  });
});

describe("consent and notifications move through the store", () => {
  it("returns consent only for a readable case", async () => {
    expect((await listConsents("case-1041", demoStudent)).length).toBeGreaterThan(0);
    expect(await listConsents("case-1043", demoStudent)).toHaveLength(0);
  });

  it("logs a withdrawal against the person who withdrew it", async () => {
    await withdrawConsent("consent-3", demoStudent);
    const entry = auditFor("consent-3")[0];

    expect(entry.action).toBe("withdraw-consent");
    expect(entry.actorRole).toBe("student");
  });

  it("queues on the first sweep and stays quiet on the second", async () => {
    const first = await syncNotifications();
    expect(first.queued).toBeGreaterThan(0);

    const second = await syncNotifications();
    expect(second.queued).toBe(0);
    expect(second.open).toBe(first.open);
  });

  it("scopes a student's notifications to their own case", async () => {
    const mine = await listNotifications(null, demoStudent);
    expect(mine.every((item) => item.caseId === "case-1041")).toBe(true);
  });
});
