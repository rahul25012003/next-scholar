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
  headline: "The United Kingdom, with the whole bill on one page",
  lede:
    "A UK Student visa is refused far more often on the money than on the academics, and almost always because one of three stacking figures was missed. This page states all three, the 28 day rule that catches people with the right balance at the wrong time, and the date that shortens the Graduate Route.",
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
        "One year taught postgraduate degrees, September and January intakes, offer to CAS to visa in that order. This is the route almost every Indian applicant we see is on.",
    },
  ],

  tuition: [
    {
      label: "Taught Master's, year one",
      value: "£14,000 to £38,000",
      qualifier:
        "Indicative range across institutions and subjects. Not a quoted price. Business and computing at a high-ranked university sit at the top of it, and MBA programmes sit above it.",
      source: "University published international fee schedules",
    },
    {
      label: "Tuition deposit to hold an offer",
      value: "£2,000 to £5,000, or 50 per cent of year one",
      qualifier:
        "Varies by institution, and it is a condition of the CAS rather than of the offer. Usually non-refundable once the CAS is issued.",
      source: "University offer conditions",
    },
  ],

  living: {
    currency: "GBP",
    symbol: "£",
    qualifier:
      "Monthly ranges for one student sharing accommodation. The London and non-London split is not a style of living, it is a different maintenance requirement in the immigration rules.",
    source:
      "University accommodation offices, Office for National Statistics rent data, and published Home Office maintenance rates",
    cities: [
      {
        slug: "london",
        name: "London",
        note:
          "The immigration rules treat London separately, and so does the rent. Institution location, not campus address, decides which maintenance rate applies to you.",
        lines: [
          { id: "rent", label: "Rent, shared flat or hall", low: 900, high: 1500 },
          { id: "food", label: "Groceries", low: 180, high: 280 },
          {
            id: "transport",
            label: "Transport, 18+ Student Oyster",
            low: 90,
            high: 140,
            note: "The 18+ Student Oyster photocard gives 30 per cent off travelcards and is applied for after enrolment.",
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
          "Large city universities outside London, where the maintenance requirement and the actual rent are both materially lower.",
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
        "A statutory minimum in the immigration rules, not an estimate of living costs. Nine months is the cap, so the maximum on this line is £13,761.",
      source: "UKVI Student route guidance, Appendix Finance",
      note:
        "London means the institution is inside Greater London. A campus outside the boundary can change which rate applies, so it is checked per institution.",
    },
    {
      label: "Maintenance funds, courses outside London",
      value: "£1,171 per month, up to nine months",
      qualifier:
        "The same statutory minimum outside Greater London. Nine months caps this line at £10,539.",
      source: "UKVI Student route guidance, Appendix Finance",
    },
    {
      label: "Outstanding tuition, on top of maintenance",
      value: "The unpaid balance of year one, as printed on your CAS",
      qualifier:
        "Added to the maintenance figure, not included in it. A deposit already paid is deducted only if the CAS records it.",
      source: "UKVI Student route guidance, Appendix Finance",
      note:
        "This is the single most common miscalculation on a UK application: the maintenance figure is treated as the whole requirement, and the tuition balance on the CAS is not added to it.",
    },
    {
      label: "The 28 consecutive day rule",
      value: "Funds held for 28 consecutive days",
      qualifier:
        "The balance must not drop below the required amount on any day in a 28 day period, and the closing balance date must be within 31 days of the visa application date.",
      source: "UKVI Student route guidance, Appendix Finance",
      note:
        "A transfer that dips the balance for a single day restarts the 28 days. Money arriving from a relative needs to be in the account, settled, before the clock starts, and if the account is not yours the relationship evidence rules apply.",
    },
    {
      label: "Where the funds may sit",
      value: "A personal or parental account, or an official financial sponsor letter",
      qualifier:
        "Parental funds need the birth certificate linking you and a signed letter of consent. Some account types, including certain investment and pension products, are not accepted at all.",
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
        "Paid in full up front for the whole visa length, not annually. A 12 month course with the standard four month post-course grant is charged for the longer period, so the sum is usually above one year's figure.",
      source: "UK Home Office, Immigration Health Surcharge",
      note:
        "This is a real cash requirement at application time and it is not part of the maintenance funds calculation. It buys NHS access on the same terms as a UK resident.",
    },
    {
      label: "TB test certificate",
      value: "₹3,000 to ₹6,000",
      qualifier:
        "Clinic pricing at a Home Office approved centre, not a government fee. Mandatory for applicants resident in India for a course longer than six months.",
      source: "UK Home Office approved TB clinic list",
    },
    {
      label: "Priority visa service",
      value: "£500, optional",
      qualifier:
        "Buys a faster decision, not a better one. Worth it only when a specific start date is genuinely at risk.",
      source: "UK Home Office fee schedule",
    },
    {
      label: "ATAS certificate",
      value: "No fee",
      qualifier:
        "Free, but it takes weeks and is required before the CAS for certain programmes. See the academic section.",
      source: "Foreign, Commonwealth and Development Office",
    },
  ],

  language: [
    {
      name: "IELTS for UKVI (Academic)",
      accepted:
        "A Secure English Language Test. Required where the university relies on the Home Office SELT list rather than on its own assessment. Component minimums, usually 5.5 or 6.0, matter as much as the overall band.",
      validity: "Two years from the test date.",
      note:
        "This is a different booking from IELTS Academic, sat at a different centre type, and the two are not interchangeable when a SELT is required. Booking the wrong one is a common and expensive mistake, because the retake costs both the fee and the calendar.",
      source: "UKVI approved SELT provider list",
    },
    {
      name: "IELTS Academic",
      accepted:
        "Accepted by most universities for admission, where the institution assesses language itself rather than requiring a SELT. Not valid where a SELT is specified.",
      validity: "Two years from the test date.",
      source: "University admission requirements",
    },
    {
      name: "PTE Academic (UKVI), TOEFL iBT, Duolingo",
      accepted:
        "Acceptance varies by institution, and by whether a SELT is required. TOEFL is accepted by many universities and not by all. Duolingo acceptance is institution-specific and narrower.",
      validity: "Two years, typically.",
      source: "University admission requirements, and the UKVI SELT list",
    },
    {
      name: "Class XII English, or a Medium of Instruction letter",
      accepted:
        "Some universities waive the language test for Indian applicants on the strength of Class XII English marks or an MOI letter. It is an institutional waiver, not a Home Office one, and it does not apply where a SELT is required.",
      validity: "Institution-specific.",
      source: "University admission requirements",
    },
  ],

  academic: [
    {
      title: "A three year Indian Bachelor's is normally accepted",
      body:
        "Unlike Germany, the UK generally accepts a three year Indian Bachelor's degree for entry to a one year taught Master's. Entry is stated as a percentage or CGPA threshold, commonly 55 to 65 per cent depending on the university's tier and its own list of recognised Indian institutions.",
      source: "University admission requirements",
      appliesTo: "Master's applicants",
    },
    {
      title: "Backlogs and arrears are asked about explicitly",
      body:
        "Most UK universities state a maximum number of backlogs they will consider, often somewhere between five and fifteen, and they mean cleared backlogs. This is one of the few places where an honest count improves your outcome: a university that would accept it is not the same as a university that discovers it later, and the second one withdraws the offer.",
      source: "University admission requirements",
      appliesTo: "Applicants with academic arrears",
    },
    {
      title: "ATAS, for certain STEM programmes",
      body:
        "The Academic Technology Approval Scheme covers named postgraduate subjects with security relevance, mostly in engineering, physics, materials and computing. It is free and it takes several weeks. Where required, the university cannot issue your CAS without it, so it sits before the CAS in the sequence and not beside it.",
      source: "Foreign, Commonwealth and Development Office",
      appliesTo: "Applicants to ATAS-listed subjects",
    },
    {
      title: "The CAS is a dated dependency, not a document",
      body:
        "A Confirmation of Acceptance for Studies is issued after you accept the offer and meet its conditions, including the deposit. It expires, and the visa application has to be made inside that window. Every date after the offer hangs off the CAS date, which is why the deposit conversation happens at shortlist rather than at offer.",
      source: "UKVI Student route guidance",
      appliesTo: "All applicants",
    },
    {
      title: "The credibility interview",
      body:
        "UKVI may call you for a credibility interview, by video, asking why this course, why this university, how it is funded and what you intend afterwards. It is not a trick. Refusals here come from an applicant who cannot describe their own course, which is a preparation problem and is the one we rehearse.",
      source: "UKVI Student route guidance",
      appliesTo: "Applicants selected for interview",
    },
  ],

  intakes: [
    {
      name: "September intake",
      applicationDeadline: "2027-06-30",
      deadlineNote:
        "Most universities have no single hard deadline and close programmes as they fill, which functions as an earlier deadline than the published one. Competitive courses at high-ranked universities can close by February. The practical window opens roughly a year ahead.",
      teachingStarts: "2027-09-20",
      status: "not-yet-open",
      statusAsOf: "2026-09-03",
      source: "University application pages",
    },
    {
      name: "January intake",
      applicationDeadline: "2027-10-31",
      deadlineNote:
        "A smaller intake, with fewer programmes and fewer scholarships, but a real option where the September visa timeline has already slipped.",
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
        "Decide first whether any target university requires a SELT, because that decides which IELTS you book. Shortlist against the university's own recognised-institution list and its backlog policy.",
    },
    {
      monthsBefore: [10, 7],
      title: "Applications and references",
      detail:
        "Personal statement written by you. References requested early, since a slow referee is the most common self-inflicted delay. ATAS started now if your subject needs it.",
    },
    {
      monthsBefore: [7, 5],
      title: "Offers, then the deposit decision",
      detail:
        "Compare offers including the deposit terms and what is refundable. Accepting means paying, and the CAS follows the payment.",
    },
    {
      monthsBefore: [5, 4],
      title: "Start the 28 day funds clock",
      detail:
        "This is the step people leave too late. The balance has to sit untouched for 28 consecutive days, and the closing balance has to be within 31 days of the application. Work backwards from the intended application date.",
    },
    {
      monthsBefore: [4, 3],
      title: "CAS, TB test, then apply",
      detail:
        "CAS issued, TB certificate obtained at an approved clinic, IHS paid, biometrics booked. Apply inside the CAS window.",
    },
    {
      monthsBefore: [3, 0],
      title: "Decision, accommodation, travel",
      detail:
        "Standard processing is around three weeks from India and is not guaranteed. Accommodation applications for university halls usually close well before this point, so they run in parallel.",
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
        "Around three weeks is the standard service from India, and it is a target rather than a guarantee. A credibility interview, if called, happens in this window.",
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
        "The UK has been moving from physical biometric residence permits to digital eVisas. Which one applies depends on when you apply, and it is confirmed in your decision letter rather than assumed.",
      blocks: "Proving your status to a landlord, a bank or an employer.",
      source: "UK Home Office",
    },
    {
      id: "enrol",
      title: "Enrol and complete right-to-study checks",
      detail:
        "The university reports enrolment to the Home Office as a sponsor duty. Missing it is a compliance problem, not an administrative one.",
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
        "Students sponsored for a degree-level course at a higher education provider may work 20 hours a week during term time and full-time outside it. The 20 hours is a hard weekly cap, not an average across a month, and it is one of the conditions most often breached by accident.",
      source: "UKVI Student route conditions",
    },
    {
      title: "What is prohibited outright",
      body:
        "No self-employment, no business activity, no professional sportsperson or coach roles, and no permanent full-time post. Breaching a work condition puts your visa and any future application at risk.",
      source: "UKVI Student route conditions",
    },
    {
      title: "Placements and internships",
      body:
        "A work placement that forms an assessed part of your course is treated differently and is capped as a proportion of the course. The university's international office confirms the position for your specific programme.",
      source: "UKVI Student route conditions",
    },
  ],

  postStudy: [
    {
      title: "Graduate Route, 18 months from 1 January 2027",
      body:
        "The Graduate Route allows you to stay and work without a sponsor. For applications made on or after 1 January 2027 the window is 18 months rather than 24. PhD graduates keep 36 months. If your course finishes near that date, which side of it your application falls on changes your plan by six months, so it is worth establishing early.",
      source: "UK Home Office immigration rules",
    },
    {
      title: "Skilled Worker, after or instead",
      body:
        "The sponsored work route has a salary threshold and a shortage list, both of which have changed repeatedly. Recent graduates have historically had a lower threshold. Read the figures for the year you are applying in, not the year you arrived.",
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
      body:
        "Most dental and optical care is charged, prescriptions are charged in England, and travel or contents cover is your own arrangement. Private top-up cover is optional and, for most students, not worth the premium.",
      source: "NHS",
    },
  ],

  pitfalls: [
    {
      title: "Treating maintenance as the whole funds requirement",
      body:
        "Maintenance plus the unpaid tuition on the CAS is the requirement. Showing only the maintenance figure is the most common financial refusal on this route, and it happens to applicants who genuinely have the money.",
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
        "Where ATAS applies, the CAS waits for it. Several weeks of ATAS processing discovered late is an intake missed on a free certificate.",
    },
    {
      title: "Forgetting the surcharge in the cash plan",
      body:
        "£776 per year, paid in full at application, on top of the visa fee and independent of the maintenance funds. It is a real cash outflow at the tightest moment of the plan.",
    },
    {
      title: "Not declaring cleared backlogs",
      body:
        "Universities publish what they will accept. An offer obtained by omission is withdrawn when the transcripts arrive, and by then the deposit is usually gone.",
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
      a: "It depends on whether your university requires a Secure English Language Test. That question is answered before you book, because the two are not interchangeable when a SELT is required.",
    },
    {
      q: "Is the Graduate Route 24 months or 18?",
      a: "24 months for applications made before 1 January 2027, and 18 months on or after it. PhD graduates keep 36 months either way.",
    },
  ],
};
