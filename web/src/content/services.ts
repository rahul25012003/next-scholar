/**
 * What we do, what it costs you, and what we earn on it.
 *
 * Every service carries a `remuneration` block and the type has no shape for
 * omitting it. That is the whole point: a consultancy's service list is where
 * referral money hides, and a page that describes a loan introduction without
 * stating who pays for it is the standard practice this business exists to
 * correct.
 *
 * `availability` is equally load-bearing. Several of these are described here
 * and not yet running, and saying so is better than a page that reads as a
 * menu of things you could buy today.
 */

export type Remuneration =
  | { kind: "none"; detail: string }
  | { kind: "client-fee"; price: string; detail: string }
  | {
      kind: "referral";
      /** What the partner pays us, stated as a figure or a band. */
      weEarn: string;
      detail: string;
    };

export type Availability =
  | { state: "live"; detail: string }
  | { state: "with-engagement"; detail: string }
  | { state: "not-yet"; detail: string };

export type Service = {
  slug: string;
  name: string;
  /** One line, in the words a student would use. */
  summary: string;
  /** What you actually get. Deliverables, not adjectives. */
  includes: string[];
  /** What it explicitly is not, where that is the useful half. */
  excludes: string[];
  remuneration: Remuneration;
  availability: Availability;
  group: "Before you commit" | "The engagement" | "Specific help" | "Introductions";
  /** Set only where the service has an actual page to send someone to. */
  cta?: { href: string; label: string };
};

