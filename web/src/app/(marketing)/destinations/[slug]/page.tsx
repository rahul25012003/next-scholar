import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "@phosphor-icons/react/ssr";
import { guideFor, guides, rateFor } from "@/content/guides";
import { destinations } from "@/content/destinations";
import { photos, photoUrl } from "@/content/photos";
import { CostOfLivingCalculator } from "@/components/tools/cost-of-living";
import {
  Checklist,
  FigureList,
  GuideSection,
  IntakeTable,
  LanguageTable,
  Pitfalls,
  RequirementList,
  Timeline,
  ToolLink,
  VerificationBanner,
} from "@/components/guides/blocks";
import { Accordion } from "@/components/ui/accordion";
import { JumpList } from "@/components/ui/jump-list";
import { StatusChip } from "@/components/ui/chip";
import { ButtonLink } from "@/components/ui/button";
import { primaryCta } from "@/content/site";

/** One landmark photograph per guide, reusing the checked-by-eye set. */
const guidePhoto: Record<string, string> = {
  "united-kingdom": "united-kingdom",
  germany: "germany-public",
  ireland: "ireland",
};

/**
 * The sections this page renders, in order, with the anchor the jump list uses.
 * Kept next to the renderer rather than in the content module, because the
 * order is a presentation decision and the content is not.
 */
const sections = [
  { id: "routes", title: "Routes" },
  { id: "tuition", title: "Tuition" },
  { id: "living", title: "Cost of living" },
  { id: "funds", title: "Money for the visa" },
  { id: "academic", title: "Academic requirements" },
  { id: "language", title: "Language" },
  { id: "intakes", title: "Intakes and deadlines" },
  { id: "timeline", title: "Timeline" },
  { id: "visa", title: "Visa steps" },
  { id: "documents", title: "Visa documents" },
  { id: "fees", title: "Fees and charges" },
  { id: "insurance", title: "Health insurance" },
  { id: "arrival", title: "After you arrive" },
  { id: "work", title: "Work rights" },
  { id: "post-study", title: "After you graduate" },
  { id: "pitfalls", title: "What goes wrong" },
  { id: "faq", title: "Questions" },
];

export function generateStaticParams() {
  return guides.map((guide) => ({ slug: guide.slug }));
}

export async function generateMetadata(
  props: PageProps<"/destinations/[slug]">,
): Promise<Metadata> {
  const { slug } = await props.params;
  const guide = guideFor(slug);
  if (!guide) return {};
  return {
    title: `Studying in ${guide.country}`,
    description: guide.lede.slice(0, 200),
    alternates: { canonical: `/destinations/${guide.slug}` },
  };
}

