import { guides } from "@/content/guides";
import { routesFor } from "@/content/requirements";
import type { Profile } from "./eligibility";

/**
 * What a new account knows about itself before a case exists.
 *
 * A signup used to land on an empty panel saying no case record, which is
 * accurate and useless. This is the other half: enough of a profile, captured
 * in three short steps, for the portal to say something true and specific on
 * the day someone signs up, without a counsellor having touched it.
 *
 * Every field is nullable and null means unanswered. The requirements checklist
 * this feeds already treats an absent value as "cannot tell" rather than as
 * zero, so a half-finished profile degrades into honest uncertainty instead of
 * a wrong answer.
 */
export type OnboardingProfile = {
  destination: string | null;
  route: string | null;
  applyingFor: "bachelors" | "masters" | null;
  intake: string | null;
  degree: string | null;
  degreeYears: 3 | 4 | null;
  /** Normalised percentage. A CGPA is converted before it lands here. */
  percentage: number | null;
  englishTest: { name: string; overall: number; lowestSection: number | null } | null;
  /** Total the student believes they can evidence, in rupees. */
  fundsInr: number | null;
  fundsHeldMonths: number | null;
  updatedAt: string;
};

export const emptyOnboarding = (): OnboardingProfile => ({
  destination: null,
  route: null,
  applyingFor: null,
  intake: null,
  degree: null,
  degreeYears: null,
  percentage: null,
  englishTest: null,
  fundsInr: null,
  fundsHeldMonths: null,
  updatedAt: new Date().toISOString(),
});

export const onboardingSteps = [
  {
    id: "where",
    title: "Where",
    blurb: "Country first. It changes every other answer, so nothing personal is asked before it.",
  },
  {
    id: "you",
    title: "Your record",
    blurb: "Enough to check you against a published requirement, and nothing beyond that.",
  },
  {
    id: "money",
    title: "Money",
    blurb: "A range is fine. This is the question that decides which routes are real.",
  },
] as const;

/** The fields each step covers, so progress is counted rather than guessed. */
const stepFields: Record<string, (keyof OnboardingProfile)[]> = {
  where: ["destination", "applyingFor", "intake"],
  you: ["degree", "percentage", "degreeYears", "englishTest"],
  money: ["fundsInr", "fundsHeldMonths"],
};

export function stepComplete(profile: OnboardingProfile, stepId: string): boolean {
  return (stepFields[stepId] ?? []).every((field) => profile[field] !== null);
}

export function answeredCount(profile: OnboardingProfile): { answered: number; total: number } {
  const fields = Object.values(stepFields).flat();
  return {
    answered: fields.filter((field) => profile[field] !== null).length,
    total: fields.length,
  };
}

/** Maps the captured profile onto the shape the requirements checklist reads. */
export function toChecklistProfile(profile: OnboardingProfile): Profile | null {
  if (!profile.destination) return null;
  return {
    destination: profile.destination,
    applyingFor: profile.applyingFor ?? undefined,
    degreeDurationYears: profile.degreeYears ?? undefined,
    percentage: profile.percentage ?? undefined,
    englishTest: profile.englishTest
      ? {
          name: profile.englishTest.name,
          overall: profile.englishTest.overall,
          lowestSection: profile.englishTest.lowestSection ?? undefined,
        }
      : undefined,
    fundsInr: profile.fundsInr ?? undefined,
    fundsHeldMonths: profile.fundsHeldMonths ?? undefined,
  };
}

export type NextStep = {
  title: string;
  body: string;
  href?: string;
  hrefLabel?: string;
};

/**
 * What to do next, derived from what is actually missing.
 *
 * Deliberately not a generic welcome list. Every entry here is triggered by a
 * gap in this specific profile, and a completed profile produces the last entry
 * only, which is the honest one: the next thing is a conversation with a person
 * and we charge for it.
 */
