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
        <legend className="eyebrow text-grey">
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
                "button",
                option.slug === slug
                  ? "button--selected"
                  : "button--light",
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
