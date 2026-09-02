import { describe, expect, it } from "vitest";
import { deriveDocStatus, requiredAtStage } from "@/domain/completeness";
import { detectEvents } from "@/domain/events";
import { escalateOpen, planNotifications, bodyFor } from "@/domain/notifications";
import { channelAllowed, type ChannelConsent } from "@/domain/consent";
import { buildQuarterlyReport } from "@/domain/reporting";
import { requirementsFor } from "@/content/requirements";
import { syntheticCases } from "@/data/synthetic-cases";
import type { StudentCase } from "@/domain/case";

const base = syntheticCases[0];
const daysAhead = (n: number) =>
  new Date(Date.now() + n * 86_400_000).toISOString().slice(0, 10);

function caseWith(overrides: Partial<StudentCase>): StudentCase {
  return { ...base, ...overrides };
}

describe("there is one source of truth for required documents", () => {
  it("reads the stage requirements from the curated list, not a second copy", () => {
    const curated = requirementsFor("Germany")!.documents;
    const atVisa = requiredAtStage("Germany", "visa");
    expect(atVisa).toEqual(curated);
  });

  it("returns nothing for a destination with no curated list", () => {
    expect(requiredAtStage("Canada", "applications")).toEqual([]);
  });

  it("raises a missing document event for exactly the curated categories", () => {
    const events = detectEvents(
      caseWith({ stage: "visa", documents: [] }),
    ).filter((event) => event.type === "missing_doc");

    expect(events).toHaveLength(requirementsFor("Germany")!.documents.length);
  });
});

describe("the case document status is derived, so it cannot drift", () => {
  it("reports not started when there are no documents", () => {
    expect(deriveDocStatus(caseWith({ documents: [] }))).toBe("Not started");
  });

  it("reports issue found when any document has one", () => {
    expect(deriveDocStatus(base)).toBe("Issue found");
  });

  it("reports verified only when every required document is verified", () => {
    const allVerified = caseWith({
      documents: requirementsFor("Germany")!.documents.map((category, index) => ({
        id: `d${index}`,
        name: category,
        category,
        status: "Verified" as const,
        version: 1,
        uploadedAt: new Date().toISOString(),
        verifiedBy: "Rohini Bhat",
        verifiedAt: new Date().toISOString(),
        expiresOn: null,
        issue: null,
      })),
    });

    expect(deriveDocStatus(allVerified)).toBe("Verified");
  });

  it("does not report verified while one required document is still missing", () => {
    const partial = caseWith({
      documents: [
        {
          id: "d1",
          name: "transcript",
          category: "transcript",
          status: "Verified",
          version: 1,
          uploadedAt: new Date().toISOString(),
          verifiedBy: "Rohini Bhat",
          verifiedAt: new Date().toISOString(),
          expiresOn: null,
          issue: null,
        },
      ],
    });

    expect(deriveDocStatus(partial)).toBe("In review");
  });
});

describe("an absent date is raised, not skipped", () => {
  it("flags a case past shortlist with no deadlines on file", () => {
    const events = detectEvents(caseWith({ stage: "applications", deadlines: [] }));
    const flagged = events.find((event) => event.key.endsWith("none-on-file"));

    expect(flagged).toBeDefined();
    expect(flagged?.detail).toContain("Absent is not the same as none");
  });

  it("flags a passport with no expiry recorded", () => {
    const events = detectEvents(
      caseWith({
        documents: [
          {
            id: "p1",
            name: "Passport",
            category: "passport",
            status: "In review",
            version: 1,
            uploadedAt: new Date().toISOString(),
            verifiedBy: null,
            verifiedAt: null,
            expiresOn: null,
            issue: null,
          },
        ],
      }),
    );

    expect(events.some((event) => event.title.includes("No expiry date on file"))).toBe(
      true,
    );
  });
});

describe("a reminder sequence actually escalates", () => {
  const consents: ChannelConsent[] = [
    {
      id: "c1",
      caseId: base.id,
      channel: "whatsapp",
      grantedAt: new Date().toISOString(),
      grantedBy: base.name,
      withdrawnAt: null,
    },
  ];

  it("re-queues an open reminder when its event becomes more urgent", () => {
    const far = detectEvents(
      caseWith({ deadlines: [{ label: "Visa appointment", date: daysAhead(25) }] }),
    );
    const deadlineKey = far.find((event) => event.type === "deadline")!.key;
    const queued = planNotifications(far, [], consents);
    const onDeadline = (rows: typeof queued) =>
      rows.filter((item) => item.eventKey === deadlineKey);

    expect(onDeadline(queued).length).toBeGreaterThan(0);
    expect(onDeadline(queued).every((item) => item.priority === "Normal")).toBe(true);

    const near = detectEvents(
      caseWith({ deadlines: [{ label: "Visa appointment", date: daysAhead(2) }] }),
    );
    const { next, escalated } = escalateOpen(queued, near);

    expect(escalated).toBe(onDeadline(queued).length);
    expect(onDeadline(next).every((item) => item.priority === "Urgent")).toBe(true);
    expect(onDeadline(next).every((item) => item.deliveryStatus === "queued")).toBe(true);
  });

  it("leaves a reminder alone when the urgency has not changed", () => {
    const events = detectEvents(
      caseWith({ deadlines: [{ label: "Visa appointment", date: daysAhead(25) }] }),
    );
    const queued = planNotifications(events, [], consents);
    const { escalated } = escalateOpen(queued, events);

    expect(escalated).toBe(0);
    expect(queued.length).toBeGreaterThan(0);
  });
});

