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

export const stages: Stage[] = [
  {
    key: "consultation",
    name: "Consultation",
    summary:
      "Forty five paid minutes, built around six questions. Sometimes the honest answer is not to go at all.",
    deliverable: "A written assessment within 24 hours, ranking two or three destinations, with the risks of each.",
  },
  {
    key: "shortlist",
    name: "Shortlist",
    summary:
      "Eight to ten universities, split into ambitious, target and safe choices.",
    deliverable: "A written shortlist with our commission on each university, and any above average figure flagged.",
  },
  {
    key: "agreement",
    name: "Agreement",
    summary: "What we will do, the fee and the timeline, all in writing. Nothing is agreed only by word of mouth.",
    deliverable: "A signed service agreement.",
  },
  {
    key: "documents",
    name: "Documents",
    summary:
      "Checked against the originals, or with whoever issued them. We never create, edit or retouch a document.",
    deliverable: "A document checklist, with each file marked uploaded, in review, verified or issue found.",
  },
  {
    key: "applications",
    name: "Applications",
    summary: "We submit and track each application. You keep every reference number and portal login we use for you.",
    deliverable: "A record of each application, with reference numbers and university portal logins.",
  },
  {
    key: "offers",
    name: "Offers",
    summary:
      "Compared side by side, including any we would advise you to turn down, and why.",
    deliverable: "A comparison of your offers, with our advice on each.",
  },
  {
    key: "finance",
    name: "Finance",
    summary: "Planning your education loan, blocked account, currency exchange and TCS (tax collected at source) against your real first year budget.",
    deliverable: "A funding plan matched to your deposit and visa deadlines.",
  },
  {
    key: "visa",
    name: "Visa",
    summary: "We prepare your visa file and practise the interview, based on the most common reasons for refusal right now.",
    deliverable: "A ready visa file and a practised interview.",
  },
  {
    key: "pre-departure",
    name: "Pre departure",
    summary: "Housing, insurance, flights, banking and an arrival briefing for your city.",
    deliverable: "A pre departure checklist, completed before you fly.",
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
      "Your result goes into our quarterly report without your name, whether it was an approval or a refusal.",
    deliverable: "An entry in the public quarterly outcomes report.",
  },
];
