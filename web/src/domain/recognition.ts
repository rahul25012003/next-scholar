import type { DegreeRecognition, StudentCase } from "./case";

/**
 * Degree recognition, which is the biggest German gate for an Indian applicant
 * and which this platform previously could not represent at all.
 *
 * The module reports state, never a verdict. anabin says whether an institution
 * is recognised; the programme says whether the credits are enough; neither of
 * those decisions is ours, and this file has no shape that could express one.
 * What it does is say which of the three gates has been checked, which has not,
 * and what the unchecked ones block.
 *
 * `checkedBy` on the record is writable only by a named person. Nothing here
 * sets it, and no agent may.
 */

export type RecognitionGate = {
  id: "anabin" | "duration" | "credits" | "dmat";
  title: string;
  state: "clear" | "attention" | "unchecked";
  detail: string;
  /** What is held up while this gate is unchecked or unclear. */
  blocks: string | null;
  source: string;
};

export const anabinLabel: Record<DegreeRecognition["anabin"], string> = {
  "h-plus": "H+, recognised",
  "h-plus-minus": "H+/-, decided case by case",
  "h-minus": "H-, not recognised as equivalent",
  "not-checked": "Not yet looked up",
};

/** The subject groups the dMAT applies to, from the APS India announcement. */
const DMAT_SUBJECTS = /engineer|commerce|business|finance|econom|management|mba|bcom|btech|b\.?e\b/i;

/**
 * The German gates for one case.
 *
 * Returns an empty list for a case that is not on a German route, because
 * anabin and the dMAT mean nothing to a UK applicant and a checklist
 * of irrelevant gates is noise a counsellor learns to skip.
 */
export function germanGates(record: StudentCase): RecognitionGate[] {
  if (record.destination !== "Germany") return [];

  const recognition = record.profile.recognition;
  const gates: RecognitionGate[] = [];

  if (!recognition) {
    return [
      {
        id: "anabin",
        title: "Degree recognition has not been started",
        state: "unchecked",
        detail:
          "This case has no anabin rating, degree length or credits recorded. On the German route these decide eligibility, before any document is worth collecting.",
        blocks: "The shortlist. A shortlist the applicant cannot apply to is worse than none.",
        source: "anabin, Zentralstelle fur auslandisches Bildungswesen",
      },
    ];
  }

  gates.push({
    id: "anabin",
    title: `anabin: ${anabinLabel[recognition.anabin]}`,
    state:
      recognition.anabin === "h-plus"
        ? "clear"
        : recognition.anabin === "not-checked"
          ? "unchecked"
          : "attention",
    detail:
      recognition.anabin === "h-plus"
        ? "The awarding institution is rated H+, so the institution is not the obstacle. The degree and then the credits still need checking separately."
        : recognition.anabin === "h-plus-minus"
          ? "H+/- means the university decides case by case. Expect to be asked, and to answer with the transcript, not the rating."
          : recognition.anabin === "h-minus"
            ? "H- means the degree is not treated as equivalent, so a direct Master's application is unlikely to succeed. Tell the applicant early, before any fee is paid."
            : "Nobody has looked the institution up. It takes minutes and decides whether the rest of the plan can work.",
    blocks:
      recognition.anabin === "h-plus"
        ? null
        : "Building a shortlist, because eligibility per university depends on it.",
    source: "anabin, Zentralstelle fur auslandisches Bildungswesen",
  });

  gates.push({
    id: "duration",
    title:
      recognition.bachelorYears === null
        ? "Bachelor's duration not recorded"
        : `${recognition.bachelorYears} year Bachelor's`,
    state:
      recognition.bachelorYears === null
        ? "unchecked"
        : recognition.bachelorYears === 4
          ? "clear"
          : "attention",
    detail:
      recognition.bachelorYears === 4
        ? "A four year Bachelor's matches the 240 ECTS a German engineering Master's is usually built on, which removes the most common objection on duration."
        : recognition.bachelorYears === 3
          ? "Many Master's programmes accept a three year Bachelor's on duration and others find it short. Each programme decides on credits, not years, so the credits check below is the one that matters."
          : "Not recorded. Ask the applicant: it changes which programmes are worth an application fee.",
    blocks: null,
    source: "Programme admission regulations, and anabin equivalence statements",
  });

  const credited = recognition.totalCredits;
  gates.push({
    id: "credits",
    title:
      credited === null
        ? "ECTS credits not established"
        : `${credited} ECTS-equivalent credits${recognition.subjectCredits.length > 0 ? `, ${recognition.subjectCredits.length} subject areas recorded` : ""}`,
    state: credited === null ? "unchecked" : credited >= 180 ? "clear" : "attention",
    detail:
      credited === null
        ? "German Master's admission mostly comes down to the transcript: total credits, core subject credits, mathematics credits and named technical prerequisites. None are on this case, so no programme's requirements can be checked."
        : credited >= 180
          ? "The total clears the 180 ECTS of a German Bachelor's. Admission turns on the subject-wise credits, which are checked per programme."
          : `${credited} credits is below the 180 of a German Bachelor's. Discuss this before an application fee is paid, not after.`,
    blocks:
      credited === null
        ? "Checking any programme's prerequisites, the check that decides most German Master's outcomes."
        : null,
    source: "Programme admission regulations",
  });

  // The dMAT, for the population it applies to. Scoped from the degree text
  // because that is the only subject signal on the record today; a wrong guess
  // here surfaces as "check whether this applies", never as "this applies".
  const looksInScope = DMAT_SUBJECTS.test(record.profile.degree ?? "");
  const intakeYear = Number(record.intake.match(/\d{4}/)?.[0] ?? 0);
  const afterTransition = intakeYear >= 2027;

  if (looksInScope && afterTransition) {
    gates.push({
      id: "dmat",
      title: "dMAT may apply to this applicant",
      state: "unchecked",
      detail: `The degree on file looks like a dMAT subject group, and the ${record.intake} intake is on or after the summer semester 2027 start. Confirm the subject group with the applicant, and check whether they registered with APS India before 29 June 2026 (the transitional exemption). It costs EUR 150 on top of the APS fee and is not pass or fail.`,
      blocks: "The university application, for applicants in scope.",
      source: "APS India",
    });
  }

  return gates;
}

/** A one line state for the caseload, so a blocked case is visible in a list. */
export function recognitionSummary(record: StudentCase): string | null {
  const gates = germanGates(record);
  if (gates.length === 0) return null;

  const unchecked = gates.filter((gate) => gate.state === "unchecked");
  const attention = gates.filter((gate) => gate.state === "attention");

  if (unchecked.length > 0) {
    return `${unchecked.length} recognition check${unchecked.length === 1 ? "" : "s"} not started`;
  }
  if (attention.length > 0) {
    return `${attention.length} recognition point${attention.length === 1 ? "" : "s"} needing attention`;
  }
  return "Recognition checks clear";
}