describe("a messaging channel needs a recorded opt in", () => {
  const events = detectEvents(
    caseWith({ deadlines: [{ label: "Visa appointment", date: daysAhead(2) }] }),
  );

  it("queues no WhatsApp row without consent", () => {
    const planned = planNotifications(events, [], []);
    expect(planned.some((item) => item.channel === "whatsapp")).toBe(false);
  });

  it("still queues the in-app record, which is the system of record", () => {
    const planned = planNotifications(events, [], []);
    expect(planned.some((item) => item.channel === "in_app")).toBe(true);
  });

  it("queues WhatsApp once the opt in exists", () => {
    const planned = planNotifications(events, [], [
      {
        id: "c1",
        caseId: base.id,
        channel: "whatsapp",
        grantedAt: new Date().toISOString(),
        grantedBy: base.name,
        withdrawnAt: null,
      },
    ]);
    expect(planned.some((item) => item.channel === "whatsapp")).toBe(true);
  });

  it("treats a withdrawn opt in as no opt in", () => {
    const withdrawn: ChannelConsent[] = [
      {
        id: "c1",
        caseId: base.id,
        channel: "whatsapp",
        grantedAt: new Date().toISOString(),
        grantedBy: base.name,
        withdrawnAt: new Date().toISOString(),
      },
    ];

    expect(channelAllowed(withdrawn, base.id, "whatsapp")).toBe(false);
    expect(
      planNotifications(events, [], withdrawn).some((item) => item.channel === "whatsapp"),
    ).toBe(false);
  });

  it("still sends only a template on the channel, once permitted", () => {
    const deadline = events.find((event) => event.type === "deadline")!;
    expect(bodyFor(deadline, "whatsapp")).not.toContain("Visa appointment");
  });
});

describe("the report counts closures, not stages", () => {
  const approvedOpen = caseWith({
    visa: { state: "approved", note: null, decidedOn: "2027-08-01" },
    closedAt: null,
    stage: "outcome",
  });
  const approvedClosed = caseWith({
    id: "case-closed",
    visa: { state: "approved", note: null, decidedOn: "2027-08-01" },
    closedAt: new Date().toISOString(),
  });

  it("does not count an enrolment until a person closes the case", () => {
    const open = buildQuarterlyReport([approvedOpen]);
    const closed = buildQuarterlyReport([approvedClosed]);
    const enrolled = (report: ReturnType<typeof buildQuarterlyReport>) =>
      report.categories.find((category) => category.key === "enrolled")?.count;

    expect(enrolled(open)).toBe(0);
    expect(enrolled(closed)).toBe(1);
  });

  it("counts a case at the final stage as still in progress until it is closed", () => {
    expect(buildQuarterlyReport([approvedOpen]).inProgress).toBe(1);
    expect(buildQuarterlyReport([approvedClosed]).inProgress).toBe(0);
  });

  it("carries the record ids behind every figure", () => {
    const report = buildQuarterlyReport([approvedClosed]);
    const enrolled = report.categories.find((category) => category.key === "enrolled")!;

    expect(enrolled.from).toEqual(["case-closed"]);
    for (const category of report.categories) {
      expect(category.count).toBe(category.from.length);
    }
  });

  it("keeps a student who discontinued out of the refusal count", () => {
    const discontinued = caseWith({
      id: "case-gone",
      synthetic: false,
      visa: { state: "not-started", note: null, decidedOn: null },
      closedAt: new Date().toISOString(),
    });
    const report = buildQuarterlyReport([discontinued]);
    const count = (key: string) =>
      report.categories.find((category) => category.key === key)?.count;

    expect(count("discontinued")).toBe(1);
    expect(count("visa-refused")).toBe(0);
  });
});

describe("a report does not publish without a person behind it", () => {
  const real = caseWith({ synthetic: false, closedAt: new Date().toISOString() });

  it("refuses to publish with no sign off, even on real records", () => {
    const report = buildQuarterlyReport([real]);
    expect(report.publishable).toBe(false);
    expect(report.blockedReason).toContain("sign off");
  });

  it("publishes once a named person has signed it off", () => {
    const report = buildQuarterlyReport([real], {
      by: "Founder",
      at: "2027-10-01",
    });

    expect(report.publishable).toBe(true);
    expect(report.signedOffBy).toBe("Founder");
    expect(report.blockedReason).toBeNull();
  });

  it("still refuses synthetic records even with a sign off", () => {
    const report = buildQuarterlyReport([base], { by: "Founder", at: "2027-10-01" });
    expect(report.publishable).toBe(false);
    expect(report.blockedReason).toContain("synthetic");
  });
});
