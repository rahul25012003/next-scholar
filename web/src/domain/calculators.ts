/**
 * The ungated calculators.
 *
 * Three rules hold across every function in this file.
 *
 * 1. Each one returns its own working. A number a student cannot check is a
 *    number they have to trust, and the whole point of publishing these is that
 *    they do not have to trust us.
 * 2. Each one names its source and its limits. Every conversion here is a
 *    convention rather than a law, and the institution decides, not us.
 * 3. None of them is a prediction. There is no admission chance, no probability
 *    and no score of a student's prospects anywhere in this module, and the
 *    guardrail tests assert that there is not.
 */

export type Working = {
  /** The formula as written in the source, before any of the numbers land. */
  formula: string;
  /** The same formula with the student's own numbers substituted in. */
  substituted: string;
  /** The intermediate steps, each one checkable by hand. */
  steps: string[];
  result: string;
};

export type Conversion = {
  value: number;
  display: string;
  working: Working;
  /** Named body or convention. Never "industry standard". */
  source: string;
  /** What this conversion does not decide. */
  limits: string[];
  /** Set when an input was outside its valid range and was clamped. */
  clamped?: string;
};

const round = (value: number, places = 2): number => {
  const factor = 10 ** places;
  return Math.round(value * factor) / factor;
};

/* ------------------------------------------------------------------ *
 * German grade conversion
 * ------------------------------------------------------------------ */

export type GermanBand = {
  key: "sehr-gut" | "gut" | "befriedigend" | "ausreichend";
  german: string;
  english: string;
  range: string;
};

/** The four passing bands on the German 1.0 to 4.0 scale, best first. */
export const germanBands: GermanBand[] = [
  { key: "sehr-gut", german: "Sehr gut", english: "Very good", range: "1.0 to 1.5" },
  { key: "gut", german: "Gut", english: "Good", range: "1.6 to 2.5" },
  { key: "befriedigend", german: "Befriedigend", english: "Satisfactory", range: "2.6 to 3.5" },
  { key: "ausreichend", german: "Ausreichend", english: "Sufficient", range: "3.6 to 4.0" },
];

export function germanBandFor(grade: number): GermanBand {
  if (grade <= 1.5) return germanBands[0];
  if (grade <= 2.5) return germanBands[1];
  if (grade <= 3.5) return germanBands[2];
  return germanBands[3];
}

export const GERMAN_GRADE_LIMITS = [
  "The university's admissions office or uni-assist performs the official conversion, and its result is the one that counts.",
  "Some universities apply a different formula, or a subject-specific correction, or convert from your percentage rather than your CGPA.",
  "A converted grade is not an admission decision. German Master's admission is decided at least as much on subject credits as on the grade.",
];

/**
 * The Modified Bavarian Formula.
 *
 *   N = 1 + 3 x (Nmax - Nd) / (Nmax - Nmin)
 *
 * where Nmax is the best achievable mark, Nmin the minimum pass mark, and Nd
 * the mark achieved. It is the conversion most German institutions and
 * uni-assist start from, and it is arithmetic rather than judgement, which is
 * exactly why it is safe for us to publish and show the working of.
 */
