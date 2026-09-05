import { destinations, type DestinationRow } from "@/content/destinations";
import { requirementsFor } from "@/content/requirements";
import { STATUS_LABEL, isPublishable } from "@/content/types";
import { universitiesIn, type University } from "@/content/catalogue";
import { rateFor, toInr } from "@/content/guides";
import type { LanguageTestResult, StudentCase } from "./case";
import { assessRisk } from "./risk";

/**
 * Matching is deterministic. It reads verified destination data, states a
 * reason per entry, and carries the commission status on every recommendation.
 *
 * Two rules do the work. A destination with nothing in the profile to justify
 * it is excluded with the exclusion stated, because a recommendation without a
 * reason is not a recommendation. And anything the engine does not actually
 * know is listed as an assumption rather than folded silently into the ranking.
 *
 * It ranks destinations and routes at the top level, then lists the
 * institutions the catalogue has curated for that destination and route,
 * alphabetically rather than by an invented fit score. Each one carries only
 * facts already on file: its commission band, its lowest published fee read
 * against the stated budget, and its stated postgraduate language requirement
 * read against whatever test result the case has. None of that is a rank.
 */

export type UniversityMatch = {
  slug: string;
  name: string;
  city: string;
  commission: { display: string; statusLabel: string; verified: boolean; flag?: string };
  tuitionNote: string;
  languageNote: string | null;
};

export type MatchProposal = {
  destination: string;
  route?: string;
  reasons: string[];
  commission: { display: string; statusLabel: string; verified: boolean; flag?: string };
  clientFee: string;
  assumptions: string[];
  universities: UniversityMatch[];
};

/** "germany-public" and "germany-private" both draw from the one German pool. */
const catalogueDestinationKey: Record<string, string> = {
  "united-kingdom": "united-kingdom",
  "germany-public": "germany",
  "germany-private": "germany",
  ireland: "ireland",
};

function lowestFee(university: University): { amount: number; currency: "GBP" | "EUR" } | null {
  let lowest: { amount: number; currency: "GBP" | "EUR" } | null = null;
  for (const programme of university.programmes) {
    if (programme.feePerYear.state !== "stated") continue;
    if (lowest === null || programme.feePerYear.value < lowest.amount) {
      lowest = { amount: programme.feePerYear.value, currency: programme.currency };
    }
  }
  return lowest;
}

function tuitionNoteFor(university: University, budgetInr: number | null): string {
  const fee = lowestFee(university);
  if (!fee) {
    return "No programme at this institution has a published fee yet. Check the course page directly.";
  }
  const converted = toInr(fee.amount, fee.currency);
  if (budgetInr === null) {
    return `Lowest published annual tuition here is ${converted}, at today's reference rate.`;
  }
  const inrFee = fee.amount * rateFor(fee.currency).inrPerUnit;
  return budgetInr >= inrFee
    ? `Lowest published annual tuition here is ${converted}, inside the stated budget.`
    : `Lowest published annual tuition here is ${converted}, above the stated budget on its own.`;
}

function languageNoteFor(university: University, profile: MatchProfile): string | null {
  for (const exam of university.exams) {
    if (exam.postgraduate.state !== "stated") continue;
    const stated = `This institution states a postgraduate ${exam.exam} requirement of ${exam.postgraduate.value}.`;
    const english = (profile.languageTests ?? []).find((test) => test.language === "english");
    return english
      ? `${stated} An ${english.name} result of ${english.score} is already on file.`
      : `${stated} No English test result is on file to read against it.`;
  }
  return null;
}

