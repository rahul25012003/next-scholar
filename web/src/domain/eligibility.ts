/**
 * The requirements checklist.
 *
 * This is the honest version of the tool every competitor ships as an "admission
 * predictor". It answers exactly one question per row: does the fact you gave us
 * meet the requirement that body publishes, yes, no, or we cannot tell because
 * you have not told us. There are three states and there is no fourth, and in
 * particular there is no score, no percentage chance and no ranking of your
 * prospects, because every one of those would be a fabricated number and the
 * guardrail tests assert that this module cannot produce one.
 *
 * A "not met" row is not a rejection either. Most of them name the thing to fix
 * and the order to fix it in, which is the useful part.
 */

import { guideFor } from "@/content/guides";

export type CheckState = "met" | "not-met" | "unknown";

export type CheckResult = {
  id: string;
  /** Grouping, so the answer reads as a file rather than as a list. */
  group: "Academic" | "Language" | "Money" | "Process" | "Timing";
  title: string;
  state: CheckState;
  /** Why this state, in terms of the figure the student supplied. */
  reason: string;
  /** What to do about it. Present on every not-met and unknown row. */
  action?: string;
  source: string;
};

/**
 * What a stranger can tell us without an account. Every field is optional and
 * absent means unknown, never zero: checking a threshold against a value nobody
 * supplied is how a checklist becomes fiction.
 */
export type Profile = {
  destination: string;
  /** "bachelors" or "masters", the level being applied for. */
  applyingFor?: "bachelors" | "masters";
  degreeDurationYears?: 3 | 4;
  /** Normalised percentage. A CGPA is converted before it arrives here. */
  percentage?: number;
  /** ECTS-equivalent total credits, where the student knows them. */
  totalCredits?: number;
  subjectGroup?: "engineering" | "commerce-business-finance-economics" | "other";
  englishTest?: { name: string; overall: number; lowestSection?: number };
  germanLevel?: "none" | "a1-a2" | "b1" | "b2" | "c1-c2";
  /** Total funds the student can evidence, in INR. */
  fundsInr?: number;
  /** Months of history the funds have, for the UK 28 day and Irish 6 month rules. */
  fundsHeldMonths?: number;
  apsStatus?: "not-started" | "in-progress" | "issued";
  /** Whether they registered with APS before the dMAT transitional date. */
  apsRegisteredBefore29June2026?: boolean;
  /** The intake being targeted, as a guide intake name. */
  intake?: string;
  /** The Irish NFQ level of the target programme. */
  irishLevel?: 8 | 9;
};

const unknown = (
  id: string,
  group: CheckResult["group"],
  title: string,
  reason: string,
  action: string,
  source: string,
): CheckResult => ({ id, group, title, state: "unknown", reason, action, source });

/** Indicative conversion only, and labelled as such wherever it surfaces. */
const INR_PER_EUR = 101;
const INR_PER_GBP = 118;

function moneyCheck(
  id: string,
  title: string,
  requiredLocal: number,
  currency: "EUR" | "GBP",
  profile: Profile,
  source: string,
  note: string,
): CheckResult {
  const rate = currency === "EUR" ? INR_PER_EUR : INR_PER_GBP;
  const requiredInr = requiredLocal * rate;
  const symbol = currency === "EUR" ? "€" : "£";

  if (profile.fundsInr === undefined) {
    return unknown(
      id,
      "Money",
      title,
      "You have not told us what you can evidence.",
      `The requirement is ${symbol}${requiredLocal.toLocaleString("en-IN")}, roughly ₹${Math.round(requiredInr / 100000)} lakh at ₹${rate} to the ${currency === "EUR" ? "euro" : "pound"}. ${note}`,
      source,
    );
  }

  const met = profile.fundsInr >= requiredInr;
  return {
    id,
    group: "Money",
    title,
    state: met ? "met" : "not-met",
    reason: met
      ? `You can evidence about ₹${Math.round(profile.fundsInr / 100000)} lakh, against a requirement of ${symbol}${requiredLocal.toLocaleString("en-IN")}, roughly ₹${Math.round(requiredInr / 100000)} lakh at ₹${rate} to the ${currency === "EUR" ? "euro" : "pound"}. The rupee comparison is indicative: no exchange rate service is connected to this site.`
      : `You can evidence about ₹${Math.round(profile.fundsInr / 100000)} lakh. The requirement is ${symbol}${requiredLocal.toLocaleString("en-IN")}, roughly ₹${Math.round(requiredInr / 100000)} lakh at ₹${rate} to the ${currency === "EUR" ? "euro" : "pound"}, which leaves a shortfall of about ₹${Math.max(0, Math.round((requiredInr - profile.fundsInr) / 100000))} lakh.`,
    action: met ? note : `${note} An education loan sanction letter is accepted on some routes and not on others, which is worth establishing before you apply.`,
    source,
  };
}

