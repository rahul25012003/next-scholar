import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "@phosphor-icons/react/ssr";
import { stages } from "@/content/process";
import { PageHero } from "@/components/marketing/page-hero";
import { ButtonLink } from "@/components/ui/button";
import { primaryCta } from "@/content/site";

/**
 * One page per stage, so a stage can be linked to on its own rather than only
 * read as row eleven of a long list. The stage model itself already drives
 * three surfaces (this, the homepage timeline, and the portal progress view);
 * what is added here is only the pointers to pages that already exist, hand
 * picked per stage, not invented to fill a page nobody asked for.
 */
const relatedLinks: Record<string, { label: string; href: string }[]> = {
  consultation: [{ label: "Book the consultation", href: "/book-consultation" }],
  shortlist: [
    { label: "Search the catalogue", href: "/universities" },
    { label: "Your saved shortlist", href: "/shortlist" },
  ],
  agreement: [{ label: "Refund and cancellation windows", href: "/refund-policy" }],
  documents: [{ label: "What we will not do to a document", href: "/anti-fraud-policy" }],
  applications: [],
  offers: [],
  finance: [
    { label: "Cost of living calculator", href: "/tools/cost-of-living" },
    { label: "Scholarships", href: "/scholarships" },
  ],
  visa: [{ label: "Visa steps and documents, per destination", href: "/destinations" }],
  "pre-departure": [{ label: "After you arrive, per destination", href: "/destinations" }],
  arrival: [],
  outcome: [
    { label: "Our numbers, one source", href: "/our-numbers" },
    { label: "The Open Ledger", href: "/open-ledger" },
  ],
};

export function generateStaticParams() {
  return stages.map((stage) => ({ stage: stage.key }));
}

export async function generateMetadata(
  props: PageProps<"/process/[stage]">,
): Promise<Metadata> {
  const { stage: key } = await props.params;
  const stage = stages.find((item) => item.key === key);
  if (!stage) return {};
  return {
    title: stage.name,
    description: stage.summary,
    alternates: { canonical: `/process/${stage.key}` },
  };
}

export default async function StagePage(props: PageProps<"/process/[stage]">) {
  const { stage: key } = await props.params;
  const index = stages.findIndex((item) => item.key === key);
  if (index === -1) notFound();
  const stage = stages[index];
  const previous = stages[index - 1];
  const next = stages[index + 1];
  const links = relatedLinks[stage.key] ?? [];

  return (
    <>
      <PageHero
        title={`${index + 1}. ${stage.name}`}
        lede={stage.summary}
      />

      <section className="band">
        <div className="shell max-w-3xl">
          <Link
            href="/#process"
            className="inline-flex items-center gap-1.5 text-[0.875rem] font-medium text-pink hover:text-blue-dark"
          >
            <ArrowLeft size={14} weight="bold" aria-hidden />
            All eleven stages
          </Link>

          <div className="mt-8 rounded-panel border border-line bg-light p-6 md:p-7">
            <h2 className="eyebrow text-grey">
              What you receive
            </h2>
            <p className="mt-2 leading-relaxed text-blue-dark">
              {stage.deliverable}
            </p>
          </div>

          {links.length > 0 && (
            <div className="mt-8">
              <h2 className="eyebrow text-grey">
                Related on this site
              </h2>
              <ul className="mt-3 flex flex-wrap gap-2.5">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="button button--light"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-10 flex flex-wrap gap-3">
            <ButtonLink href={primaryCta.href}>{primaryCta.label}</ButtonLink>
          </div>

          <nav
            aria-label="Adjacent stages"
            className="mt-14 flex flex-wrap items-center justify-between gap-4 border-t border-line pt-8"
          >
            {previous ? (
              <Link
                href={`/process/${previous.key}`}
                className="group flex items-center gap-2 text-[0.9375rem] font-medium text-blue-dark hover:text-pink"
              >
                <ArrowLeft size={15} weight="bold" aria-hidden />
                <span>
                  <span className="block text-[0.75rem] text-grey">Before this</span>
                  {previous.name}
                </span>
              </Link>
            ) : (
              <span />
            )}
            {next ? (
              <Link
                href={`/process/${next.key}`}
                className="group flex items-center gap-2 text-right text-[0.9375rem] font-medium text-blue-dark hover:text-pink"
              >
                <span>
                  <span className="block text-[0.75rem] text-grey">After this</span>
                  {next.name}
                </span>
                <ArrowRight size={15} weight="bold" aria-hidden />
              </Link>
            ) : (
              <span />
            )}
          </nav>
        </div>
      </section>
    </>
  );
}
