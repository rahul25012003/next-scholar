import { stated, unknown, type University } from "./types";

const ON = "2026-09-03";
/** When Edinburgh, below, was actually looked up — a real later date, not backdated to match the rest of the file. */
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
  "Approximate yearly tuition for an international student, from the university's published fees. The programme's own fee page is final, and fees are set per intake.";

/** Edinburgh's own fee tool would not render for this session's fetch; see the field's own source note. */
const EDINBURGH_FEE_QUALIFIER =
  "Approximate yearly tuition for an international student, from independent fee-comparison sources that agree, not the university's own fee tool. The programme's own fee page is final, and fees are set per intake.";

const UK_COMMISSION = {
  display: "₹1.5L to ₹2.5L",
  lowInr: 150000,
  highInr: 250000,
  status: "unverified" as const,
  source: "market-estimate" as const,
  note: "A typical market band for a UK university, not a contract term and not confirmed by this university.",
};

/**
 * The United Kingdom.
 *
 * Fifteen institutions across the range an Indian applicant actually shortlists,
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
      "A large Russell Group university outside London, which is what most Indian postgraduate applicants look for. The visa maintenance requirement is the lower non-London figure, and rent is lower too.",
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
        "Published per faculty, not for the whole university, and we will not average the faculties ourselves.",
      ),
      acceptanceRate: unknown(
        "Not published for the whole university. It varies hugely by programme, so one overall rate would tell you nothing about your course.",
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
      "Full international tuition, set per programme and per intake. You normally pay a deposit before the CAS is issued, and any unpaid balance on the CAS is added to the maintenance funds you must show.",
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
          "An upper second class honours degree, or its overseas equivalent, in computer science. For Indian applicants this is commonly 60 to 70 per cent, depending on the university's own recognition list.",
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
          "The programme page names a degree subject, not specific prerequisite modules.",
        ),
        languageOfInstruction: "English",
        placement: unknown("No placement term is stated."),
        campus: "Manchester",
      },
    ],
    notChecked: [
      "The current fee for the coming intake, which is set annually and which we have rounded.",
      "Whether either programme needs ATAS. It depends on the subject, so check the programme page, because the CAS waits for it.",
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
        "Not published for the whole university. It varies hugely by programme, so one overall rate would tell you nothing about your course.",
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
        prerequisites: unknown("A degree subject is named, not specific prerequisite modules."),
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
      "An old Russell Group university in Scotland. Immigration rules match the rest of the UK, but the academic calendar and some course structures differ, and rent is lower than in Manchester or Leeds.",
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
        "Not published for the whole university. It varies hugely by programme, so one overall rate would tell you nothing about your course.",
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
      "Full international tuition, set per programme. Scotland's fee arrangements for home students do not cover international students, and the fee here is similar to England.",
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
          "A 2:1 honours degree or overseas equivalent. Applicants without a computing background have a separate conversion programme.",
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
      "A post-92 university with a much lower fee, several intakes a year and a strong placement culture. It is listed so this catalogue is not only expensive universities.",
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
        "Not published in a form that compares fairly with the other universities in this catalogue.",
      ),
      acceptanceRate: unknown(
        "Not published for the whole university. It varies hugely by programme, so one overall rate would tell you nothing about your course.",
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
      "Full international tuition, much lower than at the Russell Group universities in this list, with more than one intake a year on many programmes.",
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
          "A second class honours degree or overseas equivalent in a computing, engineering or quantitative subject. The published bar is lower than at the Russell Group universities in this list.",
          "Institution's admission pages",
          ON,
        ),
        prerequisites: unknown("A degree subject is named, not specific prerequisite modules."),
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
      "A Russell Group university in Greater London, so the visa maintenance requirement rises from GBP 1,171 to GBP 1,529 a month, before any rent. That is GBP 3,222 more over nine months.",
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
        "Not published for the whole university. It varies hugely by programme, so one overall rate would tell you nothing about your course.",
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
      "Full international tuition, plus the London maintenance requirement for the visa. Both figures move together, so budget for them together.",
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
          "A 2:1 honours degree or overseas equivalent. Applicants from other subjects have a separate conversion programme.",
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
      established: stated(1583, ON_RECORD, RESEARCHED_ON),
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
        "Published per school, not for the whole university, and we will not average the schools ourselves.",
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
          "A UK 2:1 honours degree or its international equivalent in informatics, artificial intelligence, cognitive science, computer science, electrical engineering, mathematics, physics, psychology or a closely related subject. Typical offers ask for first class honours.",
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
      "The exact tuition fee. The university's fee tool would not load for us, so the figure comes from independent sources that agree, not the university's own page.",
      "The 2027 deadline. It is this year's confirmed date (31 March 2026) moved forward a year, and is marked not yet open rather than confirmed.",
      "Whether this programme needs ATAS. It depends on the subject, so check the programme page, because the CAS waits for it.",
      "Tests other than IELTS (TOEFL, GRE, GMAT). We have not checked them, so they are left off rather than guessed.",
      "Edinburgh is not yet in the cost of living calculator, so it links to the Manchester band, as Glasgow does. Edinburgh rents usually run above that band, which the calculator does not yet say.",
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
      "A science, engineering, medicine and business specialist with no humanities faculty, regularly ranked among the world's top few universities. London tuition and the London maintenance requirement both apply, and both are higher than elsewhere in this catalogue.",
    commission: UK_COMMISSION,
    highlights: {
      established: stated(1907, ON_RECORD, RESEARCHED_ON),
      totalStudents: stated(
        23248,
        "Institution's own reporting for 2024-25, found through search rather than a page this session opened directly",
        RESEARCHED_ON,
      ),
      internationalStudents: unknown(
        "We found two figures, 61 per cent and 52.9 per cent, from different counting methods (all non-UK domicile versus HESA's own definition). We could not tell which is right, so we state neither as the only one.",
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
      "Full international tuition at London rates, among the highest in this catalogue. It is set per department and per programme, not as one university-wide figure.",
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
          "We have not checked the specific prerequisite modules. The general requirement is a technical degree with strong mathematics.",
        ),
        languageOfInstruction: "English",
        placement: unknown("No placement term is stated on this one year taught programme."),
        campus: "South Kensington, London",
      },
    ],
    notChecked: [
      "The exact tuition fee and entry requirement wording. We could not reach the department's own pages, so both come from independent sources that agree, not the university itself.",
      "Which of the two international-student percentages the university itself would stand behind. We left it unknown rather than pick one.",
      "Whether this programme needs ATAS. It depends on the subject, so check the programme page, because the CAS waits for it.",
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
      established: stated(1826, ON_RECORD, RESEARCHED_ON),
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
          "7.0 overall is the commonly stated figure; one independent source reported 6.5 for this programme, and we could not settle it against the department's own page",
          "Reported across independent admissions publications, with the discrepancy stated rather than resolved by picking one",
          RESEARCHED_ON,
        ),
      },
    ],
    tuitionNote: stated(
      "Full international tuition at London rates. Overseas offer holders pay a deposit of 10 per cent of the first-year fee.",
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
          "A conversion programme for graduates in subjects other than computer science or information technology. You need an upper second class honours degree or overseas equivalent, with proven maths skills to at least A-level standard.",
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
      "The exact tuition fee. It comes from independent sources that agree, not the department's own fee page.",
      "The IELTS discrepancy (7.0 vs 6.5) between independent sources, stated rather than resolved.",
      "This MSc is a conversion programme for non-CS graduates. UCL also runs a standard MSc Computer Science route for CS graduates, which we have not researched; do not assume the entry requirement above applies to it.",
      "Whether this programme needs ATAS. It depends on the subject, so check the programme page, because the CAS waits for it.",
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
      "A central London research university with many international students. It is especially strong in health, law and the social sciences, with a growing data science offer.",
    commission: UK_COMMISSION,
    highlights: {
      established: stated(1829, ON_RECORD, RESEARCHED_ON),
      totalStudents: unknown(
        "We found international enrolment (23,000+), but not a total headcount from the university itself.",
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
      "Full international tuition, set per programme rather than one university-wide figure. The university says it rises in later years of a multi-year programme.",
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
          "Designed for graduates and professionals with a quantitative background. The page we read gave no degree class; independent sources report roughly a first or high upper second, 70 per cent or GPA 3.0 or higher.",
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
      "The exact degree class required. The university's page describes who the course is for but gives no class, so independent sources fill the gap.",
      "Total student headcount for the institution as a whole.",
      "Whether this programme needs ATAS. It depends on the subject, so check the programme page, because the CAS waits for it.",
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
      established: stated(1900, ON_RECORD, RESEARCHED_ON),
      totalStudents: stated(40000, "Institution's own reporting, found through search", RESEARCHED_ON),
      internationalStudents: stated(
        "Students from over 150 countries; we found no percentage from the university itself",
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
      "Full international tuition, set per programme. Independent sources disagree on the Computer Science fee (£34,740 or £27,540, possibly two programme versions), so we show the higher figure.",
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
          "A 2:1 honours degree or overseas equivalent, commonly 60 per cent for Indian applicants, depending on the university's own recognition list.",
          "Reported consistently across independent admissions publications; the institution's own programme page was not directly read this pass",
          RESEARCHED_ON,
        ),
        prerequisites: unknown("We have not checked this yet."),
        languageOfInstruction: "English",
        placement: unknown("No placement term is stated on this one year taught programme."),
        campus: "Edgbaston, Birmingham",
      },
    ],
    notChecked: [
      "The exact tuition fee. We found two figures and confirmed neither on the university's own page.",
      "The exact QS rank. We found two positions, so we show the band both fall inside.",
      "Whether this programme needs ATAS. It depends on the subject, so check the programme page, because the CAS waits for it.",
    ],
  },

  {
    slug: "university-of-warwick",
    name: "University of Warwick",
    destination: "united-kingdom",
    city: "Coventry",
    route: "Taught masters",
    type: "public",
    flagCode: "gb",
    initials: "WAR",
    summary:
      "A campus university outside Coventry with one of the strongest research reputations in this catalogue.",
    commission: UK_COMMISSION,
    highlights: {
      established: stated(1965, ON_RECORD, RESEARCHED_ON),
      totalStudents: stated(26515, "Institution's own press release announcing its QS 2027 result", RESEARCHED_ON),
      internationalStudents: stated(
        "About 44 per cent of the student body",
        "Reported by independent ranking aggregators this pass; the institution's own statistics page was not directly read",
        RESEARCHED_ON,
      ),
      staffRatio: unknown("Not published in a form that compares fairly with the other universities in this catalogue."),
      acceptanceRate: unknown(
        "Not published for the whole university. It varies hugely by programme, so one overall rate would tell you nothing about your course.",
      ),
      accreditation: stated(
        "UK degree-awarding body, recognised by the Office for Students",
        "UK Office for Students register",
        RESEARCHED_ON,
      ),
    },
    rankings: [
      {
        body: "QS World University Rankings",
        year: 2027,
        rank: "68th in the world, 10th in the UK",
        scope: "World, all subjects",
        source: "Institution's own press release announcing the result, fetched directly this pass",
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
      "Full international tuition at the higher of Warwick's two fee bands. That band covers lab-based and most quantitative postgraduate courses, including this one.",
      "Reported consistently across independent fee-comparison publications for the 2026/27 entry year; the institution's own fee page was not directly read this pass",
      RESEARCHED_ON,
    ),
    costOfLivingCity: "smaller",
    programmes: [
      {
        slug: "warwick-msc-data-analytics",
        universitySlug: "university-of-warwick",
        name: "MSc Data Analytics",
        level: "masters",
        disciplines: ["Data Science", "Computer Science"],
        durationMonths: 12,
        feePerYear: stated(
          37460,
          "Reported consistently across independent fee-comparison publications for 2026/27 entry; the institution's own fee page was not directly read to confirm it this pass",
          RESEARCHED_ON,
        ),
        currency: "GBP",
        feeQualifier: EDINBURGH_FEE_QUALIFIER,
        intakes: [
          {
            name: "September",
            applicationDeadline: "2027-08-02",
            teachingStarts: "2027-09-28",
            status: "not-yet-open",
            statusAsOf: RESEARCHED_ON,
            campus: "Coventry",
          },
        ],
        entryRequirement: stated(
          "A 2:1 honours degree or overseas equivalent in a quantitative subject; a 2:2 with relevant professional experience may also be considered.",
          "Reported consistently across independent admissions publications; the institution's own programme page was not directly read this pass",
          RESEARCHED_ON,
        ),
        prerequisites: unknown("We have not checked this yet."),
        languageOfInstruction: "English",
        placement: unknown("No placement term is stated on this one year taught programme."),
        campus: "Coventry",
      },
    ],
    notChecked: [
      "The exact tuition fee, confirmed only against independent sources. A separate, similarly named programme, MSc Economics and Data Science, has a different IELTS requirement and was not checked.",
      "Whether this programme needs ATAS. It depends on the subject, so check the programme page, because the CAS waits for it.",
    ],
  },

  {
    slug: "university-of-southampton",
    name: "University of Southampton",
    destination: "united-kingdom",
    city: "Southampton",
    route: "Taught masters",
    type: "public",
    flagCode: "gb",
    initials: "SOTON",
    summary:
      "A university with a strong engineering and electronics research base, in a south-coast port city that is cheaper than London and reachable from it by train.",
    commission: UK_COMMISSION,
    highlights: {
      established: stated(1862, `${ON_RECORD}, as the date of the original Hartley Institution`, RESEARCHED_ON),
      totalStudents: unknown(
        "Independent sources disagree, giving between about 22,000 and 26,500 for different years. We have not read the university's own statistics page to settle it.",
      ),
      internationalStudents: stated(
        "More than 10,000 students from over 130 countries; independent sources disagreed on the proportion, reporting figures between about a third and 45 per cent of the student body",
        "Independent sources disagreed within this session's search results; the institution's own statistics page was not directly read to resolve it",
        RESEARCHED_ON,
      ),
      staffRatio: unknown("Not published in a form that compares fairly with the other universities in this catalogue."),
      acceptanceRate: unknown(
        "Not published for the whole university. It varies hugely by programme, so one overall rate would tell you nothing about your course.",
      ),
      accreditation: stated(
        "UK degree-awarding body, recognised by the Office for Students",
        "UK Office for Students register",
        RESEARCHED_ON,
      ),
    },
    rankings: [
      {
        body: "QS World University Rankings: Europe",
        year: 2026,
        rank: "33rd in Europe, 17th in the UK",
        scope: "Europe",
        source: "Institution's own news page, fetched directly this pass; the institution's own page did not separately state its QS World Ranking (all subjects) position, reported elsewhere as 87th",
      },
    ],
    exams: [
      {
        exam: "IELTS Academic",
        undergraduate: unknown("Checked for the postgraduate route only this pass."),
        postgraduate: stated(
          "6.5 overall with no component below 6.0",
          "Institution's own programme page, fetched directly this pass",
          RESEARCHED_ON,
        ),
      },
    ],
    tuitionNote: stated(
      "Full international tuition, confirmed on the university's own page for this programme.",
      "Institution's own programme page, fetched directly this pass",
      RESEARCHED_ON,
    ),
    costOfLivingCity: "smaller",
    programmes: [
      {
        slug: "southampton-msc-artificial-intelligence",
        universitySlug: "university-of-southampton",
        name: "MSc Artificial Intelligence",
        level: "masters",
        disciplines: ["Computer Science", "Data Science"],
        durationMonths: 12,
        feePerYear: stated(
          36800,
          "Institution's own programme page, fetched directly this pass: a year's tuition stated as GBP 36,800",
          RESEARCHED_ON,
        ),
        currency: "GBP",
        feeQualifier: FEE_QUALIFIER,
        intakes: [
          {
            name: "September",
            applicationDeadline: "2027-06-30",
            teachingStarts: "2027-09-01",
            status: "not-yet-open",
            statusAsOf: RESEARCHED_ON,
            campus: "Highfield, Southampton",
          },
        ],
        entryRequirement: stated(
          "An upper second class (2:1) honours degree, 65 per cent or above, in computer science, software engineering, artificial intelligence or a closely related subject. Prerequisites: linear algebra, advanced programming, and AI or machine learning coursework.",
          "Institution's own programme page, fetched directly this pass",
          RESEARCHED_ON,
        ),
        prerequisites: stated(["Linear algebra", "Advanced programming (C, C++ or Java)", "AI or machine learning coursework"], "Institution's own programme page, fetched directly this pass", RESEARCHED_ON),
        languageOfInstruction: "English",
        placement: unknown("No placement term is stated on this one year taught programme."),
        campus: "Highfield, Southampton",
      },
    ],
    notChecked: [
      "Total and international student counts. Independent sources disagree, and we have not read the university's own statistics page.",
      "The university's own stated QS World University Ranking (all subjects) position. We confirmed only its Europe ranking.",
      "Whether this programme needs ATAS. It depends on the subject, so check the programme page, because the CAS waits for it.",
    ],
  },

  {
    slug: "university-of-bristol",
    name: "University of Bristol",
    destination: "united-kingdom",
    city: "Bristol",
    route: "Taught masters",
    type: "public",
    flagCode: "gb",
    initials: "BRIS",
    summary:
      "A Russell Group university with one of the highest published fees on our UK list. Bristol is expensive for its region but still well below London.",
    commission: UK_COMMISSION,
    highlights: {
      established: stated(1909, ON_RECORD, RESEARCHED_ON),
      totalStudents: stated(29680, "Reported by an independent ranking aggregator this pass; the institution's own statistics page was not directly read", RESEARCHED_ON),
      internationalStudents: stated(
        "Over 28 per cent of the student body, from more than 150 countries",
        "Institution's own international pages, found through search; the exact percentage was reported between 28 and 35 per cent by different sources",
        RESEARCHED_ON,
      ),
      staffRatio: unknown("Not published in a form that compares fairly with the other universities in this catalogue."),
      acceptanceRate: unknown(
        "Not published for the whole university. It varies hugely by programme, so one overall rate would tell you nothing about your course.",
      ),
      accreditation: stated(
        "UK degree-awarding body, recognised by the Office for Students",
        "UK Office for Students register",
        RESEARCHED_ON,
      ),
    },
    rankings: [
      {
        body: "QS World University Rankings",
        year: 2027,
        rank: "57th in the world, 8th in the UK",
        scope: "World, all subjects",
        source: "Institution's own news page announcing the result, fetched directly this pass",
      },
    ],
    exams: [
      {
        exam: "IELTS Academic",
        undergraduate: unknown("Checked for the postgraduate route only this pass."),
        postgraduate: stated(
          "6.5 overall with 6.5 in every component",
          "Institution's own English language requirements page (Profile C, which the programme page names), fetched directly this pass",
          RESEARCHED_ON,
        ),
      },
    ],
    tuitionNote: stated(
      "Full international tuition, confirmed on the university's own programme page. The university says fees are reviewed each year and may rise by up to 8 per cent a year on multi-year programmes.",
      "Institution's own programme page, fetched directly this pass",
      RESEARCHED_ON,
    ),
    costOfLivingCity: "manchester",
    programmes: [
      {
        slug: "bristol-msc-data-science",
        universitySlug: "university-of-bristol",
        name: "MSc Data Science",
        level: "masters",
        disciplines: ["Data Science", "Computer Science"],
        durationMonths: 12,
        feePerYear: stated(
          36500,
          "Institution's own programme page, fetched directly this pass: GBP 36,500 per year for 2026/27 entry",
          RESEARCHED_ON,
        ),
        currency: "GBP",
        feeQualifier: FEE_QUALIFIER,
        intakes: [
          {
            name: "September",
            applicationDeadline: "2027-08-13",
            teachingStarts: "2027-09-20",
            status: "not-yet-open",
            statusAsOf: RESEARCHED_ON,
            campus: "Clifton, Bristol",
          },
        ],
        entryRequirement: stated(
          "A strong upper second class (2:1) honours degree, 65 per cent or higher, or an international equivalent, in a numerate science, computer science or engineering subject. Accepted backgrounds include economics, finance, physics and psychology.",
          "Institution's own programme page, fetched directly this pass",
          RESEARCHED_ON,
        ),
        prerequisites: unknown("Not listed on the programme page beyond needing a numerate subject."),
        languageOfInstruction: "English",
        placement: unknown("No placement term is stated on this one year taught programme."),
        campus: "Clifton, Bristol",
      },
    ],
    notChecked: [
      "The exact international student percentage. Independent sources disagree (28 to 35 per cent), and we have not read the university's own statistics page.",
      "The 2027/28 fee. The figure shown is the university's published 2026/27 rate, and it says fees are reviewed each year.",
      "Whether this programme needs ATAS. It depends on the subject, so check the programme page, because the CAS waits for it.",
    ],
  },

  {
    slug: "university-of-nottingham",
    name: "University of Nottingham",
    destination: "united-kingdom",
    city: "Nottingham",
    route: "Taught masters",
    type: "public",
    flagCode: "gb",
    initials: "NOTT",
    summary:
      "A Russell Group university in the East Midlands, with rents well below the south of England and a fee towards the lower end of this catalogue's Russell Group entries.",
    commission: UK_COMMISSION,
    highlights: {
      established: stated(1881, `${ON_RECORD}, as the date of the original University College`, RESEARCHED_ON),
      totalStudents: stated(36491, "Institution's own 2024/25 student population data, found through search", RESEARCHED_ON),
      internationalStudents: stated(
        "About 24 per cent of the student body, 8,725 students in 2024/25",
        "Institution's own 2024/25 student population data, found through search",
        RESEARCHED_ON,
      ),
      staffRatio: unknown("Not published in a form that compares fairly with the other universities in this catalogue."),
      acceptanceRate: unknown(
        "Not published for the whole university. It varies hugely by programme, so one overall rate would tell you nothing about your course.",
      ),
      accreditation: stated(
        "UK degree-awarding body, recognised by the Office for Students",
        "UK Office for Students register",
        RESEARCHED_ON,
      ),
    },
    rankings: [
      {
        body: "QS World University Rankings",
        year: 2026,
        rank: "97th in the world, 17th in the UK",
        scope: "World, all subjects",
        source: "Institution's own news page announcing the result, fetched directly this pass",
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
      "Full international tuition, confirmed on the university's own 2026/27 fee schedule. The university also asks international taught postgraduate applicants for a GBP 4,500 CAS deposit before the visa process.",
      "Institution's own 2026/27 postgraduate taught fee schedule, fetched directly this pass; the CAS deposit figure is reported by independent sources",
      RESEARCHED_ON,
    ),
    costOfLivingCity: "manchester",
    programmes: [
      {
        slug: "nottingham-msc-computer-science",
        universitySlug: "university-of-nottingham",
        name: "MSc Computer Science",
        level: "masters",
        disciplines: ["Computer Science"],
        durationMonths: 12,
        feePerYear: stated(
          33800,
          "Institution's own 2026/27 postgraduate taught fee schedule, fetched directly this pass: \"G405 | MSc | Computer Science | GBP 33,800\" international rate",
          RESEARCHED_ON,
        ),
        currency: "GBP",
        feeQualifier: FEE_QUALIFIER,
        intakes: [
          {
            name: "September",
            applicationDeadline: "2027-06-30",
            teachingStarts: "2027-09-20",
            status: "not-yet-open",
            statusAsOf: RESEARCHED_ON,
            campus: "Jubilee Campus, Nottingham",
          },
        ],
        entryRequirement: stated(
          "A 2:1 honours degree or international equivalent. This conversion-style programme is for graduates from outside computer science.",
          "Reported consistently across independent admissions publications; the institution's own programme page was not directly read this pass",
          RESEARCHED_ON,
        ),
        prerequisites: unknown("We have not checked this yet."),
        languageOfInstruction: "English",
        placement: unknown("No placement term is stated on this one year taught programme."),
        campus: "Jubilee Campus, Nottingham",
      },
    ],
    notChecked: [
      "The IELTS component minimums and the degree requirement wording. Both come from independent sources, not the university's own programme page.",
      "Whether the related MSc Computer Science (Artificial Intelligence) pathway has the same fee. We read only the plain Computer Science line on the fee schedule.",
      "Whether this programme needs ATAS. It depends on the subject, so check the programme page, because the CAS waits for it.",
    ],
  },

  {
    slug: "university-of-sheffield",
    name: "University of Sheffield",
    destination: "united-kingdom",
    city: "Sheffield",
    route: "Taught masters",
    type: "public",
    flagCode: "gb",
    initials: "SHEF",
    summary:
      "A Russell Group university in South Yorkshire, with one of the lowest published Russell Group fees in this catalogue. Sheffield is among the cheapest large UK cities to rent in.",
    commission: UK_COMMISSION,
    highlights: {
      established: stated(1905, ON_RECORD, RESEARCHED_ON),
      totalStudents: stated(30000, "Institution's own international pages, found through search, stated as a round figure", RESEARCHED_ON),
      internationalStudents: stated(
        "Over 9,000 students, from around 140 countries",
        "Institution's own international pages, found through search",
        RESEARCHED_ON,
      ),
      staffRatio: unknown("Not published in a form that compares fairly with the other universities in this catalogue."),
      acceptanceRate: unknown(
        "Not published for the whole university. It varies hugely by programme, so one overall rate would tell you nothing about your course.",
      ),
      accreditation: stated(
        "UK degree-awarding body, recognised by the Office for Students",
        "UK Office for Students register",
        RESEARCHED_ON,
      ),
    },
    rankings: [
      {
        body: "QS World University Rankings",
        year: 2027,
        rank: "82nd in the world, 14th in the UK",
        scope: "World, all subjects",
        source: "Institution's own rankings page, fetched directly this pass",
      },
    ],
    exams: [
      {
        exam: "IELTS Academic",
        undergraduate: unknown("Checked for the postgraduate route only this pass."),
        postgraduate: stated(
          "6.5 overall with no component below 6.0",
          "Institution's own programme page, fetched directly this pass",
          RESEARCHED_ON,
        ),
      },
    ],
    tuitionNote: stated(
      "Full international tuition. The university's fee lookup tool would not load for us, so the figure comes from independent sources.",
      "Reported consistently across independent fee-comparison publications for 2026/27 entry; the institution's own fee lookup tool was not directly read this pass",
      RESEARCHED_ON,
    ),
    costOfLivingCity: "manchester",
    programmes: [
      {
        slug: "sheffield-msc-advanced-computer-science",
        universitySlug: "university-of-sheffield",
        name: "MSc Advanced Computer Science",
        level: "masters",
        disciplines: ["Computer Science"],
        durationMonths: 12,
        feePerYear: stated(
          31190,
          "Reported consistently across independent fee-comparison publications for 2026/27 entry; the institution's own fee lookup tool was not directly read this pass",
          RESEARCHED_ON,
        ),
        currency: "GBP",
        feeQualifier: EDINBURGH_FEE_QUALIFIER,
        intakes: [
          {
            name: "September",
            applicationDeadline: "2027-09-03",
            teachingStarts: "2027-09-20",
            status: "not-yet-open",
            statusAsOf: RESEARCHED_ON,
            campus: "Sheffield",
          },
        ],
        entryRequirement: stated(
          "A 2:1 honours degree in computer science, software engineering, data science, information technology or a closely related subject.",
          "Institution's own programme page, fetched directly this pass",
          RESEARCHED_ON,
        ),
        prerequisites: unknown("Not listed on the programme page beyond needing a related subject."),
        languageOfInstruction: "English",
        placement: unknown("No placement term is stated on this one year taught programme."),
        campus: "Sheffield",
      },
    ],
    notChecked: [
      "The exact tuition fee. The university's fee lookup tool would not load for us, so the figure comes from independent sources that agree.",
      "The application deadline. It is projected from the university's stated 2026 closing date, as the 2027 date was not yet published when we checked.",
      "Whether this programme needs ATAS. It depends on the subject, so check the programme page, because the CAS waits for it.",
    ],
  },
];