function englishCheck(profile: Profile, minimumOverall: number, minimumSection: number): CheckResult {
  const source = "University admission requirements";
  if (!profile.englishTest) {
    return unknown(
      "english",
      "Language",
      "English language requirement",
      "You have not told us your test result.",
      `The common threshold is ${minimumOverall} overall with no section below ${minimumSection}. If you have not sat a test yet, that is the next thing to book.`,
      source,
    );
  }

  const { name, overall, lowestSection } = profile.englishTest;
  const overallMet = overall >= minimumOverall;
  const sectionMet = lowestSection === undefined ? null : lowestSection >= minimumSection;

  if (overallMet && sectionMet === true) {
    return {
      id: "english",
      group: "Language",
      title: "English language requirement",
      state: "met",
      reason: `${name} ${overall} overall with nothing below ${lowestSection} meets a typical ${minimumOverall} overall and ${minimumSection} per section condition.`,
      action:
        "Check the offer for the test variant it requires. Where a Secure English Language Test is specified, the right score on the wrong variant does not count.",
      source,
    };
  }

  if (overallMet && sectionMet === null) {
    return unknown(
      "english",
      "Language",
      "English language requirement",
      `${name} ${overall} overall meets a typical ${minimumOverall} threshold, but you have not given us your lowest section score.`,
      `Most conditions also set a per-section minimum, commonly ${minimumSection}. A strong overall band with one weak section is the most common way this condition is failed by someone who thinks they have met it.`,
      source,
    );
  }

  return {
    id: "english",
    group: "Language",
    title: "English language requirement",
    state: "not-met",
    reason: !overallMet
      ? `${name} ${overall} overall is below the ${minimumOverall} a typical taught postgraduate offer requires.`
      : `${name} ${overall} overall clears the threshold, but a section at ${lowestSection} is below the ${minimumSection} minimum most offers set per section.`,
    action: !overallMet
      ? "Some universities set a lower threshold, and some accept a pre-sessional English course as a route in. Both are real options and both change the timeline."
      : "A retake of the whole test is usually required rather than one section, though a One Skill Retake is available for IELTS at some centres. Check what your test provider offers before rebooking the lot.",
    source,
  };
}

function academicCheck(profile: Profile, threshold: number, destination: string): CheckResult {
  const source = "University admission requirements";
  if (profile.percentage === undefined) {
    return unknown(
      "academic",
      "Academic",
      "Academic threshold",
      "You have not told us your percentage or CGPA.",
      `Universities in ${destination} commonly ask for around ${threshold} per cent for a taught Master's, and each keeps its own list of recognised Indian institutions.`,
      source,
    );
  }
  const met = profile.percentage >= threshold;
  return {
    id: "academic",
    group: "Academic",
    title: "Academic threshold",
    state: met ? "met" : "not-met",
    reason: met
      ? `${profile.percentage} per cent is at or above the ${threshold} per cent a typical taught Master's offer in ${destination} asks for.`
      : `${profile.percentage} per cent is below the ${threshold} per cent a typical taught Master's offer in ${destination} asks for.`,
    action: met
      ? "The threshold is per university and per programme, and a higher-ranked institution will set a higher one. It is checked per shortlist entry rather than per country."
      : "Thresholds vary widely between institutions, and relevant work experience shifts the answer at some. This closes a shortlist tier, not the destination.",
    source,
  };
}

/**
 * The whole checklist for a destination.
 *
 * Each destination's rules are written out rather than abstracted into a rules
 * engine, because there are three destinations and the rules genuinely do not
 * share a shape: a German recognition check and a UK 28 day funds check have
 * nothing in common but their output type.
 */
export function runChecklist(profile: Profile): CheckResult[] {
  const guide = guideFor(profile.destination);
  if (!guide) return [];

  if (guide.slug === "germany") return germanChecks(profile);
  if (guide.slug === "united-kingdom") return ukChecks(profile);
  return irishChecks(profile);
}

