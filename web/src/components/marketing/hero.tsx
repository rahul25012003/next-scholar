import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MagnifyingGlass } from "@phosphor-icons/react/ssr";
import { ButtonLink } from "@/components/ui/button";
import { primaryCta } from "@/content/site";
import { destinations } from "@/content/destinations";
import { heroPortraitImage, photos } from "@/content/photos";

/**
 * The hero, following the reference layout: a soft blue panel holding the
 * headline, a destination picker and a trust row, with a portrait sitting on a
 * gradient card to the right.
 *
 * Two things are adapted rather than copied. The reference's search bar implies
 * a searchable database of fifteen hundred universities, and this business
 * covers three destinations it can answer completely, so the control picks a
 * destination and goes somewhere real. And where the reference counts twenty
 * two thousand students onboarded, this one carries what is actually true,
 * because no client has been taken on yet.
 */
export function Hero() {
  return (
    <section className="bg-hero-band pb-6 pt-6 md:pb-10">
      <div className="shell">
        {/* eslint-disable-next-line no-restricted-syntax -- token-exempt: hero panel radius (28px, 36px at lg), larger than any token and matched by the portrait card below */}
        <div className="relative overflow-hidden rounded-[1.75rem] bg-hero-panel px-7 pb-0 pt-12 md:px-12 md:pt-16 lg:rounded-[2.25rem]">
          <div className="grid items-end gap-10 lg:grid-cols-[1.18fr_0.82fr] lg:gap-10">
            <div className="pb-12 md:pb-16">
              <h1 className="font-display text-[2.25rem] font-extrabold leading-[1.1] tracking-[-0.03em] text-navy-900 sm:text-[2.5rem] lg:text-[2.7rem] xl:text-[3rem]">
                We publish what we earn
                <br />
                <span className="text-blue-600">on every recommendation</span>
              </h1>

              <p className="mt-5 max-w-[30rem] text-[1rem] leading-relaxed text-body md:text-[1.0625rem]">
                Study abroad advice for Bengaluru graduates, with our commission
                printed next to every university on your shortlist.
              </p>

              <DestinationPicker />

              {/* The picker explores. This is the action that pays for the
                  business, so it does not live only in the navigation. */}
              <div className="mt-5 flex flex-wrap items-center gap-3">
                <ButtonLink href={primaryCta.href} size="lg">
                  {primaryCta.label}
                </ButtonLink>
                <p className="text-[0.8125rem] leading-snug text-body">
                  45 minutes, ₹1,500, credited against the fee
                  <br className="hidden sm:block" /> if you go ahead.
                </p>
              </div>

              <TrustRow />
            </div>

            <HeroPortrait />
          </div>
        </div>
      </div>
    </section>
  );
}

const quickLinks = [
  { label: "Browse 30 courses", href: "/universities" },
  { label: "Check your requirements", href: "/tools/requirements-check" },
  { label: "Cost of living calculator", href: "/tools/cost-of-living" },
  { label: "Germany guide", href: "/destinations/germany" },
  { label: "UK guide", href: "/destinations/united-kingdom" },
  { label: "Ireland guide", href: "/destinations/ireland" },
] as const;

/**
 * Six places to go besides "sign up", right under the hero. Every one of them
 * is a page that works without an account, so this is a shortcut into the
 * site rather than a funnel into a form.
 */
