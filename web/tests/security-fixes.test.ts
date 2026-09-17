import { afterEach, describe, expect, it, vi } from "vitest";
import type { Actor } from "@/domain/rbac";
import { demoCounselor, demoStudent } from "@/domain/demo-actors";

/**
 * Server actions and the sweep route, attacked through their real entry points.
 * Each case here is an id or a header a signed-in or anonymous caller controls.
 */

let actor: Actor | null = null;

vi.mock("@/domain/session", () => ({ currentActor: async () => actor }));
vi.mock("next/cache", () => ({ revalidatePath: () => {} }));
vi.mock("@/domain/agents/implementations", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@/domain/agents/implementations")>()),
  summariseThread: async () => ({ status: "ok", data: { line: "2025-01-01: thread contents" } }),
}));

const karthik: Actor = {
  id: "user-counselor-2",
  name: "Karthik Menon",
  role: "counselor",
  assignedCaseIds: ["case-1043", "case-1044"],
};

const form = (fields: Record<string, string>) => {
  const data = new FormData();
  for (const [key, value] of Object.entries(fields)) data.set(key, value);
  return data;
};

afterEach(() => {
  vi.unstubAllEnvs();
  actor = null;
});

describe("actions scope the record named in the form", () => {
  it("refuses a student withdrawing another case's consent", async () => {
    const { withdrawConsentAction } = await import("@/app/actions/case");
    const { listConsents } = await import("@/data/store");

    actor = demoStudent;
    const other = await withdrawConsentAction({ status: "idle" }, form({ consentId: "consent-5" }));
    expect(other.status).toBe("error");
    const theirs = await listConsents("case-1042", demoCounselor);
    expect(theirs.find((consent) => consent.id === "consent-5")?.withdrawnAt).toBeNull();

    const own = await withdrawConsentAction({ status: "idle" }, form({ consentId: "consent-1" }));
    expect(own.status).toBe("withdrawn");
  });

  it("refuses summarising a thread outside the caller's caseload", async () => {
    const { summariseCommunication } = await import("@/app/actions/case-workflows");

    actor = demoStudent;
    const student = await summariseCommunication({ status: "idle" }, form({ communicationId: "comm-1" }));
    expect(student.status).toBe("unavailable");

    actor = karthik;
    const outside = await summariseCommunication({ status: "idle" }, form({ communicationId: "comm-5" }));
    expect(outside).toEqual({ status: "unavailable", message: "That thread is not on file." });

    actor = demoCounselor;
    const assigned = await summariseCommunication({ status: "idle" }, form({ communicationId: "comm-5" }));
    expect(assigned.status).toBe("done");
  });

  it("does not report a refused correction as made", async () => {
    const { correct } = await import("@/app/actions/case-workflows");
    actor = demoCounselor;
    const base = { caseId: "case-1041", reason: "Checked against the letter" };

    const refused = await correct({ status: "idle" }, form({ ...base, field: "priority", value: "high" }));
    expect(refused.status).toBe("error");

    const made = await correct({ status: "idle" }, form({ ...base, field: "priority", value: "High" }));
    expect(made.status).toBe("done");
  });
});

describe("the sweep accepts Vercel Cron's bearer token", () => {
  let ip = 0;
  const call = async (headers: Record<string, string>) => {
    const { GET } = await import("@/app/api/sweep/route");
    ip += 1;
    return GET(
      new Request("http://localhost/api/sweep", {
        headers: { "x-forwarded-for": `203.0.113.${ip}`, ...headers },
      }),
    );
  };

  it("runs on the right bearer and refuses a wrong one", async () => {
    vi.stubEnv("CRON_SECRET", "cron-secret-value");
    expect((await call({ authorization: "Bearer cron-secret-value" })).status).toBe(200);
    expect((await call({ authorization: "Bearer cron-secret-valu" })).status).toBe(401);
    expect((await call({ authorization: "Bearer wrong" })).status).toBe(401);
    expect((await call({})).status).toBe(401);
  });

  it("still honours SWEEP_SECRET, by bearer or by the manual header", async () => {
    vi.stubEnv("SWEEP_SECRET", "sweep-secret-value");
    expect((await call({ authorization: "Bearer sweep-secret-value" })).status).toBe(200);
    expect((await call({ "x-sweep-secret": "sweep-secret-value" })).status).toBe(200);
  });

  it("fails closed in production with no secret configured", async () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("CRON_SECRET", "");
    vi.stubEnv("SWEEP_SECRET", "");
    expect((await call({ authorization: "Bearer " })).status).toBe(503);
  });
});

describe("seeded accounts in a production build", () => {
  const founderWith = async (password: string) => {
    vi.resetModules();
    const { authenticate } = await import("@/data/users");
    return authenticate("founder@example.in", password);
  };

  it("exist only with demo data on and a password set on purpose", async () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("SESSION_SECRET", "test-secret-that-is-long-enough-to-sign-with");

    vi.stubEnv("SEED_ACCOUNT_PASSWORD", "chosen-password-1");
    expect(await founderWith("chosen-password-1")).toBeNull();

    vi.stubEnv("NEXT_SCHOLAR_DEMO_DATA", "true");
    vi.stubEnv("SEED_ACCOUNT_PASSWORD", "");
    expect(await founderWith("next-scholar-dev-1")).toBeNull();
    expect(await founderWith("")).toBeNull();

    vi.stubEnv("SEED_ACCOUNT_PASSWORD", "chosen-password-1");
    expect((await founderWith("chosen-password-1"))?.role).toBe("founder");
    expect(await founderWith("next-scholar-dev-1")).toBeNull();
  });
});
