import type { Metadata } from "next";
import Link from "next/link";
import { ToolPage } from "@/components/tools/shell";
import { GermanGradeCalculator } from "@/components/tools/german-grade";

export const metadata: Metadata = {
  title: "German grade calculator",
  description:
    "Convert an Indian CGPA or percentage to the German 1.0 to 4.0 scale with the Modified Bavarian Formula, and see every step of the arithmetic on your own numbers.",
  alternates: { canonical: "/tools/german-grade-calculator" },
};

export default function GermanGradePage() {
  return (
    <ToolPage
      title="Your grade on the German 1.0 to 4.0 scale"
      lede="uni-assist and most German universities start from the Modified Bavarian Formula. It is plain arithmetic, so we show every step using your own numbers."
      foot={
        <div className="max-w-3xl">
          <h2 className="text-blue-dark">
            Why we show the working
          </h2>
          <p className="mt-3 text-[0.9375rem] leading-relaxed text-grey">
            A converted grade decides which programmes are worth an application fee, so you
            should be able to check it. The formula, your figures in it and each step are on
            the page, so you or someone else can check it by hand.
          </p>
          <p className="mt-4 text-[0.9375rem] leading-relaxed text-grey">
            The calculator does not decide your official grade.
          </p>
          <ul className="mt-3 list-disc space-y-1.5 pl-5 text-[0.9375rem] leading-relaxed text-grey">
            <li>
              The university&rsquo;s admissions office or uni-assist does the official
              conversion, and some use a different method.
            </li>
            <li>
              The grade is not what most often stops an Indian applicant to Germany. That
              is{" "}
              <Link
                href="/destinations/germany#academic"
                className="font-medium text-pink hover:text-blue-dark"
              >
                anabin recognition and subject credits
              </Link>
              , and from the summer semester 2027 intake, the dMAT.
            </li>
          </ul>
        </div>
      }
    >
      <GermanGradeCalculator />
    </ToolPage>
  );
}
