import { describe, expect, it } from "vitest";
import {
  activeFilterCount,
  applyFilters,
  disciplines,
  emptyFilters,
  filtersFromParams,
  nextDeadline,
  paramsFromFilters,
  programmeFor,
  programmes,
  sortOptions,
  sortProgrammes,
  universities,
  universityFor,
} from "@/content/catalogue";

/**
 * Two things are being protected here.
 *
 * The commission disclosure, which is the whole reason this catalogue exists:
 * every institution must carry a band, and no filter or sort may be able to
 * produce a list that hides one.
 *
 * And the refusal to invent. Every field in the catalogue is either a value
 * with a source or an absence with a reason, and a course with no published fee
 * must not be treated as free by a sort or a filter.
 */

describe("every institution discloses what we earn", () => {
  it("has a commission band on every university, with no opt out", () => {
    for (const university of universities) {
      expect(university.commission.display.length).toBeGreaterThan(0);
      expect(university.commission.note.length).toBeGreaterThan(0);
      expect(university.commission.lowInr).toBeGreaterThanOrEqual(0);
      expect(university.commission.highInr).toBeGreaterThanOrEqual(
        university.commission.lowInr,
      );
    }
  });

  it("marks the German public universities as a confirmed zero", () => {
    const publicGerman = universities.filter(
      (item) => item.destination === "germany" && item.type === "public",
    );
    expect(publicGerman.length).toBeGreaterThan(0);
    for (const university of publicGerman) {
      expect(university.commission.highInr).toBe(0);
      expect(university.commission.status).toBe("verified-publishable");
    }
  });

  it("flags the band that runs above the category average", () => {
    const flagged = universities.filter((item) => item.commission.aboveAverage);
    expect(flagged.length).toBeGreaterThan(0);
    for (const university of flagged) {
      expect(university.commission.note).toContain("above the average");
    }
  });

  it("never presents a market estimate as a contract term", () => {
    for (const university of universities) {
      if (university.commission.source === "market-estimate") {
        expect(university.commission.status).toBe("unverified");
      }
    }
  });
});

