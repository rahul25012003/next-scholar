import { stated, unknown, type University } from "./types";

const ON = "2026-09-03";
/** When Edinburgh, below, was actually looked up — a real later date, not backdated to match the rest of the file. */
const RESEARCHED_ON = "2026-09-10";

const FEE_QUALIFIER =
  "Indicative annual tuition for an international student, rounded to the nearest thousand from the institution's published fee schedule. The programme's own fee page governs, and fees are set per intake.";

/** Edinburgh's own fee tool would not render for this session's fetch; see the field's own source note. */
const EDINBURGH_FEE_QUALIFIER =
  "Indicative annual tuition for an international student, reported consistently across independent fee-comparison sources rather than read directly off the institution's own fee tool. The programme's own fee page governs, and fees are set per intake.";

const UK_COMMISSION = {
  display: "₹1.5L to ₹2.5L",
  lowInr: 150000,
  highInr: 250000,
  status: "unverified" as const,
  source: "market-estimate" as const,
  note: "A market typical band for a UK institution, not a contract term and not confirmed by this university. It is published as an estimate because publishing nothing is how the industry hides it.",
};

/**
 * The United Kingdom.
 *
 * Ten institutions across the range an Indian applicant actually shortlists,
 * from a Russell Group university with a high fee to a post-92 with a
 * substantially lower one and a placement year. Every one of them pays agents,
 * and every one of them carries the same unverified band, because no university
 * has yet confirmed a figure in writing or permitted its publication.
 */
