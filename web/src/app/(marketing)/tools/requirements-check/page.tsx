import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react/ssr";
import { ToolPage } from "@/components/tools/shell";
import { RequirementsCheck } from "@/components/tools/requirements-check";

export const metadata: Metadata = {
  title: "Requirements checklist",
  description:
    "Check your own profile against every published requirement for the UK, Germany or Ireland. Met, not met, or cannot tell. Three states, no score, and no probability of admission.",
  alternates: { canonical: "/tools/requirements-check" },
};

export default async function RequirementsCheckPage(
  props: PageProps<"/tools/requirements-check">,
) {
  const { destination } = await props.searchParams;
  return (
    <ToolPage
      title="Where you actually stand, requirement by requirement"
      lede="Every competitor ships this as an admission predictor with a percentage on it. That percentage is invented. This answers one question per row instead: does the figure you gave us meet the requirement that body publishes, yes, no, or we cannot tell because you have not said."
      foot={
        <div className="max-w-3xl">
          <h2 className="font-display text-[1.375rem] font-bold text-navy-900">
            Why there is no score on this page
          </h2>
          <p className="mt-3 text-[0.9375rem] leading-relaxed text-body">
            Because a count of met requirements is not a probability of admission, and
            presenting it as one would be a fabricated number. Admission decisions turn on
            programme-specific module requirements, the strength of a cohort we cannot see,
            and a letter of motivation nobody has written yet. Nothing in that is computable
            from a form, and every platform that puts a percentage on it is guessing.
          </p>
          <p className="mt-4 text-[0.9375rem] leading-relaxed text-body">
            A row that says not met is not a rejection either. Most of them name the thing to
            fix and the order to fix it in, which is the part that is actually worth having.
          </p>
          <Link
            href="/services/profile-evaluation"
            className="mt-5 inline-flex items-center gap-1.5 font-medium text-blue-600 hover:text-blue-500"
          >
            Want a person to read your actual transcript and confirm this in writing?
            <ArrowRight size={14} weight="bold" aria-hidden />
          </Link>
        </div>
      }
    >
      <RequirementsCheck
        initialDestination={typeof destination === "string" ? destination : undefined}
      />
    </ToolPage>
  );
}
