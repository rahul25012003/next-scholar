import type { Metadata } from "next";
import { ToolPage } from "@/components/tools/shell";
import { GradeConverter } from "@/components/tools/grade-converter";

export const metadata: Metadata = {
  title: "Grade converters",
  description:
    "Eight conversions between CGPA, percentage, marks and GPA. Each shows its formula, its working, the method it uses and what it cannot decide.",
  alternates: { canonical: "/tools/grade-converter" },
};

export default function GradeConverterPage() {
  return (
    <ToolPage
      title="Grade converters, each with its method named"
      lede="Every conversion here is a common practice, not an official rule: multiplying a CGPA by 9.5, for example, is a CBSE practice, not a national standard. Each tool says which method it uses and what that means for you."
      foot={
        <div className="max-w-3xl">
          <h2 className="text-blue-dark">
            One caution worth more than all eight calculators
          </h2>
          <p className="mt-3 text-[0.9375rem] leading-relaxed text-grey">
            Do not put a figure you calculated on an application form.
          </p>
          <ul className="mt-3 list-disc space-y-1.5 pl-5 text-[0.9375rem] leading-relaxed text-grey">
            <li>
              Use the number on your official transcript, or on an official conversion
              certificate from your university or an evaluation body.
            </li>
            <li>A calculated figure two points off your transcript looks careless at best.</li>
          </ul>
          <p className="mt-4 text-[0.9375rem] leading-relaxed text-grey">
            Use these to decide whether a programme is worth its application fee. That is
            useful to know, but it is not what you write on the form.
          </p>
        </div>
      }
    >
      <GradeConverter />
    </ToolPage>
  );
}
