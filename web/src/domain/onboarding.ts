import { guides } from "@/content/guides";
import { routesFor } from "@/content/requirements";
import type { Profile } from "./eligibility";
import { round } from "./calculators";

/**
 * What a new account knows about itself before a case exists.
 *
 * A signup used to land on an empty panel saying no case record, which is
 * accurate and useless. This is the other half: enough of a profile, captured
 * in three short steps, for the portal to say something true and specific on
 * the day someone signs up, without a counsellor having touched it.
 *
 * Every field is nullable and null means unanswered. The requirements checklist
 * this feeds already treats an absent value as "needs checking" rather than as
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
    blurb: "Country first. It changes every other answer, so we ask nothing personal before it.",
  },
  {
    id: "you",
    title: "Your record",
    blurb: "Only what we need to check you against published requirements.",
  },
  {
    id: "money",
    title: "Money",
    blurb: "A rough figure is fine. This answer decides which routes are realistic for you.",
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
      body: "Each guide has sixteen sections, with a source for every figure.",
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
      body: "Without it we cannot check you against any published academic requirement, so every academic row on your checklist says needs checking.",
    });
  }

  if (profile.englishTest === null) {
    steps.push({
      title: "Book the language test, if you have not sat one",
      body: "It takes longer to arrange than anything else in the plan. Work out the band you need before you book.",
      href: "/tools/ielts-band-calculator",
      hrefLabel: "IELTS band calculator",
    });
  }

  if (profile.destination === "germany") {
    steps.push({
      title: "Start APS, and look your institution up on anabin",
      body: "APS is mandatory for every Indian applicant and takes weeks; without it, neither the university nor the visa application can go ahead. anabin takes minutes and shows whether the rest of the plan can work.",
      href: "/destinations/germany#academic",
      hrefLabel: "What APS and anabin check",
    });
  }

  if (profile.fundsInr === null) {
    steps.push({
      title: "Work out what the year will cost",
      body: `The ${country} funding requirement and the cost of living are two separate published figures. Both are on this site, free to use without signing in, with the working shown.`,
      href: `/tools/cost-of-living?destination=${profile.destination}`,
      hrefLabel: "Cost of living calculator",
    });
  }

  steps.push({
    title: "Book the consultation when you want a person on it",
    body: "A paid 45-minute session and a written assessment within 24 hours, even if the honest answer is not to go at all. Nothing on this account is gated behind it.",
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
        ? round(raw * 9.5, 2)
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
