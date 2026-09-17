import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "@phosphor-icons/react/ssr";
import { ToolPage } from "@/components/tools/shell";

export const metadata: Metadata = {
  title: "English test comparison",
  description:
    "IELTS, TOEFL iBT, PTE Academic and the Duolingo English Test compared on scale, sections, format and whether it is typically accepted for a UK student visa application. No score converts between them here.",
  alternates: { canonical: "/tools/english-tests" },
};

type Test = {
  name: string;
  scale: string;
  sections: string;
  format: string;
  validity: string;
  ukviSelt: string;
  officialUrl: string;
  officialLabel: string;
};

const tests: Test[] = [
  {
    name: "IELTS Academic",
    scale: "0 to 9, in half bands",
    sections: "Listening, Reading, Writing, Speaking, each scored separately and averaged to an overall band",
    format: "Speaking is a face to face or video interview; the other three are written or computer delivered depending on the centre",
    validity: "Two years from the test date, at most institutions",
    ukviSelt: "The IELTS for UKVI variant, taken at an approved centre, has historically been on the UK's Secure English Language Test list. Standard IELTS Academic without the UKVI label has not always qualified for the visa route even where a university accepts it for admission",
    officialUrl: "https://www.ielts.org/",
    officialLabel: "ielts.org",
  },
  {
    name: "TOEFL iBT",
    scale: "0 to 120, four sections of 0 to 30 each",
    sections: "Reading, Listening, Speaking, Writing",
    format: "Entirely computer delivered, including the speaking section, which is recorded rather than face to face",
    validity: "Two years from the test date, at most institutions",
    ukviSelt: "Has not historically appeared on the UK's Secure English Language Test list, so it has not usually been usable for the Student visa application itself even where a university accepts it for admission",
    officialUrl: "https://www.ets.org/toefl.html",
    officialLabel: "ets.org/toefl",
  },
  {
    name: "PTE Academic",
    scale: "10 to 90",
    sections: "Reported as Speaking & Writing, Reading and Listening, from an integrated set of tasks rather than four separate papers",
    format: "Entirely computer delivered in one sitting, roughly two hours",
    validity: "Two years from the test date, at most institutions",
    ukviSelt: "The PTE Academic UKVI variant has historically been on the UK's Secure English Language Test list",
    officialUrl: "https://www.pearsonpte.com/",
    officialLabel: "pearsonpte.com",
  },
  {
    name: "Duolingo English Test",
    scale: "10 to 160",
    sections: "Adaptive, computer-scored tasks across reading, writing, speaking and listening skills, reported as one overall score plus sub-scores",
    format: "Taken online from home, on your own device, proctored remotely; results typically in about two days",
    validity: "Two years from the test date, at most institutions",
    ukviSelt: "Has not historically appeared on the UK's Secure English Language Test list, even though a growing number of universities, especially in Germany, accept it directly for admission",
    officialUrl: "https://englishtest.duolingo.com/",
    officialLabel: "englishtest.duolingo.com",
  },
];

export default function EnglishTestsPage() {
  return (
    <ToolPage
      title="Which English test, and what it actually measures"
      lede="Scale, format and whether it has historically counted for a UK student visa application, side by side. No table here converts a score from one test into a score on another: publishers occasionally offer their own concordance tables, and a university's own stated minimum on its own test governs, not this page."
      foot={
        <div className="max-w-3xl">
          <h2 className="text-blue-dark">
            Why there is no conversion table here
          </h2>
          <p className="mt-3 text-[0.9375rem] leading-relaxed text-grey">
            A &ldquo;PTE 62 equals IELTS 6.5&rdquo; table looks precise and is not: the tests measure
            different things in different proportions, publishers revise their own
            concordance guidance periodically, and an admissions office reads the score your
            offer letter names, not an equivalence somebody else computed. Book the test your
            target programme actually names.
          </p>
          <p className="mt-4 text-[0.9375rem] leading-relaxed text-grey">
            The Secure English Language Test column is the single most consequential fact
            on this page and the one most likely to be out of date by the time you read it.
            Confirm the current approved list before booking anything for a UK Student visa
            application.
          </p>
          <Link
            href="/tools/ielts-band-calculator"
            className="mt-5 inline-flex items-center gap-1.5 font-medium text-pink hover:text-blue-dark"
          >
            The IELTS band calculator, with the rounding rule shown
            <ArrowUpRight size={14} weight="bold" aria-hidden />
          </Link>
        </div>
      }
    >
      <div className="space-y-6">
        {tests.map((test) => (
          <article key={test.name} className="rounded-panel border border-line bg-white p-6 md:p-7">
            <div className="flex flex-wrap items-baseline justify-between gap-3">
              <h2 className="text-blue-dark h--5">
                {test.name}
              </h2>
              <a
                href={test.officialUrl}
                target="_blank"
                rel="noreferrer noopener"
                className="inline-flex items-center gap-1 text-[0.8125rem] font-medium text-pink hover:text-blue-dark"
              >
                {test.officialLabel}
                <ArrowUpRight size={12} weight="bold" aria-hidden />
              </a>
            </div>
            <dl className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <dt className="eyebrow text-grey">
                  Scale
                </dt>
                <dd className="figures mt-1 text-[0.9375rem] text-blue-dark">{test.scale}</dd>
              </div>
              <div>
                <dt className="eyebrow text-grey">
                  Format
                </dt>
                <dd className="mt-1 text-[0.9375rem] text-blue-dark">{test.format}</dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="eyebrow text-grey">
                  Sections
                </dt>
                <dd className="mt-1 text-[0.9375rem] leading-relaxed text-blue-dark">
                  {test.sections}
                </dd>
              </div>
              <div>
                <dt className="eyebrow text-grey">
                  Validity
                </dt>
                <dd className="mt-1 text-[0.9375rem] text-blue-dark">{test.validity}</dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="eyebrow text-grey">
                  UK Secure English Language Test status
                </dt>
                <dd className="mt-1 text-[0.875rem] leading-relaxed text-grey">
                  {test.ukviSelt}
                </dd>
              </div>
            </dl>
          </article>
        ))}
      </div>
    </ToolPage>
  );
}
