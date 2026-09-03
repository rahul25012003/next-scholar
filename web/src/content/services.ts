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
};

export const services: Service[] = [
  {
    slug: "profile-evaluation",
    name: "Free profile evaluation",
    summary:
      "A written read of where you actually stand against the published requirements, before you pay anyone anything.",
    includes: [
      "Your academic record checked against the published threshold for each of the three destinations",
      "Your language result checked against the overall and the per-section condition, which is where most people find out they are short",
      "For Germany, whether the dMAT applies to you and whether the transitional exemption does",
      "A written answer within three working days, naming what you meet, what you do not, and what we could not tell",
    ],
    excludes: [
      "No shortlist of universities. That is the paid work and it takes hours per applicant.",
      "No probability, score or chance of admission. We do not compute one anywhere.",
      "No sales call attached. If the answer is that you are not ready, that is the answer.",
    ],
    remuneration: {
      kind: "none",
      detail:
        "Free, and it earns us nothing. It exists because the requirements checklist on this site already answers most of it in a browser, and a person reading your actual transcript answers the rest.",
    },
    availability: {
      state: "live",
      detail:
        "Run the checklist yourself in the browser first: it is ungated and it answers the same questions from the same figures. Ask for the written evaluation when you want a person to read your transcript.",
    },
    group: "Before you commit",
  },
  {
    slug: "consultation",
    name: "Paid consultation",
    summary:
      "Forty five minutes, structured around six questions, ending in a written assessment. It includes the answer nobody sells, which is that you should not go at all.",
    includes: [
      "Forty five minutes with a counsellor, not a salesperson on commission",
      "A written assessment within 24 hours, with two or three ranked destinations and the risks attached to each",
      "An honest read on the funding, including whether the plan works at your actual budget",
      "The full fee back if the written assessment does not arrive within 24 hours",
    ],
    excludes: [
      "It is not a free introductory call and it is not meant to be. A free call is priced into a commission you cannot see.",
      "It is not a commitment to engage us afterwards, and the assessment is yours either way.",
    ],
    remuneration: {
      kind: "client-fee",
      price: "Priced in public on the booking page",
      detail:
        "Paid by you, and it is the only thing we earn from this conversation. No university pays us for a consultation and no partner pays us for the recommendation that comes out of it.",
    },
    availability: {
      state: "not-yet",
      detail:
        "The booking form takes an enquiry today. Scheduling and payment are not connected yet, so a session is arranged by reply rather than booked in a calendar. That is stated here rather than discovered at the payment step.",
    },
    group: "Before you commit",
  },
  {
    slug: "advisory",
    name: "Full advisory engagement",
    summary:
      "Shortlist to arrival, across eleven stages, on a signed agreement with the scope and the fee in writing.",
    includes: [
      "A shortlist of eight to ten universities with our commission printed next to each one",
      "Document verification against originals or with the issuing institution",
      "Applications submitted and tracked, with you holding every reference number and portal login",
      "Funding plan, visa file preparation and interview rehearsal",
      "Pre-departure checklist, and check-ins at thirty, ninety and one hundred eighty days after you land",
    ],
    excludes: [
      "We do not write your statement of purpose, and no automated system here is permitted to draft one.",
      "We do not edit, retouch or alter a document, for any reason.",
      "We do not guarantee admission or a visa, because nobody can.",
    ],
    remuneration: {
      kind: "client-fee",
      price: "₹25,000, or ₹45,000 on the German public university route",
      detail:
        "The German public route costs more because no German public university pays us anything. On the other routes a commission from the institution offsets part of the work, and the figure is published on every page where that institution appears.",
    },
    availability: {
      state: "not-yet",
      detail:
        "The platform that runs this engagement is built and its data layer is not connected to a database yet, so an engagement cannot be opened today.",
    },
    group: "The engagement",
  },
  {
    slug: "sop-coaching",
    name: "Statement of purpose coaching",
    summary:
      "Structural feedback and line editing on something you wrote. Coached, never ghostwritten, and the platform enforces that in code rather than in policy.",
    includes: [
      "A structural outline of what each section has to do, before you write anything",
      "Annotated feedback on your draft: what is unsupported, what is generic, what the admissions reader will not believe",
      "Line editing for clarity, and a check against the programme's own stated selection criteria",
      "The same treatment for a German Letter of Motivation, which is a different document with a different job",
    ],
    excludes: [
      "We will not write it. An SOP written by a consultant reads like one and is increasingly detected as one.",
      "No automated system here can draft one either. That is a permission check in the software, not an instruction in a prompt.",
    ],
    remuneration: {
      kind: "client-fee",
      price: "Included in the advisory engagement",
      detail: "Not sold separately, and nothing is earned from it beyond the advisory fee.",
    },
    availability: {
      state: "with-engagement",
      detail:
        "The coaching tool is live inside the student portal for anyone with an open case, and it refuses to produce a draft.",
    },
    group: "Specific help",
  },
  {
    slug: "mock-visa-interview",
    name: "Mock visa interview",
    summary:
      "A rehearsed interview against the refusal patterns currently in circulation, not a list of sample questions.",
    includes: [
      "A recorded practice interview against the questions your destination's officers actually ask",
      "Written feedback on the answers that would raise a credibility question, and why",
      "A second run after you have worked on the first, because the first one is rarely the useful one",
      "For the UK, preparation for a credibility interview specifically: why this course, why this university, how it is funded",
    ],
    excludes: [
      "We do not script answers for you. A scripted answer is exactly what a credibility interview is designed to find.",
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
      "A scoped session on the specific city you are moving to, ending in a checklist completed before you fly.",
    includes: [
      "The arrival sequence for your city, in order, with what each step blocks if it is late",
      "City registration, insurance activation, bank account and residence permit for Germany; BRP or eVisa, GP registration and a travel card for the UK; IRP registration and a PPS number for Ireland",
      "What to carry in hand luggage, which is a short list and always includes the same four documents",
      "The first month's realistic budget against the figures on this site",
    ],
    excludes: [
      "It is not a generic culture briefing. Every item is specific to the city and the permission you hold.",
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
      "How the lending actually works, what the categories of lender want, and what to compare. We are not a lender and we take no introduction fee.",
    includes: [
      "The three lender categories and what each one actually asks for: public sector banks, private banks, and non-banking lenders",
      "What a sanction letter has to say for a visa authority to accept it, which is not the same as what a lender is willing to write",
      "The difference between a secured and an unsecured loan on the collateral you actually have",
      "How to compare an offer on total cost rather than on the headline rate: processing fee, moratorium interest treatment, and prepayment terms",
      "Where the timeline breaks: a sanction that arrives after the funds evidencing window has closed is worth nothing",
    ],
    excludes: [
      "We are not a lender, a broker or a direct selling agent, and we hold no licence to be any of them.",
      "We do not arrange, negotiate or submit a loan application on your behalf.",
      "We do not take a fee from any lender for an introduction, and if we ever do, it will be published here with the figure before the introduction is made.",
    ],
    remuneration: {
      kind: "none",
      detail:
        "Nothing. No lender pays us, no lender has ever paid us, and there is no arrangement under which your details reach one without you asking for that specifically.",
    },
    availability: {
      state: "with-engagement",
      detail:
        "Runs at the finance stage of an engagement, and the guidance itself is published on this site for anyone.",
    },
    group: "Introductions",
  },
  {
    slug: "accommodation",
    name: "Accommodation help",
    summary:
      "Search strategy and a read of the contract, on the route where housing rather than visa policy is the binding constraint.",
    includes: [
      "When to start, which for Dublin is before you accept the offer",
      "Where the listings actually are for your city, and which ones are worth the deposit",
      "A read of the tenancy agreement before you sign it, including the notice and deposit terms",
    ],
    excludes: [
      "We do not hold your deposit or handle any payment to a landlord or provider.",
      "We will not introduce you to a provider that pays us unless the payment is published here first.",
    ],
    remuneration: {
      kind: "none",
      detail:
        "Nothing today. No accommodation provider pays us. If a partnership ever exists it will appear on this page with its terms and its figure, and the disclosure will be on every page where the provider is named.",
    },
    availability: {
      state: "not-yet",
      detail:
        "The guidance runs inside an engagement. No provider partnership exists, which is why there is no figure to publish yet.",
    },
    group: "Introductions",
  },
  {
    slug: "insurance",
    name: "Health insurance guidance",
    summary:
      "Which cover is a visa requirement, which is a statutory obligation, and which is optional. The three are different in each of our destinations.",
    includes: [
      "For Germany, statutory versus private and why leaving the statutory system as a student is hard to reverse",
      "For Ireland, the EUR 25,000 accident and EUR 25,000 disease minimum, which is a visa requirement rather than an optional extra",
      "For the UK, what the Immigration Health Surcharge you already paid actually buys, and what it does not",
      "How to compare policies on cover and excess rather than on premium",
    ],
    excludes: [
      "We are not an insurance intermediary and we do not sell, arrange or advise on a specific policy.",
    ],
    remuneration: {
      kind: "none",
      detail:
        "Nothing. No insurer pays us. The same publication rule applies if that ever changes.",
    },
    availability: {
      state: "with-engagement",
      detail: "Runs at the pre-departure stage, and the country-level detail is on each destination guide.",
    },
    group: "Introductions",
  },
  {
    slug: "forex",
    name: "Forex and money transfer",
    summary:
      "What the transfer actually costs once the spread is counted, and how the tax collected at source works on an education remittance.",
    includes: [
      "How to read a quoted rate against the mid-market rate, which is where the cost usually is",
      "Tax collected at source on education remittances, and when a loan-funded remittance is treated differently",
      "The paperwork a bank wants for an education remittance, assembled once rather than three times",
    ],
    excludes: [
      "We are not an authorised dealer and we do not execute a transfer for you.",
    ],
    remuneration: {
      kind: "none",
      detail:
        "Nothing. No transfer provider pays us. A referral arrangement would be published here with its figure before any introduction was made.",
    },
    availability: {
      state: "not-yet",
      detail: "Described here, not yet a scoped deliverable inside an engagement.",
    },
    group: "Introductions",
  },
  {
    slug: "document-services",
    name: "Certification, translation and courier",
    summary:
      "Getting documents into the form each body will accept, which is a surprisingly common reason a complete file is rejected.",
    includes: [
      "Which documents need certified translation for which body, and in what format",
      "Notarisation and attestation, where a destination requires it",
      "Courier coordination for a physical visa file",
    ],
    excludes: [
      "We do not translate, notarise or attest anything ourselves, and we never alter a document.",
      "We do not mark up the cost of a third-party service.",
    ],
    remuneration: {
      kind: "none",
      detail:
        "Nothing beyond the advisory fee. Third-party costs are paid by you, directly, at their price.",
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
      "Every session runs by video and is bookable. The larger platforms in this market still have no online booking at all.",
    includes: [
      "Video sessions, recorded on request, so you can go back over what was said",
      "Written follow-up after every session, because a decision made in conversation and never written down is not a decision",
    ],
    excludes: [
      "We do not run walk-in offices, and there is no city office to visit.",
    ],
    remuneration: {
      kind: "client-fee",
      price: "The consultation price, or included in an engagement",
      detail: "Nothing is earned from the video platform itself.",
    },
    availability: {
      state: "not-yet",
      detail:
        "Scheduling is not connected yet. Sessions are arranged by reply to the booking form.",
    },
    group: "The engagement",
  },
];

export const servicesIntro = {
  headline: "What we do, and who pays us for it",
  lede:
    "Every service on this page states what it costs you and what we earn on it, including the ones where the answer is nothing. A consultancy's service list is where referral money hides, and a page describing a loan introduction without saying who pays for it is the standard practice this business was built to correct.",
  rules: [
    "Where a partner pays us for an introduction, the figure is published before the introduction is made. There is no arrangement today under which anyone pays us for one.",
    "Where a service is described here but not yet running, it says so. Nothing on this page is presented as bookable today when it is not.",
    "Nothing is charged that was not stated in writing before you agreed to it.",
    "We decline work that requires falsifying or misrepresenting anything, and we end the engagement if we are asked.",
  ],
};
