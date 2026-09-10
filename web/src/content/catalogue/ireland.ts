import { stated, unknown, type University } from "./types";

const ON = "2026-09-03";
/** When the entries below Limerick, added later, were actually looked up. */
const RESEARCHED_ON = "2026-09-10";

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
 * Every programme here carries its NFQ level, because that single field decides
 * whether the applicant gets 12 months of post-study permission or 24, and it
 * is the fact our own site published incorrectly until this week.
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
      established: stated(1980, "Institution's own history page", RESEARCHED_ON),
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
      established: stated(1845, "Institution's own history page", RESEARCHED_ON),
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
];