export default async function DestinationGuidePage(
  props: PageProps<"/destinations/[slug]">,
) {
  const { slug } = await props.params;
  const guide = guideFor(slug);
  if (!guide) notFound();

  const photo = photos.destinations[guidePhoto[guide.slug]];
  const rate = rateFor(guide.currency);
  const rows = destinations.filter((row) =>
    guide.routes.some((route) => route.destinationSlug === row.slug),
  );

  return (
    <>
      <section className="relative overflow-hidden border-b border-line bg-navy-900">
        <Image
          src={photoUrl(photo, 1800, 700)}
          alt={photo.alt}
          width={1800}
          height={700}
          priority
          sizes="100vw"
          className="absolute inset-0 h-full w-full object-cover opacity-40"
        />
        <span
          aria-hidden
          className="absolute inset-0 bg-[linear-gradient(180deg,rgba(14,42,94,0.55)_0%,rgba(14,42,94,0.88)_100%)]"
        />
        <div className="shell relative py-16 md:py-24">
          <div className="flex items-center gap-3">
            <Image
              src={`https://flagcdn.com/w80/${guide.flagCode}.png`}
              alt=""
              width={40}
              height={30}
              className="h-6 w-auto rounded-xs ring-1 ring-white/40"
            />
            <p className="text-[0.875rem] font-medium text-white/75">{guide.country}</p>
          </div>
          <h1 className="mt-5 max-w-3xl font-display text-[2.25rem] font-extrabold leading-[1.08] tracking-[-0.03em] text-white md:text-[3.25rem]">
            {guide.headline}
          </h1>
          <p className="mt-6 max-w-2xl text-[1.0625rem] leading-relaxed text-white/80">
            {guide.lede}
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <ButtonLink href={primaryCta.href} size="lg">
              {primaryCta.label}
            </ButtonLink>
            <ButtonLink
              href="#living"
              size="lg"
              variant="outline"
              className="border-white/30 bg-transparent text-white hover:border-white hover:text-white"
            >
              Work out the cost first
            </ButtonLink>
          </div>
        </div>
      </section>

      <div className="shell grid gap-12 py-12 md:py-16 lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-14">
        <div className="lg:sticky lg:top-24 lg:self-start">
          <JumpList items={sections} className="hidden lg:block" />
          <details className="rounded-card border border-line bg-surface p-5 lg:hidden">
            <summary className="cursor-pointer text-[0.875rem] font-semibold text-navy-900">
              Jump to a section
            </summary>
            <ul className="mt-3 grid gap-1.5 sm:grid-cols-2">
              {sections.map((section) => (
                <li key={section.id}>
                  <a
                    href={`#${section.id}`}
                    className="block py-1 text-[0.875rem] text-blue-600"
                  >
                    {section.title}
                  </a>
                </li>
              ))}
            </ul>
          </details>
        </div>

        <div className="min-w-0">
          <VerificationBanner verification={guide.verification} />

          <nav aria-label="Read one topic on its own page" className="mt-6">
            <ul className="flex flex-wrap gap-2.5">
              {[
                { href: `/destinations/${guide.slug}/cost-of-studying`, label: "Cost of studying" },
                { href: `/destinations/${guide.slug}/cost-of-living`, label: "Cost of living" },
                { href: `/destinations/${guide.slug}/scholarships`, label: "Scholarships" },
                { href: `/destinations/${guide.slug}/jobs`, label: "Working while you study" },
                { href: `/destinations/${guide.slug}/post-study-work`, label: "Working after you graduate" },
              ].map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="inline-flex items-center rounded-full border border-line-strong bg-surface px-4 py-2 text-[0.8125rem] font-medium text-navy-900 transition-colors hover:border-blue-600 hover:text-blue-600"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="mt-10 space-y-0 [&>section:first-child]:border-t-0 [&>section:first-child]:pt-0">
            <GuideSection
              id="routes"
              eyebrow="Routes"
              title={`How ${guide.country} splits`}
              lede="Where a country pays us differently on different routes, it is two rows on our ledger and two sets of advice, not one."
            >
              <div className="grid gap-5 md:grid-cols-2">
                {guide.routes.map((route) => {
                  const row = rows.find((item) => item.slug === route.destinationSlug);
                  return (
                    <article
                      key={route.slug}
                      className="flex flex-col rounded-card border border-line bg-paper p-6"
                    >
                      <h3 className="font-display text-[1.125rem] font-bold text-navy-900">
                        {route.name}
                      </h3>
                      <p className="mt-3 flex-1 text-[0.9375rem] leading-relaxed text-body">
                        {route.summary}
                      </p>
                      {row && (
                        <dl className="mt-5 divide-y divide-line border-t border-line pt-4">
                          <div className="flex items-start justify-between gap-4 pb-3">
                            <dt className="text-[0.875rem] text-body">We earn</dt>
                            <dd className="flex flex-col items-end gap-1.5">
                              <span className="figures text-[0.9375rem] font-semibold text-navy-900">
                                {row.commission.display}
                              </span>
                              <StatusChip status={row.commission.status} />
                            </dd>
                          </div>
                          <div className="flex items-baseline justify-between gap-4 pt-3">
                            <dt className="text-[0.875rem] text-body">You pay us</dt>
                            <dd className="figures text-[0.9375rem] font-semibold text-navy-900">
                              {row.clientFee}
                            </dd>
                          </div>
                        </dl>
                      )}
                    </article>
                  );
                })}
              </div>
              <p className="mt-5 text-[0.875rem] leading-relaxed text-muted">
                Every commission figure on this site is published with its verification
                state attached, and the full method is on the{" "}
                <Link
                  href="/open-ledger"
                  className="font-medium text-blue-600 hover:text-blue-500"
                >
                  Open Ledger
                </Link>
                .
              </p>
            </GuideSection>

            <GuideSection
              id="tuition"
              eyebrow="Money"
              title="Tuition"
              lede="Each figure below carries a qualifier saying what it is, because a range read as a quote is how a budget goes wrong before it starts."
            >
              <FigureList figures={guide.tuition} />
            </GuideSection>

            <GuideSection
              id="living"
              eyebrow="Money"
              title="Cost of living, line by line"
              lede="Ungated on purpose. There is no form in front of this result and there is not going to be one. Every line is editable, so our published range and your actual rent can sit next to each other."
            >
              <CostOfLivingCalculator guide={guide} rate={rate} />
            </GuideSection>

            <GuideSection
              id="funds"
              eyebrow="Money"
              title="What the visa authority wants to see"
              lede="This is the section people underestimate. It is not the same question as what living there costs, and the two figures are not interchangeable."
            >
              <FigureList figures={guide.funds} />
            </GuideSection>

            <GuideSection
              id="academic"
              eyebrow="Eligibility"
              title="Academic requirements"
              lede="What decides whether you are eligible at all, ahead of any question about which university."
            >
              <RequirementList items={guide.academic} />
              {guide.slug === "germany" && (
                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  <ToolLink
                    href="/tools/german-grade-calculator"
                    title="Convert your grade to the German 1.0 to 4.0 scale"
                    note="The Modified Bavarian Formula, with the arithmetic on your own numbers shown in full. Free, no signup."
                  />
                  <ToolLink
                    href="/tools/ects-check"
                    title="Check your ECTS credits against a programme"
                    note="Total, core subject and mathematics credits, and what is missing. This is how German Master's admission is actually decided."
                  />
                </div>
              )}
            </GuideSection>

            <GuideSection
              id="language"
              eyebrow="Eligibility"
              title="Language qualifications"
              lede="Which test, at which level, and how long it lasts. Booking the wrong one is a common and expensive mistake."
            >
              <LanguageTable items={guide.language} />
              <div className="mt-6">
                <ToolLink
                  href="/tools/ielts-band-calculator"
                  title="Work out your IELTS overall band"
                  note="Four section scores, equal weighting, half-band rounding, and the descriptor for the band you land on."
                />
              </div>
            </GuideSection>

            <GuideSection
              id="intakes"
              eyebrow="Timing"
              title="Intakes and deadlines"
              lede="Dates, not month names. A month name has never told anyone when to submit anything."
            >
              <IntakeTable intakes={guide.intakes} />
            </GuideSection>

            <GuideSection
              id="timeline"
              eyebrow="Timing"
              title="Working backwards from the flight"
              lede="Built backwards on purpose. Every one of these routes has one step that decides whether the intake is reachable, and it is named in the row it belongs to."
            >
              <Timeline steps={guide.timeline} />
            </GuideSection>

            <GuideSection
              id="visa"
              eyebrow="Visa"
              title="The steps, in order"
              lede="Each step says what stops if it is late, because that is the part a list of requirements never tells you."
            >
              <Checklist items={guide.visaSteps} />
            </GuideSection>

            <GuideSection
              id="documents"
              eyebrow="Visa"
              title="The document file"
              lede="Assembled once, checked twice. We verify each of these against your original or with the issuing institution, and we never edit one."
            >
              <Checklist items={guide.visaDocuments} ordered={false} />
            </GuideSection>

            <GuideSection
              id="fees"
              eyebrow="Money"
              title="Fees and charges"
              lede="Government fees, test fees and provider fees, separated, because only some of them are refundable and none of them are optional."
            >
              <FigureList figures={guide.visaFees} />
            </GuideSection>

            <GuideSection
              id="insurance"
              eyebrow="Practicalities"
              title="Health insurance"
              lede="A visa requirement in two of our three destinations and an included benefit in the third. It is not the same question anywhere."
            >
              <RequirementList items={guide.insurance} />
            </GuideSection>

            <GuideSection
              id="arrival"
              eyebrow="Practicalities"
              title="After you arrive"
              lede="The first three weeks have a sequence, and getting it out of order costs time you do not have while a course is starting."
            >
              <Checklist items={guide.postArrival} />
            </GuideSection>

            <GuideSection
              id="work"
              eyebrow="Practicalities"
              title="Work rights"
              lede="Stated as hours and days, not as reassurance. Breaching a work condition is an immigration problem rather than an employment one."
            >
              <RequirementList items={guide.workRights} />
            </GuideSection>

            <GuideSection
              id="post-study"
              eyebrow="After"
              title="After you graduate"
              lede="The number most sites publish here is the one most often out of date. Ours carries the date it changes on."
            >
              <RequirementList items={guide.postStudy} />
            </GuideSection>

            <GuideSection
              id="pitfalls"
              eyebrow="Honesty"
              title="What actually goes wrong"
              lede="Named failures, including two we published incorrectly ourselves and have corrected on this page."
            >
              <Pitfalls items={guide.pitfalls} />
            </GuideSection>

            <GuideSection id="faq" eyebrow="Questions" title="Asked most often">
              <Accordion items={guide.faqs} name={`faq-${guide.slug}`} />
            </GuideSection>
          </div>

          <div className="mt-14 rounded-panel border border-line bg-surface p-7 md:p-9">
            <h2 className="font-display text-[1.375rem] font-bold text-navy-900">
              Check yourself against this list before you pay anyone
            </h2>
            <p className="mt-3 max-w-2xl text-[0.9375rem] leading-relaxed text-body">
              The requirements checklist runs your own profile against everything on this
              page and tells you which items you meet, which you do not, and which we
              cannot answer without a document. It states facts and never a probability,
              and it does not ask you to sign up.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <ButtonLink href={`/tools/requirements-check?destination=${guide.slug}`}>
                Run the checklist
                <ArrowRight size={15} weight="bold" aria-hidden />
              </ButtonLink>
              <ButtonLink href="/tools" variant="outline">
                All the free tools
              </ButtonLink>
            </div>
          </div>

          <nav aria-label="Other destinations" className="mt-12 border-t border-line pt-8">
            <h2 className="text-[0.75rem] font-semibold uppercase tracking-wide text-muted">
              The other two
            </h2>
            <ul className="mt-4 grid gap-4 sm:grid-cols-2">
              {guides
                .filter((other) => other.slug !== guide.slug)
                .map((other) => (
                  <li key={other.slug}>
                    <Link
                      href={`/destinations/${other.slug}`}
                      className="group flex items-center justify-between gap-4 rounded-card border border-line bg-paper p-5 transition-[border-color,box-shadow] hover:border-blue-600 hover:shadow-card"
                    >
                      <span>
                        <span className="block font-display text-[1.0625rem] font-semibold text-navy-900">
                          {other.country}
                        </span>
                        <span className="mt-0.5 block text-[0.875rem] text-muted">
                          {other.routes.length === 1
                            ? other.routes[0].name
                            : `${other.routes.length} routes`}
                        </span>
                      </span>
                      <ArrowRight
                        size={16}
                        weight="bold"
                        aria-hidden
                        className="shrink-0 text-muted transition-[color,transform] group-hover:translate-x-0.5 group-hover:text-blue-600"
                      />
                    </Link>
                  </li>
                ))}
            </ul>
          </nav>
        </div>
      </div>
    </>
  );
}