export const ukUniversities: University[] = [
  {
    slug: "university-of-manchester",
    name: "The University of Manchester",
    destination: "united-kingdom",
    city: "Manchester",
    route: "Taught masters",
    type: "public",
    flagCode: "gb",
    initials: "UoM",
    summary:
      "A large Russell Group university outside London, which is the combination most Indian postgraduate applicants are looking for: the maintenance requirement is the lower non-London figure and the rent follows it.",
    commission: UK_COMMISSION,
    highlights: {
      established: stated(1824, "Institution's own history page. The date of its earliest predecessor.", ON),
      totalStudents: stated(45000, "Institution's published student statistics", ON),
      internationalStudents: stated(
        "Roughly a third of the student body",
        "Institution's published student statistics",
        ON,
      ),
      staffRatio: unknown(
        "Published per faculty rather than institution-wide, and averaging the faculties would be our arithmetic rather than their figure.",
      ),
      acceptanceRate: unknown(
        "Not published at institution level. It varies enormously by programme, and a single institutional rate would say nothing useful about the course you are applying to.",
      ),
      accreditation: stated(
        "Recognised UK degree-awarding body, regulated by the Office for Students",
        "Office for Students register",
        ON,
      ),
    },
    rankings: [
      {
        body: "QS World University Rankings",
        year: 2025,
        rank: "Inside the world top 40",
        scope: "World, all subjects",
        source: "QS published tables",
      },
      {
        body: "THE World University Rankings",
        year: 2025,
        rank: "Inside the world top 60",
        scope: "World, all subjects",
        source: "Times Higher Education published tables",
      },
    ],
    exams: [
      {
        exam: "IELTS Academic",
        undergraduate: stated("6.0 to 6.5 overall, varying by programme", "Institution's admission pages", ON),
        postgraduate: stated(
          "6.5 overall with 6.0 in each component is the common condition; some programmes require 7.0",
          "Institution's admission pages",
          ON,
        ),
      },
      {
        exam: "TOEFL iBT",
        undergraduate: stated("80 to 90, varying by programme", "Institution's admission pages", ON),
        postgraduate: stated("90 with section minimums on most programmes", "Institution's admission pages", ON),
      },
      {
        exam: "GRE",
        undergraduate: stated("Not required", "Institution's admission pages", ON),
        postgraduate: stated(
          "Not required by most taught programmes. A few quantitative ones ask for it and say so",
          "Institution's admission pages",
          ON,
        ),
      },
      {
        exam: "GMAT",
        undergraduate: stated("Not required", "Institution's admission pages", ON),
        postgraduate: stated("Required for the MBA. Not required for most taught Master's", "Institution's admission pages", ON),
      },
    ],
    tuitionNote: stated(
      "Full international tuition, set per programme and per intake. A deposit is normally required to release the CAS, and the balance outstanding on the CAS is added to the maintenance funds you have to evidence.",
      "Institution's published fee schedule, and UKVI Appendix Finance",
      ON,
    ),
    costOfLivingCity: "manchester",
    programmes: [
      {
        slug: "manchester-msc-advanced-computer-science",
        universitySlug: "university-of-manchester",
        name: "MSc Advanced Computer Science",
        level: "masters",
        disciplines: ["Computer Science"],
        durationMonths: 12,
        feePerYear: stated(32000, "Institution's published international fee schedule", ON, FEE_QUALIFIER),
        currency: "GBP",
        feeQualifier: FEE_QUALIFIER,
        intakes: [
          {
            name: "September",
            applicationDeadline: "2027-06-30",
            teachingStarts: "2027-09-20",
            status: "not-yet-open",
            statusAsOf: ON,
            campus: "Manchester",
          },
        ],
        entryRequirement: stated(
          "An upper second class honours degree or its overseas equivalent in computer science. For Indian applicants this is commonly stated as 60 to 70 per cent depending on the institution's own recognition list.",
          "Institution's admission pages",
          ON,
        ),
        prerequisites: stated(
          ["Programming", "Algorithms and data structures", "Mathematics for computing"],
          "Programme page",
          ON,
        ),
        languageOfInstruction: "English",
        placement: unknown("No placement year is stated on this one year taught programme."),
        campus: "Manchester",
      },
      {
        slug: "manchester-msc-mechanical-engineering-design",
        universitySlug: "university-of-manchester",
        name: "MSc Mechanical Engineering Design",
        level: "masters",
        disciplines: ["Engineering", "Mechanical Engineering"],
        durationMonths: 12,
        feePerYear: stated(33000, "Institution's published international fee schedule", ON, FEE_QUALIFIER),
        currency: "GBP",
        feeQualifier: FEE_QUALIFIER,
        intakes: [
          {
            name: "September",
            applicationDeadline: "2027-06-30",
            teachingStarts: "2027-09-20",
            status: "not-yet-open",
            statusAsOf: ON,
            campus: "Manchester",
          },
        ],
        entryRequirement: stated(
          "An upper second class honours degree or overseas equivalent in mechanical engineering or a closely related discipline.",
          "Institution's admission pages",
          ON,
        ),
        prerequisites: unknown(
          "The programme page states a degree discipline rather than a list of named prerequisite modules.",
        ),
        languageOfInstruction: "English",
        placement: unknown("No placement term is stated."),
        campus: "Manchester",
      },
    ],
    notChecked: [
      "The current fee for the coming intake, which is set annually and which we have rounded.",
      "Whether either programme requires ATAS. It is subject-dependent and it has to be read on the programme page, because the CAS waits for it.",
    ],
  },

  {
    slug: "university-of-leeds",
    name: "University of Leeds",
    destination: "united-kingdom",
    city: "Leeds",
    route: "Taught masters",
    type: "public",
    flagCode: "gb",
    initials: "UoL",
    summary:
      "Another large Russell Group university outside London, with a broad taught postgraduate portfolio and a student city that is cheaper than Manchester on rent.",
    commission: UK_COMMISSION,
    highlights: {
      established: stated(1904, "Institution's own history page", ON),
      totalStudents: stated(39000, "Institution's published student statistics", ON),
      internationalStudents: stated(
        "Around a quarter of the student body",
        "Institution's published student statistics",
        ON,
      ),
      staffRatio: unknown("Published per faculty rather than institution-wide."),
      acceptanceRate: unknown(
        "Not published at institution level. It varies enormously by programme, and a single institutional rate would say nothing useful about the course you are applying to.",
      ),
      accreditation: stated(
        "Recognised UK degree-awarding body, regulated by the Office for Students",
        "Office for Students register",
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
        undergraduate: stated("6.0 to 6.5 overall, varying by programme", "Institution's admission pages", ON),
        postgraduate: stated("6.5 overall with 6.0 in each component on most programmes", "Institution's admission pages", ON),
      },
      {
        exam: "TOEFL iBT",
        undergraduate: stated("87 to 92, varying by programme", "Institution's admission pages", ON),
        postgraduate: stated("92 with section minimums on most programmes", "Institution's admission pages", ON),
      },
      {
        exam: "GRE",
        undergraduate: stated("Not required", "Institution's admission pages", ON),
        postgraduate: stated("Not required by most taught programmes", "Institution's admission pages", ON),
      },
    ],
    tuitionNote: stated(
      "Full international tuition, set per programme. A deposit is normally required before the CAS is issued.",
      "Institution's published fee schedule",
      ON,
    ),
    costOfLivingCity: "manchester",
    programmes: [
      {
        slug: "leeds-msc-data-science-analytics",
        universitySlug: "university-of-leeds",
        name: "MSc Data Science and Analytics",
        level: "masters",
        disciplines: ["Computer Science", "Data Science"],
        durationMonths: 12,
        feePerYear: stated(30000, "Institution's published international fee schedule", ON, FEE_QUALIFIER),
        currency: "GBP",
        feeQualifier: FEE_QUALIFIER,
        intakes: [
          {
            name: "September",
            applicationDeadline: "2027-06-30",
            teachingStarts: "2027-09-27",
            status: "not-yet-open",
            statusAsOf: ON,
            campus: "Leeds",
          },
        ],
        entryRequirement: stated(
          "An upper second class honours degree or overseas equivalent in a quantitative subject, with evidence of mathematics and programming.",
          "Institution's admission pages",
          ON,
        ),
        prerequisites: stated(["Mathematics", "Statistics", "Programming"], "Programme page", ON),
        languageOfInstruction: "English",
        placement: unknown("No placement term is stated on this one year programme."),
        campus: "Leeds",
      },
      {
        slug: "leeds-msc-engineering-management",
        universitySlug: "university-of-leeds",
        name: "MSc Engineering Management",
        level: "masters",
        disciplines: ["Engineering", "Business", "Management"],
        durationMonths: 12,
        feePerYear: stated(29000, "Institution's published international fee schedule", ON, FEE_QUALIFIER),
        currency: "GBP",
        feeQualifier: FEE_QUALIFIER,
        intakes: [
          {
            name: "September",
            applicationDeadline: "2027-06-30",
            teachingStarts: "2027-09-27",
            status: "not-yet-open",
            statusAsOf: ON,
            campus: "Leeds",
          },
        ],
        entryRequirement: stated(
          "An engineering or science honours degree at upper second class or overseas equivalent.",
          "Institution's admission pages",
          ON,
        ),
        prerequisites: unknown("A degree discipline is stated rather than named prerequisite modules."),
        languageOfInstruction: "English",
        placement: unknown("No placement term is stated."),
        campus: "Leeds",
      },
    ],
    notChecked: [
      "The current fee for the coming intake.",
      "Whether the data science programme requires a specific mathematics credit count rather than evidence of the subject.",
    ],
  },

  {
    slug: "university-of-glasgow",
    name: "University of Glasgow",
    destination: "united-kingdom",
    city: "Glasgow",
    route: "Taught masters",
    type: "public",
    flagCode: "gb",
    initials: "UoG",
    summary:
      "An old Russell Group university in Scotland. The immigration rules are the same as the rest of the UK, the academic calendar and some course structures are not, and the rent is lower than either English city above.",
    commission: UK_COMMISSION,
    highlights: {
      established: stated(1451, "Institution's own history page", ON),
      totalStudents: stated(36000, "Institution's published student statistics", ON),
      internationalStudents: stated(
        "Around a third of the student body",
        "Institution's published student statistics",
        ON,
      ),
      staffRatio: unknown("Published per college rather than institution-wide."),
      acceptanceRate: unknown(
        "Not published at institution level. It varies enormously by programme, and a single institutional rate would say nothing useful about the course you are applying to.",
      ),
      accreditation: stated(
        "Recognised UK degree-awarding body, regulated by the Scottish Funding Council",
        "Scottish Funding Council register",
        ON,
      ),
    },
    rankings: [
      {
        body: "QS World University Rankings",
        year: 2025,
        rank: "Inside the world top 80",
        scope: "World, all subjects",
        source: "QS published tables",
      },
    ],
    exams: [
      {
        exam: "IELTS Academic",
        undergraduate: stated("6.0 to 6.5 overall, varying by programme", "Institution's admission pages", ON),
        postgraduate: stated("6.5 overall with no sub-test below 6.0 on most programmes", "Institution's admission pages", ON),
      },
      {
        exam: "TOEFL iBT",
        undergraduate: stated("79 to 90, varying by programme", "Institution's admission pages", ON),
        postgraduate: stated("90 with section minimums", "Institution's admission pages", ON),
      },
      {
        exam: "GRE",
        undergraduate: stated("Not required", "Institution's admission pages", ON),
        postgraduate: stated("Not required by most taught programmes", "Institution's admission pages", ON),
      },
    ],
    tuitionNote: stated(
      "Full international tuition, set per programme. Scotland's fee position for home students does not extend to international students, and the international fee here is comparable with England.",
      "Institution's published fee schedule",
      ON,
    ),
    costOfLivingCity: "manchester",
    programmes: [
      {
        slug: "glasgow-msc-computing-science",
        universitySlug: "university-of-glasgow",
        name: "MSc Computing Science",
        level: "masters",
        disciplines: ["Computer Science"],
        durationMonths: 12,
        feePerYear: stated(30000, "Institution's published international fee schedule", ON, FEE_QUALIFIER),
        currency: "GBP",
        feeQualifier: FEE_QUALIFIER,
        intakes: [
          {
            name: "September",
            applicationDeadline: "2027-06-30",
            teachingStarts: "2027-09-13",
            status: "not-yet-open",
            statusAsOf: ON,
            campus: "Glasgow",
          },
          {
            name: "January",
            applicationDeadline: "2027-10-31",
            teachingStarts: "2028-01-10",
            status: "not-yet-open",
            statusAsOf: ON,
            campus: "Glasgow",
          },
        ],
        entryRequirement: stated(
          "A 2:1 honours degree or overseas equivalent. A conversion route exists for applicants without a computing background and it is a different programme.",
          "Institution's admission pages",
          ON,
        ),
        prerequisites: stated(["Programming", "Mathematics"], "Programme page", ON),
        languageOfInstruction: "English",
        placement: unknown("No placement term is stated."),
        campus: "Glasgow",
      },
    ],
    notChecked: [
      "Whether the January intake runs for this programme in the year you are applying. Second intakes are added and withdrawn more often than main ones.",
    ],
  },

  {
    slug: "coventry-university",
    name: "Coventry University",
    destination: "united-kingdom",
    city: "Coventry",
    route: "Taught masters",
    type: "public",
    flagCode: "gb",
    initials: "CU",
    summary:
      "A post-92 university with a materially lower fee, multiple intakes a year and a strong placement culture. It is on this list precisely because a catalogue that only shows expensive institutions is not a catalogue, it is a sales sheet.",
    commission: UK_COMMISSION,
    highlights: {
      established: stated(1992, "Institution's own history page. University status; its predecessor dates from 1843.", ON),
      totalStudents: stated(30000, "Institution's published student statistics", ON),
      internationalStudents: stated(
        "A large proportion, published as a headline figure rather than a rate",
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
        "Recognised UK degree-awarding body, regulated by the Office for Students",
        "Office for Students register",
        ON,
      ),
    },
    rankings: [
      {
        body: "QS World University Rankings",
        year: 2025,
        rank: "Outside the world top 500",
        scope: "World, all subjects",
        source: "QS published tables",
      },
    ],
    exams: [
      {
        exam: "IELTS Academic",
        undergraduate: stated("6.0 overall with 5.5 in each component on most programmes", "Institution's admission pages", ON),
        postgraduate: stated("6.5 overall with 5.5 in each component on most programmes", "Institution's admission pages", ON),
      },
      {
        exam: "TOEFL iBT",
        undergraduate: stated("Accepted; thresholds stated per programme", "Institution's admission pages", ON),
        postgraduate: stated("Accepted; thresholds stated per programme", "Institution's admission pages", ON),
      },
      {
        exam: "GRE",
        undergraduate: stated("Not required", "Institution's admission pages", ON),
        postgraduate: stated("Not required", "Institution's admission pages", ON),
      },
    ],
    tuitionNote: stated(
      "Full international tuition at a substantially lower level than the Russell Group institutions above, with more than one intake a year on many programmes.",
      "Institution's published fee schedule",
      ON,
    ),
    costOfLivingCity: "smaller",
    programmes: [
      {
        slug: "coventry-msc-data-science-computational-intelligence",
        universitySlug: "coventry-university",
        name: "MSc Data Science and Computational Intelligence",
        level: "masters",
        disciplines: ["Computer Science", "Data Science"],
        durationMonths: 12,
        feePerYear: stated(19000, "Institution's published international fee schedule", ON, FEE_QUALIFIER),
        currency: "GBP",
        feeQualifier: FEE_QUALIFIER,
        intakes: [
          {
            name: "September",
            applicationDeadline: "2027-07-31",
            teachingStarts: "2027-09-20",
            status: "not-yet-open",
            statusAsOf: ON,
            campus: "Coventry",
          },
          {
            name: "January",
            applicationDeadline: "2027-11-30",
            teachingStarts: "2028-01-17",
            status: "not-yet-open",
            statusAsOf: ON,
            campus: "Coventry",
          },
        ],
        entryRequirement: stated(
          "A second class honours degree or overseas equivalent in a computing, engineering or quantitative subject. The published threshold is lower than the Russell Group institutions above.",
          "Institution's admission pages",
          ON,
        ),
        prerequisites: unknown("A degree discipline is stated rather than named prerequisite modules."),
        languageOfInstruction: "English",
        placement: stated(
          "A professional placement variant of this programme exists and extends the course",
          "Programme page",
          ON,
        ),
        campus: "Coventry",
      },
    ],
    notChecked: [
      "Whether the placement variant is open to international students on a Student visa for the coming intake, which is a visa question as well as an academic one.",
    ],
  },

  {
    slug: "queen-mary-london",
    name: "Queen Mary University of London",
    destination: "united-kingdom",
    city: "London",
    route: "Taught masters",
    type: "public",
    flagCode: "gb",
    initials: "QMUL",
    summary:
      "A Russell Group university inside Greater London, which changes the maintenance requirement from GBP 1,171 to GBP 1,529 a month before a single rent figure is considered. That is a GBP 3,222 difference on a nine month calculation.",
    commission: UK_COMMISSION,
    highlights: {
      established: stated(1885, "Institution's own history page. The date of its earliest constituent college.", ON),
      totalStudents: stated(31000, "Institution's published student statistics", ON),
      internationalStudents: stated(
        "Around a third of the student body",
        "Institution's published student statistics",
        ON,
      ),
      staffRatio: unknown("Published per faculty rather than institution-wide."),
      acceptanceRate: unknown(
        "Not published at institution level. It varies enormously by programme, and a single institutional rate would say nothing useful about the course you are applying to.",
      ),
      accreditation: stated(
        "Recognised UK degree-awarding body, regulated by the Office for Students",
        "Office for Students register",
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
        undergraduate: stated("6.0 to 6.5 overall, varying by programme", "Institution's admission pages", ON),
        postgraduate: stated("6.5 overall with 6.0 in each component on most programmes", "Institution's admission pages", ON),
      },
      {
        exam: "TOEFL iBT",
        undergraduate: stated("Accepted; thresholds stated per programme", "Institution's admission pages", ON),
        postgraduate: stated("92 with section minimums on most programmes", "Institution's admission pages", ON),
      },
      {
        exam: "GRE",
        undergraduate: stated("Not required", "Institution's admission pages", ON),
        postgraduate: stated("Not required by most taught programmes", "Institution's admission pages", ON),
      },
    ],
    tuitionNote: stated(
      "Full international tuition, plus the London maintenance requirement on the visa side. Both figures move together and both belong in the same calculation.",
      "Institution's published fee schedule, and UKVI Appendix Finance",
      ON,
    ),
    costOfLivingCity: "london",
    programmes: [
      {
        slug: "qmul-msc-computer-science",
        universitySlug: "queen-mary-london",
        name: "MSc Computer Science",
        level: "masters",
        disciplines: ["Computer Science"],
        durationMonths: 12,
        feePerYear: stated(31000, "Institution's published international fee schedule", ON, FEE_QUALIFIER),
        currency: "GBP",
        feeQualifier: FEE_QUALIFIER,
        intakes: [
          {
            name: "September",
            applicationDeadline: "2027-07-31",
            teachingStarts: "2027-09-20",
            status: "not-yet-open",
            statusAsOf: ON,
            campus: "Mile End, London",
          },
        ],
        entryRequirement: stated(
          "A 2:1 honours degree or overseas equivalent. A conversion route exists for applicants from other disciplines and is a separate programme.",
          "Institution's admission pages",
          ON,
        ),
        prerequisites: stated(["Programming", "Mathematics"], "Programme page", ON),
        languageOfInstruction: "English",
        placement: unknown("No placement term is stated on this one year programme."),
        campus: "Mile End, London",
      },
      {
        slug: "qmul-msc-finance",
        universitySlug: "queen-mary-london",
        name: "MSc Finance",
        level: "masters",
        disciplines: ["Business", "Finance"],
        durationMonths: 12,
        feePerYear: stated(34000, "Institution's published international fee schedule", ON, FEE_QUALIFIER),
        currency: "GBP",
        feeQualifier: FEE_QUALIFIER,
        intakes: [
          {
            name: "September",
            applicationDeadline: "2027-06-30",
            teachingStarts: "2027-09-20",
            status: "not-yet-open",
            statusAsOf: ON,
            campus: "Mile End, London",
          },
        ],
        entryRequirement: stated(
          "A 2:1 honours degree or overseas equivalent, with quantitative content. Some finance programmes here state a mathematics requirement explicitly.",
          "Institution's admission pages",
          ON,
        ),
        prerequisites: stated(["Mathematics", "Statistics"], "Programme page", ON),
        languageOfInstruction: "English",
        placement: unknown("No placement term is stated."),
        campus: "Mile End, London",
      },
    ],
    notChecked: [
      "Whether the finance programme asks for GMAT or GRE in the coming cycle. Finance programmes change this more often than others.",
    ],
  },

  {
    slug: "university-of-edinburgh",
    name: "The University of Edinburgh",
    destination: "united-kingdom",
    city: "Edinburgh",
    route: "Taught masters",
    type: "public",
    flagCode: "gb",
    initials: "UoE",
    summary:
      "A leading research university with one of the UK's largest computing and AI schools, in a city whose maintenance requirement and rent both sit below London's.",
    commission: UK_COMMISSION,
    highlights: {
      established: stated(1583, "Institution's own history page", RESEARCHED_ON),
      totalStudents: stated(
        49640,
        "The university's published Student Factsheet 2024/25 (governance-strategic-planning.ed.ac.uk), found through search; the PDF itself could not be rendered in this environment to confirm the figure visually, so treat this one figure as reported rather than independently read",
        RESEARCHED_ON,
      ),
      internationalStudents: stated(
        "Over 44 per cent of the student body, from more than 160 countries",
        "Same factsheet as above, same caveat on how it was checked",
        RESEARCHED_ON,
      ),
      staffRatio: unknown(
        "Published per school rather than institution-wide, and averaging the schools would be our arithmetic rather than their figure.",
      ),
      acceptanceRate: unknown("Not published at institution level."),
      accreditation: stated(
        "Recognised UK degree-awarding body, regulated by the Office for Students",
        "Office for Students register",
        RESEARCHED_ON,
      ),
    },
    rankings: [
      {
        body: "QS World University Rankings",
        year: 2026,
        rank: "Inside the world top 35",
        scope: "World, all subjects",
        source:
          "Secondary reports of the QS 2026 table converged in a 24th-to-34th range rather than one number; this site would not print a single figure it could not pin down, so it prints the band every source agreed inside",
      },
    ],
    exams: [
      {
        exam: "IELTS Academic",
        undergraduate: unknown("Checked for the postgraduate route only this pass."),
        postgraduate: stated(
          "7.0 overall with at least 6.5 in each component. IELTS One Skill Retake is not accepted, and IELTS General Training does not count",
          "Programme page, School of Informatics",
          RESEARCHED_ON,
        ),
      },
    ],
    tuitionNote: stated(
      "Full international tuition, fixed for the length of the programme once you start rather than rising each year. A deposit is normally required to secure the offer.",
      "Reported consistently across several independent fee-comparison publications (Yocket, Collegedunia, Shiksha, GyanDhan); the institution's own fee page renders its figures through a tool this session's fetch could not execute, so this figure is convergent-secondary, not independently read off the primary page, and is flagged that way rather than presented as verified",
      RESEARCHED_ON,
    ),
    costOfLivingCity: "manchester",
    programmes: [
      {
        slug: "edinburgh-msc-artificial-intelligence",
        universitySlug: "university-of-edinburgh",
        name: "MSc Artificial Intelligence",
        level: "masters",
        disciplines: ["Computer Science", "Artificial Intelligence"],
        durationMonths: 12,
        feePerYear: stated(
          45410,
          "Reported consistently across several independent fee-comparison publications for 2026-27 entry; the institution's own fee tool could not be executed by this session's fetch, so treat this as convergent-secondary rather than independently confirmed",
          RESEARCHED_ON,
        ),
        currency: "GBP",
        feeQualifier: EDINBURGH_FEE_QUALIFIER,
        intakes: [
          {
            name: "September",
            applicationDeadline: "2027-03-31",
            teachingStarts: "2027-09-14",
            status: "not-yet-open",
            statusAsOf: RESEARCHED_ON,
            campus: "Edinburgh",
          },
        ],
        entryRequirement: stated(
          "A UK 2:1 honours degree or its international equivalent in informatics, artificial intelligence, cognitive science, computer science, electrical engineering, mathematics, physics, psychology or a closely related discipline. Typical offers made are for first class honours.",
          "Programme page, School of Informatics",
          RESEARCHED_ON,
        ),
        prerequisites: stated(
          [
            "Programming competence (C/C++, Java, Python, R, Matlab or Haskell)",
            "Mathematics to 60 SCQF credits / 30 ECTS: calculus, linear algebra, discrete mathematics, probability",
          ],
          "Programme page, School of Informatics",
          RESEARCHED_ON,
        ),
        languageOfInstruction: "English",
        placement: unknown("No placement term is stated on this one year taught programme."),
        campus: "Edinburgh",
      },
    ],
    notChecked: [
      "The exact tuition figure, since the institution's own fee page renders through a tool this session could not execute; corroborated across independent sources but not read directly off the primary page.",
      "The 2027 intake deadline is this year's confirmed date (31 March 2026) projected forward by one cycle, marked not-yet-open rather than confirmed, the same convention the rest of this catalogue uses for a cycle the institution has not opened yet.",
      "Whether this programme requires ATAS. It is subject-dependent and has to be read on the programme page, because the CAS waits for it.",
      "Language tests beyond IELTS (TOEFL, GRE, GMAT) were not checked this pass and are left off the exams list rather than guessed.",
      "Edinburgh has no city of its own in the cost of living calculator yet, so it is linked to the Manchester band, the same large-city-outside-London proxy Glasgow's entry already uses. Edinburgh rents typically run above that band, not within it, which the calculator page does not yet say.",
    ],
  },

  {
    slug: "imperial-college-london",
    name: "Imperial College London",
    destination: "united-kingdom",
    city: "London",
    route: "Taught masters",
    type: "public",
    flagCode: "gb",
    initials: "ICL",
    summary:
      "A science, engineering, medicine and business specialist with no humanities faculty, consistently placed among the top handful of universities in the world. London tuition and the London maintenance requirement both apply, and both run above the rest of this catalogue.",
    commission: UK_COMMISSION,
    highlights: {
      established: stated(1907, "Institution's own history page", RESEARCHED_ON),
      totalStudents: stated(
        23248,
        "Institution's own reporting for 2024-25, found through search rather than a page this session opened directly",
        RESEARCHED_ON,
      ),
      internationalStudents: unknown(
        "Two figures for the international share turned up in this pass, 61 per cent and 52.9 per cent, from different counting methods (all non-UK domicile versus HESA's own definition) and this session could not adjudicate between them, so neither is stated as if it were the only one.",
      ),
      staffRatio: unknown("Not published at institution level."),
      acceptanceRate: unknown("Not published at institution level."),
      accreditation: stated(
        "Recognised UK degree-awarding body, regulated by the Office for Students",
        "Office for Students register",
        RESEARCHED_ON,
      ),
    },
    rankings: [
      {
        body: "QS World University Rankings",
        year: 2027,
        rank: "2nd in the world, 1st in the UK and Europe",
        scope: "World, all subjects",
        source: "Institution's own league tables page, itself citing the QS table directly",
      },
    ],
    exams: [
      {
        exam: "IELTS Academic",
        undergraduate: unknown("Checked for the postgraduate route only this pass."),
        postgraduate: stated(
          "7.0 overall with no component below 6.5 on most Computing postgraduate programmes",
          "Reported consistently across independent fee-and-requirements publications; the institution's own department page was not directly read this pass",
          RESEARCHED_ON,
        ),
      },
    ],
    tuitionNote: stated(
      "Full international tuition, London weighted, among the highest in this catalogue. Published per department and per programme rather than one university-wide figure.",
      "Institution's own postgraduate fees page confirms fees are set per department and per session, but this session's fetch of it could not reach the actual MSc Computing figure; the figure below is convergent-secondary, flagged the same way",
      RESEARCHED_ON,
    ),
    costOfLivingCity: "london",
    programmes: [
      {
        slug: "imperial-msc-computing",
        universitySlug: "imperial-college-london",
        name: "MSc Computing (Specialism: Artificial Intelligence)",
        level: "masters",
        disciplines: ["Computer Science", "Artificial Intelligence"],
        durationMonths: 12,
        feePerYear: stated(
          46000,
          "Reported consistently across independent fee-comparison publications for the Department of Computing; this session's fetch of the institution's own fee tables could not reach the department-level figure, so treat this as convergent-secondary rather than independently confirmed",
          RESEARCHED_ON,
        ),
        currency: "GBP",
        feeQualifier: EDINBURGH_FEE_QUALIFIER,
        intakes: [
          {
            name: "October",
            applicationDeadline: "2027-06-30",
            teachingStarts: "2027-10-04",
            status: "not-yet-open",
            statusAsOf: RESEARCHED_ON,
            campus: "South Kensington, London",
          },
        ],
        entryRequirement: stated(
          "A first class honours degree, or strong upper second, in computer science or a closely related discipline with significant technical content.",
          "Reported consistently across independent admissions publications; the department's own admissions page was not directly read this pass",
          RESEARCHED_ON,
        ),
        prerequisites: unknown(
          "The specific prerequisite modules were not checked this pass; the general requirement is a technical degree with strong mathematics.",
        ),
        languageOfInstruction: "English",
        placement: unknown("No placement term is stated on this one year taught programme."),
        campus: "South Kensington, London",
      },
    ],
    notChecked: [
      "The exact tuition figure and the exact entry requirement wording: this session's fetch of the institution's own pages could not reach the department-level detail, so both are convergent-secondary, stated as such rather than presented as primary-confirmed.",
      "Which of the two international-student percentages found this pass is the one the institution would stand behind; left unknown rather than picking one.",
      "Whether this programme requires ATAS. It is subject-dependent and has to be read on the programme page, because the CAS waits for it.",
    ],
  },

  {
    slug: "university-college-london",
    name: "University College London",
    destination: "united-kingdom",
    city: "London",
    route: "Taught masters",
    type: "public",
    flagCode: "gb",
    initials: "UCL",
    summary:
      "A large, broad research university in central London, consistently placed in the global top ten. London tuition and the London maintenance requirement both apply.",
    commission: UK_COMMISSION,
    highlights: {
      established: stated(1826, "Institution's own history page", RESEARCHED_ON),
      totalStudents: stated(48000, "Institution's own reporting, found through search", RESEARCHED_ON),
      internationalStudents: stated(
        "More than a third of the student body, from around 150 countries",
        "Institution's own reporting, found through search",
        RESEARCHED_ON,
      ),
      staffRatio: unknown("Not published at institution level."),
      acceptanceRate: unknown("Not published at institution level."),
      accreditation: stated(
        "Recognised UK degree-awarding body, regulated by the Office for Students",
        "Office for Students register",
        RESEARCHED_ON,
      ),
    },
    rankings: [
      {
        body: "QS World University Rankings",
        year: 2027,
        rank: "Joint 8th in the world",
        scope: "World, all subjects",
        source: "Institution's own news page announcing the QS 2027 result",
      },
    ],
    exams: [
      {
        exam: "IELTS Academic",
        undergraduate: unknown("Checked for the postgraduate route only this pass."),
        postgraduate: stated(
          "7.0 overall is the commonly stated figure; one independent source reported 6.5 for this specific programme, and this session could not resolve the discrepancy against the department's own page",
          "Reported across independent admissions publications, with the discrepancy stated rather than resolved by picking one",
          RESEARCHED_ON,
        ),
      },
    ],
    tuitionNote: stated(
      "Full international tuition, London weighted. A deposit of 10 per cent of the first year fee is charged for an overseas offer holder.",
      "Reported consistently across independent fee-comparison publications; the institution's own department fee page was not directly read this pass",
      RESEARCHED_ON,
    ),
    costOfLivingCity: "london",
    programmes: [
      {
        slug: "ucl-msc-computer-science",
        universitySlug: "university-college-london",
        name: "MSc Computer Science",
        level: "masters",
        disciplines: ["Computer Science"],
        durationMonths: 12,
        feePerYear: stated(
          42700,
          "Reported consistently across independent fee-comparison publications; the institution's own department fee page was not directly read this pass, so treat as convergent-secondary rather than independently confirmed",
          RESEARCHED_ON,
        ),
        currency: "GBP",
        feeQualifier: EDINBURGH_FEE_QUALIFIER,
        intakes: [
          {
            name: "September",
            applicationDeadline: "2027-06-30",
            teachingStarts: "2027-09-20",
            status: "not-yet-open",
            statusAsOf: RESEARCHED_ON,
            campus: "Bloomsbury, London",
          },
        ],
        entryRequirement: stated(
          "This is a conversion programme, built for a degree in a subject other than computer science or information technology: an upper second class honours degree or overseas equivalent, with evidenced mathematical skills to at least A-level standard.",
          "Institution's own programme page, fetched this pass",
          RESEARCHED_ON,
        ),
        prerequisites: stated(
          ["Mathematics to A-level standard", "Analytical and quantitative reasoning, evidenced in the application rather than by a named course"],
          "Institution's own programme page",
          RESEARCHED_ON,
        ),
        languageOfInstruction: "English",
        placement: unknown("No placement term is stated on this one year taught programme."),
        campus: "Bloomsbury, London",
      },
    ],
    notChecked: [
      "The exact tuition figure: convergent-secondary, not read directly off the department's own fee page this pass.",
      "The IELTS discrepancy (7.0 vs 6.5) between independent sources, stated rather than resolved.",
      "This specific MSc is a conversion programme for non-CS graduates. UCL also runs a standard MSc Computer Science route for CS graduates, which this pass did not research separately; do not assume the entry requirement above applies to that other route.",
      "Whether this programme requires ATAS. It is subject-dependent and has to be read on the programme page, because the CAS waits for it.",
    ],
  },

  {
    slug: "kings-college-london",
    name: "King's College London",
    destination: "united-kingdom",
    city: "London",
    route: "Taught masters",
    type: "public",
    flagCode: "gb",
    initials: "KCL",
    summary:
      "A central London research university with a large international student base, particularly strong in health, law and the social sciences alongside a growing data science offering.",
    commission: UK_COMMISSION,
    highlights: {
      established: stated(1829, "Institution's own history page", RESEARCHED_ON),
      totalStudents: unknown(
        "This pass found international enrolment (23,000+) but not a total headcount figure from the institution itself.",
      ),
      internationalStudents: stated(
        "More than 23,000 international students, from 185 countries",
        "Institution's own reporting, found through search",
        RESEARCHED_ON,
      ),
      staffRatio: unknown("Not published at institution level."),
      acceptanceRate: unknown("Not published at institution level."),
      accreditation: stated(
        "Recognised UK degree-awarding body, regulated by the Office for Students",
        "Office for Students register",
        RESEARCHED_ON,
      ),
    },
    rankings: [
      {
        body: "QS World University Rankings",
        year: 2026,
        rank: "31st in the world, 5th in the UK",
        scope: "World, all subjects",
        source: "Institution's own news page announcing the QS 2026 result",
      },
    ],
    exams: [
      {
        exam: "IELTS Academic",
        undergraduate: unknown("Checked for the postgraduate route only this pass."),
        postgraduate: stated(
          "7.0 overall with no component below 6.5 is the commonly stated figure for this programme",
          "Reported across independent admissions publications; this session's direct fetch of the programme's own page did not surface a specific score",
          RESEARCHED_ON,
        ),
      },
    ],
    tuitionNote: stated(
      "Full international tuition, published per programme rather than one university-wide figure, and stated to rise in later years of a multi-year programme.",
      "Institution's own fees page, fetched directly this pass",
      RESEARCHED_ON,
    ),
    costOfLivingCity: "london",
    programmes: [
      {
        slug: "kcl-msc-data-science",
        universitySlug: "kings-college-london",
        name: "MSc Data Science",
        level: "masters",
        disciplines: ["Data Science", "Computer Science"],
        durationMonths: 12,
        feePerYear: stated(
          40450,
          "Institution's own fees page: \"Full time tuition fees international: £40,450 per year (2026/27)\", fetched directly this pass",
          RESEARCHED_ON,
        ),
        currency: "GBP",
        feeQualifier: FEE_QUALIFIER,
        intakes: [
          {
            name: "September",
            applicationDeadline: "2027-02-01",
            teachingStarts: "2027-09-01",
            status: "not-yet-open",
            statusAsOf: RESEARCHED_ON,
            campus: "Strand, London",
          },
        ],
        entryRequirement: stated(
          "Designed for graduates and professionals with a background in a quantitative subject. The exact degree class was not stated on the page this session read; independent sources report roughly a first class or high upper second, 70 per cent or GPA 3.0 or higher.",
          "Institution's own programme page, fetched this pass, supplemented by independent sources for the specific class where the primary page did not state one",
          RESEARCHED_ON,
        ),
        prerequisites: stated(["A quantitative background"], "Institution's own programme page", RESEARCHED_ON),
        languageOfInstruction: "English",
        placement: unknown("No placement term is stated on this one year taught programme."),
        campus: "Strand, London",
      },
    ],
    notChecked: [
      "The exact degree classification required: the institution's own page this session read described the audience rather than stating a class; independent sources fill the gap and are cited as such.",
      "Total student headcount for the institution as a whole.",
      "Whether this programme requires ATAS. It is subject-dependent and has to be read on the programme page, because the CAS waits for it.",
    ],
  },

  {
    slug: "university-of-birmingham",
    name: "University of Birmingham",
    destination: "united-kingdom",
    city: "Birmingham",
    route: "Taught masters",
    type: "public",
    flagCode: "gb",
    initials: "UoB",
    summary:
      "A large Russell Group university in England's second city, outside London, so the lower non-London maintenance figure and rent both apply.",
    commission: UK_COMMISSION,
    highlights: {
      established: stated(1900, "Institution's own history page", RESEARCHED_ON),
      totalStudents: stated(40000, "Institution's own reporting, found through search", RESEARCHED_ON),
      internationalStudents: stated(
        "Students from over 150 countries; no institution-stated percentage found this pass",
        "Institution's own reporting, found through search",
        RESEARCHED_ON,
      ),
      staffRatio: unknown("Not published at institution level."),
      acceptanceRate: unknown("Not published at institution level."),
      accreditation: stated(
        "Recognised UK degree-awarding body, regulated by the Office for Students",
        "Office for Students register",
        RESEARCHED_ON,
      ),
    },
    rankings: [
      {
        body: "QS World University Rankings",
        year: 2026,
        rank: "Inside the world top 80",
        scope: "World, all subjects",
        source:
          "The institution's own news reports named two different positions (68th and 76th) in what this session found, likely from different rankings cycles or subject weightings; the band both agree inside is printed rather than picking one",
      },
    ],
    exams: [
      {
        exam: "IELTS Academic",
        undergraduate: unknown("Checked for the postgraduate route only this pass."),
        postgraduate: stated(
          "6.5 overall with 6.0 in each component",
          "Reported consistently across independent admissions publications; the institution's own programme page was not directly read this pass",
          RESEARCHED_ON,
        ),
      },
    ],
    tuitionNote: stated(
      "Full international tuition, set per programme. Independent sources disagreed on the Computer Science figure this pass (£34,740 against £27,540, possibly two different programme variants); the higher figure is printed and the discrepancy is stated rather than hidden.",
      "Independent fee-comparison publications; the institution's own fee page was not directly read this pass",
      RESEARCHED_ON,
    ),
    costOfLivingCity: "manchester",
    programmes: [
      {
        slug: "birmingham-msc-computer-science",
        universitySlug: "university-of-birmingham",
        name: "MSc Computer Science",
        level: "masters",
        disciplines: ["Computer Science"],
        durationMonths: 12,
        feePerYear: stated(
          34740,
          "Independent fee-comparison publications, one of two figures found this pass; the institution's own fee page was not directly read to resolve which applies to which programme variant",
          RESEARCHED_ON,
        ),
        currency: "GBP",
        feeQualifier: EDINBURGH_FEE_QUALIFIER,
        intakes: [
          {
            name: "September",
            applicationDeadline: "2027-06-30",
            teachingStarts: "2027-09-20",
            status: "not-yet-open",
            statusAsOf: RESEARCHED_ON,
            campus: "Edgbaston, Birmingham",
          },
        ],
        entryRequirement: stated(
          "A 2:1 honours degree or overseas equivalent, commonly stated as 60 per cent for Indian applicants depending on the institution's own recognition list.",
          "Reported consistently across independent admissions publications; the institution's own programme page was not directly read this pass",
          RESEARCHED_ON,
        ),
        prerequisites: unknown("Not checked this pass."),
        languageOfInstruction: "English",
        placement: unknown("No placement term is stated on this one year taught programme."),
        campus: "Edgbaston, Birmingham",
      },
    ],
    notChecked: [
      "The exact tuition fee: two different figures were found and neither was confirmed against the institution's own page this pass.",
      "The exact QS rank: two different positions were found; the band both agree inside is printed instead.",
      "Whether this programme requires ATAS. It is subject-dependent and has to be read on the programme page, because the CAS waits for it.",
    ],
  },
];
