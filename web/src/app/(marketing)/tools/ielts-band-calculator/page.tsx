import type { Metadata } from "next";
import { ToolPage } from "@/components/tools/shell";
import { IeltsBandCalculator } from "@/components/tools/ielts-band";

export const metadata: Metadata = {
  title: "IELTS band calculator",
  description:
    "Work out your overall IELTS band from four section scores, with the half-band rounding rule applied step by step, and a check against the per-section minimum your offer sets.",
  alternates: { canonical: "/tools/ielts-band-calculator" },
};

export default function IeltsBandPage() {
  return (
    <ToolPage
      title="Your overall IELTS band, and the condition it might still miss"
      lede="Four sections, equal weighting, rounded to the nearest half band with quarters rounding up. The part most calculators leave out is the per-section minimum on your offer, which is where a good overall band still fails a language condition."
      foot={
        <div className="max-w-3xl">
          <h2 className="text-blue-dark">
            This calculates a band. It does not predict one.
          </h2>
          <p className="mt-3 text-[0.9375rem] leading-relaxed text-grey">
            If you have not sat the test, there is no honest number to give you. Nothing on
            this site estimates a score you have not achieved, in the same way that nothing
            on this site estimates a probability of admission. Both would be invented, and an
            invented number is what students on this route are already drowning in.
          </p>
        </div>
      }
    >
      <IeltsBandCalculator />
    </ToolPage>
  );
}
