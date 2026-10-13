import { afterEach, describe, expect, it, vi } from "vitest";
import type { Actor } from "@/domain/rbac";
import { demoCounselor, demoStudent } from "@/domain/demo-actors";

/**
 * When the student assistant cannot answer, it tells the student their
 * counsellor will. These check that the promise is kept: the question is on
 * the case for the counsellor to read, and a personal detail never reaches a
 * model on the way.
 */

let actor: Actor | null = null;
const asked: string[] = [];

vi.mock("@/domain/session", () => ({ currentActor: async () => actor }));
vi.mock("next/cache", () => ({ revalidatePath: () => {} }));
vi.mock("@/domain/agents/implementations", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@/domain/agents/implementations")>()),
  answerStudentQuestion: async (_record: unknown, question: string) => {
    asked.push(question);
    return { status: "ok", data: { answer: "", basedOn: "", routeToCounselor: true } };
  },
}));

const form = (question: string) => {
  const data = new FormData();
  data.set("question", question);
  return data;
};

afterEach(() => {
  actor = null;
  asked.length = 0;
});

describe("a question the assistant routes to a person", () => {
  it("is saved on the student's case, where the counsellor reads it", async () => {
    const { askGuidance } = await import("@/app/actions/student");
    const { getCase } = await import("@/data/store");
    actor = demoStudent;

    const result = await askGuidance({ status: "idle" }, form("Can I defer my intake by a year?"));

    expect(result.status).toBe("routed");
    expect(result.status === "routed" && result.message).toContain("saved on your case");
    const record = await getCase("case-1041", demoCounselor);
    expect(record?.log.some((entry) => entry.text.includes("Can I defer my intake by a year?"))).toBe(true);
  });

  it("keeps a personal detail away from the model, and still saves it for the counsellor", async () => {
    const { askGuidance } = await import("@/app/actions/student");
    actor = demoStudent;

    const result = await askGuidance(
      { status: "idle" },
      form("My passport number is K1234567, is that enough for the visa?"),
    );

    expect(asked).toHaveLength(0);
    expect(result.status === "routed" && result.message).toContain("not sent to the assistant");
    expect(result.status === "routed" && result.message).toContain("saved on your case");
  });
});
