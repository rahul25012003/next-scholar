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
    <main className="flex min-h-[70vh] items-center pad-around-lg">
      <div className="band w-full">
        <div className="shell flow max-w-2xl">
          <span
            aria-hidden
            className="grid h-12 w-12 place-items-center rounded-full bg-denied-bg text-denied"
          >
            <WarningCircle size={24} weight="fill" />
          </span>
          <h1 className="h h--3 text-blue-dark">Something on this page failed</h1>
          <p>
            {scope === "app"
              ? "The page did not finish loading. If you had just submitted something, we cannot tell you from here whether it was saved, so check the case record before repeating the action rather than sending it twice."
              : "The page did not finish loading. Nothing you were reading was lost, because nothing on the public site is stored on your behalf."}
          </p>

          {error.digest && (
            <div className="flow bg-light p-5" style={{ ["--flow" as string]: "0.4rem" }}>
              <p className="small font-bold text-blue-dark">Reference for this error</p>
              <p className="figures">{error.digest}</p>
              <p className="small">
                Quote this if you tell us about it. It is the only thing that links what you saw
                to what our logs recorded.
              </p>
            </div>
          )}

          <div className="flex flex-wrap gap-3 pt-2">
            <Button size="lg" onClick={() => retry()}>
              <ArrowClockwise size={16} weight="bold" aria-hidden />
              Try this page again
            </Button>
            <ButtonLink href={scope === "app" ? "/portal" : "/"} variant="outline" size="lg">
              {scope === "app" ? "Back to your portal" : "Back to the start"}
            </ButtonLink>
          </div>

          <p className="small pt-4">
            If it keeps happening,{" "}
            <Link href="/book-consultation" className="font-bold text-pink">
              tell us
            </Link>{" "}
            and include the reference above. A repeated failure is a bug, not your browser.
          </p>
        </div>
      </div>
    </main>
  );
}
