import type { AgentDefinition, WritableField } from "./registry";

/**
 * The prohibitions from the registry, implemented as checks that run on every
 * agent output. A prompt asking a model to behave is not a control. These are.
 */

export type Violation = { rule: string; evidence: string };

const OUTCOME_WORDS =
  "(admission|admit|offer|visa|approval|approved|acceptance|refusal|rejected)";

const probabilityPatterns: { rule: string; pattern: RegExp }[] = [
  {
    rule: "No admission or visa probability, stated or implied",
    pattern: new RegExp(`\\b\\d{1,3}\\s?%[^.]{0,40}${OUTCOME_WORDS}`, "i"),
  },
  {
    rule: "No admission or visa probability, stated or implied",
    pattern: new RegExp(`${OUTCOME_WORDS}[^.]{0,40}\\b\\d{1,3}\\s?%`, "i"),
  },
  {
    rule: "No admission or visa probability, stated or implied",
    pattern: /\b(chances?|odds|probability|likelihood)\s+(of|are|is|for)\b/i,
  },
  {
    rule: "No guarantee of any outcome",
    pattern: /\b(guarantee|guaranteed|assured|certain to (get|be)|will definitely)\b/i,
  },
  {
    rule: "No predictive scoring of an outcome",
    pattern: new RegExp(`(highly |very |most )?likely to be ${OUTCOME_WORDS}`, "i"),
  },
];

const documentPatterns: { rule: string; pattern: RegExp }[] = [
  {
    rule: "No drafting of letters, certificates or statements on anyone's behalf",
    pattern: /\b(to whom it may concern|this is to certify|i hereby (certify|confirm|declare))\b/i,
  },
  {
    rule: "No drafting of letters, certificates or statements on anyone's behalf",
    pattern: /\b(dear sir|dear madam|yours (sincerely|faithfully))\b/i,
  },
  {
    rule: "No fabricated financial or source of funds figures",
    pattern: /\b(account balance|sufficient funds|source of funds)\b[^.]{0,60}(₹|rs\.?|inr|eur|€|gbp|£)\s?[\d,]/i,
  },
];

/**
 * Ghostwriting check for the coaching agent. Coaching output is questions and
 * structural feedback. First person narrative prose is the student's own voice
 * being written for them, which is the one thing this agent must never produce.
 */
export function findGhostwriting(text: string): Violation | null {
  const sentences = text
    .split(/(?<=[.!?])\s+/)
    .map((sentence) => sentence.trim())
    .filter(Boolean);

  const firstPersonNarrative = sentences.filter(
    (sentence) => /^(i|my|we|our)\b/i.test(sentence) && !sentence.endsWith("?"),
  );

  if (firstPersonNarrative.length >= 2) {
    return {
      rule: "Statement of purpose content is never drafted for the student",
      evidence: firstPersonNarrative.slice(0, 2).join(" "),
    };
  }
  return null;
}

export function findViolations(
  text: string,
  options: { coaching?: boolean } = {},
): Violation[] {
  const violations: Violation[] = [];

  for (const { rule, pattern } of [...probabilityPatterns, ...documentPatterns]) {
    const match = text.match(pattern);
    if (match) violations.push({ rule, evidence: match[0] });
  }

  if (options.coaching) {
    const ghostwritten = findGhostwriting(text);
    if (ghostwritten) violations.push(ghostwritten);
  }

  return violations;
}

/**
 * Drops any field the agent was not granted. An agent that returns a field
 * outside its capability set does not get a partial write, it gets a logged
 * violation and the field is discarded.
 */
export function filterWrites(
  agent: AgentDefinition,
  proposed: Record<string, unknown>,
): { accepted: Partial<Record<WritableField, unknown>>; rejected: string[] } {
  const accepted: Partial<Record<WritableField, unknown>> = {};
  const rejected: string[] = [];

  for (const [key, value] of Object.entries(proposed)) {
    if (agent.writes.includes(key as WritableField)) {
      accepted[key as WritableField] = value;
    } else {
      rejected.push(key);
    }
  }

  return { accepted, rejected };
}

/**
 * The input side of the rule. The anti fraud policy promises that document
 * contents, passport numbers and financial figures are never sent to a model,
 * and until now that promise lived in a system prompt and a line of helper text
 * under a textarea, which is not a control.
 *
 * A note that looks like it carries one of those is refused before the call is
 * made. The note itself is still saved: the human's words are never what gets
 * lost, only the machine reading of them.
 */
const sensitiveInputPatterns: { rule: string; pattern: RegExp }[] = [
  {
    rule: "A passport or document number does not go to a model",
    pattern: /\b[A-Z]{1,2}\d{6,8}\b/,
  },
  {
    rule: "A financial figure does not go to a model",
    pattern: /(₹|rs\.?|inr|eur|€|gbp|£|\$)\s?[\d,]{4,}/i,
  },
  {
    rule: "A long account or reference number does not go to a model",
    pattern: /\b\d{9,}\b/,
  },
];

export function findSensitiveInput(text: string): Violation | null {
  for (const { rule, pattern } of sensitiveInputPatterns) {
    const match = text.match(pattern);
    if (match) return { rule, evidence: match[0] };
  }
  return null;
}
