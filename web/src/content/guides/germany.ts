import type { DestinationGuide } from "./types";

/**
 * Germany.
 *
 * Two corrections live in this file that the site previously published wrong or
 * not at all, and they are the reason it exists:
 *
 *  - Tuition. "No tuition fee" was false for one federal state. Baden-
 *    Wurttemberg has charged non-EU students EUR 1,500 per semester since the
 *    2017/18 winter semester, which is EUR 6,000 across a four semester
 *    Master's. Stuttgart, Karlsruhe (KIT), Heidelberg, Freiburg and Mannheim all
 *    sit in that state, and they are exactly the universities an engineering
 *    applicant from Bengaluru shortlists first.
 *
 *  - dMAT. A new mandatory test for the precise population this business
 *    serves, and the site did not mention it.
 */
export const germany: DestinationGuide = {
  slug: "germany",
  country: "Germany",
  flagCode: "de",
  currency: "EUR",
  symbol: "€",
  headline: "Germany, without the sentence everyone repeats",
  lede:
    "Germany is often called free. For most of the country that is true of tuition only, and Baden-Wurttemberg and TUM charge non-EU students tuition too. This guide covers the recognition question that decides more Indian applications than the language test, and the visa steps. Every cost, including the money the consulate wants to see, is on the costs page.",
  verification: {
    statedOn: "2026-09-03",
    checkedBy: null,
    checkedOn: null,
    cadence:
      "Re-read in full at source each quarter, and immediately whenever the blocked account rate or the APS process changes.",
  },

  routes: [
    {
      slug: "germany-public",
      name: "Public universities",
      destinationSlug: "germany-public",
      summary:
        "No tuition fee outside Baden-Wurttemberg, and a semester contribution everywhere.",
    },
    {
      slug: "germany-private",
      name: "Private universities",
      destinationSlug: "germany-private",
      summary:
        "Tuition is charged, more programmes are taught in English, and admission is usually faster with less paperwork. These universities pay agents, and our commission on them is above the category average, which we tell you in writing before any shortlist.",
    },
  ],

  tuition: [
    {
      label: "Public university, most federal states",
      value: "No tuition fee",
      qualifier:
        "Applies to state universities in most federal states. Baden-Wurttemberg charges non-EU students, and Bavarian law lets TUM do the same, which it has since the 2024/25 winter semester. Does not include the semester contribution, which every student pays.",
      source: "Federal state higher education acts, per state",
    },
    {
      label: "Public university, Baden-Wurttemberg",
      value: "€1,500 per semester",
      qualifier:
        "Statutory fee for non-EU students, in force since the 2017/18 winter semester. €3,000 a year, €6,000 across a four semester Master's.",
      source: "Landeshochschulgebuhrengesetz, Baden-Wurttemberg",
      note:
        "Universities in this state include Stuttgart, Karlsruhe (KIT), Heidelberg, Freiburg, Tubingen, Konstanz and Mannheim. A second degree costs €650 per semester instead of €1,500. Some universities waive the fee for certain scholarship holders; check with the university, do not assume.",
    },
    {
      label: "Semester contribution",
      value: "€100 to €400 per semester",
      qualifier:
        "Typical range at public universities, and not a tuition fee. It funds the student union and administration, and at most universities includes a regional public transport ticket.",
      source: "University student administration offices, per institution",
      note:
        "The transport ticket is often worth more than the whole contribution, so this is not a fee to avoid.",
    },
    {
      label: "Private university",
      value: "€10,000 to €25,000 per year",
      qualifier:
        "Indicative range for English-taught Master's programmes, not a quoted price. The programme's own fee schedule decides.",
      source: "Institution fee schedules",
    },
  ],

  living: {
    currency: "EUR",
    symbol: "€",
    qualifier:
      "Monthly ranges for one student in shared housing. Rent is the biggest cost and varies more by city than everything else combined, so choose the city first.",
    source:
      "Deutsches Studentenwerk social survey, city Studentenwerk rent reports, and published statutory rates for insurance and the broadcast levy",
    cities: [
      {
        slug: "munich",
        name: "Munich",
        note:
          "The most expensive student city in Germany. A shared room can take more than half the blocked account monthly allowance.",
        lines: [
          { id: "rent", label: "Rent, shared flat or hall", low: 550, high: 900 },
          { id: "food", label: "Groceries", low: 200, high: 280 },
          {
            id: "insurance",
            label: "Health insurance, statutory student rate",
            low: 130,
            high: 145,
            note: "Statutory rate, not an estimate. See the insurance section.",
          },
          { id: "transport", label: "Transport beyond the semester ticket", low: 0, high: 30 },
          { id: "phone", label: "Phone and internet", low: 20, high: 40 },
          {
            id: "levy",
            label: "Broadcast levy (Rundfunkbeitrag)",
            low: 19,
            high: 19,
            note: "€18.36 per household per month, split between flatmates, not charged per person.",
          },
          { id: "personal", label: "Personal, clothing, leisure", low: 80, high: 200 },
          { id: "books", label: "Books and course materials", low: 20, high: 50 },
          { id: "travel", label: "Flights home, spread monthly", low: 40, high: 80, optional: true },
        ],
      },
      {
        slug: "berlin",
        name: "Berlin",
        note:
          "Cheaper than Munich on paper, but rooms are hard to find. Start the search months before you arrive.",
        lines: [
          { id: "rent", label: "Rent, shared flat or hall", low: 450, high: 750 },
          { id: "food", label: "Groceries", low: 180, high: 260 },
          { id: "insurance", label: "Health insurance, statutory student rate", low: 130, high: 145 },
          { id: "transport", label: "Transport beyond the semester ticket", low: 0, high: 30 },
          { id: "phone", label: "Phone and internet", low: 20, high: 40 },
          { id: "levy", label: "Broadcast levy (Rundfunkbeitrag)", low: 19, high: 19 },
          { id: "personal", label: "Personal, clothing, leisure", low: 80, high: 180 },
          { id: "books", label: "Books and course materials", low: 20, high: 50 },
          { id: "travel", label: "Flights home, spread monthly", low: 40, high: 80, optional: true },
        ],
      },
      {
        slug: "aachen",
        name: "Aachen, Dresden, Magdeburg and similar",
        note:
          "Smaller university cities, several with strong engineering faculties, at close to the lowest rents in the country.",
        lines: [
          { id: "rent", label: "Rent, shared flat or hall", low: 300, high: 480 },
          { id: "food", label: "Groceries", low: 170, high: 240 },
          { id: "insurance", label: "Health insurance, statutory student rate", low: 130, high: 145 },
          { id: "transport", label: "Transport beyond the semester ticket", low: 0, high: 20 },
          { id: "phone", label: "Phone and internet", low: 20, high: 40 },
          { id: "levy", label: "Broadcast levy (Rundfunkbeitrag)", low: 19, high: 19 },
          { id: "personal", label: "Personal, clothing, leisure", low: 70, high: 150 },
          { id: "books", label: "Books and course materials", low: 20, high: 50 },
          { id: "travel", label: "Flights home, spread monthly", low: 40, high: 80, optional: true },
        ],
      },
    ],
  },

  funds: [
    {
      label: "Blocked account, annual",
      value: "€11,904",
      qualifier:
        "The legal minimum a student visa applicant must show for the first year. It is tied to the BAfoG maximum grant and changes when that does.",
      source: "German Federal Foreign Office, Auswartiges Amt",
      note:
        "The full amount is deposited before the visa appointment and released to you monthly after arrival.",
    },
    {
      label: "Blocked account, monthly release",
      value: "€992",
      qualifier:
        "The maximum the bank releases each month. It is a ceiling, not a budget: in Munich the rent alone can exceed it.",
      source: "German Federal Foreign Office, Auswartiges Amt",
    },
    {
      label: "Blocked account opening and handling",
      value: "€50 to €150 once, plus a monthly fee at some providers",
      qualifier:
        "Provider pricing, not a legal figure. Compare the total cost over your whole stay, not just the opening fee.",
      source: "Blocked account provider published pricing",
    },
    {
      label: "Alternative to a blocked account",
      value: "A German resident's declaration of liability, or a recognised scholarship",
      qualifier:
        "Accepted in place of the deposit. Not a reduction of the requirement, a different way of meeting it.",
      source: "German Federal Foreign Office, Auswartiges Amt",
    },
  ],

  visaFees: [
    {
      label: "National visa (type D) application fee",
      value: "€75",
      qualifier:
        "Paid at the mission in India, in rupees at the mission's own rate. Non-refundable if the application is refused.",
      source: "German missions in India",
    },
    {
      label: "APS certificate",
      value: "€180 equivalent, paid in rupees",
      qualifier: "Mandatory for Indian applicants. One certificate, reused across applications.",
      source: "APS India",
    },
    {
      label: "dMAT",
      value: "€150",
      qualifier:
        "Separate from the APS fee, not included in it. See the academic requirements section.",
      source: "APS India",
    },
    {
      label: "uni-assist, first application",
      value: "€75",
      qualifier:
        "Per application cycle for the first course, then €30 for each further course in the same cycle.",
      source: "uni-assist e.V.",
    },
    {
      label: "Residence permit after arrival",
      value: "€100 to €110",
      qualifier:
        "Charged by the local foreigners' office when the entry visa is converted to a residence permit.",
      source: "Local Auslanderbehorde fee schedules",
    },
  ],

  language: [
    {
      name: "TestDaF",
      accepted:
        "TDN 4 in all four sections for most German-taught programmes, TDN 5 for some. TDN 3 is below the usual threshold.",
      validity: "No expiry stated by the test provider. Universities may impose their own.",
      source: "TestDaF Institut, and university admission regulations",
    },
    {
      name: "DSH",
      accepted:
        "DSH-2 is the normal requirement. DSH-3 for a few programmes, DSH-1 is not usually sufficient.",
      validity: "No expiry. Taken in Germany, usually at the admitting university.",
      note:
        "DSH is normally taken in Germany, so it suits someone arriving on a language course rather than applying from India.",
      source: "University language centres",
    },
    {
      name: "telc Deutsch C1 Hochschule",
      accepted: "C1 Hochschule is accepted for German-taught degree admission at most universities.",
      validity: "No expiry stated. Confirm with the university.",
      source: "telc gGmbH",
    },
    {
      name: "Goethe-Zertifikat",
      accepted:
        "C2 is accepted broadly, C1 by many universities. B2 alone is rarely enough for a German-taught degree.",
      validity: "No expiry stated. Some universities will not accept a certificate older than two years.",
      source: "Goethe-Institut",
    },
    {
      name: "IELTS or TOEFL, for English-taught programmes",
      accepted:
        "IELTS 6.5 overall is the common threshold, TOEFL iBT 88 to 90. Individual programmes set their own and some are higher.",
      validity: "Two years from the test date.",
      note:
        "An English-taught Master's still means daily life in German. A2 to B1 makes a part-time job, a lease and a doctor's appointment possible, though no university requires it.",
      source: "Programme admission regulations",
    },
  ],

  academic: [
    {
      title: "APS certificate is mandatory, and it is the first clock to start",
      body:
        "Every Indian applicant needs an APS certificate before a university or visa application is processed.",
      points: [
        "It certifies that your documents are genuine and your degree is what it says it is.",
        "Processing takes weeks.",
        "It is issued once and reused for every application, so start it before your shortlist is finished.",
      ],
      source: "APS India",
      appliesTo: "All applicants holding Indian qualifications",
    },
    {
      title: "dMAT is mandatory from the summer semester 2027 intake",
      body: "The APS India Digital Master Test is a new, separate, standardised test.",
      points: [
        "Required from the summer semester 2027 intake for Indian Bachelor's degree holders applying for a Master's in Engineering, Commerce, Business, Finance or Economics.",
        "It costs €150 on top of the APS fee.",
        "It is not pass or fail: universities read your score report alongside your transcript.",
      ],
      source: "APS India",
      appliesTo:
        "Indian Bachelor's holders applying for a Master's in Engineering, Commerce, Business, Finance or Economics, from summer semester 2027",
    },
    {
      title: "dMAT exemptions, including the transitional one",
      body: "You do not sit the dMAT if any of these apply.",
      points: [
        "You already hold a Master's degree.",
        "Your subject is outside the listed groups.",
        "Your Bachelor's is from outside India.",
        "Transitional exemption: you registered with or submitted documents to APS India before 29 June 2026. That date has passed, so check the date on your own APS record before you plan around it.",
      ],
      source: "APS India",
      appliesTo: "Applicants who would otherwise be in scope",
    },
    {
      title: "anabin recognition decides whether your degree counts at all",
      body:
        "Germany does not treat all foreign degrees as equivalent, so check anabin before building a shortlist.",
      points: [
        "anabin rates your institution H+, H+/- or H-, and rates your degree separately.",
        "H+ institution with a recognised degree: you are directly eligible.",
        "H+/-: the university decides case by case.",
        "H-: the degree is not recognised as equivalent, and the route is different.",
      ],
      source: "anabin, Zentralstelle fur auslandisches Bildungswesen",
      appliesTo: "All applicants holding Indian qualifications",
    },
    {
      title: "Three year versus four year Bachelor's",
      body:
        "A German Bachelor's is 180 ECTS over three years, and many Indian three year Bachelor's degrees match it.",
      points: [
        "Engineering Master's programmes are usually built on a four year, 240 ECTS engineering Bachelor's.",
        "A three year BSc or BCA can fall short on technical and mathematics credits, even where the overall length is accepted.",
        "So the answer is per programme, not per country, checked against that programme's module requirements.",
      ],
      source: "Programme admission regulations, and anabin equivalence statements",
      appliesTo: "Master's applicants",
    },
    {
      title: "ECTS and subject credits are how Master's admission is actually decided",
      body: "German Master's admission is largely arithmetic on your transcript.",
      points: [
        "It counts total credits, core subject credits, mathematics credits, and credits in the technical modules the programme lists as prerequisites.",
        "A programme that asks for 30 ECTS in mathematics and finds 18 rejects you on that, whatever your overall grade.",
        "Missing prerequisites can sometimes be made up as conditional modules after admission. Ask the programme rather than assume.",
      ],
      source: "Programme admission regulations",
      appliesTo: "Master's applicants",
    },
    {
      title: "Grade conversion, and who actually decides it",
      body:
        "Your Indian percentage or CGPA is converted to the German 1.0 to 4.0 scale, most commonly with the Modified Bavarian Formula.",
      points: [
        "Our calculator shows you the arithmetic on your own numbers, but we cannot decide the result.",
        "The university's admissions office or uni-assist does the official conversion.",
        "Some universities use a different method or apply a subject-specific correction.",
      ],
      source: "Kultusministerkonferenz, Modified Bavarian Formula",
      appliesTo: "All applicants",
    },
    {
      title: "uni-assist or direct: a real choice, not a formality",
      body:
        "Some universities take applications only through uni-assist, some only directly, and some accept both, so check each one before its application window opens.",
      points: [
        "uni-assist pre-checks your documents and charges per application.",
        "That helps if your file is unusual, and is an avoidable cost and delay if it is not.",
        "Where both routes are open, applying directly is usually faster.",
      ],
      source: "uni-assist e.V., and university application pages",
      appliesTo: "All applicants",
    },
  ],

  intakes: [
    {
      name: "Winter semester",
      applicationDeadline: "2027-07-15",
      deadlineNote:
        "15 July is the common winter deadline, but a large minority of programmes close earlier, some as early as 31 May. The programme's own deadline is the one that counts.",
      teachingStarts: "2027-10-01",
      status: "not-yet-open",
      statusAsOf: "2026-09-03",
      source: "uni-assist e.V., and programme application pages",
    },
    {
      name: "Summer semester",
      applicationDeadline: "2027-01-15",
      deadlineNote:
        "15 January is the common deadline. Fewer programmes admit in summer than in winter, and engineering Master's intakes in particular are often winter-only.",
      teachingStarts: "2027-04-01",
      status: "not-yet-open",
      statusAsOf: "2026-09-03",
      source: "uni-assist e.V., and programme application pages",
    },
  ],

  timeline: [
    {
      monthsBefore: [18, 14],
      title: "APS, and the recognition check",
      detail:
        "Start APS and check your institution and degree on anabin. If the dMAT applies to you, note whether your APS registration was before or after the transitional exemption date.",
    },
    {
      monthsBefore: [14, 11],
      title: "Language and shortlist",
      detail:
        "Sit the language test the programmes need. Build the shortlist against ECTS and subject prerequisites, not against rankings.",
    },
    {
      monthsBefore: [11, 8],
      title: "Applications",
      detail:
        "Apply through uni-assist or directly, as each university requires. Write a letter of motivation for each programme, not one reused across nine.",
    },
    {
      monthsBefore: [8, 6],
      title: "Admission, then the blocked account",
      detail:
        "Once the admission letter arrives, open and fund the blocked account and arrange the health insurance confirmation.",
    },
    {
      monthsBefore: [6, 3],
      title: "The visa appointment is the binding constraint",
      detail:
        "Appointment slots at the German missions in India are the most common reason a confirmed admission does not become an October start. Book as soon as the admission letter allows, before the rest of your file is finished.",
    },
    {
      monthsBefore: [3, 0],
      title: "Accommodation, flights, arrival",
      detail:
        "Accommodation search, flights, and the arrival sequence: city registration, insurance activation, bank account, residence permit.",
    },
  ],

  visaSteps: [
    {
      id: "aps",
      title: "APS certificate issued",
      detail:
        "Mandatory for Indian applicants. Weeks of processing. Reused across every application.",
      blocks: "University applications and the visa application both stop without it.",
      source: "APS India",
    },
    {
      id: "dmat",
      title: "dMAT sat, if it applies to you",
      detail:
        "Required from summer semester 2027 for the listed subject groups. €150, separate from the APS fee.",
      blocks: "The university application, for applicants in scope.",
      source: "APS India",
    },
    {
      id: "admission",
      title: "Admission letter received",
      detail:
        "A conditional admission is not always enough for the visa. Check which one your mission accepts.",
      blocks: "The visa appointment cannot usually be attended without it.",
      source: "German missions in India",
    },
    {
      id: "blocked",
      title: "Blocked account opened and funded with €11,904",
      detail: "The full year deposited before the appointment. Opening plus transfer takes one to three weeks.",
      blocks: "The visa application.",
      source: "German Federal Foreign Office",
    },
    {
      id: "insurance",
      title: "Health insurance cover confirmed",
      detail:
        "Travel cover for the period before enrolment, plus a statutory or private policy from the enrolment date. The mission wants evidence of both.",
      blocks: "The visa application, and enrolment at the university.",
      source: "German missions in India",
    },
    {
      id: "appointment",
      title: "Visa appointment booked",
      detail:
        "Waiting times at the German missions in India run from weeks to several months, depending on the city and the season. This step decides whether an October start is realistic.",
      blocks: "Everything after it.",
      source: "German missions in India",
    },
    {
      id: "decision",
      title: "Decision, then travel",
      detail:
        "Processing after the appointment is commonly six to twelve weeks, with no guaranteed window. Do not book a flight before the decision.",
      source: "German missions in India",
    },
  ],

  visaDocuments: [
    {
      id: "form",
      title: "Completed national visa application form",
      detail: "Signed, with the declaration on the consequences of false information.",
      source: "German missions in India",
    },
    {
      id: "passport",
      title: "Passport, plus copies of the data page",
      detail: "Validity beyond the intended stay, with blank pages for the visa.",
      source: "German missions in India",
    },
    {
      id: "photos",
      title: "Biometric photographs",
      detail:
        "To the mission's stated specification, which is not the same as an Indian passport photograph.",
      source: "German missions in India",
    },
    {
      id: "admission",
      title: "University admission letter",
      detail: "Or, where accepted, a conditional admission or proof of application.",
      source: "German missions in India",
    },
    { id: "aps-cert", title: "APS certificate", detail: "Original plus copies.", source: "APS India" },
    {
      id: "blocked-cert",
      title: "Blocked account confirmation",
      detail: "Showing €11,904 deposited and the monthly release amount.",
      source: "German Federal Foreign Office",
    },
    {
      id: "transcripts",
      title: "Degree certificates and transcripts",
      detail:
        "All semesters, individually. A missing semester transcript is one of the most common APS and application rejections.",
      source: "APS India",
    },
    {
      id: "language",
      title: "Language certificate",
      detail: "The one the programme requires, at the level it requires.",
      source: "Programme admission regulations",
    },
    {
      id: "cv",
      title: "CV, Europass format preferred",
      detail:
        "German admissions offices and employers expect the Europass layout: newest first, clear dates, no photograph unless asked.",
      source: "Europass, European Commission",
    },
    {
      id: "lom",
      title: "Letter of motivation",
      detail:
        "Not an SOP. A German letter of motivation is shorter, programme-specific, and argues module fit rather than telling a life story.",
      source: "Programme admission regulations",
    },
    {
      id: "insurance-doc",
      title: "Health insurance evidence",
      detail: "Travel cover for the pre-enrolment period, and the policy from enrolment.",
      source: "German missions in India",
    },
  ],

  postArrival: [
    {
      id: "anmeldung",
      title: "City registration (Anmeldung)",
      detail:
        "Register your address at the local Burgeramt, generally within two weeks of moving in. The confirmation is needed for a bank account, a tax ID and the residence permit, so it comes first.",
      blocks: "Bank account, residence permit, sometimes a phone contract.",
      source: "Local Burgeramt",
    },
    {
      id: "insurance-activate",
      title: "Activate statutory health insurance",
      detail:
        "Enrolment at the university requires the insurer's confirmation, and the insurer requires your address registration.",
      blocks: "Enrolment.",
      source: "Statutory health insurers",
    },
    {
      id: "enrol",
      title: "Enrol at the university",
      detail:
        "Pay the semester contribution, receive the student card and, at most universities, the transport ticket.",
      source: "University student administration",
    },
    {
      id: "bank",
      title: "Open a current account and link the blocked account",
      detail: "The monthly release from the blocked account is paid into it.",
      source: "Blocked account provider",
    },
    {
      id: "permit",
      title: "Apply for the residence permit",
      detail:
        "The entry visa is temporary. Apply at the Auslanderbehorde before it expires; in busy cities, just getting the appointment takes weeks.",
      blocks: "Legal residence after the entry visa expires.",
      source: "Local Auslanderbehorde",
    },
    {
      id: "levy",
      title: "Register for the broadcast levy",
      detail: "€18.36 per household per month, not per person. Flatmates split one registration.",
      source: "Rundfunkbeitrag",
    },
  ],

  workRights: [
    {
      title: "140 full days or 280 half days per year",
      body: "Non-EU students may work 140 full days or 280 half days in a calendar year.",
      points: [
        "Raised from 120 and 240 in March 2024.",
        "A half day is up to four hours, and full and half days can be mixed within the yearly allowance.",
        "Going over it is a residence permit problem, not a payroll one.",
      ],
      source: "German Residence Act, Aufenthaltsgesetz",
    },
    {
      title: "Student assistant work is counted separately",
      body:
        "Academic assistant jobs at your own university generally do not count towards the 140 days. Confirm this with the foreigners' office, not a forum post.",
      source: "Local Auslanderbehorde",
    },
    {
      title: "Self-employment needs explicit permission",
      body:
        "Freelancing is not covered by the student work allowance and requires separate permission.",
      source: "Local Auslanderbehorde",
    },
  ],

  postStudy: [
    {
      title: "18 month residence permit to look for work",
      body:
        "After graduating you may apply for an 18 month residence permit to look for work related to your qualification, and you may work without restriction while on it. It runs from the date your result is confirmed, not the date you apply.",
      source: "German Residence Act, section 20",
    },
    {
      title: "Then the EU Blue Card, or a work permit",
      body:
        "Once employed, the usual route is the EU Blue Card. Its salary threshold is lower for shortage occupations and lower again for recent graduates, and it changes every year, so use the figure for the year you apply.",
      source: "Federal Office for Migration and Refugees, BAMF",
    },
  ],

  insurance: [
    {
      title: "Statutory versus private, and who may choose",
      body: "You need German health insurance to enrol.",
      points: [
        "Most students under 30 take statutory cover at the student rate, roughly €130 to €145 a month including the long-term care contribution.",
        "Private cover is cheaper for some applicants.",
        "Leaving the statutory system as a student is hard to reverse, which matters if you plan to stay and work in Germany afterwards.",
      ],
      source: "Statutory health insurers, and SGB V",
    },
    {
      title: "Over 30, or on a preparatory course",
      body:
        "The student rate generally ends at 30, or after the 14th semester. After that, statutory cover costs the much higher voluntary member rate, and private cover becomes the usual route. Language course and Studienkolleg students are often outside the student rate too.",
      source: "Statutory health insurers",
      appliesTo: "Applicants aged 30 or over, and preparatory course students",
    },
    {
      title: "Travel cover for the gap before enrolment",
      body:
        "Statutory cover starts at enrolment. The days between arrival and enrolment need separate travel health cover, and the mission asks for evidence of it at the visa appointment.",
      source: "German missions in India",
    },
  ],

  pitfalls: [
    {
      title: "Assuming Germany is free, then finding Baden-Wurttemberg",
      body:
        "€1,500 per semester is €6,000 across a two year Master's, and it hits the universities an engineering applicant shortlists first. That is no reason to avoid them, but you should know about the fee before you accept an offer, not after.",
    },
    {
      title: "Names that do not match across documents",
      body:
        "APS rejects mismatches, such as an initial spelt out on the passport but not on the transcript, or a middle name on one and not the other. Fix them before you submit, because fixing them afterwards costs a full processing cycle.",
    },
    {
      title: "A missing semester transcript",
      body:
        "Submit every semester's transcript separately, not a consolidated statement. This is one of the most common APS document failures, and it is entirely avoidable.",
    },
    {
      title: "Starting the visa appointment search late",
      body:
        "Admission in June and an appointment in November means a missed intake, even with every document in order. Book on the day the admission letter allows it.",
    },
    {
      title: "One letter of motivation, sent to nine programmes",
      body:
        "A German letter of motivation argues your fit with the programme's own modules, and that is the part being assessed. A reused letter reads as reused.",
    },
    {
      title: "Counting the blocked account monthly release as a budget",
      body:
        "€992 a month is a limit on withdrawals, not an estimate of living costs. In Munich the rent alone can take most of it: plan for that, rather than picking a cheaper city if the programme is right.",
    },
  ],

  faqs: [
    {
      q: "Is Germany actually free?",
      a: "Tuition at public universities is free in most federal states. Baden-Wurttemberg charges non-EU students €1,500 per semester, and TUM in Bavaria has charged non-EU students since the 2024/25 winter semester. Everyone pays a semester contribution of roughly €100 to €400, which usually includes a transport ticket. Private universities charge full tuition.",
    },
    {
      q: "Do I need German if my programme is taught in English?",
      a: "Not for admission. But A2 to B1 German makes a part-time job, a lease, a doctor's appointment and a residence permit appointment much easier, so we recommend it even though no university requires it.",
    },
    {
      q: "Does the dMAT apply to me?",
      a: "If you hold an Indian Bachelor's degree, are applying for a Master's in Engineering, Commerce, Business, Finance or Economics, and your intake is summer semester 2027 or later, then yes, unless an exemption applies. Having registered with APS India before 29 June 2026 is one of those exemptions.",
    },
    {
      q: "Will my three year Bachelor's be accepted?",
      a: "Often yes on length; the real question is subject credits, not years. Engineering Master's programmes built on a four year, 240 ECTS Bachelor's often find a three year degree short on technical and mathematics credits, so we check it per programme.",
    },
    {
      q: "How much commission do you earn on a German public university?",
      a: "Nothing. German public universities do not pay agents. That is why the advisory fee on this route is higher than on the others, and it is stated in writing before you pay anything.",
    },
  ],
};
