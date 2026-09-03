import type { Metadata } from "next";
import Link from "next/link";
import { ToolPage } from "@/components/tools/shell";
import { EctsCheck } from "@/components/tools/ects-check";

export const metadata: Metadata = {
  title: "ECTS credit check",
  description:
    "German Master's admission is largely arithmetic on your transcript. Check your total, core subject and mathematics credits against a programme's stated requirements and see each gap.",
  alternates: { canonical: "/tools/ects-check" },
};

export default function EctsCheckPage() {
  return (
    <ToolPage
      title="The credit arithmetic German admission actually runs"
      lede="A programme that asks for 30 ECTS in mathematics and finds 18 on your transcript rejects on that, whatever your overall grade was. This is the subtraction that decides it, and almost nothing published for Indian applicants represents it at all."
      foot={
        <div className="max-w-3xl">
          <h2 className="font-display text-[1.375rem] font-bold text-navy-900">
            A shortfall is a question, not a verdict
          </h2>
          <p className="mt-3 text-[0.9375rem] leading-relaxed text-body">
            Many German programmes admit applicants with conditional modules to be completed
            in the first year. Whether yours will is something the programme office answers in
            an email, and the answer is often yes. What loses the place is discovering the gap
            after the application rather than before it.
          </p>
          <p className="mt-4 text-[0.9375rem] leading-relaxed text-body">
            The credit requirements to enter here come from the programme&rsquo;s own module
            handbook, not from a general figure. Everything else the German route gates on is
            on the{" "}
            <Link
              href="/destinations/germany"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              Germany guide
            </Link>
            .
          </p>
        </div>
      }
    >
      <EctsCheck />
    </ToolPage>
  );
}
