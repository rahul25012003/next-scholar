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
    note: "German public universities do not pay agents, without exception. Publishing a truthful zero needs no permission from anyone.",
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
    note: "A market typical band, not a contract term. No aggregator has confirmed a figure to us in writing yet, so this band stays off the verified ledger.",
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
    note: "Runs above the category average. If a private university reaches your shortlist, this flag is in the written shortlist before the recommendation, not after it.",
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
    note: "A market typical band, not a contract term. Outreach for written confirmation has not been sent yet.",
  },
];

/** How each university response maps to what a reader is shown. */
export const disclosureFallbacks = [
  {
    response: "Confirms it pays zero commission",
    shown: "The verified zero, always. Publishing a truthful zero needs nobody's permission.",
  },
  {
    response: "Confirms a figure and permits publication",
    shown: "The exact figure, with the verification date and who confirmed it.",
  },
  {
    response: "Confirms a figure, permits a range only",
    shown: "A published band, plus a note that the exact figure is confidential at the university's request.",
  },
  {
    response: "Confirms a figure, refuses any disclosure",
    shown:
      "That Next Scholar receives a commission from this university and that the university has not authorised publishing an amount. The existence of the relationship is still disclosed. Silence about existence is the one thing this business cannot do.",
  },
  {
    response: "Does not respond",
    shown:
      "Nothing on the verified ledger. The row stays unverified on the client facing side and never defaults to showing the market estimate as if it were confirmed.",
  },
];

export const ledgerMethodology = {
  cadence:
    "Every row is re-verified and republished each quarter, whether or not the figure changed. A stale verification date is treated as worse than no date.",
  flaggingRule:
    "If a university's commission runs more than double the category average for its tier, that is disclosed in writing on the shortlist before the recommendation, not after. It does not rule the university out. It removes any doubt about the incentive.",
  blocker:
    "Every figure below is a market typical estimate today, not a confirmed contract term. Before any real number is published here, each aggregator and university has to confirm in writing that public disclosure is permitted. Most partner agreements restrict this by default. That written permission is the gate on this page, and it has not been cleared yet.",
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
