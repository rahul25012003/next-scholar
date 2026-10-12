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
    "Ireland asks for a large part of your tuition to be paid before you have a visa, so it costs the most up front of our three destinations. This guide covers entry requirements, deadlines, the visa steps and the corrected post-study window. Every cost is on the costs page.",
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
        "One to two year taught postgraduate degrees, with September and January intakes. They sit at Level 9 on the Irish framework, the level with the longer post-study permission.",
    },
  ],

  tuition: [
    {
      label: "Taught Master's, year one",
      value: "€12,000 to €28,000",
      qualifier:
        "An indicative range across universities and subjects, not a quoted price. Low end: Munster Technological University's data science MSc after its EUR 3,000 scholarship, for those who qualify, as its own fee page states; before any scholarship our catalogue's lowest is EUR 14,000. Top end: business, data and computing at the larger universities, where our catalogue's highest entry sits.",
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
      "Monthly ranges for one student in shared housing. In Ireland the bigger problem is finding a room at all, not its price, so it is a planning problem rather than a budgeting one.",
    source:
      "Irish Council for International Students cost guidance, university accommodation offices, and Residential Tenancies Board rent data",
    cities: [
      {
        slug: "dublin",
        name: "Dublin",
        note:
          "The tightest student housing market of any city in our three destinations. Purpose-built student housing costs close to private rent and both are scarce, so start searching before you accept the offer.",
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
          "Much cheaper than Dublin, but rooms are still hard to get in September. Galway in particular has short supply and a rigid academic-year cycle.",
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
        "What the immigration authority expects you to have for your first year, on top of tuition. It is a threshold, not a budget: in Dublin the rent alone is more.",
      source: "Irish Immigration Service Delivery, student visa requirements",
    },
    {
      label: "Six months of statements",
      value: "Six consecutive monthly statements",
      qualifier:
        "The visa officer reads the account history, not just the closing balance. A lump sum that appears the week before you apply is a classic refusal pattern, and it needs an explained, evidenced source.",
      source: "Irish Immigration Service Delivery",
    },
    {
      label: "Tuition paid before the visa application",
      value: "€6,000, or the full fee if it is lower",
      qualifier:
        "Paid to the institution, with its receipt as evidence, before you apply. This is money paid out, not a balance to show, which is why the Irish route costs so much up front.",
      source: "Irish Immigration Service Delivery",
      note:
        "If the programme fee is below €6,000, you pay the full fee instead. Before you transfer, get the institution's refund policy for a visa refusal in writing.",
    },
    {
      label: "Where the funds may sit",
      value: "Your own account, or a sponsor's with evidenced relationship and consent",
      qualifier:
        "A sponsor's money needs the relationship documented and a signed undertaking. Many visa officers accept loan sanction letters where the disbursement terms are clear.",
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
        "Insurer pricing for a policy that meets the stated minimum cover, not a government fee. Compare on cover, not on premium.",
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
        "PTE is widely accepted at around 63 to 65. Duolingo is accepted by fewer institutions than IELTS.",
      validity: "Two years, typically.",
      source: "University admission requirements",
    },
    {
      name: "Medium of instruction letter",
      accepted:
        "Some Irish institutions accept an MOI letter from an Indian university instead of a test. That is the institution's choice, and the visa officer may still ask about your English.",
      validity: "Institution-specific.",
      source: "University admission requirements",
    },
  ],

  academic: [
    {
      title: "Level 8 and Level 9, and why the difference matters later",
      body:
        "The Irish National Framework of Qualifications puts an honours bachelor degree at Level 8 and a taught Master's at Level 9. The level of your award decides how long you may stay after graduating, so check your programme's level before you compare offers.",
      source: "Quality and Qualifications Ireland, NFQ",
      appliesTo: "All applicants",
    },
    {
      title: "A three year Indian Bachelor's is normally accepted",
      body:
        "Irish universities generally accept a three year Indian Bachelor's for a taught Master's, with a percentage or CGPA threshold commonly around 55 to 60 per cent. Each institution keeps its own list of recognised Indian universities.",
      source: "University admission requirements",
      appliesTo: "Master's applicants",
    },
    {
      title: "The visa is assessed on your intent as well as your file",
      body:
        "Irish student visa refusals often cite an unclear reason: a course that does not follow from your past study or work, with no explanation. A career change is entirely legitimate, but you need to explain it rather than leave it to be guessed.",
      source: "Irish Immigration Service Delivery refusal grounds",
      appliesTo: "All applicants",
    },
  ],

  intakes: [
    {
      name: "September intake",
      applicationDeadline: "2027-06-30",
      deadlineNote:
        "Most institutions admit on a rolling basis and close programmes as they fill. The real deadline is set by the visa timeline: an application processed in July for a September start is very tight.",
      teachingStarts: "2027-09-13",
      status: "not-yet-open",
      statusAsOf: "2026-09-03",
      source: "University application pages",
    },
    {
      name: "January intake",
      applicationDeadline: "2027-10-15",
      deadlineNote: "A smaller intake with fewer programmes, but rooms are much easier to find.",
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
        "Shortlist on programme and city together: a Dublin offer with no room is worse than a Cork offer with one. Note whether each programme is Level 8 or Level 9.",
    },
    {
      monthsBefore: [10, 8],
      title: "Applications",
      detail: "Rolling admissions reward applying early. Ask for reference letters now.",
    },
    {
      monthsBefore: [8, 6],
      title: "Offer, and the six month statement clock",
      detail:
        "Six months of account history is read, so set up the account well before you apply. A late lump sum is the most-cited money reason for refusal.",
    },
    {
      monthsBefore: [6, 4],
      title: "Pay the tuition, buy the insurance",
      detail:
        "Pay €6,000 of tuition, or the full fee if lower, and get the receipt. Buy private medical insurance with €25,000 accident and €25,000 disease cover; you need both before you apply.",
    },
    {
      monthsBefore: [4, 2],
      title: "Apply, then wait on the decision",
      detail:
        "Processing from India commonly takes four to eight weeks and is not guaranteed. Keep searching for accommodation in parallel; do not wait for the decision.",
    },
    {
      monthsBefore: [2, 0],
      title: "Travel and the IRP appointment",
      detail:
        "Book the IRP registration appointment as early as the system allows. First registration is in person, and Dublin appointments have often run short.",
    },
  ],

  visaSteps: [
    {
      id: "offer",
      title: "Unconditional offer accepted",
      detail: "Note whether it is Level 8 or Level 9, because the post-study permission depends on it.",
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
        "Commonly four to eight weeks from India, and not guaranteed. A refusal can be appealed within a set window, which is worth doing where the reason was a document problem.",
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
        "€300, and the first registration is in person. Dublin registrations go through Burgh Quay, where appointments have been the bottleneck, so book as early as the system allows.",
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
        "Stamp 2 allows 20 hours of work a week in term, and 40 hours a week in the holiday periods: June to September inclusive, and 15 December to 15 January. Outside those periods the 20 hour cap applies, whatever your timetable.",
      source: "Irish Immigration Service Delivery, Stamp 2 conditions",
    },
    {
      title: "Stamp 2 requires an eligible programme",
      body:
        "Work is allowed only on full-time programmes of at least one year on the official Interim List of Eligible Programmes. A course outside that list carries Stamp 2A, which allows no work at all, so confirm your programme's stamp before you plan on earning.",
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
        "This corrects what we previously published, which was a flat 24 months up front.",
      points: [
        "A Level 9 or higher graduate receives 12 months of Stamp 1G permission.",
        "It can be renewed once for a further 12, so 24 months in total at most.",
        "Renewal is conditional, most importantly on evidence that you are genuinely seeking or have found graduate-level work.",
      ],
      source: "Irish Immigration Service Delivery, Third Level Graduate Programme",
    },
    {
      title: "Level 8 graduates get 12 months, not 24",
      body:
        "A Level 8 award gets 12 months of Stamp 1G, with no renewal. If you are comparing a Level 8 and a Level 9 offer, that 12 month difference belongs in the comparison.",
      source: "Irish Immigration Service Delivery, Third Level Graduate Programme",
      appliesTo: "Level 8 graduates",
    },
    {
      title: "Then a Critical Skills or General Employment Permit",
      body:
        "Stamp 1G is a window to look for work, not a work route. Moving on means an employment permit, and the Critical Skills list and its salary threshold decide which one you can get; both change, so check them for the year you apply.",
      source: "Department of Enterprise, Trade and Employment",
    },
  ],

  insurance: [
    {
      title: "Private medical insurance is mandatory, at a stated cover level",
      body:
        "Your visa file needs private medical insurance covering at least €25,000 for accident and €25,000 for disease, in force from your arrival. Our site previously listed 'accommodation secured' at this step instead, which is not a visa requirement at all.",
      source: "Irish Immigration Service Delivery",
    },
    {
      title: "Ireland is not the NHS",
      body: "Public healthcare in Ireland is charged.",
      points: [
        "GP visits are paid per appointment and claimed against your policy.",
        "Budget for the excess as well as the premium.",
        "Check whether your policy covers the first visit or only hospital care.",
      ],
      source: "Health Service Executive",
    },
    {
      title: "Renewal at IRP renewal",
      body:
        "The policy must be in force each time you renew the IRP, so track its expiry date against your registration date, not the academic year.",
      source: "Irish Immigration Service Delivery",
    },
  ],

  pitfalls: [
    {
      title: "Paying €6,000 before checking the refund position",
      body:
        "On this route tuition is paid before the visa decision. Get the institution's refund policy for a visa refusal in writing before you transfer, because a generous policy and a silent one look the same until you need one.",
    },
    {
      title: "A lump sum arriving three weeks before the application",
      body:
        "Six months of statements are read as a history. Money that appears late needs an explained, evidenced source; without one it is the most commonly cited refusal reason on this route.",
    },
    {
      title: "Accepting a Dublin offer without a room",
      body:
        "Dublin has the hardest student housing market of our three destinations. Start searching before you accept, because a Cork or Galway offer with a room beats a Dublin offer without one.",
    },
    {
      title: "Assuming the post-study window is a flat 24 months",
      body:
        "It is 12 months renewable once for Level 9 and above, and 12 months only for Level 8. We published the flat figure ourselves; this page is the correction.",
    },
    {
      title: "Assuming any course carries work rights",
      body:
        "Only programmes on the eligible list carry Stamp 2. A Stamp 2A course allows no work at all, which some students only find out on arrival, after budgeting on part-time pay.",
    },
    {
      title: "Leaving the IRP appointment until you need it",
      body:
        "First registration is in person, and Dublin appointments have run short in the past. Book on arrival, not when your entry stamp is about to expire.",
    },
  ],

  faqs: [
    {
      q: "How much do I need before I get the visa?",
      a: "€10,000 of living costs evidenced across six months of statements, €6,000 of tuition actually paid, a private medical policy at €25,000 and €25,000 cover, and the €60 or €100 visa fee. The tuition and the insurance are money paid out, not a balance to show.",
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
