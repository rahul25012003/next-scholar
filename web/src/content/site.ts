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

export const nav: NavItem[] = [
  { label: "How it works", href: "/#process" },
  {
    label: "Destinations",
    children: [
      { label: "United Kingdom", href: "/#destinations", note: "September and January intakes" },
      { label: "Germany", href: "/#destinations", note: "Public and private routes" },
      { label: "Ireland", href: "/#destinations", note: "September and January intakes" },
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
        label: "Anti fraud and data protection",
        href: "/anti-fraud-policy",
        note: "Document integrity and DPDP",
      },
    ],
  },
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
