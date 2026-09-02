/**
 * The page that costs us money on purpose. Some readers self apply after
 * reading it and are never invoiced, which is the proof that the shortlist is
 * not commission driven.
 */

export type ZeroCommissionEntry = {
  destination: string;
  flagCode: string;
  state: "verified" | "needs-verify";
  headline: string;
  body: string;
  ourFee?: string;
};

export const zeroCommissionEntries: ZeroCommissionEntry[] = [
  {
    destination: "Germany",
    flagCode: "de",
    state: "verified",
    headline: "Public universities pay agents nothing, without exception",
    body: "Tuition is a semester contribution rather than a fee. No agent, ours included, earns a commission for placing you at a German public university. You can apply to every one of them yourself, for free.",
    ourFee:
      "If you want help with the process bottlenecks, APS, uni-assist, the blocked account, the visa file, we charge a flat ₹45,000 advisory fee. A flat fee is the only honest shape for a route where no university pays us.",
  },
  {
    destination: "United Kingdom",
    flagCode: "gb",
    state: "needs-verify",
    headline: "The verified list is not ready to publish",
    body: "Some UK institutions recruit without agents. Naming them here without confirming each one first would be exactly the guesswork this page exists to replace, so the list stays empty until every entry is checked at source.",
  },
  {
    destination: "Ireland",
    flagCode: "ie",
    state: "needs-verify",
    headline: "The verified list is not ready to publish",
    body: "Same position as the UK. The list publishes when each institution has been confirmed individually, not before.",
  },
];

export const selfApplySteps = [
  {
    title: "Go to the university's own admissions page",
    body: "Not an aggregator portal, not a comparison site. The institution's own page is the only one obliged to be current.",
  },
  {
    title: "Check the requirements for your specific programme",
    body: "Entry requirements and deadlines are set per programme, not per university. The generic page will mislead you.",
  },
  {
    title: "Prepare your documents yourself",
    body: "Transcripts, test scores, funding evidence, letters. Every one of them has to be genuinely yours.",
  },
  {
    title: "Submit directly",
    body: "You keep the login, the reference number and the correspondence.",
  },
  {
    title: "Come to us only for a specific bottleneck",
    body: "A visa file, a blocked account, an APS certificate. The flat fee model means there is no commission pulling the advice in any direction.",
  },
];

export const zeroCommissionRationale =
  "This page can cost us revenue. Some people will read it, apply on their own and never become clients. That is the point. A shortlist you cannot audit is worth nothing, and the cheapest way to prove ours is not commission driven is to publish the routes where we earn nothing at all.";
