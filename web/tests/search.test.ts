import { describe, expect, it } from "vitest";
import { corpusSummary, search } from "@/domain/search";

/**
 * The search is a plain scan, so what is worth pinning is not the algorithm but
 * the two properties that make it safe on this site: a commission figure
 * travels with the result, and nothing in the scoring can promote a result for
 * a reason a reader cannot see.
 */
describe("site search", () => {
  it("covers every content module", () => {
    const kinds = corpusSummary().map((item) => item.kind);
    for (const kind of [
      "Destination guide",
      "Course",
      "University",
      "Written guide",
      "Tool",
      "Policy",
      "Service",
      "Page",
    ]) {
      expect(kinds).toContain(kind);
    }
  });

  it("finds a figure that only appears in a guide's body", () => {
    const results = search("blocked account");
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].href).toContain("/destinations/germany");
  });

  it("finds the dMAT, which is the requirement the site previously omitted", () => {
    const results = search("dmat");
    expect(results.some((result) => result.href === "/guides/the-dmat-is-coming")).toBe(true);
  });

  it("ranks a title match above a body match", () => {
    const results = search("cost of living");
    expect(results[0].title.toLowerCase()).toContain("cost of living");
  });

  it("rewards a result matching every term", () => {
    const results = search("german grade calculator");
    expect(results[0].href).toBe("/tools/german-grade-calculator");
  });

  it("carries the commission figure onto every course and university result", () => {
    const results = search("computer science");
    const catalogue = results.filter(
      (result) => result.kind === "Course" || result.kind === "University",
    );
    expect(catalogue.length).toBeGreaterThan(0);
    for (const result of catalogue) {
      expect(result.commission).toBeTruthy();
    }
  });

  it("shows a confirmed zero as a zero rather than hiding it", () => {
    const results = search("RWTH Aachen");
    expect(results[0].commission).toBe("₹0");
  });

  it("ignores a query that is only noise", () => {
    expect(search("")).toEqual([]);
    expect(search("a")).toEqual([]);
    expect(search("zzzzqqq")).toEqual([]);
  });

  it("caps the result count", () => {
    expect(search("the", 5).length).toBeLessThanOrEqual(5);
  });

  it("has no field a result could be promoted by", () => {
    const [first] = search("germany");
    // score, and nothing that could encode a paid position.
    expect(Object.keys(first).sort()).toEqual(
      ["commission", "detail", "href", "kind", "minutes", "score", "title"].sort(),
    );
  });
});
