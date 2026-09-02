import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  checkPasswordStrength,
  createSession,
  hashPassword,
  isEmail,
  landingFor,
  normaliseEmail,
  readSession,
  verifyPassword,
  SESSION_MAX_AGE_SECONDS,
} from "@/domain/auth";
import { authenticate, findByEmail, register, toActor } from "@/data/users";
import { proxy } from "@/proxy";
import { NextRequest } from "next/server";

/**
 * The authentication mechanics, tested as attempts to get past them.
 *
 * A login is only worth having if a forged session fails, an edited role fails,
 * an expired token fails, and a wrong password is indistinguishable from an
 * unknown address. Each of those is an attack here rather than a description.
 */

beforeEach(() => {
  vi.stubEnv("SESSION_SECRET", "test-secret-that-is-long-enough-to-sign-with");
});

describe("passwords are hashed, never stored", () => {
  it("never keeps the password itself", () => {
    const hash = hashPassword("correct horse battery 9");
    expect(hash).not.toContain("correct horse battery 9");
    expect(hash.split(":")).toHaveLength(2);
  });

  it("produces a different hash each time for the same password", () => {
    expect(hashPassword("same-password-1")).not.toBe(hashPassword("same-password-1"));
  });

  it("accepts the right password and rejects a wrong one", () => {
    const hash = hashPassword("correct horse battery 9");
    expect(verifyPassword("correct horse battery 9", hash)).toBe(true);
    expect(verifyPassword("correct horse battery 8", hash)).toBe(false);
    expect(verifyPassword("", hash)).toBe(false);
  });

  it("does not fall over on a malformed stored hash", () => {
    expect(verifyPassword("anything", "not-a-hash")).toBe(false);
    expect(verifyPassword("anything", "")).toBe(false);
  });

  it("holds a floor on password strength", () => {
    expect(checkPasswordStrength("short1").ok).toBe(false);
    expect(checkPasswordStrength("alllettersnodigits").ok).toBe(false);
    expect(checkPasswordStrength("longenough1").ok).toBe(true);
  });
});

describe("a session cannot be forged or edited", () => {
  const user = { id: "user-student-1", role: "student" as const };

  it("round trips a valid session", () => {
    const payload = readSession(createSession(user));
    expect(payload?.sub).toBe("user-student-1");
    expect(payload?.role).toBe("student");
  });

  it("rejects a token with an edited payload", () => {
    const token = createSession(user);
    const [body, signature] = token.split(".");
    const tampered = Buffer.from(
      JSON.stringify({ sub: "user-founder-1", role: "founder", exp: 9999999999 }),
    ).toString("base64url");

    expect(readSession(`${tampered}.${signature}`)).toBeNull();
    expect(body).not.toBe(tampered);
  });

  it("rejects a token with an edited signature", () => {
    const [body] = createSession(user).split(".");
    expect(readSession(`${body}.not-the-real-signature`)).toBeNull();
  });

  it("rejects a token signed with a different secret", () => {
    const token = createSession(user);
    vi.stubEnv("SESSION_SECRET", "a-completely-different-secret-of-length");
    expect(readSession(token)).toBeNull();
  });

  it("rejects an expired token", () => {
    const issued = Date.now() - (SESSION_MAX_AGE_SECONDS + 60) * 1000;
    expect(readSession(createSession(user, issued))).toBeNull();
  });

  it("rejects nonsense", () => {
    expect(readSession(undefined)).toBeNull();
    expect(readSession("")).toBeNull();
    expect(readSession("no-dot")).toBeNull();
    expect(readSession("...")).toBeNull();
  });
});

describe("signing in", () => {
  it("refuses a wrong password", () => {
    expect(authenticate("rohini@example.in", "definitely-not-it")).toBeNull();
  });

  it("refuses an unknown address the same way", () => {
    expect(authenticate("nobody@example.in", "next-scholar-dev-1")).toBeNull();
  });

  it("accepts a seeded account and carries its caseload onto the actor", () => {
    const user = authenticate("rohini@example.in", "next-scholar-dev-1");
    expect(user).not.toBeNull();

    const actor = toActor(user!);
    expect(actor.role).toBe("counselor");
    expect(actor.assignedCaseIds).toEqual(["case-1041", "case-1042"]);
  });

  it("treats the address case insensitively", () => {
    expect(authenticate("ROHINI@Example.IN", "next-scholar-dev-1")).not.toBeNull();
    expect(normaliseEmail("  Foo@Bar.COM ")).toBe("foo@bar.com");
  });

  it("sends each role to its own surface", () => {
    expect(landingFor.student).toBe("/portal");
    expect(landingFor.counselor).toBe("/console");
    expect(landingFor.founder).toBe("/ops");
  });
});

describe("signing up", () => {
  it("creates a student, never a member of staff", () => {
    const result = register({
      name: "Nivedita Rao",
      email: "nivedita@example.in",
      password: "a-good-password-1",
    });

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.user.role).toBe("student");
      expect(result.user.passwordHash).not.toContain("a-good-password-1");
    }
  });

  it("refuses a duplicate address", () => {
    register({ name: "First", email: "dup@example.in", password: "a-good-password-1" });
    const second = register({
      name: "Second",
      email: "DUP@example.in",
      password: "a-good-password-1",
    });

    expect(second.ok).toBe(false);
  });

  it("lets the new account sign in immediately", () => {
    register({ name: "Arjun Nair", email: "arjun@example.in", password: "a-good-password-1" });
    expect(authenticate("arjun@example.in", "a-good-password-1")).not.toBeNull();
    expect(findByEmail("arjun@example.in")?.role).toBe("student");
  });

  it("validates the address shape", () => {
    expect(isEmail("someone@example.in")).toBe(true);
    expect(isEmail("someone@example")).toBe(false);
    expect(isEmail("not an email")).toBe(false);
  });
});

describe("the route guard", () => {
  const request = (path: string, token?: string) => {
    const req = new NextRequest(`http://localhost:3200${path}`);
    if (token) req.cookies.set("next_scholar_session", token);
    return req;
  };

  it("sends an unauthenticated visitor to sign in, remembering where they were", () => {
    const response = proxy(request("/console"));
    const location = response.headers.get("location")!;

    expect(location).toContain("/login");
    expect(location).toContain("next=%2Fconsole");
  });

  it("guards every authenticated surface", () => {
    for (const path of ["/portal", "/console", "/ops", "/console/case-1041"]) {
      expect(proxy(request(path)).headers.get("location")).toContain("/login");
    }
  });

  it("lets a valid session through", () => {
    const token = createSession({ id: "user-student-1", role: "student" });
    expect(proxy(request("/portal", token)).headers.get("location")).toBeNull();
  });

  it("refuses a forged session at the door", () => {
    const forged = Buffer.from(
      JSON.stringify({ sub: "user-founder-1", role: "founder", exp: 9999999999 }),
    ).toString("base64url");

    const response = proxy(request("/ops", `${forged}.forged`));
    expect(response.headers.get("location")).toContain("/login");
  });

  it("sends a signed in visitor away from the sign in page", () => {
    const token = createSession({ id: "user-founder-1", role: "founder" });
    expect(proxy(request("/login", token)).headers.get("location")).toContain("/ops");
  });
});
