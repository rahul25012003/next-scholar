import { describe, expect, it } from "vitest";
import {
  applyCorrection,
  changeStage,
  closeCase,
  deferIntake,
  reassignTo,
  recordApplicationOutcome,
  recordVisaOutcome,
  startReapplication,
  withdrawApplication,
  addTask,
  completeTask,
  overrideSummary,
  reviewEscalation,
} from "@/domain/case-operations";
import { detectEvents } from "@/domain/events";
import { forStudent, newestFirst } from "@/domain/communications";
import { retentionFor } from "@/domain/retention";
import { buildQuarterlyReport } from "@/domain/reporting";
import { syntheticCases } from "@/data/synthetic-cases";
import { syntheticCommunications } from "@/data/synthetic-communications";

const withApps = syntheticCases.find((record) => record.id === "case-1042")!;
const plain = syntheticCases.find((record) => record.id === "case-1041")!;
const author = "Devika Suresh";
const daysAgo = (n: number) =>
  new Date(Date.now() - n * 86_400_000).toISOString();

describe("nothing is deleted and nothing is overwritten silently", () => {
  it("keeps the old value in the log when a value is corrected", () => {
    const corrected = applyCorrection(
      plain,
      { field: "intake", value: "April 2028", reason: "Student moved the plan back a semester." },
      author,
    );
    const entry = corrected.log.at(-1)!;

    expect(corrected.intake).toBe("April 2028");
    expect(entry.text).toContain(plain.intake);
    expect(entry.text).toContain("Reason:");
    expect(entry.author).toBe(author);
    expect(entry.source).toBe("human");
  });

  it("corrects one deadline by its label, leaving the others alone", () => {
    const corrected = applyCorrection(
      plain,
      {
        field: "deadline",
        targetId: "APS document submission",
        value: "2027-11-01",
        reason: "APS India pushed the appointment slot back a week.",
      },
      author,
    );
    const target = corrected.deadlines.find((item) => item.label === "APS document submission");
    const other = corrected.deadlines.find((item) => item.label === "uni-assist application");

    expect(target?.date).toBe("2027-11-01");
    expect(other?.date).toBe(plain.deadlines.find((item) => item.label === "uni-assist application")?.date);
    expect(corrected.log.at(-1)!.text).toContain("deadline (APS document submission)");
  });

  it("corrects one application's reference by its id, leaving the others alone", () => {
    const corrected = applyCorrection(
      withApps,
      {
        field: "reference",
        targetId: "app-1",
        value: "LEE-2027-999999",
        reason: "The portal reissued the reference after a name correction.",
      },
      author,
    );
    const target = corrected.applications.find((item) => item.id === "app-1");
    const other = corrected.applications.find((item) => item.id === "app-2");

    expect(target?.reference).toBe("LEE-2027-999999");
    expect(other?.reference).toBe(withApps.applications.find((item) => item.id === "app-2")?.reference);
    expect(corrected.log.at(-1)!.text).toContain("reference (app-1)");
  });

  it("corrects the student's name and the assigned counsellor", () => {
    const nameCorrected = applyCorrection(
      plain,
      { field: "name", value: "Meghana Rangaswamy Rao", reason: "Legal name added after marriage." },
      author,
    );
    expect(nameCorrected.name).toBe("Meghana Rangaswamy Rao");

    const counselorCorrected = applyCorrection(
      plain,
      { field: "counselor", value: "Devika Suresh", reason: "Caseload rebalanced." },
      author,
    );
    expect(counselorCorrected.counselor).toBe("Devika Suresh");
  });

  it("marks a withdrawn application rather than removing it", () => {
    const updated = withdrawApplication(
      withApps,
      "app-2",
      "Offer elsewhere accepted.",
      author,
    );

    expect(updated.applications).toHaveLength(withApps.applications.length);
    expect(updated.applications.find((item) => item.id === "app-2")?.outcome).toBe(
      "withdrawn",
    );
  });

  it("links a reapplication to the application it replaces", () => {
    const updated = startReapplication(
      withApps,
      "app-2",
      { id: "app-new", university: "University of Nottingham", programme: "MSc Mechanical" },
      author,
    );
    const created = updated.applications.find((item) => item.id === "app-new")!;

    expect(created.supersedes).toBe("app-2");
    expect(created.outcome).toBe("pending");
    expect(updated.applications).toHaveLength(withApps.applications.length + 1);
  });

  it("refuses a second live application to the same university and programme", () => {
    const updated = startReapplication(
      withApps,
      "app-2",
      { id: "app-new", university: "University of Leeds", programme: "MSc Advanced Mechanical Engineering" },
      author,
    );

    expect(updated).toBe(withApps);
    expect(updated.applications).toHaveLength(withApps.applications.length);
  });

  it("allows a fresh application to a place an earlier one already resolved against", () => {
    const withdrawn = withdrawApplication(withApps, "app-1", "Chose Sheffield instead.", author);
    const updated = startReapplication(
      withdrawn,
      "app-2",
      { id: "app-new", university: "University of Leeds", programme: "MSc Advanced Mechanical Engineering" },
      author,
    );

    expect(updated.applications.find((item) => item.id === "app-new")).toBeDefined();
  });
});

