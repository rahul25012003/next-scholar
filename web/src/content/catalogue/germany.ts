import { stated, unknown, type University } from "./types";

const ON = "2026-09-03";
/** When the entries below Stuttgart, added later, were actually looked up. */
const RESEARCHED_ON = "2026-09-10";

/**
 * Germany.
 *
 * Five of the sixteen institutions below charge non-EU students tuition at a public
 * university, which is the thing "study in Germany for free" gets wrong and the
 * thing our own site got wrong until this week. KIT, Stuttgart, Heidelberg and Freiburg
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
      "Germany's highest-ranked technical university, and the one that most complicates the free-tuition story: Bavaria legislated to allow tuition for non-EU students and TUM introduced it from the 2024/25 winter semester.",
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
        "TUM does not publish a staff to student ratio in a form comparable with UK institutions, and constructing one from separate headcounts would be our arithmetic rather than their figure.",
      ),
      acceptanceRate: unknown(
        "German universities generally do not publish acceptance rates. Admission to a restricted programme is decided on a published points or credit basis rather than a rate, so there is no number to quote.",
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
      "TUM introduced tuition fees for non-EU students from the 2024/25 winter semester, under the Bavarian law permitting it. The amount is set per programme and is charged on top of the semester contribution. This is the single clearest counterexample to the idea that a German public university is free for an Indian student, and it needs checking on the specific programme's fee page before any budget is built.",
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
          "TUM sets the non-EU fee per programme and we have not read this programme's own fee page since the change took effect. Publishing a plausible figure here would be exactly the kind of guess this catalogue exists to refuse.",
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
          "A Bachelor's in mechanical engineering or a closely related subject, assessed on subject credits rather than on the degree title. TUM runs its own aptitude assessment for this programme.",
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
          "As above: the per-programme non-EU fee has not been read at source since Bavaria's change took effect.",
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
      "The current per-programme tuition figure for non-EU students, which is the most important number on this page and the one we will not guess.",
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
      "One of Germany's strongest engineering institutions, and in Baden-Wurttemberg, which charges non-EU students EUR 1,500 per semester. That is EUR 6,000 across a four semester Master's, and it is the exception our own site published incorrectly until this week.",
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
        "Not published in a form comparable with the other institutions on this catalogue, so printing it next to them would invite a comparison the figures do not support.",
      ),
      acceptanceRate: unknown(
        "Not published. Admission to a restricted programme is decided on published criteria rather than a rate.",
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
      "EUR 1,500 per semester for non-EU students, under the Baden-Wurttemberg state law in force since the 2017/18 winter semester. A second degree is charged at EUR 650 per semester instead. The semester contribution is charged on top of it.",
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
          "The statutory state fee for non-EU students, EUR 1,500 per semester. Not a programme-specific price, and the semester contribution is on top.",
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
          "A Bachelor's in mechanical engineering, assessed on the credit distribution rather than the title. The German-taught track requires a German certificate.",
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
          "The same statutory state fee. It applies to the institution, not to the programme.",
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
          "The programme states a credit distribution across two subject areas rather than a list of named modules.",
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
      "The largest technical university in Germany, in North Rhine-Westphalia, which charges no tuition. For an Indian engineering applicant this is close to the archetype of what the German public route is supposed to be.",
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
        "Not published in a form comparable with the other institutions on this catalogue, so printing it next to them would invite a comparison the figures do not support.",
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
      "No tuition fee. Students pay a semester contribution of roughly EUR 330, which includes a public transport ticket covering the region, and the ticket is generally worth more than the contribution.",
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
      "Strong in automotive and aerospace engineering, and in Baden-Wurttemberg, so the EUR 1,500 per semester non-EU fee applies here too. Its automotive links are the reason it appears on so many Indian engineering shortlists.",
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
        "Not published in a form comparable with the other institutions on this catalogue, so printing it next to them would invite a comparison the figures do not support.",
      ),
      acceptanceRate: unknown(
        "The institution does not publish this figure, and constructing one from separate headcounts would be our arithmetic rather than their number.",
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
      "No tuition, in a city where rooms are cheaper than Munich and harder to find. The scarcity is the planning problem here rather than the price.",
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
        "Not published in a form comparable with the other institutions on this catalogue, so printing it next to them would invite a comparison the figures do not support.",
      ),
      acceptanceRate: unknown(
        "The institution does not publish this figure, and constructing one from separate headcounts would be our arithmetic rather than their number.",
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
      "A private university with English-taught programmes, rolling admissions and a substantially lighter document burden than the public route. It also pays agents, and our band on it runs above the category average, which is exactly why that flag is on this page rather than in a footnote.",
    commission: {
      display: "₹1.3L to ₹3.5L",
      lowInr: 130000,
      highInr: 350000,
      status: "unverified",
      source: "market-estimate",
      aboveAverage: true,
      note: "A market typical estimate, not a contract term, and it runs above the average band for this category. That does not rule the institution out of a shortlist. It does mean that if we recommend it, the reason will be a specific programme fit stated in writing, and you will see this flag before the recommendation rather than after it.",
    },
    highlights: {
      established: stated(1998, "Institution's own history page", ON),
      totalStudents: unknown(
        "The institution publishes a large combined figure spanning campus and distance learning that is not comparable with a campus headcount, so quoting it next to the public universities above would mislead.",
      ),
      internationalStudents: unknown(
        "Not published in a form comparable with the other institutions on this catalogue, so printing it next to them would invite a comparison the figures do not support.",
      ),
      staffRatio: unknown(
        "The institution does not publish this figure, and constructing one from separate headcounts would be our arithmetic rather than their number.",
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
      "Full tuition, charged monthly on most programmes. The published monthly figure is easy to compare favourably with a lump sum and harder to compare with the public route, where the tuition is zero, so the comparison worth making is the total across the whole degree.",
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
          "The institution prices this monthly and the total depends on the study model chosen, so a single annual figure would be our arithmetic on an assumption rather than their published price. Ask for the total across the degree in writing before comparing it with anything.",
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
      "Whether the commission band above holds for this institution specifically. It is a category estimate and it has not been confirmed with anyone.",
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
      "Bavaria's other major public university, and unlike its Munich neighbour TUM, LMU has not applied Bavaria's non-EU tuition law: tuition stays a genuine zero here, only the small semester contribution applies.",
    commission: PUBLIC_ZERO,
    highlights: {
      established: stated(1472, "Institution's own history page", RESEARCHED_ON),
      totalStudents: stated(52658, "Institution's own reporting for the 2025/26 winter semester, found through search", RESEARCHED_ON),
      internationalStudents: stated(
        "Around 11,700 students, about 22 per cent of the student body",
        "Institution's own reporting, found through search",
        RESEARCHED_ON,
      ),
      staffRatio: unknown(
        "Not published in a form comparable with UK institutions, and constructing one from separate headcounts would be our arithmetic rather than their figure.",
      ),
      acceptanceRate: unknown(
        "German universities generally do not publish acceptance rates. Admission to a restricted programme is decided on a published points or credit basis rather than a rate.",
      ),
      accreditation: stated(
        "State university of the Free State of Bavaria, programmes accredited under the German accreditation system",
        "Institution's own accreditation page",
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
          "A Bachelor's degree with substantial quantitative content, commonly stated as a strong upper second or first class equivalent for competitive English-medium programmes.",
          "Reported consistently across independent sources; the programme's own admission page was not directly read this pass",
          RESEARCHED_ON,
        ),
        prerequisites: unknown("Not checked this pass."),
        languageOfInstruction: "English",
        placement: unknown("No placement term is stated on this programme."),
        campus: "Munich",
      },
    ],
    notChecked: [
      "Whether this specific programme is restricted (NC) and what the admission threshold actually is this cycle.",
      "The exact QS rank: reported as 58th by independent sources, printed here as a band since the institution's own page was not read directly.",
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
      "Germany's oldest university, and a Baden-Wurttemberg institution: the state's own EUR 1,500 a semester non-EU tuition fee applies here, the same as KIT and Stuttgart in this catalogue.",
    commission: PUBLIC_ZERO,
    highlights: {
      established: stated(1386, "Institution's own history page", RESEARCHED_ON),
      totalStudents: stated(30000, "Institution's own reporting, found through search", RESEARCHED_ON),
      internationalStudents: stated(
        "Around 6,600 students, from more than 130 countries",
        "Institution's own reporting, found through search",
        RESEARCHED_ON,
      ),
      staffRatio: unknown(
        "Not published in a form comparable with UK institutions, and constructing one from separate headcounts would be our arithmetic rather than their figure.",
      ),
      acceptanceRate: unknown(
        "German universities generally do not publish acceptance rates. Admission to a restricted programme is decided on a published points or credit basis rather than a rate.",
      ),
      accreditation: stated(
        "State university of Baden-Wurttemberg, programmes accredited under the German accreditation system",
        "Institution's own accreditation page",
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
      "EUR 1,500 per semester (about EUR 3,000 a year) for a non-EU or non-EEA student, under Baden-Wurttemberg's own law, a state-wide policy rather than a Heidelberg-specific one. Confirmed directly on the institution's own tuition fee page this pass.",
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
          "EUR 1,500 a semester under Baden-Wurttemberg's non-EU tuition law, confirmed on the institution's own page. The separate semester contribution (roughly EUR 150 to 200) is not included in this figure.",
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
        prerequisites: unknown("Not checked this pass."),
        languageOfInstruction: "English",
        placement: unknown("No placement term is stated on this programme."),
        campus: "Heidelberg",
      },
    ],
    notChecked: [
      "Whether this specific programme is restricted (NC) and what the admission threshold actually is this cycle.",
      "The exact QS rank: reported as 80th by independent sources, printed here as a band since the institution's own page was not read directly.",
      "Cost of living: Heidelberg is not yet one of the cities modelled in the cost of living calculator, so no linked city figure is shown here.",
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
      "One of Berlin's major public universities, a genuine tuition zero since Berlin has not applied a non-EU fee. Most of its own Computer Science Master's is taught in German; the English-medium route this catalogue lists is Data Science, a small, selective programme.",
    commission: PUBLIC_ZERO,
    highlights: {
      established: stated(1948, "Institution's own history page", RESEARCHED_ON),
      totalStudents: stated(33900, "Institution's own reporting, found through search", RESEARCHED_ON),
      internationalStudents: stated(
        "About 4,950 international students, from around 80 countries",
        "Institution's own reporting, found through search",
        RESEARCHED_ON,
      ),
      staffRatio: unknown(
        "Not published in a form comparable with UK institutions, and constructing one from separate headcounts would be our arithmetic rather than their figure.",
      ),
      acceptanceRate: unknown(
        "German universities generally do not publish acceptance rates. Admission to a restricted programme is decided on a published points or credit basis rather than a rate.",
      ),
      accreditation: stated(
        "State university of Berlin, programmes accredited under the German accreditation system",
        "Institution's own accreditation page",
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
          "This catalogue's other entries state an IELTS figure; this one states what this specific programme's own page actually asks for, rather than converting it into an IELTS-equivalent this session did not confirm.",
        ),
      },
    ],
    tuitionNote: stated(
      "No tuition fee. Only the semester contribution applies, reported at roughly EUR 358 a semester for the Computer Science route; not confirmed specifically for Data Science this pass.",
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
          "No tuition fee. The semester contribution (roughly EUR 358, reported for a related programme rather than confirmed for this one) is separate and not shown here as tuition.",
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
          "Highly selective: hundreds of applications for around 30 to 40 seats. A Bachelor's degree with substantial quantitative content is the general requirement; the specific published threshold was not read this pass.",
          "Reported consistently across independent sources; the programme's own admissions page was not directly read this pass",
          RESEARCHED_ON,
        ),
        prerequisites: unknown("Not checked this pass."),
        languageOfInstruction: "English",
        placement: unknown("No placement term is stated on this programme."),
        campus: "Berlin",
      },
    ],
    notChecked: [
      "Whether this specific programme is restricted (NC) and what the admission threshold actually is this cycle.",
      "The exact semester contribution for this programme specifically; the figure shown is reported for a related programme.",
      "The programme's own stated degree class or discipline requirement, beyond the general selectivity described in independent sources.",
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
      "Hamburg's largest university, in a state that has not applied a non-EU tuition fee, so tuition stays a genuine zero here.",
    commission: PUBLIC_ZERO,
    highlights: {
      established: stated(1919, "Institution's own history page", RESEARCHED_ON),
      totalStudents: stated(43000, "Institution's own reporting, found through search", RESEARCHED_ON),
      internationalStudents: stated(
        "Nearly 6,000 international students, from more than 130 countries",
        "Institution's own reporting, found through search",
        RESEARCHED_ON,
      ),
      staffRatio: unknown(
        "Not published in a form comparable with UK institutions, and constructing one from separate headcounts would be our arithmetic rather than their figure.",
      ),
      acceptanceRate: unknown(
        "German universities generally do not publish acceptance rates. Admission to a restricted programme is decided on a published points or credit basis rather than a rate.",
      ),
      accreditation: stated(
        "State university of Hamburg, programmes accredited under the German accreditation system",
        "Institution's own accreditation page",
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
          "This session's search results mixed Universität Hamburg with Hamburg University of Technology (TUHH), a separate institution, and could not cleanly separate the English-taught Data Science figures found. Left unknown rather than reported with the wrong institution attached.",
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
          "No tuition fee. The semester contribution (reported in the low hundreds of euros, not confirmed to the exact figure for this programme) is separate and not shown here as tuition.",
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
          "This session's search results conflated Universität Hamburg with the separate Hamburg University of Technology and could not cleanly confirm this programme's own entry requirement. Left unknown rather than attributed to the wrong institution.",
        ),
        prerequisites: unknown("Not checked this pass, for the same reason as the entry requirement."),
        languageOfInstruction: "English",
        placement: unknown("No placement term is stated on this programme."),
        campus: "Hamburg",
      },
    ],
    notChecked: [
      "This session's research repeatedly surfaced results for Hamburg University of Technology (TUHH), a separate institution, when searching for Universität Hamburg. Facts that could not be confidently attributed to the correct institution are marked unknown above rather than guessed. A future pass should verify this programme directly on uni-hamburg.de.",
      "Cost of living: Hamburg is not yet one of the cities modelled in the cost of living calculator, so no linked city figure is shown here.",
      "The exact QS rank and semester contribution figure.",
    ],
  },

  {
    slug: "tu-dresden",
    name: "Technische Universitat Dresden",
    destination: "germany",
    city: "Dresden",
    route: "Public universities",
    type: "public",
    flagCode: "de",
    initials: "TUD",
    summary:
      "A Saxon technical university with a strong engineering research base, in a state that has not applied a non-EU tuition fee, so tuition stays a genuine zero here.",
    commission: PUBLIC_ZERO,
    highlights: {
      established: stated(1828, "Institution's own history page", RESEARCHED_ON),
      totalStudents: unknown(
        "Independent sources disagreed within this session's search results, reporting figures between about 20,600 and 36,000; the institution's own statistics page was not directly read to resolve which is current.",
      ),
      internationalStudents: stated(
        "Reported at about 15 per cent of the student body by one independent source this pass",
        "Independent source (THE World University Rankings data); the institution's own statistics page was not directly read",
        RESEARCHED_ON,
      ),
      staffRatio: unknown(
        "Not published in a form comparable with the other institutions on this catalogue, so printing it next to them would invite a comparison the figures do not support.",
      ),
      acceptanceRate: unknown(
        "German universities generally do not publish acceptance rates. This programme uses an aptitude assessment rather than a simple points threshold.",
      ),
      accreditation: stated(
        "State university of Saxony, programmes accredited under the German accreditation system",
        "Institution's own accreditation page",
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
          "No tuition fee. The semester contribution, stated by the institution at EUR 361 for winter 2026/27, is separate and not shown here as tuition.",
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
          "A first professionally qualifying university degree in Computer Science, with at least 90 ECTS credits distributed across systems and architecture (35+), mathematics and theoretical computer science (35+), and programming fundamentals (20+).",
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
      "The institution runs an aptitude assessment before enrolment, separate from the general application window; the exact procedure and its own timeline were not read this pass.",
      "Total student count: independent sources disagreed by a wide margin and the institution's own statistics page was not directly read to resolve it this pass.",
      "Cost of living: Dresden is not yet one of the cities modelled in the cost of living calculator, so no linked city figure is shown here.",
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
      "A former West German capital with a strong research profile in mathematics and the sciences, in a state that has not applied a non-EU tuition fee, so tuition stays a genuine zero here.",
    commission: PUBLIC_ZERO,
    highlights: {
      established: stated(1818, "Institution's own history page", RESEARCHED_ON),
      totalStudents: unknown(
        "Reported by one independent source at about 24,500 this pass; the institution's own statistics page was not directly read to confirm it.",
      ),
      internationalStudents: stated(
        "Reported at about 16 per cent of the student body by one independent source this pass",
        "Independent source (THE World University Rankings data); the institution's own statistics page was not directly read",
        RESEARCHED_ON,
      ),
      staffRatio: unknown(
        "Not published in a form comparable with the other institutions on this catalogue, so printing it next to them would invite a comparison the figures do not support.",
      ),
      acceptanceRate: unknown(
        "German universities generally do not publish acceptance rates. Admission to a restricted programme is decided on a published points or credit basis rather than a rate.",
      ),
      accreditation: stated(
        "State university of North Rhine-Westphalia, programmes accredited under the German accreditation system",
        "Institution's own accreditation page",
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
      "No tuition fee for a public university in North Rhine-Westphalia, a state that has not applied a non-EU fee. Only the semester contribution applies, reported at roughly EUR 345 to 350 by independent sources; not confirmed on the institution's own page this pass.",
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
          "No tuition fee. The semester contribution, reported at roughly EUR 345 to 350 by independent sources and not confirmed on the institution's own page this pass, is separate and not shown here as tuition.",
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
          "A Bachelor's degree in computer science or a related field, with at least 18 ECTS in mathematics, 14 ECTS in algorithm and complexity theory, and 18 ECTS in programming, software technology and information systems, plus a scientific thesis worth at least 12 ECTS.",
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
      "The exact application deadline for this applicant category: the institution's own page directs applicants to a separate deadlines page that was not read this pass.",
      "Total student count and the exact semester contribution: reported by independent sources only, not confirmed on the institution's own page this pass.",
      "Cost of living: Bonn is not yet one of the cities modelled in the cost of living calculator, so no linked city figure is shown here.",
    ],
  },

  {
    slug: "tu-darmstadt",
    name: "Technische Universitat Darmstadt",
    destination: "germany",
    city: "Darmstadt",
    route: "Public universities",
    type: "public",
    flagCode: "de",
    initials: "TUDA",
    summary:
      "A technical university half an hour from Frankfurt, in Hesse, a state that has not applied a non-EU tuition fee, so tuition stays a genuine zero here. Its AI and machine learning masters can be completed entirely in English by course choice.",
    commission: PUBLIC_ZERO,
    highlights: {
      established: stated(1877, "Institution's own history page", RESEARCHED_ON),
      totalStudents: unknown(
        "Reported by one independent source at over 25,000 this pass; the institution's own page read this pass did not state its own headcount, so the figure is not confirmed.",
      ),
      internationalStudents: stated(
        "Reported at about 19 per cent of the student body; the institution's own page states only that its international share ranks in the top five among German universities",
        "Percentage from an independent source this pass; the top-five claim from the institution's own study page, fetched directly this pass",
        RESEARCHED_ON,
      ),
      staffRatio: unknown(
        "Not published in a form comparable with the other institutions on this catalogue, so printing it next to them would invite a comparison the figures do not support.",
      ),
      acceptanceRate: unknown(
        "German universities generally do not publish acceptance rates. Admission to this programme is decided on a published credit basis against a reference bachelor's degree rather than a rate.",
      ),
      accreditation: stated(
        "State university of Hesse, programmes accredited under the German accreditation system",
        "Institution's own accreditation page",
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
          "The institution's own page states the requirement as CEFR C1; the IELTS figure printed here is the equivalence independent sources report for it.",
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
          "No tuition fee. The semester contribution, reported at roughly EUR 300 to 400 by independent sources and not confirmed on the institution's own page this pass, is separate and not shown here as tuition.",
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
          "A Bachelor's degree equivalent to TU Darmstadt's own BSc Informatik, with at least 60 ECTS credits in core computer science not significantly different from that reference programme.",
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
      "Both English and German-taught modules exist on this programme; the institution's own page states it can be completed entirely in English by choosing only English-taught modules, and this session did not check whether every specialisation allows that.",
      "The winter-semester application window (1 June to 15 July) is reported by independent sources; the institution's own page references deadlines without listing the dates.",
      "Total student count and the exact QS rank: reported by independent sources only, not confirmed on the institution's own page this pass.",
      "Cost of living: Darmstadt is not yet one of the cities modelled in the cost of living calculator, so no linked city figure is shown here.",
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
      "One of Germany's oldest universities, in the Black Forest corner of Baden-Wurttemberg, which means the same EUR 1,500 a semester non-EU fee that KIT, Stuttgart and Heidelberg charge, and that most of Germany does not.",
    commission: PUBLIC_ZERO,
    highlights: {
      established: stated(1457, "Institution's own history page", RESEARCHED_ON),
      totalStudents: stated(24391, "Reported by an independent source this pass; the institution's own statistics page was not directly read", RESEARCHED_ON),
      internationalStudents: stated(
        "About 18 per cent of the student body, from over 120 countries",
        "Reported by independent sources this pass; the institution's own statistics page was not directly read",
        RESEARCHED_ON,
      ),
      staffRatio: unknown(
        "Not published in a form comparable with the other institutions on this catalogue, so printing it next to them would invite a comparison the figures do not support.",
      ),
      acceptanceRate: unknown(
        "German universities generally do not publish acceptance rates. Admission to a restricted programme is decided on a published points or credit basis rather than a rate.",
      ),
      accreditation: stated(
        "State university of Baden-Wurttemberg, programmes accredited under the German accreditation system",
        "Institution's own accreditation page",
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
        prerequisites: unknown("Not checked this pass."),
        languageOfInstruction: "English",
        placement: unknown("No placement term is stated on this programme."),
        campus: "Freiburg",
      },
    ],
    notChecked: [
      "The institution's own fee and programme pages both returned errors to this session's fetch; every figure above is convergent-secondary and should be read off uni-freiburg.de on a future pass.",
      "One independent source reports a GRE requirement for this programme; it is unusual for a German public university and was not confirmed, so it is neither printed nor ruled out.",
      "The exact semester contribution and the Artificial Intelligence specialisation's own admission criteria.",
      "Cost of living: Freiburg is not yet one of the cities modelled in the cost of living calculator, so no linked city figure is shown here.",
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
      "A small university town in Lower Saxony with a long scientific reputation and rents below the big cities, in a state that has not applied a non-EU tuition fee, so tuition stays a genuine zero here.",
    commission: PUBLIC_ZERO,
    highlights: {
      established: stated(1737, "Institution's own history page", RESEARCHED_ON),
      totalStudents: unknown(
        "Independent sources disagreed within this session's search results, reporting figures between about 19,800 and 26,000; the institution's own statistics page was not directly read to resolve which is current.",
      ),
      internationalStudents: stated(
        "Reported between about 11 and 14 per cent of the student body by different independent sources this pass",
        "Independent sources disagreed within this session's search results; the institution's own statistics page was not directly read to resolve it",
        RESEARCHED_ON,
      ),
      staffRatio: unknown(
        "Not published in a form comparable with the other institutions on this catalogue, so printing it next to them would invite a comparison the figures do not support.",
      ),
      acceptanceRate: unknown(
        "German universities generally do not publish acceptance rates. Admission to a restricted programme is decided on a published points or credit basis rather than a rate.",
      ),
      accreditation: stated(
        "State university of Lower Saxony, programmes accredited under the German accreditation system",
        "Institution's own accreditation page",
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
          "The institution's own page also accepts CEFR B2 English paired with German at DSH level 2, a route not relevant to most applicants from India.",
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
          "No tuition fee. The semester contribution, reported at roughly EUR 460 by independent sources and not confirmed on the institution's own page this pass, is separate and not shown here as tuition.",
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
          "A Bachelor's degree of at least 180 ECTS, with at least 60 ECTS in data science, computer science, statistics, mathematics or a related field; up to 15 of those credits may be completed after admission.",
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
      "The institution's own page describes the programme as taught mainly in English, with some electives in German; which electives was not checked this pass.",
      "Total student count and the exact QS rank: independent sources disagreed on the first and the institution's own pages were not read for either.",
      "Cost of living: Gottingen is not yet one of the cities modelled in the cost of living calculator, so no linked city figure is shown here.",
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
      "One of Germany's largest universities, in North Rhine-Westphalia, a state that has not applied a non-EU tuition fee, so tuition stays a genuine zero here. The programme below sits in the business faculty, not the computer science one.",
    commission: PUBLIC_ZERO,
    highlights: {
      established: stated(1388, "Institution's own history page, as the original founding; the modern university was re-established in 1919", RESEARCHED_ON),
      totalStudents: stated(45000, "Institution's own reporting, found through search; the institution's own statistics page was not directly read", RESEARCHED_ON),
      internationalStudents: stated(
        "About 10,000 international students",
        "Institution's own reporting, found through search; the institution's own statistics page was not directly read",
        RESEARCHED_ON,
      ),
      staffRatio: unknown(
        "Not published in a form comparable with the other institutions on this catalogue, so printing it next to them would invite a comparison the figures do not support.",
      ),
      acceptanceRate: unknown(
        "German universities generally do not publish acceptance rates. Admission to a restricted programme is decided on a published points or credit basis rather than a rate.",
      ),
      accreditation: stated(
        "State university of North Rhine-Westphalia, programmes accredited under the German accreditation system",
        "Institution's own accreditation page",
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
          "Lower than most of this catalogue because the programme requires only B2; a student at this level should expect the coursework to be harder than the entry bar suggests.",
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
          "No tuition fee. The semester contribution, reported at roughly EUR 305 to 320 by independent sources and not confirmed on the institution's own page this pass, is separate and not shown here as tuition.",
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
      "The programme's DAAD listing states that most, not all, courses are offered in English, with German also used; whether the degree can be completed entirely in English was not confirmed on the institution's own page this pass.",
      "Every programme-level figure above comes from the DAAD listing rather than the institution's own programme page; the winter application window (15 April to 15 June) in particular should be read off uni-koeln.de before relying on it.",
      "Cost of living: Cologne is not yet one of the cities modelled in the cost of living calculator, so no linked city figure is shown here.",
    ],
  },
];
