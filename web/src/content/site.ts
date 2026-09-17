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
      { label: "All three, compared", href: "/destinations", note: "Seventeen sections each" },
    ],
  },
  {
    label: "Courses",
    children: [
      {
        label: "Search the catalogue",
        href: "/universities",
        note: "Every row shows what we earn on it",
      },
      { label: "Masters in Germany", href: "/masters-in-germany", note: "Mostly no tuition" },
      { label: "Masters in the UK", href: "/masters-in-uk", note: "The catalogue, one destination" },
      { label: "Masters in Ireland", href: "/masters-in-ireland", note: "The catalogue, one destination" },
      { label: "Rankings", href: "/universities/rankings", note: "As published, never averaged" },
      { label: "Scholarships", href: "/scholarships", note: "Funder, coverage, deadline cycle" },
      {
        label: "Your shortlist",
        href: "/shortlist",
        note: "Saved courses, compared side by side",
      },
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
  {
    label: "What we publish",
    children: [
      { label: "Open Ledger", href: "/open-ledger", note: "What we earn, per route" },
      {
        label: "Our numbers, one source",
        href: "/our-numbers",
        note: "Every figure, its source, its date",
      },
      { label: "Written guides", href: "/guides", note: "Six pieces, four filter axes" },
      { label: "Services and what we earn", href: "/services", note: "Including where it is nothing" },
    ],
  },
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

/**
 * The channels a student can actually reach us on.
 *
 * WhatsApp is the channel this market runs on and we do not have a number yet,
 * because a business number belongs to a registered entity. Rather than
 * printing a personal number or, worse, a plausible looking one, the sticky
 * contact control reads this: a null number renders the honest state and the
 * consultation route, and the day a number exists it renders the button. The
 * environment variable exists so that change is a deployment rather than a
 * code change.
 */
export const channels = {
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? null,
  whatsappMessage:
    "Hello, I found Next Scholar online and I have a question about studying abroad.",
  pending:
    "A WhatsApp line goes live with the registered entity. Until then the consultation form is the only channel that reaches us, and it is read by a person rather than a queue.",
} as const;

export const contact = {
  status: "partial" as const,
  note: "The consultation booking form is the only channel that reaches us today. A published email, phone line and grievance contact go live with the registered entity.",
};

export const lastReviewed = "2026-09-02";