describe("a deferral moves the dates with the intake", () => {
  it("shifts every deadline rather than leaving them behind", () => {
    const deferred = deferIntake(plain, "April 2028", 180, author);

    expect(deferred.intake).toBe("April 2028");
    deferred.deadlines.forEach((deadline, index) => {
      const before = new Date(plain.deadlines[index].date).getTime();
      const after = new Date(deadline.date).getTime();
      expect(Math.round((after - before) / 86_400_000)).toBe(180);
    });
    expect(deferred.log.at(-1)?.text).toContain("recalculated");
  });

  it("says how many deadlines it touched", () => {
    const deferred = deferIntake(plain, "April 2028", 90, author);
    expect(deferred.log.at(-1)?.text).toContain(String(plain.deadlines.length));
  });
});

describe("closure is a decision, and it starts the retention clock", () => {
  it("stamps closedAt and moves the case to the outcome stage", () => {
    const closed = closeCase(plain, "visa-refused", "Funds evidence questioned.", author);

    expect(closed.closedAt).not.toBeNull();
    expect(closed.stage).toBe("outcome");
    expect(retentionFor(closed.closedAt).state).toBe("retained");
  });

  it("records that the outcome is published either way", () => {
    const closed = closeCase(plain, "advised-not-to-proceed", "Budget does not cover year one.", author);
    expect(closed.log.at(-1)?.text).toContain("quarterly report");
  });
});

describe("visa outcomes feed the report from a recorded decision", () => {
  it("stamps a decision date on an approval and a refusal only", () => {
    const approved = recordVisaOutcome(plain, "approved", "Granted first time.", author);
    const preparing = recordVisaOutcome(plain, "preparing", "File being assembled.", author);

    expect(approved.visa.decidedOn).not.toBeNull();
    expect(preparing.visa.decidedOn).toBeNull();
  });

  it("counts a refusal into the report and says it will be reviewed", () => {
    const refused = recordVisaOutcome(plain, "refused", "Funds evidence questioned.", author);
    const report = buildQuarterlyReport([refused]);

    expect(refused.log.at(-1)?.text).toContain("reapplication or an appeal");
    expect(
      report.categories.find((category) => category.key === "visa-refused")?.count,
    ).toBe(1);
  });
});

describe("reassignment and stage changes are logged with their reason", () => {
  it("names both counselors and the reason", () => {
    const moved = reassignTo(plain, "Karthik Menon", "Caseload rebalance.", author);

    expect(moved.counselor).toBe("Karthik Menon");
    expect(moved.log.at(-1)?.text).toContain(plain.counselor);
    expect(moved.log.at(-1)?.text).toContain("handover packet");
  });

  it("resets the stage timestamp so stagnation is measured from the move", () => {
    const moved = changeStage(plain, "applications", author);
    expect(new Date(moved.stageUpdatedAt).getTime()).toBeGreaterThan(
      new Date(plain.stageUpdatedAt).getTime(),
    );
  });

  it("does nothing when the stage is already what it would be set to", () => {
    const same = changeStage(plain, plain.stage, author);
    expect(same.log).toHaveLength(plain.log.length);
  });

  it("records an application outcome against the right application", () => {
    const updated = recordApplicationOutcome(
      withApps,
      "app-2",
      "rejected",
      "Below the entry requirement for this cycle.",
      author,
    );
    expect(updated.applications.find((item) => item.id === "app-2")?.outcome).toBe(
      "rejected",
    );
    expect(updated.applications.find((item) => item.id === "app-1")?.outcome).toBe(
      "offer",
    );
  });

  it("records offer terms without disturbing the other application", () => {
    const offer = { depositInr: 50_000, depositDeadline: "2027-01-15", scholarshipNote: null };
    const updated = recordApplicationOutcome(
      withApps,
      "app-2",
      "offer",
      "Conditional on final transcript.",
      author,
      undefined,
      offer,
    );

    expect(updated.applications.find((item) => item.id === "app-2")?.offer).toEqual(offer);
    expect(updated.applications.find((item) => item.id === "app-1")?.offer).toBeUndefined();
  });

  it("keeps an offer's terms on record even once the outcome moves on", () => {
    const offer = { depositInr: 50_000, depositDeadline: "2027-01-15", scholarshipNote: null };
    const offered = recordApplicationOutcome(
      withApps,
      "app-2",
      "offer",
      "Conditional on final transcript.",
      author,
      undefined,
      offer,
    );
    const declined = recordApplicationOutcome(
      offered,
      "app-2",
      "withdrawn",
      "Chose the other offer.",
      author,
    );

    expect(declined.applications.find((item) => item.id === "app-2")?.offer).toEqual(offer);
  });
});

