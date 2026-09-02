import { describe, expect, it } from "vitest";
import { can, assertCan, visibleCases, PermissionError, type Actor } from "@/domain/rbac";
import { findViolations, findGhostwriting, filterWrites } from "@/domain/agents/guards";
import { agents, agentById, GLOBAL_PROHIBITIONS } from "@/domain/agents/registry";
import { z } from "zod";
import {
  summarySchema,
  draftSchema,
  guidanceSchema,
  coachingSchema,
  threadSchema,
  extractionSchema,
} from "@/domain/agents/implementations";
import { syntheticCases } from "@/data/synthetic-cases";
import { ledgerRows } from "@/content/ledger";
import { isPublishable } from "@/content/types";

/**
 * These tests exist to try to break the guarantees the business is sold on. A
 * guarantee that is only written in a prompt or a policy page is not tested
 * here, because it is not enforceable. Everything below is.
 */

const student: Actor = {
  id: "s1",
  name: "Meghana Rangaswamy",
  role: "student",
  caseId: "case-1041",
};
const counselor: Actor = {
  id: "c1",
  name: "Rohini Bhat",
  role: "counselor",
  assignedCaseIds: ["case-1041", "case-1042"],
};
const manager: Actor = { id: "m1", name: "Devika Suresh", role: "manager" };
const founder: Actor = { id: "f1", name: "Founder", role: "founder" };

const ownCase = syntheticCases.find((record) => record.id === "case-1041")!;
const otherCase = syntheticCases.find((record) => record.id === "case-1043")!;

describe("a student cannot reach another student's case", () => {
  it("blocks reading a case that is not theirs", () => {
    expect(can(student, "case.read", ownCase)).toBe(true);
    expect(can(student, "case.read", otherCase)).toBe(false);
  });

  it("returns only their own case from a full list", () => {
    expect(visibleCases(student, syntheticCases).map((record) => record.id)).toEqual([
      "case-1041",
    ]);
  });

  it("never lets a student verify a document or write a note", () => {
    expect(can(student, "document.verify", ownCase)).toBe(false);
    expect(can(student, "case.note.write", ownCase)).toBe(false);
  });
});

describe("a counselor is scoped to their own caseload", () => {
  it("reads assigned cases and nothing else", () => {
    expect(can(counselor, "case.read", ownCase)).toBe(true);
    expect(can(counselor, "case.read", otherCase)).toBe(false);
    expect(visibleCases(counselor, syntheticCases).map((record) => record.id)).toEqual([
      "case-1041",
      "case-1042",
    ]);
  });

  it("throws rather than silently failing on an unassigned case", () => {
    expect(() => assertCan(counselor, "case.note.write", otherCase)).toThrow(
      PermissionError,
    );
  });
});

describe("only a founder can move a commission figure", () => {
  it("refuses commission verification and publication to everyone else", () => {
    for (const actor of [student, counselor, manager]) {
      expect(can(actor, "commission.verify")).toBe(false);
      expect(can(actor, "commission.publish")).toBe(false);
      expect(can(actor, "commission.read.source")).toBe(false);
    }
    expect(can(founder, "commission.verify")).toBe(true);
    expect(can(founder, "commission.publish")).toBe(true);
  });

  it("gives a manager escalation sign off but not the ledger", () => {
    expect(can(manager, "escalation.resolve")).toBe(true);
    expect(can(manager, "commission.verify")).toBe(false);
  });
});

describe("no agent can reach a high impact action", () => {
  it("grants no agent a capability that touches verification, the ledger or sending", () => {
    const forbidden = [
      "document.verify",
      "commission.verify",
      "commission.publish",
      "case.stage.write",
      "case.reassign",
    ];
    for (const agent of agents) {
      for (const field of agent.writes) {
        expect(forbidden).not.toContain(field);
      }
    }
  });

  it("keeps the case summary agent away from stage, priority and document status", () => {
    const writes = agentById.get("case-summary")!.writes;
    expect(writes).toEqual(["summary", "suggestedAction"]);
    expect(writes).not.toContain("docStatus");
    expect(writes).not.toContain("priority");
    expect(writes).not.toContain("stage");
  });

  it("gives the statement coach questions and feedback, and no document field", () => {
    expect(agentById.get("sop-coach")!.writes).toEqual([
      "questions",
      "structuralFeedback",
    ]);
    expect(agentById.get("sop-coach")!.requiresHumanReview).toBe(true);
  });

  /**
   * The regression guard for the bug this file previously missed. The kernel
   * compares an agent's declared capability list against the keys its schema
   * actually returns. If the two drift apart, the check either refuses every
   * valid output or silently stops meaning anything, so they are asserted equal
   * rather than trusted to stay in step.
   */
  it("declares exactly the keys each model backed agent's schema returns", () => {
    const schemas: Record<string, z.ZodObject<z.ZodRawShape>> = {
      "case-summary": summarySchema,
      "counselor-copilot": draftSchema,
      "student-guidance": guidanceSchema,
      "sop-coach": coachingSchema,
      "communication-summary": threadSchema,
      "document-intelligence": extractionSchema,
    };

    for (const agent of agents.filter((item) => item.usesModel)) {
      const schema = schemas[agent.id];
      expect(schema, `no schema wired for ${agent.id}`).toBeDefined();
      expect([...agent.writes].sort()).toEqual(Object.keys(schema.shape).sort());
    }
  });

  it("grants the rule based agents no model output capability at all", () => {
    for (const agent of agents.filter((item) => !item.usesModel)) {
      expect(agent.writes).toEqual([]);
    }
  });

  it("states the global prohibitions on every agent", () => {
    expect(GLOBAL_PROHIBITIONS.length).toBe(7);
    expect(agents).toHaveLength(10);
  });
});