function germanChecks(profile: Profile): CheckResult[] {
  const checks: CheckResult[] = [academicCheck(profile, 60, "Germany")];

  // Degree duration and credits, which is the real German gate.
  if (profile.degreeDurationYears === undefined) {
    checks.push(
      unknown(
        "duration",
        "Academic",
        "Degree recognition and duration",
        "You have not told us whether your Bachelor's is three or four years.",
        "Germany checks your institution and degree on the anabin database and then checks subject credits against the programme's module handbook. Both are per programme, and a three year degree is accepted for many Master's and found short of technical credits for others.",
        "anabin, Zentralstelle fur auslandisches Bildungswesen",
      ),
    );
  } else if (profile.degreeDurationYears === 4) {
    checks.push({
      id: "duration",
      group: "Academic",
      title: "Degree recognition and duration",
      state: "met",
      reason:
        "A four year Bachelor's maps onto the 240 ECTS a German engineering Master's is usually built on, which removes the most common duration objection.",
      action:
        "Duration is not the whole check. Your institution still has to be rated H+ on anabin and the subject credits still have to match the programme's handbook.",
      source: "anabin, and programme admission regulations",
    });
  } else {
    checks.push({
      id: "duration",
      group: "Academic",
      title: "Degree recognition and duration",
      state: "unknown",
      reason:
        "A three year Bachelor's is accepted on duration by many German Master's programmes and found short by others, and which applies is a per-programme fact rather than a per-country one.",
      action:
        "Check the programme's module handbook for its total, core subject and mathematics credit requirements, then run those numbers through the ECTS check. An engineering Master's built on a 240 ECTS Bachelor's is where a three year degree most often falls short.",
      source: "anabin, and programme admission regulations",
    });
  }

  if (profile.totalCredits !== undefined) {
    const met = profile.totalCredits >= 180;
    checks.push({
      id: "credits",
      group: "Academic",
      title: "Total credits",
      state: met ? "met" : "not-met",
      reason: met
        ? `${profile.totalCredits} credits is at or above the 180 ECTS a German Bachelor's carries.`
        : `${profile.totalCredits} credits is below the 180 ECTS a German Bachelor's carries.`,
      action:
        "The total is the easy half. Subject-wise credits, especially mathematics and the named technical prerequisites, are what admission actually turns on.",
      source: "Programme admission regulations",
    });
  }

  // APS, which gates everything else on this route.
  if (profile.apsStatus === undefined) {
    checks.push(
      unknown(
        "aps",
        "Process",
        "APS certificate",
        "You have not told us where your APS application stands.",
        "It is mandatory for every Indian applicant, takes weeks, and both the university application and the visa application stop without it. It is the first clock to start.",
        "APS India",
      ),
    );
  } else if (profile.apsStatus === "issued") {
    checks.push({
      id: "aps",
      group: "Process",
      title: "APS certificate",
      state: "met",
      reason: "Your certificate is issued, which unblocks both the university and the visa application.",
      action: "One certificate is reused across applications. Keep the original safe and apply with copies.",
      source: "APS India",
    });
  } else {
    checks.push({
      id: "aps",
      group: "Process",
      title: "APS certificate",
      state: "not-met",
      reason:
        profile.apsStatus === "in-progress"
          ? "Your application is in progress, so it is not yet a certificate you can apply with."
          : "You have not started APS, and nothing on this route proceeds without it.",
      action:
        "Check every document for name consistency before submitting, and include every semester transcript individually. Those two things cause most APS rejections and both are avoidable.",
      source: "APS India",
    });
  }

  // dMAT, the requirement the site previously did not mention at all.
  const inScope =
    profile.applyingFor === "masters" &&
    (profile.subjectGroup === "engineering" ||
      profile.subjectGroup === "commerce-business-finance-economics");

  if (profile.subjectGroup === undefined || profile.applyingFor === undefined) {
    checks.push(
      unknown(
        "dmat",
        "Process",
        "dMAT, the new APS India Digital Master Test",
        "You have not told us the level you are applying for or your subject group.",
        "From the summer semester 2027 intake, Indian Bachelor's holders applying for a Master's in Engineering, Commerce, Business, Finance or Economics must sit the dMAT. It costs €150 on top of the APS fee and it is not pass or fail.",
        "APS India",
      ),
    );
  } else if (!inScope) {
    checks.push({
      id: "dmat",
      group: "Process",
      title: "dMAT, the new APS India Digital Master Test",
      state: "met",
      reason:
        profile.applyingFor === "bachelors"
          ? "The dMAT applies to Master's applicants. A Bachelor's application is outside it."
          : "Your subject group is outside the listed ones, which are Engineering, Commerce, Business, Finance and Economics.",
      action: "The requirement is new and its scope may widen. It is worth re-checking at APS India before your intake.",
      source: "APS India",
    });
  } else if (profile.apsRegisteredBefore29June2026) {
    checks.push({
      id: "dmat",
      group: "Process",
      title: "dMAT, the new APS India Digital Master Test",
      state: "met",
      reason:
        "You registered with APS India before 29 June 2026, which is the transitional exemption from the dMAT.",
      action: "Keep the evidence of that registration date. It is what the exemption rests on.",
      source: "APS India",
    });
  } else {
    checks.push({
      id: "dmat",
      group: "Process",
      title: "dMAT, the new APS India Digital Master Test",
      state: "not-met",
      reason:
        "You are in the population the dMAT applies to from the summer semester 2027 intake: an Indian Bachelor's holder applying for a Master's in one of the listed subject groups, without the transitional exemption.",
      action:
        "Budget €150 on top of the APS fee and fit a test cycle into your timeline. It is not pass or fail: it produces a score report universities read alongside your transcript.",
      source: "APS India",
    });
  }

  // Language. English for the programme, German for the life around it.
  checks.push(englishCheck(profile, 6.5, 6));

  if (profile.germanLevel === undefined || profile.germanLevel === "none") {
    checks.push({
      id: "german",
      group: "Language",
      title: "German language, for living there rather than for admission",
      state: "unknown",
      reason:
        profile.germanLevel === "none"
          ? "You have no German yet. No English-taught programme will require it."
          : "You have not told us your German level.",
      action:
        "A2 to B1 is what makes a part-time job, a lease, a doctor's appointment and a residence permit appointment workable. It is not an admission requirement and we will still recommend it. A German-taught programme is a different matter and needs TestDaF TDN 4, DSH-2 or equivalent.",
      source: "Programme admission regulations, and practical experience",
    });
  } else {
    checks.push({
      id: "german",
      group: "Language",
      title: "German language, for living there rather than for admission",
      state: "met",
      reason: `You have ${profile.germanLevel.toUpperCase().replace("-", " to ")} German, which is above the level that makes daily life workable.`,
      action:
        "For a German-taught degree the requirement is a formal certificate: TestDaF TDN 4, DSH-2, telc C1 Hochschule or Goethe C1. Conversational fluency is not the same as a certificate an admissions office accepts.",
      source: "Programme admission regulations",
    });
  }

  checks.push(
    moneyCheck(
      "blocked",
      "Blocked account",
      11904,
      "EUR",
      profile,
      "German Federal Foreign Office",
      "The whole year is deposited before the visa appointment and released to you at €992 a month afterwards.",
    ),
  );

  checks.push({
    id: "appointment",
    group: "Timing",
    title: "Visa appointment lead time",
    state: "unknown",
    reason:
      "This is the constraint we cannot check for you, and it decides more German intakes than any document does.",
    action:
      "Appointment slots at the German missions in India run from weeks to several months depending on the city and the season. Book on the day your admission letter permits it, before the rest of the file is finished.",
    source: "German missions in India",
  });

  return checks;
}

