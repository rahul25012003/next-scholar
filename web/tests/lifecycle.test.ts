import { describe, expect, it } from "vitest";
import { detectEvents } from "@/domain/events";
import { planNotifications, resolveStale, bodyFor } from "@/domain/notifications";
import { assessRisk, RISK_DISCLAIMER } from "@/domain/risk";
import { buildQuarterlyReport } from "@/domain/reporting";
import { profileFromCase, proposeShortlist } from "@/domain/matching";
import { syntheticCases } from "@/data/synthetic-cases";
import type { StudentCase } from "@/domain/case";

const base = syntheticCases[0];
const day = 86_400_000;
const daysAgo = (n: number) => new Date(Date.now() - n * day).toISOString();
const daysAhead = (n: number) =>
  new Date(Date.now() + n * day).toISOString().slice(0, 10);

function caseWith(overrides: Partial<StudentCase>): StudentCase {
  return { ...base, ...overrides };
}

describe("events are read from stored values, never invented", () => {
  it("raises a deadline event inside thirty days and escalates the priority as it closes", () => {
    const near = detectEvents(
      caseWith({ deadlines: [{ label: "Visa appointment", date: daysAhead(2) }] }),
    ).find((event) => event.type === "deadline");
    const far = detectEvents(
      caseWith({ deadlines: [{ label: "Visa appointment", date: daysAhead(25) }] }),
    ).find((event) => event.type === "deadline");

    expect(near?.priority).toBe("Urgent");
    expect(far?.priority).toBe("Normal");
  });

  it("raises nothing for a deadline beyond the window", () => {
    const events = detectEvents(
      caseWith({ deadlines: [{ label: "Far off", date: daysAhead(120) }] }),
    );
    expect(events.filter((event) => event.type === "deadline")).toHaveLength(0);
  });

  it("says a date is absent rather than treating it as zero", () => {
    const events = detectEvents(caseWith({ deadlines: [] }));
    expect(events.filter((event) => event.type === "deadline")).toHaveLength(0);
  });

  it("flags a required document that is not verified at this stage", () => {
    const events = detectEvents(
      caseWith({ stage: "applications", documents: [] }),
    ).filter((event) => event.type === "missing_doc");
    expect(events).toHaveLength(3);
    expect(events.every((event) => event.basis.includes("applications"))).toBe(true);
  });

  it("raises stagnation after five days and escalates after ten", () => {
    const stalled = detectEvents(caseWith({ stageUpdatedAt: daysAgo(6) }));
    const stuck = detectEvents(caseWith({ stageUpdatedAt: daysAgo(12) }));

    expect(stalled.some((event) => event.type === "stagnation")).toBe(true);
    expect(stalled.some((event) => event.type === "escalation")).toBe(false);
    expect(stuck.some((event) => event.type === "escalation")).toBe(true);
  });

  it("breaches the response threshold when a student is waiting longer than a day", () => {
    const events = detectEvents(
      caseWith({
        lastStudentContactAt: daysAgo(2),
        lastCounselorReplyAt: daysAgo(5),
      }),
    );
    expect(events.some((event) => event.type === "sla_breach")).toBe(true);
  });

  it("raises no breach when the counselor replied last", () => {
    const events = detectEvents(
      caseWith({
        lastStudentContactAt: daysAgo(4),
        lastCounselorReplyAt: daysAgo(1),
      }),
    );
    expect(events.some((event) => event.type === "sla_breach")).toBe(false);
  });

  it("never resolves or closes anything itself", () => {
    const escalation = detectEvents(caseWith({ stageUpdatedAt: daysAgo(14) })).find(
      (event) => event.type === "escalation",
    );
    expect(escalation?.audience).toBe("manager");
    expect(escalation?.detail).toContain("No automated step");
  });
});

