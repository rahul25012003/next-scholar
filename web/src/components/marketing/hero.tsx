import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MagnifyingGlass } from "@phosphor-icons/react/ssr";
import { ButtonLink } from "@/components/ui/button";
import { SplitText } from "@/components/ui/split-text";
import { primaryCta, site } from "@/content/site";
import { GridBars } from "@/components/marketing/overview-art";
import { destinations } from "@/content/destinations";
import { guides } from "@/content/guides";
import { programmes } from "@/content/catalogue";

/**
 * The reference hero: one white box on the blue ground holding the headline
 * and the intro. This one also carries the destination picker, the booking
 * action and the trust row, and it fills the hero: the full width of the page
 * and the height of the window less the header, its content centred in it.
 * Brand shapes sit at its corners, so the white either side of the content
 * reads as composed rather than empty.
 */
export function Hero() {
  return (
    <section className="anim-home--hero Hero constrain">
      <div className="Hero__inner Hero__inner--wide pad-x bg-white center flow">
        {/* Split into words so the headline arrives word by word; the claim
            itself, "what we earn", is the part that gets underlined. */}
        <h1 className="h h--3 text-blue-dark">
          <SplitText>We publish</SplitText>{" "}
          <span className="Hero__mark">
            <SplitText start={2}>what we earn</SplitText>
            <svg
              className="Hero__squiggle"
              viewBox="0 0 300 20"
              preserveAspectRatio="none"
              aria-hidden
              focusable="false"
            >
              <path d="M4 13c30-10 52-10 78-3s46 8 74 1 50-9 76-2 44 6 64-1" pathLength={1} />
            </svg>
          </span>
          <br />
          <span className="text-blue">
            <SplitText start={5}>on every recommendation</SplitText>
          </span>
        </h1>

        <div className="intro">{site.description}</div>

        <DestinationPicker />

        {/* The picker explores. This is the action that pays for the
            business, so it does not live only in the navigation. */}
        <div className="flex flex-col items-center gap-x-5 gap-y-2 sm:flex-row sm:justify-center">
          <ButtonLink href={primaryCta.href} size="lg" className="shrink-0">
            {primaryCta.label}
          </ButtonLink>
          <p className="small max-w-[15rem] text-center sm:text-left">
            45 minutes, ₹1,500, credited against the fee if you go ahead.
          </p>
        </div>

        <TrustRow />
        <HeroShapes />
      </div>
    </section>
  );
}

/**
 * What fills the white either side of the content, all of it the
 * reference's own: a pale hoop cropped by the bottom left corner, a pale
 * hexagon cropped by the top right, and its bar grid in the bottom right,
 * over a faint dot texture that fades out before it reaches the type (the
 * card's ::before in globals.css). Each sits behind the content and arrives
 * after it. Decoration, so all of it is hidden from assistive technology.
 */
function HeroShapes() {
  return (
    <>
      <svg className="Hero__shape Hero__shape--hoop" viewBox="0 0 100 100" aria-hidden focusable="false">
        <circle cx="50" cy="50" r="38" fill="none" strokeWidth="20" />
      </svg>
      <svg className="Hero__shape Hero__shape--hex" viewBox="0 0 100 100" aria-hidden focusable="false">
        <path d="M44 4a12 12 0 0112 0l34 20a12 12 0 016 10v32a12 12 0 01-6 10L56 96a12 12 0 01-12 0L10 76a12 12 0 01-6-10V34a12 12 0 016-10z" />
      </svg>
      <GridBars className="Hero__shape Hero__shape--bars" />
    </>
  );
}

const quickLinks = [
  { label: `Browse ${programmes.length} courses`, href: "/universities" },
  { label: "Check your requirements", href: "/tools/requirements-check" },
  { label: "Cost of living calculator", href: "/tools/cost-of-living" },
  { label: "Scholarships", href: "/scholarships" },
  { label: "Read the blog", href: "/blog" },
  { label: "About us", href: "/about" },
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
 * need a search, so this goes straight to each one's guide, with the site
 * search one tap further along.
 */
function DestinationPicker() {
  return (
    <div className="flow" style={{ ["--flow" as string]: "0.5rem" }}>
      <p className="h h--6 text-blue-dark">Explore a destination</p>
      <ul role="list" className="flex flex-wrap items-center justify-center gap-2">
        {guides.map((guide) => (
          <li key={guide.slug}>
            <Link href={`/destinations/${guide.slug}`} className="button button--light">
              {guide.country}
            </Link>
          </li>
        ))}
        <li className="Hero__ledger-search">
          <Link
            href="/search"
            aria-label="Search the site"
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
    <div className="Hero__trust flex items-center justify-center gap-x-4 text-left">
      <div className="flex shrink-0 -space-x-2.5">
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
                // Filled rather than cropped: a centred crop of the Irish
                // tricolour is all white stripe, and a stripe flag stretched to a
                // circle still reads as itself.
                className="h-full w-full object-fill"
              />
            </span>
          ))}
      </div>
      <p className="small">
        Three destinations, covered in full.{" "}
        <Link
          href="/destinations"
          className="inline-flex items-center gap-1 font-bold text-pink"
        >
          Compare all three
          <ArrowRight size={13} weight="bold" aria-hidden />
        </Link>
      </p>
    </div>
  );
}