export function modifiedBavarian(input: {
  obtained: number;
  max: number;
  passing: number;
}): Conversion | { error: string } {
  const { obtained, max, passing } = input;

  if (![obtained, max, passing].every((value) => Number.isFinite(value))) {
    return { error: "Enter your mark, the maximum mark and the pass mark." };
  }
  if (max <= passing) {
    return { error: "The maximum mark has to be above the pass mark." };
  }
  if (obtained > max) {
    return { error: `Your mark cannot be above the maximum of ${max}.` };
  }
  if (obtained < 0 || passing < 0) {
    return { error: "Marks cannot be negative." };
  }

  const raw = 1 + (3 * (max - obtained)) / (max - passing);
  const clampedValue = Math.min(4, Math.max(1, raw));
  const value = round(clampedValue, 1);

  const numerator = round(max - obtained, 2);
  const denominator = round(max - passing, 2);
  const quotient = round(numerator / denominator, 4);

  return {
    value,
    display: value.toFixed(1),
    working: {
      formula: "N = 1 + 3 × (Nmax − Nd) ÷ (Nmax − Nmin)",
      substituted: `N = 1 + 3 × (${max} − ${obtained}) ÷ (${max} − ${passing})`,
      steps: [
        `Nmax − Nd = ${max} − ${obtained} = ${numerator}`,
        `Nmax − Nmin = ${max} − ${passing} = ${denominator}`,
        `${numerator} ÷ ${denominator} = ${quotient}`,
        `3 × ${quotient} = ${round(3 * quotient, 4)}`,
        `1 + ${round(3 * quotient, 4)} = ${round(raw, 4)}`,
        `Rounded to one decimal place: ${value.toFixed(1)}`,
      ],
      result: `${value.toFixed(1)} — ${germanBandFor(value).german} (${germanBandFor(value).english})`,
    },
    source:
      "Modified Bavarian Formula, as used by uni-assist and most German universities for converting foreign grades",
    limits: GERMAN_GRADE_LIMITS,
    clamped:
      raw < 1
        ? "The formula produced a value below 1.0, which is off the German scale, so it is shown as 1.0."
        : raw > 4
          ? "The formula produced a value above 4.0, which is below the German pass mark, so it is shown as 4.0. Check that the pass mark you entered is the one your university actually uses."
          : undefined,
  };
}

/** The three scales students arrive with, with max and pass prefilled. */
export const gradeScalePresets = [
  {
    key: "cgpa-10",
    label: "CGPA, 10 point scale",
    note: "Most Indian universities, including VTU, Anna University and the autonomous Bengaluru colleges.",
    max: 10,
    passing: 4,
    step: 0.01,
  },
  {
    key: "percentage",
    label: "Percentage",
    note: "Where your transcript prints a percentage directly. The pass mark is usually 35 or 40.",
    max: 100,
    passing: 40,
    step: 0.01,
  },
  {
    key: "gpa-4",
    label: "GPA, 4 point scale",
    note: "Less common on Indian transcripts. Check whether your university's pass mark is 2.0 or 1.7.",
    max: 4,
    passing: 2,
    step: 0.01,
  },
] as const;

/* ------------------------------------------------------------------ *
 * Indian grade conversions
 * ------------------------------------------------------------------ */

export const CGPA_PERCENTAGE_LIMITS = [
  "Multiplying CGPA by 9.5 is a CBSE convention that many Indian universities adopted. It is not a national standard, and your own university's regulations govern.",
  "Some universities publish their own conversion factor or a conversion table. Where one exists, use it and not this.",
  "A foreign university will usually accept the figure on your official transcript or an official conversion certificate, not one you calculated.",
];

export function cgpaToPercentage(cgpa: number, factor = 9.5): Conversion | { error: string } {
  if (!Number.isFinite(cgpa)) return { error: "Enter your CGPA." };
  if (cgpa < 0 || cgpa > 10) return { error: "A 10 point CGPA sits between 0 and 10." };

  const value = round(cgpa * factor, 2);
  return {
    value,
    display: `${value}%`,
    working: {
      formula: "Percentage = CGPA × 9.5",
      substituted: `Percentage = ${cgpa} × ${factor}`,
      steps: [`${cgpa} × ${factor} = ${value}`],
      result: `${value}%`,
    },
    source: "CBSE conversion convention, adopted by many Indian universities",
    limits: CGPA_PERCENTAGE_LIMITS,
  };
}

export function percentageToCgpa(percentage: number, factor = 9.5): Conversion | { error: string } {
  if (!Number.isFinite(percentage)) return { error: "Enter your percentage." };
  if (percentage < 0 || percentage > 100) {
    return { error: "A percentage sits between 0 and 100." };
  }
  const value = round(percentage / factor, 2);
  return {
    value,
    display: value.toFixed(2),
    working: {
      formula: "CGPA = Percentage ÷ 9.5",
      substituted: `CGPA = ${percentage} ÷ ${factor}`,
      steps: [`${percentage} ÷ ${factor} = ${value}`],
      result: value.toFixed(2),
    },
    source: "CBSE conversion convention, applied in reverse",
    limits: CGPA_PERCENTAGE_LIMITS,
  };
}

