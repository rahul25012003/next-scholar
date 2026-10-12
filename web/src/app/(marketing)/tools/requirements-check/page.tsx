import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react/ssr";
import { ToolPage } from "@/components/tools/shell";
import { RequirementsCheck } from "@/components/tools/requirements-check";

export const metadata: Metadata = {
  title: "Requirements checklist",
  description:
    "Check your profile against every published requirement for a Master's in the UK, Germany or Ireland. Each one shows as Met, Not met yet or Needs checking, with no score and no chance of admission.",
  alternates: { canonical: "/tools/requirements-check" },
};

export default async function RequirementsCheckPage(
  props: PageProps<"/tools/requirements-check">,
) {
  const { destination } = await props.searchParams;
  return (
    <ToolPage
      title="Where you actually stand, requirement by requirement"
      lede="Enter your details and press Submit. Each requirement then shows as Met, Not met yet or Needs checking, with no percentage score."
      foot={
        <div className="max-w-3xl">
          <h2 className="text-blue-dark">
            Why there is no score on this page
          </h2>
          <p className="mt-3 text-[0.9375rem] leading-relaxed text-grey">
            A count of met requirements is not a chance of admission. Admission also depends
            on things no form can measure:
          </p>
          <ul className="mt-3 list-disc space-y-1.5 pl-5 text-[0.9375rem] leading-relaxed text-grey">
            <li>each programme&rsquo;s own module requirements</li>
            <li>the other applicants, whom we cannot see</li>
            <li>a letter of motivation not yet written</li>
          </ul>
          <p className="mt-4 text-[0.9375rem] leading-relaxed text-grey">
            A &ldquo;Not met yet&rdquo; row is not a rejection either. Most of them say what to
            fix and in what order.
          </p>
          <Link
            href="/services/profile-evaluation"
            className="mt-5 inline-flex items-center gap-1.5 font-medium text-pink hover:text-blue-dark"
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