function ukChecks(profile: Profile): CheckResult[] {
  const checks: CheckResult[] = [academicCheck(profile, 60, "the United Kingdom")];

  checks.push({
    id: "duration",
    group: "Academic",
    title: "Degree recognition and duration",
    state: profile.degreeDurationYears === undefined ? "unknown" : "met",
    reason:
      profile.degreeDurationYears === undefined
        ? "You have not told us your degree length, and for this route it rarely matters."
        : `A ${profile.degreeDurationYears} year Indian Bachelor's is normally accepted for a one year taught Master's in the UK.`,
    action:
      "Universities keep their own recognised-institution lists and set their own percentage thresholds, so this is checked per university rather than per country.",
    source: "University admission requirements",
  });

  checks.push(englishCheck(profile, 6.5, 6));

  checks.push({
    id: "selt",
    group: "Language",
    title: "The right IELTS variant",
    state: "unknown",
    reason: "Whether you need a Secure English Language Test depends on the university, not on you.",
    action:
      "Establish this before you book. IELTS for UKVI and IELTS Academic are different bookings at different centre types, and where a SELT is required the wrong one costs both the fee and several weeks.",
    source: "UKVI approved SELT provider list",
  });

  // Maintenance plus tuition, which is the figure people get wrong.
  checks.push(
    moneyCheck(
      "maintenance",
      "Maintenance funds, plus the unpaid tuition on your CAS",
      13761,
      "GBP",
      profile,
      "UKVI Student route guidance, Appendix Finance",
      "This line is the London maximum, £1,529 a month for nine months. Outside London it is £1,171 a month, £10,539 for nine months. Either way, the tuition your CAS still shows as unpaid is added on top and is not included in this figure.",
    ),
  );

  if (profile.fundsHeldMonths === undefined) {
    checks.push(
      unknown(
        "twenty-eight-days",
        "Money",
        "The 28 consecutive day funds rule",
        "You have not told us how long the money has been in the account.",
        "The balance must not drop below the required total on any day of a 28 day period, and the closing balance has to be dated within 31 days of your application. One transfer out restarts the clock.",
        "UKVI Appendix Finance",
      ),
    );
  } else {
    const met = profile.fundsHeldMonths >= 1;
    checks.push({
      id: "twenty-eight-days",
      group: "Money",
      title: "The 28 consecutive day funds rule",
      state: met ? "met" : "not-met",
      reason: met
        ? `Money held for about ${profile.fundsHeldMonths} month${profile.fundsHeldMonths === 1 ? "" : "s"} satisfies the 28 day period, provided the balance never dipped below the required total.`
        : "Money held for less than a month cannot satisfy a 28 consecutive day requirement yet.",
      action: met
        ? "Do not move money out before applying. A single day below the threshold restarts the 28 days, and the closing balance still has to be dated within 31 days of the application."
        : "Fund the account, then leave it entirely alone for 28 days, then apply. Work backwards from your intended application date.",
      source: "UKVI Appendix Finance",
    });
  }

  checks.push({
    id: "ihs",
    group: "Money",
    title: "Immigration Health Surcharge",
    state: "unknown",
    reason: "A cash requirement at application time that is not part of the maintenance calculation.",
    action:
      "£776 per year of the visa, paid in full during the online application. A 12 month course with the standard post-course grant is charged for the longer period, so budget above one year's figure.",
    source: "UK Home Office",
  });

  checks.push({
    id: "tb",
    group: "Process",
    title: "TB test certificate",
    state: "not-met",
    reason:
      "Mandatory for applicants resident in India on a course longer than six months, and we have no way to know you already hold one.",
    action:
      "At a Home Office approved clinic only. A certificate from any other clinic is not accepted, whatever the clinic says.",
    source: "UK Home Office approved clinic list",
  });

  checks.push({
    id: "atas",
    group: "Process",
    title: "ATAS certificate, if your subject needs one",
    state: "unknown",
    reason: "It applies to named postgraduate subjects with security relevance, mostly in engineering, physics, materials and computing.",
    action:
      "Free, and it takes several weeks. Where required, the university cannot issue your CAS without it, so it sits before the CAS in the sequence and it is the wrong thing to discover late.",
    source: "Foreign, Commonwealth and Development Office",
  });

  checks.push({
    id: "graduate-route",
    group: "Timing",
    title: "Which Graduate Route window applies to you",
    state: "unknown",
    reason: "It depends on the date you apply, not the date you arrive.",
    action:
      "Applications made before 1 January 2027 get 24 months. On or after it, 18 months. If your intake is near that date, establish which side of it you fall on before planning the two years after graduation.",
    source: "UK Home Office immigration rules",
  });

  return checks;
}

