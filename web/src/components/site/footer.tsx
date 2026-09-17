import Link from "next/link";
import { contact, lastReviewed, legalIdentity, site } from "@/content/site";
import { permanentDisclaimers } from "@/content/outcomes";

const columns = [
  {
    heading: "Destinations",
    links: [
      { label: "United Kingdom", href: "/destinations/united-kingdom" },
      { label: "Germany", href: "/destinations/germany" },
      { label: "Ireland", href: "/destinations/ireland" },
      { label: "All three", href: "/destinations" },
      { label: "Courses and universities", href: "/universities" },
      { label: "Your shortlist", href: "/shortlist" },
    ],
  },
  {
    heading: "Free tools",
    links: [
      { label: "Requirements checklist", href: "/tools/requirements-check" },
      { label: "Cost of living", href: "/tools/cost-of-living" },
      { label: "German grade calculator", href: "/tools/german-grade-calculator" },
      { label: "ECTS credit check", href: "/tools/ects-check" },
      { label: "IELTS band calculator", href: "/tools/ielts-band-calculator" },
      { label: "Grade converters", href: "/tools/grade-converter" },
    ],
  },
  {
    heading: "What we publish",
    links: [
      { label: "Open Ledger", href: "/open-ledger" },
      { label: "Our numbers, one source", href: "/our-numbers" },
      { label: "Written guides", href: "/guides" },
      { label: "Services and what we earn", href: "/services" },
      { label: "Zero commission list", href: "/zero-commission" },
      { label: "Anti fraud and documents", href: "/anti-fraud-policy" },
      { label: "How it works", href: "/#process" },
      { label: "Search this site", href: "/search" },
      { label: "Student login", href: "/portal" },
    ],
  },
];

/**
 * Kept apart from the columns above because these five are the ones a reader
 * goes looking for when something has gone wrong, and burying them among the
 * marketing links is how sites make them hard to find on purpose.
 */
const legalLinks = [
  { label: "Privacy policy", href: "/privacy" },
  { label: "Terms of use", href: "/terms" },
  { label: "Cookie policy", href: "/cookies" },
  { label: "Refunds and cancellation", href: "/refund-policy" },
  { label: "Non affiliation", href: "/non-affiliation" },
];

/**
 * The reference footer: charcoal, light type, the logo and its paragraphs in
 * a wide left column, the link lists in a narrow right one.
 */
export function SiteFooter() {
  return (
    <footer className="Footer pad-around-lg mt-auto">
      <div className="Footer__container constrain">
        <div className="Footer__intro flow">
          <Link className="Footer__logo" href="/">
            <span className="Header__logo-mark" aria-hidden>
              N
            </span>
            <span>
              <span aria-hidden>Next Scholar</span>
              <span className="sr-only">{site.name}</span>
              <span className="underline" aria-hidden />
            </span>
          </Link>

          <p>{site.pitch}</p>
          <p>
            {site.base}. {site.serves}.
          </p>

          <div className="flow">
            <h2 className="h--6">Registration details</h2>
            <p className="small">{legalIdentity.note}</p>
            <dl className="small flow" style={{ ["--flow" as string]: "0.4rem" }}>
              {legalIdentity.fields.map((field) => (
                <div key={field.label} className="flex items-baseline gap-3">
                  <dt className="w-40 shrink-0">{field.label}</dt>
                  <dd className="figures">Not yet issued</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="flow">
            <h2 className="h--6">What we never promise</h2>
            <ul role="list" className="small flow" style={{ ["--flow" as string]: "0.6rem" }}>
              {permanentDisclaimers.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
            <p className="small">{contact.note}</p>
          </div>

          <p className="small">
            {site.name}. Page content last reviewed{" "}
            <span className="figures">{lastReviewed}</span>.
          </p>
          <p className="small">
            Every figure on this site names its source and says whether a person has
            re-checked it. None of them has been re-checked this quarter.
          </p>
        </div>

        <div>
          {columns.map((column) => (
            <nav key={column.heading} className="Footer__nav" aria-label={column.heading}>
              <h2 className="Footer__nav-heading">{column.heading}</h2>
              <ul role="list" className="flow">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="Footer__nav-link">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          <nav aria-label="Legal" className="Footer__nav">
            <ul role="list" className="flow">
              {legalLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="Footer__nav-link">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </footer>
  );
}
