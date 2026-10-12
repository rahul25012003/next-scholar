import type { DestinationGuide } from "./types";

/**
 * United Kingdom.
 *
 * The UK route is the one where the money the visa authority wants to see is
 * most often underestimated, because three separate figures stack: maintenance
 * funds held for a fixed period, the outstanding tuition on the CAS, and the
 * Immigration Health Surcharge paid up front for the whole course. The site
 * previously published none of the three.
 */
export const unitedKingdom: DestinationGuide = {
  slug: "united-kingdom",
  country: "United Kingdom",
  flagCode: "gb",
  currency: "GBP",
  symbol: "£",
  headline: "The United Kingdom, step by step",
  lede:
    "A UK Student visa is refused more often on money than on grades. This guide covers entry requirements, deadlines, the visa steps and the date that shortens the Graduate Route. Every cost, including the 28 day rule on your funds, is on the costs page.",
  verification: {
    statedOn: "2026-09-03",
    checkedBy: null,
    checkedOn: null,
    cadence:
      "Re-read in full at source each quarter, and immediately on any Home Office fee or maintenance uplift.",
  },

  routes: [
    {
      slug: "united-kingdom",
      name: "Taught Master's",
      destinationSlug: "united-kingdom",
      summary:
        "One year taught postgraduate degrees, with September and January intakes. The order is offer, then CAS, then visa, and almost every Indian applicant we see takes this route.",
    },
  ],

  tuition: [
    {
      label: "Taught Master's, year one",
      value: "£12,500 to £46,000",
      qualifier:
        "An indicative range across universities and subjects, not a quoted price. Low end: Wrexham University's published 2026/27 international MA/MSc rate. Top end: business and computing at high-ranked universities, where our catalogue's highest entry sits. MBAs cost more.",
      source: "University published international fee schedules",
    },
    {
      label: "Tuition deposit to hold an offer",
      value: "£2,000 to £5,000, or 50 per cent of year one",
      qualifier:
        "Varies by university. It is a condition of the CAS, not of the offer, and is usually non-refundable once the CAS is issued.",
      source: "University offer conditions",
    },
  ],

  living: {
    currency: "GBP",
    symbol: "£",
    qualifier:
      "Monthly ranges for one student in shared housing. London is listed separately because the immigration rules set a different maintenance figure for it, not because of lifestyle.",
    source:
      "University accommodation offices, Office for National Statistics rent data, and published Home Office maintenance rates",
    cities: [
      {
        slug: "london",
        name: "London",
        note:
          "The immigration rules treat London separately, and so does the rent. Where your institution is, not your campus address, decides which maintenance rate applies.",
        lines: [
          { id: "rent", label: "Rent, shared flat or hall", low: 900, high: 1500 },
          { id: "food", label: "Groceries", low: 180, high: 280 },
          {
            id: "transport",
            label: "Transport, 18+ Student Oyster",
            low: 90,
            high: 140,
            note: "The 18+ Student Oyster photocard gives 30 per cent off travelcards. You apply for it after enrolment.",
          },
          { id: "phone", label: "Phone and internet", low: 15, high: 35 },
          { id: "utilities", label: "Utilities, where not included in rent", low: 0, high: 90 },
          { id: "personal", label: "Personal, clothing, leisure", low: 100, high: 250 },
          { id: "books", label: "Books and course materials", low: 15, high: 45 },
          { id: "travel", label: "Flights home, spread monthly", low: 45, high: 90, optional: true },
        ],
      },
      {
        slug: "manchester",
        name: "Manchester, Birmingham, Leeds, Glasgow",
        note:
          "Big-city universities outside London. Both the maintenance requirement and the rent are much lower.",
        lines: [
          { id: "rent", label: "Rent, shared flat or hall", low: 550, high: 900 },
          { id: "food", label: "Groceries", low: 160, high: 250 },
          { id: "transport", label: "Transport, student bus or tram pass", low: 40, high: 70 },
          { id: "phone", label: "Phone and internet", low: 15, high: 35 },
          { id: "utilities", label: "Utilities, where not included in rent", low: 0, high: 80 },
          { id: "personal", label: "Personal, clothing, leisure", low: 80, high: 200 },
          { id: "books", label: "Books and course materials", low: 15, high: 45 },
          { id: "travel", label: "Flights home, spread monthly", low: 45, high: 90, optional: true },
        ],
      },
      {
        slug: "smaller",
        name: "Smaller university towns",
        note: "Coventry, Loughborough, Dundee, Swansea and similar. The lowest rents, and usually a walkable campus.",
        lines: [
          { id: "rent", label: "Rent, shared flat or hall", low: 420, high: 700 },
          { id: "food", label: "Groceries", low: 150, high: 230 },
          { id: "transport", label: "Transport", low: 20, high: 50 },
          { id: "phone", label: "Phone and internet", low: 15, high: 35 },
          { id: "utilities", label: "Utilities, where not included in rent", low: 0, high: 80 },
          { id: "personal", label: "Personal, clothing, leisure", low: 70, high: 170 },
          { id: "books", label: "Books and course materials", low: 15, high: 45 },
          { id: "travel", label: "Flights home, spread monthly", low: 45, high: 90, optional: true },
        ],
      },
    ],
  },

  funds: [
    {
      label: "Maintenance funds, courses in London",
      value: "£1,529 per month, up to nine months",
      qualifier:
        "The minimum set by the immigration rules, not an estimate of living costs. Nine months is the cap, so this line is at most £13,761.",
      source: "UKVI Student route guidance, Appendix Finance",
      note:
        "London means the institution is inside Greater London. A campus outside that boundary can change the rate, so check it for each institution.",
    },
    {
      label: "Maintenance funds, courses outside London",
      value: "£1,171 per month, up to nine months",
      qualifier:
        "The same legal minimum, for courses outside Greater London. Nine months caps this line at £10,539.",
      source: "UKVI Student route guidance, Appendix Finance",
    },
    {
      label: "Outstanding tuition, on top of maintenance",
      value: "The unpaid balance of year one, as printed on your CAS",
      qualifier:
        "Added to the maintenance figure, not included in it. A deposit already paid is deducted only if the CAS records it.",
      source: "UKVI Student route guidance, Appendix Finance",
      note:
        "The most common mistake on a UK application is treating maintenance as the whole requirement and not adding the tuition balance on the CAS.",
    },
    {
      label: "The 28 consecutive day rule",
      value: "Funds held for 28 consecutive days",
      qualifier:
        "The balance must not drop below the required amount on any day of a 28 day period. The closing balance date must be within 31 days of your visa application.",
      source: "UKVI Student route guidance, Appendix Finance",
      note:
        "One day below the amount, for example after a transfer out, restarts the 28 days. Money from a relative must be in the account and settled before the clock starts, and if the account is not yours you must also evidence the relationship.",
    },
    {
      label: "Where the funds may sit",
      value: "A personal or parental account, or an official financial sponsor letter",
      qualifier:
        "Parents' money needs your birth certificate, to show the link, and their signed consent letter. Some account types, such as certain investment and pension products, are not accepted at all.",
      source: "UKVI Student route guidance, Appendix Finance",
    },
  ],

  visaFees: [
    {
      label: "Student visa application, applying from India",
      value: "£524",
      qualifier: "Home Office fee for a Student visa applied for outside the UK. Non-refundable if refused.",
      source: "UK Home Office fee schedule",
    },
    {
      label: "Immigration Health Surcharge",
      value: "£776 per year of the visa",
      qualifier:
        "Paid in full, up front, for the whole length of the visa, not year by year. A 12 month course plus the standard four months after it is charged for the longer period, so you usually pay more than one year's figure.",
      source: "UK Home Office, Immigration Health Surcharge",
      note:
        "Real cash you pay when you apply, separate from the maintenance funds. It gives you NHS access on the same terms as a UK resident.",
    },
    {
      label: "TB test certificate",
      value: "₹3,000 to ₹6,000",
      qualifier:
        "Clinic pricing at a Home Office approved centre, not a government fee. Required if you live in India and your course is longer than six months.",
      source: "UK Home Office approved TB clinic list",
    },
    {
      label: "Priority visa service",
      value: "£500, optional",
      qualifier:
        "Buys a faster decision, not a better one. Worth it only when a specific start date is really at risk.",
      source: "UK Home Office fee schedule",
    },
    {
      label: "ATAS certificate",
      value: "No fee",
      qualifier:
        "Free, but it takes weeks, and some programmes need it before the CAS. See the academic requirements.",
      source: "Foreign, Commonwealth and Development Office",
    },
  ],

  language: [
    {
      name: "IELTS for UKVI (Academic)",
      accepted:
        "A Secure English Language Test (SELT), needed where the university uses the Home Office SELT list instead of its own assessment. Minimum scores in each part, usually 5.5 or 6.0, matter as much as the overall band.",
      validity: "Two years from the test date.",
      note:
        "A separate booking from IELTS Academic, at a different type of centre. Where a SELT is required the two are not interchangeable, and booking the wrong one is a common mistake that costs a retake fee and weeks.",
      source: "UKVI approved SELT provider list",
    },
    {
      name: "IELTS Academic",
      accepted:
        "Accepted for admission by most universities that assess your English themselves. Not valid where a SELT is required.",
      validity: "Two years from the test date.",
      source: "University admission requirements",
    },
    {
      name: "PTE Academic (UKVI), TOEFL iBT, Duolingo",
      accepted:
        "Acceptance varies by university and by whether a SELT is required. TOEFL is accepted by many universities but not all, and Duolingo by fewer.",
      validity: "Two years, typically.",
      source: "University admission requirements, and the UKVI SELT list",
    },
    {
      name: "Class XII English, or a Medium of Instruction letter",
      accepted:
        "Some universities waive the test for Indian applicants based on Class XII English marks or an MOI letter. The waiver is the university's, not the Home Office's, and does not apply where a SELT is required.",
      validity: "Institution-specific.",
      source: "University admission requirements",
    },
  ],

  academic: [
    {
      title: "A three year Indian Bachelor's is normally accepted",
      body:
        "Unlike Germany, the UK generally accepts a three year Indian Bachelor's degree for a one year taught Master's. Each university sets a percentage or CGPA threshold, commonly 55 to 65 per cent, depending on its tier and its own list of recognised Indian institutions.",
      source: "University admission requirements",
      appliesTo: "Master's applicants",
    },
    {
      title: "Backlogs and arrears are asked about explicitly",
      body:
        "Most UK universities state the most backlogs they will consider, often between five and fifteen, and they mean cleared backlogs. Give an honest count: a university that finds out later withdraws the offer.",
      source: "University admission requirements",
      appliesTo: "Applicants with academic arrears",
    },
    {
      title: "ATAS, for certain STEM programmes",
      body:
        "The Academic Technology Approval Scheme covers named postgraduate subjects with security relevance, mostly in engineering, physics, materials and computing. It is free but takes several weeks, and where it applies the university cannot issue your CAS until you have it.",
      source: "Foreign, Commonwealth and Development Office",
      appliesTo: "Applicants to ATAS-listed subjects",
    },
    {
      title: "The CAS is a dated dependency, not a document",
      body: "Every date after the offer depends on your Confirmation of Acceptance for Studies (CAS).",
      points: [
        "It is issued once you accept the offer and meet its conditions, including the deposit.",
        "It expires, and you must apply for the visa within its window.",
        "That is why we discuss the deposit when you shortlist, not when the offer arrives.",
      ],
      source: "UKVI Student route guidance",
      appliesTo: "All applicants",
    },
    {
      title: "The credibility interview",
      body:
        "UKVI may call you for a video interview on why this course and university, how you are funding it and your plans afterwards. It is not a trick: refusals come from applicants who cannot describe their own course, and that is what we rehearse with you.",
      source: "UKVI Student route guidance",
      appliesTo: "Applicants selected for interview",
    },
  ],

  intakes: [
    {
      name: "September intake",
      applicationDeadline: "2027-06-30",
      deadlineNote:
        "Most universities have no single hard deadline and close programmes as they fill, so the real deadline is earlier than the published one. Competitive courses at high-ranked universities can close by February, and the practical window opens about a year ahead.",
      teachingStarts: "2027-09-20",
      status: "not-yet-open",
      statusAsOf: "2026-09-03",
      source: "University application pages",
    },
    {
      name: "January intake",
      applicationDeadline: "2027-10-31",
      deadlineNote:
        "A smaller intake, with fewer programmes and fewer scholarships. A real option if your September visa timeline has already slipped.",
      teachingStarts: "2028-01-17",
      status: "not-yet-open",
      statusAsOf: "2026-09-03",
      source: "University application pages",
    },
  ],

  timeline: [
    {
      monthsBefore: [12, 10],
      title: "Language test and shortlist",
      detail:
        "First check whether any target university requires a SELT, because that decides which IELTS you book. Shortlist against each university's list of recognised institutions and its backlog policy.",
    },
    {
      monthsBefore: [10, 7],
      title: "Applications and references",
      detail:
        "Write your own personal statement and ask for references early, because a slow referee is the most common avoidable delay. Start ATAS now if your subject needs it.",
    },
    {
      monthsBefore: [7, 5],
      title: "Offers, then the deposit decision",
      detail:
        "Compare offers, including the deposit terms and what is refundable. Accepting means paying, and the CAS follows the payment.",
    },
    {
      monthsBefore: [5, 4],
      title: "Start the 28 day funds clock",
      detail:
        "The step people leave too late: the balance must sit untouched for 28 consecutive days, and the closing balance must be within 31 days of applying. Work back from your planned application date.",
    },
    {
      monthsBefore: [4, 3],
      title: "CAS, TB test, then apply",
      detail:
        "Get the CAS, take the TB test at an approved clinic, pay the IHS and book biometrics. Apply within the CAS window.",
    },
    {
      monthsBefore: [3, 0],
      title: "Decision, accommodation, travel",
      detail:
        "Standard processing from India is around three weeks, and not guaranteed. University hall applications usually close well before this point, so make them in parallel.",
    },
  ],

  visaSteps: [
    {
      id: "offer",
      title: "Unconditional offer accepted",
      detail: "Conditions met, including any language and document conditions.",
      blocks: "The CAS.",
      source: "University offer conditions",
    },
    {
      id: "atas",
      title: "ATAS certificate, if the subject requires it",
      detail: "Free, several weeks. The university cannot issue the CAS without it.",
      blocks: "The CAS.",
      source: "Foreign, Commonwealth and Development Office",
    },
    {
      id: "deposit",
      title: "Tuition deposit paid",
      detail: "Usually a CAS condition. Record what the CAS shows as paid, because the visa funds calculation uses that figure.",
      blocks: "The CAS.",
      source: "University offer conditions",
    },
    {
      id: "funds",
      title: "Funds held for 28 consecutive days",
      detail:
        "Maintenance plus the outstanding tuition on the CAS, never dropping below the total on any day. Closing balance within 31 days of applying.",
      blocks: "The visa application.",
      source: "UKVI Appendix Finance",
    },
    {
      id: "cas",
      title: "CAS issued",
      detail: "Check every field against your passport and your offer before applying. An error here is a refusal.",
      blocks: "The visa application.",
      source: "UKVI Student route guidance",
    },
    {
      id: "tb",
      title: "TB test certificate",
      detail: "At a Home Office approved clinic only. A certificate from any other clinic is not accepted.",
      blocks: "The visa application.",
      source: "UK Home Office approved clinic list",
    },
    {
      id: "ihs",
      title: "Immigration Health Surcharge paid",
      detail: "Paid during the online application, in full, for the whole visa length.",
      blocks: "Submission of the application.",
      source: "UK Home Office",
    },
    {
      id: "biometrics",
      title: "Biometrics appointment",
      detail: "At a visa application centre in India, after the online application is submitted.",
      source: "UKVI, and its commercial partner in India",
    },
    {
      id: "decision",
      title: "Decision",
      detail:
        "The standard service from India is around three weeks, a target rather than a guarantee. A credibility interview, if called, happens in this window.",
      source: "UKVI Student route guidance",
    },
  ],

  visaDocuments: [
    { id: "passport", title: "Current passport", detail: "With a blank page for the vignette.", source: "UKVI" },
    { id: "cas-doc", title: "CAS number and the CAS statement", detail: "Every field checked against your passport and offer.", source: "UKVI" },
    {
      id: "finance",
      title: "Financial evidence covering the 28 day period",
      detail:
        "Bank statements or an official letter, in the accepted format, showing the required total held throughout. Parental funds need a birth certificate and a consent letter.",
      source: "UKVI Appendix Finance",
    },
    { id: "tb-cert", title: "TB test certificate", detail: "From an approved clinic, within its validity period.", source: "UK Home Office" },
    {
      id: "quals",
      title: "Qualifications used to obtain the offer",
      detail: "The degree certificate and transcripts your CAS lists, plus the language test if the CAS names one.",
      source: "UKVI",
    },
    { id: "atas-cert", title: "ATAS certificate, where required", detail: "Referenced on the CAS.", source: "FCDO" },
    {
      id: "consent",
      title: "Parental consent and relationship evidence, where funds are not in your name",
      detail: "Birth certificate plus a signed letter. A joint account still needs the link evidenced.",
      source: "UKVI Appendix Finance",
    },
    {
      id: "translations",
      title: "Certified translations of anything not in English",
      detail: "With the translator's credentials and the date, in the format UKVI specifies.",
      source: "UKVI",
    },
  ],

  postArrival: [
    {
      id: "brp",
      title: "Collect the BRP, or activate the eVisa",
      detail:
        "The UK has been moving from physical biometric residence permits to digital eVisas. Which one you get depends on when you apply, so go by your decision letter, not by assumption.",
      blocks: "Proving your status to a landlord, a bank or an employer.",
      source: "UK Home Office",
    },
    {
      id: "enrol",
      title: "Enrol and complete right-to-study checks",
      detail:
        "Your university must report your enrolment to the Home Office. Missing it is a visa compliance problem, not just paperwork.",
      blocks: "Continued sponsorship.",
      source: "University international office",
    },
    { id: "gp", title: "Register with a GP", detail: "Free at the point of use, funded by the surcharge you have already paid.", source: "NHS" },
    { id: "bank", title: "Open a UK bank account", detail: "Needs your BRP or eVisa status, a proof of address and a university enrolment letter.", source: "UK retail banks" },
    { id: "oyster", title: "Apply for the student travel discount", detail: "18+ Student Oyster in London, a local student pass elsewhere. Both need enrolment confirmation.", source: "Transport for London, and local operators" },
    {
      id: "police",
      title: "Police registration, only if your vignette says so",
      detail:
        "The general requirement was withdrawn in 2022. Follow what your own decision letter states rather than what an older guide says.",
      source: "UK Home Office",
    },
  ],

  workRights: [
    {
      title: "20 hours a week in term time, for degree-level study",
      body:
        "On a sponsored degree-level course at a higher education provider, you may work 20 hours a week in term time and full-time outside it. The 20 hours is a hard weekly cap, not a monthly average, and is one of the rules most often broken by accident.",
      source: "UKVI Student route conditions",
    },
    {
      title: "What is prohibited outright",
      body:
        "None of these is allowed, and breaking a work condition puts your visa and any future application at risk.",
      points: [
        "Self-employment.",
        "Business activity.",
        "Work as a professional sportsperson or sports coach.",
        "A permanent full-time job.",
      ],
      source: "UKVI Student route conditions",
    },
    {
      title: "Placements and internships",
      body:
        "A placement that is an assessed part of your course is treated differently, and is capped as a share of the course. Your university's international office confirms the rules for your programme.",
      source: "UKVI Student route conditions",
    },
  ],

  postStudy: [
    {
      title: "Graduate Route, 18 months from 1 January 2027",
      body: "The Graduate Route lets you stay and work without a sponsor.",
      points: [
        "Applications made on or after 1 January 2027 get 18 months rather than 24.",
        "PhD graduates keep 36 months.",
        "If your course ends near that date, which side of it you apply on changes your plan by six months, so check it early.",
      ],
      source: "UK Home Office immigration rules",
    },
    {
      title: "Skilled Worker, after or instead",
      body:
        "This sponsored work route has a salary threshold and a shortage list, both changed many times, and recent graduates have in the past had a lower threshold. Use the figures for the year you apply, not the year you arrived.",
      source: "UK Home Office immigration rules",
    },
  ],

  insurance: [
    {
      title: "The surcharge is the insurance",
      body:
        "Paying the Immigration Health Surcharge gives you NHS access on the same basis as a UK resident, including GP care and hospital treatment. There is no separate mandatory policy to buy.",
      source: "UK Home Office, NHS",
    },
    {
      title: "What the NHS does not cover",
      body: "The surcharge does not cover everything.",
      points: [
        "Most dental and optical care is charged.",
        "Prescriptions are charged in England.",
        "Travel and contents cover is your own arrangement.",
        "Private top-up cover is optional and, for most students, not worth the premium.",
      ],
      source: "NHS",
    },
  ],

  pitfalls: [
    {
      title: "Treating maintenance as the whole funds requirement",
      body:
        "The requirement is maintenance plus the unpaid tuition on the CAS. Showing only maintenance is the most common money refusal on this route, even for applicants who have the money.",
    },
    {
      title: "A dip in the balance during the 28 days",
      body:
        "One transfer out, one day below the threshold, and the clock restarts. Fund the account, then leave it alone, then apply.",
    },
    {
      title: "Booking IELTS Academic when a SELT was required",
      body:
        "IELTS for UKVI and IELTS Academic are different bookings at different centre types. If a SELT is required, the wrong one costs you both the fee and several weeks.",
    },
    {
      title: "Leaving ATAS until after the CAS request",
      body:
        "Where ATAS applies, the CAS waits for it. Leave it late and the several weeks it takes cost you the intake, for a certificate that is free.",
    },
    {
      title: "Forgetting the surcharge in the cash plan",
      body:
        "£776 per year, paid in full when you apply, on top of the visa fee and separate from the maintenance funds. It is real cash, due when money is tightest.",
    },
    {
      title: "Not declaring cleared backlogs",
      body:
        "Universities publish what they will accept. An offer won by leaving backlogs out is withdrawn when the transcripts arrive, and by then the deposit is usually gone.",
    },
  ],

  faqs: [
    {
      q: "How much money do I actually need to show?",
      a: "Maintenance at £1,529 a month in London or £1,171 outside, for up to nine months, plus whatever tuition your CAS shows as still unpaid. Held for 28 consecutive days without dipping, with a closing balance dated within 31 days of your application.",
    },
    {
      q: "Is the Immigration Health Surcharge part of that?",
      a: "No. It is £776 per year of your visa, paid in full during the online application, and it is separate from both the maintenance funds and the visa fee.",
    },
    {
      q: "Will my three year degree be accepted?",
      a: "For a one year taught Master's, normally yes. Universities set a percentage or CGPA threshold and many keep their own list of recognised Indian institutions, so it is checked per university.",
    },
    {
      q: "Do I need IELTS for UKVI or IELTS Academic?",
      a: "It depends on whether your university requires a Secure English Language Test (SELT). Check before you book, because where a SELT is required the two are not interchangeable.",
    },
    {
      q: "Is the Graduate Route 24 months or 18?",
      a: "24 months for applications made before 1 January 2027, and 18 months on or after it. PhD graduates keep 36 months either way.",
    },
  ],
};