export function cgpaToMarks(
  cgpa: number,
  totalMarks: number,
  factor = 9.5,
): Conversion | { error: string } {
  if (!Number.isFinite(cgpa) || !Number.isFinite(totalMarks)) {
    return { error: "Enter your CGPA and the total marks your course was out of." };
  }
  if (cgpa < 0 || cgpa > 10) return { error: "A 10 point CGPA sits between 0 and 10." };
  if (totalMarks <= 0) return { error: "Total marks have to be above zero." };

  const percentage = round(cgpa * factor, 2);
  const value = round((percentage * totalMarks) / 100, 1);
  return {
    value,
    display: `${value} of ${totalMarks}`,
    working: {
      formula: "Marks = (CGPA × 9.5) ÷ 100 × Total marks",
      substituted: `Marks = (${cgpa} × ${factor}) ÷ 100 × ${totalMarks}`,
      steps: [
        `${cgpa} × ${factor} = ${percentage} per cent`,
        `${percentage} ÷ 100 × ${totalMarks} = ${value}`,
      ],
      result: `${value} out of ${totalMarks}`,
    },
    source: "CBSE conversion convention, then a proportion of the stated total",
    limits: [
      ...CGPA_PERCENTAGE_LIMITS,
      "This assumes every subject carried equal weight. If your programme weighted them differently, the figure will be slightly out.",
    ],
  };
}

/** The three GPA scales a foreign application form is likely to ask for. */
export const gpaScales = [4, 5, 10] as const;
export type GpaScale = (typeof gpaScales)[number];

export function percentageToGpa(
  percentage: number,
  scale: GpaScale,
): Conversion | { error: string } {
  if (!Number.isFinite(percentage)) return { error: "Enter your percentage." };
  if (percentage < 0 || percentage > 100) {
    return { error: "A percentage sits between 0 and 100." };
  }
  const value = round((percentage / 100) * scale, 2);
  return {
    value,
    display: `${value.toFixed(2)} on ${scale}`,
    working: {
      formula: `GPA = Percentage ÷ 100 × ${scale}`,
      substituted: `GPA = ${percentage} ÷ 100 × ${scale}`,
      steps: [
        `${percentage} ÷ 100 = ${round(percentage / 100, 4)}`,
        `${round(percentage / 100, 4)} × ${scale} = ${value}`,
      ],
      result: `${value.toFixed(2)} on a ${scale} point scale`,
    },
    source: "Linear proportion. The simplest defensible conversion, and the one most forms expect.",
    limits: [
      "A linear conversion ignores grade boundaries. A US institution using a letter-grade table will produce a different figure, sometimes materially different.",
      "Where an application form offers a WES or institution-specific conversion, use that instead of this one.",
      "Some universities do not convert at all and read your percentage directly.",
    ],
  };
}

export function cgpaToGpa(cgpa: number, scale: GpaScale = 4): Conversion | { error: string } {
  if (!Number.isFinite(cgpa)) return { error: "Enter your CGPA." };
  if (cgpa < 0 || cgpa > 10) return { error: "A 10 point CGPA sits between 0 and 10." };
  const value = round((cgpa / 10) * scale, 2);
  return {
    value,
    display: `${value.toFixed(2)} on ${scale}`,
    working: {
      formula: `GPA = CGPA ÷ 10 × ${scale}`,
      substituted: `GPA = ${cgpa} ÷ 10 × ${scale}`,
      steps: [`${cgpa} ÷ 10 = ${round(cgpa / 10, 4)}`, `${round(cgpa / 10, 4)} × ${scale} = ${value}`],
      result: `${value.toFixed(2)} on a ${scale} point scale`,
    },
    source: "Linear proportion between the two scales",
    limits: [
      "This is a proportion, not an equivalence. A 4.0 GPA and a 10.0 CGPA are both perfect scores, but the distributions underneath them are not comparable.",
      "Where a university publishes its own CGPA to GPA table, that table governs.",
    ],
  };
}

