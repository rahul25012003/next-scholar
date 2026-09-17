import Link from "next/link";
import { disciplines } from "@/content/catalogue";

/**
 * A foot-of-results block, the same shape search engines use, built from
 * queries this catalogue can actually answer rather than decoration: three
 * destination-filtered views, the two facts this catalogue publishes that
 * neither benchmark does, and the top disciplines by how many programmes
 * carry them.
 */
export function RelatedSearches({ exclude }: { exclude?: string }) {
  const topDisciplines = disciplines()
    .sort((a, b) => b.count - a.count)
    .slice(0, 4);

  const links = [
    { label: "Masters in Germany", href: "/masters-in-germany" },
    { label: "Masters in the UK", href: "/masters-in-uk" },
    { label: "Masters in Ireland", href: "/masters-in-ireland" },
    { label: "Institutions that pay us nothing", href: "/universities?zeroCommission=1" },
    { label: "Rankings, as published", href: "/universities/rankings" },
    { label: "Scholarships", href: "/scholarships" },
    ...topDisciplines.map((item) => ({
      label: `${item.name} courses`,
      href: `/universities?discipline=${encodeURIComponent(item.name)}`,
    })),
  ].filter((link) => link.href !== exclude);

  return (
    <nav aria-label="Related searches" className="mt-10 border-t border-line pt-8">
      <h2 className="eyebrow text-grey">
        Related searches
      </h2>
      <ul className="mt-3 flex flex-wrap gap-2.5">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="button button--light"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
