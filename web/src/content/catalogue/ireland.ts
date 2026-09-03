import { stated, unknown, type University } from "./types";

const ON = "2026-09-03";

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
];