export function percentageToMarks(
  percentage: number,
  totalMarks: number,
): Conversion | { error: string } {
  if (!Number.isFinite(percentage) || !Number.isFinite(totalMarks)) {
    return { error: "Enter your percentage and the total marks." };
  }
  if (percentage < 0 || percentage > 100) return { error: "A percentage sits between 0 and 100." };
  if (totalMarks <= 0) return { error: "Total marks have to be above zero." };

  const value = round((percentage / 100) * totalMarks, 1);
  return {
    value,
    display: `${value} of ${totalMarks}`,
    working: {
      formula: "Marks = Percentage ÷ 100 × Total marks",
      substituted: `Marks = ${percentage} ÷ 100 × ${totalMarks}`,
      steps: [`${percentage} ÷ 100 × ${totalMarks} = ${value}`],
      result: `${value} out of ${totalMarks}`,
    },
    source: "Arithmetic. Nothing is being interpreted here.",
    limits: ["Rounding on your transcript may differ by a mark either way."],
  };
}

/**
 * SGPA to CGPA, credit weighted where credits are supplied.
 *
 * The unweighted mean is the version everyone publishes and it is wrong
 * whenever semesters carried different credit loads, which is most programmes.
 * Both are computed, and the weighted one is the answer.
 */
export function sgpaToCgpa(
  semesters: { sgpa: number; credits?: number }[],
): Conversion | { error: string } {
  const usable = semesters.filter((item) => Number.isFinite(item.sgpa));
  if (usable.length === 0) return { error: "Enter at least one semester's SGPA." };
  if (usable.some((item) => item.sgpa < 0 || item.sgpa > 10)) {
    return { error: "Each SGPA sits between 0 and 10." };
  }

  const weighted = usable.every((item) => Number.isFinite(item.credits) && (item.credits ?? 0) > 0);

  if (weighted) {
    const totalCredits = usable.reduce((sum, item) => sum + (item.credits ?? 0), 0);
    const totalPoints = usable.reduce((sum, item) => sum + item.sgpa * (item.credits ?? 0), 0);
    const value = round(totalPoints / totalCredits, 2);
    return {
      value,
      display: value.toFixed(2),
      working: {
        formula: "CGPA = Σ (SGPA × semester credits) ÷ Σ semester credits",
        substituted: `CGPA = (${usable.map((item) => `${item.sgpa} × ${item.credits}`).join(" + ")}) ÷ ${totalCredits}`,
        steps: [
          ...usable.map(
            (item, index) =>
              `Semester ${index + 1}: ${item.sgpa} × ${item.credits} = ${round(item.sgpa * (item.credits ?? 0), 2)}`,
          ),
          `Total grade points = ${round(totalPoints, 2)}`,
          `Total credits = ${totalCredits}`,
          `${round(totalPoints, 2)} ÷ ${totalCredits} = ${value}`,
        ],
        result: value.toFixed(2),
      },
      source: "Credit weighted mean, which is what a university regulation almost always specifies",
      limits: [
        "Your university's regulation is the authority. A few weight by something other than credits, and a few exclude specific semesters.",
        "This is not the figure to put on an application form. Use the CGPA printed on your official transcript.",
      ],
    };
  }

  const value = round(usable.reduce((sum, item) => sum + item.sgpa, 0) / usable.length, 2);
  return {
    value,
    display: value.toFixed(2),
    working: {
      formula: "CGPA = Σ SGPA ÷ number of semesters",
      substituted: `CGPA = (${usable.map((item) => item.sgpa).join(" + ")}) ÷ ${usable.length}`,
      steps: [
        `Sum of SGPAs = ${round(usable.reduce((sum, item) => sum + item.sgpa, 0), 2)}`,
        `Divided by ${usable.length} semesters = ${value}`,
      ],
      result: value.toFixed(2),
    },
    source: "Unweighted mean, because no credit figures were entered",
    limits: [
      "Without credits this assumes every semester carried the same load, which is usually not true. Add the credits for each semester and this becomes the credit weighted figure your regulation specifies.",
      "This is not the figure to put on an application form. Use the CGPA printed on your official transcript.",
    ],
  };
}

/** The grade points a typical Indian 10 point regulation attaches to each letter. */
export const gradePointOptions = [
  { letter: "O / A+", points: 10 },
  { letter: "A", points: 9 },
  { letter: "B+", points: 8 },
  { letter: "B", points: 7 },
  { letter: "C", points: 6 },
  { letter: "D", points: 5 },
  { letter: "E", points: 4 },
  { letter: "F", points: 0 },
] as const;