describe("notifications dedupe and never leak sensitive detail to WhatsApp", () => {
  it("creates one notification per event and channel, then none on a repeat run", () => {
    const events = detectEvents(
      caseWith({ deadlines: [{ label: "Visa appointment", date: daysAhead(2) }] }),
    );
    const first = planNotifications(events, []);
    expect(first.length).toBeGreaterThan(0);

    const second = planNotifications(events, first);
    expect(second).toHaveLength(0);
  });

  it("resolves a notification once its event clears, rather than deleting it", () => {
    const events = detectEvents(
      caseWith({ deadlines: [{ label: "Visa appointment", date: daysAhead(2) }] }),
    );
    const queued = planNotifications(events, []);
    const resolved = resolveStale(queued, []);

    expect(resolved).toHaveLength(queued.length);
    expect(resolved.every((item) => item.resolvedAt !== null)).toBe(true);
  });

  it("sends only a template to WhatsApp, never the event detail", () => {
    const events = detectEvents(
      caseWith({
        documents: [
          {
            id: "d",
            name: "Passport",
            category: "passport",
            status: "In review",
            version: 1,
            uploadedAt: daysAgo(3),
            verifiedBy: null,
            verifiedAt: null,
            expiresOn: daysAhead(5),
            issue: "Number does not match the application form",
          },
        ],
      }),
    );
    const expiry = events.find((event) => event.type === "expiry")!;
    const whatsapp = bodyFor(expiry, "whatsapp");
    const inApp = bodyFor(expiry, "in_app");

    expect(whatsapp).not.toContain("Passport");
    expect(whatsapp).not.toContain("does not match");
    expect(inApp).toContain("Passport");
  });
});

describe("risk is a band with a reason, never a score", () => {
  it("returns no number anywhere in the assessment", () => {
    const assessment = assessRisk(base);
    const serialised = JSON.stringify(assessment);
    expect(serialised).not.toMatch(/\d+\s?%/);
    expect(["Steady", "Watch", "Needs attention"]).toContain(assessment.band);
  });

  it("states the evidence behind every indicator", () => {
    const assessment = assessRisk(base);
    for (const indicator of assessment.indicators) {
      expect(indicator.evidence.length).toBeGreaterThan(10);
    }
  });

  it("carries the decision support disclaimer", () => {
    expect(RISK_DISCLAIMER).toContain("not a prediction");
  });

  it("raises the band when a document is flagged with an issue", () => {
    const assessment = assessRisk(base);
    expect(assessment.band).toBe("Needs attention");
  });
});

describe("reporting refuses to flatter", () => {
  it("keeps categories separate and excludes in progress cases", () => {
    const report = buildQuarterlyReport(syntheticCases);
    const keys = report.categories.map((category) => category.key);

    expect(keys).toContain("offers");
    expect(keys).toContain("rejected");
    expect(keys).toContain("visa-refused");
    expect(keys).not.toContain("success-rate");
    expect(report.inProgress).toBeGreaterThan(0);
  });

  it("counts visas from the recorded decision, not from a stage or a zero", () => {
    const approved: StudentCase = {
      ...base,
      visa: { state: "approved", note: null, decidedOn: "2027-08-01" },
    };
    const refused: StudentCase = {
      ...base,
      id: "case-x",
      visa: { state: "refused", note: "Funds evidence questioned.", decidedOn: "2027-08-04" },
    };

    const report = buildQuarterlyReport([approved, refused]);
    const count = (key: string) =>
      report.categories.find((category) => category.key === key)?.count;

    expect(count("visa-approved")).toBe(1);
    expect(count("visa-refused")).toBe(1);
    expect(count("visa-submitted")).toBe(2);
  });

  it("reports a refusal even when every other case succeeded", () => {
    const report = buildQuarterlyReport([
      { ...base, visa: { state: "approved", note: null, decidedOn: "2027-08-01" } },
      { ...base, id: "b", visa: { state: "refused", note: null, decidedOn: "2027-08-02" } },
    ]);
    const refusals = report.categories.find((category) => category.key === "visa-refused");

    expect(refusals?.count).toBe(1);
    expect(report.categories.some((category) => category.key.includes("rate"))).toBe(false);
  });

  it("refuses to publish a report computed from synthetic records", () => {
    const report = buildQuarterlyReport(syntheticCases);
    expect(report.publishable).toBe(false);
    expect(report.blockedReason).toContain("synthetic");
  });
});

