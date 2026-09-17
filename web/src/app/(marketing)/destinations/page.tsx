import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react/ssr";
import { guides } from "@/content/guides";
import { destinations } from "@/content/destinations";
import { photos, photoUrl } from "@/content/photos";
import { PageHero } from "@/components/marketing/page-hero";
import { StatusChip } from "@/components/ui/chip";
import { Reveal } from "@/components/ui/reveal";
import { staggerDelay } from "@/lib/stagger";

export const metadata: Metadata = {
  title: "Destinations",
  description:
    "Three destinations, each covered in full: tuition, cost of living, the money the visa authority wants to see, the academic gates, and what we earn on every route.",
  alternates: { canonical: "/destinations" },
};

const guidePhoto: Record<string, string> = {
  "united-kingdom": "united-kingdom",
  germany: "germany-public",
  ireland: "ireland",
};

export default function DestinationsIndexPage() {
  return (
    <>
      <PageHero
        title="Three destinations, each answered in full"
        lede="A country goes on this list when its whole guide can be filled in: every fee, every threshold, every deadline as a date, and what we earn on each route within it. That is why there are three and not eleven, and why adding a fourth is a piece of work rather than a menu item."
        aside={
          <div className="rounded-panel border border-line bg-white p-6">
            <p className="text-[0.8125rem] font-semibold text-blue-dark">
              What each guide contains
            </p>
            <ul className="mt-3 space-y-1.5 text-[0.875rem] leading-relaxed text-grey">
              <li>Seventeen sections, the same seventeen for every country</li>
              <li>Every figure with its official source named</li>
              <li>Deadlines as dates, never as month names</li>
              <li>An editable cost of living calculator, ungated</li>
              <li>What we earn on the route, next to the advice</li>
            </ul>
          </div>
        }
      />

      <section className="band">
        <div className="shell grid gap-6 lg:grid-cols-3">
          {guides.map((guide, index) => {
            const photo = photos.destinations[guidePhoto[guide.slug]];
            const rows = destinations.filter((row) =>
              guide.routes.some((route) => route.destinationSlug === row.slug),
            );
            const tuition = guide.tuition[0];
            const funds = guide.funds[0];

            return (
              <Reveal key={guide.slug} delay={staggerDelay(index, 0.06)}>
                <Link
                  href={`/destinations/${guide.slug}`}
                  className=" group flex h-full flex-col overflow-hidden rounded-panel border border-line bg-white"
                >
                  <div className="relative h-40 overflow-hidden">
                    <Image
                      src={photoUrl(photo, 800, 420)}
                      alt={photo.alt}
                      width={800}
                      height={420}
                      sizes="(min-width: 1024px) 24rem, 100vw"
                      className="h-full w-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.04]"
                    />
                    <span
                      aria-hidden
                      className="absolute inset-0 bg-[linear-gradient(180deg,rgba(32,91,173,0.10)_0%,rgba(32,91,173,0.82)_100%)]"
                    />
                    <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-5">
                      <h2 className="text-white h--5">
                        {guide.country}
                      </h2>
                      <Image
                        src={`https://flagcdn.com/w80/${guide.flagCode}.png`}
                        alt=""
                        width={40}
                        height={30}
                        className="h-5 w-auto rounded-xs ring-1 ring-white/40"
                      />
                    </div>
                  </div>

                  <div className="flex flex-1 flex-col p-6">
                    <dl className="divide-y divide-line">
                      <div className="flex items-baseline justify-between gap-4 pb-3">
                        <dt className="text-[0.875rem] text-grey">Tuition</dt>
                        <dd className="figures text-right text-[0.875rem] font-semibold text-blue-dark">
                          {tuition.value}
                        </dd>
                      </div>
                      <div className="flex items-baseline justify-between gap-4 py-3">
                        <dt className="text-[0.875rem] text-grey">Funds to show</dt>
                        <dd className="figures text-right text-[0.875rem] font-semibold text-blue-dark">
                          {funds.value}
                        </dd>
                      </div>
                      <div className="flex items-start justify-between gap-4 pt-3">
                        <dt className="text-[0.875rem] text-grey">We earn</dt>
                        <dd className="flex flex-col items-end gap-1.5">
                          {rows.map((row) => (
                            <span key={row.slug} className="flex flex-col items-end gap-1">
                              <span className="figures text-[0.875rem] font-semibold text-blue-dark">
                                {row.commission.display}
                                {row.route && (
                                  <span className="ml-1.5 font-sans text-[0.75rem] font-normal text-grey">
                                    {row.route === "Public universities" ? "public" : "private"}
                                  </span>
                                )}
                              </span>
                              <StatusChip status={row.commission.status} />
                            </span>
                          ))}
                        </dd>
                      </div>
                    </dl>

                    <p className="mt-5 flex-1 text-[0.875rem] leading-relaxed text-grey">
                      {guide.pitfalls[0].title}.
                    </p>

                    <span className="mt-5 inline-flex items-center gap-2 text-[0.9375rem] font-medium text-pink">
                      Read the full guide
                      <ArrowRight
                        size={15}
                        weight="bold"
                        aria-hidden
                        className="transition-transform group-hover:translate-x-0.5"
                      />
                    </span>
                  </div>
                </Link>
              </Reveal>
            );
          })}
        </div>

        <div className="shell mt-12">
          <div className="rounded-panel border border-line bg-light p-7 md:p-9">
            <h2 className="text-blue-dark">
              Why not more countries
            </h2>
            <p className="mt-3 max-w-3xl text-[0.9375rem] leading-relaxed text-grey">
              Because a fourth country would be a list of plausible sentences. Every
              destination here has seventeen filled sections, a named source on each figure,
              and a stated verification state, and producing that takes weeks per country.
              Adding Canada or Australia to a dropdown would take an afternoon, and the
              answer you got when you asked a real question about either would be worth
              nothing. When we can answer the whole of a fourth country without looking
              anything up, it will appear here.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