/** GPA from individual subjects, credit weighted. */
export function gpaFromSubjects(
  subjects: { name: string; credits: number; points: number }[],
): Conversion | { error: string } {
  const usable = subjects.filter(
    (item) => Number.isFinite(item.credits) && item.credits > 0 && Number.isFinite(item.points),
  );
  if (usable.length === 0) return { error: "Add at least one subject with its credits." };

  const totalCredits = usable.reduce((sum, item) => sum + item.credits, 0);
  const totalPoints = usable.reduce((sum, item) => sum + item.credits * item.points, 0);
  const value = round(totalPoints / totalCredits, 2);

  return {
    value,
    display: value.toFixed(2),
    working: {
      formula: "GPA = Σ (credits × grade points) ÷ Σ credits",
      substituted: `GPA = (${usable.map((item) => `${item.credits} × ${item.points}`).join(" + ")}) ÷ ${totalCredits}`,
      steps: [
        ...usable.map(
          (item) =>
            `${item.name || "Subject"}: ${item.credits} × ${item.points} = ${round(item.credits * item.points, 2)}`,
        ),
        `Total grade points = ${round(totalPoints, 2)}`,
        `Total credits = ${totalCredits}`,
        `${round(totalPoints, 2)} ÷ ${totalCredits} = ${value}`,
      ],
      result: value.toFixed(2),
    },
    source: "Credit weighted mean, the standard form of a semester grade point average",
    limits: [
      "Grade points differ between universities. Check the letter to point table in your own regulation before trusting this.",
      "A backlog or a repeated subject is usually counted under specific rules that this does not model.",
    ],
  };
}

/* ------------------------------------------------------------------ *
 * IELTS
 * ------------------------------------------------------------------ */

export type IeltsDescriptor = { band: number; name: string; description: string };

/** The nine band descriptors, as the test provider publishes them. */
export const ieltsDescriptors: IeltsDescriptor[] = [
  { band: 9, name: "Expert user", description: "Fully operational command of the language: appropriate, accurate and fluent, with complete understanding." },
  { band: 8, name: "Very good user", description: "Fully operational command with only occasional unsystematic inaccuracies and inappropriate usage." },
  { band: 7, name: "Good user", description: "Operational command, though with occasional inaccuracies and misunderstandings in some situations." },
  { band: 6, name: "Competent user", description: "Generally effective command despite some inaccuracies and misunderstandings. Can use fairly complex language in familiar situations." },
  { band: 5, name: "Modest user", description: "Partial command, coping with overall meaning in most situations, though likely to make many mistakes." },
  { band: 4, name: "Limited user", description: "Basic competence limited to familiar situations. Frequent problems in understanding and expression." },
  { band: 3, name: "Extremely limited user", description: "Conveys and understands only general meaning in very familiar situations. Frequent breakdowns in communication." },
  { band: 2, name: "Intermittent user", description: "Great difficulty understanding spoken and written English." },
  { band: 1, name: "Non-user", description: "Essentially no ability to use the language beyond a few isolated words." },
];

export function ieltsDescriptorFor(band: number): IeltsDescriptor {
  const floor = Math.floor(band);
  return ieltsDescriptors.find((item) => item.band === floor) ?? ieltsDescriptors[8];
}

/**
 * The IELTS overall band.
 *
 * The published rule is: take the mean of the four sections, round to the
 * nearest whole or half band, and where the mean ends in .25 or .75, round up.
 * Rounding to the nearest half band with JavaScript's round-half-up gives
 * exactly that, since a mean of four half-step scores can only land on an
 * eighth: 6.25 doubles to 12.5, rounds to 13, halves to 6.5. So the rule is one
 * expression, and the test in tests/calculators.test.ts pins every case.
 */
