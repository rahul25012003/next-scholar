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
      lede="The Modified Bavarian Formula is what uni-assist and most German universities start from. It is arithmetic rather than judgement, which is exactly why we can publish it and show you every step of it on your own numbers."
      foot={
        <div className="max-w-3xl">
          <h2 className="font-display text-[1.375rem] font-bold text-navy-900">
            Why we show the working
          </h2>
          <p className="mt-3 text-[0.9375rem] leading-relaxed text-body">
            Because a converted grade decides which programmes are worth an application fee,
            and a number you cannot check is a number you have to trust. The formula, your
            own figures substituted into it, and each intermediate step are all on the page,
            so you can verify the result by hand or hand it to someone else to verify.
          </p>
          <p className="mt-4 text-[0.9375rem] leading-relaxed text-body">
            What the calculator cannot do is decide the result. The university&rsquo;s
            admissions office or uni-assist performs the official conversion and some of them
            use a different method. Nor is a grade the gate that most often stops an Indian
            applicant to Germany: that is{" "}
            <Link
              href="/destinations/germany#academic"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              anabin recognition and subject credits
            </Link>
            , and from the summer semester 2027 intake, the dMAT.
          </p>
        </div>
      }
    >
      <GermanGradeCalculator />
    </ToolPage>
  );
}
