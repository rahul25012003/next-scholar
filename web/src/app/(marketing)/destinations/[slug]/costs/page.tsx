import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "@phosphor-icons/react/ssr";
import { guideFor, guides, rateFor } from "@/content/guides";
import { destinations } from "@/content/destinations";
import { CostOfLivingCalculator } from "@/components/tools/cost-of-living";
import { FigureList, GuideSection, RequirementList } from "@/components/guides/blocks";
import { PageHero } from "@/components/marketing/page-hero";
import { JumpList } from "@/components/ui/jump-list";
import { StatusChip } from "@/components/ui/chip";
import { ButtonLink } from "@/components/ui/button";
import { countryInSentence } from "@/lib/country";

/**
 * Everything about money for one destination, on its own page, so the main
 * guide can stay on what decides admission: routes, requirements, dates and
 * the visa. Each guide links here, and this page links back.
 */
const sections = [
  { id: "tuition", title: "Tuition" },
  { id: "living", title: "Cost of living" },
  { id: "funds", title: "Money for the visa" },
  { id: "fees", title: "Fees and charges" },
  { id: "insurance", title: "Health insurance" },
  { id: "our-fee", title: "What you pay us" },
];

export function generateStaticParams() {
  return guides.map((guide) => ({ slug: guide.slug }));
}

export async function generateMetadata(
  props: PageProps<"/destinations/[slug]/costs">,
): Promise<Metadata> {
  const { slug } = await props.params;
  const guide = guideFor(slug);
  if (!guide) return {};
  return {
    title: `Costs and funding in ${countryInSentence(guide.country)}`,
    description: `Tuition, living costs, the money the visa needs to see, fees and health insurance for studying in ${countryInSentence(guide.country)}.`,
    alternates: { canonical: `/destinations/${guide.slug}/costs` },
  };
}

export default async function DestinationCostsPage(
  props: PageProps<"/destinations/[slug]/costs">,
) {
  const { slug } = await props.params;
  const guide = guideFor(slug);
  if (!guide) notFound();

  const rate = rateFor(guide.currency);
  const rows = destinations.filter((row) =>
    guide.routes.some((route) => route.destinationSlug === row.slug),
  );

  return (
    <>
      <PageHero
        title={`Costs and funding in ${countryInSentence(guide.country)}`}
        lede="Tuition, living costs, the money the visa needs to see, fees and insurance, all on one page."
      />

      <section className="band">
        <div className="shell grid gap-12 lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-14">
          <div className="lg:sticky lg:top-24 lg:self-start">
            <Link
              href={`/destinations/${guide.slug}`}
              className="inline-flex items-center gap-1.5 text-[0.875rem] font-medium text-pink hover:text-blue-dark"
            >
              <ArrowLeft size={14} weight="bold" aria-hidden />
              Back to the {guide.country} guide
            </Link>
            <JumpList items={sections} className="mt-6 hidden lg:block" />
          </div>

          <div className="min-w-0 space-y-0 [&>section:first-child]:border-t-0 [&>section:first-child]:pt-0">
            <GuideSection
              id="tuition"
              eyebrow="Money"
              title="Tuition"
              lede="Each figure says exactly what it covers, so a range is never read as a quote."
            >
              <FigureList figures={guide.tuition} />
            </GuideSection>

            <GuideSection
              id="living"
              eyebrow="Money"
              title="Cost of living, line by line"
              lede="Change any line to match your own rent and spending. No sign-up needed."
            >
              <CostOfLivingCalculator guide={guide} rate={rate} heading="h3" />
            </GuideSection>

            <GuideSection
              id="funds"
              eyebrow="Money"
              title="Money the visa needs to see"
              lede="This is not the same as what living there costs. Plan for both figures."
            >
              <FigureList figures={guide.funds} />
            </GuideSection>

            <GuideSection
              id="fees"
              eyebrow="Money"
              title="Fees and charges"
              lede="Government, test and provider fees, listed separately. Only some can be refunded."
            >
              <FigureList figures={guide.visaFees} />
            </GuideSection>

            <GuideSection
              id="insurance"
              eyebrow="Money"
              title="Health insurance"
              lede="What you need, and whether it is a visa requirement here."
            >
              <RequirementList items={guide.insurance} />
            </GuideSection>

            <GuideSection
              id="our-fee"
              eyebrow="Our fee"
              title="What you pay us"
              lede="Our fee for each route, with what the university pays us next to it."
            >
              <div className="grid gap-5 md:grid-cols-2">
                {rows.map((row) => (
                  <article key={row.slug} className="rounded-card border border-line bg-white p-6">
                    <h3 className="text-blue-dark h--5">{row.route ?? row.country}</h3>
                    <dl className="mt-4 divide-y divide-line border-t border-line">
                      <div className="flex items-baseline justify-between gap-4 py-3">
                        <dt className="text-[0.875rem] text-grey">You pay us</dt>
                        <dd className="figures text-[0.9375rem] font-semibold text-blue-dark">
                          {row.clientFee}
                        </dd>
                      </div>
                      <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-2 pt-3">
                        <dt className="text-[0.875rem] text-grey">The university pays us</dt>
                        <dd className="ml-auto flex shrink-0 flex-col items-end gap-1.5">
                          <span className="figures text-[0.9375rem] font-semibold text-blue-dark">
                            {row.commission.display}
                          </span>
                          <StatusChip status={row.commission.status} />
                        </dd>
                      </div>
                    </dl>
                  </article>
                ))}
              </div>
            </GuideSection>

            <div className="mt-14 flex flex-wrap gap-3 border-t border-line pt-8">
              <ButtonLink href={`/destinations/${guide.slug}`}>
                <ArrowLeft size={15} weight="bold" aria-hidden />
                Back to the {guide.country} guide
              </ButtonLink>
              <ButtonLink href={`/destinations/${guide.slug}/scholarships`} variant="outline">
                Scholarships in {countryInSentence(guide.country)}
                <ArrowRight size={15} weight="bold" aria-hidden />
              </ButtonLink>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
