import { stated, unknown, type University } from "./types";

const ON = "2026-09-03";
/** When the entries below Stuttgart, added later, were actually looked up. */
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
/**
 * Germany.
 *
 * Five of the sixteen institutions below charge non-EU students tuition at a public
 * university, which is the thing "study in Germany for free" gets wrong and the
 * thing our own site got wrong until early September 2026. KIT, Stuttgart, Heidelberg and Freiburg
 * sit in Baden-Wurttemberg and charge EUR 1,500 a semester. TUM introduced fees for
 * non-EU students from the 2024/25 winter semester under Bavaria's own law; LMU
 * Munich, in the same state, has not applied that law and stays genuinely free.
 *
 * Every commission figure on the public institutions is a confirmed zero. That
 * is the one figure on this platform we can publish as verified without asking
 * anyone's permission, because German public universities do not pay agents and
 * nobody has to consent to the publication of a zero.
 */

const PUBLIC_ZERO = {
  display: "₹0",
  lowInr: 0,
  highInr: 0,
  status: "verified-publishable" as const,
  source: "direct-written-confirmation" as const,
  note: "German public universities do not pay agents. We earn nothing if you enrol here, which is why the advisory fee on this route is the highest we charge.",
};

export const germanUniversities: University[] = [
  {
    slug: "tu-munich",
    name: "Technical University of Munich",
    destination: "germany",
    city: "Munich",
    route: "Public universities",
    type: "public",
    flagCode: "de",
    initials: "TUM",
    summary:
      "Germany's highest-ranked technical university. Bavarian law lets it charge non-EU students tuition, and TUM has done so since the 2024/25 winter semester.",
    commission: PUBLIC_ZERO,
    highlights: {
      established: stated(1868, "Institution's own history page", ON),
      totalStudents: stated(
        52000,
        "Institution's published student statistics",
        ON,
      ),
      internationalStudents: stated(
        "Around a third of the student body",
        "Institution's published student statistics",
        ON,
        "Stated as a proportion because the absolute figure moves each semester.",
      ),
      staffRatio: unknown(
        "TUM does not publish a staff to student ratio that compares with UK figures, and we will not work one out from separate headcounts.",
      ),
      acceptanceRate: unknown(
        "German universities generally do not publish acceptance rates. Restricted programmes admit on published points or credits instead.",
      ),
      accreditation: stated(
        "State university of the Free State of Bavaria, programmes accredited under the German accreditation system",
        "Institution's own accreditation page",
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
        rank: "Inside the world top 30",
        scope: "World, all subjects",
        source: "Times Higher Education published tables",
      },
    ],
    exams: [
      {
        exam: "IELTS Academic",
        undergraduate: unknown(
          "Most TUM Bachelor's programmes are taught in German, so the entry condition is a German certificate rather than an English one.",
        ),
        postgraduate: stated(
          "6.5 overall is the common threshold on English-taught Master's programmes; individual programmes set their own",
          "Programme admission regulations",
          ON,
        ),
      },
      {
        exam: "TOEFL iBT",
        undergraduate: unknown(
          "Bachelor's programmes here are taught in German, so the entry condition is a German certificate rather than an English one.",
        ),
        postgraduate: stated("88 to 90 on English-taught programmes", "Programme admission regulations", ON),
      },
      {
        exam: "German (TestDaF, DSH, telc, Goethe)",
        undergraduate: stated(
          "TestDaF TDN 4 in all sections, DSH-2, telc C1 Hochschule or Goethe C1 for German-taught programmes",
          "Institution's language requirement page",
          ON,
        ),
        postgraduate: stated(
          "Not required for an English-taught Master's. Required at the same levels for a German-taught one",
          "Programme admission regulations",
          ON,
        ),
      },
      {
        exam: "GRE",
        undergraduate: stated("Not required", "Programme admission regulations", ON),
        postgraduate: stated(
          "Not required by most programmes. A few ask for it and say so on their own page",
          "Programme admission regulations",
          ON,
        ),
      },
    ],
    tuitionNote: stated(
      "Since the 2024/25 winter semester, TUM has charged non-EU students tuition under Bavarian law, so it is not free for an Indian student. The amount is set per programme, on top of the semester contribution; check the programme's own fee page before you budget.",
      "Institution's published fee information, and Bavarian state law",
      ON,
    ),
    costOfLivingCity: "munich",
    programmes: [
      {
        slug: "tum-msc-mechanical-engineering",
        universitySlug: "tu-munich",
        name: "MSc Mechanical Engineering",
        level: "masters",
        disciplines: ["Engineering", "Mechanical Engineering"],
        durationMonths: 24,
        feePerYear: unknown(
          "TUM sets the non-EU fee per programme, and we have not read this programme's fee page since the change took effect. We will not guess a figure.",
        ),
        currency: "EUR",
        feeQualifier:
          "Tuition, where charged, is separate from the semester contribution that every student pays.",
        intakes: [
          {
            name: "Winter semester",
            applicationDeadline: "2027-05-31",
            teachingStarts: "2027-10-01",
            status: "not-yet-open",
            statusAsOf: ON,
            campus: "Garching",
          },
        ],
        entryRequirement: stated(
          "A Bachelor's in mechanical engineering or a closely related subject, judged on subject credits rather than the degree title. TUM also runs its own aptitude assessment.",
          "Programme admission regulations",
          ON,
        ),
        prerequisites: stated(
          [
            "Engineering mechanics",
            "Thermodynamics",
            "Mathematics for engineers",
            "Materials science",
          ],
          "Programme module handbook",
          ON,
        ),
        languageOfInstruction: "English",
        placement: unknown(
          "The programme page does not state a compulsory placement term. Research and industry projects exist and are arranged individually.",
        ),
        campus: "Garching",
      },
      {
        slug: "tum-msc-informatics",
        universitySlug: "tu-munich",
        name: "MSc Informatics",
        level: "masters",
        disciplines: ["Computer Science", "Engineering"],
        durationMonths: 24,
        feePerYear: unknown(
          "We have not read this programme's non-EU fee at source since Bavaria's change took effect.",
        ),
        currency: "EUR",
        feeQualifier: "Separate from the semester contribution.",
        intakes: [
          {
            name: "Winter semester",
            applicationDeadline: "2027-05-31",
            teachingStarts: "2027-10-01",
            status: "not-yet-open",
            statusAsOf: ON,
            campus: "Garching",
          },
          {
            name: "Summer semester",
            applicationDeadline: "2027-11-30",
            teachingStarts: "2028-04-01",
            status: "not-yet-open",
            statusAsOf: ON,
            campus: "Garching",
          },
        ],
        entryRequirement: stated(
          "A Bachelor's in informatics or a closely related subject, with the credit distribution the programme sets out, plus its own aptitude assessment.",
          "Programme admission regulations",
          ON,
        ),
        prerequisites: stated(
          ["Theoretical computer science", "Algorithms", "Mathematics", "Software engineering"],
          "Programme module handbook",
          ON,
        ),
        languageOfInstruction: "English",
        placement: unknown("No compulsory placement term is stated on the programme page."),
        campus: "Garching",
      },
    ],
    notChecked: [
      "The current non-EU tuition fee for each programme. It is the most important number on this page, and we will not guess it.",
      "Whether the aptitude assessment is run in India or only remotely.",
    ],
  },

  {
    slug: "kit-karlsruhe",
    name: "Karlsruhe Institute of Technology",
    destination: "germany",
    city: "Karlsruhe",
    route: "Public universities",
    type: "public",
    flagCode: "de",
    initials: "KIT",
    summary:
      "One of Germany's strongest engineering institutions, in Baden-Wurttemberg, which charges non-EU students EUR 1,500 per semester. That is EUR 6,000 across a four-semester Master's; our own site got this wrong until early September 2026.",
    commission: PUBLIC_ZERO,
    highlights: {
      established: stated(2009, "Institution's own history page. The merger date; its predecessor dates from 1825.", ON),
      totalStudents: stated(22000, "Institution's published student statistics", ON),
      internationalStudents: stated(
        "Roughly a fifth of the student body",
        "Institution's published student statistics",
        ON,
      ),
      staffRatio: unknown(
        "Not published in a form that compares fairly with the other universities in this catalogue.",
      ),
      acceptanceRate: unknown(
        "Not published. Restricted programmes admit on published criteria, not a rate.",
      ),
      accreditation: stated(
        "State university of Baden-Wurttemberg and a national research centre of the Helmholtz Association",
        "Institution's own pages",
        ON,
      ),
    },
    rankings: [
      {
        body: "QS World University Rankings",
        year: 2025,
        rank: "Inside the world top 150",
        scope: "World, all subjects",
        source: "QS published tables",
      },
    ],
    exams: [
      {
        exam: "IELTS Academic",
        undergraduate: unknown("Bachelor's programmes are taught in German."),
        postgraduate: stated("6.5 overall on English-taught Master's programmes", "Programme admission regulations", ON),
      },
      {
        exam: "German (TestDaF, DSH, telc, Goethe)",
        undergraduate: stated(
          "TestDaF TDN 4, DSH-2, telc C1 Hochschule or Goethe C1",
          "Institution's language requirement page",
          ON,
        ),
        postgraduate: stated(
          "Required for German-taught programmes at the same levels. Not required for an English-taught one",
          "Programme admission regulations",
          ON,
        ),
      },
      {
        exam: "GRE",
        undergraduate: stated("Not required", "Programme admission regulations", ON),
        postgraduate: stated("Not required", "Programme admission regulations", ON),
      },
    ],
    tuitionNote: stated(
      "EUR 1,500 per semester for non-EU students, under Baden-Wurttemberg state law since the 2017/18 winter semester, plus the semester contribution. A second degree costs EUR 650 per semester instead.",
      "Landeshochschulgebuhrengesetz, Baden-Wurttemberg, and the institution's fee page",
      ON,
    ),
    costOfLivingCity: "aachen",
    programmes: [
      {
        slug: "kit-msc-mechanical-engineering",
        universitySlug: "kit-karlsruhe",
        name: "MSc Mechanical Engineering",
        level: "masters",
        disciplines: ["Engineering", "Mechanical Engineering"],
        durationMonths: 24,
        feePerYear: stated(
          3000,
          "Landeshochschulgebuhrengesetz, Baden-Wurttemberg",
          ON,
          "The state's legal fee for non-EU students, EUR 1,500 per semester. It is not a programme price, and the semester contribution is extra.",
        ),
        currency: "EUR",
        feeQualifier:
          "State tuition for non-EU students, plus a semester contribution of roughly EUR 150 to EUR 200.",
        intakes: [
          {
            name: "Winter semester",
            applicationDeadline: "2027-07-15",
            teachingStarts: "2027-10-01",
            status: "not-yet-open",
            statusAsOf: ON,
            campus: "Karlsruhe",
          },
        ],
        entryRequirement: stated(
          "A Bachelor's in mechanical engineering, judged on the spread of credits rather than the degree title. The German-taught track needs a German certificate.",
          "Programme admission regulations",
          ON,
        ),
        prerequisites: stated(
          ["Engineering mechanics", "Thermodynamics", "Higher mathematics", "Machine design"],
          "Programme module handbook",
          ON,
        ),
        languageOfInstruction: "German for most tracks, with some English-taught modules",
        placement: unknown("No compulsory placement term is stated."),
        campus: "Karlsruhe",
      },
      {
        slug: "kit-msc-information-engineering",
        universitySlug: "kit-karlsruhe",
        name: "MSc Information Engineering and Management",
        level: "masters",
        disciplines: ["Computer Science", "Business", "Engineering"],
        durationMonths: 24,
        feePerYear: stated(
          3000,
          "Landeshochschulgebuhrengesetz, Baden-Wurttemberg",
          ON,
          "The same legal state fee. It applies across the university, not to this programme alone.",
        ),
        currency: "EUR",
        feeQualifier: "State tuition for non-EU students, plus the semester contribution.",
        intakes: [
          {
            name: "Winter semester",
            applicationDeadline: "2027-07-15",
            teachingStarts: "2027-10-01",
            status: "not-yet-open",
            statusAsOf: ON,
            campus: "Karlsruhe",
          },
          {
            name: "Summer semester",
            applicationDeadline: "2028-01-15",
            teachingStarts: "2028-04-01",
            status: "not-yet-open",
            statusAsOf: ON,
            campus: "Karlsruhe",
          },
        ],
        entryRequirement: stated(
          "A Bachelor's combining informatics and economics or business, with credits in both.",
          "Programme admission regulations",
          ON,
        ),
        prerequisites: unknown(
          "The programme asks for credits in two subject areas, not a list of named modules.",
        ),
        languageOfInstruction: "German",
        placement: unknown("No compulsory placement term is stated."),
        campus: "Karlsruhe",
      },
    ],
    notChecked: [
      "Whether any scholarship at this institution waives the EUR 1,500 state fee for an individual student.",
      "The exact semester contribution for the coming academic year.",
    ],
  },

  {
    slug: "rwth-aachen",
    name: "RWTH Aachen University",
    destination: "germany",
    city: "Aachen",
    route: "Public universities",
    type: "public",
    flagCode: "de",
    initials: "RWTH",
    summary:
      "Germany's largest technical university, in North Rhine-Westphalia, which charges no tuition. For an Indian engineering applicant, it is a textbook example of the German public route.",
    commission: PUBLIC_ZERO,
    highlights: {
      established: stated(1870, "Institution's own history page", ON),
      totalStudents: stated(47000, "Institution's published student statistics", ON),
      internationalStudents: stated(
        "Around a quarter of the student body",
        "Institution's published student statistics",
        ON,
      ),
      staffRatio: unknown(
        "Not published in a form that compares fairly with the other universities in this catalogue.",
      ),
      acceptanceRate: unknown("Not published. Admission is decided on published criteria."),
      accreditation: stated(
        "State university of North Rhine-Westphalia",
        "Institution's own pages",
        ON,
      ),
    },
    rankings: [
      {
        body: "QS World University Rankings",
        year: 2025,
        rank: "Inside the world top 100",
        scope: "World, all subjects",
        source: "QS published tables",
      },
      {
        body: "QS Subject Rankings",
        year: 2025,
        rank: "Inside the world top 40 for engineering and technology",
        scope: "Subject",
        source: "QS published tables",
      },
    ],
    exams: [
      {
        exam: "IELTS Academic",
        undergraduate: unknown("Bachelor's programmes are taught in German."),
        postgraduate: stated("6.5 overall on English-taught Master's programmes", "Programme admission regulations", ON),
      },
      {
        exam: "German (TestDaF, DSH, telc, Goethe)",
        undergraduate: stated("TestDaF TDN 4, DSH-2 or equivalent", "Institution's language requirement page", ON),
        postgraduate: stated(
          "Required for German-taught programmes. Not required for an English-taught one",
          "Programme admission regulations",
          ON,
        ),
      },
      {
        exam: "GRE",
        undergraduate: stated("Not required", "Programme admission regulations", ON),
        postgraduate: stated("Not required", "Programme admission regulations", ON),
      },
    ],
    tuitionNote: stated(
      "No tuition fee. The semester contribution of roughly EUR 330 includes a regional public transport ticket, which is generally worth more than the contribution.",
      "Institution's student administration pages",
      ON,
    ),
    costOfLivingCity: "aachen",
    programmes: [
      {
        slug: "rwth-msc-automotive-engineering",
        universitySlug: "rwth-aachen",
        name: "MSc Automotive Engineering",
        level: "masters",
        disciplines: ["Engineering", "Mechanical Engineering"],
        durationMonths: 24,
        feePerYear: stated(
          0,
          "Institution's student administration pages",
          ON,
          "No tuition fee. The semester contribution of roughly EUR 330 twice a year is not a tuition fee and includes a transport ticket.",
        ),
        currency: "EUR",
        feeQualifier: "No tuition. Semester contribution only.",
        intakes: [
          {
            name: "Winter semester",
            applicationDeadline: "2027-07-15",
            teachingStarts: "2027-10-01",
            status: "not-yet-open",
            statusAsOf: ON,
            campus: "Aachen",
          },
        ],
        entryRequirement: stated(
          "A Bachelor's in mechanical engineering or a closely related field, with the credit distribution the programme sets out.",
          "Programme admission regulations",
          ON,
        ),
        prerequisites: stated(
          ["Engineering mechanics", "Thermodynamics", "Higher mathematics", "Control engineering"],
          "Programme module handbook",
          ON,
        ),
        languageOfInstruction: "English",
        placement: unknown("No compulsory placement term is stated."),
        campus: "Aachen",
      },
      {
        slug: "rwth-msc-data-science",
        universitySlug: "rwth-aachen",
        name: "MSc Data Science",
        level: "masters",
        disciplines: ["Computer Science", "Data Science"],
        durationMonths: 24,
        feePerYear: stated(
          0,
          "Institution's student administration pages",
          ON,
          "No tuition fee. Semester contribution only.",
        ),
        currency: "EUR",
        feeQualifier: "No tuition. Semester contribution only.",
        intakes: [
          {
            name: "Winter semester",
            applicationDeadline: "2027-07-15",
            teachingStarts: "2027-10-01",
            status: "not-yet-open",
            statusAsOf: ON,
            campus: "Aachen",
          },
        ],
        entryRequirement: stated(
          "A Bachelor's in computer science, mathematics or a quantitative subject with the stated credit distribution.",
          "Programme admission regulations",
          ON,
        ),
        prerequisites: stated(
          ["Algorithms and data structures", "Linear algebra", "Statistics", "Programming"],
          "Programme module handbook",
          ON,
        ),
        languageOfInstruction: "English",
        placement: unknown("No compulsory placement term is stated."),
        campus: "Aachen",
      },
    ],
    notChecked: [
      "Whether either programme is currently under an admission restriction that changes the deadline.",
      "The exact semester contribution for the coming academic year.",
    ],
  },

  {
    slug: "university-of-stuttgart",
    name: "University of Stuttgart",
    destination: "germany",
    city: "Stuttgart",
    route: "Public universities",
    type: "public",
    flagCode: "de",
    initials: "US",
    summary:
      "Strong in automotive and aerospace engineering, and its automotive links put it on many Indian engineering shortlists. It is in Baden-Wurttemberg, so the EUR 1,500 per semester non-EU fee applies here too.",
    commission: PUBLIC_ZERO,
    highlights: {
      established: stated(1829, "Institution's own history page", ON),
      totalStudents: stated(23000, "Institution's published student statistics", ON),
      internationalStudents: stated(
        "Around a fifth of the student body",
        "Institution's published student statistics",
        ON,
      ),
      staffRatio: unknown(
        "Not published in a form that compares fairly with the other universities in this catalogue.",
      ),
      acceptanceRate: unknown(
        "The university does not publish this figure, and we will not work one out from separate headcounts.",
      ),
      accreditation: stated("State university of Baden-Wurttemberg", "Institution's own pages", ON),
    },
    rankings: [
      {
        body: "QS World University Rankings",
        year: 2025,
        rank: "Inside the world top 350",
        scope: "World, all subjects",
        source: "QS published tables",
      },
    ],
    exams: [
      {
        exam: "IELTS Academic",
        undergraduate: unknown("Bachelor's programmes are taught in German."),
        postgraduate: stated("6.5 overall on English-taught Master's programmes", "Programme admission regulations", ON),
      },
      {
        exam: "German (TestDaF, DSH, telc, Goethe)",
        undergraduate: stated("TestDaF TDN 4, DSH-2 or equivalent", "Institution's language requirement page", ON),
        postgraduate: stated("Required for German-taught programmes only", "Programme admission regulations", ON),
      },
      {
        exam: "GRE",
        undergraduate: stated("Not required", "Programme admission regulations", ON),
        postgraduate: stated("Not required", "Programme admission regulations", ON),
      },
    ],
    tuitionNote: stated(
      "EUR 1,500 per semester for non-EU students under Baden-Wurttemberg state law, plus the semester contribution.",
      "Landeshochschulgebuhrengesetz, Baden-Wurttemberg",
      ON,
    ),
    costOfLivingCity: "aachen",
    programmes: [
      {
        slug: "stuttgart-msc-infotech",
        universitySlug: "university-of-stuttgart",
        name: "MSc Information Technology (INFOTECH)",
        level: "masters",
        disciplines: ["Computer Science", "Electrical Engineering", "Engineering"],
        durationMonths: 24,
        feePerYear: stated(
          3000,
          "Landeshochschulgebuhrengesetz, Baden-Wurttemberg",
          ON,
          "The statutory state fee for non-EU students. Not programme-specific.",
        ),
        currency: "EUR",
        feeQualifier: "State tuition for non-EU students, plus the semester contribution.",
        intakes: [
          {
            name: "Winter semester",
            applicationDeadline: "2027-07-15",
            teachingStarts: "2027-10-01",
            status: "not-yet-open",
            statusAsOf: ON,
            campus: "Stuttgart",
          },
        ],
        entryRequirement: stated(
          "A Bachelor's in electrical engineering, computer engineering or a related subject, with the credit distribution stated in the admission regulations.",
          "Programme admission regulations",
          ON,
        ),
        prerequisites: stated(
          ["Digital systems", "Signals and systems", "Higher mathematics", "Programming"],
          "Programme module handbook",
          ON,
        ),
        languageOfInstruction: "English",
        placement: unknown("No compulsory placement term is stated."),
        campus: "Stuttgart",
      },
    ],
    notChecked: [
      "Whether the programme's own application deadline differs from the general 15 July.",
    ],
  },

  {
    slug: "tu-berlin",
    name: "Technical University of Berlin",
    destination: "germany",
    city: "Berlin",
    route: "Public universities",
    type: "public",
    flagCode: "de",
    initials: "TUB",
    summary:
      "No tuition, in a city where rooms cost less than in Munich but are harder to find. Finding a room, not the price, is what to plan for.",
    commission: PUBLIC_ZERO,
    highlights: {
      established: stated(1879, "Institution's own history page", ON),
      totalStudents: stated(33000, "Institution's published student statistics", ON),
      internationalStudents: stated(
        "Around a quarter of the student body",
        "Institution's published student statistics",
        ON,
      ),
      staffRatio: unknown(
        "Not published in a form that compares fairly with the other universities in this catalogue.",
      ),
      acceptanceRate: unknown(
        "The university does not publish this figure, and we will not work one out from separate headcounts.",
      ),
      accreditation: stated("State university of Berlin", "Institution's own pages", ON),
    },
    rankings: [
      {
        body: "QS World University Rankings",
        year: 2025,
        rank: "Inside the world top 200",
        scope: "World, all subjects",
        source: "QS published tables",
      },
    ],
    exams: [
      {
        exam: "IELTS Academic",
        undergraduate: unknown("Bachelor's programmes are taught in German."),
        postgraduate: stated("6.5 overall on English-taught Master's programmes", "Programme admission regulations", ON),
      },
      {
        exam: "German (TestDaF, DSH, telc, Goethe)",
        undergraduate: stated("TestDaF TDN 4, DSH-2 or equivalent", "Institution's language requirement page", ON),
        postgraduate: stated("Required for German-taught programmes only", "Programme admission regulations", ON),
      },
      {
        exam: "GRE",
        undergraduate: stated("Not required", "Programme admission regulations", ON),
        postgraduate: stated("Not required", "Programme admission regulations", ON),
      },
    ],
    tuitionNote: stated(
      "No tuition fee. A semester contribution of roughly EUR 300, which includes a transport ticket for the city.",
      "Institution's student administration pages",
      ON,
    ),
    costOfLivingCity: "berlin",
    programmes: [
      {
        slug: "tub-msc-computer-science",
        universitySlug: "tu-berlin",
        name: "MSc Computer Science",
        level: "masters",
        disciplines: ["Computer Science"],
        durationMonths: 24,
        feePerYear: stated(
          0,
          "Institution's student administration pages",
          ON,
          "No tuition fee. Semester contribution only.",
        ),
        currency: "EUR",
        feeQualifier: "No tuition. Semester contribution only.",
        intakes: [
          {
            name: "Winter semester",
            applicationDeadline: "2027-07-15",
            teachingStarts: "2027-10-01",
            status: "not-yet-open",
            statusAsOf: ON,
            campus: "Berlin",
          },
          {
            name: "Summer semester",
            applicationDeadline: "2028-01-15",
            teachingStarts: "2028-04-01",
            status: "not-yet-open",
            statusAsOf: ON,
            campus: "Berlin",
          },
        ],
        entryRequirement: stated(
          "A Bachelor's in computer science or a closely related subject with the stated credit distribution.",
          "Programme admission regulations",
          ON,
        ),
        prerequisites: stated(
          ["Theoretical computer science", "Algorithms", "Mathematics", "Software engineering"],
          "Programme module handbook",
          ON,
        ),
        languageOfInstruction: "German, with English-taught modules",
        placement: unknown("No compulsory placement term is stated."),
        campus: "Berlin",
      },
    ],
    notChecked: [
      "Whether this programme's teaching language has changed for the coming intake.",
    ],
  },

  {
    slug: "iu-international",
    name: "IU International University of Applied Sciences",
    destination: "germany",
    city: "Berlin, and online",
    route: "Private universities",
    type: "private",
    flagCode: "de",
    initials: "IU",
    summary:
      "A private university that pays agents, with English-taught programmes, rolling admissions and far less paperwork than the public route.",
    commission: {
      display: "₹1.3L to ₹3.5L",
      lowInr: 130000,
      highInr: 350000,
      status: "unverified",
      source: "market-estimate",
      aboveAverage: true,
      note: "A typical market estimate, not a contract term, and it runs above the average band for this category. That does not rule IU out, but if we recommend it, we will give the programme-fit reason in writing and show you this flag first.",
    },
    highlights: {
      established: stated(1998, "Institution's own history page", ON),
      totalStudents: unknown(
        "IU publishes one large figure covering campus and distance learning. It does not compare with a campus headcount, so we do not quote it.",
      ),
      internationalStudents: unknown(
        "Not published in a form that compares fairly with the other universities in this catalogue.",
      ),
      staffRatio: unknown(
        "The university does not publish this figure, and we will not work one out from separate headcounts.",
      ),
      acceptanceRate: unknown(
        "Not published. Private universities in Germany generally admit on a rolling basis against stated criteria rather than competitively.",
      ),
      accreditation: stated(
        "State-recognised private university, programmes accredited under the German accreditation system",
        "Institution's own accreditation page",
        ON,
      ),
    },
    rankings: [],
    exams: [
      {
        exam: "IELTS Academic",
        undergraduate: stated("6.0 overall is the common threshold", "Institution's admission page", ON),
        postgraduate: stated("6.5 overall is the common threshold", "Institution's admission page", ON),
      },
      {
        exam: "German (TestDaF, DSH, telc, Goethe)",
        undergraduate: stated("Not required for English-taught programmes", "Institution's admission page", ON),
        postgraduate: stated("Not required for English-taught programmes", "Institution's admission page", ON),
      },
      {
        exam: "GRE",
        undergraduate: stated("Not required", "Institution's admission page", ON),
        postgraduate: stated("Not required", "Institution's admission page", ON),
      },
    ],
    tuitionNote: stated(
      "Full tuition, charged monthly on most programmes. A monthly figure can look small, so compare the total for the whole degree, especially against the public route, where tuition is zero.",
      "Institution's published fee schedule",
      ON,
    ),
    costOfLivingCity: "berlin",
    programmes: [
      {
        slug: "iu-msc-data-science",
        universitySlug: "iu-international",
        name: "MSc Data Science",
        level: "masters",
        disciplines: ["Computer Science", "Data Science"],
        durationMonths: 24,
        feePerYear: unknown(
          "IU charges monthly, and the total depends on the study model you choose, so we will not work out a yearly figure. Ask for the total for the whole degree in writing before comparing it.",
        ),
        currency: "EUR",
        feeQualifier: "Full tuition, charged monthly. Compare on the total across the degree.",
        intakes: [
          {
            name: "Rolling admission",
            applicationDeadline: "2027-01-31",
            teachingStarts: "2027-03-01",
            status: "not-yet-open",
            statusAsOf: ON,
            campus: "Berlin",
          },
        ],
        entryRequirement: stated(
          "A Bachelor's in a related field, with a lighter credit-matching requirement than the public universities apply.",
          "Institution's admission page",
          ON,
        ),
        prerequisites: unknown(
          "The institution does not publish a named module prerequisite list for this programme.",
        ),
        languageOfInstruction: "English",
        placement: unknown("Not stated on the programme page."),
        campus: "Berlin",
      },
    ],
    notChecked: [
      "The total tuition across the degree for the coming intake, which is the only figure worth comparing.",
      "Whether the commission band above holds for IU itself. It is a category estimate, not confirmed with anyone.",
    ],
  },

  {
    slug: "lmu-munich",
    name: "Ludwig Maximilian University of Munich",
    destination: "germany",
    city: "Munich",
    route: "Public universities",
    type: "public",
    flagCode: "de",
    initials: "LMU",
    summary:
      "Bavaria's other major public university. Unlike its Munich neighbour TUM, LMU has not applied Bavaria's non-EU tuition law, so there is no tuition fee, only the small semester contribution.",
    commission: PUBLIC_ZERO,
    highlights: {
      established: stated(1472, ON_RECORD, RESEARCHED_ON),
      totalStudents: stated(52658, "Institution's own reporting for the 2025/26 winter semester, found through search", RESEARCHED_ON),
      internationalStudents: stated(
        "Around 11,700 students, about 22 per cent of the student body",
        "Institution's own reporting, found through search",
        RESEARCHED_ON,
      ),
      staffRatio: unknown(
        "Not published in a form that compares with UK figures, and we will not work one out from separate headcounts.",
      ),
      acceptanceRate: unknown(
        "German universities generally do not publish acceptance rates. Restricted programmes admit on published points or credits instead.",
      ),
      accreditation: stated(
        "State university of the Free State of Bavaria, programmes accredited under the German accreditation system",
        ON_RECORD,
        RESEARCHED_ON,
      ),
    },
    rankings: [
      {
        body: "QS World University Rankings",
        year: 2026,
        rank: "Inside the world top 60",
        scope: "World, all subjects",
        source: "Reported at #58 by independent sources this pass; the institution's own rankings page was not directly read, so a band rather than the exact digit",
      },
    ],
    exams: [
      {
        exam: "IELTS Academic",
        undergraduate: unknown("Checked for the postgraduate route only this pass."),
        postgraduate: stated(
          "6.5 overall, or TOEFL iBT 88, for the English-taught Master's programmes",
          "Reported consistently across independent sources for LMU's English-medium Master's route; the specific programme's own page was not directly read this pass",
          RESEARCHED_ON,
        ),
      },
    ],
    tuitionNote: stated(
      "No tuition fee. Only the semester contribution applies, roughly EUR 150 to 200 a semester, covering administration and a public transport pass.",
      "Reported consistently across independent sources; the institution's own fee page was not directly read this pass",
      RESEARCHED_ON,
    ),
    costOfLivingCity: "munich",
    programmes: [
      {
        slug: "lmu-msc-data-science",
        universitySlug: "lmu-munich",
        name: "MSc Data Science",
        level: "masters",
        disciplines: ["Data Science", "Computer Science"],
        durationMonths: 24,
        feePerYear: stated(0, "No tuition fee is charged; only the semester contribution applies", RESEARCHED_ON),
        currency: "EUR",
        feeQualifier:
          "No tuition fee. The semester contribution (roughly EUR 150 to 200) is separate and not shown here as tuition.",
        intakes: [
          {
            name: "Winter semester",
            applicationDeadline: "2027-05-31",
            teachingStarts: "2027-10-01",
            status: "not-yet-open",
            statusAsOf: RESEARCHED_ON,
            campus: "Munich",
          },
        ],
        entryRequirement: stated(
          "A Bachelor's with substantial quantitative content. Competitive English-taught programmes commonly ask for the equivalent of a strong upper second or a first.",
          "Reported consistently across independent sources; the programme's own admission page was not directly read this pass",
          RESEARCHED_ON,
        ),
        prerequisites: unknown("We have not checked this yet."),
        languageOfInstruction: "English",
        placement: unknown("No placement term is stated on this programme."),
        campus: "Munich",
      },
    ],
    notChecked: [
      "Whether this programme is restricted (NC), and its admission threshold this cycle.",
      "The exact QS rank. Independent sources report 58th; we show a band because we have not read the university's own page.",
      "Subject-specific admission criteria beyond the general degree class.",
    ],
  },

  {
    slug: "heidelberg-university",
    name: "Heidelberg University",
    destination: "germany",
    city: "Heidelberg",
    route: "Public universities",
    type: "public",
    flagCode: "de",
    initials: "UHD",
    summary:
      "Germany's oldest university, in Baden-Wurttemberg. The state's EUR 1,500 a semester non-EU tuition fee applies here, as at KIT and Stuttgart.",
    commission: PUBLIC_ZERO,
    highlights: {
      established: stated(1386, ON_RECORD, RESEARCHED_ON),
      totalStudents: stated(30000, "Institution's own reporting, found through search", RESEARCHED_ON),
      internationalStudents: stated(
        "Around 6,600 students, from more than 130 countries",
        "Institution's own reporting, found through search",
        RESEARCHED_ON,
      ),
      staffRatio: unknown(
        "Not published in a form that compares with UK figures, and we will not work one out from separate headcounts.",
      ),
      acceptanceRate: unknown(
        "German universities generally do not publish acceptance rates. Restricted programmes admit on published points or credits instead.",
      ),
      accreditation: stated(
        "State university of Baden-Wurttemberg, programmes accredited under the German accreditation system",
        ON_RECORD,
        RESEARCHED_ON,
      ),
    },
    rankings: [
      {
        body: "QS World University Rankings",
        year: 2026,
        rank: "Inside the world top 85",
        scope: "World, all subjects",
        source: "Reported at #80 by independent sources this pass; the institution's own rankings page was not directly read, so a band rather than the exact digit",
      },
    ],
    exams: [
      {
        exam: "IELTS Academic",
        undergraduate: unknown("Checked for the postgraduate route only this pass."),
        postgraduate: stated(
          "6.5 overall is the commonly stated figure for the English-taught Master's route",
          "Reported consistently across independent sources; the specific programme's own page was not directly read this pass",
          RESEARCHED_ON,
        ),
      },
    ],
    tuitionNote: stated(
      "EUR 1,500 per semester (about EUR 3,000 a year) for a non-EU or non-EEA student, under a Baden-Wurttemberg law that covers the whole state. Confirmed on the university's own tuition fee page.",
      "Institution's own tuition fee page, fetched directly this pass",
      RESEARCHED_ON,
    ),
    costOfLivingCity: null,
    programmes: [
      {
        slug: "heidelberg-msc-data-and-computer-science",
        universitySlug: "heidelberg-university",
        name: "MSc Data and Computer Science",
        level: "masters",
        disciplines: ["Computer Science", "Data Science"],
        durationMonths: 24,
        feePerYear: stated(
          3000,
          "Institution's own tuition fee page, fetched directly this pass: EUR 1,500 per semester for a non-EU student, doubled for the year",
          RESEARCHED_ON,
        ),
        currency: "EUR",
        feeQualifier:
          "EUR 1,500 a semester under Baden-Wurttemberg's non-EU tuition law, confirmed on the university's own page. The semester contribution (roughly EUR 150 to 200) is separate and not included.",
        intakes: [
          {
            name: "Winter semester",
            applicationDeadline: "2027-05-31",
            teachingStarts: "2027-10-01",
            status: "not-yet-open",
            statusAsOf: RESEARCHED_ON,
            campus: "Heidelberg",
          },
        ],
        entryRequirement: stated(
          "A Bachelor's degree in computer science or a closely related discipline with substantial quantitative content.",
          "Reported consistently across independent sources; the programme's own admission page was not directly read this pass",
          RESEARCHED_ON,
        ),
        prerequisites: unknown("We have not checked this yet."),
        languageOfInstruction: "English",
        placement: unknown("No placement term is stated on this programme."),
        campus: "Heidelberg",
      },
    ],
    notChecked: [
      "Whether this programme is restricted (NC), and its admission threshold this cycle.",
      "The exact QS rank. Independent sources report 80th; we show a band because we have not read the university's own page.",
      "Cost of living: Heidelberg is not yet in our cost of living calculator, so no city figure is linked here.",
    ],
  },

  {
    slug: "free-university-of-berlin",
    name: "Freie Universität Berlin",
    destination: "germany",
    city: "Berlin",
    route: "Public universities",
    type: "public",
    flagCode: "de",
    initials: "FUB",
    summary:
      "One of Berlin's major public universities, with no tuition fee because Berlin has not applied a non-EU fee. Its Computer Science Master's is mostly taught in German; the English-taught course listed here is Data Science, which is small and selective.",
    commission: PUBLIC_ZERO,
    highlights: {
      established: stated(1948, ON_RECORD, RESEARCHED_ON),
      totalStudents: stated(33900, "Institution's own reporting, found through search", RESEARCHED_ON),
      internationalStudents: stated(
        "About 4,950 international students, from around 80 countries",
        "Institution's own reporting, found through search",
        RESEARCHED_ON,
      ),
      staffRatio: unknown(
        "Not published in a form that compares with UK figures, and we will not work one out from separate headcounts.",
      ),
      acceptanceRate: unknown(
        "German universities generally do not publish acceptance rates. Restricted programmes admit on published points or credits instead.",
      ),
      accreditation: stated(
        "State university of Berlin, programmes accredited under the German accreditation system",
        ON_RECORD,
        RESEARCHED_ON,
      ),
    },
    rankings: [
      {
        body: "QS World University Rankings",
        year: 2026,
        rank: "88th in the world, improved from 97th the year before",
        scope: "World, all subjects",
        source: "Institution's own press release announcing the QS 2026 result",
      },
    ],
    exams: [
      {
        exam: "CEFR (general English proficiency)",
        undergraduate: unknown("Checked for the postgraduate route only this pass."),
        postgraduate: stated(
          "C1 level required for the Data Science programme specifically",
          "Reported consistently across independent sources for this specific programme; the programme's own admissions page was not directly read this pass",
          RESEARCHED_ON,
          "Other entries here give an IELTS score. This one gives what the programme itself asks for, because we have not confirmed an IELTS equivalent.",
        ),
      },
    ],
    tuitionNote: stated(
      "No tuition fee, only the semester contribution. It is reported at roughly EUR 358 a semester for Computer Science, but not yet confirmed for Data Science.",
      "Reported consistently across independent sources; the institution's own fee page was not directly read this pass",
      RESEARCHED_ON,
    ),
    costOfLivingCity: "berlin",
    programmes: [
      {
        slug: "fu-berlin-msc-data-science",
        universitySlug: "free-university-of-berlin",
        name: "MSc Data Science",
        level: "masters",
        disciplines: ["Data Science", "Computer Science"],
        durationMonths: 24,
        feePerYear: stated(0, "No tuition fee is charged; only the semester contribution applies", RESEARCHED_ON),
        currency: "EUR",
        feeQualifier:
          "No tuition fee. The semester contribution (roughly EUR 358, reported for a related programme, not confirmed for this one) is separate and not counted as tuition.",
        intakes: [
          {
            name: "Winter semester",
            applicationDeadline: "2027-05-31",
            teachingStarts: "2027-10-01",
            status: "not-yet-open",
            statusAsOf: RESEARCHED_ON,
            campus: "Berlin",
          },
        ],
        entryRequirement: stated(
          "Highly selective: hundreds of applications for around 30 to 40 seats. The general requirement is a Bachelor's with substantial quantitative content; we have not read the exact published threshold.",
          "Reported consistently across independent sources; the programme's own admissions page was not directly read this pass",
          RESEARCHED_ON,
        ),
        prerequisites: unknown("We have not checked this yet."),
        languageOfInstruction: "English",
        placement: unknown("No placement term is stated on this programme."),
        campus: "Berlin",
      },
    ],
    notChecked: [
      "Whether this programme is restricted (NC), and its admission threshold this cycle.",
      "The exact semester contribution for this programme. The figure shown is reported for a related programme.",
      "The programme's own degree class or subject requirement, beyond the general picture from independent sources.",
    ],
  },

  {
    slug: "university-of-hamburg",
    name: "University of Hamburg",
    destination: "germany",
    city: "Hamburg",
    route: "Public universities",
    type: "public",
    flagCode: "de",
    initials: "UHH",
    summary:
      "Hamburg's largest university, in a state that has not applied a non-EU tuition fee, so there is no tuition fee here.",
    commission: PUBLIC_ZERO,
    highlights: {
      established: stated(1919, ON_RECORD, RESEARCHED_ON),
      totalStudents: stated(43000, "Institution's own reporting, found through search", RESEARCHED_ON),
      internationalStudents: stated(
        "Nearly 6,000 international students, from more than 130 countries",
        "Institution's own reporting, found through search",
        RESEARCHED_ON,
      ),
      staffRatio: unknown(
        "Not published in a form that compares with UK figures, and we will not work one out from separate headcounts.",
      ),
      acceptanceRate: unknown(
        "German universities generally do not publish acceptance rates. Restricted programmes admit on published points or credits instead.",
      ),
      accreditation: stated(
        "State university of Hamburg, programmes accredited under the German accreditation system",
        ON_RECORD,
        RESEARCHED_ON,
      ),
    },
    rankings: [
      {
        body: "QS World University Rankings",
        year: 2026,
        rank: "Inside the world top 200",
        scope: "World, all subjects",
        source: "Reported at #193 by independent sources this pass; the institution's own rankings page was not directly read",
      },
    ],
    exams: [
      {
        exam: "IELTS Academic",
        undergraduate: unknown("Checked for the postgraduate route only this pass."),
        postgraduate: unknown(
          "Our search results mixed Universität Hamburg with Hamburg University of Technology (TUHH), a separate university. We could not tell the English-taught Data Science figures apart, so we left this unknown rather than risk the wrong one.",
        ),
      },
    ],
    tuitionNote: stated(
      "No tuition fee for a public university in Hamburg, a state that has not applied a non-EU fee. Only the semester contribution applies, in the low hundreds of euros.",
      "Reported consistently across independent sources for Hamburg's public universities generally; the institution's own fee page was not directly read this pass",
      RESEARCHED_ON,
    ),
    costOfLivingCity: null,
    programmes: [
      {
        slug: "hamburg-msc-data-science",
        universitySlug: "university-of-hamburg",
        name: "MSc Data Science",
        level: "masters",
        disciplines: ["Data Science", "Computer Science"],
        durationMonths: 24,
        feePerYear: stated(0, "No tuition fee is charged; only the semester contribution applies", RESEARCHED_ON),
        currency: "EUR",
        feeQualifier:
          "No tuition fee. The semester contribution (reported in the low hundreds of euros; exact figure not confirmed for this programme) is separate and not counted as tuition.",
        intakes: [
          {
            name: "Winter semester",
            applicationDeadline: "2027-05-31",
            teachingStarts: "2027-10-01",
            status: "not-yet-open",
            statusAsOf: RESEARCHED_ON,
            campus: "Hamburg",
          },
        ],
        entryRequirement: unknown(
          "Our search results mixed Universität Hamburg with the separate Hamburg University of Technology, so we could not confirm this entry requirement. We left it unknown rather than credit it to the wrong university.",
        ),
        prerequisites: unknown("Not checked yet, for the same reason as the entry requirement."),
        languageOfInstruction: "English",
        placement: unknown("No placement term is stated on this programme."),
        campus: "Hamburg",
      },
    ],
    notChecked: [
      "Searches for Universität Hamburg kept returning Hamburg University of Technology (TUHH), a separate university, so facts we could not place are marked unknown above. This programme still needs checking on uni-hamburg.de.",
      "Cost of living: Hamburg is not yet in our cost of living calculator, so no city figure is linked here.",
      "The exact QS rank and semester contribution figure.",
    ],
  },

  {
    slug: "tu-dresden",
    name: "Technische Universität Dresden",
    destination: "germany",
    city: "Dresden",
    route: "Public universities",
    type: "public",
    flagCode: "de",
    initials: "TUD",
    summary:
      "A Saxon technical university with a strong engineering research base, in a state that has not applied a non-EU tuition fee, so there is no tuition fee here.",
    commission: PUBLIC_ZERO,
    highlights: {
      established: stated(1828, ON_RECORD, RESEARCHED_ON),
      totalStudents: unknown(
        "Independent sources disagree, giving between about 20,600 and 36,000. We have not read the university's own statistics page to settle it.",
      ),
      internationalStudents: stated(
        "Reported at about 15 per cent of the student body by one independent source",
        "Independent source (THE World University Rankings data); the institution's own statistics page was not directly read",
        RESEARCHED_ON,
      ),
      staffRatio: unknown(
        "Not published in a form that compares fairly with the other universities in this catalogue.",
      ),
      acceptanceRate: unknown(
        "German universities generally do not publish acceptance rates. This programme uses an aptitude assessment rather than a simple points threshold.",
      ),
      accreditation: stated(
        "State university of Saxony, programmes accredited under the German accreditation system",
        ON_RECORD,
        RESEARCHED_ON,
      ),
    },
    rankings: [
      {
        body: "QS World University Rankings by Subject",
        year: 2026,
        rank: "94th in the world for Engineering and Technology",
        scope: "Subject: Engineering and Technology",
        source: "Institution's own news page, fetched directly this pass",
      },
    ],
    exams: [
      {
        exam: "IELTS Academic",
        undergraduate: unknown("Checked for the postgraduate route only this pass."),
        postgraduate: stated(
          "7.0 overall with no component below 7.0 (C1 CEFR level)",
          "Institution's own admission page for this specific programme, fetched directly this pass",
          RESEARCHED_ON,
        ),
      },
    ],
    tuitionNote: stated(
      "No tuition fee for a public university in Saxony, a state that has not applied a non-EU fee. Only the semester contribution applies, stated by the institution at EUR 361 for winter 2026/27.",
      "Reported consistently across independent sources for Saxony's public universities generally; the institution's own fee page was not directly read this pass",
      RESEARCHED_ON,
    ),
    costOfLivingCity: null,
    programmes: [
      {
        slug: "tud-msc-computer-science",
        universitySlug: "tu-dresden",
        name: "MSc Computer Science",
        level: "masters",
        disciplines: ["Computer Science"],
        durationMonths: 24,
        feePerYear: stated(0, "No tuition fee is charged; only the semester contribution applies", RESEARCHED_ON),
        currency: "EUR",
        feeQualifier:
          "No tuition fee. The semester contribution, EUR 361 for winter 2026/27 according to the university, is separate and not counted as tuition.",
        intakes: [
          {
            name: "Winter semester",
            applicationDeadline: "2027-05-31",
            teachingStarts: "2027-10-01",
            status: "not-yet-open",
            statusAsOf: RESEARCHED_ON,
            campus: "Dresden",
          },
        ],
        entryRequirement: stated(
          "A first professionally qualifying university degree in Computer Science. It needs at least 90 ECTS across systems and architecture (35+), mathematics and theoretical computer science (35+), and programming fundamentals (20+).",
          "Institution's own admission page for this specific programme, fetched directly this pass",
          RESEARCHED_ON,
        ),
        prerequisites: stated(
          ["Systems and architecture", "Mathematics and theoretical computer science", "Programming fundamentals"],
          "Institution's own admission page for this specific programme, fetched directly this pass",
          RESEARCHED_ON,
        ),
        languageOfInstruction: "English",
        placement: unknown("No placement term is stated on this programme."),
        campus: "Dresden",
      },
    ],
    notChecked: [
      "The aptitude assessment the university runs before enrolment, separate from the application window. We have not read its procedure or timeline.",
      "Total student count. Independent sources disagree widely, and we have not read the university's own statistics page.",
      "Cost of living: Dresden is not yet in our cost of living calculator, so no city figure is linked here.",
    ],
  },

  {
    slug: "university-of-bonn",
    name: "University of Bonn",
    destination: "germany",
    city: "Bonn",
    route: "Public universities",
    type: "public",
    flagCode: "de",
    initials: "BONN",
    summary:
      "A university in the former West German capital, strong in mathematics and the sciences. Its state has not applied a non-EU tuition fee, so there is no tuition fee here.",
    commission: PUBLIC_ZERO,
    highlights: {
      established: stated(1818, ON_RECORD, RESEARCHED_ON),
      totalStudents: unknown(
        "One independent source reports about 24,500. We have not confirmed it on the university's own statistics page.",
      ),
      internationalStudents: stated(
        "Reported at about 16 per cent of the student body by one independent source",
        "Independent source (THE World University Rankings data); the institution's own statistics page was not directly read",
        RESEARCHED_ON,
      ),
      staffRatio: unknown(
        "Not published in a form that compares fairly with the other universities in this catalogue.",
      ),
      acceptanceRate: unknown(
        "German universities generally do not publish acceptance rates. Restricted programmes admit on published points or credits instead.",
      ),
      accreditation: stated(
        "State university of North Rhine-Westphalia, programmes accredited under the German accreditation system",
        ON_RECORD,
        RESEARCHED_ON,
      ),
    },
    rankings: [
      {
        body: "QS World University Rankings",
        year: 2026,
        rank: "209th in the world, 84th in Europe, 10th in Germany",
        scope: "World, all subjects",
        source: "Institution's own rankings page, fetched directly this pass",
      },
    ],
    exams: [
      {
        exam: "IELTS Academic",
        undergraduate: unknown("Checked for the postgraduate route only this pass."),
        postgraduate: stated(
          "7.0 overall (C1 CEFR level), valid until the start of the upcoming semester",
          "Institution's own admission page for this specific programme, fetched directly this pass",
          RESEARCHED_ON,
        ),
      },
    ],
    tuitionNote: stated(
      "No tuition fee for a public university in North Rhine-Westphalia, a state that has not applied a non-EU fee. Only the semester contribution applies, reported at roughly EUR 345 to 350 by independent sources but not confirmed on the university's own page.",
      "Reported consistently across independent sources; the institution's own fee page was not directly read this pass",
      RESEARCHED_ON,
    ),
    costOfLivingCity: null,
    programmes: [
      {
        slug: "bonn-msc-computer-science",
        universitySlug: "university-of-bonn",
        name: "MSc Computer Science",
        level: "masters",
        disciplines: ["Computer Science"],
        durationMonths: 24,
        feePerYear: stated(0, "No tuition fee is charged; only the semester contribution applies", RESEARCHED_ON),
        currency: "EUR",
        feeQualifier:
          "No tuition fee. The semester contribution (roughly EUR 345 to 350, reported by independent sources, not confirmed on the university's own page) is separate and not counted as tuition.",
        intakes: [
          {
            name: "Winter semester",
            applicationDeadline: "2027-05-31",
            teachingStarts: "2027-10-01",
            status: "not-yet-open",
            statusAsOf: RESEARCHED_ON,
            campus: "Bonn",
          },
        ],
        entryRequirement: stated(
          "A Bachelor's in computer science or a related field, including a scientific thesis worth at least 12 ECTS. You need at least 18 ECTS in mathematics, 14 ECTS in algorithm and complexity theory, and 18 ECTS in programming, software technology and information systems.",
          "Institution's own admission page for this specific programme, fetched directly this pass",
          RESEARCHED_ON,
        ),
        prerequisites: stated(
          ["Mathematics", "Algorithm and complexity theory", "Programming and software technology"],
          "Institution's own admission page for this specific programme, fetched directly this pass",
          RESEARCHED_ON,
        ),
        languageOfInstruction: "English",
        placement: unknown("No placement term is stated on this programme."),
        campus: "Bonn",
      },
    ],
    notChecked: [
      "The exact application deadline for this group of applicants. The university's page points to a separate deadlines page we have not read.",
      "Total student count and the exact semester contribution. Both come from independent sources only, not the university's own page.",
      "Cost of living: Bonn is not yet in our cost of living calculator, so no city figure is linked here.",
    ],
  },

  {
    slug: "tu-darmstadt",
    name: "Technische Universität Darmstadt",
    destination: "germany",
    city: "Darmstadt",
    route: "Public universities",
    type: "public",
    flagCode: "de",
    initials: "TUDA",
    summary:
      "A technical university half an hour from Frankfurt, in Hesse, which has not applied a non-EU tuition fee, so there is no tuition fee here. You can take its AI and machine learning Master's entirely in English by choosing English-taught courses.",
    commission: PUBLIC_ZERO,
    highlights: {
      established: stated(1877, ON_RECORD, RESEARCHED_ON),
      totalStudents: unknown(
        "One independent source reports over 25,000. The university's own page we read gave no headcount, so this is not confirmed.",
      ),
      internationalStudents: stated(
        "Reported at about 19 per cent of the student body; the institution's own page states only that its international share ranks in the top five among German universities",
        "Percentage from an independent source this pass; the top-five claim from the institution's own study page, fetched directly this pass",
        RESEARCHED_ON,
      ),
      staffRatio: unknown(
        "Not published in a form that compares fairly with the other universities in this catalogue.",
      ),
      acceptanceRate: unknown(
        "German universities generally do not publish acceptance rates. This programme admits by comparing your credits with a reference Bachelor's degree.",
      ),
      accreditation: stated(
        "State university of Hesse, programmes accredited under the German accreditation system",
        ON_RECORD,
        RESEARCHED_ON,
      ),
    },
    rankings: [
      {
        body: "QS World University Rankings",
        year: 2026,
        rank: "Inside the world top 260",
        scope: "World, all subjects",
        source: "Reported at 253rd by independent sources this pass; the institution's own rankings page was not directly read",
      },
    ],
    exams: [
      {
        exam: "IELTS Academic",
        undergraduate: unknown("Checked for the postgraduate route only this pass."),
        postgraduate: stated(
          "7.0 overall (C1 CEFR level)",
          "The C1 level is stated on the institution's own programme page, fetched directly this pass; the IELTS 7.0 equivalence is reported consistently across independent sources and was not read off the institution's own page",
          RESEARCHED_ON,
          "The university's own page asks for CEFR C1. The IELTS figure here is the equivalent that independent sources report.",
        ),
      },
    ],
    tuitionNote: stated(
      "No tuition fee for a public university in Hesse, a state that has not applied a non-EU fee. Only the semester contribution applies, reported at roughly EUR 300 to 400 by independent sources.",
      "Reported consistently across independent sources; the institution's own fee page was not directly read this pass",
      RESEARCHED_ON,
    ),
    costOfLivingCity: null,
    programmes: [
      {
        slug: "tuda-msc-artificial-intelligence-and-machine-learning",
        universitySlug: "tu-darmstadt",
        name: "MSc Artificial Intelligence and Machine Learning",
        level: "masters",
        disciplines: ["Computer Science", "Data Science"],
        durationMonths: 24,
        feePerYear: stated(0, "No tuition fee is charged; only the semester contribution applies", RESEARCHED_ON),
        currency: "EUR",
        feeQualifier:
          "No tuition fee. The semester contribution (roughly EUR 300 to 400, reported by independent sources, not confirmed on the university's own page) is separate and not counted as tuition.",
        intakes: [
          {
            name: "Winter semester",
            applicationDeadline: "2027-07-15",
            teachingStarts: "2027-10-01",
            status: "not-yet-open",
            statusAsOf: RESEARCHED_ON,
            campus: "Darmstadt",
          },
        ],
        entryRequirement: stated(
          "A Bachelor's equivalent to TU Darmstadt's own BSc Informatik. You need at least 60 ECTS in core computer science that closely match that programme.",
          "Institution's own programme page, fetched directly this pass",
          RESEARCHED_ON,
        ),
        prerequisites: stated(
          ["Core computer science (60 ECTS against the reference bachelor's)"],
          "Institution's own programme page, fetched directly this pass",
          RESEARCHED_ON,
        ),
        languageOfInstruction: "English",
        placement: unknown("No placement term is stated on this programme."),
        campus: "Darmstadt",
      },
    ],
    notChecked: [
      "The programme has English and German-taught modules; its own page says you can finish it in English by choosing only English-taught ones. We have not checked whether every specialisation allows that.",
      "The winter application window (1 June to 15 July) comes from independent sources. The university's own page mentions deadlines but does not list the dates.",
      "Total student count and the exact QS rank. Both come from independent sources only, not the university's own page.",
      "Cost of living: Darmstadt is not yet in our cost of living calculator, so no city figure is linked here.",
    ],
  },

  {
    slug: "university-of-freiburg",
    name: "University of Freiburg",
    destination: "germany",
    city: "Freiburg",
    route: "Public universities",
    type: "public",
    flagCode: "de",
    initials: "ALU",
    summary:
      "One of Germany's oldest universities, in the Black Forest corner of Baden-Wurttemberg. Like KIT, Stuttgart and Heidelberg, it charges non-EU students EUR 1,500 a semester, which most of Germany does not.",
    commission: PUBLIC_ZERO,
    highlights: {
      established: stated(1457, ON_RECORD, RESEARCHED_ON),
      totalStudents: stated(24391, "Reported by an independent source this pass; the institution's own statistics page was not directly read", RESEARCHED_ON),
      internationalStudents: stated(
        "About 18 per cent of the student body, from over 120 countries",
        "Reported by independent sources this pass; the institution's own statistics page was not directly read",
        RESEARCHED_ON,
      ),
      staffRatio: unknown(
        "Not published in a form that compares fairly with the other universities in this catalogue.",
      ),
      acceptanceRate: unknown(
        "German universities generally do not publish acceptance rates. Restricted programmes admit on published points or credits instead.",
      ),
      accreditation: stated(
        "State university of Baden-Wurttemberg, programmes accredited under the German accreditation system",
        ON_RECORD,
        RESEARCHED_ON,
      ),
    },
    rankings: [
      {
        body: "QS World University Rankings",
        year: 2026,
        rank: "201st in the world, inside the national top ten",
        scope: "World, all subjects",
        source: "Institution's own press release announcing the result, found through search; the page returned an error to this session's direct fetch",
      },
    ],
    exams: [
      {
        exam: "IELTS Academic",
        undergraduate: unknown("Checked for the postgraduate route only this pass."),
        postgraduate: stated(
          "7.0 overall",
          "Reported consistently across independent admissions publications; the institution's own programme page was not directly read this pass",
          RESEARCHED_ON,
        ),
      },
    ],
    tuitionNote: stated(
      "EUR 1,500 a semester for a non-EU student on a consecutive master's, under Baden-Wurttemberg's State Higher Education Fees Act, on top of the semester contribution. That is EUR 3,000 a year and EUR 6,000 across the four semesters.",
      "Reported consistently across independent sources, quoting the institution's own fee page; that page returned an error to this session's direct fetch",
      RESEARCHED_ON,
    ),
    costOfLivingCity: null,
    programmes: [
      {
        slug: "freiburg-msc-computer-science",
        universitySlug: "university-of-freiburg",
        name: "MSc Computer Science",
        level: "masters",
        disciplines: ["Computer Science"],
        durationMonths: 24,
        feePerYear: stated(
          3000,
          "EUR 1,500 a semester under Baden-Wurttemberg's non-EU fee law, reported consistently across independent sources; the institution's own fee page returned an error to this session's fetch",
          RESEARCHED_ON,
        ),
        currency: "EUR",
        feeQualifier:
          "Baden-Wurttemberg's non-EU tuition fee of EUR 1,500 a semester, shown as EUR 3,000 a year. The semester contribution is separate and not included.",
        intakes: [
          {
            name: "Winter semester",
            applicationDeadline: "2027-05-31",
            teachingStarts: "2027-10-13",
            status: "not-yet-open",
            statusAsOf: RESEARCHED_ON,
            campus: "Freiburg",
          },
        ],
        entryRequirement: stated(
          "A Bachelor's degree in computer science or a closely related subject.",
          "Reported consistently across independent admissions publications; the institution's own programme page was not directly read this pass",
          RESEARCHED_ON,
        ),
        prerequisites: unknown("We have not checked this yet."),
        languageOfInstruction: "English",
        placement: unknown("No placement term is stated on this programme."),
        campus: "Freiburg",
      },
    ],
    notChecked: [
      "The university's own fee and programme pages would not load for us. Every figure above comes from independent sources that agree, and should be checked on uni-freiburg.de.",
      "One independent source says this programme needs the GRE. That is unusual for a German public university and unconfirmed, so we neither print it nor rule it out.",
      "The exact semester contribution and the Artificial Intelligence specialisation's own admission criteria.",
      "Cost of living: Freiburg is not yet in our cost of living calculator, so no city figure is linked here.",
    ],
  },

  {
    slug: "university-of-gottingen",
    name: "University of Gottingen",
    destination: "germany",
    city: "Gottingen",
    route: "Public universities",
    type: "public",
    flagCode: "de",
    initials: "UGOE",
    summary:
      "A university with a long scientific reputation, in a small Lower Saxony town where rents are below the big cities. The state has not applied a non-EU tuition fee, so there is no tuition fee here.",
    commission: PUBLIC_ZERO,
    highlights: {
      established: stated(1737, ON_RECORD, RESEARCHED_ON),
      totalStudents: unknown(
        "Independent sources disagree, giving between about 19,800 and 26,000. We have not read the university's own statistics page to settle it.",
      ),
      internationalStudents: stated(
        "Reported between about 11 and 14 per cent of the student body by different independent sources",
        "Independent sources disagreed within this session's search results; the institution's own statistics page was not directly read to resolve it",
        RESEARCHED_ON,
      ),
      staffRatio: unknown(
        "Not published in a form that compares fairly with the other universities in this catalogue.",
      ),
      acceptanceRate: unknown(
        "German universities generally do not publish acceptance rates. Restricted programmes admit on published points or credits instead.",
      ),
      accreditation: stated(
        "State university of Lower Saxony, programmes accredited under the German accreditation system",
        ON_RECORD,
        RESEARCHED_ON,
      ),
    },
    rankings: [
      {
        body: "QS World University Rankings",
        year: 2026,
        rank: "Inside the world top 250",
        scope: "World, all subjects",
        source: "Reported at 243rd by independent sources this pass; the institution's own rankings page was not directly read",
      },
    ],
    exams: [
      {
        exam: "IELTS Academic",
        undergraduate: unknown("Checked for the postgraduate route only this pass."),
        postgraduate: stated(
          "6.5 overall (C1 CEFR level)",
          "The C1 level is stated on the institution's own programme page, fetched directly this pass; the IELTS 6.5 figure is from the programme's DAAD listing, not read off the institution's own page",
          RESEARCHED_ON,
          "The university's own page also accepts CEFR B2 English plus German at DSH level 2, a route most applicants from India will not use.",
        ),
      },
    ],
    tuitionNote: stated(
      "No tuition fee for a public university in Lower Saxony, a state that has not applied a non-EU fee. Only the semester contribution applies, reported at roughly EUR 460 a semester including a regional transport ticket.",
      "No fee is stated on the programme's DAAD listing and independent sources agree; the institution's own fee page was not directly read this pass",
      RESEARCHED_ON,
    ),
    costOfLivingCity: null,
    programmes: [
      {
        slug: "gottingen-msc-applied-data-science",
        universitySlug: "university-of-gottingen",
        name: "MSc Applied Data Science",
        level: "masters",
        disciplines: ["Data Science", "Computer Science"],
        durationMonths: 24,
        feePerYear: stated(0, "No tuition fee is charged; only the semester contribution applies", RESEARCHED_ON),
        currency: "EUR",
        feeQualifier:
          "No tuition fee. The semester contribution (roughly EUR 460, reported by independent sources, not confirmed on the university's own page) is separate and not counted as tuition.",
        intakes: [
          {
            name: "Winter semester",
            applicationDeadline: "2027-05-01",
            teachingStarts: "2027-10-01",
            status: "not-yet-open",
            statusAsOf: RESEARCHED_ON,
            campus: "Gottingen",
          },
        ],
        entryRequirement: stated(
          "A Bachelor's of at least 180 ECTS, with at least 60 ECTS in data science, computer science, statistics, mathematics or a related field. Up to 15 of those credits can be completed after admission.",
          "Institution's own programme page, fetched directly this pass",
          RESEARCHED_ON,
        ),
        prerequisites: stated(
          ["Data science, computer science, statistics or mathematics (60 ECTS)"],
          "Institution's own programme page, fetched directly this pass",
          RESEARCHED_ON,
        ),
        languageOfInstruction: "English",
        placement: unknown("No placement term is stated on this programme."),
        campus: "Gottingen",
      },
    ],
    notChecked: [
      "The programme's own page says it is taught mainly in English, with some electives in German. We have not checked which electives.",
      "Total student count and the exact QS rank. Independent sources disagree on the first, and we have not read the university's own pages for either.",
      "Cost of living: Gottingen is not yet in our cost of living calculator, so no city figure is linked here.",
    ],
  },

  {
    slug: "university-of-cologne",
    name: "University of Cologne",
    destination: "germany",
    city: "Cologne",
    route: "Public universities",
    type: "public",
    flagCode: "de",
    initials: "UOC",
    summary:
      "One of Germany's largest universities, in North Rhine-Westphalia, which has not applied a non-EU tuition fee, so there is no tuition fee here. The programme below is in the business faculty, not computer science.",
    commission: PUBLIC_ZERO,
    highlights: {
      established: stated(1388, `${ON_RECORD}, as the original founding; the modern university was re-established in 1919`, RESEARCHED_ON),
      totalStudents: stated(45000, "Institution's own reporting, found through search; the institution's own statistics page was not directly read", RESEARCHED_ON),
      internationalStudents: stated(
        "About 10,000 international students",
        "Institution's own reporting, found through search; the institution's own statistics page was not directly read",
        RESEARCHED_ON,
      ),
      staffRatio: unknown(
        "Not published in a form that compares fairly with the other universities in this catalogue.",
      ),
      acceptanceRate: unknown(
        "German universities generally do not publish acceptance rates. Restricted programmes admit on published points or credits instead.",
      ),
      accreditation: stated(
        "State university of North Rhine-Westphalia, programmes accredited under the German accreditation system",
        ON_RECORD,
        RESEARCHED_ON,
      ),
    },
    rankings: [
      {
        body: "QS World University Rankings",
        year: 2026,
        rank: "272nd in the world, 17th in Germany",
        scope: "World, all subjects",
        source: "Institution's own rankings page, fetched directly this pass",
      },
    ],
    exams: [
      {
        exam: "IELTS Academic",
        undergraduate: unknown("Checked for the postgraduate route only this pass."),
        postgraduate: stated(
          "5.5 overall (B2 CEFR level)",
          "The programme's DAAD listing, not read off the institution's own page this pass",
          RESEARCHED_ON,
          "Lower than most of this catalogue, because the programme asks only for B2. At this level, expect the coursework to be harder than the entry bar suggests.",
        ),
      },
    ],
    tuitionNote: stated(
      "No tuition fee for a public university in North Rhine-Westphalia, a state that has not applied a non-EU fee. Only the semester contribution applies, reported at roughly EUR 305 to 320 a semester including a regional transport ticket.",
      "Reported consistently across independent sources; the institution's own fee page was not directly read this pass",
      RESEARCHED_ON,
    ),
    costOfLivingCity: null,
    programmes: [
      {
        slug: "cologne-msc-information-systems",
        universitySlug: "university-of-cologne",
        name: "MSc Information Systems",
        level: "masters",
        disciplines: ["Computer Science", "Business"],
        durationMonths: 24,
        feePerYear: stated(0, "No tuition fee is charged; only the semester contribution applies", RESEARCHED_ON),
        currency: "EUR",
        feeQualifier:
          "No tuition fee. The semester contribution (roughly EUR 305 to 320, reported by independent sources, not confirmed on the university's own page) is separate and not counted as tuition.",
        intakes: [
          {
            name: "Winter semester",
            applicationDeadline: "2027-06-15",
            teachingStarts: "2027-10-01",
            status: "not-yet-open",
            statusAsOf: RESEARCHED_ON,
            campus: "Cologne",
          },
        ],
        entryRequirement: stated(
          "A Bachelor's degree with at least 20 ECTS in information systems, 30 ECTS in business administration or economics, and 30 ECTS in statistics, mathematics or informatics.",
          "The programme's DAAD listing, not read off the institution's own page this pass",
          RESEARCHED_ON,
        ),
        prerequisites: stated(
          ["Information systems (20 ECTS)", "Business administration or economics (30 ECTS)", "Statistics, mathematics or informatics (30 ECTS)"],
          "The programme's DAAD listing, not read off the institution's own page this pass",
          RESEARCHED_ON,
        ),
        languageOfInstruction: "English",
        placement: unknown("No placement term is stated on this programme."),
        campus: "Cologne",
      },
    ],
    notChecked: [
      "The DAAD listing says most, not all, courses are in English, with German also used. We have not confirmed on the university's own page whether you can finish the degree in English only.",
      "Every programme figure above comes from the DAAD listing, not the university's own programme page. Check the winter application window (15 April to 15 June) on uni-koeln.de before relying on it.",
      "Cost of living: Cologne is not yet in our cost of living calculator, so no city figure is linked here.",
    ],
  },
];
