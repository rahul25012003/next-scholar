export const consultation = {
  duration: "45 minutes",
  price: "₹1,500",
  creditNote: "Taken off your service fee in full if you go ahead with us.",
  promise:
    "Within 24 hours of the call, you get a written assessment ranking two or three destinations, with the reasons and the risks for each.",
  includesUncomfortable:
    "Sometimes the honest advice is not to go abroad at all, or not this year. If so, the assessment says it.",
};

/**
 * The intake, in three steps.
 *
 * The order matters more than the questions do. A country is a choice and
 * discloses nothing; a transcript is a disclosure. Asking for the second before
 * the first is how a form loses someone who was still deciding whether the site
 * was worth their attention.
 */
export const intakeSteps = [
  {
    id: "where",
    title: "Where",
    blurb:
      "Nothing personal is asked on this step. Each country has a full guide on this site, with fees and funding rules, if you would rather read that first.",
  },
  {
    id: "record",
    title: "Your record",
    blurb:
      "Enough to rank destinations honestly. A gap or a backlog can be worked with if you tell us, and is fatal if it is found out later, so we ask about both.",
  },
  {
    id: "money",
    title: "Money and history",
    blurb:
      "Your budget decides which routes are realistic. We also ask about any previous consultant, which matters more than it sounds.",
  },
] as const;

export type IntakeQuestion = {
  id: string;
  /** Which of the three steps this question belongs to. */
  step: 0 | 1 | 2;
  label: string;
  help?: string;
  type: "text" | "textarea" | "select" | "number";
  options?: string[];
  required: boolean;
  placeholder?: string;
};

/** The six questions, asked in this order, on the call and on this form. */
export const intakeQuestions: IntakeQuestion[] = [
  {
    id: "academicBackground",
    step: 1,
    label: "Academic background, with your percentage or CGPA",
    help: "Degree, subject and college, plus the number as it appears on your transcript.",
    type: "textarea",
    required: true,
    placeholder: "BE Mechanical, VTU, 7.4 CGPA",
  },
  {
    id: "graduationYear",
    step: 1,
    label: "Year of graduation, and an explanation of any gap since",
    help: "A gap is not a problem. An unexplained gap on a visa file is.",
    type: "textarea",
    required: true,
    placeholder: "2023. Two years at an automotive supplier since then.",
  },
  {
    id: "englishTest",
    step: 1,
    label: "English test status",
    help: "IELTS, PTE, TOEFL or Duolingo. If you have taken it, add the score and test date.",
    type: "textarea",
    required: true,
    placeholder: "IELTS 7.0 overall, taken March 2026. Or: not booked yet.",
  },
  {
    id: "budget",
    step: 2,
    label: "Total year one budget, tuition and living combined",
    help: "The real number, including what your family can give and what a loan would need to cover.",
    type: "text",
    required: true,
    placeholder: "₹28,00,000",
  },
  {
    id: "targetIntake",
    step: 0,
    label: "Target intake",
    type: "select",
    options: [
      "September 2027",
      "January 2028",
      "April 2028 (Germany)",
      "September 2028",
      "Not decided yet",
    ],
    required: true,
  },
  {
    id: "priorConsultant",
    step: 2,
    label: "Has another consultant already submitted an application for you?",
    help: "This matters more than it sounds. A duplicate application to the same university can sink both.",
    type: "select",
    options: ["No", "Yes", "I am not sure"],
    required: true,
  },
];

/**
 * Booking and payment are not wired to a provider yet, and no student personal
 * data is stored anywhere until the security and DPDP foundation is built. The
 * form therefore validates the six answers, keeps them in your own browser so
 * nothing you typed is lost, and sends nothing. A fake confirmation screen here
 * would be the same lie the rest of the business exists to avoid.
 */
export const bookingIntegration = {
  live: false,
  pendingNote:
    "No slot was booked, no payment was taken, and nothing you typed was sent to us or stored by us. Your answers stay in this browser so you can copy them.",
  needed: [
    "A booking calendar, Cal.com or Zoho Bookings, with the real 45 minute slots",
    "Razorpay set up for the ₹1,500 payment, with the fee credit rule built in",
    "Data security and DPDP (India's data protection law) compliance, before any personal detail is stored",
    "A published address for confirmations, once the company is registered",
  ],
};