function irishChecks(profile: Profile): CheckResult[] {
  const checks: CheckResult[] = [academicCheck(profile, 55, "Ireland")];

  checks.push({
    id: "duration",
    group: "Academic",
    title: "Degree recognition and duration",
    state: profile.degreeDurationYears === undefined ? "unknown" : "met",
    reason:
      profile.degreeDurationYears === undefined
        ? "You have not told us your degree length, and for this route it rarely matters."
        : `A ${profile.degreeDurationYears} year Indian Bachelor's is normally accepted for a taught Master's in Ireland.`,
    action: "Institutions keep their own recognition lists for Indian universities, so it is checked per institution.",
    source: "University admission requirements",
  });

  checks.push(englishCheck(profile, 6.5, 6));

  checks.push(
    moneyCheck(
      "funds",
      "Proof of funds for the first year",
      10000,
      "EUR",
      profile,
      "Irish Immigration Service Delivery",
      "This is on top of tuition, and it is read as a history rather than as a closing balance.",
    ),
  );

  if (profile.fundsHeldMonths === undefined) {
    checks.push(
      unknown(
        "six-months",
        "Money",
        "Six months of statements",
        "You have not told us how long the money has been in the account.",
        "Ireland reads six consecutive monthly statements. A lump sum arriving three weeks before the application needs an explained, evidenced source, and without one it is the most commonly cited refusal ground on this route.",
        "Irish Immigration Service Delivery",
      ),
    );
  } else {
    const met = profile.fundsHeldMonths >= 6;
    checks.push({
      id: "six-months",
      group: "Money",
      title: "Six months of statements",
      state: met ? "met" : "not-met",
      reason: met
        ? `About ${profile.fundsHeldMonths} months of history covers the six the visa office reads.`
        : `About ${profile.fundsHeldMonths} month${profile.fundsHeldMonths === 1 ? "" : "s"} of history is short of the six the visa office reads.`,
      action: met
        ? "Keep the account stable through to the application. A large unexplained movement inside the window invites the question even when the balance is fine."
        : "Either wait until the history is six months long, or document the source of the funds fully and expect it to be examined. Both are legitimate; only one of them is quick.",
      source: "Irish Immigration Service Delivery",
    });
  }

  checks.push({
    id: "tuition-upfront",
    group: "Money",
    title: "€6,000 of tuition paid before you apply",
    state: "not-met",
    reason:
      "This is cash out before the visa decision, not a balance to display, and it is what makes the Irish route the most front-loaded of our three.",
    action:
      "€6,000, or the full fee if it is lower, transferred to the institution and receipted before the application. Get the institution's refund position for a visa refusal in writing before you transfer.",
    source: "Irish Immigration Service Delivery",
  });

  checks.push({
    id: "insurance",
    group: "Process",
    title: "Private medical insurance",
    state: "not-met",
    reason:
      "A visa requirement rather than an optional extra, because Irish public healthcare is charged.",
    action:
      "A policy covering at least €25,000 for accident and €25,000 for disease, in force from your arrival date. Compare on cover and on the per-visit excess, not on the premium.",
    source: "Irish Immigration Service Delivery",
  });

  if (profile.irishLevel === undefined) {
    checks.push(
      unknown(
        "nfq",
        "Timing",
        "Your programme's NFQ level, which decides how long you can stay afterwards",
        "You have not told us whether the programme is Level 8 or Level 9.",
        "Level 9 or higher gets 12 months of Stamp 1G, renewable once for a further 12, so 24 at most. Level 8 gets 12 months with no renewal. If you are comparing two offers, that is a twelve month difference and it belongs in the comparison.",
        "Irish Immigration Service Delivery",
      ),
    );
  } else {
    checks.push({
      id: "nfq",
      group: "Timing",
      title: "Your programme's NFQ level, which decides how long you can stay afterwards",
      state: "met",
      reason:
        profile.irishLevel === 9
          ? "A Level 9 programme carries 12 months of Stamp 1G, renewable once for a further 12, so 24 at most."
          : "A Level 8 programme carries 12 months of Stamp 1G with no renewal.",
      action:
        profile.irishLevel === 9
          ? "The renewal is conditional, most importantly on evidence that you are genuinely seeking or have found graduate-level work."
          : "If a Level 9 offer is also available to you, it is worth twelve extra months of permission and that belongs in the comparison.",
      source: "Irish Immigration Service Delivery",
    });
  }

  checks.push({
    id: "stamp2",
    group: "Process",
    title: "Whether your course carries work rights at all",
    state: "unknown",
    reason: "Only programmes on the official eligible list attract Stamp 2, which is the stamp that permits work.",
    action:
      "A course outside that list carries Stamp 2A and permits no work whatsoever. Confirm which stamp your programme attracts before budgeting on part-time earnings.",
    source: "Irish Immigration Service Delivery",
  });

  return checks;
}

/** A count per state. Deliberately not a score, and never rendered as one. */
export function tally(results: CheckResult[]): Record<CheckState, number> {
  return {
    met: results.filter((item) => item.state === "met").length,
    "not-met": results.filter((item) => item.state === "not-met").length,
    unknown: results.filter((item) => item.state === "unknown").length,
  };
}
