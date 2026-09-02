import "server-only";

import { z } from "zod";
import { runAgent, type AgentRun } from "./kernel";
import { daysSince, type StudentCase } from "../case";
import { documentPipelineReady } from "../uploads";

/**
 * The model backed agents. Each one gets the narrowest context that answers its
 * question, and none of them receive passport numbers, document contents or
 * financial figures. Situation descriptions only, matching the anti fraud
 * policy the platform publishes.
 */

const summarySchema = z.object({
  summary: z.string(),
  suggestedAction: z.string(),
});

export async function summariseCase(
  record: StudentCase,
): Promise<AgentRun<z.infer<typeof summarySchema>>> {
  const recentLog = record.log
    .slice(-8)
    .map((entry) => `${entry.ts} (${entry.source}): ${entry.text}`)
    .join("\n");

  return runAgent({
    agentId: "case-summary",
    system:
      "You brief a study abroad counselor on one case. Be specific and plain. " +
      "Never estimate the chance of an admission or a visa. Never state a requirement " +
      "that is not in the material you were given. If the log does not say something, do not fill it in.",
    prompt: [
      `Destination: ${record.destination}`,
      `Intake: ${record.intake}`,
      `Stage: ${record.stage}, unchanged for ${daysSince(record.stageUpdatedAt)} days`,
      `Document status: ${record.docStatus}`,
      "Recent log:",
      recentLog || "No log entries yet.",
      "",
      "Write a summary of two to four sentences, and one concrete next step under fifteen words.",
    ].join("\n"),
    schema: summarySchema,
    reviewFields: ["summary", "suggestedAction"],
    fallback: "No machine summary available. Read the case log below.",
    maxTokens: 400,
  });
}

const draftSchema = z.object({
  draft: z.string(),
  confidence: z.enum(["high", "medium", "low"]),
});

export async function draftReply(
  record: StudentCase,
  intent: string,
): Promise<AgentRun<z.infer<typeof draftSchema>>> {
  return runAgent({
    agentId: "counselor-copilot",
    system:
      "You draft a message for a counselor to edit and send themselves. You cannot send anything. " +
      "Never promise an outcome, never state a probability, never invent a deadline or a requirement. " +
      "If a fact is needed that you were not given, leave a clearly marked blank for the counselor to fill.",
    prompt: [
      `Case stage: ${record.stage}. Destination: ${record.destination}. Intake: ${record.intake}.`,
      `Counselor wants to: ${intent}`,
      "Write the draft in plain English, under 140 words.",
    ].join("\n"),
    schema: draftSchema,
    reviewFields: ["draft"],
    fallback: "No draft available. Write this one by hand.",
    maxTokens: 500,
  });
}

const guidanceSchema = z.object({
  answer: z.string(),
  basedOn: z.string(),
  routeToCounselor: z.boolean(),
});

export async function answerStudentQuestion(
  record: StudentCase,
  question: string,
): Promise<AgentRun<z.infer<typeof guidanceSchema>>> {
  return runAgent({
    agentId: "student-guidance",
    system:
      "You answer a student's question about their own application, using only the case facts below " +
      "and the published Next Scholar policies. You never state or imply a chance of admission or a visa. " +
      "You never discuss another student. If the answer is not in the material, set routeToCounselor to true " +
      "and say the counselor will answer. Always name what your answer is based on.",
    prompt: [
      `Their stage: ${record.stage}. Destination: ${record.destination}. Intake: ${record.intake}.`,
      `Document status: ${record.docStatus}.`,
      `Deadlines on file: ${
        record.deadlines.map((item) => `${item.label} on ${item.date}`).join("; ") || "none"
      }`,
      `Their question: ${question}`,
    ].join("\n"),
    schema: guidanceSchema,
    reviewFields: ["answer"],
    fallback: "Your counselor will answer this one. It has been added to their queue.",
    maxTokens: 500,
  });
}

const coachingSchema = z.object({
  questions: z.array(z.string()).min(2).max(5),
  structuralFeedback: z.string(),
});

export async function coachStatement(
  draftFromStudent: string,
): Promise<AgentRun<z.infer<typeof coachingSchema>>> {
  return runAgent({
    agentId: "sop-coach",
    system:
      "You coach a student writing their own statement of purpose. You ask questions and comment on " +
      "structure. You never write sentences for them to use, never write in the first person, and never " +
      "produce a paragraph they could paste. If they ask you to write it, decline and ask a better question instead.",
    prompt: [
      "The student's current draft, for you to respond to with questions and structural feedback only:",
      draftFromStudent.slice(0, 4000),
    ].join("\n"),
    schema: coachingSchema,
    reviewFields: ["structuralFeedback"],
    fallback:
      "Coaching is unavailable right now. Your counselor reviews the statement before submission either way.",
    maxTokens: 600,
    coaching: true,
  });
}

const threadSchema = z.object({
  line: z.string(),
});

export async function summariseThread(
  thread: string,
  date: string,
): Promise<AgentRun<z.infer<typeof threadSchema>>> {
  return runAgent({
    agentId: "communication-summary",
    system:
      "You condense one conversation into a single dated history line. Keep it factual. " +
      "If the thread is unclear, say so rather than inventing what was meant.",
    prompt: `Date: ${date}\nThread:\n${thread.slice(0, 4000)}`,
    schema: threadSchema,
    reviewFields: ["line"],
    fallback: "Summary unavailable. See the raw thread.",
    maxTokens: 200,
  });
}

const extractionSchema = z.object({
  fields: z.array(
    z.object({
      name: z.string(),
      value: z.string(),
      confidence: z.enum(["high", "medium", "low"]),
    }),
  ),
  unreadable: z.boolean(),
  note: z.string(),
});

/**
 * Document Intelligence. Everything it produces lands in a staging area marked
 * pending verification, and a named person has to confirm each value before it
 * becomes authoritative anywhere.
 *
 * It refuses to run at all unless the document actually came through the upload
 * pipeline, because the alternative is a model reading text that was pasted in
 * from somewhere nobody checked.
 */
export async function extractFromDocument(
  documentId: string,
  documentText: string,
): Promise<AgentRun<z.infer<typeof extractionSchema>>> {
  if (!documentPipelineReady()) {
    return {
      status: "unavailable",
      agent: "document-intelligence",
      reason:
        "No scanned document storage is connected, so there is no stored document to read. Extraction does not run on pasted text.",
      fallback: "Enter the values by hand. The document stays exactly as uploaded.",
    };
  }

  return runAgent({
    agentId: "document-intelligence",
    system:
      "You read one uploaded document and report the fields you can actually see in it. " +
      "Give a confidence for each. If a field is not present, leave it out rather than inferring it. " +
      "You are not verifying anything and you cannot mark anything verified. A person checks every value you return.",
    prompt: `Document reference ${documentId}. Content:\n${documentText.slice(0, 8000)}`,
    schema: extractionSchema,
    reviewFields: ["note"],
    fallback: "Manual entry required. The document is stored and unchanged.",
    maxTokens: 800,
  });
}
