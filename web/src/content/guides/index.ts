import { germany } from "./germany";
import { ireland } from "./ireland";
import { unitedKingdom } from "./united-kingdom";
import type { DestinationGuide, IndicativeRate } from "./types";

export * from "./types";

/**
 * Three destinations, in the order a Bengaluru applicant most often compares
 * them. A fourth is added only when its guide can be filled in completely, not
 * when the country becomes interesting.
 */
export const guides: DestinationGuide[] = [unitedKingdom, germany, ireland];

export function guideFor(slug: string): DestinationGuide | null {
  return guides.find((guide) => guide.slug === slug) ?? null;
}

/** Reverse lookup, from a destinations.ts row to the guide that covers it. */
export function guideForDestinationSlug(slug: string): DestinationGuide | null {
  return (
    guides.find((guide) => guide.routes.some((route) => route.destinationSlug === slug)) ??
    null
  );
}

/** Guide lookup by the country name used on the case record. */
export function guideForCountry(country: string): DestinationGuide | null {
  return guides.find((guide) => guide.country === country) ?? null;
}

/**
 * The rupee conversion.
 *
 * No exchange rate API is connected, so there is no live rate here, and a live
 * looking number would be exactly the kind of thing this platform exists not to
 * print. The rate below is stated with the date it was taken, every figure
 * derived from it is labelled indicative, and the renderer shows the rate next
 * to the output rather than hiding it.
 */
export const indicativeRates: IndicativeRate[] = [
  {
    currency: "EUR",
    inrPerUnit: 101,
    takenOn: "2026-09-03",
    source: "Reference rate recorded by hand. No rate API is connected.",
  },
  {
    currency: "GBP",
    inrPerUnit: 118,
    takenOn: "2026-09-03",
    source: "Reference rate recorded by hand. No rate API is connected.",
  },
];

export function rateFor(currency: "EUR" | "GBP"): IndicativeRate {
  const found = indicativeRates.find((rate) => rate.currency === currency);
  if (!found) throw new Error(`No indicative rate recorded for ${currency}`);
  return found;
}

/** Indian rupee formatting, in lakh where the number is large enough to warrant it. */
export function inr(amount: number): string {
  if (amount >= 100000) {
    const lakh = amount / 100000;
    return `₹${lakh.toFixed(lakh < 10 ? 2 : 1)}L`;
  }
  return `₹${Math.round(amount).toLocaleString("en-IN")}`;
}

export function toInr(amount: number, currency: "EUR" | "GBP"): string {
  return inr(amount * rateFor(currency).inrPerUnit);
}
