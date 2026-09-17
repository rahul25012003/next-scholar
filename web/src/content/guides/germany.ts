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
    "Germany is described everywhere as free. For most of the country that is true of tuition and nothing else, and for one federal state it is not true of tuition either. This page states the exception, the money the consulate wants to see, and the recognition question that decides more Indian applications than the language test does.",
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
        "No tuition fee outside Baden-Wurttemberg, a semester contribution everywhere, and no commission to us from any of them. The advisory fee on this route exists because the university pays us nothing.",
    },
    {
      slug: "germany-private",
      name: "Private universities",
      destinationSlug: "germany-private",
      summary:
        "Tuition charged, English-taught programmes more common, admission usually faster and less document-bound. These institutions pay agents, and our band on them runs above the category average, so the flag appears in writing before a shortlist, not after.",
    },
  ],

  tuition: [
    {
      label: "Public university, most federal states",
      value: "No tuition fee",
      qualifier:
        "Applies to state universities in 15 of the 16 federal states. Does not include the semester contribution, which every student pays.",
      source: "Federal state higher education acts, per state",
    },
    {
      label: "Public university, Baden-Wurttemberg",
      value: "€1,500 per semester",
      qualifier:
        "Statutory fee for non-EU students, in force since the 2017/18 winter semester. €3,000 a year, €6,000 across a four semester Master's.",
      source: "Landeshochschulgebuhrengesetz, Baden-Wurttemberg",
      note:
        "Universities in this state include Stuttgart, Karlsruhe (KIT), Heidelberg, Freiburg, Tubingen, Konstanz and Mannheim. A second degree is charged at €650 per semester rather than €1,500. Some universities waive the fee for specific scholarship holders, which has to be checked at the university, not assumed.",
    },
    {
      label: "Semester contribution",
      value: "€100 to €400 per semester",
      qualifier:
        "Typical range across public universities. Not a tuition fee. It funds the student union and administration, and at most universities it includes a regional public transport ticket.",
      source: "University student administration offices, per institution",
      note:
        "The transport ticket is often worth more than the contribution itself, which is why the figure is not a fee to avoid.",
    },
    {
      label: "Private university",
      value: "€10,000 to €25,000 per year",
      qualifier:
        "Indicative range across English-taught Master's programmes. Not a quoted price. The programme's own fee schedule governs.",
      source: "Institution fee schedules",
    },
  ],

  living: {
    currency: "EUR",
    symbol: "€",
    qualifier:
      "Monthly ranges for one student sharing accommodation. Rent dominates and varies more by city than every other line combined, so the city is chosen first.",
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
          "Cheaper than Munich on paper. The constraint is availability rather than price: the search starts months before arrival.",
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
        "The statutory minimum a student visa applicant must show for the first year. Tied to the BAfoG maximum grant, so it changes when that changes.",
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
        "Provider pricing, not a statutory figure. Compare on total cost across the full stay rather than on the opening fee.",
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
        "Because it is normally sat in Germany, DSH suits an applicant arriving on a language-course route rather than one applying from India.",
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
        "An English-taught Master's still leaves you living in German. A2 to B1 is what makes a part-time job, a lease and a doctor's appointment possible, and no university requires it.",
      source: "Programme admission regulations",
    },
  ],

  academic: [
    {
      title: "APS certificate is mandatory, and it is the first clock to start",
      body:
        "Every Indian applicant needs an APS certificate before a university application or a visa application will be processed. It certifies that your documents are genuine and your degree is what it says it is. Processing takes weeks, and the certificate is issued once and reused across applications, so it is started before a shortlist is finished rather than after.",
      source: "APS India",
      appliesTo: "All applicants holding Indian qualifications",
    },
    {
      title: "dMAT is mandatory from the summer semester 2027 intake",
      body:
        "The APS India Digital Master Test is a new, separate, standardised test required from the summer semester 2027 intake for Indian Bachelor's degree holders applying to a Master's in Engineering, Commerce, Business, Finance or Economics. It costs €150 on top of the APS fee. It is not pass or fail: it produces a score report that universities read alongside your transcript. Our stated audience is almost exactly the population this triggers, so it is published here rather than left to be discovered late.",
      source: "APS India",
      appliesTo:
        "Indian Bachelor's holders applying for a Master's in Engineering, Commerce, Business, Finance or Economics, from summer semester 2027",
    },
    {
      title: "dMAT exemptions, including the transitional one",
      body:
        "You do not sit the dMAT if you already hold a Master's degree, if you are applying to a subject outside the listed groups, if your Bachelor's is from outside India, or if you are applying for a Bachelor's rather than a Master's. There is also a transitional exemption: anyone who registered with or submitted documents to APS India before 29 June 2026 is outside the requirement. That date has passed, so the exemption now only covers someone who had already registered or submitted documents by then; check the date on your own APS record before you plan around it.",
      source: "APS India",
      appliesTo: "Applicants who would otherwise be in scope",
    },
    {
      title: "anabin recognition decides whether your degree counts at all",
      body:
        "Germany does not treat all foreign degrees as equivalent. The anabin database rates your institution H+, H+/- or H-, and rates your degree separately. An H+ institution with a recognised degree means direct eligibility. H+/- means the university decides case by case. H- means the degree is not recognised as equivalent and the pathway is different. This is checked before a shortlist is built, because a shortlist of universities you cannot apply to is worse than no shortlist.",
      source: "anabin, Zentralstelle fur auslandisches Bildungswesen",
      appliesTo: "All applicants holding Indian qualifications",
    },
    {
      title: "Three year versus four year Bachelor's",
      body:
        "A German Bachelor's is 180 ECTS over three years, and many Indian three year Bachelor's degrees do map onto it. The friction is subject-specific: engineering Master's programmes are usually built on a four year, 240 ECTS engineering Bachelor's, and a three year BSc or BCA can be found short of the technical and mathematics credits even where the overall duration is accepted. The answer is per programme, not per country, and the honest version of this advice is that it has to be checked against the specific programme's module requirements.",
      source: "Programme admission regulations, and anabin equivalence statements",
      appliesTo: "Master's applicants",
    },
    {
      title: "ECTS and subject credits are how Master's admission is actually decided",
      body:
        "German Master's admission is largely arithmetic on your transcript: total credits, credits in the core subject, credits in mathematics, and credits in the named technical modules the programme lists as prerequisites. A programme that asks for 30 ECTS in mathematics and finds 18 on your transcript rejects on that, whatever your overall grade was. Missing prerequisites can sometimes be made up as conditional modules after admission, which is a question to ask the programme rather than assume.",
      source: "Programme admission regulations",
      appliesTo: "Master's applicants",
    },
    {
      title: "Grade conversion, and who actually decides it",
      body:
        "Your Indian percentage or CGPA is converted to the German 1.0 to 4.0 scale, most commonly with the Modified Bavarian Formula. We publish that calculator so you can see the arithmetic on your own numbers. What we cannot do is decide the result: the university's admissions office or uni-assist performs the official conversion, and some universities use a different method or apply a subject-specific correction.",
      source: "Kultusministerkonferenz, Modified Bavarian Formula",
      appliesTo: "All applicants",
    },
    {
      title: "Studienkolleg, when the qualification is not directly eligible",
      body:
        "If your school-leaving qualification does not carry direct university entrance for Germany, the Studienkolleg is the bridge: one or two semesters of subject-specific preparation, ending in the Feststellungsprufung assessment, after which you apply as a directly eligible candidate. It is a real year of your life and a real cost, so it belongs in the plan from the start rather than as a fallback discovered after a rejection.",
      source: "Studienkolleg admission offices",
      appliesTo: "Applicants without a direct higher education entrance qualification",
    },
    {
      title: "uni-assist or direct: a real choice, not a formality",
      body:
        "Some universities take applications only through uni-assist, some only directly, and some accept both. uni-assist pre-checks your documents and charges per application, which is useful if your file is unusual and an avoidable cost and delay if it is not. Where both routes are open, the direct route is usually faster. Which route applies is a per-university fact, checked before the application window rather than during it.",
      source: "uni-assist e.V., and university application pages",
      appliesTo: "All applicants",
    },
  ],

  intakes: [
    {
      name: "Winter semester",
      applicationDeadline: "2027-07-15",
      deadlineNote:
        "15 July is the common deadline for the winter semester, and a large minority of programmes close earlier, some as early as 31 May. The deadline that matters is the programme's own.",
      teachingStarts: "2027-10-01",
      status: "not-yet-open",
      statusAsOf: "2026-09-03",
      source: "uni-assist e.V., and programme application pages",
    },
    {
      name: "Summer semester",
      applicationDeadline: "2027-01-15",
      deadlineNote:
        "15 January is the common deadline. Fewer programmes admit in the summer semester than in the winter one, and engineering Master's intakes in particular are often winter-only.",
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
        "Start APS. Check your institution and degree on anabin. If the dMAT applies to you, note whether the transitional exemption date falls before or after your APS registration.",
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
        "Submit through uni-assist or directly, whichever the university requires. A letter of motivation per programme, not one reused across nine.",
    },
    {
      monthsBefore: [8, 6],
      title: "Admission, then the blocked account",
      detail:
        "Admission letter arrives. Open and fund the blocked account. Arrange the health insurance confirmation.",
    },
    {
      monthsBefore: [6, 3],
      title: "The visa appointment is the binding constraint",
      detail:
        "Appointment slots at the German missions in India are the single most common reason a confirmed admission does not turn into an October start. Book the moment the admission letter allows it, before the rest of the file is finished.",
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
        "A conditional admission is not always sufficient for the visa. Check which one your mission accepts.",
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
        "Lead times at the German missions in India run from weeks to several months depending on the city and the season. This is the step that decides whether an October start is realistic.",
      blocks: "Everything after it.",
      source: "German missions in India",
    },
    {
      id: "decision",
      title: "Decision, then travel",
      detail:
        "Processing after the appointment is commonly six to twelve weeks and is not guaranteed within any window. No flight is booked against an undecided application.",
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
        "German admissions offices and employers read the Europass structure by default: reverse-chronological, explicit dates, no photograph unless asked.",
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
        "The entry visa is temporary. Apply at the Auslanderbehorde before it expires; in busy cities the appointment itself has a lead time of weeks.",
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
      body:
        "Non-EU students may work 140 full days or 280 half days in a calendar year, raised from 120 and 240 in March 2024. A half day is up to four hours. The two are interchangeable within the annual allowance, and exceeding it is a residence permit problem, not a payroll one.",
      source: "German Residence Act, Aufenthaltsgesetz",
    },
    {
      title: "Student assistant work is counted separately",
      body:
        "Academic assistant roles at your own university are generally outside the 140 day allowance, but this has to be confirmed with the foreigners' office rather than assumed from a forum post.",
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
        "After graduating you may apply for an 18 month residence permit to seek employment related to your qualification, and you may work without restriction during it. It runs from the date your result is confirmed, not from the date you apply.",
      source: "German Residence Act, section 20",
    },
    {
      title: "Then the EU Blue Card, or a work permit",
      body:
        "Once employed, the usual route is the EU Blue Card, which has a salary threshold that is lower for shortage occupations and lower again for recent graduates. The threshold changes annually and has to be read for the year you are applying in.",
      source: "Federal Office for Migration and Refugees, BAMF",
    },
  ],

  insurance: [
    {
      title: "Statutory versus private, and who may choose",
      body:
        "Enrolment requires German health insurance. Most students under 30 take statutory cover at the student rate, roughly €130 to €145 a month including the long-term care contribution. Private cover is cheaper for some applicants, but leaving the statutory system as a student is difficult to reverse, which matters if you intend to stay and work in Germany afterwards.",
      source: "Statutory health insurers, and SGB V",
    },
    {
      title: "Over 30, or on a preparatory course",
      body:
        "The student rate generally ends at 30, or after the 14th semester. Beyond that, statutory cover is charged at the voluntary member rate, which is substantially higher, and private cover becomes the usual route. Language course and Studienkolleg students are often outside the student rate too.",
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
        "€1,500 per semester across a two year Master's is €6,000, and it lands on precisely the shortlist an engineering applicant builds first. The state is not a reason to avoid those universities. Discovering the fee after accepting the offer is a reason to be annoyed with your consultant.",
    },
    {
      title: "Names that do not match across documents",
      body:
        "APS rejects on inconsistency. A passport that expands an initial, a transcript that does not, a middle name on one and not the other: fix the mismatch before submitting, because fixing it afterwards costs a full processing cycle.",
    },
    {
      title: "A missing semester transcript",
      body:
        "Every semester, individually, not a consolidated statement. This is among the most frequent APS document failures and it is entirely avoidable.",
    },
    {
      title: "Starting the visa appointment search late",
      body:
        "Admission in June and an appointment in November means the intake is missed with every document in perfect order. Book on the day the admission letter permits it.",
    },
    {
      title: "One letter of motivation, sent to nine programmes",
      body:
        "A German letter of motivation argues fit against the programme's own modules. A reusable one reads as reusable, and the module argument is the part actually being assessed.",
    },
    {
      title: "Counting the blocked account monthly release as a budget",
      body:
        "€992 a month is a ceiling on withdrawals, not a cost of living estimate. In Munich the rent alone can consume most of it, which is a planning fact rather than a reason to pick a cheaper city if the programme is right.",
    },
  ],

  faqs: [
    {
      q: "Is Germany actually free?",
      a: "Tuition at public universities is free in 15 of the 16 federal states. Baden-Wurttemberg charges non-EU students €1,500 per semester. Everyone pays a semester contribution of roughly €100 to €400, which usually includes a transport ticket. Private universities charge full tuition.",
    },
    {
      q: "Do I need German if my programme is taught in English?",
      a: "Not for admission. For a part-time job, a lease, a doctor's appointment and a residence permit appointment, A2 to B1 changes your life considerably. No university will require it and we will still recommend it.",
    },
    {
      q: "Does the dMAT apply to me?",
      a: "If you hold an Indian Bachelor's degree, are applying for a Master's in Engineering, Commerce, Business, Finance or Economics, and your intake is summer semester 2027 or later, then yes, unless an exemption applies. Having registered with APS India before 29 June 2026 is one of those exemptions.",
    },
    {
      q: "Will my three year Bachelor's be accepted?",
      a: "Often yes on duration, and the real question is subject credits rather than years. Engineering Master's programmes built on a four year, 240 ECTS Bachelor's frequently find a three year degree short on technical and mathematics credits. It is decided per programme, and we check it per programme.",
    },
    {
      q: "How much commission do you earn on a German public university?",
      a: "Nothing. German public universities do not pay agents. That is why the advisory fee on this route is higher than on the others, and it is stated in writing before you pay anything.",
    },
  ],
};
