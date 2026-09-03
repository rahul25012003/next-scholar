"use server";

import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import {
  checkPasswordStrength,
  createSession,
  isEmail,
  landingFor,
  normaliseEmail,
  SESSION_COOKIE,
  SESSION_MAX_AGE_SECONDS,
} from "@/domain/auth";
import { authenticate, register } from "@/data/users";
import { check, clientKey, policies } from "@/domain/rate-limit";

/**
 * Both auth actions do a real scrypt hash on every attempt, including for an
 * address that has no account, which is what stops the response being usable to
 * enumerate addresses. That same property makes an unthrottled endpoint a way
 * to burn the CPU of every other request, so both are limited, and the limit
 * counts attempts rather than failures: counting only failures would tell an
 * attacker which attempts were right.
 */
async function withinRateLimit(): Promise<string | null> {
  const key = clientKey(await headers());
  const result = check(key, policies.auth);
  if (result.allowed) return null;
  const minutes = Math.max(1, Math.ceil(result.retryAfter / 60));
  return `Too many attempts from this connection. Try again in ${minutes} minute${minutes === 1 ? "" : "s"}.`;
}

export type AuthResult =
  | { status: "idle" }
  | { status: "error"; message: string };

async function startSession(user: { id: string; role: Parameters<typeof createSession>[0]["role"] }) {
  const store = await cookies();
  store.set(SESSION_COOKIE, createSession(user), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
  });
}

/**
 * Sign in. A wrong password and an unknown address return the same message,
 * because telling someone which of the two it was hands them half a login.
 */
export async function signIn(
  _previous: AuthResult,
  formData: FormData,
): Promise<AuthResult> {
  const throttled = await withinRateLimit();
  if (throttled) return { status: "error", message: throttled };

  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");

  if (!isEmail(normaliseEmail(email)) || password.length === 0) {
    return { status: "error", message: "Enter your email address and password." };
  }

  const user = authenticate(email, password);
  if (!user) {
    return { status: "error", message: "That email and password do not match an account." };
  }

  await startSession(user);
  redirect(landingFor[user.role]);
}

/** Registration, which only ever creates a student account. */
export async function signUp(
  _previous: AuthResult,
  formData: FormData,
): Promise<AuthResult> {
  const throttled = await withinRateLimit();
  if (throttled) return { status: "error", message: throttled };

  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const confirm = String(formData.get("confirm") ?? "");

  if (name.length < 2) {
    return { status: "error", message: "Enter your name as it appears on your passport." };
  }
  if (!isEmail(normaliseEmail(email))) {
    return { status: "error", message: "Enter a valid email address." };
  }
  if (password !== confirm) {
    return { status: "error", message: "The two passwords do not match." };
  }

  const strength = checkPasswordStrength(password);
  if (!strength.ok) {
    return { status: "error", message: strength.reason };
  }

  const result = register({ name, email, password });
  if (!result.ok) {
    return { status: "error", message: result.reason };
  }

  await startSession(result.user);
  redirect(landingFor[result.user.role]);
}

export async function signOut(): Promise<void> {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
  redirect("/login");
}
