import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "@phosphor-icons/react/ssr";
import { guideFor, guides } from "@/content/guides";
import { photos, photoUrl } from "@/content/photos";
import {
  Checklist,
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
import { ButtonLink } from "@/components/ui/button";
import { primaryCta } from "@/content/site";
import { countryInSentence } from "@/lib/country";

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
  { id: "academic", title: "Academic requirements" },
  { id: "language", title: "Language" },
  { id: "intakes", title: "Intakes and deadlines" },
  { id: "timeline", title: "Timeline" },
  { id: "visa", title: "Visa steps" },
  { id: "documents", title: "Visa documents" },
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
    title: `Studying in ${countryInSentence(guide.country)}`,
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

  return (
    <>
      <section className="relative overflow-hidden border-b border-line bg-blue-dark">
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
          className="absolute inset-0 bg-[linear-gradient(180deg,rgba(32,91,173,0.55)_0%,rgba(32,91,173,0.88)_100%)]"
        />
        {/* pad-around: the copy used to start flush under the header and the
            buttons ended a few pixels above the section's bottom edge. */}
        <div className="shell rise relative pad-around">
          <div className="flex items-center gap-3">
            <Image
              src={`https://flagcdn.com/w160/${guide.flagCode}.png`}
              alt=""
              width={96}
              height={72}
              className="h-12 w-auto rounded-sm ring-2 ring-white/50 md:h-14"
            />
            <p className="text-[1.0625rem] font-semibold text-white">{guide.country}</p>
          </div>
          <h1 className="mt-5 max-w-3xl text-white">
            {guide.headline}
          </h1>
          <p className="mt-6 max-w-2xl leading-relaxed text-white/80">
            {guide.lede}
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            {/* Pink, because the default dark blue pill disappeared into the
                blue-washed photograph behind it. The second button's outline
                needs border-2: `.button` sets border to none, so a border
                colour on its own drew nothing. */}
            <ButtonLink href={primaryCta.href} size="lg" variant="pink">
              {primaryCta.label}
            </ButtonLink>
            {/* The outline variant's own hover fill is overridden by
                bg-transparent, so this states its hover in full: it fills
                white and the label turns blue. */}
            <ButtonLink
              href={`/destinations/${guide.slug}/costs`}
              size="lg"
              variant="outline"
              className="border-2 border-white/60 bg-transparent text-white hover:border-white hover:bg-white hover:text-blue-dark focus-visible:bg-white focus-visible:text-blue-dark"
            >
              Work out the cost first
            </ButtonLink>
          </div>
        </div>
      </section>

      <section className="band">
        <div className="shell grid gap-12 lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-14">
          <div className="lg:sticky lg:top-24 lg:self-start">
            <JumpList items={sections} className="hidden lg:block" />
            <details className="rounded-card border border-line bg-light p-5 lg:hidden">
              <summary className="cursor-pointer text-[0.875rem] font-semibold text-blue-dark">
                Jump to a section
              </summary>
              <ul className="mt-3 grid gap-1.5 sm:grid-cols-2">
                {sections.map((section) => (
                  <li key={section.id}>
                    <a
                      href={`#${section.id}`}
                      className="block py-1 text-[0.875rem] text-pink"
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
                  { href: `/destinations/${guide.slug}/costs`, label: "Costs and funding" },
                  { href: `/destinations/${guide.slug}/scholarships`, label: "Scholarships" },
                  { href: `/destinations/${guide.slug}/jobs`, label: "Working while you study" },
                  { href: `/destinations/${guide.slug}/post-study-work`, label: "Working after you graduate" },
                ].map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="button button--light"
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
                lede={
                  guide.routes.length === 1
                    ? "One route, with one set of rules and advice."
                    : "Each route has its own rules, so each gets its own advice."
                }
              >
                <div className="grid gap-5 md:grid-cols-2">
                  {guide.routes.map((route) => {
                    return (
                      <article
                        key={route.slug}
                        className="flex flex-col rounded-card border border-line bg-white p-6"
                      >
                        <h3 className="text-blue-dark h--5">
                          {route.name}
                        </h3>
                        <p className="mt-3 flex-1 text-[0.9375rem] leading-relaxed text-grey">
                          {route.summary}
                        </p>
                      </article>
                    );
                  })}
                </div>
              </GuideSection>

              <Link
                href={`/destinations/${guide.slug}/costs`}
                className="group my-10 flex items-center justify-between gap-6 rounded-panel bg-blue-dark p-7 text-white shadow-card transition-[translate,box-shadow] duration-200 hover:-translate-y-0.5 hover:shadow-lift md:p-9"
              >
                <span>
                  <span className="eyebrow text-blue-light">Money</span>
                  <span className="mt-2 block font-display text-step-1 font-extrabold text-white">
                    Costs and funding in {countryInSentence(guide.country)}
                  </span>
                  <span className="mt-2 block max-w-xl text-[0.9375rem] leading-relaxed text-white/85">
                    Tuition, living costs, the money the visa needs to see, fees, health
                    insurance and our fee, on their own page.
                  </span>
                </span>
                <ArrowRight
                  size={22}
                  weight="bold"
                  aria-hidden
                  className="shrink-0 transition-transform duration-200 group-hover:translate-x-1"
                />
              </Link>

              <GuideSection
                id="academic"
                eyebrow="Eligibility"
                title="Academic requirements"
                lede="What decides whether you can apply at all, before you choose a university."
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
                lede="Which test, what score, and how long it stays valid. Booking the wrong one is a common, costly mistake."
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
                lede="Real dates, not month names, so you know exactly when to apply."
              >
                <IntakeTable intakes={guide.intakes} />
              </GuideSection>

              <GuideSection
                id="timeline"
                eyebrow="Timing"
                title="Working backwards from the flight"
                lede="Planned backwards from your flight. Each route has one step that decides whether you can make the intake, and its row says so."
              >
                <Timeline steps={guide.timeline} />
              </GuideSection>

              <GuideSection
                id="visa"
                eyebrow="Visa"
                title="The steps, in order"
                lede="Each step says what is held up if it is late."
              >
                <Checklist items={guide.visaSteps} />
              </GuideSection>

              <GuideSection
                id="documents"
                eyebrow="Visa"
                title="The document file"
                lede="We check each of these against your original or with the institution that issued it. We never edit a document."
              >
                <Checklist items={guide.visaDocuments} ordered={false} />
              </GuideSection>

              <GuideSection
                id="arrival"
                eyebrow="Practicalities"
                title="After you arrive"
                lede="The first three weeks follow an order. Getting it wrong costs time you will not have once your course starts."
              >
                <Checklist items={guide.postArrival} />
              </GuideSection>

              <GuideSection
                id="work"
                eyebrow="Practicalities"
                title="Work rights"
                lede="Set out in hours and days. Breaking a work condition is an immigration problem, not an employment one."
              >
                <RequirementList items={guide.workRights} />
              </GuideSection>

              <GuideSection
                id="post-study"
                eyebrow="After"
                title="After you graduate"
                lede="Other sites often have this figure out of date. Ours shows the date it changes on."
              >
                <RequirementList items={guide.postStudy} />
              </GuideSection>

              <GuideSection
                id="pitfalls"
                eyebrow="Honesty"
                title="What actually goes wrong"
                lede="Real mistakes, including two we published wrongly ourselves and have corrected on this page."
              >
                <Pitfalls items={guide.pitfalls} />
              </GuideSection>

              <GuideSection id="faq" eyebrow="Questions" title="Asked most often">
                <Accordion items={guide.faqs} name={`faq-${guide.slug}`} />
              </GuideSection>
            </div>

            <div className="mt-14 rounded-panel border border-line bg-light p-7 md:p-9">
              <h2 className="text-blue-dark">
                Check yourself against this list before you pay anyone
              </h2>
              <p className="mt-3 max-w-2xl text-[0.9375rem] leading-relaxed text-grey">
                The requirements checklist compares your profile with everything on this
                page. Each item shows as Met, Not met yet or Needs checking, with no
                probability and no signup.
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
              <h2 className="eyebrow text-grey">
                The other two
              </h2>
              <ul className="mt-4 grid gap-4 sm:grid-cols-2">
                {guides
                  .filter((other) => other.slug !== guide.slug)
                  .map((other) => (
                    <li key={other.slug}>
                      <Link
                        href={`/destinations/${other.slug}`}
                        className="group flex items-center justify-between gap-4 rounded-card border border-line bg-white p-5 transition-[border-color,box-shadow] hover:border-pink hover:"
                      >
                        <span>
                          <span className="block font-display font-semibold text-blue-dark">
                            {other.country}
                          </span>
                          <span className="mt-0.5 block text-[0.875rem] text-grey">
                            {other.routes.length === 1
                              ? other.routes[0].name
                              : `${other.routes.length} routes`}
                          </span>
                        </span>
                        <ArrowRight
                          size={16}
                          weight="bold"
                          aria-hidden
                          className="shrink-0 text-grey transition-[color,transform] group-hover:translate-x-0.5 group-hover:text-pink"
                        />
                      </Link>
                    </li>
                  ))}
              </ul>
            </nav>
          </div>
        </div>
      </section>
    </>
  );
}
