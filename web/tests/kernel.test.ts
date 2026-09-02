import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { z } from "zod";

/**
 * Tests for the agent kernel itself, with the model mocked.
 *
 * The guard regexes were already tested in isolation, and that isolation is
 * exactly how a real bug survived: `filterWrites` passed its unit test while the
 * kernel computed its result and returned the unfiltered output anyway. These
 * tests drive the whole path, so the control has to actually be wired to pass.
 */

const parse = vi.fn();

vi.mock("@anthropic-ai/sdk", () => {
  class APIError extends Error {
    status = 500;
  }
  class Anthropic {
    messages = { parse };
    static APIError = APIError;
  }
  return { default: Anthropic, APIError };
});

vi.mock("@anthropic-ai/sdk/helpers/zod", () => ({
  zodOutputFormat: (schema: unknown) => schema,
}));

const okResponse = (parsed_output: unknown) => ({
  stop_reason: "end_turn",
  parsed_output,
});

let runAgent: typeof import("@/domain/agents/kernel").runAgent;
let resetAudit: typeof import("@/domain/audit").resetAudit;
let recentAudit: typeof import("@/domain/audit").recentAudit;

beforeEach(async () => {
  vi.stubEnv("ANTHROPIC_API_KEY", "test-key-not-real");
  vi.resetModules();
  parse.mockReset();
  ({ runAgent } = await import("@/domain/agents/kernel"));
  ({ resetAudit, recentAudit } = await import("@/domain/audit"));
  resetAudit();
});

afterEach(() => {
  vi.unstubAllEnvs();
});

const summarySchema = z.object({
  summary: z.string(),
  suggestedAction: z.string(),
});

const run = (extra: Record<string, unknown> = {}) =>
  runAgent({
    agentId: "case-summary",
    system: "system",
    prompt: "prompt",
    schema: summarySchema,
    reviewFields: ["summary", "suggestedAction"],
    fallback: "No machine summary available.",
    subjectId: "case-1041",
    ...extra,
  });

describe("the capability filter actually filters", () => {
  it("returns the output when every key is one the agent was granted", async () => {
    parse.mockResolvedValue(
      okResponse({
        summary: "Passport renewal is the blocker.",
        suggestedAction: "Chase the appointment date.",
      }),
    );

    const result = await run();
    expect(result.status).toBe("ok");
    if (result.status === "ok") {
      expect(Object.keys(result.data).sort()).toEqual(["suggestedAction", "summary"]);
      expect(result.source).toBe("ai");
    }
  });

  it("refuses the whole output when the agent returns a field it was never granted", async () => {
    parse.mockResolvedValue(
      okResponse({
        summary: "Passport renewal is the blocker.",
        suggestedAction: "Chase the appointment date.",
        docStatus: "Verified",
        priority: "Urgent",
      }),
    );

    const result = await run();

    expect(result.status).toBe("blocked");
    if (result.status === "blocked") {
      expect(result.violations[0].rule).toContain("only return the fields it was granted");
      expect(result.violations[0].evidence).toContain("docStatus");
      expect(result.violations[0].evidence).toContain("priority");
    }
  });

  it("writes the refusal to the audit trail against the agent", async () => {
    parse.mockResolvedValue(
      okResponse({ summary: "x", suggestedAction: "y", stage: "visa" }),
    );

    await run();
    const entry = recentAudit()[0];

    expect(entry.action).toBe("agent-blocked");
    expect(entry.actorRole).toBe("agent");
    expect(entry.subjectId).toBe("case-1041");
    expect(entry.note).toContain("stage");
  });

  it("does not leak the rejected value through in the returned data", async () => {
    parse.mockResolvedValue(
      okResponse({ summary: "x", suggestedAction: "y", docStatus: "Verified" }),
    );

    const result = await run();
    expect(JSON.stringify(result)).not.toContain("Verified");
  });
});

describe("prohibitions are checked before the output is accepted", () => {
  it("blocks a probability claim in a real response", async () => {
    parse.mockResolvedValue(
      okResponse({
        summary: "Strong profile, visa approval is around 90% for this route.",
        suggestedAction: "Proceed to applications.",
      }),
    );

    const result = await run();
    expect(result.status).toBe("blocked");
  });

  it("blocks a guarantee in a real response", async () => {
    parse.mockResolvedValue(
      okResponse({
        summary: "We can guarantee an offer here.",
        suggestedAction: "Submit this week.",
      }),
    );

    expect((await run()).status).toBe("blocked");
  });

  it("blocks ghostwritten prose when the run is a coaching run", async () => {
    const coachingSchema = z.object({
      questions: z.array(z.string()),
      structuralFeedback: z.string(),
    });

    parse.mockResolvedValue(
      okResponse({
        questions: ["What did the project solve?"],
        structuralFeedback:
          "I have always been fascinated by mechanical systems. My final year project deepened that interest.",
      }),
    );

    const result = await runAgent({
      agentId: "sop-coach",
      system: "system",
      prompt: "prompt",
      schema: coachingSchema,
      reviewFields: ["structuralFeedback"],
      fallback: "Coaching unavailable.",
      coaching: true,
    });

    expect(result.status).toBe("blocked");
  });
});

describe("failure returns a stated fallback, never a guess", () => {
  it("reports the model declining", async () => {
    parse.mockResolvedValue({ stop_reason: "refusal", parsed_output: null });

    const result = await run();
    expect(result.status).toBe("unavailable");
    if (result.status === "unavailable") {
      expect(result.reason).toContain("declined");
      expect(result.fallback).toBe("No machine summary available.");
    }
  });

  it("reports output that did not match the shape", async () => {
    parse.mockResolvedValue({ stop_reason: "end_turn", parsed_output: null });

    const result = await run();
    expect(result.status).toBe("unavailable");
    if (result.status === "unavailable") {
      expect(result.reason).toContain("did not match");
    }
  });

  it("reports a thrown API error without inventing an answer", async () => {
    parse.mockRejectedValue(new Error("socket hang up"));

    const result = await run();
    expect(result.status).toBe("unavailable");
    if (result.status === "unavailable") {
      expect(result.fallback).toBe("No machine summary available.");
    }
  });

  it("runs nothing at all when there is no API key", async () => {
    vi.stubEnv("ANTHROPIC_API_KEY", "");
    vi.resetModules();
    const { runAgent: fresh } = await import("@/domain/agents/kernel");

    const result = await fresh({
      agentId: "case-summary",
      system: "s",
      prompt: "p",
      schema: summarySchema,
      reviewFields: ["summary"],
      fallback: "No machine summary available.",
    });

    expect(result.status).toBe("unavailable");
    expect(parse).not.toHaveBeenCalled();
  });
});
