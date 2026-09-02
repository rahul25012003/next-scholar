/**
 * The eleven stages a client moves through. The same list drives the marketing
 * page, the student portal progress view and the counselor console, so a stage
 * cannot be described one way in public and tracked another way internally.
 */
export type Stage = {
  key: string;
  name: string;
  summary: string;
  /** What the client actually receives at this stage. */
  deliverable: string;
};

/** Plain groupings, so eleven stages read as three moments instead of a list. */
export const stageGroups: { title: string; blurb: string; keys: string[] }[] = [
  {
    title: "Before you commit",
    blurb: "Everything here happens before you have paid a service fee.",
    keys: ["consultation", "shortlist", "agreement"],
  },
  {
    title: "While applying",
    blurb: "You hold every credential and reference number we use on your behalf.",
    keys: ["documents", "applications", "offers"],
  },
  {
    title: "After the offer",
    blurb: "The part most agencies stop at the airport. We do not.",
    keys: ["finance", "visa", "pre-departure", "arrival", "outcome"],
  },
];

export const stages: Stage[] = [
  {
    key: "consultation",
    name: "Consultation",
    summary:
      "Forty five paid minutes, structured around six questions. It includes the answer nobody sells, which is that you should not go at all.",
    deliverable: "Written assessment within 24 hours, with two or three ranked destinations and the risks for each.",
  },
  {
    key: "shortlist",
    name: "Shortlist",
    summary:
      "Eight to ten universities across ambitious, target and safe. The commission we earn is printed next to each one.",
    deliverable: "Shortlist document with commission figures and any above average flags stated up front.",
  },
  {
    key: "agreement",
    name: "Agreement",
    summary: "Scope, fee and timeline in writing. Nothing about the engagement is verbal.",
    deliverable: "Signed service agreement.",
  },
  {
    key: "documents",
    name: "Documents",
    summary:
      "Verified against originals or with the issuing institution. Never created, never edited, never retouched.",
    deliverable: "Document checklist with each file marked uploaded, in review, verified or issue found.",
  },
  {
    key: "applications",
    name: "Applications",
    summary: "Submitted and tracked. You hold every reference number and portal login we use on your behalf.",
    deliverable: "Application record with reference numbers and university portal credentials.",
  },
  {
    key: "offers",
    name: "Offers",
    summary:
      "Compared side by side, including the ones we would advise you to decline and the reasons why.",
    deliverable: "Offer comparison with a stated recommendation for each.",
  },
  {
    key: "finance",
    name: "Finance",
    summary: "Education loan, blocked account, forex and TCS planning against your actual year one budget.",
    deliverable: "Funding plan mapped to deposit and visa deadlines.",
  },
  {
    key: "visa",
    name: "Visa",
    summary: "File preparation and interview rehearsal against the refusal patterns currently in circulation.",
    deliverable: "Prepared visa file and a rehearsed interview.",
  },
  {
    key: "pre-departure",
    name: "Pre departure",
    summary: "Accommodation, insurance, flights, banking and an arrival briefing for your specific city.",
    deliverable: "Pre departure checklist, completed before you fly.",
  },
  {
    key: "arrival",
    name: "Arrival",
    summary: "Check ins at thirty, ninety and one hundred eighty days, because the first semester is where things go wrong.",
    deliverable: "Three scheduled check ins after you land.",
  },
  {
    key: "outcome",
    name: "Outcome published",
    summary:
      "Your result enters the quarterly report, anonymised, whether it was an approval or a refusal.",
    deliverable: "An entry in the public quarterly outcomes report.",
  },
];
