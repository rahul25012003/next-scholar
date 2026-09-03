export const site = {
  name: "Next Scholar",
  base: "Bengaluru, Karnataka",
  serves: "Clients across India, online",
  pitch: "We publish what we earn on every university we recommend.",
  description:
    "Most consultancies take a commission from the universities they place you at and never tell you the number. Next Scholar publishes it, including the universities that pay us nothing.",
} as const;

/** Primary action, used with this exact label in the nav, hero and footer. */
export const primaryCta = {
  label: "Book a consultation",
  href: "/book-consultation",
} as const;

/** Portal access. Separate intent from the primary action, so a separate label. */
export const secondaryCta = {
  label: "Student login",
  href: "/portal",
} as const;

export type NavChild = { label: string; href: string; note?: string };
export type NavItem = { label: string; href?: string; children?: NavChild[] };

/**
 * The navigation.
 *
 * Four groups, and it is deliberately four rather than seven: the catalogue
 * arriving does not get its own top level item, it goes under Destinations,
 * because a student thinks in countries first and in universities second.
 */
export const nav: NavItem[] = [
  {
    label: "Destinations",
    children: [
      {
        label: "United Kingdom",
        href: "/destinations/united-kingdom",
        note: "Maintenance funds, the 28 day rule, the surcharge",
      },
      {
        label: "Germany",
        href: "/destinations/germany",
        note: "APS, the dMAT, anabin, the blocked account",
      },
      {
        label: "Ireland",
        href: "/destinations/ireland",
        note: "Six months of statements, tuition paid before the visa",
      },
      { label: "All three, compared", href: "/destinations", note: "Sixteen sections each" },
    ],
  },
  {
    label: "Free tools",
    children: [
      {
        label: "Requirements checklist",
        href: "/tools/requirements-check",
        note: "Met, not met, or cannot tell. No score",
      },
      {
        label: "Cost of living calculator",
        href: "/tools/cost-of-living",
        note: "Line by line, editable, sourced",
      },
      {
        label: "German grade calculator",
        href: "/tools/german-grade-calculator",
        note: "Modified Bavarian Formula, working shown",
      },
      {
        label: "ECTS credit check",
        href: "/tools/ects-check",
        note: "How German admission is actually decided",
      },
      {
        label: "IELTS band calculator",
        href: "/tools/ielts-band-calculator",
        note: "Overall band, plus the per-section trap",
      },
      { label: "Grade converters", href: "/tools/grade-converter", note: "Eight of them" },
    ],
  },
  { label: "Open Ledger", href: "/open-ledger" },
  {
    label: "Policies",
    children: [
      {
        label: "Zero commission list",
        href: "/zero-commission",
        note: "Universities that pay us nothing",
      },
      {
        label: "Anti fraud and document integrity",
        href: "/anti-fraud-policy",
        note: "What we will not do to a document",
      },
      { label: "Privacy policy", href: "/privacy", note: "What we collect and why" },
      { label: "Terms of use", href: "/terms", note: "What governs the service" },
      { label: "Refunds and cancellation", href: "/refund-policy", note: "Windows and exclusions" },
      {
        label: "Non affiliation",
        href: "/non-affiliation",
        note: "We are not APS, DAAD, uni-assist or UKVI",
      },
    ],
  },
  { label: "How it works", href: "/#process" },
];

/**
 * Registration details do not exist yet. The prototype this brand replaces
 * carried invented values in the footer, which is exactly the failure the
 * business is built to avoid, so the fields stay named but empty.
 */
export const legalIdentity = {
  status: "pending" as const,
  note: "Next Scholar is not yet incorporated. These fields stay empty until the entity exists, rather than carrying placeholder values.",
  fields: [
    { label: "Registered name", value: null },
    { label: "CIN", value: null },
    { label: "GSTIN", value: null },
    { label: "Registered address", value: null },
    { label: "Grievance officer", value: null },
  ],
};

export const contact = {
  status: "partial" as const,
  note: "The consultation booking form is the only channel that reaches us today. A published email, phone line and grievance contact go live with the registered entity.",
};

export const lastReviewed = "2026-09-02";
