import { describe, expect, it } from "vitest";
import {
  cgpaToGpa,
  cgpaToMarks,
  cgpaToPercentage,
  checkEcts,
  germanBandFor,
  gpaFromSubjects,
  ieltsDescriptorFor,
  ieltsOverall,
  modifiedBavarian,
  percentageToCgpa,
  percentageToGpa,
  percentageToMarks,
  sgpaToCgpa,
} from "@/domain/calculators";

/**
 * These are published as tools a stranger uses to make a decision about
 * spending several lakh rupees, so the arithmetic is pinned rather than
 * eyeballed. The IELTS block in particular exists because the rounding rule has
 * two special cases and a naive implementation gets both wrong.
 */

const ok = <T,>(result: T | { error: string }): T => {
  if (result && typeof result === "object" && "error" in result) {
    throw new Error(`Expected a result, got: ${(result as { error: string }).error}`);
  }
  return result as T;
};

describe("Modified Bavarian Formula", () => {
  it("returns 1.0 for a perfect mark", () => {
    const result = ok(modifiedBavarian({ obtained: 10, max: 10, passing: 4 }));
    expect(result.display).toBe("1.0");
    expect(result.working.substituted).toBe("N = 1 + 3 × (10 − 10) ÷ (10 − 4)");
  });

  it("returns 4.0 at exactly the pass mark", () => {
    const result = ok(modifiedBavarian({ obtained: 4, max: 10, passing: 4 }));
    expect(result.display).toBe("4.0");
  });

  it("converts a typical Indian CGPA", () => {
    // 1 + 3 x (10 - 8.2) / (10 - 4) = 1 + 3 x 0.3 = 1.9
    const result = ok(modifiedBavarian({ obtained: 8.2, max: 10, passing: 4 }));
    expect(result.value).toBe(1.9);
    expect(result.working.result).toContain("Gut");
  });

  it("converts a percentage on a 100 point scale", () => {
    // 1 + 3 x (100 - 75) / (100 - 40) = 1 + 1.25 = 2.25 -> 2.3 at one decimal
    const result = ok(modifiedBavarian({ obtained: 75, max: 100, passing: 40 }));
    expect(result.value).toBe(2.3);
  });

  it("clamps below the pass mark to 4.0 and says so", () => {
    const result = ok(modifiedBavarian({ obtained: 30, max: 100, passing: 40 }));
    expect(result.value).toBe(4);
    expect(result.clamped).toContain("4.0");
  });

  it("shows every intermediate step, so the student can check it by hand", () => {
    const result = ok(modifiedBavarian({ obtained: 8.2, max: 10, passing: 4 }));
    expect(result.working.steps.length).toBeGreaterThanOrEqual(5);
    expect(result.working.steps[0]).toBe("Nmax − Nd = 10 − 8.2 = 1.8");
  });

  it("refuses inputs that cannot produce a meaningful grade", () => {
    expect(modifiedBavarian({ obtained: 5, max: 4, passing: 4 })).toHaveProperty("error");
    expect(modifiedBavarian({ obtained: 11, max: 10, passing: 4 })).toHaveProperty("error");
    expect(modifiedBavarian({ obtained: NaN, max: 10, passing: 4 })).toHaveProperty("error");
  });

  it("never claims an admission outcome", () => {
    const result = ok(modifiedBavarian({ obtained: 9.5, max: 10, passing: 4 }));
    const text = JSON.stringify(result).toLowerCase();
    for (const word of ["chance", "probability", "likely", "predict", "guarantee"]) {
      expect(text).not.toContain(word);
    }
  });
});

describe("German bands", () => {
  it("puts each grade in the band the scale defines", () => {
    expect(germanBandFor(1.0).german).toBe("Sehr gut");
    expect(germanBandFor(1.5).german).toBe("Sehr gut");
    expect(germanBandFor(1.6).german).toBe("Gut");
    expect(germanBandFor(2.5).german).toBe("Gut");
    expect(germanBandFor(2.6).german).toBe("Befriedigend");
    expect(germanBandFor(3.5).german).toBe("Befriedigend");
    expect(germanBandFor(3.6).german).toBe("Ausreichend");
    expect(germanBandFor(4.0).german).toBe("Ausreichend");
  });
});

describe("IELTS overall band", () => {
  const bands = (l: number, r: number, w: number, s: number) =>
    ok(ieltsOverall({ listening: l, reading: r, writing: w, speaking: s })).value;

  it("rounds a quarter band up", () => {
    // mean 6.25 -> 6.5
    expect(bands(6.5, 6.5, 6, 6)).toBe(6.5);
  });

  it("rounds three quarters up to the next whole band", () => {
    // mean 6.75 -> 7.0
    expect(bands(7, 7, 6.5, 6.5)).toBe(7);
  });

  it("rounds an eighth down", () => {
    // mean 6.125 -> 6.0
    expect(bands(6.5, 6, 6, 6)).toBe(6);
  });

  it("rounds three eighths up to the half band", () => {
    // mean 6.375 -> 6.5
    expect(bands(6.5, 6.5, 6.5, 6)).toBe(6.5);
  });

  it("rounds five eighths down to the half band", () => {
    // mean 6.625 -> 6.5
    expect(bands(7, 6.5, 6.5, 6.5)).toBe(6.5);
  });

  it("rounds seven eighths up to the whole band", () => {
    // mean 6.875 -> 7.0
    expect(bands(7, 7, 7, 6.5)).toBe(7);
  });

  it("leaves an exact half band alone", () => {
    expect(bands(6.5, 6.5, 6.5, 6.5)).toBe(6.5);
    expect(bands(7, 7, 7, 7)).toBe(7);
  });

  it("names the descriptor for the band", () => {
    const result = ok(ieltsOverall({ listening: 7, reading: 7, writing: 6.5, speaking: 6.5 }));
    expect(result.working.result).toContain("Good user");
    expect(ieltsDescriptorFor(6.5).name).toBe("Competent user");
  });

  it("refuses a score that is not a whole or half band", () => {
    expect(ieltsOverall({ listening: 6.3, reading: 6, writing: 6, speaking: 6 })).toHaveProperty(
      "error",
    );
    expect(ieltsOverall({ listening: 10, reading: 6, writing: 6, speaking: 6 })).toHaveProperty(
      "error",
    );
  });

  it("states that the overall band is not the whole requirement", () => {
    const result = ok(ieltsOverall({ listening: 7, reading: 7, writing: 5.5, speaking: 7 }));
    expect(result.limits.join(" ")).toContain("minimum in each section");
  });
});