export function HeroQuickLinks() {
  return (
    <div className="bg-hero-band pb-8">
      <div className="shell">
        <ul className="flex flex-wrap gap-2.5">
          {quickLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="inline-flex items-center rounded-full border border-line-strong bg-paper px-4 py-2 text-[0.8125rem] font-medium text-navy-900 transition-colors hover:border-blue-600 hover:text-blue-600"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/**
 * Where the reference has a university search box. Three destinations do not
 * need a search, so this goes straight to what each one earns us.
 */
function DestinationPicker() {
  return (
    // eslint-disable-next-line no-restricted-syntax -- token-exempt: glow tinted to its own blue fill; card/lift shadows are navy-tinted for paper surfaces
    <div className="mt-8 max-w-[30rem] rounded-card bg-blue-600 p-1.5 shadow-[0_10px_30px_-12px_rgb(21_83_214/0.55)]">
      <div className="flex flex-wrap items-center gap-1.5">
        <p className="flex-1 px-3.5 py-2 text-[0.9375rem] text-white/85">
          See what we earn in
        </p>
        {destinations
          .filter((destination) => destination.slug !== "germany-private")
          .map((destination) => (
            <Link
              key={destination.slug}
              href="/open-ledger"
              className="rounded-input bg-white/12 px-3 py-2 text-[0.875rem] font-medium text-white transition-colors hover:bg-white/22"
            >
              {destination.country}
            </Link>
          ))}
        <Link
          href="/open-ledger"
          aria-label="Open the full ledger"
          className="grid h-10 w-11 place-items-center rounded-input bg-white text-blue-600 transition-colors hover:bg-blue-50"
        >
          <MagnifyingGlass size={17} weight="bold" aria-hidden />
        </Link>
      </div>
    </div>
  );
}

/**
 * The reference puts a row of student faces and a headcount here. There are no
 * clients yet, so the same shape carries the three destinations and the promise
 * that actually holds on day one.
 */
function TrustRow() {
  return (
    <div className="mt-7 flex flex-wrap items-center gap-x-4 gap-y-3">
      <div className="flex -space-x-2.5">
        {destinations
          .filter((destination) => destination.slug !== "germany-private")
          .map((destination) => (
            <span
              key={destination.slug}
              className="grid h-9 w-9 place-items-center overflow-hidden rounded-full bg-white ring-2 ring-hero-panel"
            >
              <Image
                src={`https://flagcdn.com/w80/${destination.flagCode}.png`}
                alt=""
                width={36}
                height={36}
                className="h-full w-full object-cover"
              />
            </span>
          ))}
      </div>
      <p className="text-[0.875rem] leading-snug text-ink-soft">
        Three destinations, covered in full.{" "}
        <Link
          href="/open-ledger"
          className="inline-flex items-center gap-1 font-medium text-blue-600 hover:text-blue-500"
        >
          Every commission published
          <ArrowRight size={13} weight="bold" aria-hidden />
        </Link>
      </p>
    </div>
  );
}

function HeroPortrait() {
  return (
    <div className="relative mx-auto w-full max-w-[26rem] self-end lg:mx-0">
      {/* The notch, cut out of the top left corner the way the reference does. */}
      <span
        aria-hidden
        // eslint-disable-next-line no-restricted-syntax -- token-exempt: the notch's inner curve, a shape no radius token expresses
        className="absolute -left-px -top-px z-10 hidden h-[4.5rem] w-[4.5rem] rounded-br-[2rem] bg-hero-panel sm:block"
      />
      {/* eslint-disable-next-line no-restricted-syntax -- token-exempt: three corners match the hero panel's 28px, the fourth is the notch */}
      <div className="relative overflow-hidden rounded-t-[1.75rem] rounded-bl-[1.75rem] bg-[linear-gradient(160deg,#2e6bf0_0%,#1553d6_55%,#0e2a5e_100%)]">
        {/* unoptimized: this is the LCP element, the source file is already a
            64KB crop at display size, and Next's resize proxy adds a real
            cold-cache round trip for a size it barely shrinks. Revisit if the
            source is ever swapped for something meaningfully larger. */}
        <Image
          src={heroPortraitImage}
          alt={photos.heroPortrait.alt}
          priority
          placeholder="blur"
          unoptimized
          className="h-[21rem] w-full object-cover object-[50%_28%] md:h-[25rem] lg:h-[27rem]"
        />
        {/* Ties the photograph into the card so it reads as one object. */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(21,83,214,0.28)_0%,transparent_28%,transparent_72%,rgba(14,42,94,0.35)_100%)]"
        />
      </div>
    </div>
  );
}
