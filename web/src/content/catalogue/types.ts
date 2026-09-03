import type { CommissionSource, VerificationStatus } from "@/content/types";

/**
 * The catalogue.
 *
 * The single largest capability gap on this platform, and the one where the
 * temptation to fabricate is strongest: a course listing looks broken with
 * empty cells, and filling them with plausible numbers takes a minute.
 *
 * So the type system refuses. `Field<T>` has exactly two shapes: a value with
 * the source it came from and the date it was written down, or an absence with
 * a stated reason. There is no third shape, which means a field cannot be added
 * to this catalogue without someone deciding which of those two it is, and a
 * bare "N/A" cannot be rendered because it cannot be represented.
 *
 * The other rule is the one both benchmarks omit: every listing carries what we
 * earn from that institution. A catalogue silently scoped to the universities
 * that pay us is the exact thing this business exists to correct, so the
 * commission block is required on a university rather than optional.
 */

export type Field<T> =
  | {
      state: "stated";
      value: T;
      /** The body that publishes this. Never "our research". */
      source: string;
      /** The date the value was written into this repository. */
      statedOn: string;
      /** Set where the value needs reading with a caveat. */
      qualifier?: string;
    }
  | {
      state: "unknown";
      /**
       * Why this is missing, in the reader's terms. "Not available" is not an
       * acceptable value: either the institution does not publish it, or nobody
       * has checked, and those are different facts.
       */
      reason: string;
    };

export const stated = <T,>(
  value: T,
  source: string,
  statedOn = "2026-09-03",
  qualifier?: string,
): Field<T> => ({ state: "stated", value, source, statedOn, qualifier });

export const unknown = <T,>(reason: string): Field<T> => ({ state: "unknown", reason });

/** Rankings name their body and their year, or they are not published here. */
export type Ranking = {
  body: string;
  year: number;
  rank: string;
  /** What the rank is within: world, the country, or a subject. */
  scope: string;
  source: string;
};

export type Intake = {
  name: string;
  /** A date, because a month name is not a deadline. */
  applicationDeadline: string;
  teachingStarts: string;
  status: "open" | "closing-soon" | "closed" | "not-yet-open";
  statusAsOf: string;
  campus?: string;
};

export type ExamRequirement = {
  exam: string;
  /**
   * Split by level, because they differ and a single figure hides that.
   * "Not required" is an explicit value, distinct from an unknown.
   */
  undergraduate: Field<string>;
  postgraduate: Field<string>;
};

export type Programme = {
  slug: string;
  universitySlug: string;
  name: string;
  level: "bachelors" | "masters";
  /** Field of study, for the subject taxonomy and the filters. */
  disciplines: string[];
  durationMonths: number;
  /** Tuition for one year, in the destination currency. */
  feePerYear: Field<number>;
  currency: "GBP" | "EUR";
  /** Read with the fee, always. */
  feeQualifier: string;
  intakes: Intake[];
  entryRequirement: Field<string>;
  /** What the programme lists as prerequisite knowledge, where it states any. */
  prerequisites: Field<string[]>;
  languageOfInstruction: string;
  /** Whether the course page states a work placement or internship term. */
  placement: Field<string>;
  campus: string;
};

export type University = {
  slug: string;
  name: string;
  /** The destination guide this institution sits under. */
  destination: string;
  city: string;
  /** Which of the destination's routes this institution belongs to. */
  route: string;
  type: "public" | "private";
  flagCode: string;
  /** Two or three letters, used as the mark. No logo files are hotlinked. */
  initials: string;
  summary: string;
  /**
   * What we earn if a student we advise enrols here. Required, not optional.
   */
  commission: {
    display: string;
    lowInr: number;
    highInr: number;
    status: VerificationStatus;
    source: CommissionSource;
    aboveAverage?: boolean;
    note: string;
  };
  highlights: {
    established: Field<number>;
    totalStudents: Field<number>;
    internationalStudents: Field<string>;
    staffRatio: Field<string>;
    acceptanceRate: Field<string>;
    accreditation: Field<string>;
  };
  rankings: Ranking[];
  exams: ExamRequirement[];
  /** The tuition position, which on two German routes is the whole story. */
  tuitionNote: Field<string>;
  /** The city's cost of living, linked to the guide rather than restated. */
  costOfLivingCity: string | null;
  programmes: Programme[];
  /** What we have not checked about this institution, stated plainly. */
  notChecked: string[];
};

export type SortOption = {
  key: string;
  /** States what it orders by. There is deliberately no "popularity". */
  label: string;
  note: string;
};

/**
 * Every sort option says what it orders by.
 *
 * Both benchmarks offer a "popularity" sort that is never defined anywhere. A
 * sort whose ordering nobody can describe is a ranking presented as a
 * convenience, and on a catalogue that also carries our commission it would be
 * the easiest place in the product to put a thumb on the scale.
 */
export const sortOptions: SortOption[] = [
  {
    key: "fee-asc",
    label: "Tuition, lowest first",
    note: "Orders by the published annual tuition. Courses with no published fee sort last, and say why.",
  },
  {
    key: "fee-desc",
    label: "Tuition, highest first",
    note: "The same figure, reversed. Courses with no published fee still sort last.",
  },
  {
    key: "commission-asc",
    label: "What we earn, lowest first",
    note: "Orders by the low end of our commission band. Institutions that pay us nothing come first.",
  },
  {
    key: "commission-desc",
    label: "What we earn, highest first",
    note: "The same band, reversed. It exists so you can see exactly what a commission-led shortlist would look like.",
  },
  {
    key: "deadline",
    label: "Next deadline, soonest first",
    note: "Orders by the earliest application deadline still ahead on our records.",
  },
  {
    key: "duration",
    label: "Duration, shortest first",
    note: "Orders by course length in months.",
  },
  {
    key: "name",
    label: "University name, A to Z",
    note: "Alphabetical by institution, then by course name.",
  },
];
