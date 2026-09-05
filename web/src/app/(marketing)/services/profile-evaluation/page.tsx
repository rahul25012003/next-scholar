import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "@phosphor-icons/react/ssr";
import { PageHero } from "@/components/marketing/page-hero";
import { RequirementsCheck } from "@/components/tools/requirements-check";
import { EvaluationRequestForm } from "@/components/marketing/evaluation-request-form";

export const metadata: Metadata = {
  title: "Free profile evaluation",
  description:
    "A written read of where you actually stand against the published requirements, before you pay anyone anything. Run the check yourself, or ask a person to confirm it in writing.",
  alternates: { canonical: "/services/profile-evaluation" },
};

export default function ProfileEvaluationPage() {
  return (
    <>
      <PageHero
        title="Free profile evaluation"
        lede="Your academic record and your language result, checked against the published threshold for each destination, plus whether the dMAT applies to you in Germany. Run it below, instantly and ungated. Ask for the written version when you want a person to confirm it."
      />

      <section className="band bg-paper">
        <div className="shell">
          <Link
            href="/services"
            className="inline-flex items-center gap-1.5 text-[0.875rem] font-medium text-blue-600 hover:text-blue-500"
          >
            <ArrowLeft size={14} weight="bold" aria-hidden />
            All services
          </Link>
          <h2 className="mt-5 font-display text-[1.5rem] font-bold text-navy-900">
            Step one: run the check yourself
          </h2>
          <p className="mt-2 max-w-2xl text-[0.9375rem] leading-relaxed text-body">
            The same figures a written evaluation reads, answered in your browser as you type.
            Nothing here is submitted anywhere.
          </p>
          <div className="mt-7">
            <RequirementsCheck />
          </div>
        </div>
      </section>

      <section className="band border-t border-line bg-surface">
        <div className="shell max-w-3xl">
          <h2 className="font-display text-[1.5rem] font-bold text-navy-900">
            Step two: ask a person to confirm it in writing
          </h2>
          <p className="mt-2 text-[0.9375rem] leading-relaxed text-body">
            A counsellor reads your actual transcript and replies within three working days
            once this is connected to a channel that can reach you. Fill it in now and keep
            your answers, or copy them and send them yourself in the meantime.
          </p>
          <div className="mt-7 rounded-panel border border-line bg-paper p-6 md:p-8">
            <EvaluationRequestForm />
          </div>
        </div>
      </section>
    </>
  );
}
