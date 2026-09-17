import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MagnifyingGlass } from "@phosphor-icons/react/ssr";
import { ButtonLink } from "@/components/ui/button";
import { primaryCta } from "@/content/site";
import { destinations } from "@/content/destinations";

/**
 * The reference hero: one centred white box on the blue ground holding the
 * headline and the intro. This one also carries the destination picker, the
 * booking action and the trust row, so the box is wider than the reference's.
 */
export function Hero() {
  return (
    <section className="anim-home--hero Hero pad-before-lg">
      <div className="Hero__inner Hero__inner--wide pad-around pad-x bg-white center flow">
        <h1 className="h h--3 text-blue-dark">
          We publish what we earn
          <br />
          <span className="text-blue">on every recommendation</span>
        </h1>

        <div className="intro">
          Study abroad advice for Bengaluru graduates, with our commission
          printed next to every university on your shortlist.
        </div>

        <DestinationPicker />

        {/* The picker explores. This is the action that pays for the
            business, so it does not live only in the navigation. */}
        <div className="flex flex-col items-center gap-3 pt-2">
          <ButtonLink href={primaryCta.href} size="lg">
            {primaryCta.label}
          </ButtonLink>
          <p className="small">
            45 minutes, ₹1,500, credited against the fee
            <br className="hidden sm:block" /> if you go ahead.
          </p>
        </div>

        <TrustRow />
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
    <div className="constrain pad-after-lg">
      <ul className="Hero__links" role="list">
        {quickLinks.map((link) => (
          <li key={link.href}>
            <Link href={link.href} className="button button--light">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

/**
 * Where the reference has a university search box. Three destinations do not
 * need a search, so this goes straight to what each one earns us.
 */
function DestinationPicker() {
  return (
    <div className="flow pt-2" style={{ ["--flow" as string]: "0.75rem" }}>
      <p className="h h--6 text-blue-dark">See what we earn in</p>
      <ul role="list" className="flex flex-wrap items-center justify-center gap-2">
        {destinations
          .filter((destination) => destination.slug !== "germany-private")
          .map((destination) => (
            <li key={destination.slug}>
              <Link href="/open-ledger" className="button button--light">
                {destination.country}
              </Link>
            </li>
          ))}
        <li>
          <Link
            href="/open-ledger"
            aria-label="Open the full ledger"
            className="button grid h-11 w-11 place-items-center px-0"
          >
            <MagnifyingGlass size={18} weight="bold" aria-hidden />
          </Link>
        </li>
      </ul>
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
    <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-3 pt-2">
      <div className="flex -space-x-2.5">
        {destinations
          .filter((destination) => destination.slug !== "germany-private")
          .map((destination) => (
            <span
              key={destination.slug}
              className="grid h-9 w-9 place-items-center overflow-hidden rounded-full bg-white ring-2 ring-white"
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
      <p className="small">
        Three destinations, covered in full.{" "}
        <Link
          href="/open-ledger"
          className="inline-flex items-center gap-1 font-bold text-pink"
        >
          Every commission published
          <ArrowRight size={13} weight="bold" aria-hidden />
        </Link>
      </p>
    </div>
  );
}
