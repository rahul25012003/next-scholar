import type { DestinationGuide } from "./types";

/**
 * Ireland.
 *
 * Two corrections live here. The site published a flat 24 month post-study
 * window, which is wrong twice over: the permission is granted for 12 months
 * and renewed once for a further 12, and a Level 8 honours bachelor graduate
 * gets 12 months in total rather than 24. It also listed "accommodation
 * secured" as a visa step, which is not one; the step that actually exists at
 * that point is private medical insurance at a stated cover level.
 */
export const ireland: DestinationGuide = {
  slug: "ireland",
  country: "Ireland",
  flagCode: "ie",
  currency: "EUR",
  symbol: "€",
  headline: "Ireland, where the money moves before the visa does",
  lede:
    "Ireland asks for something the other two destinations do not: a large part of the tuition paid before you have a visa, on top of a year of living costs evidenced across six months of statements. Add private medical insurance at a specified cover level and the pre-visa outlay is the highest of our three destinations. This page states each figure, and corrects the post-study window we previously published.",
  verification: {
    statedOn: "2026-09-03",
    checkedBy: null,
    checkedOn: null,
    cadence:
      "Re-read in full at source each quarter, and immediately on any change to the Third Level Graduate Programme.",
  },

  routes: [
    {
      slug: "ireland",
      name: "Taught Master's",
      destinationSlug: "ireland",
      summary:
        "One to two year taught postgraduate degrees, September and January intakes. Level 9 on the Irish framework, which is the level that carries the longer post-study permission.",
    },
  ],

  tuition: [
    {
      label: "Taught Master's, year one",
      value: "€12,000 to €28,000",
      qualifier:
        "Indicative range across institutions and subjects. Not a quoted price. Business, data and computing at the larger universities sit at the top of it, which is where our own catalogue's highest entry sits.",
      source: "University published international fee schedules",
    },
    {
      label: "Student contribution and levies",
      value: "€100 to €300 per year",
      qualifier:
        "Student union and examination levies, charged separately from tuition at most institutions.",
      source: "University fee schedules",
    },
  ],

  living: {
    currency: "EUR",
    symbol: "€",
    qualifier:
      "Monthly ranges for one student sharing accommodation. In Ireland the binding constraint is not the price of a room, it is whether a room exists, and that is a planning fact rather than a budgeting one.",
    source:
      "Irish Council for International Students cost guidance, university accommodation offices, and Residential Tenancies Board rent data",
    cities: [
      {
        slug: "dublin",
        name: "Dublin",
        note:
          "The tightest student housing market of any city across our three destinations. Purpose-built student accommodation is priced close to private rent and both are scarce. Start the search before you accept the offer.",
        lines: [
          { id: "rent", label: "Rent, shared flat or student accommodation", low: 750, high: 1300 },
          { id: "food", label: "Groceries", low: 200, high: 300 },
          { id: "transport", label: "Transport, Leap student card", low: 50, high: 90 },
          { id: "phone", label: "Phone and internet", low: 20, high: 40 },
          { id: "utilities", label: "Utilities, where not included in rent", low: 0, high: 100 },
          {
            id: "insurance",
            label: "Private medical insurance, spread monthly",
            low: 12,
            high: 30,
            note: "Mandatory at a stated cover level. See the insurance section.",
          },
          { id: "personal", label: "Personal, clothing, leisure", low: 90, high: 220 },
          { id: "books", label: "Books and course materials", low: 15, high: 45 },
          { id: "travel", label: "Flights home, spread monthly", low: 45, high: 90, optional: true },
        ],
      },
      {
        slug: "cork",
        name: "Cork, Galway, Limerick",
        note:
          "Materially cheaper than Dublin and still competitive for rooms in September. Galway in particular has a short supply and a hard academic-year cycle.",
        lines: [
          { id: "rent", label: "Rent, shared flat or student accommodation", low: 550, high: 900 },
          { id: "food", label: "Groceries", low: 180, high: 270 },
          { id: "transport", label: "Transport, Leap student card", low: 35, high: 70 },
          { id: "phone", label: "Phone and internet", low: 20, high: 40 },
          { id: "utilities", label: "Utilities, where not included in rent", low: 0, high: 90 },
          { id: "insurance", label: "Private medical insurance, spread monthly", low: 12, high: 30 },
          { id: "personal", label: "Personal, clothing, leisure", low: 80, high: 190 },
          { id: "books", label: "Books and course materials", low: 15, high: 45 },
          { id: "travel", label: "Flights home, spread monthly", low: 45, high: 90, optional: true },
        ],
      },
    ],
  },

  funds: [
    {
      label: "Proof of funds for living costs",
      value: "€10,000 for the first year",
      qualifier:
        "The figure the immigration authority expects to see available for a student's first year, in addition to tuition. It is a threshold, not a budget: in Dublin the rent alone exceeds it.",
      source: "Irish Immigration Service Delivery, student visa requirements",
    },
    {
      label: "Six months of statements",
      value: "Six consecutive monthly statements",
      qualifier:
        "The account history is read, not just the closing balance. A lump sum that appears the week before the application is the pattern refusals are written about, and it needs an explained, evidenced source.",
      source: "Irish Immigration Service Delivery",
    },
    {
      label: "Tuition paid before the visa application",
      value: "€6,000, or the full fee if it is lower",
      qualifier:
        "Paid to the institution and evidenced by its receipt before you apply. This is a cash requirement, not a balance to display, which is what makes the Irish route front-loaded.",
      source: "Irish Immigration Service Delivery",
      note:
        "Where the programme fee is below €6,000 the full fee is paid instead. Check the institution's refund position if the visa is refused, in writing, before you transfer.",
    },
    {
      label: "Where the funds may sit",
      value: "Your own account, or a sponsor's with evidenced relationship and consent",
      qualifier:
        "Sponsored funds need the relationship documented and a signed undertaking. Loan sanction letters are accepted by many visa officers where the disbursement terms are clear.",
      source: "Irish Immigration Service Delivery",
    },
  ],

  visaFees: [
    {
      label: "Long stay (D) study visa, single entry",
      value: "€60",
      qualifier: "Non-refundable if refused. Paid at application.",
      source: "Irish Immigration Service Delivery",
    },
    {
      label: "Long stay (D) study visa, multiple entry",
      value: "€100",
      qualifier: "Worth the difference if you expect to travel within the Schengen area or home mid-course.",
      source: "Irish Immigration Service Delivery",
    },
    {
      label: "Irish Residence Permit registration",
      value: "€300",
      qualifier:
        "Charged per registration, and renewed annually for a multi-year course. Not included in the visa fee.",
      source: "Irish Immigration Service Delivery",
    },
    {
      label: "Private medical insurance, annual policy",
      value: "€150 to €350 per year",
      qualifier:
        "Provider pricing for a policy meeting the stated minimum cover. Not a government fee. Compare on cover, not on premium.",
      source: "Insurer published pricing",
    },
  ],

  language: [
    {
      name: "IELTS Academic",
      accepted:
        "6.5 overall with no band below 6.0 is the common postgraduate threshold. Some programmes require 7.0, and a few accept 6.0.",
      validity: "Two years from the test date.",
      note: "There is no separate UKVI-style secure test for Ireland. IELTS Academic is the standard booking.",
      source: "University admission requirements",
    },
    {
      name: "TOEFL iBT",
      accepted: "88 to 95 is the usual postgraduate range, with section minimums at some institutions.",
      validity: "Two years from the test date.",
      source: "University admission requirements",
    },
    {
      name: "PTE Academic and Duolingo",
      accepted:
        "PTE is widely accepted at around 63 to 65. Duolingo acceptance is institution-specific and narrower than for IELTS.",
      validity: "Two years, typically.",
      source: "University admission requirements",
    },
    {
      name: "Medium of instruction letter",
      accepted:
        "Some Irish institutions accept an MOI letter from an Indian university in place of a test. It is an institutional decision and the visa officer may still ask about your English, so it is not a universal shortcut.",
      validity: "Institution-specific.",
      source: "University admission requirements",
    },
  ],

  academic: [
    {
      title: "Level 8 and Level 9, and why the difference matters later",
      body:
        "The Irish National Framework of Qualifications puts an honours bachelor degree at Level 8 and a taught Master's at Level 9. Your own award level decides how long you may stay after graduating, so it is worth knowing which one your programme confers before you compare offers.",
      source: "Quality and Qualifications Ireland, NFQ",
      appliesTo: "All applicants",
    },
    {
      title: "A three year Indian Bachelor's is normally accepted",
      body:
        "Irish universities generally accept a three year Indian Bachelor's for a taught Master's, with a stated percentage or CGPA threshold that commonly sits around 55 to 60 per cent. Institutions maintain their own recognition lists for Indian universities.",
      source: "University admission requirements",
      appliesTo: "Master's applicants",
    },
    {
      title: "The visa is assessed on your intent as well as your file",
      body:
        "Irish student visa refusals frequently cite an unclear rationale: a course that does not follow from your previous study or work, without an explanation. A career-change application is entirely legitimate and it needs to be argued rather than left to be inferred.",
      source: "Irish Immigration Service Delivery refusal grounds",
      appliesTo: "All applicants",
    },
  ],

  intakes: [
    {
      name: "September intake",
      applicationDeadline: "2027-06-30",
      deadlineNote:
        "Rolling admissions at most institutions, closing as programmes fill. The real deadline is set by the visa timeline: applications processed in July for a September start are uncomfortably tight.",
      teachingStarts: "2027-09-13",
      status: "not-yet-open",
      statusAsOf: "2026-09-03",
      source: "University application pages",
    },
    {
      name: "January intake",
      applicationDeadline: "2027-10-15",
      deadlineNote: "A smaller intake with fewer programmes, and materially better accommodation availability.",
      teachingStarts: "2028-01-17",
      status: "not-yet-open",
      statusAsOf: "2026-09-03",
      source: "University application pages",
    },
  ],

  timeline: [
    {
      monthsBefore: [12, 10],
      title: "Language test, shortlist, and the housing question",
      detail:
        "Shortlist on programme and city together, because a Dublin offer with no room is a worse outcome than a Cork offer with one. Note whether each programme is Level 8 or Level 9.",
    },
    {
      monthsBefore: [10, 8],
      title: "Applications",
      detail: "Rolling admissions reward applying early. Reference letters requested now.",
    },
    {
      monthsBefore: [8, 6],
      title: "Offer, and the six month statement clock",
      detail:
        "The funds history is read across six months, so the account is arranged well before the application. A late lump sum is the single most-cited financial refusal ground.",
    },
    {
      monthsBefore: [6, 4],
      title: "Pay the tuition, buy the insurance",
      detail:
        "€6,000 of tuition, or the full fee if lower, transferred and receipted. Private medical insurance at €25,000 accident and €25,000 disease cover purchased. Both are needed before you apply.",
    },
    {
      monthsBefore: [4, 2],
      title: "Apply, then wait on the decision",
      detail:
        "Processing from India commonly runs four to eight weeks and is not guaranteed. Accommodation search continues in parallel and does not wait for the decision.",
    },
    {
      monthsBefore: [2, 0],
      title: "Travel and the IRP appointment",
      detail:
        "Book the IRP registration appointment as early as the system allows. First registration is in person and the appointment supply in Dublin has a history of running short.",
    },
  ],

  visaSteps: [
    {
      id: "offer",
      title: "Unconditional offer accepted",
      detail: "Level recorded, Level 8 or Level 9, because the post-study permission follows it.",
      blocks: "Everything after it.",
      source: "University offer conditions",
    },
    {
      id: "statements",
      title: "Six months of statements assembled",
      detail:
        "€10,000 available for year one, with a readable account history rather than a single closing balance.",
      blocks: "The visa application.",
      source: "Irish Immigration Service Delivery",
    },
    {
      id: "tuition",
      title: "€6,000 tuition paid, or the full fee if lower",
      detail: "Transferred to the institution and receipted. Confirm the refund position in writing before transferring.",
      blocks: "The visa application.",
      source: "Irish Immigration Service Delivery",
    },
    {
      id: "insurance",
      title: "Private medical insurance purchased",
      detail: "€25,000 accident cover and €25,000 disease cover, evidenced by the policy document.",
      blocks: "The visa application.",
      source: "Irish Immigration Service Delivery",
    },
    {
      id: "apply",
      title: "Online application submitted, then documents couriered",
      detail: "The AVATS application is completed online and the physical file follows to the visa office.",
      source: "Irish Immigration Service Delivery",
    },
    {
      id: "decision",
      title: "Decision",
      detail:
        "Commonly four to eight weeks from India, and not guaranteed. Appeals against a refusal have a stated window and are worth using where the ground was documentary.",
      source: "Irish Immigration Service Delivery",
    },
  ],

  visaDocuments: [
    { id: "passport", title: "Current passport, plus previous passports", detail: "With validity beyond the intended stay.", source: "Irish Immigration Service Delivery" },
    { id: "offer-letter", title: "Letter of acceptance from the institution", detail: "Naming the programme, its NFQ level, its duration and its fee.", source: "Irish Immigration Service Delivery" },
    { id: "fee-receipt", title: "Tuition payment receipt", detail: "Showing €6,000 paid, or the full fee where it is lower.", source: "Irish Immigration Service Delivery" },
    { id: "funds-doc", title: "Six months of bank statements", detail: "Yours or an evidenced sponsor's, showing €10,000 available for year one.", source: "Irish Immigration Service Delivery" },
    { id: "insurance-doc", title: "Private medical insurance policy", detail: "€25,000 accident and €25,000 disease cover, in force from your arrival date.", source: "Irish Immigration Service Delivery" },
    { id: "quals", title: "Academic transcripts and degree certificates", detail: "All years, plus the English language test result.", source: "Irish Immigration Service Delivery" },
    {
      id: "intent",
      title: "A signed statement of your intent",
      detail:
        "Why this course, how it follows from your background, and that you understand the conditions of the permission. Written by you, coached by us, never drafted for you.",
      source: "Irish Immigration Service Delivery",
    },
    { id: "gaps", title: "An explanation of any study or work gaps", detail: "Evidenced. An unexplained gap is a refusal ground on this route.", source: "Irish Immigration Service Delivery" },
  ],

  postArrival: [
    {
      id: "irp",
      title: "Register for the Irish Residence Permit",
      detail:
        "€300, and the first registration is in person. Dublin registrations run through Burgh Quay and appointment supply has historically been the bottleneck, so it is booked as early as the system allows.",
      blocks: "Legal residence beyond the initial permission stamped on entry.",
      source: "Irish Immigration Service Delivery",
    },
    { id: "pps", title: "Apply for a PPS number", detail: "Needed for any employment and for some services. Requires proof of address and your IRP or entry stamp.", blocks: "Legal work.", source: "Department of Social Protection" },
    { id: "bank", title: "Open an Irish bank account", detail: "Requires proof of address and enrolment. Some banks also want the IRP card.", source: "Irish retail banks" },
    { id: "enrol", title: "Complete enrolment and get the student card", detail: "The card unlocks the Leap student travel discount.", source: "University student administration" },
    { id: "gp-reg", title: "Register with a GP", detail: "Charged per visit and claimed against your insurance policy. There is no free-at-point-of-use equivalent to the NHS here.", source: "Irish College of General Practitioners" },
  ],

  workRights: [
    {
      title: "Stamp 2: 20 hours a week, 40 in the stated holiday periods",
      body:
        "A Stamp 2 permission allows 20 hours of work a week during term, and 40 hours a week in the defined holiday periods, which are June to September inclusive and 15 December to 15 January. Outside those windows the 20 hour cap applies whatever your timetable looks like.",
      source: "Irish Immigration Service Delivery, Stamp 2 conditions",
    },
    {
      title: "Stamp 2 requires an eligible programme",
      body:
        "The work concession applies to full-time programmes of at least one year on the official Interim List of Eligible Programmes. A course outside that list carries Stamp 2A, which permits no work at all. Confirm which stamp your programme attracts before you plan on earning.",
      source: "Irish Immigration Service Delivery",
    },
    {
      title: "There is no self-employment concession",
      body: "Stamp 2 does not permit business activity or freelancing.",
      source: "Irish Immigration Service Delivery",
    },
  ],

  postStudy: [
    {
      title: "Third Level Graduate Programme: 12 months, renewable once, to a maximum of 24",
      body:
        "This corrects what we previously published. A Level 9 or higher graduate receives 12 months of Stamp 1G permission, renewable once for a further 12, giving a maximum of 24 months in total rather than a flat 24 up front. The renewal is conditional, most importantly on evidence that you are genuinely seeking or have found graduate-level employment.",
      source: "Irish Immigration Service Delivery, Third Level Graduate Programme",
    },
    {
      title: "Level 8 graduates get 12 months, not 24",
      body:
        "An honours bachelor degree at Level 8 attracts 12 months of Stamp 1G with no renewal. If you are comparing a Level 8 and a Level 9 offer, that is a twelve month difference in the plan and it belongs in the comparison.",
      source: "Irish Immigration Service Delivery, Third Level Graduate Programme",
      appliesTo: "Level 8 graduates",
    },
    {
      title: "Then a Critical Skills or General Employment Permit",
      body:
        "Stamp 1G is a search window, not a work route. Converting it means an employment permit, and the Critical Skills list plus its salary threshold decide which one is available to you. Both change, so they are read for the year you apply in.",
      source: "Department of Enterprise, Trade and Employment",
    },
  ],

  insurance: [
    {
      title: "Private medical insurance is mandatory, at a stated cover level",
      body:
        "The visa file requires private medical insurance covering at least €25,000 for accident and €25,000 for disease, in force from your arrival. This replaces what our site previously listed at this point in the sequence, which was 'accommodation secured' and is not a visa requirement at all.",
      source: "Irish Immigration Service Delivery",
    },
    {
      title: "Ireland is not the NHS",
      body:
        "Public healthcare in Ireland is charged. GP visits cost per appointment and are claimed against your policy. Budget for the excess as well as the premium, and check whether your policy covers the first visit or only hospital care.",
      source: "Health Service Executive",
    },
    {
      title: "Renewal at IRP renewal",
      body:
        "The policy has to be in force each time you renew the IRP, so its expiry date is tracked against the registration date rather than the academic year.",
      source: "Irish Immigration Service Delivery",
    },
  ],

  pitfalls: [
    {
      title: "Paying €6,000 before checking the refund position",
      body:
        "Tuition goes before the visa decision on this route. Get the institution's refund policy for a visa refusal in writing before you transfer, because a generous policy and a silent one look identical until you need one.",
    },
    {
      title: "A lump sum arriving three weeks before the application",
      body:
        "Six months of statements are read as a history. Money that appears late needs an explained and evidenced source, and without one it is the most commonly cited refusal ground on this route.",
    },
    {
      title: "Accepting a Dublin offer without a room",
      body:
        "Dublin student housing is the hardest market across our three destinations. The search starts before the offer is accepted, and a Cork or Galway offer with accommodation genuinely beats a Dublin one without.",
    },
    {
      title: "Assuming the post-study window is a flat 24 months",
      body:
        "It is 12 months renewable once for Level 9 and above, and 12 months only for Level 8. We published the flat figure ourselves; this page is the correction.",
    },
    {
      title: "Assuming any course carries work rights",
      body:
        "Only programmes on the eligible list attract Stamp 2. A Stamp 2A course permits no work at all, and that is discovered on arrival by people who budgeted on part-time earnings.",
    },
    {
      title: "Leaving the IRP appointment until you need it",
      body:
        "First registration is in person and appointment supply in Dublin has run short in the past. It is booked on arrival, not when the entry stamp is close to expiring.",
    },
  ],

  faqs: [
    {
      q: "How much do I need before I get the visa?",
      a: "€10,000 of living costs evidenced across six months of statements, €6,000 of tuition actually paid, a private medical policy at €25,000 and €25,000 cover, and the €60 or €100 visa fee. The tuition and the insurance are cash out, not a balance to display.",
    },
    {
      q: "How long can I stay after I graduate?",
      a: "Level 9 or higher: 12 months, renewable once for a further 12, so 24 at most. Level 8: 12 months, not renewable. We previously published a flat 24 months, which was wrong on both counts.",
    },
    {
      q: "Can I work while studying?",
      a: "On Stamp 2, 20 hours a week in term time and 40 hours a week in the stated holiday periods. Only programmes on the eligible list carry Stamp 2, so confirm yours does before planning on the income.",
    },
    {
      q: "Is healthcare free like the UK?",
      a: "No. Ireland charges for public healthcare, which is why private medical insurance is a visa requirement rather than an optional extra. Budget the premium and the per-visit cost.",
    },
    {
      q: "Is accommodation really the main problem?",
      a: "In Dublin, yes. Visa policy is stable and reasonably predictable. Rooms are not, and that is the constraint we plan the Irish route around.",
    },
  ],
};
