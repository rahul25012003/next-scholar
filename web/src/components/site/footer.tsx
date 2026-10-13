import Image from "next/image";
import Link from "next/link";
import { ButtonLink } from "@/components/ui/button";
import { lastReviewed, primaryCta, site } from "@/content/site";
import { photos, photoUrl } from "@/content/photos";

/** The handful a visitor at the foot of a page actually goes looking for. */
const links = [
  { label: "Destinations", href: "/destinations" },
  { label: "Courses", href: "/universities" },
  { label: "Free tools", href: "/tools" },
  { label: "About us", href: "/about" },
  { label: "Blog", href: "/blog" },
  { label: "Student login", href: "/login" },
];

/**
 * Kept apart from the links above because these are the ones a reader goes
 * looking for when something has gone wrong, and burying them among the
 * marketing links is how sites make them hard to find on purpose.
 */
const legal = [
  { label: "Privacy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
  { label: "Cookies", href: "/cookies" },
  { label: "Refunds", href: "/refund-policy" },
  { label: "Non affiliation", href: "/non-affiliation" },
  { label: "What we never promise", href: "/anti-fraud-policy" },
];

/**
 * The footer, kept short: the name, six links, the booking action, the legal
 * row, and three plain points, over a shaded photograph along the bottom.
 * Its colour is the ground's own blue taken deeper, so the page ends in the
 * palette it has been in all the way down.
 *
 * The long link lists that used to be here are the navigation's job, and the
 * full text of what is never promised is on the anti fraud page the legal row
 * links to. The three points that stay are the ones that must be on every
 * page: nothing is guaranteed, the entity is not registered yet, and that
 * there is no way to reach us online until it is.
 */
export function SiteFooter() {
  return (
    <footer className="Footer mt-auto">
      <div className="Footer__photo" aria-hidden>
        <Image
          src={photoUrl(photos.footer, 2400, 900)}
          alt=""
          fill
          sizes="100vw"
          className="object-cover"
        />
      </div>

      <div className="Footer__inner constrain">
        <div className="Footer__top">
          <Link className="Footer__logo" href="/">
            <span className="Header__logo-mark" aria-hidden>
              N
            </span>
            <span aria-hidden>Next Scholar</span>
            <span className="sr-only">{site.name} home</span>
          </Link>

          <nav aria-label="Footer">
            <ul role="list" className="Footer__links">
              {links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="Footer__nav-link">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="Footer__action tickets">
            <ButtonLink href={primaryCta.href} variant="pink">
              {primaryCta.label}
            </ButtonLink>
          </div>
        </div>

        <div className="Footer__base">
          <nav aria-label="Legal">
            <ul role="list" className="Footer__legal">
              {legal.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="Footer__nav-link">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <ul className="small max-w-[62ch] list-disc space-y-1 pl-5">
            <li>No guarantee of admission or of a visa.</li>
            <li>
              {site.name} is not a registered company yet, so there are no
              registration details to show. They appear the day it is registered.
            </li>
            <li>
              Until then there is no way to reach us online. Email, phone and WhatsApp
              go live with the registered company.
            </li>
          </ul>
          <p className="small">
            {site.base}. Page content last reviewed{" "}
            <span className="figures">{lastReviewed}</span>.
          </p>
        </div>
      </div>
    </footer>
  );
}