describe("output that breaks a prohibition is discarded, not shown", () => {
  it("blocks an implied visa probability", () => {
    const violations = findViolations(
      "Based on the profile the visa approval is around 85% for this route.",
    );
    expect(violations.length).toBeGreaterThan(0);
  });

  it("blocks probability language even without a number", () => {
    expect(
      findViolations("Your chances of admission are strong for this university."),
    ).not.toHaveLength(0);
  });

  it("blocks a guarantee", () => {
    expect(
      findViolations("We can guarantee an offer from this university."),
    ).not.toHaveLength(0);
  });

  it("blocks a drafted letter", () => {
    expect(
      findViolations(
        "To whom it may concern, this is to certify that the applicant worked here for two years.",
      ),
    ).not.toHaveLength(0);
  });

  it("blocks an invented funding figure", () => {
    expect(
      findViolations(
        "The account balance shows ₹32,00,000 which is sufficient funds for the visa file.",
      ),
    ).not.toHaveLength(0);
  });

  it("lets an ordinary counselor summary through", () => {
    expect(
      findViolations(
        "Passport expires during the intake year. Renewal has been started and the appointment date is awaited.",
      ),
    ).toHaveLength(0);
  });
});

describe("the statement of purpose coach cannot ghostwrite", () => {
  it("rejects first person narrative prose", () => {
    const ghostwritten = findGhostwriting(
      "I have always been fascinated by mechanical systems. My final year project deepened that interest.",
    );
    expect(ghostwritten).not.toBeNull();
  });

  it("accepts coaching questions and structural feedback", () => {
    expect(
      findGhostwriting(
        "What specific problem did the final year project solve? Your second paragraph states an interest without evidence, so move the project detail up.",
      ),
    ).toBeNull();
  });

  it("runs the ghostwriting check only when coaching", () => {
    const prose =
      "I have always been fascinated by mechanical systems. My final year project deepened that interest.";
    expect(findViolations(prose)).toHaveLength(0);
    expect(findViolations(prose, { coaching: true })).not.toHaveLength(0);
  });
});

describe("an agent cannot write outside its capability set", () => {
  it("drops a field the agent was never granted", () => {
    const summaryAgent = agentById.get("case-summary")!;
    const { accepted, rejected } = filterWrites(summaryAgent, {
      summary: "Waiting on the passport renewal appointment.",
      suggestedAction: "Chase the appointment date this week.",
      docStatus: "Verified",
      priority: "Urgent",
    });

    expect(Object.keys(accepted).sort()).toEqual(["suggestedAction", "summary"]);
    expect(rejected.sort()).toEqual(["docStatus", "priority"]);
  });
});

describe("a commission figure cannot be published without its evidence", () => {
  it("requires a source, evidence, a date and a named person on every publishable row", () => {
    for (const row of ledgerRows) {
      if (!isPublishable(row.status)) continue;
      expect(row.source).not.toBe("market-estimate");
      expect(row.evidence).toBeTruthy();
      expect(row.verificationDate).toBeTruthy();
      expect(row.verifiedBy).toBeTruthy();
    }
  });

  it("keeps every market estimate off the verified ledger", () => {
    for (const row of ledgerRows) {
      if (row.source !== "market-estimate") continue;
      expect(isPublishable(row.status)).toBe(false);
      expect(row.verificationDate).toBeNull();
    }
  });

  it("carries a review date on every row, verified or not", () => {
    for (const row of ledgerRows) {
      expect(row.lastReviewDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    }
  });
});
