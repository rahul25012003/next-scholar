import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight } from "@phosphor-icons/react/ssr";
import { guideFor, guides, rateFor } from "@/content/guides";
import { scholarshipsFor, scholarshipScope } from "@/content/scholarships";
import { CostOfLivingCalculator } from "@/components/tools/cost-of-living";
import { FigureList, RequirementList } from "@/components/guides/blocks";
import { PageHero } from "@/components/marketing/page-hero";
import { ButtonLink } from "@/components/ui/button";

/**
 * The full guide's sections, given their own route and their own metadata.
 *
 * Nothing here is new research: every one of these reads the same
 * `DestinationGuide` (or, for scholarships, the same `scholarships` list) the
 * full guide page already renders. This exists because a search for "cost of
 * living in Germany for Indian students" should land on a page about that,
 * not on section eleven of a sixteen-section guide.
 */
const topics = {
  "cost-of-studying": {
    label: "Cost of studying",
    metaSuffix: "tuition",
  },
  "cost-of-living": {
    label: "Cost of living",
    metaSuffix: "cost of living",
  },
  scholarships: {
    label: "Scholarships",
    metaSuffix: "scholarships",
  },
  jobs: {
    label: "Working while you study",
    metaSuffix: "student work rights",
  },
  "post-study-work": {
    label: "Working after you graduate",
    metaSuffix: "post-study work rights",
  },
} as const;

type TopicKey = keyof typeof topics;
const topicKeys = Object.keys(topics) as TopicKey[];

export function generateStaticParams() {
  return guides.flatMap((guide) => topicKeys.map((topic) => ({ slug: guide.slug, topic })));
}

export async function generateMetadata(
  props: PageProps<"/destinations/[slug]/[topic]">,
): Promise<Metadata> {
  const { slug, topic } = await props.params;
  const guide = guideFor(slug);
  const meta = topics[topic as TopicKey];
  if (!guide || !meta) return {};
  return {
    title: `${meta.label}, ${guide.country}`,
    description: `${meta.metaSuffix[0].toUpperCase()}${meta.metaSuffix.slice(1)} in ${guide.country} for Indian students, sourced and dated.`,
    alternates: { canonical: `/destinations/${guide.slug}/${topic}` },
  };
}

export default async function DestinationTopicPage(
  props: PageProps<"/destinations/[slug]/[topic]">,
) {
  const { slug, topic } = await props.params;
  const guide = guideFor(slug);
  if (!guide || !(topic in topics)) notFound();
  const key = topic as TopicKey;
  const rate = rateFor(guide.currency);
  const otherTopics = topicKeys.filter((item) => item !== key);

  return (
    <>
      <PageHero
        title={`${topics[key].label} in ${guide.country}`}
        lede={heroLede(key, guide.country)}
      />

      <section className="band bg-paper">
        <div className="shell max-w-3xl">
          <Link
            href={`/destinations/${guide.slug}`}
            className="inline-flex items-center gap-1.5 text-[0.875rem] font-medium text-blue-600 hover:text-blue-500"
          >
            <ArrowLeft size={14} weight="bold" aria-hidden />
            The full {guide.country} guide
          </Link>

          <div className="mt-8">
            {key === "cost-of-studying" && <FigureList figures={guide.tuition} />}

            {key === "cost-of-living" && (
              <CostOfLivingCalculator guide={guide} rate={rate} />
            )}

            {key === "jobs" && <RequirementList items={guide.workRights} />}

            {key === "post-study-work" && <RequirementList items={guide.postStudy} />}

            {key === "scholarships" && (
              <div className="space-y-6">
                <p className="text-[0.9375rem] leading-relaxed text-body">
                  {scholarshipScope.note}
                </p>
                {scholarshipsFor(guide.slug).length === 0 ? (
                  <p className="rounded-card border border-dashed border-line-strong bg-surface p-6 text-[0.9375rem] leading-relaxed text-body">
                    Nothing on this short list is specific to {guide.country} yet. That is a
                    gap in what we have curated, not a claim that no scholarship exists here.
                  </p>
                ) : (
                  <ul className="space-y-5">
                    {scholarshipsFor(guide.slug).map((scholarship) => (
                      <li
                        key={scholarship.slug}
                        className="rounded-card border border-line bg-paper p-6"
                      >
                        <div className="flex flex-wrap items-baseline justify-between gap-3">
                          <h3 className="font-display text-[1.0625rem] font-bold text-navy-900">
                            {scholarship.name}
                          </h3>
                          <span className="text-[0.8125rem] text-muted">
                            {scholarship.funder}
                          </span>
                        </div>
                        <p className="mt-3 text-[0.9375rem] leading-relaxed text-body">
                          {scholarship.coverage.state === "stated"
                            ? scholarship.coverage.value
                            : `Not stated here. ${scholarship.coverage.reason}`}
                        </p>
                        <p className="mt-2 text-[0.875rem] leading-relaxed text-muted">
                          <span className="font-medium text-navy-900">Deadline: </span>
                          {scholarship.deadline.state === "stated"
                            ? scholarship.deadline.value
                            : `Not stated here. ${scholarship.deadline.reason}`}
                          {scholarship.deadline.state === "stated" &&
                            scholarship.deadline.qualifier && (
                              <span className="block">{scholarship.deadline.qualifier}</span>
                            )}
                        </p>
                        <p className="mt-2 text-[0.875rem] leading-relaxed text-body">
                          {scholarship.eligibility}
                        </p>
                        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-3">
                          <a
                            href={scholarship.link}
                            target="_blank"
                            rel="noreferrer noopener"
                            className="inline-flex items-center gap-1 text-[0.875rem] font-medium text-blue-600 hover:text-blue-500"
                          >
                            {scholarship.funder}&rsquo;s own page
                            <ArrowUpRight size={13} weight="bold" aria-hidden />
                          </a>
                          <span className="text-[0.75rem] text-muted">
                            Source: {scholarship.source}, written down{" "}
                            <span className="figures">{scholarship.statedOn}</span>
                          </span>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>

          <nav aria-label="Other topics" className="mt-14 border-t border-line pt-8">
            <h2 className="text-[0.75rem] font-semibold uppercase tracking-wide text-muted">
              Also about {guide.country}
            </h2>
            <ul className="mt-4 flex flex-wrap gap-2.5">
              {otherTopics.map((item) => (
                <li key={item}>
                  <Link
                    href={`/destinations/${guide.slug}/${item}`}
                    className="inline-flex items-center rounded-full border border-line-strong bg-paper px-4 py-2 text-[0.8125rem] font-medium text-navy-900 transition-colors hover:border-blue-600 hover:text-blue-600"
                  >
                    {topics[item].label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="mt-10">
            <ButtonLink href={`/tools/requirements-check?destination=${guide.slug}`}>
              Check your own eligibility for {guide.country}
            </ButtonLink>
          </div>
        </div>
      </section>
    </>
  );
}

function heroLede(topic: TopicKey, country: string): string {
  switch (topic) {
    case "cost-of-studying":
      return `Published tuition figures for ${country}, each with the qualifier that says what it actually is: a statutory minimum, a typical range, or an indicative estimate.`;
    case "cost-of-living":
      return `The same line-by-line, editable calculator the full ${country} guide runs, ungated and with every figure sourced.`;
    case "scholarships":
      return `National and cross-institutional schemes actually open to Indian students going to ${country}, not a university's own marketing list.`;
    case "jobs":
      return `What the visa actually permits while you study in ${country}, stated as hours and days rather than as reassurance.`;
    case "post-study-work":
      return `How long you can stay and work in ${country} after you graduate, and on what conditions.`;
  }
}
