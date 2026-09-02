import { beforeEach, describe, expect, it } from "vitest";
import { findSensitiveInput } from "@/domain/agents/guards";
import { appendNote, clearManualReview, flagForManualReview, getCase } from "@/data/store";
import { resetAudit, auditFor } from "@/domain/audit";
import { demoCounselor, demoStudent } from "@/domain/demo-actors";

/**
 * The note flow, including the five sample notes from the source guide's own
 * testing table.
 *
 * The guide's table expects a single classification call to set `priority` and
 * `docStatus` from the note text. This build deliberately does not do that: the
 * ten agent architecture in the same document prohibits the Case Summary agent
 * from touching either field, so triage stays a human judgement and the case
 * level document status is derived from the documents themselves.
 *
 * That divergence is only defensible if the alternative actually holds, so the
 * table is kept and the expectations rewritten to what this system promises:
 * the note is always saved, nothing reclassifies it silently, and a note that
 * cannot be read by a machine leaves a visible flag rather than nothing.
 */

const samples = [
  {
    note: "All good, transcript verified, moving to applications.",
    sensitive: false,
  },
  {
    note: "Bank statement has a mismatched date, might need reissue",
    sensitive: false,
  },
  {
    note: "Still waiting to hear back from the university, no news",
    sensitive: false,
  },
  {
    note: "Visa interview is in 3 days and documents aren't ready",
    sensitive: false,
  },
  { note: "asdkjh qwe", sensitive: false },
];

beforeEach(() => {
  resetAudit();
});

describe("the source guide's sample notes", () => {
  it("saves every one of them to the log, whatever a machine makes of it", async () => {
    for (const sample of samples) {
      const updated = await appendNote(
        "case-1041",
        { text: sample.note, source: "human", author: demoCounselor.name },
        demoCounselor,
      );
      expect(updated?.log.at(-1)?.text).toBe(sample.note);
      expect(updated?.log.at(-1)?.source).toBe("human");
    }
  });

  it("sends none of them to a model on the sensitive input check", () => {
    for (const sample of samples) {
      expect(Boolean(findSensitiveInput(sample.note))).toBe(sample.sensitive);
    }
  });

  it("never lets a machine set the priority or the document status", async () => {
    const before = await getCase("case-1041", demoCounselor);
    await appendNote(
      "case-1041",
      {
        text: "Visa interview is in 3 days and documents aren't ready",
        source: "human",
        author: demoCounselor.name,
      },
      demoCounselor,
    );
    const after = await getCase("case-1041", demoCounselor);

    expect(after?.priority).toBe(before?.priority);
    expect(after?.docStatus).toBe(before?.docStatus);
  });
});

describe("a note that must not reach a model is refused before it goes", () => {
  it("catches a passport number", () => {
    const found = findSensitiveInput("Passport number is M1234567, uploaded today.");
    expect(found?.rule).toContain("passport");
  });

  it("catches a financial figure", () => {
    expect(
      findSensitiveInput("Balance shows ₹32,00,000 in the sponsor account."),
    ).not.toBeNull();
    expect(findSensitiveInput("Loan sanctioned for GBP 24,000.")).not.toBeNull();
  });

  it("catches a long reference number", () => {
    expect(findSensitiveInput("Reference 883210094512 on the transfer.")).not.toBeNull();
  });

  it("lets an ordinary situation note through", () => {
    expect(
      findSensitiveInput(
        "Bank statement date does not match the sponsor letter. Asked for a reissue.",
      ),
    ).toBeNull();
    expect(
      findSensitiveInput("Passport expires during the intake year, renewal started."),
    ).toBeNull();
  });
});

describe("a failed classification leaves something behind", () => {
  it("raises a flag on the case and records why", async () => {
    await flagForManualReview("case-1041", "some note", "The model was unavailable.");
    const record = await getCase("case-1041", demoCounselor);

    expect(record?.needsManualReview?.reason).toBe("The model was unavailable.");
    expect(record?.needsManualReview?.note).toBe("some note");
  });

  it("is cleared only by a person, and the clearing is recorded", async () => {
    await flagForManualReview("case-1041", "some note", "The model was unavailable.");
    resetAudit();

    const cleared = await clearManualReview("case-1041", demoCounselor);
    expect(cleared?.needsManualReview).toBeNull();

    const entry = auditFor("case-1041").find(
      (item) => item.field === "needsManualReview",
    );
    expect(entry?.actorName).toBe(demoCounselor.name);
    expect(entry?.after).toBe("cleared");
  });

  it("cannot be cleared by someone who may not write to the case", async () => {
    await flagForManualReview("case-1041", "some note", "The model was unavailable.");
    expect(await clearManualReview("case-1041", demoStudent)).toBeNull();
  });
});
