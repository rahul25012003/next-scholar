import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Calculator,
  CurrencyCircleDollar,
  Exam,
  ListChecks,
  Percent,
  Scales,
  Stack,
} from "@phosphor-icons/react/ssr";
import { PageHero } from "@/components/marketing/page-hero";
import { Reveal } from "@/components/ui/reveal";
import { staggerDelay } from "@/lib/stagger";
import { Accordion } from "@/components/ui/accordion";

export const metadata: Metadata = {
  title: "Free tools",
  description:
    "Seven free calculators and checklists, no signup needed: cost of living, the German grade formula, eight grade converters, the IELTS band rule, an ECTS credit check, a requirements checklist and an English test comparison.",
  alternates: { canonical: "/tools" },
};

const tools = [
  {
    href: "/tools/requirements-check",
    icon: ListChecks,
    title: "Requirements checklist",
    lede: "Checks your profile against each published requirement for a destination. Each row says Met, Not met yet or Needs checking, with its source.",
    detail: "Three plain states. No score and no prediction.",
    tone: "bg-blue-light",
  },
  {
    href: "/tools/cost-of-living",
    icon: CurrencyCircleDollar,
    title: "Cost of living calculator",
    lede: "A year in London, Munich, Berlin, Dublin or a group of smaller cities, broken into line items you can edit.",
    detail: "Add your own tuition and funds figures to see the first year whole, gap or surplus included.",
    tone: "bg-blue-light",
  },
  {
    href: "/tools/german-grade-calculator",
    icon: Calculator,
    title: "German grade calculator",
    lede: "Your CGPA or percentage on the German 1.0 to 4.0 scale, using the Modified Bavarian Formula.",
    detail: "Shows the formula, your numbers substituted into it, and every intermediate step.",
    tone: "bg-blue-light",
  },
  {
    href: "/tools/ects-check",
    icon: Stack,
    title: "ECTS credit check",
    lede: "Total, core subject and mathematics credits against a programme's stated requirements, and each gap.",
    detail: "This is how German Master's admission is really decided, and it is almost never published.",
    tone: "bg-blue-light",
  },
  {
    href: "/tools/ielts-band-calculator",
    icon: Exam,
    title: "IELTS band calculator",
    lede: "Turns your four section scores into an overall band, shows the rounding rule, and checks each section.",
    detail: "A good overall band can still fail if one section is below its minimum.",
    tone: "bg-blue-light",
  },
  {
    href: "/tools/grade-converter",
    icon: Percent,
    title: "Grade converters",
    lede: "CGPA to percentage, percentage to GPA on three scales, SGPA to CGPA credit weighted, and five more.",
    detail: "Each one names the method it uses instead of calling it a standard.",
    tone: "bg-blue-light",
  },
  {
    href: "/tools/english-tests",
    icon: Scales,
    title: "English test comparison",
    lede: "IELTS, TOEFL iBT, PTE Academic and the Duolingo English Test, side by side on scale, format and UK visa status.",
    detail: "We do not convert scores between them. Conversion tables look precise, but they are not.",
    tone: "bg-blue-light",
  },
];

const faqs = [
  {
    q: "Why is none of this behind a signup?",
    a: "Because a calculator's answer should not cost you your phone number. If you then want to talk to someone, the consultation is there and its price is public.",
  },
  {
    q: "Do you store what I type into these?",
    a: "No. Every calculator runs entirely in your browser, so nothing you enter is sent or saved, and closing the tab clears it.",
  },
  {
    q: "Why do they all show their working?",
    a: "So you do not have to take the result on trust. The formula, your figures in it and each step are on the page, so you or anyone else can check it by hand.",
  },
  {
    q: "Why is there no admission chance or probability anywhere?",
    a: "Because we would have to make it up. Admission depends on each course's module requirements, the other applicants and documents not yet written, and none of that can be worked out from a form, so our code does not allow a percentage.",
  },
  {
    q: "Are these figures current?",
    a: "Each figure shows the date it was added and the official body it came from. None has yet been re-checked at source by a named person, and each page says so next to the figures.",
  },
];

export default function ToolsPage() {
  return (
    <>
      <PageHero
        title="Seven tools, none of them behind a form"
        lede="No signup and no phone number needed. Each tool shows its working, names its source and says what it cannot decide."
        aside={
          <div className="rounded-panel border border-line bg-white p-6">
            <p className="text-[0.8125rem] font-semibold text-blue-dark">The rules they share</p>
            <ul className="mt-3 space-y-2 text-[0.875rem] leading-relaxed text-grey">
              <li>No signup, ever, for any result</li>
              <li>The working shown, not just the answer</li>
              <li>The source named on every figure</li>
              <li>The limits stated with the result</li>
              <li>No probability, score or prediction anywhere</li>
              <li>Nothing you type leaves your browser</li>
            </ul>
          </div>
        }
      />

      <section className="band">
        <div className="shell grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {tools.map((tool, index) => {
            const Icon = tool.icon;
            return (
              <Reveal key={tool.href} delay={staggerDelay(index, 0.05)}>
                <Link
                  href={tool.href}
                  className=" group flex h-full flex-col rounded-panel border border-line bg-white p-7"
                >
                  <span
                    aria-hidden
                    className={`grid h-11 w-11 place-items-center rounded-input ${tool.tone}`}
                  >
                    <Icon size={22} className="text-blue-dark" />
                  </span>
                  <h2 className="mt-5 text-blue-dark h--5">
                    {tool.title}
                  </h2>
                  <p className="mt-3 text-[0.9375rem] leading-relaxed text-grey">{tool.lede}</p>
                  <p className="mt-3 flex-1 text-[0.875rem] leading-relaxed text-grey">
                    {tool.detail}
                  </p>
                  <span className="mt-5 inline-flex items-center gap-2 text-[0.9375rem] font-medium text-pink">
                    Open it
                    <ArrowRight
                      size={15}
                      weight="bold"
                      aria-hidden
                      className="transition-transform group-hover:translate-x-0.5"
                    />
                  </span>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </section>

      <section className="band">
        <div className="shell max-w-3xl">
          <h2 className="text-blue-dark">
            Asked about the tools
          </h2>
          <div className="mt-8">
            <Accordion items={faqs} name="tools-faq" />
          </div>
        </div>
      </section>
    </>
  );
}
