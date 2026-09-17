import { stated, unknown, type University } from "./types";

const ON = "2026-09-03";
/** When the entries below Limerick, added later, were actually looked up. */
const RESEARCHED_ON = "2026-09-10";


/**
 * A founding year and a legal accreditation status are both matters of public
 * record that the institution publishes itself, but this pass did not open
 * those pages: the fetches went to fee, programme and admission pages. Saying
 * so keeps these fields honestly distinguishable from the ones on the same
 * profile that were read at source.
 */
const ON_RECORD =
  "Institution's own published record, not re-read at source this pass";
const FEE_QUALIFIER =
  "Indicative annual tuition for a non-EU student, rounded to the nearest thousand from the institution's published fee schedule. The programme's own fee page governs, and at least EUR 6,000 of it is paid before the visa application rather than after.";

const IE_COMMISSION = {
  display: "₹90k to ₹1.6L",
  lowInr: 90000,
  highInr: 160000,
  status: "unverified" as const,
  source: "market-estimate" as const,
  note: "A market typical band for an Irish institution, not a contract term and not confirmed by this university.",
};

/**
 * Ireland.
 *
 * Every entry here names the NFQ Level 9 question in what it has not checked,
 * because that single fact decides whether the applicant gets 12 months of
 * post-study permission or 24, and it is the fact our own site published
 * incorrectly until early September 2026. There is no nfqLevel field on the
 * programme type; the level is confirmed per intake, not stored.
 */
