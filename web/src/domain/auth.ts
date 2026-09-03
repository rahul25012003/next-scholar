import {
  createHmac,
  randomBytes,
  scryptSync,
  timingSafeEqual,
} from "node:crypto";
import type { Role } from "./rbac";

/**
 * Authentication mechanics: password hashing and session tokens.
 *
 * These are the real thing rather than a stand-in. Passwords are scrypt hashed
 * with a per-user salt and compared in constant time, and the session is a
 * signed token whose payload cannot be edited without invalidating it. What is
 * temporary is where the users live, not how they are checked, so moving to a
 * database changes `data/users.ts` and leaves this file alone.
 */

import type { OnboardingProfile } from "./onboarding";

export type AuthUser = {
  id: string;
  email: string;
  name: string;
  role: Role;
  /** scrypt hash as salt:derivedKey, both hex. Never the password itself. */
  passwordHash: string;
  caseId?: string;
  assignedCaseIds?: string[];
  createdAt: string;
  /**
   * What a student told us about themselves before a case existed. Held on the
   * account rather than on a case, because on the day someone signs up there is
   * no case to hold it, and an empty portal is the thing this replaces.
   */
  onboarding?: OnboardingProfile;
};

const KEY_LENGTH = 64;

export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const derived = scryptSync(password, salt, KEY_LENGTH).toString("hex");
  return `${salt}:${derived}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  const [salt, expected] = stored.split(":");
  if (!salt || !expected) return false;

  const derived = scryptSync(password, salt, KEY_LENGTH);
  const expectedBuffer = Buffer.from(expected, "hex");

  // Constant time, so a wrong password cannot be narrowed down by timing it.
  return (
    derived.length === expectedBuffer.length &&
    timingSafeEqual(derived, expectedBuffer)
  );
}

/**
 * The signing secret. A generated one is fine for local development, but it
 * changes on every restart, which logs everyone out. Production must set it.
 */
function sessionSecret(): string {
  const configured = process.env.SESSION_SECRET;
  if (configured && configured.length >= 32) return configured;

  if (process.env.NODE_ENV === "production") {
    throw new Error(
      "SESSION_SECRET must be set to at least 32 characters in production. Sessions are not signed without it.",
    );
  }

  globalThis.__nextScholarDevSecret ??= randomBytes(32).toString("hex");
  return globalThis.__nextScholarDevSecret;
}

declare global {
  var __nextScholarDevSecret: string | undefined;
}

export type SessionPayload = { sub: string; role: Role; exp: number };

export const SESSION_COOKIE = "next_scholar_session";
export const SESSION_MAX_AGE_SECONDS = 60 * 60 * 8;

const encode = (value: string) => Buffer.from(value).toString("base64url");
const decode = (value: string) => Buffer.from(value, "base64url").toString();

function sign(body: string): string {
  return createHmac("sha256", sessionSecret()).update(body).digest("base64url");
}

export function createSession(
  user: Pick<AuthUser, "id" | "role">,
  now = Date.now(),
): string {
  const payload: SessionPayload = {
    sub: user.id,
    role: user.role,
    exp: Math.floor(now / 1000) + SESSION_MAX_AGE_SECONDS,
  };
  const body = encode(JSON.stringify(payload));
  return `${body}.${sign(body)}`;
}

/**
 * Returns the payload only when the signature matches and the session has not
 * expired. An edited role, an edited subject, or a stale token all fail here
 * rather than somewhere further in.
 */
export function readSession(
  token: string | undefined,
  now = Date.now(),
): SessionPayload | null {
  if (!token) return null;

  const [body, signature] = token.split(".");
  if (!body || !signature) return null;

  const expected = sign(body);
  const given = Buffer.from(signature);
  const want = Buffer.from(expected);
  if (given.length !== want.length || !timingSafeEqual(given, want)) return null;

  try {
    const payload = JSON.parse(decode(body)) as SessionPayload;
    if (typeof payload.exp !== "number" || payload.exp * 1000 < now) return null;
    return payload;
  } catch {
    return null;
  }
}

/** Where each role lands after signing in. */
export const landingFor: Record<Role, string> = {
  student: "/portal",
  counselor: "/console",
  manager: "/ops",
  founder: "/ops",
};

export type PasswordCheck = { ok: true } | { ok: false; reason: string };

export function checkPasswordStrength(password: string): PasswordCheck {
  if (password.length < 10) {
    return { ok: false, reason: "Use at least 10 characters." };
  }
  if (!/[a-zA-Z]/.test(password) || !/[0-9]/.test(password)) {
    return { ok: false, reason: "Use at least one letter and one number." };
  }
  return { ok: true };
}

export function normaliseEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function isEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);
}
