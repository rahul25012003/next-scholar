import type { Metadata } from "next";
import { ToolPage } from "@/components/tools/shell";
import { GradeConverter } from "@/components/tools/grade-converter";

export const metadata: Metadata = {
  title: "Grade converters",
  description:
    "Eight conversions between CGPA, percentage, marks and GPA, each showing its formula, its arithmetic, the convention it rests on, and what it does not decide.",
  alternates: { canonical: "/tools/grade-converter" },
};

export default function GradeConverterPage() {
  return (
    <ToolPage
      title="Grade converters, with the convention named"
      lede="Every conversion here rests on a convention rather than a law. Multiplying a CGPA by 9.5 is a CBSE practice that many universities adopted, not a national standard, and a linear percentage to GPA conversion ignores grade boundaries entirely. Each tool says which convention it used and where that leaves you."
      foot={
        <div className="max-w-3xl">
          <h2 className="text-blue-dark">
            One caution worth more than all eight calculators
          </h2>
          <p className="mt-3 text-[0.9375rem] leading-relaxed text-grey">
            Do not put a figure you calculated on an application form. Universities want the
            number printed on your official transcript, or one on an official conversion
            certificate from your university or an evaluation body. A calculated figure that
            disagrees with your transcript by two points reads as carelessness at best.
          </p>
          <p className="mt-4 text-[0.9375rem] leading-relaxed text-grey">
            These are for working out whether a programme is worth applying to before you pay
            its application fee. That is a genuinely useful thing to know, and it is a
            different thing from what you write on the form.
          </p>
        </div>
      }
    >
      <GradeConverter />
    </ToolPage>
  );
}
