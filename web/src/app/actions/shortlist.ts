"use server";

import { revalidatePath } from "next/cache";
import { currentActor } from "@/domain/session";
import { programmeFor } from "@/content/catalogue";
import { shortlistFor, toggleShortlist } from "@/data/users";

export type ShortlistResult =
  | { status: "idle" }
  | { status: "signed-out" }
  | { status: "saved"; saved: boolean; slugs: string[] }
  | { status: "error"; message: string };

/**
 * Saves or unsaves a programme.
 *
 * Signing out is not an error and does not lose the click's intent: the caller
 * gets a "signed-out" state and offers a sign-in that returns to the same page.
 * Nothing on the catalogue is gated behind an account, so this is the only
 * feature where being signed out changes anything at all.
 */
export async function toggleShortlistEntry(
  _previous: ShortlistResult,
  formData: FormData,
): Promise<ShortlistResult> {
  const slug = String(formData.get("programme") ?? "");
  if (!programmeFor(slug)) {
    return { status: "error", message: "That course is not in the catalogue." };
  }

  const actor = await currentActor();
  if (!actor) return { status: "signed-out" };
  if (actor.role !== "student") {
    return {
      status: "error",
      message:
        "A shortlist belongs to a student account. A counsellor proposes a shortlist on the case, where it carries the commission figures.",
    };
  }

  const slugs = toggleShortlist(actor.id, slug);
  if (!slugs) return { status: "error", message: "That could not be saved. Try again." };

  revalidatePath("/shortlist");
  return { status: "saved", saved: slugs.includes(slug), slugs };
}

/** Reads the current shortlist for the signed-in student. Empty when signed out. */
export async function currentShortlist(): Promise<string[]> {
  const actor = await currentActor();
  if (!actor || actor.role !== "student") return [];
  return shortlistFor(actor.id);
}