export function nextSteps(profile: OnboardingProfile): NextStep[] {
  const steps: NextStep[] = [];

  if (!profile.destination) {
    steps.push({
      title: "Pick a destination, or read the three guides first",
      body: "Each guide runs to sixteen sections with every figure sourced. Reading one is a better use of an hour than any form on any consultancy site.",
      href: "/destinations",
      hrefLabel: "Read the guides",
    });
    return steps;
  }

  const guide = guides.find((item) => item.slug === profile.destination);
  const country = guide?.country ?? profile.destination;

  if (profile.percentage === null) {
    steps.push({
      title: "Add your result",
      body: "Without it we cannot check you against a single published academic threshold, and every academic row on your checklist says we cannot tell.",
    });
  }

  if (profile.englishTest === null) {
    steps.push({
      title: "Book the language test, if you have not sat one",
      body: "It is the longest lead time in the whole plan and nothing else waits for it politely. Work out what band you need before you book.",
      href: "/tools/ielts-band-calculator",
      hrefLabel: "IELTS band calculator",
    });
  }

  if (profile.destination === "germany") {
    steps.push({
      title: "Start APS, and look your institution up on anabin",
      body: "APS takes weeks, it is mandatory for every Indian applicant, and both the university application and the visa application stop without it. anabin takes minutes and decides whether the rest of the plan is real.",
      href: "/destinations/germany#academic",
      hrefLabel: "What APS and anabin actually check",
    });
  }

  if (profile.fundsInr === null) {
    steps.push({
      title: "Work out what the year costs before anyone quotes you a fee",
      body: `The ${country} funding threshold is a published figure and the cost of living is a separate one. Both are on the site, ungated, with the arithmetic shown.`,
      href: `/tools/cost-of-living?destination=${profile.destination}`,
      hrefLabel: "Cost of living calculator",
    });
  }

  steps.push({
    title: "Book the consultation when you want a person on it",
    body: "Forty five paid minutes and a written assessment within 24 hours, including the answer nobody sells, which is that you should not go at all. Nothing on this account is gated behind it.",
    href: "/book-consultation",
    hrefLabel: "Book a consultation",
  });

  return steps;
}

/** Parses a submitted form into a profile, ignoring anything unparseable. */
export function parseOnboarding(
  form: Map<string, string>,
  previous: OnboardingProfile,
): OnboardingProfile {
  const text = (key: string): string | null => {
    const value = form.get(key)?.trim();
    return value ? value : null;
  };
  const number = (key: string): number | null => {
    const value = text(key);
    if (value === null) return null;
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  };

  const destination = text("destination");
  const validDestination =
    destination && guides.some((guide) => guide.slug === destination)
      ? destination
      : previous.destination;

  const route = text("route");
  const country = guides.find((guide) => guide.slug === validDestination)?.country;
  const validRoute =
    route && country && routesFor(country).includes(route) ? route : null;

  const scale = text("scale");
  const raw = number("result");
  const percentage =
    raw === null
      ? previous.percentage
      : scale === "cgpa"
        ? Math.round(raw * 9.5 * 100) / 100
        : raw;

  const applyingFor = text("applyingFor");
  const years = number("degreeYears");
  const testName = text("testName");
  const overall = number("overall");
  const lowest = number("lowestSection");
  const lakh = number("fundsLakh");

  return {
    destination: validDestination,
    route: validRoute,
    applyingFor:
      applyingFor === "bachelors" || applyingFor === "masters"
        ? applyingFor
        : previous.applyingFor,
    intake: text("intake") ?? previous.intake,
    degree: text("degree") ?? previous.degree,
    degreeYears: years === 3 || years === 4 ? years : previous.degreeYears,
    percentage:
      percentage !== null && percentage >= 0 && percentage <= 100
        ? percentage
        : previous.percentage,
    englishTest:
      testName && overall !== null && overall >= 0
        ? { name: testName, overall, lowestSection: lowest }
        : previous.englishTest,
    fundsInr: lakh !== null && lakh >= 0 ? Math.round(lakh * 100000) : previous.fundsInr,
    fundsHeldMonths: number("fundsHeldMonths") ?? previous.fundsHeldMonths,
    updatedAt: new Date().toISOString(),
  };
}
