export const consultation = {
  duration: "45 minutes",
  price: "₹1,500",
  creditNote: "Credited in full against the service fee if you go ahead with us.",
  promise:
    "Within 24 hours of the call you receive a written assessment with two or three ranked destinations, the reasoning behind the ranking, and the risks attached to each.",
  includesUncomfortable:
    "That assessment includes the recommendation nobody sells, which is that some applicants should not go abroad at all, or not this year.",
};

export type IntakeQuestion = {
  id: string;
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
    label: "Academic background, with your percentage or CGPA",
    help: "Degree, discipline and institution, plus the number as it appears on your transcript.",
    type: "textarea",
    required: true,
    placeholder: "BE Mechanical, VTU, 7.4 CGPA",
  },
  {
    id: "graduationYear",
    label: "Year of graduation, and an explanation of any gap since",
    help: "A gap is not a problem. An unexplained gap on a visa file is.",
    type: "textarea",
    required: true,
    placeholder: "2023. Two years at an automotive supplier since then.",
  },
  {
    id: "englishTest",
    label: "English test status",
    help: "IELTS, PTE, TOEFL or Duolingo. Include the score and test date if you have taken it.",
    type: "textarea",
    required: true,
    placeholder: "IELTS 7.0 overall, taken March 2026. Or: not booked yet.",
  },
  {
    id: "budget",
    label: "Total year one budget, tuition and living combined",
    help: "The real number, including what family can contribute and what a loan would need to cover.",
    type: "text",
    required: true,
    placeholder: "₹28,00,000",
  },
  {
    id: "targetIntake",
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
    "No slot was booked, no payment was taken, and nothing you typed was sent or stored on our side. Your answers stay in this browser so you can copy them.",
  needed: [
    "A scheduling provider, Cal.com or Zoho Bookings, holding the real 45 minute calendar",
    "Razorpay keys for the ₹1,500 payment, with the credit against fee rule encoded",
    "The security and DPDP foundation, before any personal detail is stored",
    "A published confirmation address on the registered entity",
  ],
};