describe("matching states its reasons and never hides a commission", () => {
  it("carries a commission figure and status on every proposal", () => {
    const { proposals } = proposeShortlist({ budgetInr: 3_000_000, wantsLowTuition: true });
    expect(proposals.length).toBeGreaterThan(0);
    for (const proposal of proposals) {
      expect(proposal.commission.display).toBeTruthy();
      expect(proposal.commission.statusLabel).toBeTruthy();
      expect(proposal.reasons.length).toBeGreaterThan(0);
    }
  });

  it("flags an unverified figure as an assumption rather than dropping it", () => {
    const { proposals } = proposeShortlist({ budgetInr: 3_000_000 });
    const unverified = proposals.filter((proposal) => !proposal.commission.verified);
    expect(unverified.length).toBeGreaterThan(0);
    for (const proposal of unverified) {
      expect(proposal.assumptions.join(" ")).toContain("market estimate");
    }
  });

  it("excludes a route it cannot justify, with the reason attached", () => {
    const { excluded } = proposeShortlist({ budgetInr: 400_000 });
    expect(excluded.length).toBeGreaterThan(0);
    expect(excluded[0].why.length).toBeGreaterThan(10);
  });
});

describe("matching uses what is on file and flags what is not", () => {
  it("gives an academic reason when a percentage is on file", () => {
    const { proposals } = proposeShortlist({
      budgetInr: 3_000_000,
      percentage: 78,
    });
    expect(
      proposals.some((proposal) =>
        proposal.reasons.some((reason) => reason.includes("78%")),
      ),
    ).toBe(true);
  });

  it("flags a below range record rather than silently ranking around it", () => {
    const { proposals } = proposeShortlist({
      budgetInr: 3_000_000,
      percentage: 58,
    });
    expect(
      proposals.every((proposal) =>
        proposal.assumptions.some((note) => note.includes("below the range")),
      ),
    ).toBe(true);
  });

  it("says so when there is no academic record at all", () => {
    const { proposals } = proposeShortlist({ budgetInr: 3_000_000 });
    expect(
      proposals.every((proposal) =>
        proposal.assumptions.some((note) => note.includes("No academic percentage")),
      ),
    ).toBe(true);
  });

  it("flags a missing English test on routes that require one", () => {
    const { proposals } = proposeShortlist({ budgetInr: 3_000_000, englishTest: null });
    expect(
      proposals.some((proposal) =>
        proposal.assumptions.some((note) => note.includes("English test")),
      ),
    ).toBe(true);
  });

  it("excludes a route the budget cannot fund, and says that is why", () => {
    const { excluded } = proposeShortlist({ budgetInr: 1_500_000 });
    expect(excluded.length).toBeGreaterThan(0);
    expect(excluded[0].why).toContain("cannot be funded");
  });

  it("recommends nothing at all when it knows nothing about the student", () => {
    const { proposals, excluded } = proposeShortlist({ budgetInr: null });

    expect(proposals).toHaveLength(0);
    expect(excluded.length).toBeGreaterThan(0);
    expect(
      excluded.every((entry) => entry.why.includes("without a reason is not one")),
    ).toBe(true);
  });

  it("proposes a route once one thing on file supports it", () => {
    const { proposals } = proposeShortlist({ budgetInr: null, percentage: 78 });

    expect(proposals.length).toBeGreaterThan(0);
    expect(
      proposals.every((proposal) =>
        proposal.assumptions.some((note) => note.includes("No year one budget")),
      ),
    ).toBe(true);
  });

  it("builds a profile from a case, carrying its risk factors in", () => {
    const profile = profileFromCase(syntheticCases[0]);
    expect(profile.percentage).toBe(74);
    expect(profile.englishTest?.name).toBe("IELTS");
    expect(profile.riskNotes?.length).toBeGreaterThan(0);
  });
});
