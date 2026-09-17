import type { Metadata } from "next";
import Link from "next/link";
import { WarningCircle } from "@phosphor-icons/react/ssr";
import { figureCount, figureGroups } from "@/domain/figures";
import { isStale } from "@/content/types";
import { PageHero } from "@/components/marketing/page-hero";
import { JumpList } from "@/components/ui/jump-list";

export const metadata: Metadata = {
  title: "Our numbers, one source",
  description:
    "Every figure published anywhere on this site, with the body it came from, the date it was written down, and whether a named person has since re-checked it.",
  alternates: { canonical: "/our-numbers" },
};

export default function OurNumbersPage() {
  const groups = figureGroups();
  const counts = figureCount();

  return (
    <>
      <PageHero
        title="Every number on this site, in one list"
        lede="Not a summary of our sources. The actual list, built from the same modules the pages render from, so a figure cannot appear anywhere on this site without appearing here and it cannot be quietly dropped from here while still being published."
        aside={
          <div className="rounded-panel border border-line bg-white p-6">
            <dl className="grid grid-cols-2 gap-5">
              <div>
                <dt className="text-[0.8125rem] text-grey">Figures published</dt>
                <dd className="figures mt-1 text-[2rem] font-bold leading-none text-blue-dark">
                  {counts.total}
                </dd>
              </div>
              <div>
                <dt className="text-[0.8125rem] text-grey">Re-checked at source</dt>
                <dd className="figures mt-1 text-[2rem] font-bold leading-none text-pending">
                  {counts.checked}
                </dd>
              </div>
            </dl>
            <p className="mt-4 text-[0.8125rem] leading-relaxed text-grey">
              The second number is the honest one, and it is zero. Every figure here was
              written down from a named official source. None has since been re-read at
              that source by a named person, and until one has, the count stays at zero
              rather than being softened.
            </p>
          </div>
        }
      />

      <section className="band">
        <div className="shell grid gap-10 lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-14">
          <div className="lg:sticky lg:top-24 lg:self-start">
            <JumpList
              items={groups.map((group) => ({ id: group.id, title: group.title }))}
              className="hidden lg:block"
            />
            <details className="rounded-card border border-line bg-light p-5 lg:hidden">
              <summary className="cursor-pointer text-[0.875rem] font-semibold text-blue-dark">
                Jump to a section
              </summary>
              <ul className="mt-3 grid gap-1.5">
                {groups.map((group) => (
                  <li key={group.id}>
                    <a href={`#${group.id}`} className="block py-1 text-[0.875rem] text-pink">
                      {group.title}
                    </a>
                  </li>
                ))}
              </ul>
            </details>
          </div>

          <div className="min-w-0">
            <div className="flex gap-3.5 rounded-panel border border-pending/25 bg-pending-bg p-6">
              <WarningCircle
                size={20}
                weight="fill"
                aria-hidden
                className="mt-0.5 shrink-0 text-pending"
              />
              <div>
                <h2 className="text-pending h--6">
                  Nothing on this page has been re-verified this quarter
                </h2>
                <p className="mt-2 text-[0.9375rem] leading-relaxed text-grey">
                  Every figure was taken from the official body named beside it, and each
                  one carries the day it was written into this site. A named person
                  re-reading the whole set at source is a real piece of work that has not
                  happened yet, and this page reports that as a count rather than as a
                  footnote. A confident date on a stale figure is worse than no date at all.
                </p>
              </div>
            </div>

            <div className="mt-10 space-y-12">
              {groups.map((group) => (
                <section key={group.id} id={group.id} className="scroll-mt-24">
                  <h2 className="text-blue-dark">
                    {group.title}
                  </h2>
                  <p className="mt-2 max-w-2xl text-[0.9375rem] leading-relaxed text-grey">
                    {group.blurb}
                  </p>
                  <p className="mt-2 text-[0.8125rem] text-grey">
                    <span className="figures">{group.figures.length}</span> figure
                    {group.figures.length === 1 ? "" : "s"}.
                  </p>

                  <div className="mt-5 overflow-x-auto rounded-panel border border-line bg-white">
                    <table className="w-full min-w-[46rem] border-collapse text-left">
                      <caption className="sr-only">
                        {group.title}: every published figure, its value, its source and the
                        date it was written down.
                      </caption>
                      <thead>
                        <tr className="border-b border-line bg-light">
                          <th
                            scope="col"
                            className="px-5 py-3 text-[0.75rem] font-semibold text-blue-dark"
                          >
                            Figure
                          </th>
                          <th
                            scope="col"
                            className="px-5 py-3 text-[0.75rem] font-semibold text-blue-dark"
                          >
                            Value
                          </th>
                          <th
                            scope="col"
                            className="px-5 py-3 text-[0.75rem] font-semibold text-blue-dark"
                          >
                            Source
                          </th>
                          <th
                            scope="col"
                            className="px-5 py-3 text-[0.75rem] font-semibold text-blue-dark"
                          >
                            Written down
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-line">
                        {group.figures.map((figure) => (
                          <tr key={figure.id} className="align-top">
                            <th scope="row" className="px-5 py-4">
                              <Link
                                href={figure.href}
                                className="text-[0.875rem] font-semibold text-blue-dark hover:text-pink"
                              >
                                {figure.label}
                              </Link>
                              <span className="mt-1 block text-[0.75rem] font-normal text-grey">
                                {figure.surface}
                              </span>
                            </th>
                            <td className="figures px-5 py-4 text-[0.875rem] text-blue-dark">
                              {figure.value}
                              {figure.status && (
                                <span className="mt-1.5 block font-sans text-[0.6875rem] text-grey">
                                  {figure.status}
                                </span>
                              )}
                            </td>
                            <td className="px-5 py-4 text-[0.8125rem] leading-relaxed text-grey">
                              {figure.source}
                            </td>
                            <td className="px-5 py-4">
                              <span className="figures block text-[0.8125rem] text-grey">
                                {figure.statedOn}
                              </span>
                              <span
                                className={
                                  figure.checkedBy
                                    ? "mt-1 block text-[0.75rem] text-verified"
                                    : isStale(figure.statedOn)
                                      ? "mt-1 block text-[0.75rem] font-medium text-denied"
                                      : "mt-1 block text-[0.75rem] text-pending"
                                }
                              >
                                {figure.checkedBy
                                  ? `Checked by ${figure.checkedBy}`
                                  : isStale(figure.statedOn)
                                    ? "Not re-checked, and overdue for a look"
                                    : "Not re-checked"}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </section>
              ))}
            </div>

            <div className="mt-12 rounded-panel border border-line bg-light p-7 md:p-9">
              <h2 className="text-blue-dark">
                Found one that is wrong?
              </h2>
              <p className="mt-3 max-w-2xl text-[0.9375rem] leading-relaxed text-grey">
                Tell us and we will check it. If it is wrong we correct it, we say on the
                page that it was wrong, and we leave that correction visible rather than
                quietly editing the number. Two of the figures on this site were corrected
                that way last week, and both corrections are still printed next to the
                values that replaced them.
              </p>
              <div className="mt-6 flex flex-wrap gap-4 text-[0.9375rem]">
                <Link
                  href="/book-consultation"
                  className="font-medium text-pink hover:text-blue"
                >
                  Tell us about a wrong figure
                </Link>
                <Link href="/open-ledger" className="font-medium text-pink hover:text-blue">
                  How a disputed commission figure is handled
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
