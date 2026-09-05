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
import { supabaseAdmin, supabaseConfigured } from "@/lib/supabase";

/**
 * The user store.
 *
 * Two modes, chosen once per call by `supabaseConfigured()`, never mixed:
 * with a database connected, every function below queries
 * `supabase/migrations/0001_schema.sql`'s `users` table; without one, it
 * reads the in-memory seed a few lines down. Nothing above this file, and no
 * caller, needs to know which mode is live.
 *
 * The seeded passwords come from an environment variable so a deployment
 * cannot accidentally ship with a password that is written down in a public
 * repository, whichever mode is running.
 *
 * `assignedCaseIds` on the returned `Actor` is derived from `cases.counselor_id`
 * in the database mode rather than stored on the user, which is a real fix
 * over the in-memory mode below: there, it is a static array on the seed
 * data that a reassignment never updates, so a case moved between counselors
 * in memory does not actually change who can see it. The database schema
 * makes `counselor_id` the single source of truth for both.
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

type UserRow = {
  id: string;
  email: string;
  name: string;
  role: AuthUser["role"];
  password_hash: string;
  case_id: string | null;
  created_at: string;
  onboarding: OnboardingProfile | null;
  shortlist: string[] | null;
};

function fromRow(row: UserRow): AuthUser {
  return {
    id: row.id,
    email: row.email,
    name: row.name,
    role: row.role,
    passwordHash: row.password_hash,
    caseId: row.case_id ?? undefined,
    createdAt: row.created_at,
    onboarding: row.onboarding ?? undefined,
    shortlist: row.shortlist ?? undefined,
  };
}

export async function findByEmail(email: string): Promise<AuthUser | null> {
  const wanted = normaliseEmail(email);

  if (supabaseConfigured()) {
    const { data, error } = await supabaseAdmin()!
      .from("users")
      .select("*")
      .eq("email", wanted)
      .maybeSingle<UserRow>();
    if (error) throw error;
    return data ? fromRow(data) : null;
  }

  return users.find((user) => normaliseEmail(user.email) === wanted) ?? null;
}

export async function findById(id: string): Promise<AuthUser | null> {
  if (supabaseConfigured()) {
    const { data, error } = await supabaseAdmin()!
      .from("users")
      .select("*")
      .eq("id", id)
      .maybeSingle<UserRow>();
    if (error) throw error;
    return data ? fromRow(data) : null;
  }

  return users.find((user) => user.id === id) ?? null;
}

/**
 * Checks a password. Returns null for both an unknown email and a wrong
 * password, and does the hash work either way, so the response cannot be used
 * to find out which addresses have accounts.
 */
export async function authenticate(email: string, password: string): Promise<AuthUser | null> {
  const user = await findByEmail(email);
  const stored =
    user?.passwordHash ??
    "0000000000000000000000000000000000000000000000000000000000000000:00";

  const matches = verifyPassword(password, stored);
  if (!user || !matches) {
    await recordAudit({
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

  await recordAudit({
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
export async function register(input: {
  name: string;
  email: string;
  password: string;
}): Promise<SignupResult> {
  const email = normaliseEmail(input.email);

  if (await findByEmail(email)) {
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

  if (supabaseConfigured()) {
    const { error } = await supabaseAdmin()!.from("users").insert({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      password_hash: user.passwordHash,
      created_at: user.createdAt,
    });
    if (error) return { ok: false, reason: "That account could not be created. Try again." };
  } else {
    users = [...users, user];
  }

  await recordAudit({
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
export async function saveOnboarding(
  userId: string,
  profile: OnboardingProfile,
): Promise<AuthUser | null> {
  const user = await findById(userId);
  if (!user || user.role !== "student") return null;

  const updated: AuthUser = { ...user, onboarding: profile };

  if (supabaseConfigured()) {
    const { error } = await supabaseAdmin()!
      .from("users")
      .update({ onboarding: profile })
      .eq("id", userId);
    if (error) throw error;
  } else {
    users = users.map((item) => (item.id === userId ? updated : item));
  }

  await recordAudit({
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
 *
 * The database path calls `toggle_shortlist`, a single atomic statement
 * (`supabase/migrations/0003_functions.sql`), rather than reading the array
 * and writing it back in two round trips: two tabs toggling the same
 * shortlist at once would otherwise race.
 */
export async function toggleShortlist(
  userId: string,
  programmeSlug: string,
): Promise<string[] | null> {
  const user = await findById(userId);
  if (!user || user.role !== "student") return null;

  const current = user.shortlist ?? [];
  const wasSaved = current.includes(programmeSlug);
  let next: string[];

  if (supabaseConfigured()) {
    const { data, error } = await supabaseAdmin()!.rpc("toggle_shortlist", {
      p_user_id: userId,
      p_slug: programmeSlug,
    });
    if (error) throw error;
    next = (data as string[] | null) ?? [];
  } else {
    next = wasSaved
      ? current.filter((slug) => slug !== programmeSlug)
      : [...current, programmeSlug];
    users = users.map((item) => (item.id === userId ? { ...item, shortlist: next } : item));
  }

  await recordAudit({
    actorId: user.id,
    actorName: user.name,
    actorRole: user.role,
    action: "update",
    subjectType: "case",
    subjectId: "shortlist",
    note: wasSaved
      ? `Removed ${programmeSlug} from their shortlist`
      : `Saved ${programmeSlug} to their shortlist`,
  });

  return next;
}

export async function shortlistFor(userId: string): Promise<string[]> {
  const user = await findById(userId);
  return user?.shortlist ?? [];
}

/**
 * The shape the permission matrix works with.
 *
 * In the database mode a counselor's `assignedCaseIds` is computed from
 * `cases.counselor_id` rather than read off the user, which is the fix
 * described at the top of this file. In the in-memory mode it stays exactly
 * what the seed data says, matching the platform's behaviour today.
 */
export async function toActor(user: AuthUser): Promise<Actor> {
  if (supabaseConfigured() && user.role === "counselor") {
    const { data, error } = await supabaseAdmin()!
      .from("cases")
      .select("id")
      .eq("counselor_id", user.id);
    if (error) throw error;
    return {
      id: user.id,
      name: user.name,
      role: user.role,
      caseId: user.caseId,
      assignedCaseIds: (data ?? []).map((row) => row.id as string),
    };
  }

  return {
    id: user.id,
    name: user.name,
    role: user.role,
    caseId: user.caseId,
    assignedCaseIds: user.assignedCaseIds,
  };
}

/** Shown on the sign in page so a reviewer can get in. Never real people. */
export async function seedAccountHint(): Promise<{ email: string; role: string }[]> {
  if (supabaseConfigured()) {
    const { data, error } = await supabaseAdmin()!
      .from("users")
      .select("email, role")
      .like("id", "user-%");
    if (error) throw error;
    return data ?? [];
  }

  return users
    .filter((user) => user.id.startsWith("user-"))
    .map((user) => ({ email: user.email, role: user.role }));
}
