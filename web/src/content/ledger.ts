import type { CommissionSource, VerificationStatus } from "./types";

/**
 * One row per university or programme relationship. This is the client facing
 * projection of the record the founder maintains in the operations console.
 *
 * Rules encoded here:
 *  - A row whose status is `unverified` never prints as confirmed.
 *  - A row the university never responded to is excluded from the verified
 *    ledger entirely rather than defaulting to the market estimate.
 *  - A truthful zero needs nobody's permission, so it publishes on sight.
 */
export type LedgerRow = {
  id: string;
  relationship: string;
  destination: string;
  contractType: "Partner" | "None" | "Not established";
  commissionDisplay: string;
  clientFee: string;
  status: VerificationStatus;
  source: CommissionSource;
  /** Reference to the document or email that confirms the figure. */
  evidence: string | null;
  verificationDate: string | null;
  verifiedBy: string | null;
  lastReviewDate: string;
  aboveAverage?: boolean;
  note?: string;
};

export const ledgerRows: LedgerRow[] = [
  {
    id: "de-public",
    relationship: "German public universities",
    destination: "Germany",
    contractType: "None",
    commissionDisplay: "₹0",
    clientFee: "₹45,000 flat advisory fee",
    status: "verified-publishable",
    source: "direct-written-confirmation",
    evidence: "Public university agent policy, stated on institutional admissions pages",
    verificationDate: "2026-09-02",
    verifiedBy: "Founder",
    lastReviewDate: "2026-09-02",
    note: "German public universities do not pay agents, without exception. A true zero needs no one's permission to publish.",
  },
  {
    id: "uk-taught-masters",
    relationship: "UK taught masters, aggregator routed",
    destination: "United Kingdom",
    contractType: "Not established",
    commissionDisplay: "₹1.5L to ₹2.5L",
    clientFee: "₹25,000",
    status: "unverified",
    source: "market-estimate",
    evidence: null,
    verificationDate: null,
    verifiedBy: null,
    lastReviewDate: "2026-09-02",
    note: "A typical market range, not an agreed figure. No aggregator has confirmed a figure to us in writing yet, so it stays off the verified ledger.",
  },
  {
    id: "de-private",
    relationship: "German private universities",
    destination: "Germany",
    contractType: "Not established",
    commissionDisplay: "₹1.3L to ₹3.5L",
    clientFee: "₹25,000",
    status: "unverified",
    source: "market-estimate",
    evidence: null,
    verificationDate: null,
    verifiedBy: null,
    lastReviewDate: "2026-09-02",
    aboveAverage: true,
    note: "Above the category average. If a private university makes your shortlist, this flag is in the written shortlist before we recommend it.",
  },
  {
    id: "ie-taught-masters",
    relationship: "Irish taught masters, aggregator routed",
    destination: "Ireland",
    contractType: "Not established",
    commissionDisplay: "₹90k to ₹1.6L",
    clientFee: "₹25,000",
    status: "unverified",
    source: "market-estimate",
    evidence: null,
    verificationDate: null,
    verifiedBy: null,
    lastReviewDate: "2026-09-02",
    note: "A typical market range, not an agreed figure. We have not yet asked for written confirmation.",
  },
];

/** How each university response maps to what a reader is shown. */
export const disclosureFallbacks = [
  {
    response: "Confirms it pays zero commission",
    shown: "The confirmed zero, always. A true zero needs no one's permission to publish.",
  },
  {
    response: "Confirms a figure and permits publication",
    shown: "The exact figure, with the date it was checked and who confirmed it.",
  },
  {
    response: "Confirms a figure, permits a range only",
    shown: "A range, with a note that the university asked us to keep the exact figure private.",
  },
  {
    response: "Confirms a figure, refuses any disclosure",
    shown:
      "That we receive a commission from this university, and that it has not allowed us to publish the amount. We always say the arrangement exists.",
  },
  {
    response: "Does not respond",
    shown:
      "Nothing on the verified ledger. The row stays marked unverified, and the market estimate is never shown as if it were confirmed.",
  },
];

export const ledgerMethodology = {
  cadence:
    "Every row is re-verified and republished each quarter, even if the figure has not changed. An out of date check is treated as worse than no date.",
  flaggingRule:
    "If a university pays us more than double the category average for its tier, the shortlist says so in writing before we recommend it. That does not rule the university out; it just makes our incentive clear.",
  blocker:
    "Apart from rows marked verified, every figure below is a typical market estimate today, not an agreed contract figure. We can publish a real number only once each aggregator and university allows it in writing, which most partner agreements do not by default, and none has yet.",
  schemaFields: [
    "University or programme",
    "Commission figure or band",
    "Source",
    "Evidence reference",
    "Verification date",
    "Verified by",
    "Status",
    "Last review date",
    "Change history",
  ],
};
