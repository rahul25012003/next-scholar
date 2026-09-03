import { describe, expect, it } from "vitest";
import { slaFor, slaTargets, worstSla } from "@/domain/sla";
import { syntheticCases } from "@/data/synthetic-cases";
import type { StudentCase } from "@/domain/case";

const base = syntheticCases[0];
const daysAgo = (n: number) => new Date(Date.now() - n * 86_400_000).toISOString();
const caseWith = (overrides: Partial<StudentCase>): StudentCase => ({ ...base, ...overrides });

/**
 * A service level is only meaningful if it can be breached, and only fair if it
 * stops running when the ball is in the student's court. Both are pinned here.
 */
describe("service levels", () => {
  it("does not run the reply clock when we replied last", () => {
    const waiting = caseWith({
      lastStudentContactAt: daysAgo(9),
      lastCounselorReplyAt: daysAgo(1),
    });
    const reply = slaFor(waiting).find((check) => check.id === "reply")!;

    expect(reply.state).toBe("not-applicable");
    expect(reply.actual).toBe("Waiting on the student");
  });

  it("breaches the reply target when a student has waited past it", () => {
    const overdue = caseWith({
      lastStudentContactAt: daysAgo(6),
      lastCounselorReplyAt: daysAgo(9),
    });
    const reply = slaFor(overdue).find((check) => check.id === "reply")!;

    expect(reply.state).toBe("breached");
    expect(reply.actual).toContain("6 days waiting");
  });

  it("stays within the target inside the window", () => {
    const fresh = caseWith({
      lastStudentContactAt: daysAgo(1),
      lastCounselorReplyAt: daysAgo(4),
    });
    expect(slaFor(fresh).find((check) => check.id === "reply")?.state).toBe("within");
  });

  it("breaches on a stage that has not moved", () => {
    const stuck = caseWith({ stageUpdatedAt: daysAgo(slaTargets.stage.days + 3) });
    expect(slaFor(stuck).find((check) => check.id === "stage")?.state).toBe("breached");
  });

  it("stops expecting stage movement once the case is closed", () => {
    const closed = caseWith({
      stageUpdatedAt: daysAgo(60),
      closedAt: daysAgo(30),
    });
    expect(slaFor(closed).find((check) => check.id === "stage")?.state).toBe(
      "not-applicable",
    );
  });

  it("says no clock is running when nothing awaits document review", () => {
    const none = caseWith({ documents: [] });
    const documents = slaFor(none).find((check) => check.id === "documents")!;
    expect(documents.state).toBe("not-applicable");
    expect(documents.actual).toBe("Nothing awaiting review");
  });

  it("counts the oldest document still in review", () => {
    const waiting = caseWith({
      documents: [
        {
          id: "d1",
          name: "transcript",
          category: "transcript",
          status: "In review",
          version: 1,
          uploadedAt: daysAgo(9),
          verifiedBy: null,
          verifiedAt: null,
          expiresOn: null,
          issue: null,
        },
      ],
    });
    const documents = slaFor(waiting).find((check) => check.id === "documents")!;
    expect(documents.state).toBe("breached");
    expect(documents.actual).toContain("oldest 9 days");
  });

  it("rolls up to the worst state on the caseload", () => {
    const bad = caseWith({
      stageUpdatedAt: daysAgo(30),
      lastStudentContactAt: daysAgo(10),
      lastCounselorReplyAt: daysAgo(20),
    });
    expect(worstSla(bad)).toBe("breached");

    const fine = caseWith({
      stageUpdatedAt: daysAgo(1),
      lastStudentContactAt: daysAgo(3),
      lastCounselorReplyAt: daysAgo(1),
      documents: [],
    });
    expect(worstSla(fine)).toBe("within");
  });

  it("publishes the targets rather than keeping them in someone's head", () => {
    for (const target of Object.values(slaTargets)) {
      expect(target.days).toBeGreaterThan(0);
      expect(target.statement.length).toBeGreaterThan(30);
    }
  });
});
