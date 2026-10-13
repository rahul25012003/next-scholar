import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "@phosphor-icons/react/ssr";
import { PageHero } from "@/components/marketing/page-hero";
import { RequirementsCheck } from "@/components/tools/requirements-check";
import { EvaluationRequestForm } from "@/components/marketing/evaluation-request-form";

export const metadata: Metadata = {
  title: "Free profile evaluation",
  description:
    "See where you stand against the published requirements before you pay anyone. Run the check yourself, or ask a person to confirm it in writing.",
  alternates: { canonical: "/services/profile-evaluation" },
};

export default function ProfileEvaluationPage() {
  return (
    <>
      <PageHero
        title="Free profile evaluation"
        lede="We check your academic record and language result against each destination's published threshold, and whether the dMAT applies to you in Germany. Run it below for free, or ask a person to confirm it in writing."
      />

      <section className="band">
        <div className="shell">
          <Link
            href="/services"
            className="inline-flex items-center gap-1.5 text-[0.875rem] font-medium text-pink hover:text-blue-dark"
          >
            <ArrowLeft size={14} weight="bold" aria-hidden />
            All services
          </Link>
          <h2 className="mt-5 text-blue-dark">
            Step one: run the check yourself
          </h2>
          <p className="mt-2 max-w-2xl text-[0.9375rem] leading-relaxed text-grey">
            The same figures a written evaluation uses. Press Submit to see your result; it is
            worked out in your browser and not sent anywhere.
          </p>
          <div className="mt-7">
            <RequirementsCheck />
          </div>
        </div>
      </section>

      <section className="band">
        <div className="shell max-w-3xl">
          <h2 className="text-blue-dark">
            Step two: ask a person to confirm it in writing
          </h2>
          <p className="mt-2 text-[0.9375rem] leading-relaxed text-grey">
            Once this form can reach us, a counsellor will read your transcript and reply
            within three working days. It cannot yet: nothing you enter is sent. You can
            still fill it in and save your answers for later.
          </p>
          <div className="mt-7 rounded-panel border border-line bg-white p-6 md:p-8">
            <EvaluationRequestForm />
          </div>
        </div>
      </section>
    </>
  );
}
