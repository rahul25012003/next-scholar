"use server";

import { revalidatePath } from "next/cache";
import { currentActor } from "@/domain/session";
import { emptyOnboarding, parseOnboarding } from "@/domain/onboarding";
import { findById, saveOnboarding } from "@/data/users";

export type OnboardingResult =
  | { status: "idle" }
  | { status: "saved"; at: string }
  | { status: "error"; message: string };

/**
 * Saves a student's own onboarding answers.
 *
 * The actor is read from the session rather than from the form, so a submitted
 * user id cannot move someone else's profile. A staff account gets refused
 * here too: there is no legitimate reason for a counsellor to write this record
 * from the student's own form, and a correction to a case belongs on the case
 * where it is logged with a name and a reason.
 */
export async function saveOnboardingProfile(
  _previous: OnboardingResult,
  formData: FormData,
): Promise<OnboardingResult> {
  const actor = await currentActor();
  if (!actor) return { status: "error", message: "Your session has expired. Sign in again." };
  if (actor.role !== "student") {
    return {
      status: "error",
      message:
        "Only a student can fill in their own profile. Correct a case record on the case instead, where the change is logged.",
    };
  }

  const entries = new Map<string, string>();
  for (const [key, value] of formData.entries()) {
    if (typeof value === "string") entries.set(key, value);
  }

  const existing = (await findById(actor.id))?.onboarding ?? emptyOnboarding();
  const updated = parseOnboarding(entries, existing);

  const saved = await saveOnboarding(actor.id, updated);
  if (!saved) {
    return { status: "error", message: "That profile could not be saved. Try again." };
  }

  revalidatePath("/portal");
  return { status: "saved", at: updated.updatedAt };
}
