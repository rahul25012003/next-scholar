import { describe, expect, it } from "vitest";
import { scholarships, scholarshipsFor } from "@/content/scholarships";

describe("scholarships follow the same honesty rules as the catalogue", () => {
  it("gives a reason for every unknown field, never a bare not available", () => {
    const fields = scholarships.flatMap((item) => [item.coverage, item.deadline]);
    expect(fields.length).toBeGreaterThan(6);
    for (const field of fields) {
      if (field.state === "unknown") {
        expect(field.reason.length).toBeGreaterThan(20);
        expect(field.reason.toLowerCase()).not.toBe("not available");
      } else {
        expect(field.source.length).toBeGreaterThan(0);
        expect(field.statedOn).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      }
    }
  });

  it("names a real funder, never us, on every scholarship", () => {
    for (const item of scholarships) {
      expect(item.funder.toLowerCase()).not.toContain("next scholar");
      expect(item.link).toMatch(/^https:\/\//);
    }
  });

  it("filters by destination", () => {
    expect(scholarshipsFor("germany").every((item) => item.destination === "germany")).toBe(true);
    expect(scholarshipsFor("germany").length).toBeGreaterThan(0);
  });

  it("never states a specific current-cycle deadline as an unqualified fact", () => {
    for (const item of scholarships) {
      if (item.deadline.state === "stated") {
        expect(item.deadline.value.toLowerCase()).toMatch(/historically|varies|check/);
      }
    }
  });

  it("never turns a deadline or coverage line into a probability or a ranking", () => {
    const banned = /\bscore\b|\bmatch percentage\b|\badmission chance\b|\bprobability\b/i;
    for (const item of scholarships) {
      expect(item.eligibility).not.toMatch(banned);
      if (item.coverage.state === "stated") expect(item.coverage.value).not.toMatch(banned);
    }
  });
});
