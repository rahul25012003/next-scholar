import "server-only";

import { cookies } from "next/headers";
import { readSession, SESSION_COOKIE } from "./auth";
import { findById, toActor } from "@/data/users";
import type { Actor } from "./rbac";

/**
 * Who is making this request.
 *
 * Every authenticated surface asks this rather than importing a fixed actor.
 * A missing, expired or tampered session returns null, and the caller decides
 * what that means: the route guard redirects, and a server action refuses.
 */
export async function currentActor(): Promise<Actor | null> {
  const store = await cookies();
  const payload = readSession(store.get(SESSION_COOKIE)?.value);
  if (!payload) return null;

  const user = findById(payload.sub);
  if (!user) return null;

  // The role comes from the user record, not from the token. A token whose
  // role was edited still fails the signature check, but reading the role from
  // storage means a role change takes effect without waiting for expiry.
  return toActor(user);
}

export async function requireActor(): Promise<Actor> {
  const actor = await currentActor();
  if (!actor) throw new Error("Not signed in");
  return actor;
}
