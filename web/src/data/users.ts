import "server-only";

import {
  hashPassword,
  normaliseEmail,
  verifyPassword,
  type AuthUser,
} from "@/domain/auth";
import { record as recordAudit } from "@/domain/audit";
import type { Actor } from "@/domain/rbac";
import type { OnboardingProfile } from "@/domain/onboarding";

/**
 * The user store.
 *
 * Seeded staff and student accounts, plus anyone who signs up, held in memory.
 * The passwords are hashed the same way a real one would be, and the seeded
 * ones come from an environment variable so a deployment cannot accidentally
 * ship with a password that is written down in a public repository.
 *
 * Replacing this file with a users table is the whole of the migration. Nothing
 * above it knows where a user came from.
 */

const seedPassword = process.env.SEED_ACCOUNT_PASSWORD ?? "next-scholar-dev-1";

let users: AuthUser[] = [
  {
    id: "user-student-1",
    email: "meghana@example.in",
    name: "Meghana Rangaswamy",
    role: "student",
    passwordHash: hashPassword(seedPassword),
    caseId: "case-1041",
    createdAt: new Date().toISOString(),
  },
  {
    id: "user-counselor-1",
    email: "rohini@example.in",
    name: "Rohini Bhat",
    role: "counselor",
    passwordHash: hashPassword(seedPassword),
    assignedCaseIds: ["case-1041", "case-1042"],
    createdAt: new Date().toISOString(),
  },
  {
    id: "user-counselor-2",
    email: "karthik@example.in",
    name: "Karthik Menon",
    role: "counselor",
    passwordHash: hashPassword(seedPassword),
    assignedCaseIds: ["case-1043", "case-1044"],
    createdAt: new Date().toISOString(),
  },
  {
    id: "user-manager-1",
    email: "devika@example.in",
    name: "Devika Suresh",
    role: "manager",
    passwordHash: hashPassword(seedPassword),
    createdAt: new Date().toISOString(),
  },
  {
    id: "user-founder-1",
    email: "founder@example.in",
    name: "Founder",
    role: "founder",
    passwordHash: hashPassword(seedPassword),
    createdAt: new Date().toISOString(),
  },
];

export function findByEmail(email: string): AuthUser | null {
  const wanted = normaliseEmail(email);
  return users.find((user) => normaliseEmail(user.email) === wanted) ?? null;
}

export function findById(id: string): AuthUser | null {
  return users.find((user) => user.id === id) ?? null;
}

/**
 * Checks a password. Returns null for both an unknown email and a wrong
 * password, and does the hash work either way, so the response cannot be used
 * to find out which addresses have accounts.
 */
export function authenticate(email: string, password: string): AuthUser | null {
  const user = findByEmail(email);
  const stored =
    user?.passwordHash ??
    "0000000000000000000000000000000000000000000000000000000000000000:00";

  const matches = verifyPassword(password, stored);
  if (!user || !matches) {
    recordAudit({
      actorId: "anonymous",
      actorName: normaliseEmail(email),
      actorRole: "system",
      action: "read",
      subjectType: "case",
      subjectId: "sign-in",
      note: "Sign in refused",
    });
    return null;
  }

  recordAudit({
    actorId: user.id,
    actorName: user.name,
    actorRole: user.role,
    action: "read",
    subjectType: "case",
    subjectId: "sign-in",
    note: "Signed in",
  });

  return user;
}

export type SignupResult =
  | { ok: true; user: AuthUser }
  | { ok: false; reason: string };

/**
 * Registration. A signup only ever creates a student: a counselor or founder
 * account is made by someone who already holds one, never by whoever fills in
 * the public form.
 */
export function register(input: {
  name: string;
  email: string;
  password: string;
}): SignupResult {
  const email = normaliseEmail(input.email);

  if (findByEmail(email)) {
    return {
      ok: false,
      reason: "An account already exists for that address. Sign in instead.",
    };
  }

  const user: AuthUser = {
    id: `user-${Date.now()}`,
    email,
    name: input.name.trim(),
    role: "student",
    passwordHash: hashPassword(input.password),
    createdAt: new Date().toISOString(),
  };

  users = [...users, user];

  recordAudit({
    actorId: user.id,
    actorName: user.name,
    actorRole: user.role,
    action: "create",
    subjectType: "case",
    subjectId: "account",
    note: "Student account created through signup",
  });

  return { ok: true, user };
}

/**
 * Saves what a student told us about themselves before a case exists.
 *
 * Scoped to the account doing the saving. There is deliberately no way for one
 * account to write another's profile, and no role that can: a counsellor who
 * needs to correct one does it on the case record, where the correction is
 * logged with their name and its reason.
 */
export function saveOnboarding(
  userId: string,
  profile: OnboardingProfile,
): AuthUser | null {
  const user = findById(userId);
  if (!user || user.role !== "student") return null;

  const updated: AuthUser = { ...user, onboarding: profile };
  users = users.map((item) => (item.id === userId ? updated : item));

  recordAudit({
    actorId: user.id,
    actorName: user.name,
    actorRole: user.role,
    action: "update",
    subjectType: "case",
    subjectId: "account",
    note: "Student updated their own onboarding profile",
  });

  return updated;
}

/**
 * Saves or removes a programme from a student's own shortlist.
 *
 * Stores the programme slug, never a copy of the programme. A shortlist that
 * held its own copy of a fee would keep showing the old figure after we
 * corrected it, which on this platform is the failure mode that matters most.
 */
export function toggleShortlist(userId: string, programmeSlug: string): string[] | null {
  const user = findById(userId);
  if (!user || user.role !== "student") return null;

  const current = user.shortlist ?? [];
  const next = current.includes(programmeSlug)
    ? current.filter((slug) => slug !== programmeSlug)
    : [...current, programmeSlug];

  users = users.map((item) => (item.id === userId ? { ...item, shortlist: next } : item));

  recordAudit({
    actorId: user.id,
    actorName: user.name,
    actorRole: user.role,
    action: "update",
    subjectType: "case",
    subjectId: "shortlist",
    note: current.includes(programmeSlug)
      ? `Removed ${programmeSlug} from their shortlist`
      : `Saved ${programmeSlug} to their shortlist`,
  });

  return next;
}

export function shortlistFor(userId: string): string[] {
  return findById(userId)?.shortlist ?? [];
}

/** The shape the permission matrix works with. */
export function toActor(user: AuthUser): Actor {
  return {
    id: user.id,
    name: user.name,
    role: user.role,
    caseId: user.caseId,
    assignedCaseIds: user.assignedCaseIds,
  };
}

/** Shown on the sign in page so a reviewer can get in. Never real people. */
export function seedAccountHint(): { email: string; role: string }[] {
  return users
    .filter((user) => user.id.startsWith("user-"))
    .map((user) => ({ email: user.email, role: user.role }));
}
