import type { Metadata } from "next";
import { ToolPage } from "@/components/tools/shell";
import { IeltsBandCalculator } from "@/components/tools/ielts-band";

export const metadata: Metadata = {
  title: "IELTS band calculator",
  description:
    "Work out your overall IELTS band from four section scores, with the rounding rule shown step by step, and check each section against the minimum your offer sets.",
  alternates: { canonical: "/tools/ielts-band-calculator" },
};

export default function IeltsBandPage() {
  return (
    <ToolPage
      title="Your overall IELTS band, and the condition it might still miss"
      lede="Your four section scores are averaged and rounded to the nearest half band, with quarters rounding up. We also check each section against your offer's minimum, because one low section can fail you even with a good overall band."
      foot={
        <div className="max-w-3xl">
          <h2 className="text-blue-dark">
            This calculates a band. It does not predict one.
          </h2>
          <p className="mt-3 text-[0.9375rem] leading-relaxed text-grey">
            If you have not taken the test, there is no honest number to give you. We do not
            guess a score you have not achieved, just as we do not guess your chance of
            admission.
          </p>
        </div>
      }
    >
      <IeltsBandCalculator />
    </ToolPage>
  );
}
