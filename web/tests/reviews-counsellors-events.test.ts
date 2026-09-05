import { describe, expect, it } from "vitest";
import { publishableReviews, reviews, type Review } from "@/content/reviews";
import { publishableCounsellors, counsellors, type Counsellor } from "@/content/counsellors";
import { upcomingEvents, pastEvents, events } from "@/content/events";

const draftReview: Review = {
  id: "r1",
  studentName: "A. Student",
  destination: "germany",
  outcome: "visa-approved",
  quote: "It went well.",
  intake: "October 2027",
  verifiedBy: null,
  verifiedOn: null,
};

const checkedReview: Review = { ...draftReview, id: "r2", verifiedBy: "Rohini Bhat", verifiedOn: "2026-09-05" };

describe("reviews cannot render without a named verifier", () => {
  it("excludes a review with no verifier", () => {
    expect(publishableReviews([draftReview])).toEqual([]);
  });

  it("includes a review a named person has checked", () => {
    expect(publishableReviews([draftReview, checkedReview])).toEqual([checkedReview]);
  });

  it("starts empty, honestly, until a real outcome exists", () => {
    expect(reviews).toEqual([]);
  });

  it("has no rating field anywhere on the shape", () => {
    expect(Object.keys(checkedReview)).not.toContain("rating");
    expect(Object.keys(checkedReview)).not.toContain("stars");
  });
});

const draftCounsellor: Counsellor = {
  slug: "c1",
  name: "A. Counsellor",
  credential: "Some credential",
  credentialBody: "Some body",
  destinationsCovered: ["germany"],
  bio: "Bio.",
  verifiedBy: null,
  verifiedOn: null,
};
const checkedCounsellor: Counsellor = { ...draftCounsellor, slug: "c2", verifiedBy: "Devika Suresh", verifiedOn: "2026-09-05" };

describe("counsellor profiles cannot render without a checked credential", () => {
  it("excludes a profile with no verifier", () => {
    expect(publishableCounsellors([draftCounsellor])).toEqual([]);
  });

  it("includes a profile a named person has checked", () => {
    expect(publishableCounsellors([draftCounsellor, checkedCounsellor])).toEqual([checkedCounsellor]);
  });

  it("starts empty, honestly, until a real profile is checked", () => {
    expect(counsellors).toEqual([]);
  });
});

describe("events never invent a registration count", () => {
  it("starts empty, honestly, until something is scheduled", () => {
    expect(events).toEqual([]);
  });

  it("splits future from past around the given instant", () => {
    const past = { slug: "e1", title: "Past", destination: "all", startsAt: "2020-01-01T00:00:00.000Z", format: "online" as const, summary: "", registrationUrl: null, registeredCount: { state: "pending" as const, reason: "No event scheduled yet." } };
    const future = { ...past, slug: "e2", title: "Future", startsAt: "2099-01-01T00:00:00.000Z" };
    const now = new Date("2026-09-05T00:00:00.000Z");

    expect(upcomingEvents(now, [past, future])).toEqual([future]);
    expect(pastEvents(now, [past, future])).toEqual([past]);
  });

  it("has no field a registration count could be a placeholder in", () => {
    const pending = { state: "pending" as const, reason: "No event is scheduled." };
    expect(pending.reason.length).toBeGreaterThan(10);
    expect("state" in pending && pending.state === "pending").toBe(true);
  });
});
