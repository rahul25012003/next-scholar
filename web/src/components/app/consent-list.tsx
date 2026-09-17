"use client";

import { useActionState } from "react";
import { withdrawConsentAction, type ConsentResult } from "@/app/actions/case";
import { categoryLabel, type ConsentRecord } from "@/domain/consent";
import { Button } from "@/components/ui/button";

export function ConsentList({ consents }: { consents: ConsentRecord[] }) {
  const [state, formAction, pending] = useActionState<ConsentResult, FormData>(
    withdrawConsentAction,
    { status: "idle" },
  );

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
                <form action={formAction}>
                  <input type="hidden" name="consentId" value={consent.id} />
                  <Button type="submit" variant="outline" disabled={pending}>
                    Withdraw
                  </Button>
                </form>
              )}
            </div>
          </li>
        ))}
      </ul>

      {state.status !== "idle" && (
        <p
          className="border-t border-line px-6 py-4 text-[0.875rem] leading-relaxed text-grey"
          role="status"
        >
          {state.message}
        </p>
      )}
    </>
  );
}
