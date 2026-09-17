"use client";

import { useActionState } from "react";
import Link from "next/link";
import { BookmarkSimple, Check } from "@phosphor-icons/react";
import { toggleShortlistEntry, type ShortlistResult } from "@/app/actions/shortlist";
import { cn } from "@/lib/cn";

/**
 * Save to shortlist.
 *
 * The only control on the catalogue that an account changes anything about, and
 * a signed-out click is answered with a sign-in link back to this page rather
 * than a modal that interrupts the browsing. Nothing else here is gated: the
 * fees, the requirements, the commission figures and the comparison all work
 * signed out, and this button existing is not an argument for changing that.
 */
export function SaveToShortlist({
  programmeSlug,
  saved,
  returnTo,
  className,
  labelWhenSaved = "Saved",
  labelWhenNot = "Save to shortlist",
}: {
  programmeSlug: string;
  saved: boolean;
  returnTo: string;
  className?: string;
  labelWhenSaved?: string;
  labelWhenNot?: string;
}) {
  const [state, formAction, pending] = useActionState<ShortlistResult, FormData>(
    toggleShortlistEntry,
    { status: "idle" },
  );

  const isSaved = state.status === "saved" ? state.saved : saved;

  if (state.status === "signed-out") {
    return (
      <p className={cn("text-[0.8125rem] leading-relaxed text-grey", className)}>
        A shortlist needs an account.{" "}
        <Link
          href={`/login?next=${encodeURIComponent(returnTo)}`}
          className="font-medium text-pink hover:text-blue"
        >
          Sign in
        </Link>{" "}
        or{" "}
        <Link
          href={`/signup?next=${encodeURIComponent(returnTo)}`}
          className="font-medium text-pink hover:text-blue"
        >
          create one
        </Link>
        . Everything else on this page works without one.
      </p>
    );
  }

  return (
    <form action={formAction} className={className}>
      <input type="hidden" name="programme" value={programmeSlug} />
      <button
        type="submit"
        disabled={pending}
        aria-pressed={isSaved}
        className={cn(
          "inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-[0.8125rem] font-medium transition-colors disabled:opacity-60",
          isSaved
            ? "border-blue-dark bg-light text-pink"
            : "border-line-strong bg-white text-blue-dark hover:border-pink hover:text-pink",
        )}
      >
        {isSaved ? (
          <Check size={14} weight="bold" aria-hidden />
        ) : (
          <BookmarkSimple size={14} weight="bold" aria-hidden />
        )}
        {isSaved ? labelWhenSaved : labelWhenNot}
      </button>
      {state.status === "error" && (
        <p className="mt-1.5 text-[0.75rem] text-denied" role="alert">
          {state.message}
        </p>
      )}
    </form>
  );
}
