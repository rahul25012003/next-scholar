import { stated, unknown, type University } from "./types";

const ON = "2026-09-03";

/**
 * Germany.
 *
 * Two of the six institutions below charge non-EU students tuition at a public
 * university, which is the thing "study in Germany for free" gets wrong and the
 * thing our own site got wrong until this week. KIT and Stuttgart sit in
 * Baden-Wurttemberg and charge EUR 1,500 a semester. TUM introduced fees for
 * non-EU students from the 2024/25 winter semester under Bavaria's own law.
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
];
