import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CheckCircle } from "@phosphor-icons/react/ssr";
import { PageHero } from "@/components/marketing/page-hero";
import { ButtonLink } from "@/components/ui/button";
import { consultation } from "@/content/consultation";
import { counsellorScope } from "@/content/counsellors";
import { guides } from "@/content/guides";
import { documentIntegrity } from "@/content/policy";
import { stages } from "@/content/process";
import { legalIdentity, primaryCta, site } from "@/content/site";

export const metadata: Metadata = {
  title: "About us",
  description: `${site.name} is a study abroad consultancy in ${site.base}, helping graduates apply for Master's programmes in the United Kingdom, Germany and Ireland.`,
  alternates: { canonical: "/about" },
};

/**
 * Who we are, what we do and how, in short points. Every line here restates
 * something the site already says elsewhere, with its source module imported
 * rather than copied, so this page cannot drift from the rest of the site or
 * make a claim the site does not.
 */
export default function AboutPage() {
  const countries = guides.map((guide) => guide.country);
  const whatWeDo = [
    `We help graduates apply for Master's programmes in ${countries.slice(0, -1).join(", ")} and ${countries.at(-1)}.`,
    "We do not handle undergraduate admissions.",
    `We are based in ${site.base} and work with ${site.serves.toLowerCase()}.`,
    `Everything starts with a ${consultation.duration} paid consultation for ${consultation.price}. ${consultation.creditNote}`,
    consultation.promise,
  ];
  const standBy = [
    site.pitch,
    "Every figure on this site has a source and the date it was written down.",
    documentIntegrity.commitments[1],
    documentIntegrity.commitments[2],
    "We are not APS, DAAD, uni-assist or UKVI.",
  ];
  const today = [
    "We have not taken on a client yet, so we publish no placement numbers.",
    legalIdentity.note,
    counsellorScope.note,
  ];

  return (
    <>
      <PageHero title="About us" lede={`${site.pitch} ${site.description}`} />

      <section className="band">
        <div className="shell grid gap-14 lg:grid-cols-2 lg:gap-16">
          <div>
            <h2 className="text-blue-dark">What we do</h2>
            <Points items={whatWeDo} />
          </div>
          <div>
            <h2 className="text-blue-dark">What we stand by</h2>
            <Points items={standBy} />
          </div>
        </div>
      </section>

      <section className="band">
        <div className="shell">
          <div className="max-w-2xl">
            <h2 className="text-blue-dark">How we work, in {stages.length} stages</h2>
            <p className="mt-3 leading-relaxed text-grey">
              From the first call to your arrival. Each stage ends with something you
              receive.
            </p>
          </div>
          <ol className="mt-9 grid gap-x-10 gap-y-3 md:grid-cols-2">
            {stages.map((stage, index) => (
              <li key={stage.key}>
                <Link
                  href={`/process/${stage.key}`}
                  className="group flex items-baseline gap-4 rounded-card border border-line bg-white px-5 py-4 transition-colors hover:border-pink"
                >
                  <span className="figures w-6 shrink-0 font-display text-[1.125rem] font-extrabold text-pink">
                    {index + 1}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-display font-bold text-blue-dark group-hover:text-pink">
                      {stage.name}
                    </span>
                    <span className="mt-0.5 block text-[0.875rem] leading-relaxed text-grey">
                      You get: {stage.deliverable}
                    </span>
                  </span>
                  <ArrowRight
                    size={15}
                    weight="bold"
                    aria-hidden
                    className="shrink-0 self-center text-grey transition-[color,translate] group-hover:translate-x-0.5 group-hover:text-pink"
                  />
                </Link>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="band">
        <div className="shell max-w-3xl">
          <h2 className="text-blue-dark">Where we are today</h2>
          <Points items={today} />
          <p className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-[0.9375rem]">
            <Link href="/counsellors" className="font-medium text-pink hover:text-blue-dark">
              Our counsellors
            </Link>
            <Link href="/non-affiliation" className="font-medium text-pink hover:text-blue-dark">
              Who we are not affiliated with
            </Link>
            <Link href="/our-numbers" className="font-medium text-pink hover:text-blue-dark">
              Where our figures come from
            </Link>
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <ButtonLink href={primaryCta.href} size="lg" variant="pink">
              {primaryCta.label}
            </ButtonLink>
            <ButtonLink href="/blog" size="lg" variant="outline">
              Read the blog
            </ButtonLink>
          </div>
        </div>
      </section>
    </>
  );
}

function Points({ items }: { items: string[] }) {
  return (
    <ul className="mt-6 space-y-3.5">
      {items.map((item) => (
        <li key={item} className="flex gap-3 leading-relaxed text-grey">
          <CheckCircle size={20} weight="fill" aria-hidden className="mt-0.5 shrink-0 text-teal" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}
