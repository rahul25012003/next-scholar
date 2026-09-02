import "server-only";

import Anthropic from "@anthropic-ai/sdk";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import type { z } from "zod";
import { agentById, type AgentDefinition, type AgentId } from "./registry";
import { filterWrites, findViolations, type Violation } from "./guards";

const MODEL = process.env.NEXT_SCHOLAR_AGENT_MODEL ?? "claude-opus-5";

let client: Anthropic | null = null;

function getClient(): Anthropic | null {
  if (!process.env.ANTHROPIC_API_KEY) return null;
  client ??= new Anthropic();
  return client;
}

export type AgentRun<T> =
  | {
      status: "ok";
      agent: AgentId;
      data: T;
      /** Always set. No agent output is ever presented as a human decision. */
      source: "ai";
      requiresHumanReview: boolean;
      rejectedFields: string[];
    }
  | {
      status: "unavailable";
      agent: AgentId;
      reason: string;
      /** What the interface shows instead. Never a guess. */
      fallback: string;
    }
  | {
      status: "blocked";
      agent: AgentId;
      violations: Violation[];
      fallback: string;
    };

type RunOptions<S extends z.ZodType> = {
  agentId: AgentId;
  system: string;
  prompt: string;
  schema: S;
  /** Text fields on the parsed output that the prohibition checks run over. */
  reviewFields: (keyof z.infer<S> & string)[];
  fallback: string;
  maxTokens?: number;
  coaching?: boolean;
};

/**
 * Every agent call goes through here. The order matters: the model is called,
 * the output is validated against a schema, checked against the prohibitions,
 * and only then filtered down to the fields the agent is allowed to write.
 *
 * A failure at any step returns a stated fallback. It never returns an
 * approximation of what the answer might have been.
 */
export async function runAgent<S extends z.ZodType>(
  options: RunOptions<S>,
): Promise<AgentRun<z.infer<S>>> {
  const agent = agentById.get(options.agentId);
  if (!agent) throw new Error(`Unknown agent ${options.agentId}`);

  const anthropic = getClient();
  if (!anthropic) {
    return {
      status: "unavailable",
      agent: agent.id,
      reason:
        "ANTHROPIC_API_KEY is not set, so no agent runs. Nothing has been guessed in its place.",
      fallback: options.fallback,
    };
  }

  let parsed: z.infer<S>;
  try {
    const response = await anthropic.messages.parse({
      model: MODEL,
      max_tokens: options.maxTokens ?? 1024,
      system: options.system,
      messages: [{ role: "user", content: options.prompt }],
      output_config: { format: zodOutputFormat(options.schema) },
    });

    if (response.stop_reason === "refusal") {
      return {
        status: "unavailable",
        agent: agent.id,
        reason: "The model declined this request.",
        fallback: options.fallback,
      };
    }

    if (!response.parsed_output) {
      return {
        status: "unavailable",
        agent: agent.id,
        reason: "The model returned output that did not match the expected shape.",
        fallback: options.fallback,
      };
    }

    parsed = response.parsed_output as z.infer<S>;
  } catch (error) {
    return {
      status: "unavailable",
      agent: agent.id,
      reason:
        error instanceof Anthropic.APIError
          ? `Claude API error ${error.status}.`
          : "The agent call failed.",
      fallback: options.fallback,
    };
  }

  const reviewText = options.reviewFields
    .map((field) => String((parsed as Record<string, unknown>)[field] ?? ""))
    .join("\n");

  const violations = findViolations(reviewText, { coaching: options.coaching });
  if (violations.length > 0) {
    return {
      status: "blocked",
      agent: agent.id,
      violations,
      fallback: options.fallback,
    };
  }

  const { rejected } = filterWrites(
    agent,
    parsed as Record<string, unknown>,
  );

  return {
    status: "ok",
    agent: agent.id,
    data: parsed,
    source: "ai",
    requiresHumanReview: agent.requiresHumanReview,
    rejectedFields: rejected,
  };
}

export function agentAvailability(): {
  configured: boolean;
  model: string;
  note: string;
} {
  return {
    configured: Boolean(process.env.ANTHROPIC_API_KEY),
    model: MODEL,
    note: process.env.ANTHROPIC_API_KEY
      ? "Model backed agents are live. Every output is labelled and every gated output waits for a named person."
      : "ANTHROPIC_API_KEY is not set. Model backed agents return their stated fallback instead of running. The rule based agents are unaffected.",
  };
}

export type { AgentDefinition };