export const services: Service[] = [
  {
    slug: "profile-evaluation",
    name: "Free profile evaluation",
    summary:
      "A written check of where you stand against the published entry requirements, before you pay anyone anything.",
    includes: [
      "Your marks checked against the published minimum for each of the three countries",
      "Your language test score checked against the overall and per-section minimums, which is where most people find they fall short",
      "For Germany, whether you need the dMAT, and whether the transition rule exempts you",
      "A written answer within three working days: what you meet, what you do not, and what we could not tell",
    ],
    excludes: [
      "No university shortlist. That is the paid work, and it takes hours for each person.",
      "No score or chance of admission. We never calculate one.",
      "No sales call. If you are not ready, we say so.",
    ],
    remuneration: {
      kind: "none",
      detail:
        "Free. The requirements checklist on this site answers most of it, and a person reading your transcript answers the rest.",
    },
    availability: {
      state: "not-yet",
      detail:
        "The requirements checklist works today, for free, and uses the same figures. The written answer from a person starts once the request form can reach us; until then, nothing you enter there is sent.",
    },
    group: "Before you commit",
    cta: { href: "/services/profile-evaluation", label: "Run the free checklist now" },
  },
  {
    slug: "consultation",
    name: "Paid consultation",
    summary:
      "Forty five minutes, built around six questions, ending in a written assessment. Sometimes the honest answer is not to go at all.",
    includes: [
      "Forty five minutes with a counsellor, not a salesperson on commission",
      "A written assessment within 24 hours, ranking two or three destinations, with the risks of each",
      "An honest look at funding, including whether the plan works on your real budget",
      "The full fee back if the written assessment does not arrive within 24 hours",
    ],
    excludes: [
      "It is not a free call. A free call is paid for through a commission you cannot see.",
      "You do not have to hire us afterwards, and the assessment is yours either way.",
    ],
    remuneration: {
      kind: "client-fee",
      price: "Priced in public on the booking page",
      detail:
        "You pay this, and it is all we earn from the call. No university or partner pays us for it, or for what we recommend.",
    },
    availability: {
      state: "not-yet",
      detail:
        "Not bookable yet. The booking page shows the questions and the price, but scheduling and payment are not connected, so nothing you enter there reaches us.",
    },
    group: "Before you commit",
  },
  {
    slug: "advisory",
    name: "Full advisory engagement",
    summary:
      "From shortlist to arrival in eleven stages, with what we do and the fee set out in a signed agreement.",
    includes: [
      "A shortlist of eight to ten universities",
      "Documents checked against the originals, or with whoever issued them",
      "Applications submitted and tracked, with every reference number and portal login shared with you",
      "A funding plan, visa file preparation and interview practice",
      "Pre-departure checklist, and check-ins at thirty, ninety and one hundred eighty days after you land",
    ],
    excludes: [
      "We do not write your statement of purpose, and no automated tool here is allowed to draft one.",
      "We do not edit, retouch or alter a document, for any reason.",
      "We do not guarantee admission or a visa, because nobody can.",
    ],
    remuneration: {
      kind: "client-fee",
      price: "₹25,000, or ₹45,000 on the German public university route",
      detail:
        "The German public route costs more because those universities pay us nothing. On other routes, a commission from the university covers part of our work.",
    },
    availability: {
      state: "not-yet",
      detail:
        "The system that runs this service is built but not yet connected to a database, so you cannot start one today.",
    },
    group: "The engagement",
  },
  {
    slug: "sop-coaching",
    name: "Statement of purpose coaching",
    summary:
      "Feedback on the structure and wording of something you wrote. We coach, we never write it for you, and the software itself enforces that.",
    includes: [
      "An outline of what each section needs to do, before you start writing",
      "Notes on your draft: what lacks evidence, what is generic, and what an admissions reader will not believe",
      "Line by line edits for clarity, and a check against the course's own selection criteria",
      "The same help with a German Letter of Motivation, which is a different document with a different purpose",
    ],
    excludes: [
      "We will not write it. A statement written by a consultant reads like one, and is more and more often caught.",
      "No automated tool here can draft one either. The software blocks it outright.",
    ],
    remuneration: {
      kind: "client-fee",
      price: "Included in the advisory engagement",
      detail: "Not sold separately, and we earn nothing from it beyond the advisory fee.",
    },
    availability: {
      state: "with-engagement",
      detail:
        "The coaching tool is live in the student portal for anyone with an open case. It will not write a draft.",
    },
    group: "Specific help",
  },
  {
    slug: "mock-visa-interview",
    name: "Mock visa interview",
    summary:
      "A practice interview based on the most common reasons for refusal right now, not a list of sample questions.",
    includes: [
      "A recorded practice interview using the questions your destination's visa officers really ask",
      "Written feedback on any answer that could make an officer doubt you, and why",
      "A second practice run after you have worked on the first, because the first is rarely the useful one",
      "For the UK, preparation for the credibility interview: why this course, why this university, and how it is paid for",
    ],
    excludes: [
      "We do not script your answers. A credibility interview is designed to catch scripted answers.",
      "We cannot influence the decision, and nobody who says they can is telling you the truth.",
    ],
    remuneration: {
      kind: "client-fee",
      price: "Included in the advisory engagement",
      detail: "Not sold separately.",
    },
    availability: {
      state: "with-engagement",
      detail: "Runs at the visa stage of an engagement.",
    },
    group: "Specific help",
  },
  {
    slug: "pre-departure",
    name: "Pre-departure briefing",
    summary:
      "A session on the city you are moving to, ending in a checklist you complete before you fly.",
    includes: [
      "What to do when you arrive in your city, in order, and what each step holds up if it is late",
      "City registration, insurance activation, bank account and residence permit for Germany; BRP or eVisa, GP registration and a travel card for the UK; IRP registration and a PPS number for Ireland",
      "What to carry in hand luggage, which is a short list and always includes the same four documents",
      "A realistic budget for your first month, using the figures on this site",
    ],
    excludes: [
      "It is not a general culture briefing. Every item is specific to your city and your visa.",
    ],
    remuneration: {
      kind: "client-fee",
      price: "Included in the advisory engagement",
      detail: "Not sold separately.",
    },
    availability: {
      state: "with-engagement",
      detail: "Runs at the pre-departure stage of an engagement.",
    },
    group: "Specific help",
  },
  {
    slug: "loan-guidance",
    name: "Education loan guidance",
    summary:
      "How education loans work, what each type of lender wants, and what to compare.",
    includes: [
      "The three types of lender and what each asks for: public sector banks, private banks and non-banking lenders",
      "What a loan sanction letter must say for a visa office to accept it, which is not the same as what a lender is willing to write",
      "Secured or unsecured, based on the collateral you actually have",
      "How to compare offers on total cost, not the headline rate: processing fee, interest during the repayment holiday, and early repayment terms",
      "Where the timing fails: a loan sanction that arrives after the deadline for showing funds is worth nothing",
    ],
    excludes: [
      "We are not a lender, a broker or a direct selling agent, and we hold no licence to be any of them.",
      "We do not arrange, negotiate or submit a loan application on your behalf.",
      "No lender pays us for an introduction. If that ever changes, the figure goes on this page before any introduction is made.",
    ],
    remuneration: {
      kind: "none",
      detail:
        "No lender has ever paid us, and your details never reach a lender unless you ask for that.",
    },
    availability: {
      state: "with-engagement",
      detail:
        "Part of the finance stage of an engagement. The guidance itself is on this site for anyone to read.",
    },
    group: "Introductions",
  },
  {
    slug: "accommodation",
    name: "Accommodation help",
    summary:
      "Help with the housing search and a check of your rental contract, on the route where housing, not the visa, is the hardest part.",
    includes: [
      "When to start, which for Dublin is before you accept the offer",
      "Where the listings actually are for your city, and which ones are worth the deposit",
      "A check of the rental agreement before you sign it, including the notice and deposit terms",
    ],
    excludes: [
      "We do not hold your deposit or handle any payment to a landlord or provider.",
      "We will not introduce you to a provider that pays us unless the payment is published here first.",
    ],
    remuneration: {
      kind: "none",
      detail:
        "No accommodation provider pays us today.",
    },
    availability: {
      state: "not-yet",
      detail:
        "The guidance is part of an engagement. We have no partnership with any housing provider.",
    },
    group: "Introductions",
  },
  {
    slug: "insurance",
    name: "Health insurance guidance",
    summary:
      "Which cover the visa needs, which the law requires, and which is optional. This differs in each country.",
    includes: [
      "For Germany, public (statutory) versus private cover, and why leaving public cover as a student is hard to undo",
      "For Ireland, the minimum of EUR 25,000 for accident and EUR 25,000 for illness, which the visa requires",
      "For the UK, what the Immigration Health Surcharge you already paid actually buys, and what it does not",
      "How to compare policies on cover and excess, not just on price",
    ],
    excludes: [
      "We are not an insurance broker or agent, and we do not sell, arrange or advise on a specific policy.",
    ],
    remuneration: {
      kind: "none",
      detail:
        "No insurer pays us.",
    },
    availability: {
      state: "with-engagement",
      detail: "Part of the pre-departure stage. The details for each country are in its destination guide.",
    },
    group: "Introductions",
  },
  {
    slug: "forex",
    name: "Forex and money transfer",
    summary:
      "What a money transfer really costs once the exchange rate margin is counted, and how tax collected at source works on money sent for education.",
    includes: [
      "How to compare a quoted rate with the mid-market rate, which is where most of the cost usually is",
      "Tax collected at source on money sent for education, and when a loan-funded transfer is treated differently",
      "The paperwork a bank needs for an education transfer, put together once rather than three times",
    ],
    excludes: [
      "We are not an authorised foreign exchange dealer, and we do not make the transfer for you.",
    ],
    remuneration: {
      kind: "none",
      detail:
        "No transfer provider pays us.",
    },
    availability: {
      state: "not-yet",
      detail: "Described here, but not yet part of an engagement.",
    },
    group: "Introductions",
  },
  {
    slug: "document-services",
    name: "Certification, translation and courier",
    summary:
      "Getting your documents into the format each office will accept. A wrong format is a common reason a complete file is rejected.",
    includes: [
      "Which documents need a certified translation, for which office, and in what format",
      "Notarisation and attestation, where a destination requires it",
      "Arranging the courier for a paper visa file",
    ],
    excludes: [
      "We do not translate, notarise or attest anything ourselves, and we never alter a document.",
      "We do not add anything to the cost of a third-party service.",
    ],
    remuneration: {
      kind: "none",
      detail:
        "Nothing beyond the advisory fee. You pay third-party costs directly, at their price.",
    },
    availability: {
      state: "with-engagement",
      detail: "Runs at the document stage of an engagement.",
    },
    group: "Specific help",
  },
  {
    slug: "video-counselling",
    name: "Video counselling sessions",
    summary:
      "Every session runs by video and can be booked. The larger platforms in this market still have no online booking at all.",
    includes: [
      "Video sessions, recorded on request, so you can go back over what was said",
      "A written follow-up after every session, because a decision that is never written down is not a decision",
    ],
    excludes: [
      "We do not run walk-in offices, and there is no city office to visit.",
    ],
    remuneration: {
      kind: "client-fee",
      price: "The consultation price, or included in an engagement",
      detail: "We earn nothing from the video platform itself.",
    },
    availability: {
      state: "not-yet",
      detail:
        "Scheduling is not connected yet, so a session cannot be booked today.",
    },
    group: "The engagement",
  },
];

export const servicesIntro = {
  headline: "What we do, and who pays us for it",
  lede:
    "Each service below shows what it costs you and what we earn from it, even when that is nothing.",
  rules: [
    "If a partner ever pays us for an introduction, we publish the figure first. Nobody pays us for one today.",
    "If a service is not running yet, it says so.",
    "We charge nothing that was not set out in writing before you agreed to it.",
    "We will not fake or misstate anything, and we end the engagement if we are asked to.",
  ],
};
