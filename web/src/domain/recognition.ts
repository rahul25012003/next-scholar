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
  id: "anabin" | "duration" | "credits" | "studienkolleg" | "dmat";
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

export const studienkollegLabel: Record<DegreeRecognition["studienkolleg"], string> = {
  "not-required": "Not required",
  required: "Required",
  "in-progress": "In progress",
  completed: "Completed",
  unknown: "Not yet established",
};

/** The subject groups the dMAT applies to, from the APS India announcement. */
const DMAT_SUBJECTS = /engineer|commerce|business|finance|econom|management|mba|bcom|btech|b\.?e\b/i;

/**
 * The German gates for one case.
 *
 * Returns an empty list for a case that is not on a German route, because
 * anabin and the Studienkolleg mean nothing to a UK applicant and a checklist
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
          "Nothing on this case records the anabin rating, the degree length or the credits. On the German route those decide eligibility before any document is worth collecting.",
        blocks: "The shortlist. A shortlist of universities the applicant cannot apply to is worse than no shortlist.",
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
        ? "The awarding institution is rated H+, so the institution itself is not the obstacle. The degree still has to be checked separately, and the credits after that."
        : recognition.anabin === "h-plus-minus"
          ? "H+/- means the university decides case by case. Expect the question to be asked, and expect to have to answer it with the transcript rather than with the rating."
          : recognition.anabin === "h-minus"
            ? "H- means the degree is not treated as equivalent. The route changes: a Studienkolleg or a different qualification comes before a direct application, and telling the applicant this early is the difference between a plan and a wasted year."
            : "Nobody has looked the institution up. It takes minutes and it decides whether the rest of the plan is real.",
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
        ? "Bachelor's length not recorded"
        : `${recognition.bachelorYears} year Bachelor's`,
    state:
      recognition.bachelorYears === null
        ? "unchecked"
        : recognition.bachelorYears === 4
          ? "clear"
          : "attention",
    detail:
      recognition.bachelorYears === 4
        ? "A four year Bachelor's maps onto the 240 ECTS a German engineering Master's is usually built on, which removes the commonest duration objection."
        : recognition.bachelorYears === 3
          ? "A three year Bachelor's is accepted on duration by many Master's programmes and found short by others. The answer is per programme and it turns on credits rather than years, so the credits gate below is the one that matters."
          : "Not recorded. It is one question to the applicant and it changes which programmes are worth an application fee.",
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
        ? "German Master's admission is largely arithmetic on the transcript: total credits, core subject credits, mathematics credits, and the named technical prerequisites. None of those are on this case, so no programme's requirements can be checked against it."
        : credited >= 180
          ? "The total clears the 180 ECTS a German Bachelor's carries. The total is the easy half: the subject-wise credits are what admission actually turns on, and they are checked per programme."
          : `${credited} credits is below the 180 a German Bachelor's carries. That is a conversation to have before an application fee is paid, not after.`,
    blocks:
      credited === null
        ? "Checking any specific programme's prerequisites, which is the check that decides most German Master's outcomes."
        : null,
    source: "Programme admission regulations",
  });

  if (recognition.studienkolleg !== "not-required") {
    gates.push({
      id: "studienkolleg",
      title: `Studienkolleg: ${studienkollegLabel[recognition.studienkolleg]}`,
      state:
        recognition.studienkolleg === "completed"
          ? "clear"
          : recognition.studienkolleg === "unknown"
            ? "unchecked"
            : "attention",
      detail:
        recognition.studienkolleg === "unknown"
          ? "Whether a Studienkolleg is needed follows from the recognition answer above. It is one or two semesters plus the Feststellungsprufung, so it belongs in the plan from the start rather than as a fallback discovered after a rejection."
          : recognition.studienkolleg === "completed"
            ? "The assessment is passed, so the applicant applies as a directly eligible candidate."
            : "A real year and a real cost. Its dates drive the whole timeline, so the intake being planned for has to be the one after it, not the one during it.",
      blocks:
        recognition.studienkolleg === "required" || recognition.studienkolleg === "in-progress"
          ? "The intake being planned for. The application follows the Feststellungsprufung, not the other way round."
          : null,
      source: "Studienkolleg admission offices",
    });
  }

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
      detail: `The degree on file reads as one of the subject groups the dMAT covers, and the ${record.intake} intake falls on or after the summer semester 2027 start. Confirm the subject group with the applicant and check whether they registered with APS India before 29 June 2026, which is the transitional exemption. EUR 150, separate from the APS fee, and it is not pass or fail.`,
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