describe("Indian grade conversions", () => {
  it("applies the 9.5 convention both ways", () => {
    expect(ok(cgpaToPercentage(8)).value).toBe(76);
    expect(ok(percentageToCgpa(76)).value).toBe(8);
  });

  it("names the convention rather than presenting it as a standard", () => {
    const result = ok(cgpaToPercentage(8));
    expect(result.source).toContain("CBSE");
    expect(result.limits.join(" ")).toContain("not a national standard");
  });

  it("converts CGPA to marks out of a stated total", () => {
    const result = ok(cgpaToMarks(8, 800));
    expect(result.value).toBe(608);
  });

  it("converts a percentage onto each GPA scale", () => {
    expect(ok(percentageToGpa(75, 4)).value).toBe(3);
    expect(ok(percentageToGpa(75, 5)).value).toBe(3.75);
    expect(ok(percentageToGpa(75, 10)).value).toBe(7.5);
  });

  it("converts CGPA to a 4 point GPA", () => {
    expect(ok(cgpaToGpa(8, 4)).value).toBe(3.2);
  });

  it("converts a percentage to marks", () => {
    expect(ok(percentageToMarks(62.5, 800)).value).toBe(500);
  });

  it("rejects out of range inputs on every converter", () => {
    expect(cgpaToPercentage(11)).toHaveProperty("error");
    expect(percentageToCgpa(101)).toHaveProperty("error");
    expect(percentageToGpa(-1, 4)).toHaveProperty("error");
    expect(cgpaToMarks(8, 0)).toHaveProperty("error");
  });
});

describe("SGPA to CGPA", () => {
  it("weights by credits when credits are supplied", () => {
    const result = ok(
      sgpaToCgpa([
        { sgpa: 8, credits: 20 },
        { sgpa: 9, credits: 30 },
      ]),
    );
    // (160 + 270) / 50 = 8.6
    expect(result.value).toBe(8.6);
    expect(result.source).toContain("Credit weighted");
  });

  it("falls back to the unweighted mean and says that it has", () => {
    const result = ok(sgpaToCgpa([{ sgpa: 8 }, { sgpa: 9 }]));
    expect(result.value).toBe(8.5);
    expect(result.source).toContain("Unweighted");
    expect(result.limits.join(" ")).toContain("Add the credits");
  });

  it("needs at least one semester", () => {
    expect(sgpaToCgpa([])).toHaveProperty("error");
  });
});

describe("GPA from subjects", () => {
  it("computes a credit weighted average", () => {
    const result = ok(
      gpaFromSubjects([
        { name: "Maths", credits: 4, points: 9 },
        { name: "Physics", credits: 3, points: 8 },
        { name: "Lab", credits: 1, points: 10 },
      ]),
    );
    // (36 + 24 + 10) / 8 = 8.75
    expect(result.value).toBe(8.75);
  });

  it("ignores rows with no credits rather than dividing by zero", () => {
    const result = ok(
      gpaFromSubjects([
        { name: "Maths", credits: 4, points: 9 },
        { name: "", credits: 0, points: 0 },
      ]),
    );
    expect(result.value).toBe(9);
  });

  it("needs at least one usable subject", () => {
    expect(gpaFromSubjects([{ name: "", credits: 0, points: 0 }])).toHaveProperty("error");
  });
});

describe("ECTS credit check", () => {
  it("reports each area's gap and orders the shortfalls worst first", () => {
    const result = checkEcts({
      totalRequired: 180,
      totalHeld: 160,
      areas: [
        { name: "Core subject", required: 60, held: 60 },
        { name: "Mathematics", required: 30, held: 18 },
        { name: "Technical modules", required: 40, held: 35 },
      ],
    });

    expect(result.meetsTotal).toBe(false);
    expect(result.totalGap).toBe(20);
    expect(result.shortfalls).toEqual([
      { name: "Mathematics", gap: 12 },
      { name: "Technical modules", gap: 5 },
    ]);
    expect(result.areas.find((area) => area.name === "Core subject")?.met).toBe(true);
  });

  it("never reports a negative gap for a surplus", () => {
    const result = checkEcts({
      totalRequired: 180,
      totalHeld: 240,
      areas: [{ name: "Mathematics", required: 30, held: 45 }],
    });
    expect(result.totalGap).toBe(0);
    expect(result.areas[0].gap).toBe(0);
    expect(result.shortfalls).toEqual([]);
  });

  it("states which requirements are met without concluding an outcome", () => {
    const result = checkEcts({
      totalRequired: 180,
      totalHeld: 180,
      areas: [{ name: "Mathematics", required: 30, held: 30 }],
    });
    expect(result.working.result).toBe("Every stated credit requirement is met on these numbers");
    const text = JSON.stringify(result).toLowerCase();
    for (const word of ["admitted", "chance", "probability", "likely"]) {
      expect(text).not.toContain(word);
    }
  });
});
