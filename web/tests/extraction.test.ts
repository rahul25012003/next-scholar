import { describe, expect, it } from "vitest";
import {
  authoritativeFields,
  decideField,
  pendingCount,
  stageFields,
} from "@/domain/extraction";

/**
 * Document Intelligence proposes. A person decides. These tests hold the line
 * between the two, because that line is the only thing standing between a
 * confident misreading and a wrong value on a visa file.
 */

const proposed = [
  { name: "CGPA", value: "7.4", confidence: "high" as const },
  { name: "Graduation year", value: "2023", confidence: "medium" as const },
  { name: "Passport expiry", value: "2027-06-14", confidence: "low" as const },
];

const staged = stageFields("doc-1", "case-1041", proposed, "Read cleanly.", false);

describe("nothing an agent proposes is authoritative", () => {
  it("stages every field as pending verification, whatever its confidence", () => {
    expect(staged.fields).toHaveLength(3);
    expect(staged.fields.every((field) => field.state === "pending-verification")).toBe(true);
    expect(staged.fields.every((field) => field.source === "ai")).toBe(true);
    expect(pendingCount(staged)).toBe(3);
  });

  it("treats a high confidence reading exactly like a low confidence one", () => {
    const high = staged.fields.find((field) => field.confidence === "high")!;
    const low = staged.fields.find((field) => field.confidence === "low")!;
    expect(high.state).toBe(low.state);
  });

  it("counts nothing as authoritative before a person decides", () => {
    expect(authoritativeFields(staged)).toHaveLength(0);
  });
});

describe("promotion is per field and carries a name", () => {
  it("confirms one field without touching the others", () => {
    const after = decideField(staged, "CGPA", "confirmed", "Rohini Bhat");

    expect(authoritativeFields(after).map((field) => field.name)).toEqual(["CGPA"]);
    expect(after.fields.find((field) => field.name === "CGPA")?.decidedBy).toBe(
      "Rohini Bhat",
    );
    expect(pendingCount(after)).toBe(2);
  });

  it("keeps a rejected proposal on the record rather than deleting it", () => {
    const after = decideField(staged, "Passport expiry", "rejected", "Rohini Bhat");
    const rejected = after.fields.find((field) => field.name === "Passport expiry");

    expect(after.fields).toHaveLength(3);
    expect(rejected?.state).toBe("rejected");
    expect(rejected?.decidedBy).toBe("Rohini Bhat");
    expect(authoritativeFields(after)).toHaveLength(0);
  });

  it("will not silently re-decide a field a person already ruled on", () => {
    const once = decideField(staged, "CGPA", "confirmed", "Rohini Bhat");
    const twice = decideField(once, "CGPA", "rejected", "Someone Else");
    const field = twice.fields.find((item) => item.name === "CGPA");

    expect(field?.state).toBe("confirmed");
    expect(field?.decidedBy).toBe("Rohini Bhat");
  });

  it("stamps the time of the decision, not the time of the reading", () => {
    const after = decideField(staged, "CGPA", "confirmed", "Rohini Bhat");
    const field = after.fields.find((item) => item.name === "CGPA")!;

    expect(field.decidedAt).not.toBeNull();
    expect(new Date(field.decidedAt!).getTime()).toBeGreaterThanOrEqual(
      new Date(staged.extractedAt).getTime(),
    );
  });
});

describe("an unreadable document says so", () => {
  it("carries the unreadable flag and proposes nothing", () => {
    const unreadable = stageFields(
      "doc-2",
      "case-1041",
      [],
      "Scan is too dark to read.",
      true,
    );

    expect(unreadable.unreadable).toBe(true);
    expect(unreadable.fields).toHaveLength(0);
    expect(authoritativeFields(unreadable)).toHaveLength(0);
  });
});
