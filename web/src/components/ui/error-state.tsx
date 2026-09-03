"use client";

import { useEffect } from "react";
import Link from "next/link";
import { ArrowClockwise, WarningCircle } from "@phosphor-icons/react";
import { Button, ButtonLink } from "@/components/ui/button";

/**
 * The shared error surface.
 *
 * Two things it does that a generic "something went wrong" does not.
 *
 * It prints the digest. In production Next replaces a server error's message
 * with a hash to avoid leaking internals, and that hash is the only thing that
 * connects what the reader saw to what the logs recorded. Hiding it makes a
 * support conversation guesswork.
 *
 * And it does not claim the work is safe. On a platform holding someone's
 * passport and their deadlines, "don't worry, try again" is a promise we cannot
 * keep from inside an error boundary, so the copy says what is actually known:
 * the last action may not have been saved, and here is how to check.
 */
export function ErrorState({
  error,
  retry,
  scope,
}: {
  error: Error & { digest?: string };
  retry: () => void;
  /** Where the failure happened, so the recovery advice can be specific. */
  scope: "site" | "app";
}) {
  useEffect(() => {
    // Until an error tracker is connected this is the only aggregation there
    // is. It is logged rather than swallowed so that a failure in production
    // leaves a trace somewhere a person can reach.
    console.error(`[next-scholar] unhandled error in the ${scope} boundary`, error);
  }, [error, scope]);

  return (
    <main className="flex min-h-[70vh] items-center bg-surface">
      <div className="shell max-w-2xl py-20">
        <span
          aria-hidden
          className="grid h-12 w-12 place-items-center rounded-input bg-denied-bg text-denied"
        >
          <WarningCircle size={24} weight="fill" />
        </span>
        <h1 className="mt-6 font-display text-[2rem] font-extrabold leading-tight tracking-[-0.03em] text-navy-900">
          Something on this page failed
        </h1>
        <p className="mt-5 text-[1.0625rem] leading-relaxed text-body">
          {scope === "app"
            ? "The page did not finish loading. If you had just submitted something, we cannot tell you from here whether it was saved, so check the case record before repeating the action rather than sending it twice."
            : "The page did not finish loading. Nothing you were reading was lost, because nothing on the public site is stored on your behalf."}
        </p>

        {error.digest && (
          <div className="mt-7 rounded-card border border-line bg-paper p-5">
            <p className="text-[0.8125rem] font-semibold text-navy-900">Reference for this error</p>
            <p className="figures mt-1.5 text-[0.9375rem] text-body">{error.digest}</p>
            <p className="mt-2 text-[0.8125rem] leading-relaxed text-muted">
              Quote this if you tell us about it. It is the only thing that links what you saw
              to what our logs recorded.
            </p>
          </div>
        )}

        <div className="mt-8 flex flex-wrap gap-3">
          <Button size="lg" onClick={() => retry()}>
            <ArrowClockwise size={16} weight="bold" aria-hidden />
            Try this page again
          </Button>
          <ButtonLink href={scope === "app" ? "/portal" : "/"} variant="outline" size="lg">
            {scope === "app" ? "Back to your portal" : "Back to the start"}
          </ButtonLink>
        </div>

        <p className="mt-10 text-[0.875rem] leading-relaxed text-muted">
          If it keeps happening,{" "}
          <Link
            href="/book-consultation"
            className="font-medium text-blue-600 hover:text-blue-500"
          >
            tell us
          </Link>{" "}
          and include the reference above. A repeated failure is a bug, not your browser.
        </p>
      </div>
    </main>
  );
}