describe("every field is sourced or explained", () => {
  it("gives a reason for every unknown, and never a bare not available", () => {
    const fields = universities.flatMap((university) => [
      university.tuitionNote,
      ...Object.values(university.highlights),
      ...university.exams.flatMap((exam) => [exam.undergraduate, exam.postgraduate]),
      ...university.programmes.flatMap((programme) => [
        programme.feePerYear,
        programme.entryRequirement,
        programme.prerequisites,
        programme.placement,
      ]),
    ]);

    expect(fields.length).toBeGreaterThan(50);
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

  it("states an exam requirement as Not required rather than leaving it blank", () => {
    const explicit = universities
      .flatMap((university) => university.exams)
      .flatMap((exam) => [exam.undergraduate, exam.postgraduate])
      .filter((field) => field.state === "stated" && field.value.includes("Not required"));

    expect(explicit.length).toBeGreaterThan(0);
  });

  it("records what has not been checked on every institution", () => {
    for (const university of universities) {
      expect(university.notChecked.length).toBeGreaterThan(0);
    }
  });
});

describe("filters", () => {
  it("applies nothing when nothing is set", () => {
    expect(applyFilters(programmes, emptyFilters)).toHaveLength(programmes.length);
    expect(activeFilterCount(emptyFilters)).toBe(0);
  });

  it("does not let one filter clear another", () => {
    const both = applyFilters(programmes, {
      ...emptyFilters,
      destinations: ["germany"],
      disciplines: ["Computer Science"],
    });

    expect(both.length).toBeGreaterThan(0);
    for (const row of both) {
      expect(row.university.destination).toBe("germany");
      expect(row.disciplines).toContain("Computer Science");
    }
  });

  it("filters to institutions that pay us nothing", () => {
    const zero = applyFilters(programmes, { ...emptyFilters, zeroCommissionOnly: true });
    expect(zero.length).toBeGreaterThan(0);
    for (const row of zero) {
      expect(row.university.commission.highInr).toBe(0);
    }
  });

  it("hides the bands above the category average when asked", () => {
    const hidden = applyFilters(programmes, { ...emptyFilters, hideAboveAverage: true });
    expect(hidden.every((row) => !row.university.commission.aboveAverage)).toBe(true);
    expect(hidden.length).toBeLessThan(programmes.length);
  });

  it("keeps the two currencies apart rather than converting them", () => {
    const cheapUk = applyFilters(programmes, { ...emptyFilters, maxFeeGbp: 20000 });
    // A euro-priced course is untouched by a sterling cap.
    expect(cheapUk.some((row) => row.currency === "EUR")).toBe(true);
    for (const row of cheapUk) {
      if (row.currency === "GBP" && row.feePerYear.state === "stated") {
        expect(row.feePerYear.value).toBeLessThanOrEqual(20000);
      }
    }
  });

  it("excludes a course with no published fee from a fee cap, rather than assuming zero", () => {
    const capped = applyFilters(programmes, { ...emptyFilters, maxFeeEur: 100000 });
    for (const row of capped) {
      if (row.currency === "EUR") expect(row.feePerYear.state).toBe("stated");
    }
  });

  it("searches across course, university, city and subject", () => {
    expect(applyFilters(programmes, { ...emptyFilters, query: "munich" }).length).toBeGreaterThan(0);
    expect(applyFilters(programmes, { ...emptyFilters, query: "data" }).length).toBeGreaterThan(0);
    expect(applyFilters(programmes, { ...emptyFilters, query: "zzzz" })).toHaveLength(0);
  });

  it("round trips through a query string, so a filtered list is a real URL", () => {
    const filters = {
      ...emptyFilters,
      destinations: ["germany", "ireland"],
      disciplines: ["Computer Science"],
      levels: ["masters" as const],
      maxFeeEur: 25000,
      zeroCommissionOnly: true,
      query: "data",
    };

    const params = new URLSearchParams(paramsFromFilters(filters));
    const parsed = filtersFromParams(Object.fromEntries(params.entries()));

    expect(parsed).toEqual(filters);
  });

  it("ignores a level that is not one of the two", () => {
    const parsed = filtersFromParams({ level: "phd,masters" });
    expect(parsed.levels).toEqual(["masters"]);
  });
});

describe("sorting", () => {
  it("offers a stated ordering for every option, and no undefined popularity", () => {
    for (const option of sortOptions) {
      expect(option.note.length).toBeGreaterThan(20);
      expect(option.label.toLowerCase()).not.toContain("popular");
      expect(option.label.toLowerCase()).not.toContain("relevance");
      expect(option.label.toLowerCase()).not.toContain("recommended");
    }
  });

  it("sorts unpublished fees last on both fee orders", () => {
    const ascending = sortProgrammes(programmes, "fee-asc");
    const descending = sortProgrammes(programmes, "fee-desc");

    const lastAsc = ascending[ascending.length - 1];
    const lastDesc = descending[descending.length - 1];

    expect(lastAsc.feePerYear.state).toBe("unknown");
    expect(lastDesc.feePerYear.state).toBe("unknown");
  });

  it("puts a free course first on the cheapest ordering, not an unpublished one", () => {
    const ascending = sortProgrammes(programmes, "fee-asc");
    expect(ascending[0].feePerYear.state).toBe("stated");
    if (ascending[0].feePerYear.state === "stated") {
      expect(ascending[0].feePerYear.value).toBe(0);
    }
  });

  it("orders by what we earn, lowest first, starting from zero", () => {
    const rows = sortProgrammes(programmes, "commission-asc");
    expect(rows[0].university.commission.lowInr).toBe(0);
    expect(
      rows[rows.length - 1].university.commission.lowInr,
    ).toBeGreaterThanOrEqual(rows[0].university.commission.lowInr);
  });

  it("orders by the soonest deadline still ahead", () => {
    const rows = sortProgrammes(programmes, "deadline");
    const dates = rows.map((row) => nextDeadline(row)).filter((date): date is string => date !== null);
    expect([...dates]).toEqual([...dates].sort());
  });

  it("falls back to alphabetical for an unrecognised key", () => {
    const rows = sortProgrammes(programmes, "not-a-sort");
    const names = rows.map((row) => row.university.name);
    expect([...names]).toEqual([...names].sort((a, b) => a.localeCompare(b)));
  });
});

describe("lookups", () => {
  it("resolves a university and a programme by slug", () => {
    expect(universityFor("kit-karlsruhe")?.city).toBe("Karlsruhe");
    expect(programmeFor("kit-msc-mechanical-engineering")?.university.slug).toBe(
      "kit-karlsruhe",
    );
    expect(universityFor("nowhere")).toBeNull();
    expect(programmeFor("nothing")).toBeNull();
  });

  it("counts every discipline across the catalogue", () => {
    const list = disciplines();
    expect(list.length).toBeGreaterThan(3);
    expect(list.every((item) => item.count > 0)).toBe(true);
    expect([...list].map((item) => item.name)).toEqual(
      [...list].map((item) => item.name).sort((a, b) => a.localeCompare(b)),
    );
  });

  it("carries the Baden-Wurttemberg fee onto the courses in that state", () => {
    const kit = programmeFor("kit-msc-mechanical-engineering")!;
    expect(kit.feePerYear.state).toBe("stated");
    if (kit.feePerYear.state === "stated") {
      // EUR 1,500 a semester is EUR 3,000 a year.
      expect(kit.feePerYear.value).toBe(3000);
      expect(kit.feePerYear.source).toContain("Baden-Wurttemberg");
    }
  });

  it("carries a genuine zero onto the courses that have no tuition", () => {
    const rwth = programmeFor("rwth-msc-data-science")!;
    expect(rwth.feePerYear.state).toBe("stated");
    if (rwth.feePerYear.state === "stated") {
      expect(rwth.feePerYear.value).toBe(0);
      expect(rwth.feePerYear.qualifier).toContain("No tuition fee");
    }
  });
});
