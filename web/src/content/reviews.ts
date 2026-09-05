/**
 * Reviews, ledger-grade verified.
 *
 * The same discipline the Open Ledger applies to a commission figure applies
 * here: a review is either verified by a named staff member against the
 * actual case record, or it does not render. There is no draft state that
 * shows up half-trusted, and there is no rating number, because a star count
 * is exactly the kind of computed-looking figure this platform refuses to
 * invent. What is shown is the outcome, in the reviewer's own words.
 *
 * This list is empty because no client has completed a real outcome yet.
 * `publishableReviews` is the only way anything here reaches a page, and it
 * refuses anything without a named verifier.
 */

export type ReviewOutcome = "visa-approved" | "enrolled" | "visa-refused";

export const outcomeLabel: Record<ReviewOutcome, string> = {
  "visa-approved": "Visa approved",
  enrolled: "Enrolled",
  "visa-refused": "Visa refused",
};

export type Review = {
  id: string;
  /** First name and last initial. A student's full name is never published without asking each time. */
  studentName: string;
  destination: string;
  route?: string;
  outcome: ReviewOutcome;
  quote: string;
  intake: string;
  /** Null until a named staff member has checked this against the actual case record. */
  verifiedBy: string | null;
  verifiedOn: string | null;
};

export const reviews: Review[] = [];

/** The only path from `reviews` to a page. A review with no verifier cannot pass through it. */
export function publishableReviews(list: Review[] = reviews): Review[] {
  return list.filter((review): review is Review & { verifiedBy: string } =>
    review.verifiedBy !== null,
  );
}

export const reviewsScope = {
  note: "Every review here is checked by a named member of staff against the actual case record before it is published: the destination, the route, and the outcome, refusals included. Nothing is invented to fill this page while it is empty, and there is no rating number anywhere, because a star count would be a figure we computed rather than one the reviewer gave.",
};
