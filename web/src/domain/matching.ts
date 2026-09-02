import { destinations } from "@/content/destinations";
import { STATUS_LABEL, isPublishable } from "@/content/types";

/**
 * Matching is deterministic. It reads verified destination data, states a
 * reason per entry, and carries the commission status on every recommendation.
 * A destination without enough verified data is excluded with the reason shown,
 * rather than being ranked on a guess.
 */
export type MatchProposal = {
  destination: string;
  route?: string;
  reasons: string[];
  commission: { display: string; statusLabel: string; verified: boolean; flag?: string };
  clientFee: string;
  assumptions: string[];
};

export function proposeShortlist(profile: {
  budgetInr: number;
  intakePreference?: string;
  wantsLowTuition?: boolean;
}): { proposals: MatchProposal[]; excluded: { destination: string; why: string }[] } {
  const proposals: MatchProposal[] = [];
  const excluded: { destination: string; why: string }[] = [];

  for (const destination of destinations) {
    const reasons: string[] = [];
    const assumptions: string[] = [];

    if (destination.slug === "germany-public") {
      reasons.push("No tuition fee, so the year one budget covers living costs and the blocked account.");
      if (profile.wantsLowTuition) reasons.push("Matches your stated preference for the lowest total cost.");
    }

    if (destination.slug === "united-kingdom" && profile.budgetInr >= 2_500_000) {
      reasons.push("Your stated budget covers the tuition band for taught masters here.");
    }

    if (destination.slug === "ireland" && profile.budgetInr >= 2_000_000) {
      reasons.push("Tuition sits below the UK band and the post study window is longer.");
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

    if (reasons.length === 0) {
      excluded.push({
        destination: `${destination.country}${destination.route ? `, ${destination.route}` : ""}`,
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
    });
  }

  return { proposals, excluded };
}
