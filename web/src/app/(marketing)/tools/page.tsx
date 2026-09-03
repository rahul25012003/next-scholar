import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Calculator,
  CurrencyCircleDollar,
  Exam,
  ListChecks,
  Percent,
  Stack,
} from "@phosphor-icons/react/ssr";
import { PageHero } from "@/components/marketing/page-hero";
import { Reveal } from "@/components/ui/reveal";
import { Accordion } from "@/components/ui/accordion";

export const metadata: Metadata = {
  title: "Free tools",
  description:
    "Six calculators and checklists, every one ungated: cost of living, the German grade formula, eight grade converters, the IELTS band rule, an ECTS credit check and a requirements checklist.",
  alternates: { canonical: "/tools" },
};

const tools = [
  {
    href: "/tools/requirements-check",
    icon: ListChecks,
    title: "Requirements checklist",
    lede: "Your profile against every published requirement for a destination. Met, not met, or cannot tell, with the source on each row.",
    detail: "The honest version of the admission predictor everyone else ships. Three states, no score.",
    tone: "bg-pastel-blue",
  },
  {
    href: "/tools/cost-of-living",
    icon: CurrencyCircleDollar,
    title: "Cost of living calculator",
    lede: "A year in Munich, Berlin, London, Dublin or five other cities, broken into line items you can edit.",
    detail: "Every range attributed to the body that publishes it, with the rupee figure labelled indicative.",
    tone: "bg-pastel-mint",
  },
  {
    href: "/tools/german-grade-calculator",
    icon: Calculator,
    title: "German grade calculator",
    lede: "Your CGPA or percentage on the German 1.0 to 4.0 scale, using the Modified Bavarian Formula.",
    detail: "Shows the formula, your numbers substituted into it, and every intermediate step.",
    tone: "bg-pastel-peach",
  },
  {
    href: "/tools/ects-check",
    icon: Stack,
    title: "ECTS credit check",
    lede: "Total, core subject and mathematics credits against a programme's stated requirements, and each gap.",
    detail: "This is how German Master's admission is actually decided, and it is almost never published.",
    tone: "bg-pastel-lilac",
  },
  {
    href: "/tools/ielts-band-calculator",
    icon: Exam,
    title: "IELTS band calculator",
    lede: "Four section scores to an overall band, with the half-band rounding rule shown, plus the per-section check.",
    detail: "The per-section minimum is where a good overall band still fails a language condition.",
    tone: "bg-pastel-rose",
  },
  {
    href: "/tools/grade-converter",
    icon: Percent,
    title: "Grade converters",
    lede: "CGPA to percentage, percentage to GPA on three scales, SGPA to CGPA credit weighted, and four more.",
    detail: "Each one names the convention it rests on rather than presenting it as a standard.",
    tone: "bg-pastel-blue",
  },
];

const faqs = [
  {
    q: "Why is none of this behind a signup?",
    a: "Because withholding an arithmetic result until someone hands over a phone number is the sharpest conversion mechanic in this market, and it is the exact opposite of the position this business takes. If a calculator can answer your question, you should get the answer. If you then want someone to talk to, the consultation is there and it is priced in public.",
  },
  {
    q: "Do you store what I type into these?",
    a: "No. Every calculator on this site runs entirely in your browser. There is no form action behind any of them, no request is made when you type, and nothing is written to an account, because there is no account involved. Close the tab and the numbers are gone.",
  },
  {
    q: "Why do they all show their working?",
    a: "A number you cannot check is a number you have to trust, and asking to be trusted is what this platform exists not to do. The formula, your own figures inside it, and each intermediate step are on the page so that you can verify the result by hand or hand it to someone who will.",
  },
  {
    q: "Why is there no admission chance or probability anywhere?",
    a: "Because we would have to invent it. Admission turns on programme-specific module requirements, the strength of a cohort we cannot see, and documents nobody has written yet. None of that is computable from a form, and every platform that prints a percentage on it is guessing. Our own guardrails forbid it in code, not just in policy.",
  },
  {
    q: "Are these figures current?",
    a: "Each one carries the date it was written into the site and the official body it came from. None of them has yet been re-checked at source by a named person, and every page says so where the figures appear rather than in a footnote. A confident date on a stale figure is worse than no date at all.",
  },
];

export default function ToolsPage() {
  return (
    <>
      <PageHero
        title="Six tools, none of them behind a form"
        lede="These exist because the questions they answer are answerable, and because the industry standard is to answer them only after collecting a phone number. Every one shows its arithmetic, names its source, and states what it does not decide."
        aside={
          <div className="rounded-panel border border-line bg-paper p-6 shadow-card">
            <p className="text-[0.8125rem] font-semibold text-navy-900">The rules they share</p>
            <ul className="mt-3 space-y-2 text-[0.875rem] leading-relaxed text-body">
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

      <section className="band bg-paper">
        <div className="shell grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {tools.map((tool, index) => {
            const Icon = tool.icon;
            return (
              <Reveal key={tool.href} delay={index * 0.05}>
                <Link
                  href={tool.href}
                  className="group flex h-full flex-col rounded-panel border border-line bg-paper p-7 shadow-card transition-shadow duration-300 hover:shadow-lift"
                >
                  <span
                    aria-hidden
                    className={`grid h-11 w-11 place-items-center rounded-input ${tool.tone}`}
                  >
                    <Icon size={22} className="text-navy-900" />
                  </span>
                  <h2 className="mt-5 font-display text-[1.125rem] font-bold text-navy-900">
                    {tool.title}
                  </h2>
                  <p className="mt-3 text-[0.9375rem] leading-relaxed text-body">{tool.lede}</p>
                  <p className="mt-3 flex-1 text-[0.875rem] leading-relaxed text-muted">
                    {tool.detail}
                  </p>
                  <span className="mt-5 inline-flex items-center gap-2 text-[0.9375rem] font-medium text-blue-600">
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

      <section className="band bg-surface">
        <div className="shell max-w-3xl">
          <h2 className="font-display text-3xl font-bold text-navy-900 md:text-[2.25rem]">
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
