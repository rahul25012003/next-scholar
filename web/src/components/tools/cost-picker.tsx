"use client";

import { useState } from "react";
import { guides, rateFor } from "@/content/guides";
import { CostOfLivingCalculator } from "@/components/tools/cost-of-living";
import { cn } from "@/lib/cn";

/** Destination first, then the calculator. Three destinations, so no dropdown. */
export function CostOfLivingPicker({ initialDestination }: { initialDestination?: string }) {
  const [slug, setSlug] = useState(
    guides.some((guide) => guide.slug === initialDestination)
      ? (initialDestination as string)
      : guides[0].slug,
  );
  const guide = guides.find((item) => item.slug === slug)!;

  return (
    <div className="space-y-7">
      <fieldset>
        <legend className="text-[0.8125rem] font-semibold uppercase tracking-wide text-muted">
          Destination
        </legend>
        <div className="mt-3 flex flex-wrap gap-2">
          {guides.map((option) => (
            <button
              key={option.slug}
              type="button"
              onClick={() => setSlug(option.slug)}
              aria-pressed={option.slug === slug}
              className={cn(
                "rounded-full border px-4 py-2 text-[0.9375rem] font-medium transition-colors",
                option.slug === slug
                  ? "border-blue-600 bg-blue-600 text-white"
                  : "border-line-strong bg-paper text-navy-900 hover:border-blue-600 hover:text-blue-600",
              )}
            >
              {option.country}
            </button>
          ))}
        </div>
      </fieldset>

      <CostOfLivingCalculator guide={guide} rate={rateFor(guide.currency)} />
    </div>
  );
}
