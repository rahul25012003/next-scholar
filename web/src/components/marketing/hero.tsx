import { ButtonLink } from "@/components/ui/button";
import { HeroLedger } from "@/components/marketing/hero-ledger";
import { primaryCta } from "@/content/site";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-surface">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[420px] bg-[radial-gradient(120%_100%_at_78%_0%,rgba(46,107,240,0.10),transparent_60%)]"
      />
      <div className="shell relative grid gap-14 pb-20 pt-14 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-16 lg:pb-28 lg:pt-20">
        <div>
          <h1 className="font-display text-4xl font-extrabold leading-[1.08] tracking-[-0.03em] text-navy-900 md:text-5xl lg:text-[3.5rem]">
            We publish what we earn
            <br />
            <span className="text-blue-600">on every recommendation</span>
          </h1>
          <p className="mt-6 max-w-[34rem] text-[1.0625rem] leading-relaxed text-body">
            Study abroad advice for Bengaluru graduates, with our commission
            printed next to every university on your shortlist.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-3">
            <ButtonLink href={primaryCta.href} size="lg">
              {primaryCta.label}
            </ButtonLink>
            <ButtonLink href="/open-ledger" variant="outline" size="lg">
              Read the Open Ledger
            </ButtonLink>
          </div>
        </div>

        <HeroLedger />
      </div>
    </section>
  );
}
