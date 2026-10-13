"use client";

import { useActionState, useState } from "react";
import { withdrawConsentAction, type ConsentResult } from "@/app/actions/case";
import { categoryLabel, type ConsentRecord } from "@/domain/consent";
import { Button } from "@/components/ui/button";

export function ConsentList({ consents }: { consents: ConsentRecord[] }) {
  const [state, formAction, pending] = useActionState<ConsentResult, FormData>(
    withdrawConsentAction,
    { status: "idle" },
  );
  // The row whose withdrawal is waiting for a second press.
  const [confirming, setConfirming] = useState<string | null>(null);

  return (
    <>
      <ul className="divide-y divide-line">
        {consents.map((consent) => (
          <li key={consent.id} className="px-6 py-5">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="max-w-xl">
                <p className="text-[0.9375rem] font-medium text-blue-dark">
                  {categoryLabel[consent.category]}
                </p>
                <p className="mt-1 text-[0.875rem] leading-relaxed text-grey">
                  {consent.purpose}
                </p>
                <p className="mt-2 text-[0.8125rem] leading-relaxed text-grey">
                  Shared with: {consent.sharedWith.join(", ")}
                </p>
                <p className="figures mt-1 text-[0.75rem] text-grey">
                  Given {consent.grantedAt.slice(0, 10)} by {consent.grantedBy}
                  {consent.withdrawnAt
                    ? `, withdrawn ${consent.withdrawnAt.slice(0, 10)}`
                    : ""}
                </p>
              </div>

              {consent.withdrawnAt ? (
                <span className="rounded-input bg-neutral-chip-bg px-2.5 py-1 text-[0.6875rem] font-medium text-neutral-chip">
                  Withdrawn
                </span>
              ) : (
                <form
                  action={formAction}
                  onSubmit={(event) => {
                    if (pending) event.preventDefault();
                  }}
                  className="flex flex-wrap items-center gap-4"
                >
                  <input type="hidden" name="consentId" value={consent.id} />
                  {/* One button that asks first and submits second. It stays
                      the same element, so focus stays on it; the first press
                      is cancelled so the form is not sent. */}
                  <Button
                    type="submit"
                    variant="outline"
                    aria-disabled={pending}
                    aria-busy={pending}
                    onClick={(event) => {
                      if (confirming !== consent.id) {
                        event.preventDefault();
                        setConfirming(consent.id);
                      }
                    }}
                  >
                    {confirming === consent.id ? "Confirm withdrawal" : "Withdraw"}
                  </Button>
                  {confirming === consent.id && (
                    <Button
                      type="button"
                      variant="quiet"
                      onClick={(event) => {
                        event.currentTarget.form?.querySelector("button")?.focus();
                        setConfirming(null);
                      }}
                    >
                      Keep it
                    </Button>
                  )}
                </form>
              )}
            </div>
          </li>
        ))}
      </ul>

      {/* On the page before the result, so the result is read out. */}
      <div role="status" aria-live="polite">
        {state.status !== "idle" && (
          <p className="border-t border-line px-6 py-4 text-[0.875rem] leading-relaxed text-grey">
            {state.message}
          </p>
        )}
      </div>
    </>
  );
}
