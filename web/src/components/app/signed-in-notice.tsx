import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react/ssr";
import { SignOutButton } from "@/components/app/sign-out";
import { landingFor } from "@/domain/auth";
import { currentActor } from "@/domain/session";

const destination: Record<string, string> = {
  "/portal": "Go to your portal",
  "/console": "Go to the console",
  "/ops": "Go to operations",
};

/**
 * Beside the logo on the sign in and sign up pages, for someone who is
 * already signed in. These pages used to redirect such a visitor straight to
 * their surface, which made "Student login" open whichever account was used
 * last and left no way to reach the form to use another. Now they say who is
 * signed in and offer the way on, and the form stays for switching accounts.
 * It sits in the header row, which was empty but for the logo, so it adds no
 * height to a page that has to fit one screen.
 */
export async function SignedInNotice() {
  const actor = await currentActor();
  if (!actor) return null;
  const landing = landingFor[actor.role];

  return (
    <div className="flex flex-wrap items-center justify-end gap-x-5 gap-y-1 text-white">
      <p className="small">
        Signed in as <strong>{actor.name}</strong>
      </p>
      <Link
        href={landing}
        className="small inline-flex items-center gap-1 font-bold text-white underline decoration-white/40 underline-offset-4 hover:decoration-pink"
      >
        {destination[landing]}
        <ArrowRight size={13} weight="bold" aria-hidden />
      </Link>
      <SignOutButton />
    </div>
  );
}
