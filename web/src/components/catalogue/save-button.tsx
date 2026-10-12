"use client";

import { useActionState, useEffect } from "react";
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
 *
 * `compact` is the icon-only form a list row uses, labelled for assistive
 * technology by the course's own name; `onChange` lets a list keep a running
 * count of what has been saved without asking the server again.
 */
export function SaveToShortlist({
  programmeSlug,
  saved,
  returnTo,
  className,
  labelWhenSaved = "Saved",
  labelWhenNot = "Save to shortlist",
  compact = false,
  courseName,
  onChange,
}: {
  programmeSlug: string;
  saved: boolean;
  returnTo: string;
  className?: string;
  labelWhenSaved?: string;
  labelWhenNot?: string;
  compact?: boolean;
  courseName?: string;
  onChange?: (saved: boolean) => void;
}) {
  const [state, formAction, pending] = useActionState<ShortlistResult, FormData>(
    toggleShortlistEntry,
    { status: "idle" },
  );

  const isSaved = state.status === "saved" ? state.saved : saved;

  useEffect(() => {
    if (state.status === "saved") onChange?.(state.saved);
    // Only a new answer from the server is news; the callback's identity is not.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  if (state.status === "signed-out") {
    if (compact) {
      return (
        <Link
          href={`/login?next=${encodeURIComponent(returnTo)}`}
          className={cn(
            "inline-flex items-center rounded-full border border-line-strong bg-white px-3 py-1.5 text-[0.8125rem] font-medium text-blue-dark hover:border-pink hover:text-pink",
            className,
          )}
        >
          Sign in to save
        </Link>
      );
    }
    return (
      <p className={cn("text-[0.8125rem] leading-relaxed text-grey", className)}>
        A shortlist needs an account.{" "}
        <Link
          href={`/login?next=${encodeURIComponent(returnTo)}`}
          className="font-medium text-pink hover:text-blue-dark"
        >
          Sign in
        </Link>{" "}
        or{" "}
        <Link
          href={`/signup?next=${encodeURIComponent(returnTo)}`}
          className="font-medium text-pink hover:text-blue-dark"
        >
          create one
        </Link>
        . Everything else on this page works without one.
      </p>
    );
  }

  const label = isSaved ? labelWhenSaved : labelWhenNot;

  return (
    <form action={formAction} className={className}>
      <input type="hidden" name="programme" value={programmeSlug} />
      <button
        type="submit"
        disabled={pending}
        aria-busy={pending}
        aria-pressed={isSaved}
        aria-label={compact ? `${isSaved ? "Saved" : "Save"}: ${courseName ?? label}` : undefined}
        title={compact ? label : undefined}
        className={cn(
          "inline-flex items-center justify-center gap-1.5 rounded-full border text-[0.8125rem] font-medium transition-colors disabled:opacity-60",
          compact ? "h-10 w-10" : "px-3.5 py-1.5",
          isSaved
            ? "border-blue-dark bg-light text-pink"
            : "border-line-strong bg-white text-blue-dark hover:border-pink hover:text-pink",
        )}
      >
        {isSaved ? (
          <Check size={compact ? 17 : 14} weight="bold" aria-hidden />
        ) : (
          <BookmarkSimple size={compact ? 17 : 14} weight="bold" aria-hidden />
        )}
        {!compact && label}
      </button>
      {state.status === "error" && (
        <p className="mt-1.5 text-[0.75rem] text-denied" role="alert">
          {state.message}
        </p>
      )}
    </form>
  );
}
