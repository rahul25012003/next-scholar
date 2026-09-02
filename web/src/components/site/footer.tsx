import Link from "next/link";
import { contact, lastReviewed, legalIdentity, nav, site } from "@/content/site";
import { permanentDisclaimers } from "@/content/outcomes";

const columns = [
  {
    heading: "The platform",
    links: [
      { label: "How it works", href: "/#process" },
      { label: "Destinations", href: "/#destinations" },
      { label: "Outcomes", href: "/#outcomes" },
      { label: "Student login", href: "/portal" },
    ],
  },
  {
    heading: "What we publish",
    links: [
      { label: "Open Ledger", href: "/open-ledger" },
      { label: "Zero commission list", href: "/zero-commission" },
      { label: "Anti fraud and data protection", href: "/anti-fraud-policy" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="mt-auto bg-navy-900 text-white/70">
      <div className="shell py-16 md:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr]">
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

        <div className="mt-14 grid gap-10 border-t border-white/12 pt-10 lg:grid-cols-[1.4fr_1fr_1fr]">
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

          <div className="lg:col-span-2">
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

        <div className="mt-12 flex flex-col gap-3 border-t border-white/12 pt-7 text-[0.8125rem] text-white/40 sm:flex-row sm:items-center sm:justify-between">
          <p>
            {site.name}. Page content last reviewed{" "}
            <span className="figures">{lastReviewed}</span>.
          </p>
          <p className="flex flex-wrap gap-x-5 gap-y-1">
            {nav
              .filter((item) => item.href)
              .map((item) => (
                <Link
                  key={item.label}
                  href={item.href!}
                  className="transition-colors hover:text-white/70"
                >
                  {item.label}
                </Link>
              ))}
          </p>
        </div>
      </div>
    </footer>
  );
}