describe("the student sees correspondence, not internal notes", () => {
  it("filters to the records marked visible to them", () => {
    const visible = forStudent(syntheticCommunications);
    expect(visible.every((record) => record.studentVisible)).toBe(true);
  });

  it("orders newest first in both views", () => {
    const ordered = newestFirst(syntheticCommunications);
    for (let index = 1; index < ordered.length; index += 1) {
      expect(ordered[index - 1].occurredAt >= ordered[index].occurredAt).toBe(true);
    }
  });

  it("keeps the raw thread and the summary as separate fields", () => {
    for (const record of syntheticCommunications) {
      expect(record.raw.length).toBeGreaterThan(0);
      expect(record.summary).toBeNull();
      expect(record.summarySource).toBeNull();
    }
  });
});

describe("follow ups are things a person chose, not things the system noticed", () => {
  const withTask = {
    ...plain,
    tasks: [
      {
        id: "t1",
        title: "Chase the bank",
        dueOn: new Date(Date.now() - 2 * 86_400_000).toISOString().slice(0, 10),
        createdBy: "Karthik Menon",
        createdAt: new Date().toISOString(),
        completedAt: null,
        completedBy: null,
      },
    ],
  };

  it("raises a followup_due event once it is due, naming who set it", () => {
    const event = detectEvents(withTask).find((item) => item.type === "followup_due");

    expect(event).toBeDefined();
    expect(event?.title).toContain("Chase the bank");
    expect(event?.detail).toContain("Karthik Menon");
    expect(event?.audience).toBe("counselor");
  });

  it("raises nothing for a follow up that is not due yet", () => {
    const later = {
      ...withTask,
      tasks: [
        {
          ...withTask.tasks[0],
          dueOn: new Date(Date.now() + 5 * 86_400_000).toISOString().slice(0, 10),
        },
      ],
    };

    expect(detectEvents(later).some((item) => item.type === "followup_due")).toBe(false);
  });

  it("stops raising once a person completes it, and keeps the record", () => {
    const done = completeTask(withTask, "t1", author);

    expect(done.tasks).toHaveLength(1);
    expect(done.tasks[0].completedBy).toBe(author);
    expect(detectEvents(done).some((item) => item.type === "followup_due")).toBe(false);
  });

  it("records the follow up in the log when it is created", () => {
    const created = addTask(
      plain,
      { id: "t2", title: "Call the university", dueOn: "2027-01-10" },
      author,
    );

    expect(created.tasks).toHaveLength(plain.tasks.length + 1);
    expect(created.log.at(-1)?.text).toContain("Call the university");
  });
});

describe("a person can take back a machine written summary", () => {
  it("relabels an overridden summary as human written", () => {
    const overridden = overrideSummary(
      { ...plain, summary: "machine text", summarySource: "ai" },
      "What is actually going on.",
      author,
    );

    expect(overridden.summary).toBe("What is actually going on.");
    expect(overridden.summarySource).toBe("human");
    expect(overridden.log.at(-1)?.text).toContain("rewritten by hand");
  });
});

describe("reviewing an escalation records a decision without silencing it", () => {
  it("logs the decision and leaves the underlying condition alone", () => {
    const stalled = { ...plain, stageUpdatedAt: daysAgo(14) };
    const reviewed = reviewEscalation(stalled, "Waiting on the passport office.", author);

    expect(reviewed.log.at(-1)?.text).toContain("Waiting on the passport office");
    expect(detectEvents(reviewed).some((event) => event.type === "escalation")).toBe(true);
  });
});