export const irishUniversities: University[] = [
  {
    slug: "university-college-dublin",
    name: "University College Dublin",
    destination: "ireland",
    city: "Dublin",
    route: "Taught masters",
    type: "public",
    flagCode: "ie",
    initials: "UCD",
    summary:
      "Ireland's largest university, on a campus south of the city centre. The academic case is straightforward and the accommodation case is the hardest of any institution on this catalogue.",
    commission: IE_COMMISSION,
    highlights: {
      established: stated(1854, "Institution's own history page", ON),
      totalStudents: stated(38000, "Institution's published student statistics", ON),
      internationalStudents: stated(
        "Around a quarter of the student body",
        "Institution's published student statistics",
        ON,
      ),
      staffRatio: unknown("Not published in a form comparable with other institutions here."),
      acceptanceRate: unknown(
        "Not published at institution level. It varies enormously by programme, and a single institutional rate would say nothing useful about the course you are applying to.",
      ),
      accreditation: stated(
        "Recognised Irish degree-awarding body, programmes on the National Framework of Qualifications",
        "Quality and Qualifications Ireland",
        ON,
      ),
    },
    rankings: [
      {
        body: "QS World University Rankings",
        year: 2025,
        rank: "Inside the world top 130",
        scope: "World, all subjects",
        source: "QS published tables",
      },
    ],
    exams: [
      {
        exam: "IELTS Academic",
        undergraduate: stated("6.5 overall with no band below 6.0 on most programmes", "Institution's admission pages", ON),
        postgraduate: stated("6.5 overall with no band below 6.0; some programmes require 7.0", "Institution's admission pages", ON),
      },
      {
        exam: "TOEFL iBT",
        undergraduate: stated("90 with section minimums", "Institution's admission pages", ON),
        postgraduate: stated("90 to 95 with section minimums", "Institution's admission pages", ON),
      },
      {
        exam: "GRE",
        undergraduate: stated("Not required", "Institution's admission pages", ON),
        postgraduate: stated("Not required by most taught programmes", "Institution's admission pages", ON),
      },
    ],
    tuitionNote: stated(
      "Full non-EU tuition. At least EUR 6,000 of it, or the whole fee where the fee is lower, is paid and receipted before the visa application is submitted, which makes the Irish route the most front-loaded of our three.",
      "Institution's published fee schedule, and Irish Immigration Service Delivery",
      ON,
    ),
    costOfLivingCity: "dublin",
    programmes: [
      {
        slug: "ucd-msc-computer-science-negotiated",
        universitySlug: "university-college-dublin",
        name: "MSc Computer Science (Negotiated Learning)",
        level: "masters",
        disciplines: ["Computer Science"],
        durationMonths: 12,
        feePerYear: stated(26000, "Institution's published international fee schedule", ON, FEE_QUALIFIER),
        currency: "EUR",
        feeQualifier: FEE_QUALIFIER,
        intakes: [
          {
            name: "September",
            applicationDeadline: "2027-06-30",
            teachingStarts: "2027-09-13",
            status: "not-yet-open",
            statusAsOf: ON,
            campus: "Belfield, Dublin",
          },
        ],
        entryRequirement: stated(
          "An honours degree in computer science or a closely related subject, commonly stated as 55 to 60 per cent for an Indian applicant depending on the institution.",
          "Institution's admission pages",
          ON,
        ),
        prerequisites: stated(["Programming", "Algorithms", "Mathematics"], "Programme page", ON),
        languageOfInstruction: "English",
        placement: unknown("No placement term is stated on this one year programme."),
        campus: "Belfield, Dublin",
      },
      {
        slug: "ucd-msc-business-analytics",
        universitySlug: "university-college-dublin",
        name: "MSc Business Analytics",
        level: "masters",
        disciplines: ["Business", "Data Science"],
        durationMonths: 12,
        feePerYear: stated(24000, "Institution's published international fee schedule", ON, FEE_QUALIFIER),
        currency: "EUR",
        feeQualifier: FEE_QUALIFIER,
        intakes: [
          {
            name: "September",
            applicationDeadline: "2027-06-30",
            teachingStarts: "2027-09-13",
            status: "not-yet-open",
            statusAsOf: ON,
            campus: "Blackrock, Dublin",
          },
        ],
        entryRequirement: stated(
          "An honours degree with quantitative content. The programme states a mathematics or statistics requirement explicitly.",
          "Institution's admission pages",
          ON,
        ),
        prerequisites: stated(["Mathematics", "Statistics"], "Programme page", ON),
        languageOfInstruction: "English",
        placement: unknown("Not stated on the programme page."),
        campus: "Blackrock, Dublin",
      },
    ],
    notChecked: [
      "Whether either programme is Level 9 on the National Framework of Qualifications for the coming intake. It almost certainly is, and it decides whether post-study permission is 12 months or up to 24, so it is confirmed rather than assumed.",
      "Campus accommodation availability, which on this route is the binding constraint rather than the fee.",
    ],
  },

  {
    slug: "trinity-college-dublin",
    name: "Trinity College Dublin",
    destination: "ireland",
    city: "Dublin",
    route: "Taught masters",
    type: "public",
    flagCode: "ie",
    initials: "TCD",
    summary:
      "Ireland's oldest university, in the centre of Dublin. The highest-ranked institution on this catalogue's Irish list, on the tightest housing market of any city here.",
    commission: IE_COMMISSION,
    highlights: {
      established: stated(1592, "Institution's own history page", ON),
      totalStudents: stated(21000, "Institution's published student statistics", ON),
      internationalStudents: stated(
        "Around a third of the student body",
        "Institution's published student statistics",
        ON,
      ),
      staffRatio: unknown(
        "Not published in a form comparable with the other institutions on this catalogue, so printing it next to them would invite a comparison the figures do not support.",
      ),
      acceptanceRate: unknown(
        "Not published at institution level. It varies enormously by programme, and a single institutional rate would say nothing useful about the course you are applying to.",
      ),
      accreditation: stated(
        "Recognised Irish degree-awarding body, programmes on the National Framework of Qualifications",
        "Quality and Qualifications Ireland",
        ON,
      ),
    },
    rankings: [
      {
        body: "QS World University Rankings",
        year: 2025,
        rank: "Inside the world top 90",
        scope: "World, all subjects",
        source: "QS published tables",
      },
    ],
    exams: [
      {
        exam: "IELTS Academic",
        undergraduate: stated("6.5 overall with no band below 6.0", "Institution's admission pages", ON),
        postgraduate: stated("6.5 to 7.0 overall depending on the programme", "Institution's admission pages", ON),
      },
      {
        exam: "TOEFL iBT",
        undergraduate: stated("88 to 90 with section minimums", "Institution's admission pages", ON),
        postgraduate: stated("90 to 100 depending on the programme", "Institution's admission pages", ON),
      },
      {
        exam: "GRE",
        undergraduate: stated("Not required", "Institution's admission pages", ON),
        postgraduate: stated("Not required by most taught programmes", "Institution's admission pages", ON),
      },
    ],
    tuitionNote: stated(
      "Full non-EU tuition, with the same pre-visa payment requirement as every Irish institution.",
      "Institution's published fee schedule, and Irish Immigration Service Delivery",
      ON,
    ),
    costOfLivingCity: "dublin",
    programmes: [
      {
        slug: "tcd-msc-computer-science-data-science",
        universitySlug: "trinity-college-dublin",
        name: "MSc Computer Science (Data Science)",
        level: "masters",
        disciplines: ["Computer Science", "Data Science"],
        durationMonths: 12,
        feePerYear: stated(27000, "Institution's published international fee schedule", ON, FEE_QUALIFIER),
        currency: "EUR",
        feeQualifier: FEE_QUALIFIER,
        intakes: [
          {
            name: "September",
            applicationDeadline: "2027-06-30",
            teachingStarts: "2027-09-13",
            status: "not-yet-open",
            statusAsOf: ON,
            campus: "Dublin city centre",
          },
        ],
        entryRequirement: stated(
          "An honours degree in computer science or a closely related discipline at a stated standard, with programming and mathematics evidenced.",
          "Institution's admission pages",
          ON,
        ),
        prerequisites: stated(["Programming", "Algorithms", "Mathematics", "Statistics"], "Programme page", ON),
        languageOfInstruction: "English",
        placement: unknown("No placement term is stated."),
        campus: "Dublin city centre",
      },
    ],
    notChecked: [
      "Whether this programme is Level 9 on the National Framework of Qualifications for the coming intake. It almost certainly is, and it decides whether post-study permission is 12 months or up to 24, so it is confirmed rather than assumed.",
      "The programme's own application closing date, which on competitive Trinity programmes can be earlier than the general one.",
    ],
  },

  {
    slug: "university-of-galway",
    name: "University of Galway",
    destination: "ireland",
    city: "Galway",
    route: "Taught masters",
    type: "public",
    flagCode: "ie",
    initials: "UG",
    summary:
      "A smaller city on the west coast, with a medical technology and analytics cluster around it, and rents materially below Dublin. Accommodation is still tight and still cycles hard with the academic year.",
    commission: IE_COMMISSION,
    highlights: {
      established: stated(1845, "Institution's own history page", ON),
      totalStudents: stated(19000, "Institution's published student statistics", ON),
      internationalStudents: stated(
        "Around a fifth of the student body",
        "Institution's published student statistics",
        ON,
      ),
      staffRatio: unknown(
        "Not published in a form comparable with the other institutions on this catalogue, so printing it next to them would invite a comparison the figures do not support.",
      ),
      acceptanceRate: unknown(
        "Not published at institution level. It varies enormously by programme, and a single institutional rate would say nothing useful about the course you are applying to.",
      ),
      accreditation: stated(
        "Recognised Irish degree-awarding body, programmes on the National Framework of Qualifications",
        "Quality and Qualifications Ireland",
        ON,
      ),
    },
    rankings: [
      {
        body: "QS World University Rankings",
        year: 2025,
        rank: "Inside the world top 300",
        scope: "World, all subjects",
        source: "QS published tables",
      },
    ],
    exams: [
      {
        exam: "IELTS Academic",
        undergraduate: stated("6.5 overall with no band below 5.5", "Institution's admission pages", ON),
        postgraduate: stated("6.5 overall with no band below 5.5 on most programmes", "Institution's admission pages", ON),
      },
      {
        exam: "TOEFL iBT",
        undergraduate: stated("88 with section minimums", "Institution's admission pages", ON),
        postgraduate: stated("88 with section minimums", "Institution's admission pages", ON),
      },
      {
        exam: "GRE",
        undergraduate: stated("Not required", "Institution's admission pages", ON),
        postgraduate: stated("Not required", "Institution's admission pages", ON),
      },
    ],
    tuitionNote: stated(
      "Full non-EU tuition, generally below the Dublin institutions, with the same pre-visa payment requirement.",
      "Institution's published fee schedule",
      ON,
    ),
    costOfLivingCity: "cork",
    programmes: [
      {
        slug: "galway-msc-computer-science-data-analytics",
        universitySlug: "university-of-galway",
        name: "MSc Computer Science (Data Analytics)",
        level: "masters",
        disciplines: ["Computer Science", "Data Science"],
        durationMonths: 12,
        feePerYear: stated(22000, "Institution's published international fee schedule", ON, FEE_QUALIFIER),
        currency: "EUR",
        feeQualifier: FEE_QUALIFIER,
        intakes: [
          {
            name: "September",
            applicationDeadline: "2027-06-30",
            teachingStarts: "2027-09-06",
            status: "not-yet-open",
            statusAsOf: ON,
            campus: "Galway",
          },
        ],
        entryRequirement: stated(
          "An honours degree in a computing or quantitative subject, with programming evidenced.",
          "Institution's admission pages",
          ON,
        ),
        prerequisites: stated(["Programming", "Mathematics"], "Programme page", ON),
        languageOfInstruction: "English",
        placement: unknown("No placement term is stated."),
        campus: "Galway",
      },
    ],
    notChecked: [
      "Whether this programme is Level 9 on the National Framework of Qualifications for the coming intake. It almost certainly is, and it decides whether post-study permission is 12 months or up to 24, so it is confirmed rather than assumed.",
      "Accommodation availability for the coming September, which in Galway runs out earlier than in Dublin relative to demand.",
    ],
  },

  {
    slug: "university-of-limerick",
    name: "University of Limerick",
    destination: "ireland",
    city: "Limerick",
    route: "Taught masters",
    type: "public",
    flagCode: "ie",
    initials: "UL",
    summary:
      "Built around a cooperative education model, so its programmes are more likely than most Irish ones to include a structured work placement. Whether a given placement is compatible with a Stamp 2 permission is a question to ask before applying, not after.",
    commission: IE_COMMISSION,
    highlights: {
      established: stated(1972, "Institution's own history page", ON),
      totalStudents: stated(18000, "Institution's published student statistics", ON),
      internationalStudents: stated(
        "Around a sixth of the student body",
        "Institution's published student statistics",
        ON,
      ),
      staffRatio: unknown(
        "Not published in a form comparable with the other institutions on this catalogue, so printing it next to them would invite a comparison the figures do not support.",
      ),
      acceptanceRate: unknown(
        "Not published at institution level. It varies enormously by programme, and a single institutional rate would say nothing useful about the course you are applying to.",
      ),
      accreditation: stated(
        "Recognised Irish degree-awarding body, programmes on the National Framework of Qualifications",
        "Quality and Qualifications Ireland",
        ON,
      ),
    },
    rankings: [
      {
        body: "QS World University Rankings",
        year: 2025,
        rank: "Inside the world top 450",
        scope: "World, all subjects",
        source: "QS published tables",
      },
    ],
    exams: [
      {
        exam: "IELTS Academic",
        undergraduate: stated("6.5 overall with no band below 6.0", "Institution's admission pages", ON),
        postgraduate: stated("6.5 overall with no band below 6.0", "Institution's admission pages", ON),
      },
      {
        exam: "TOEFL iBT",
        undergraduate: stated("90 with section minimums", "Institution's admission pages", ON),
        postgraduate: stated("90 with section minimums", "Institution's admission pages", ON),
      },
      {
        exam: "GRE",
        undergraduate: stated("Not required", "Institution's admission pages", ON),
        postgraduate: stated("Not required", "Institution's admission pages", ON),
      },
    ],
    tuitionNote: stated(
      "Full non-EU tuition, with the same pre-visa payment requirement as every Irish institution.",
      "Institution's published fee schedule",
      ON,
    ),
    costOfLivingCity: "cork",
    programmes: [
      {
        slug: "ul-msc-artificial-intelligence",
        universitySlug: "university-of-limerick",
        name: "MSc Artificial Intelligence",
        level: "masters",
        disciplines: ["Computer Science", "Data Science"],
        durationMonths: 12,
        feePerYear: stated(21000, "Institution's published international fee schedule", ON, FEE_QUALIFIER),
        currency: "EUR",
        feeQualifier: FEE_QUALIFIER,
        intakes: [
          {
            name: "September",
            applicationDeadline: "2027-06-30",
            teachingStarts: "2027-09-06",
            status: "not-yet-open",
            statusAsOf: ON,
            campus: "Limerick",
          },
        ],
        entryRequirement: stated(
          "An honours degree in computing, engineering, mathematics or a related quantitative subject.",
          "Institution's admission pages",
          ON,
        ),
        prerequisites: stated(["Programming", "Mathematics", "Statistics"], "Programme page", ON),
        languageOfInstruction: "English",
        placement: unknown(
          "This institution's cooperative education model means a placement may be available, and whether it is open to a student on a Stamp 2 permission is a question for the international office rather than an assumption.",
        ),
        campus: "Limerick",
      },
    ],
    notChecked: [
      "Whether this programme is Level 9 on the National Framework of Qualifications for the coming intake. It almost certainly is, and it decides whether post-study permission is 12 months or up to 24, so it is confirmed rather than assumed.",
      "Whether the cooperative placement is available to non-EU students, and under which immigration permission.",
    ],
  },

  {
    slug: "dublin-city-university",
    name: "Dublin City University",
    destination: "ireland",
    city: "Dublin",
    route: "Taught masters",
    type: "public",
    flagCode: "ie",
    initials: "DCU",
    summary:
      "A newer, technology-focused Dublin university with strong industry links, and a January intake this catalogue's other Dublin institutions do not offer.",
    commission: IE_COMMISSION,
    highlights: {
      established: stated(1980, ON_RECORD, RESEARCHED_ON),
      totalStudents: stated(20377, "Institution's own reporting, found through search", RESEARCHED_ON),
      internationalStudents: stated(
        "Over 3,800 students, from more than 90 countries, about 13 per cent of the student body",
        "Institution's own reporting, found through search",
        RESEARCHED_ON,
      ),
      staffRatio: unknown("Not published at institution level."),
      acceptanceRate: unknown("Not published at institution level."),
      accreditation: stated(
        "Recognised Irish university, quality assured by Quality and Qualifications Ireland",
        "Qualifications and Quality Ireland register",
        RESEARCHED_ON,
      ),
    },
    rankings: [
      {
        body: "QS World University Rankings",
        year: 2026,
        rank: "410th in the world",
        scope: "World, all subjects",
        source: "Institution's own news page announcing the QS 2026 result",
      },
    ],
    exams: [
      {
        exam: "IELTS Academic",
        undergraduate: unknown("Checked for the postgraduate route only this pass."),
        postgraduate: stated(
          "6.5 overall with no component below 6.0",
          "Reported consistently across independent admissions publications; the institution's own programme page was not directly read this pass",
          RESEARCHED_ON,
        ),
      },
    ],
    tuitionNote: stated(
      "Full international tuition, payable in two instalments. At least EUR 6,000 of it has to be shown as paid before the visa application, the same rule the rest of this Irish catalogue states.",
      "Reported consistently across independent fee-comparison publications; the institution's own fee page was not directly read this pass",
      RESEARCHED_ON,
    ),
    costOfLivingCity: "dublin",
    programmes: [
      {
        slug: "dcu-msc-computing",
        universitySlug: "dublin-city-university",
        name: "MSc in Computing",
        level: "masters",
        disciplines: ["Computer Science"],
        durationMonths: 12,
        feePerYear: stated(
          25000,
          "Reported consistently across independent fee-comparison publications; the institution's own fee page was not directly read this pass",
          RESEARCHED_ON,
        ),
        currency: "EUR",
        feeQualifier: FEE_QUALIFIER,
        intakes: [
          {
            name: "January",
            applicationDeadline: "2026-12-04",
            teachingStarts: "2027-01-01",
            status: "closing-soon",
            statusAsOf: RESEARCHED_ON,
            campus: "Glasnevin, Dublin",
          },
        ],
        entryRequirement: stated(
          "An honours degree equivalent to at least a Second Class Honours, Lower Division (2:2); some programme options ask for Upper Division (2:1).",
          "Reported consistently across independent admissions publications; the institution's own programme page was not directly read this pass",
          RESEARCHED_ON,
        ),
        prerequisites: unknown("Not checked this pass."),
        languageOfInstruction: "English",
        placement: unknown("Not checked this pass."),
        campus: "Glasnevin, Dublin",
      },
    ],
    notChecked: [
      "Whether this programme is Level 9 on the National Framework of Qualifications for the coming intake. It almost certainly is, and it decides whether post-study permission is 12 months or up to 24, so it is confirmed rather than assumed.",
      "The exact tuition figure and entry requirement wording: convergent-secondary this pass, not read directly off the institution's own pages.",
      "This January intake date is close; a September intake may also exist for this programme and was not checked this pass.",
    ],
  },

  {
    slug: "university-college-cork",
    name: "University College Cork",
    destination: "ireland",
    city: "Cork",
    route: "Taught masters",
    type: "public",
    flagCode: "ie",
    initials: "UCC",
    summary:
      "Ireland's second city, outside Dublin, which this catalogue's Galway and Limerick entries already show tends to mean lower rent for the same taught masters route.",
    commission: IE_COMMISSION,
    highlights: {
      established: stated(1845, ON_RECORD, RESEARCHED_ON),
      totalStudents: stated(19075, "Institution's own reporting, found through search", RESEARCHED_ON),
      internationalStudents: stated(
        "About 23 per cent of the student body",
        "Institution's own reporting, found through search",
        RESEARCHED_ON,
      ),
      staffRatio: unknown("Not published at institution level."),
      acceptanceRate: unknown("Not published at institution level."),
      accreditation: stated(
        "Recognised Irish university, quality assured by Quality and Qualifications Ireland",
        "Qualifications and Quality Ireland register",
        RESEARCHED_ON,
      ),
    },
    rankings: [
      {
        body: "QS World University Rankings",
        year: 2026,
        rank: "Inside the world top 250",
        scope: "World, all subjects",
        source: "The institution's own news page cited two different positions for two rankings editions found in the same pass (246th and 220th); the band both agree inside is printed rather than picking one",
      },
    ],
    exams: [
      {
        exam: "IELTS Academic",
        undergraduate: unknown("Checked for the postgraduate route only this pass."),
        postgraduate: stated(
          "6.5 overall is the commonly stated general figure; this session did not confirm the exact per-component minimum for this specific programme",
          "Reported across independent admissions publications; the institution's own programme page was not directly read for the exact score this pass",
          RESEARCHED_ON,
        ),
      },
    ],
    tuitionNote: stated(
      "Full international tuition, excluding the separate mandatory capitation fee (EUR 210). At least EUR 6,000 of the tuition has to be shown as paid before the visa application, the same rule the rest of this Irish catalogue states.",
      "Institution's own postgraduate fee schedule, fetched directly this pass",
      RESEARCHED_ON,
    ),
    costOfLivingCity: "cork",
    programmes: [
      {
        slug: "ucc-msc-data-science-and-analytics",
        universitySlug: "university-college-cork",
        name: "MSc Data Science and Analytics",
        level: "masters",
        disciplines: ["Data Science", "Computer Science"],
        durationMonths: 12,
        feePerYear: stated(
          28000,
          "Institution's own postgraduate fee schedule, fetched directly this pass: \"Data Science and Analytics - MSc (Non-EU Applications only): EUR 28,000\", excluding the separate EUR 210 capitation fee",
          RESEARCHED_ON,
        ),
        currency: "EUR",
        feeQualifier: FEE_QUALIFIER,
        intakes: [
          {
            name: "September",
            applicationDeadline: "2027-06-30",
            teachingStarts: "2027-09-01",
            status: "not-yet-open",
            statusAsOf: RESEARCHED_ON,
            campus: "Cork",
          },
        ],
        entryRequirement: stated(
          "A Bachelor's degree or its equivalent to an Irish honours degree, in a discipline with quantitative content.",
          "Reported consistently across independent admissions publications; the institution's own programme page was not directly read for the exact class this pass",
          RESEARCHED_ON,
        ),
        prerequisites: unknown("Not checked this pass."),
        languageOfInstruction: "English",
        placement: unknown("Not checked this pass."),
        campus: "Cork",
      },
    ],
    notChecked: [
      "Whether this programme is Level 9 on the National Framework of Qualifications for the coming intake. It almost certainly is, and it decides whether post-study permission is 12 months or up to 24, so it is confirmed rather than assumed.",
      "The exact degree class and IELTS component minimums: general figures reported here, not read off the programme's own admissions page this pass.",
      "The exact QS rank: two different positions were found for two rankings editions; the band both agree inside is printed instead.",
    ],
  },

  {
    slug: "maynooth-university",
    name: "Maynooth University",
    destination: "ireland",
    city: "Maynooth",
    route: "Taught masters",
    type: "public",
    flagCode: "ie",
    initials: "MU",
    summary:
      "A smaller campus town half an hour from Dublin by train, so rent runs below the city while a Dublin commute stays realistic. The smallest institution on this catalogue's Irish list by student numbers.",
    commission: IE_COMMISSION,
    highlights: {
      established: stated(1795, `${ON_RECORD}, as the date of the original college; the university itself was established in 1997`, RESEARCHED_ON),
      totalStudents: stated(12263, "Reported by independent ranking aggregators this pass; the institution's own statistics page was not directly read", RESEARCHED_ON),
      internationalStudents: stated(
        "About 15 per cent of the student body",
        "Reported by independent ranking aggregators this pass; the institution's own statistics page was not directly read",
        RESEARCHED_ON,
      ),
      staffRatio: unknown("Not published at institution level."),
      acceptanceRate: unknown("Not published at institution level."),
      accreditation: stated(
        "Recognised Irish university, quality assured by Quality and Qualifications Ireland",
        "Qualifications and Quality Ireland register",
        RESEARCHED_ON,
      ),
    },
    rankings: [
      {
        body: "QS World University Rankings",
        year: 2026,
        rank: "771st to 780th in the world",
        scope: "World, all subjects",
        source: "Reported by independent ranking aggregators this pass; the institution's own rankings page was not directly read",
      },
    ],
    exams: [
      {
        exam: "IELTS Academic",
        undergraduate: unknown("Checked for the postgraduate route only this pass."),
        postgraduate: unknown(
          "This session's search results gave the general international-fee band but not a confirmed IELTS figure for this specific programme. Left unknown rather than guessed from a neighbouring institution's requirement.",
        ),
      },
    ],
    tuitionNote: stated(
      "Full non-EU tuition, reported by independent sources at EUR 15,000 or EUR 18,000 for the computing programme. The two did not agree and the institution's own fee schedule was not opened to settle it, so no single fee is printed below.",
      "Reported across independent fee-comparison publications; the institution's own fee schedule PDF was found but not directly opened this pass",
      RESEARCHED_ON,
    ),
    costOfLivingCity: "dublin",
    programmes: [
      {
        slug: "maynooth-msc-computer-science-applied",
        universitySlug: "maynooth-university",
        name: "MSc Computer Science (Applied)",
        level: "masters",
        disciplines: ["Computer Science"],
        durationMonths: 24,
        feePerYear: unknown(
          "Two independent sources disagreed on the year-one fee for this programme, EUR 15,000 against EUR 18,000, and the institution's own fee schedule was not opened to settle it. Printing either number as the fee would be choosing one of two reports, so no figure is shown until the institution's own schedule confirms it.",
        ),
        currency: "EUR",
        feeQualifier: FEE_QUALIFIER,
        intakes: [
          {
            name: "September",
            applicationDeadline: "2027-06-30",
            teachingStarts: "2027-09-01",
            status: "not-yet-open",
            statusAsOf: RESEARCHED_ON,
            campus: "Maynooth",
          },
        ],
        entryRequirement: stated(
          "An honours degree in computer science or a closely related quantitative subject.",
          "Reported consistently across independent admissions publications; the institution's own programme page was not directly read this pass",
          RESEARCHED_ON,
        ),
        prerequisites: unknown("Not checked this pass."),
        languageOfInstruction: "English",
        placement: unknown("Not checked this pass."),
        campus: "Maynooth",
      },
    ],
    notChecked: [
      "The exact year-one tuition fee: two independent sources disagreed (EUR 15,000 against EUR 18,000) and the institution's own fee schedule was not directly opened to resolve it this pass.",
      "Whether this programme is Level 9 on the National Framework of Qualifications for the coming intake, which decides 12 versus up to 24 months of post-study permission.",
      "The exact IELTS component minimums for this specific programme.",
    ],
  },

  {
    slug: "technological-university-dublin",
    name: "Technological University Dublin",
    destination: "ireland",
    city: "Dublin",
    route: "Taught masters",
    type: "public",
    flagCode: "ie",
    initials: "TUD",
    summary:
      "Ireland's first technological university, formed from a 2019 merger, with a practical and industry-linked style rather than the older research-university tradition of this catalogue's other Dublin entries.",
    commission: IE_COMMISSION,
    highlights: {
      established: stated(2019, `${ON_RECORD}, as the date of the university's formation by merger`, RESEARCHED_ON),
      totalStudents: stated(28000, "Institution's own reporting, found through search", RESEARCHED_ON),
      internationalStudents: stated(
        "More than 3,000 students, of over 140 nationalities",
        "Institution's own reporting, found through search",
        RESEARCHED_ON,
      ),
      staffRatio: unknown("Not published at institution level."),
      acceptanceRate: unknown("Not published at institution level."),
      accreditation: stated(
        "Recognised Irish university, quality assured by Quality and Qualifications Ireland",
        "Qualifications and Quality Ireland register",
        RESEARCHED_ON,
      ),
    },
    rankings: [
      {
        body: "QS World University Rankings",
        year: 2027,
        rank: "791st to 800th in the world",
        scope: "World, all subjects",
        source: "Reported by independent ranking aggregators this pass; the institution's own rankings page was not directly read",
      },
    ],
    exams: [
      {
        exam: "IELTS Academic",
        undergraduate: unknown("Checked for the postgraduate route only this pass."),
        postgraduate: unknown(
          "Not confirmed for this specific programme this pass. Left unknown rather than guessed from a neighbouring institution's requirement.",
        ),
      },
    ],
    tuitionNote: stated(
      "Full non-EU tuition, in the same broad range as this catalogue's other Dublin institutions.",
      "Reported across independent fee-comparison publications; the institution's own fee schedule was not directly read this pass",
      RESEARCHED_ON,
    ),
    costOfLivingCity: "dublin",
    programmes: [
      {
        slug: "tud-msc-computer-science-data-science",
        universitySlug: "technological-university-dublin",
        name: "MSc Computer Science (Data Science)",
        level: "masters",
        disciplines: ["Computer Science", "Data Science"],
        durationMonths: 12,
        feePerYear: stated(
          21750,
          "Reported by an independent fee-comparison publication as the year-one fee; the institution's own fee schedule was not directly read to confirm it this pass",
          RESEARCHED_ON,
        ),
        currency: "EUR",
        feeQualifier: FEE_QUALIFIER,
        intakes: [
          {
            name: "September",
            applicationDeadline: "2027-06-30",
            teachingStarts: "2027-09-01",
            status: "not-yet-open",
            statusAsOf: RESEARCHED_ON,
            campus: "Grangegorman, Dublin",
          },
        ],
        entryRequirement: stated(
          "An honours degree in computer science or a closely related quantitative subject.",
          "Reported consistently across independent admissions publications; the institution's own programme page was not directly read this pass",
          RESEARCHED_ON,
        ),
        prerequisites: unknown("Not checked this pass."),
        languageOfInstruction: "English",
        placement: unknown("Not checked this pass."),
        campus: "Grangegorman, Dublin",
      },
    ],
    notChecked: [
      "The exact year-one tuition fee, reported by one independent source only and not confirmed against the institution's own fee schedule this pass.",
      "Whether this programme is Level 9 on the National Framework of Qualifications for the coming intake, which decides 12 versus up to 24 months of post-study permission.",
      "The exact IELTS requirement for this specific programme.",
    ],
  },

  {
    slug: "national-college-of-ireland",
    name: "National College of Ireland",
    destination: "ireland",
    city: "Dublin",
    route: "Taught masters",
    type: "private",
    flagCode: "ie",
    initials: "NCI",
    summary:
      "A smaller, private Dublin college with degree-awarding powers, on the docklands campus, and one of the most commonly shortlisted routes into a data analytics masters from India specifically because of its size and fee.",
    commission: IE_COMMISSION,
    highlights: {
      established: unknown("Not confirmed on the institution's own page this pass; reported variously as a 1951 or 1972 founding by different independent sources, and the discrepancy was not resolved."),
      totalStudents: stated(6000, "Reported by an independent source this pass; the institution's own statistics page was not directly read", RESEARCHED_ON),
      internationalStudents: unknown("Not confirmed by any source read this pass."),
      staffRatio: unknown("Not published at institution level."),
      acceptanceRate: unknown("Not published at institution level."),
      accreditation: stated(
        "Independent, QQI-accredited Irish higher education institution, programmes on the National Framework of Qualifications",
        "Quality and Qualifications Ireland",
        RESEARCHED_ON,
      ),
    },
    rankings: [],
    exams: [
      {
        exam: "IELTS Academic",
        undergraduate: unknown("Checked for the postgraduate route only this pass."),
        postgraduate: stated(
          "6.5 overall",
          "Reported consistently across independent admissions publications; the institution's own programme page was not directly read for the exact component minimums this pass",
          RESEARCHED_ON,
        ),
      },
    ],
    tuitionNote: stated(
      "Full international tuition, at the lower end of this catalogue's Irish range, with the same pre-visa payment requirement as the rest of this Irish catalogue.",
      "Reported across independent fee-comparison publications for September 2026 entry; the institution's own fee page was attempted this pass and did not return the programme-specific figure",
      RESEARCHED_ON,
    ),
    costOfLivingCity: "dublin",
    programmes: [
      {
        slug: "nci-msc-data-analytics",
        universitySlug: "national-college-of-ireland",
        name: "MSc in Data Analytics",
        level: "masters",
        disciplines: ["Data Science"],
        durationMonths: 12,
        feePerYear: stated(
          17000,
          "Reported by an independent source for September 2026 entry; the institution's own fee page was attempted this pass and did not return the programme-specific figure",
          RESEARCHED_ON,
        ),
        currency: "EUR",
        feeQualifier: FEE_QUALIFIER,
        intakes: [
          {
            name: "September",
            applicationDeadline: "2027-06-30",
            teachingStarts: "2027-09-01",
            status: "not-yet-open",
            statusAsOf: RESEARCHED_ON,
            campus: "IFSC, Dublin",
          },
        ],
        entryRequirement: stated(
          "A Level 8 honours degree (Second Class Honours, Grade 2, or equivalent) in a cognate discipline, with technical or mathematical problem-solving evidenced in prior study.",
          "Reported consistently across independent admissions publications; the institution's own programme page was not directly read this pass",
          RESEARCHED_ON,
        ),
        prerequisites: unknown("Not checked this pass."),
        languageOfInstruction: "English",
        placement: unknown("Not checked this pass."),
        campus: "IFSC, Dublin",
      },
    ],
    notChecked: [
      "This institution has no independently published international ranking that this session found; the field is left empty rather than filled with an unrelated one.",
      "The founding date: two different years were reported by different independent sources and neither was confirmed against the institution's own page.",
      "Whether this programme is Level 9 on the National Framework of Qualifications for the coming intake, which decides 12 versus up to 24 months of post-study permission.",
      "The exact tuition fee and IELTS component minimums: the institution's own fee and programme pages did not return this detail to this session's fetch.",
    ],
  },

  {
    slug: "munster-technological-university",
    name: "Munster Technological University",
    destination: "ireland",
    city: "Cork",
    route: "Taught masters",
    type: "public",
    flagCode: "ie",
    initials: "MTU",
    summary:
      "Formed by a 2021 merger of Cork and Tralee's institutes of technology, and this catalogue's second Cork institution alongside UCC, with a scholarship that brings its own fee below UCC's for the same subject area.",
    commission: IE_COMMISSION,
    highlights: {
      established: stated(2021, `${ON_RECORD}, as the date of the university's formation by merger`, RESEARCHED_ON),
      totalStudents: stated(18000, "Reported by an independent source this pass; the institution's own statistics page was not directly read", RESEARCHED_ON),
      internationalStudents: stated(
        "More than 1,000 students, from over 125 countries",
        "Reported by an independent source this pass; the institution's own statistics page was not directly read",
        RESEARCHED_ON,
      ),
      staffRatio: unknown("Not published at institution level."),
      acceptanceRate: unknown("Not published at institution level."),
      accreditation: stated(
        "Recognised Irish technological university, quality assured by Quality and Qualifications Ireland",
        "Qualifications and Quality Ireland register",
        RESEARCHED_ON,
      ),
    },
    rankings: [],
    exams: [
      {
        exam: "IELTS Academic",
        undergraduate: unknown("Checked for the postgraduate route only this pass."),
        postgraduate: stated(
          "6.0 overall",
          "Reported consistently across independent admissions publications; the institution's own programme page was not directly read for the exact component minimums this pass",
          RESEARCHED_ON,
        ),
      },
    ],
    tuitionNote: stated(
      "Full international tuition, confirmed on the institution's own fee page for this specific programme, before a stated EUR 3,000 institutional scholarship that some applicants may be eligible for.",
      "Institution's own fee page, fetched directly this pass",
      RESEARCHED_ON,
    ),
    costOfLivingCity: "cork",
    programmes: [
      {
        slug: "mtu-msc-data-science-and-analytics",
        universitySlug: "munster-technological-university",
        name: "MSc Data Science and Analytics",
        level: "masters",
        disciplines: ["Data Science", "Computer Science"],
        durationMonths: 12,
        feePerYear: stated(
          15000,
          "Institution's own fee page, fetched directly this pass: EUR 15,000 before scholarships, or EUR 12,000 after the institution's own stated EUR 3,000 scholarship for applicants who qualify",
          RESEARCHED_ON,
        ),
        currency: "EUR",
        feeQualifier: FEE_QUALIFIER,
        intakes: [
          {
            name: "September",
            applicationDeadline: "2027-05-31",
            teachingStarts: "2027-09-01",
            status: "not-yet-open",
            statusAsOf: RESEARCHED_ON,
            campus: "Bishopstown, Cork",
          },
        ],
        entryRequirement: stated(
          "A 2:1 Level 8 honours degree, or a 2:2 with at least three years of relevant professional experience.",
          "Reported consistently across independent admissions publications; the institution's own programme page was not directly read for this specific wording this pass",
          RESEARCHED_ON,
        ),
        prerequisites: unknown("Not checked this pass."),
        languageOfInstruction: "English",
        placement: unknown("Not checked this pass."),
        campus: "Bishopstown, Cork",
      },
    ],
    notChecked: [
      "This institution has no independently published international ranking that this session found; the field is left empty rather than filled with an unrelated one.",
      "Whether this programme is Level 9 on the National Framework of Qualifications for the coming intake, which decides 12 versus up to 24 months of post-study permission.",
      "The exact eligibility criteria for the EUR 3,000 scholarship named on the institution's own fee page.",
    ],
  },

  {
    slug: "dublin-business-school",
    name: "Dublin Business School",
    destination: "ireland",
    city: "Dublin",
    route: "Taught masters",
    type: "private",
    flagCode: "ie",
    initials: "DBS",
    summary:
      "Ireland's largest private college, in the city centre, with a fee band that sits between this catalogue's Dublin universities and its other private entries.",
    commission: IE_COMMISSION,
    highlights: {
      established: stated(
        1975,
        "Reported consistently across independent sources as the founding of the original Accountancy and Business College; the institution's own history page was not directly read this pass",
        RESEARCHED_ON,
      ),
      totalStudents: stated(
        9000,
        "Reported by independent sources this pass; the institution's own statistics page was not directly read",
        RESEARCHED_ON,
      ),
      internationalStudents: stated(
        "More than 2,700 students, from over 70 countries",
        "Reported by independent sources this pass; the institution's own statistics page was not directly read",
        RESEARCHED_ON,
      ),
      staffRatio: unknown("Not published at institution level."),
      acceptanceRate: unknown("Not published at institution level."),
      accreditation: stated(
        "Independent, QQI-accredited Irish higher education institution, programmes on the National Framework of Qualifications",
        "Qualifications and Quality Ireland register",
        RESEARCHED_ON,
      ),
    },
    rankings: [],
    exams: [
      {
        exam: "IELTS Academic",
        undergraduate: unknown("Checked for the postgraduate route only this pass."),
        postgraduate: stated(
          "6.5 overall with no band below 6.0",
          "Reported consistently across independent admissions publications; the institution's own programme page returned an access error to this session's fetch",
          RESEARCHED_ON,
        ),
      },
    ],
    tuitionNote: stated(
      "Full international tuition, with the same pre-visa payment requirement as the rest of this Irish catalogue.",
      "Reported across independent fee-comparison publications for 2026/27 entry; the institution's own fee sheet and programme page both returned an access error to this session's fetch",
      RESEARCHED_ON,
    ),
    costOfLivingCity: "dublin",
    programmes: [
      {
        slug: "dbs-msc-data-analytics",
        universitySlug: "dublin-business-school",
        name: "MSc Data Analytics",
        level: "masters",
        disciplines: ["Data Science"],
        durationMonths: 12,
        feePerYear: stated(
          15575,
          "Reported consistently across independent fee-comparison publications for 2026/27 entry; the institution's own fee sheet returned an access error to this session's fetch",
          RESEARCHED_ON,
        ),
        currency: "EUR",
        feeQualifier: FEE_QUALIFIER,
        intakes: [
          {
            name: "September",
            applicationDeadline: "2027-06-30",
            teachingStarts: "2027-09-01",
            status: "not-yet-open",
            statusAsOf: RESEARCHED_ON,
            campus: "Dublin city centre",
          },
        ],
        entryRequirement: stated(
          "A Level 8 honours degree with at least a Second Class Honours, Grade 2 (2:2), in a cognate area.",
          "Reported consistently across independent admissions publications; the institution's own programme page returned an access error to this session's fetch",
          RESEARCHED_ON,
        ),
        prerequisites: unknown("Not checked this pass."),
        languageOfInstruction: "English",
        placement: unknown("Not checked this pass."),
        campus: "Dublin city centre",
      },
    ],
    notChecked: [
      "This institution has no independently published international ranking that this session found; the field is left empty rather than filled with an unrelated one.",
      "Whether this programme is Level 9 on the National Framework of Qualifications for the coming intake, which decides 12 versus up to 24 months of post-study permission.",
      "Every figure above is convergent-secondary: the institution's own fee sheet and programme page both refused this session's fetch, so nothing here was read directly off dbs.ie.",
    ],
  },

  {
    slug: "griffith-college-dublin",
    name: "Griffith College Dublin",
    destination: "ireland",
    city: "Dublin",
    route: "Taught masters",
    type: "private",
    flagCode: "ie",
    initials: "GCD",
    summary:
      "A private Dublin college on a single south-city campus, with the lowest headline fee on this catalogue's Irish list, and a set of separate administrative charges on top of it that the headline does not show.",
    commission: IE_COMMISSION,
    highlights: {
      established: stated(
        1974,
        "Reported consistently across independent sources; the institution's own history page was not directly read this pass",
        RESEARCHED_ON,
      ),
      totalStudents: stated(
        8000,
        "Reported by independent sources as just under 8,000 this pass; the institution's own statistics page was not directly read",
        RESEARCHED_ON,
      ),
      internationalStudents: stated(
        "About 1,400 students, from over 77 countries",
        "Reported by independent sources this pass; the institution's own statistics page was not directly read",
        RESEARCHED_ON,
      ),
      staffRatio: unknown("Not published at institution level."),
      acceptanceRate: unknown("Not published at institution level."),
      accreditation: stated(
        "Independent, QQI-accredited Irish higher education institution, programmes on the National Framework of Qualifications",
        "Qualifications and Quality Ireland register",
        RESEARCHED_ON,
      ),
    },
    rankings: [],
    exams: [
      {
        exam: "IELTS Academic",
        undergraduate: unknown("Checked for the postgraduate route only this pass."),
        postgraduate: stated(
          "6.5 overall with no band below 6.0",
          "Reported by independent admissions publications; the institution's own programme page, fetched directly this pass, names the Duolingo test as accepted but does not print an IELTS figure",
          RESEARCHED_ON,
          "One independent source reported 6.0 overall instead; the higher, more commonly repeated figure is shown and the discrepancy is not resolved this pass.",
        ),
      },
    ],
    tuitionNote: stated(
      "Full international tuition, reported by independent sources at EUR 13,000 or EUR 14,000, plus separate charges neither figure includes: a EUR 200 student services fee each year, a EUR 250 academic administration fee each September, and a 2 per cent learner protection charge. The same pre-visa payment requirement applies as across this Irish catalogue.",
      "Reported across independent fee-comparison publications; the institution's own programme page, fetched directly this pass, defers to a separate non-EU fees section that was not read",
      RESEARCHED_ON,
    ),
    costOfLivingCity: "dublin",
    programmes: [
      {
        slug: "griffith-msc-big-data-management-and-analytics",
        universitySlug: "griffith-college-dublin",
        name: "MSc in Big Data Management and Analytics",
        level: "masters",
        disciplines: ["Data Science", "Computer Science"],
        durationMonths: 12,
        feePerYear: unknown(
          "Two independent sources disagreed on the year-one fee for this programme, EUR 13,000 against EUR 14,000, and the institution's own non-EU fees section was not read to settle it. Printing either number as the fee would be choosing one of two reports, so no figure is shown until the institution's own schedule confirms it.",
        ),
        currency: "EUR",
        feeQualifier: FEE_QUALIFIER,
        intakes: [
          {
            name: "September",
            applicationDeadline: "2027-06-30",
            teachingStarts: "2027-09-01",
            status: "not-yet-open",
            statusAsOf: RESEARCHED_ON,
            campus: "Dublin",
          },
        ],
        entryRequirement: stated(
          "A 2:2 Level 8 honours degree in Computing Science, or a 2:2 Higher Diploma in Computing or a related discipline, or the international equivalent.",
          "Institution's own programme page, fetched directly this pass",
          RESEARCHED_ON,
        ),
        prerequisites: unknown("Not checked this pass."),
        languageOfInstruction: "English",
        placement: unknown("Not checked this pass."),
        campus: "Dublin",
      },
    ],
    notChecked: [
      "This institution has no independently published international ranking that this session found; the field is left empty rather than filled with an unrelated one.",
      "Whether this programme is Level 9 on the National Framework of Qualifications for the coming intake, which decides 12 versus up to 24 months of post-study permission.",
      "The exact tuition fee: two independent sources disagreed (EUR 13,000 against EUR 14,000) and the institution's own non-EU fees section was not read to resolve it this pass.",
      "The exact IELTS figure: the institution's own programme page does not print one, and independent sources disagreed between 6.0 and 6.5.",
    ],
  },

  {
    slug: "atlantic-technological-university",
    name: "Atlantic Technological University",
    destination: "ireland",
    city: "Letterkenny",
    route: "Taught masters",
    type: "public",
    flagCode: "ie",
    initials: "ATU",
    summary:
      "A multi-campus technological university across Ireland's west and north-west, formed by a 2022 merger of the Galway-Mayo, Sligo and Letterkenny institutes of technology, with rents well below Dublin on every campus.",
    commission: IE_COMMISSION,
    highlights: {
      established: stated(2022, `${ON_RECORD}, as the date of the university's formation by merger`, RESEARCHED_ON),
      totalStudents: unknown(
        "Independent sources disagreed within this session's search results, reporting figures between about 20,000 and 30,000; the institution's own statistics page was not directly read to resolve which is current.",
      ),
      internationalStudents: stated(
        "More than 3,000 students, from over 115 countries",
        "Reported by independent sources this pass; the institution's own statistics page was not directly read",
        RESEARCHED_ON,
      ),
      staffRatio: unknown("Not published at institution level."),
      acceptanceRate: unknown("Not published at institution level."),
      accreditation: stated(
        "Recognised Irish technological university, quality assured by Quality and Qualifications Ireland",
        "Qualifications and Quality Ireland register",
        RESEARCHED_ON,
      ),
    },
    rankings: [
      {
        body: "QS World University Rankings",
        year: 2024,
        rank: "851st to 900th in the world",
        scope: "World, all subjects",
        source: "Reported by independent ranking aggregators this pass; the 2024 edition is the most recent in which this session found the institution placed, and its own rankings page was not directly read",
      },
    ],
    exams: [
      {
        exam: "IELTS Academic",
        undergraduate: unknown("Checked for the postgraduate route only this pass."),
        postgraduate: stated(
          "6.0 overall",
          "Institution's own programme page, fetched directly this pass",
          RESEARCHED_ON,
        ),
      },
    ],
    tuitionNote: stated(
      "Full international tuition, confirmed on the institution's own fee page as the standard non-EU full-time postgraduate rate for 2026/27, with the same pre-visa payment requirement as the rest of this Irish catalogue.",
      "Institution's own postgraduate fee page, fetched directly this pass",
      RESEARCHED_ON,
    ),
    costOfLivingCity: "cork",
    programmes: [
      {
        slug: "atu-msc-data-science",
        universitySlug: "atlantic-technological-university",
        name: "MSc Data Science",
        level: "masters",
        disciplines: ["Data Science", "Computer Science"],
        durationMonths: 12,
        feePerYear: stated(
          14000,
          "Institution's own programme page and postgraduate fee page, both fetched directly this pass: \"The current full-time Postgraduate Course fee for Non-EU Students (2026/2027) is EUR 14,000\"",
          RESEARCHED_ON,
        ),
        currency: "EUR",
        feeQualifier: FEE_QUALIFIER,
        intakes: [
          {
            name: "September",
            applicationDeadline: "2027-06-30",
            teachingStarts: "2027-09-01",
            status: "not-yet-open",
            statusAsOf: RESEARCHED_ON,
            campus: "Letterkenny, Donegal",
          },
        ],
        entryRequirement: stated(
          "An honours degree with first or second class honours, or an equivalent qualification; relevant experience may be considered through Recognition of Prior Learning.",
          "Institution's own programme page, fetched directly this pass",
          RESEARCHED_ON,
        ),
        prerequisites: unknown("Not checked this pass."),
        languageOfInstruction: "English",
        placement: unknown("Not checked this pass."),
        campus: "Letterkenny, Donegal",
      },
    ],
    notChecked: [
      "Whether this programme is Level 9 on the National Framework of Qualifications for the coming intake, which decides 12 versus up to 24 months of post-study permission.",
      "Total student count: independent sources disagreed by a wide margin and the institution's own statistics page was not directly read to resolve it this pass.",
      "The QS position shown is from the 2024 edition; no placing in a more recent edition was found this pass.",
      "Cost of living: Letterkenny is not one of the cities modelled in the cost of living calculator; the Cork figure is linked as the nearest outside-Dublin proxy, and Letterkenny rents run below it.",
    ],
  },

  {
    slug: "south-east-technological-university",
    name: "South East Technological University",
    destination: "ireland",
    city: "Carlow",
    route: "Taught masters",
    type: "public",
    flagCode: "ie",
    initials: "SETU",
    summary:
      "A technological university across Ireland's south-east, formed by a 2022 merger of the Waterford and Carlow institutes of technology, on campuses where rent runs well below Dublin.",
    commission: IE_COMMISSION,
    highlights: {
      established: stated(2022, `${ON_RECORD}, as the date of the university's formation by merger`, RESEARCHED_ON),
      totalStudents: unknown(
        "Independent sources disagreed within this session's search results, reporting figures between about 18,500 and 21,000 for different years; the institution's own statistics page was not directly read to resolve which is current.",
      ),
      internationalStudents: stated(
        "Reported as more than 560 students, from over 120 countries",
        "Reported by one independent source this pass; the institution's own statistics page was not directly read",
        RESEARCHED_ON,
      ),
      staffRatio: unknown("Not published at institution level."),
      acceptanceRate: unknown("Not published at institution level."),
      accreditation: stated(
        "Recognised Irish technological university, quality assured by Quality and Qualifications Ireland",
        "Qualifications and Quality Ireland register",
        RESEARCHED_ON,
      ),
    },
    rankings: [
      {
        body: "QS World University Rankings: Europe",
        year: 2026,
        rank: "651st to 700th in Europe",
        scope: "Europe",
        source: "Reported by independent ranking aggregators this pass; no placing in the world (all subjects) table was found, and the institution's own rankings page was not directly read",
      },
    ],
    exams: [
      {
        exam: "IELTS Academic",
        undergraduate: unknown("Checked for the postgraduate route only this pass."),
        postgraduate: stated(
          "6.0 overall",
          "Reported consistently across independent admissions publications; the institution's own programme page returned an access error to this session's fetch",
          RESEARCHED_ON,
        ),
      },
    ],
    tuitionNote: stated(
      "Full international tuition, with the same pre-visa payment requirement as the rest of this Irish catalogue.",
      "Reported consistently across independent fee-comparison publications; the institution's own programme page returned an access error to this session's fetch",
      RESEARCHED_ON,
    ),
    costOfLivingCity: "cork",
    programmes: [
      {
        slug: "setu-msc-data-science",
        universitySlug: "south-east-technological-university",
        name: "MSc in Data Science",
        level: "masters",
        disciplines: ["Data Science", "Computer Science"],
        durationMonths: 12,
        feePerYear: stated(
          15000,
          "Reported consistently across independent fee-comparison publications; the institution's own programme page returned an access error to this session's fetch",
          RESEARCHED_ON,
        ),
        currency: "EUR",
        feeQualifier: FEE_QUALIFIER,
        intakes: [
          {
            name: "September",
            applicationDeadline: "2027-06-01",
            teachingStarts: "2027-09-10",
            status: "not-yet-open",
            statusAsOf: RESEARCHED_ON,
            campus: "Carlow",
          },
        ],
        entryRequirement: stated(
          "A Level 8 honours degree with at least a Second Class Honours, Grade 2 (2:2), in computer science, mathematical sciences, or a degree with strong numerate content such as engineering, finance, physics, biosciences or economics.",
          "Reported consistently across independent admissions publications; the institution's own programme page returned an access error to this session's fetch",
          RESEARCHED_ON,
        ),
        prerequisites: unknown("Not checked this pass."),
        languageOfInstruction: "English",
        placement: unknown("Not checked this pass."),
        campus: "Carlow",
      },
    ],
    notChecked: [
      "Whether this programme is Level 9 on the National Framework of Qualifications for the coming intake, which decides 12 versus up to 24 months of post-study permission.",
      "Every figure above is convergent-secondary: the institution's own programme page refused this session's fetch, so nothing here was read directly off setu.ie.",
      "The application deadline: one independent source gave 1 June for non-EU applicants and another gave late August; the earlier date is shown so nobody plans around the later one.",
      "Cost of living: Carlow is not one of the cities modelled in the cost of living calculator; the Cork figure is linked as the nearest outside-Dublin proxy, and Carlow rents run below it.",
    ],
  },
];
