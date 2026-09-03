import Link from "next/link";
import { ArrowRight, Sparkle } from "@phosphor-icons/react/ssr";
import { policyDesk } from "@/content/destinations";
import { Reveal } from "@/components/ui/reveal";
import { staggerDelay } from "@/lib/stagger";

/**
 * The policy desk.
 *
 * A dated change reads differently from a standing rule, so the effective date
 * is a chip rather than a sentence buried in the body, and a genuinely new
 * requirement is marked as new. The dMAT is the reason both exist: it is a new
 * mandatory test, with a date, aimed almost precisely at the population this
 * business serves, and it was not on this site at all.
 */
export function PolicyDesk() {
  return (
    <section className="band bg-surface">
      <div className="shell">
        <div className="max-w-2xl">
          <h2 className="font-display text-3xl font-bold text-navy-900 md:text-[2.5rem]">
            Policy desk
          </h2>
          <p className="mt-5 text-[1.0625rem] leading-relaxed text-body">
            The rules that decide whether a plan works change more often than most sites
            admit, and two of the notes below are corrections to figures we published
            ourselves. Each one still needs re-checking at its official source, and it says
            so, because a confident date on a stale figure is worse than no date at all.
          </p>
        </div>

        <div className="mt-12 grid gap-px overflow-hidden rounded-panel bg-line md:grid-cols-2">
          {policyDesk.map((note, index) => (
            <Reveal key={note.title} delay={staggerDelay(index, 0.07)}>
              <article className="flex h-full flex-col bg-paper p-7">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                  <p className="text-[0.8125rem] font-semibold text-blue-600">
                    {note.destination}
                  </p>
                  {note.isNew && (
                    <span className="inline-flex items-center gap-1 rounded-input bg-blue-100 px-2 py-0.5 text-[0.6875rem] font-semibold text-navy-900">
                      <Sparkle size={11} weight="fill" aria-hidden />
                      New requirement
                    </span>
                  )}
                  {note.effectiveFrom && (
                    <span className="rounded-input bg-pending-bg px-2 py-0.5 text-[0.6875rem] font-medium text-pending">
                      From {note.effectiveFrom}
                    </span>
                  )}
                </div>

                <h3 className="mt-3 font-display text-[1.125rem] font-bold leading-snug text-navy-900">
                  {note.title}
                </h3>
                <p className="mt-3.5 flex-1 text-[0.9375rem] leading-relaxed text-body">
                  {note.body}
                </p>

                <div className="mt-6 border-t border-line pt-4">
                  <p className="text-[0.8125rem] text-muted">Source: {note.source}</p>
                  <p className="mt-1 text-[0.8125rem] font-medium text-pending">
                    Not yet re-verified for this quarter
                  </p>
                  <Link
                    href={`/destinations/${note.guideSlug}`}
                    className="group mt-3 inline-flex items-center gap-1.5 text-[0.875rem] font-medium text-blue-600 hover:text-blue-500"
                  >
                    The full {note.destination} guide
                    <ArrowRight
                      size={14}
                      weight="bold"
                      aria-hidden
                      className="transition-transform group-hover:translate-x-0.5"
                    />
                  </Link>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
