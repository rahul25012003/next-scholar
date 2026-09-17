import Link from "next/link";
import { Info, WarningCircle } from "@phosphor-icons/react/ssr";
import type { LegalBlock, LegalDocument } from "@/content/legal";
import { legalDocuments } from "@/content/legal";
import { JumpList } from "@/components/ui/jump-list";
import { cn } from "@/lib/cn";

/**
 * One renderer for every legal page, so the review state, the open items and
 * the last-updated date cannot appear on one policy and be forgotten on
 * another. The review banner is not optional and there is no prop to hide it.
 */
export function LegalDocumentView({ doc }: { doc: LegalDocument }) {
  const sections = doc.sections.map((section) => ({
    id: section.id,
    title: section.heading,
  }));

  return (
    <>
      <section className="band">
        <div className="shell">
          <p className="eyebrow text-pink">
            Legal
          </p>
          <h1 className="mt-3 max-w-3xl text-blue-dark">
            {doc.title}
          </h1>
          <p className="mt-5 max-w-2xl leading-relaxed text-grey">{doc.lede}</p>
          <p className="mt-5 text-[0.875rem] text-grey">
            Last updated <span className="figures">{doc.lastUpdated}</span>.
          </p>
        </div>
      </section>

      <div className="shell grid gap-12 lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-14">
        <div className="lg:sticky lg:top-24 lg:self-start">
          <JumpList items={sections} className="hidden lg:block" />
          <details className="rounded-card border border-line bg-light p-5 lg:hidden">
            <summary className="cursor-pointer text-[0.875rem] font-semibold text-blue-dark">
              Jump to a section
            </summary>
            <ul className="mt-3 grid gap-1.5">
              {sections.map((section) => (
                <li key={section.id}>
                  <a href={`#${section.id}`} className="block py-1 text-[0.875rem] text-pink">
                    {section.title}
                  </a>
                </li>
              ))}
            </ul>
          </details>

          <nav aria-label="Other legal pages" className="mt-8 hidden lg:block">
            <p className="eyebrow text-grey">
              The other policies
            </p>
            <ul className="mt-3 space-y-1.5">
              {legalDocuments
                .filter((other) => other.slug !== doc.slug)
                .map((other) => (
                  <li key={other.slug}>
                    <Link
                      href={`/${other.slug}`}
                      className="text-[0.875rem] text-grey transition-colors hover:text-pink"
                    >
                      {other.title}
                    </Link>
                  </li>
                ))}
              <li>
                <Link
                  href="/anti-fraud-policy"
                  className="text-[0.875rem] text-grey transition-colors hover:text-pink"
                >
                  Anti fraud and document integrity
                </Link>
              </li>
            </ul>
          </nav>
        </div>

        <div className="min-w-0">
          <ReviewBanner doc={doc} />

          <div className="mt-10 space-y-10">
            {doc.sections.map((section) => (
              <section key={section.id} id={section.id} className="scroll-mt-24">
                <h2 className="text-blue-dark">
                  {section.heading}
                </h2>
                <div className="mt-5 space-y-5">
                  {section.blocks.map((block, index) => (
                    <Block key={index} block={block} />
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

function ReviewBanner({ doc }: { doc: LegalDocument }) {
  const reviewed = doc.reviewState === "reviewed";
  return (
    <div
      className={cn(
        "rounded-panel border p-6",
        reviewed ? "border-verified/25 bg-verified-bg" : "border-pending/25 bg-pending-bg",
      )}
    >
      <div className="flex items-start gap-3.5">
        <WarningCircle
          size={20}
          weight="fill"
          aria-hidden
          className={cn("mt-0.5 shrink-0", reviewed ? "text-verified" : "text-pending")}
        />
        <div>
          <h2
            className={cn(
              "font-display font-bold",
              reviewed ? "text-verified" : "text-pending",
            )}
          >
            {reviewed
              ? `Reviewed by ${doc.reviewedBy} on ${doc.reviewedOn}`
              : "Published as a complete draft, not yet reviewed by a lawyer"}
          </h2>
          <p className="mt-2 text-[0.9375rem] leading-relaxed text-grey">
            {reviewed
              ? "This document has been read by a qualified person and is published as settled."
              : "This document is written, complete enough to be relied on for what it describes, and has not been read by a qualified person. It is published in that state rather than dressed up as settled, and the gaps below are real gaps listed as gaps."}
          </p>
        </div>
      </div>

      {doc.openItems.length > 0 && (
        <div className="mt-5 border-t border-pending/20 pt-5">
          <h3 className="eyebrow text-pending">
            Open items on this page
          </h3>
          <ul className="mt-3 space-y-2">
            {doc.openItems.map((item) => (
              <li key={item} className="flex gap-2.5 text-[0.875rem] leading-relaxed text-grey">
                <span aria-hidden className="mt-2 h-1 w-1 shrink-0 rounded-full bg-pending/50" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function Block({ block }: { block: LegalBlock }) {
  if (block.kind === "text") {
    return (
      <p className="max-w-prose leading-relaxed text-grey">{block.body}</p>
    );
  }

  if (block.kind === "list") {
    return (
      <div>
        {block.intro && (
          <p className="max-w-prose leading-relaxed text-grey">{block.intro}</p>
        )}
        <ul className={cn("space-y-2.5", block.intro && "mt-3")}>
          {block.items.map((item) => (
            <li
              key={item}
              className="flex max-w-prose gap-3 leading-relaxed text-grey"
            >
              <span aria-hidden className="mt-2.5 h-1 w-1 shrink-0 rounded-full bg-line-strong" />
              {item}
            </li>
          ))}
        </ul>
      </div>
    );
  }

  if (block.kind === "definitions") {
    return (
      <dl className="divide-y divide-line overflow-hidden rounded-panel border border-line bg-white">
        {block.items.map((item) => (
          <div key={item.term} className="p-6">
            <dt className="font-display font-semibold text-blue-dark">{item.term}</dt>
            <dd className="mt-2 text-[0.9375rem] leading-relaxed text-grey">{item.body}</dd>
          </div>
        ))}
      </dl>
    );
  }

  if (block.kind === "table") {
    return (
      <div className="overflow-x-auto rounded-panel border border-line bg-white">
        <table className="w-full min-w-[40rem] border-collapse text-left">
          <caption className="sr-only">{block.caption}</caption>
          <thead>
            <tr className="border-b border-line bg-light">
              {block.columns.map((column) => (
                <th
                  key={column}
                  scope="col"
                  className="px-5 py-3 text-[0.75rem] font-semibold text-blue-dark"
                >
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {block.rows.map((row) => (
              <tr key={row[0]} className="align-top">
                <th
                  scope="row"
                  className="px-5 py-4 text-[0.875rem] font-semibold leading-relaxed text-blue-dark"
                >
                  {row[0]}
                </th>
                {row.slice(1).map((cell, index) => (
                  <td key={index} className="px-5 py-4 text-[0.875rem] leading-relaxed text-grey">
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  const warning = block.tone === "warning";
  const Icon = warning ? WarningCircle : Info;
  return (
    <div
      className={cn(
        "flex gap-3.5 rounded-card border p-5",
        warning ? "border-pending/25 bg-pending-bg" : "border-line bg-light",
      )}
    >
      <Icon
        size={18}
        weight="fill"
        aria-hidden
        className={cn("mt-0.5 shrink-0", warning ? "text-pending" : "text-pink")}
      />
      <div>
        <h3
          className={cn(
            "text-[0.9375rem] font-semibold",
            warning ? "text-pending" : "text-blue-dark",
          )}
        >
          {block.title}
        </h3>
        <p className="mt-1.5 max-w-prose text-[0.9375rem] leading-relaxed text-grey">
          {block.body}
        </p>
      </div>
    </div>
  );
}
