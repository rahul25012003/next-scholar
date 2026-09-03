import { describe, expect, it } from "vitest";
import { germanGates, recognitionSummary } from "@/domain/recognition";
import { runChecklist } from "@/domain/eligibility";
import {
  answeredCount,
  emptyOnboarding,
  nextSteps,
  parseOnboarding,
  toChecklistProfile,
} from "@/domain/onboarding";
import { syntheticCases } from "@/data/synthetic-cases";
import type { StudentCase } from "@/domain/case";

const germanCase = syntheticCases.find((item) => item.id === "case-1041")!;
const ukCase = syntheticCases.find((item) => item.destination === "United Kingdom")!;
const unchecked = syntheticCases.find((item) => item.id === "case-1044")!;

describe("degree recognition gates", () => {
  it("says nothing at all for a case that is not on a German route", () => {
    expect(germanGates(ukCase)).toEqual([]);
    expect(recognitionSummary(ukCase)).toBeNull();
  });

  it("reports the gates as clear when a person has checked them", () => {
    const gates = germanGates(germanCase);
    const anabin = gates.find((gate) => gate.id === "anabin")!;

    expect(anabin.state).toBe("clear");
    expect(anabin.title).toContain("H+");
    expect(gates.find((gate) => gate.id === "duration")?.state).toBe("clear");
    expect(gates.find((gate) => gate.id === "credits")?.state).toBe("clear");
  });

  it("reports an unstarted recognition as unchecked, and says what it blocks", () => {
    const gates = germanGates(unchecked);
    const anabin = gates.find((gate) => gate.id === "anabin")!;

    expect(anabin.state).toBe("unchecked");
    expect(anabin.blocks).toContain("shortlist");
    expect(recognitionSummary(unchecked)).toContain("not started");
  });

  it("returns one blocking gate when no recognition record exists at all", () => {
    const bare: StudentCase = {
      ...germanCase,
      profile: { ...germanCase.profile, recognition: null },
    };
    const gates = germanGates(bare);

    expect(gates).toHaveLength(1);
    expect(gates[0].state).toBe("unchecked");
    expect(gates[0].blocks).toContain("shortlist");
  });

  it("raises the dMAT as a question for the population it applies to", () => {
    const gates = germanGates(unchecked);
    const dmat = gates.find((gate) => gate.id === "dmat");

    // BCom, April 2028 intake: in the subject group and after the transition.
    expect(dmat).toBeDefined();
    expect(dmat!.state).toBe("unchecked");
    expect(dmat!.title).toContain("may apply");
    expect(dmat!.detail).toContain("29 June 2026");
  });

  it("does not raise the dMAT for an intake before it starts", () => {
    const early: StudentCase = { ...unchecked, intake: "October 2026" };
    expect(germanGates(early).find((gate) => gate.id === "dmat")).toBeUndefined();
  });

  it("never states an admission outcome", () => {
    const text = JSON.stringify(germanGates(germanCase)).toLowerCase();
    for (const word of ["probability", "chance", "likely", "predict", "guarantee"]) {
      expect(text).not.toContain(word);
    }
  });
});

describe("onboarding", () => {
  const form = (entries: Record<string, string>) => new Map(Object.entries(entries));

  it("starts with every field unanswered", () => {
    const profile = emptyOnboarding();
    expect(answeredCount(profile).answered).toBe(0);
    expect(toChecklistProfile(profile)).toBeNull();
  });

  it("converts a CGPA to a percentage on the way in, and says which convention", () => {
    const profile = parseOnboarding(
      form({ destination: "germany", scale: "cgpa", result: "8.2" }),
      emptyOnboarding(),
    );
    expect(profile.percentage).toBe(77.9);
  });

  it("takes a percentage as given", () => {
    const profile = parseOnboarding(
      form({ destination: "united-kingdom", scale: "percentage", result: "76" }),
      emptyOnboarding(),
    );
    expect(profile.percentage).toBe(76);
  });

  it("refuses a destination that is not one of the three", () => {
    const profile = parseOnboarding(form({ destination: "canada" }), emptyOnboarding());
    expect(profile.destination).toBeNull();
  });

  it("refuses a route that does not belong to the destination", () => {
    const profile = parseOnboarding(
      form({ destination: "united-kingdom", route: "Public universities" }),
      emptyOnboarding(),
    );
    expect(profile.route).toBeNull();
  });

  it("keeps previous answers when a step is submitted without them", () => {
    const first = parseOnboarding(
      form({ destination: "ireland", degree: "BCom" }),
      emptyOnboarding(),
    );
    const second = parseOnboarding(form({ fundsLakh: "18" }), first);

    expect(second.destination).toBe("ireland");
    expect(second.degree).toBe("BCom");
    expect(second.fundsInr).toBe(1800000);
  });

  it("drops an out of range result rather than storing it", () => {
    const profile = parseOnboarding(
      form({ destination: "ireland", scale: "percentage", result: "180" }),
      emptyOnboarding(),
    );
    expect(profile.percentage).toBeNull();
  });

  it("feeds the checklist, which answers cannot tell for what was left blank", () => {
    const profile = parseOnboarding(
      form({ destination: "united-kingdom", scale: "percentage", result: "76" }),
      emptyOnboarding(),
    );
    const checklist = runChecklist(toChecklistProfile(profile)!);

    expect(checklist.length).toBeGreaterThan(0);
    expect(checklist.find((row) => row.id === "academic")?.state).toBe("met");
    expect(checklist.find((row) => row.id === "english")?.state).toBe("unknown");
  });

  it("derives next steps from what is missing, not from a fixed welcome list", () => {
    const empty = nextSteps(emptyOnboarding());
    expect(empty).toHaveLength(1);
    expect(empty[0].href).toBe("/destinations");

    const german = nextSteps(
      parseOnboarding(form({ destination: "germany" }), emptyOnboarding()),
    );
    expect(german.some((step) => step.title.includes("APS"))).toBe(true);

    const irish = nextSteps(
      parseOnboarding(form({ destination: "ireland" }), emptyOnboarding()),
    );
    expect(irish.some((step) => step.title.includes("APS"))).toBe(false);
  });

  it("always ends on the consultation, and never gates anything behind it", () => {
    const steps = nextSteps(
      parseOnboarding(form({ destination: "germany" }), emptyOnboarding()),
    );
    expect(steps[steps.length - 1].href).toBe("/book-consultation");
    expect(steps[steps.length - 1].body).toContain("Nothing on this account is gated");
  });
});