function universityMatchesFor(
  destination: DestinationRow,
  profile: MatchProfile,
): UniversityMatch[] {
  const key = catalogueDestinationKey[destination.slug];
  if (!key) return [];
  let pool = universitiesIn(key);
  if (destination.route) {
    pool = pool.filter((university) => university.route === destination.route);
  }
  return pool
    .map((university) => ({
      slug: university.slug,
      name: university.name,
      city: university.city,
      commission: {
        display: university.commission.display,
        statusLabel: STATUS_LABEL[university.commission.status],
        verified: isPublishable(university.commission.status),
        flag: university.commission.aboveAverage ? "Above category average" : undefined,
      },
      tuitionNote: tuitionNoteFor(university, profile.budgetInr),
      languageNote: languageNoteFor(university, profile),
    }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

export type MatchProfile = {
  budgetInr: number | null;
  percentage?: number | null;
  languageTests?: LanguageTestResult[];
  intakePreference?: string;
  wantsLowTuition?: boolean;
  /** Risk factors already found on the case, carried into the shortlist. */
  riskNotes?: string[];
};

/** The lowest year one budget each route can realistically be planned against. */
const budgetFloorInr: Record<string, number> = {
  "united-kingdom": 2_500_000,
  "germany-public": 1_400_000,
  "germany-private": 2_200_000,
  ireland: 2_000_000,
};

export function proposeShortlist(profile: MatchProfile): {
  proposals: MatchProposal[];
  excluded: { destination: string; why: string }[];
} {
  const proposals: MatchProposal[] = [];
  const excluded: { destination: string; why: string }[] = [];

  for (const destination of destinations) {
    const reasons: string[] = [];
    const assumptions: string[] = [];
    const label = `${destination.country}${destination.route ? `, ${destination.route}` : ""}`;
    const floor = budgetFloorInr[destination.slug];

    if (profile.budgetInr === null) {
      assumptions.push(
        "No year one budget is on file, so affordability has not been considered at all.",
      );
    } else if (profile.budgetInr < floor) {
      excluded.push({
        destination: label,
        why: `The stated budget does not cover a realistic year one here. Recommending it anyway would be selling an application that cannot be funded.`,
      });
      continue;
    } else {
      reasons.push(
        destination.slug === "germany-public"
          ? "No tuition fee, so the budget covers living costs and the blocked account rather than fees."
          : "The stated budget covers the tuition band for this route.",
      );
    }

    if (destination.slug === "germany-public" && profile.wantsLowTuition) {
      reasons.push("Matches the stated preference for the lowest total cost.");
    }

    if (typeof profile.percentage === "number") {
      if (profile.percentage >= 70) {
        reasons.push(
          `An academic record of ${profile.percentage}% sits inside the usual range for taught masters entry here.`,
        );
      } else {
        assumptions.push(
          `An academic record of ${profile.percentage}% is below the range most programmes on this route publish. Individual programme requirements have not been checked, so this is a flag rather than a verdict.`,
        );
      }
    } else {
      assumptions.push("No academic percentage on file, so entry fit has not been assessed.");
    }

    const requirements = requirementsFor(destination.country, destination.route);
    if (requirements?.documents.includes("english-test")) {
      const english = (profile.languageTests ?? []).find(
        (test) => test.language === "english",
      );
      if (english) {
        reasons.push(
          `An ${english.name} result of ${english.score} is already on file.`,
        );
      } else {
        assumptions.push(
          "No English test result on file. Every programme on this route requires one, and booking it is the long pole.",
        );
      }
    }

    if (
      profile.intakePreference &&
      destination.intakes.toLowerCase().includes(profile.intakePreference.toLowerCase())
    ) {
      reasons.push(`Runs a ${profile.intakePreference} intake.`);
    }

    if (destination.postStudyNote) {
      assumptions.push(`Post study window still needs re-checking at source. ${destination.postStudyNote}`);
    }
    if (!isPublishable(destination.commission.status)) {
      assumptions.push(
        "The commission figure is a market estimate, not a confirmed contract term. It is shown for that reason, not hidden.",
      );
    }
    for (const note of profile.riskNotes ?? []) {
      assumptions.push(`Carried from the case: ${note}`);
    }

    if (reasons.length === 0) {
      excluded.push({
        destination: label,
        why: "Nothing in the profile supports recommending this route, and a recommendation without a reason is not one.",
      });
      continue;
    }

    proposals.push({
      destination: destination.country,
      route: destination.route,
      reasons,
      commission: {
        display: destination.commission.display,
        statusLabel: STATUS_LABEL[destination.commission.status],
        verified: isPublishable(destination.commission.status),
        flag: destination.commission.aboveAverage ? "Above category average" : undefined,
      },
      clientFee: destination.clientFee,
      assumptions,
      universities: universityMatchesFor(destination, profile),
    });
  }

  return { proposals, excluded };
}

/** Builds the profile from a case, so the shortlist uses everything on file. */
export function profileFromCase(record: StudentCase): MatchProfile {
  return {
    budgetInr: record.budgetInr,
    percentage: record.profile.percentage,
    languageTests: record.profile.languageTests,
    intakePreference: record.intake.split(" ")[0],
    riskNotes: assessRisk(record).indicators.map((indicator) => indicator.factor),
  };
}
