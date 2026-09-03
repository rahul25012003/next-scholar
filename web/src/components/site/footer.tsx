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
      { label: "Zero commission list", href: "/zero-commission" },
      { label: "Anti fraud and documents", href: "/anti-fraud-policy" },
      { label: "How it works", href: "/#process" },
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

export function SiteFooter() {
  return (
    <footer className="mt-auto bg-navy-900 text-white/70">
      <div className="shell py-16 md:py-20">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <div className="max-w-sm">
            <div className="flex items-center gap-2.5">
              <span
                className="grid h-9 w-9 place-items-center rounded-input bg-white/10 font-display text-[1.05rem] font-bold text-white"
                aria-hidden
              >
                N
              </span>
              <span className="font-display text-[1.0625rem] font-bold tracking-tight text-white">
                Next<span className="text-blue-100">Scholar</span>
              </span>
            </div>
            <p className="mt-5 text-[0.9375rem] leading-relaxed text-white/70">
              {site.pitch}
            </p>
            <p className="mt-3 text-[0.875rem] leading-relaxed text-white/55">
              {site.base}. {site.serves}.
            </p>
          </div>

          {columns.map((column) => (
            <nav key={column.heading} aria-label={column.heading}>
              <h2 className="font-display text-[0.9375rem] font-semibold text-white">
                {column.heading}
              </h2>
              <ul className="mt-4 space-y-2.5">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-[0.9375rem] text-white/70 transition-colors hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-14 grid gap-10 border-t border-white/12 pt-10 lg:grid-cols-[1.5fr_2fr]">
          <div>
            <h2 className="font-display text-[0.9375rem] font-semibold text-white">
              Registration details
            </h2>
            <p className="mt-3 max-w-sm text-[0.875rem] leading-relaxed text-white/55">
              {legalIdentity.note}
            </p>
            <dl className="mt-5 space-y-2">
              {legalIdentity.fields.map((field) => (
                <div key={field.label} className="flex items-baseline gap-3 text-[0.8125rem]">
                  <dt className="w-40 shrink-0 text-white/45">{field.label}</dt>
                  <dd className="figures text-white/35">Not yet issued</dd>
                </div>
              ))}
            </dl>
          </div>

          <div>
            <h2 className="font-display text-[0.9375rem] font-semibold text-white">
              What we never promise
            </h2>
            <ul className="mt-4 space-y-2.5">
              {permanentDisclaimers.map((line) => (
                <li key={line} className="text-[0.875rem] leading-relaxed text-white/60">
                  {line}
                </li>
              ))}
            </ul>
            <p className="mt-6 max-w-xl text-[0.875rem] leading-relaxed text-white/45">
              {contact.note}
            </p>
          </div>
        </div>

        <nav
          aria-label="Legal"
          className="mt-12 flex flex-wrap gap-x-6 gap-y-2 border-t border-white/12 pt-7"
        >
          {legalLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-[0.875rem] text-white/70 transition-colors hover:text-white"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="mt-7 flex flex-col gap-3 border-t border-white/12 pt-7 text-[0.8125rem] text-white/40 sm:flex-row sm:items-center sm:justify-between">
          <p>
            {site.name}. Page content last reviewed{" "}
            <span className="figures">{lastReviewed}</span>.
          </p>
          <p className="max-w-md sm:text-right">
            Every figure on this site names its source and says whether a person has
            re-checked it. None of them has been re-checked this quarter.
          </p>
        </div>
      </div>
    </footer>
  );
}