export function ieltsOverall(sections: {
  listening: number;
  reading: number;
  writing: number;
  speaking: number;
}): Conversion | { error: string } {
  const entries = Object.entries(sections) as [string, number][];

  for (const [name, score] of entries) {
    if (!Number.isFinite(score)) return { error: `Enter your ${name} score.` };
    if (score < 0 || score > 9) return { error: `${name} sits between 0 and 9.` };
    if (Math.round(score * 2) !== score * 2) {
      return { error: `${name} has to be a whole or a half band, such as 6.5.` };
    }
  }

  const sum = entries.reduce((total, [, score]) => total + score, 0);
  const mean = sum / 4;
  const value = Math.round(mean * 2) / 2;
  const descriptor = ieltsDescriptorFor(value);

  return {
    value,
    display: value.toFixed(1),
    working: {
      formula: "Overall = mean of the four sections, rounded to the nearest half band, with .25 and .75 rounding up",
      substituted: `Overall = (${entries.map(([, score]) => score).join(" + ")}) ÷ 4`,
      steps: [
        `Sum of the four sections = ${sum}`,
        `${sum} ÷ 4 = ${round(mean, 3)}`,
        `Rounded to the nearest half band = ${value.toFixed(1)}`,
      ],
      result: `${value.toFixed(1)} — ${descriptor.name}`,
    },
    source: "IELTS published band score calculation rules",
    limits: [
      "The overall band is not the whole requirement. Most universities also set a minimum in each section, and a 7.0 overall with a 5.5 in writing frequently fails a 6.0-per-section condition.",
      "Where a Secure English Language Test is required, the overall band from the wrong IELTS variant does not count at all.",
      "This calculates a band. It does not predict a band you have not sat for.",
    ],
  };
}

/* ------------------------------------------------------------------ *
 * ECTS credit mapping, for German Master's admission
 * ------------------------------------------------------------------ */

export type EctsCheck = {
  totalRequired: number;
  totalHeld: number;
  areas: { name: string; required: number; held: number }[];
};

export type EctsResult = {
  meetsTotal: boolean;
  totalGap: number;
  areas: { name: string; required: number; held: number; gap: number; met: boolean }[];
  /** Areas short of the requirement, worst first. */
  shortfalls: { name: string; gap: number }[];
  working: Working;
};

/**
 * The credit arithmetic German Master's admission actually runs.
 *
 * This is a subtraction, not an assessment. It says which of the programme's
 * stated credit requirements your transcript meets and by how much it misses
 * the others, and it deliberately does not conclude anything about whether you
 * will be admitted, because that is the programme's decision and it turns on
 * things no arithmetic here can see.
 */
export function checkEcts(input: EctsCheck): EctsResult {
  const areas = input.areas.map((area) => {
    const gap = Math.max(0, area.required - area.held);
    return { ...area, gap, met: gap === 0 };
  });
  const totalGap = Math.max(0, input.totalRequired - input.totalHeld);

  return {
    meetsTotal: totalGap === 0,
    totalGap,
    areas,
    shortfalls: areas
      .filter((area) => !area.met)
      .map((area) => ({ name: area.name, gap: area.gap }))
      .sort((a, b) => b.gap - a.gap),
    working: {
      formula: "Gap = credits the programme requires − credits your transcript shows",
      substituted: `Total: ${input.totalRequired} − ${input.totalHeld}`,
      steps: [
        `Total credits: needs ${input.totalRequired}, you have ${input.totalHeld}, ${totalGap === 0 ? "met" : `short by ${totalGap}`}`,
        ...areas.map(
          (area) =>
            `${area.name}: needs ${area.required}, you have ${area.held}, ${area.met ? "met" : `short by ${area.gap}`}`,
        ),
      ],
      result:
        totalGap === 0 && areas.every((area) => area.met)
          ? "Every stated credit requirement is met on these numbers"
          : `${areas.filter((area) => !area.met).length + (totalGap > 0 ? 1 : 0)} requirement${areas.filter((area) => !area.met).length + (totalGap > 0 ? 1 : 0) === 1 ? "" : "s"} not met on these numbers`,
    },
  };
}

export const ECTS_LIMITS = [
  "The credit requirements are the programme's, and they are published per programme. Enter the ones from the module handbook of the course you are applying to, not a general figure.",
  "One Indian credit is not one ECTS credit. A conversion is applied by uni-assist or the university, commonly by contact hours, and that conversion can move your totals in either direction.",
  "A shortfall is often fixable. Many programmes admit with conditional modules to be completed in the first year, which is a question to ask the programme rather than a reason to drop it from a shortlist.",
];
