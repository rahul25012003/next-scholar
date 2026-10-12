import type { Metadata } from "next";
import Link from "next/link";
import { ToolPage } from "@/components/tools/shell";
import { EctsCheck } from "@/components/tools/ects-check";

export const metadata: Metadata = {
  title: "ECTS credit check",
  description:
    "German Master's admission depends heavily on the credits on your transcript. Check your total, core subject and mathematics credits against a programme's requirements and see each gap.",
  alternates: { canonical: "/tools/ects-check" },
};

export default function EctsCheckPage() {
  return (
    <ToolPage
      title="The credit check German admission actually uses"
      lede="If a programme asks for 30 ECTS in mathematics and your transcript shows 18, it rejects you on that, whatever your overall grade. This tool does that sum for you."
      foot={
        <div className="max-w-3xl">
          <h2 className="text-blue-dark">
            A shortfall is a question, not a verdict
          </h2>
          <p className="mt-3 text-[0.9375rem] leading-relaxed text-grey">
            Many German programmes admit applicants with extra modules to finish in the
            first year: ask the programme office by email, and the answer is often yes. What
            loses the place is finding the gap after you apply, not before.
          </p>
          <p className="mt-4 text-[0.9375rem] leading-relaxed text-grey">
            Take the credit requirements from the programme&rsquo;s own module handbook, not
            a general figure. Everything else the German route asks for is on the{" "}
            <Link
              href="/destinations/germany"
              className="font-medium text-pink hover:text-blue-dark"
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
