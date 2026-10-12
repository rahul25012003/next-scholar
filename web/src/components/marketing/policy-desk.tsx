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
    <section className="band" data-ground="light">
      <div className="shell">
        <div className="max-w-2xl">
          <h2 className="text-blue-dark">
            Policy desk
          </h2>
          <p className="mt-5 leading-relaxed text-grey">
            Visa and admission rules change often, and two of these notes correct figures
            we published ourselves. Check each one at its official source before you rely
            on it.
          </p>
        </div>

        <div className="mt-12 grid gap-px overflow-hidden rounded-panel bg-line md:grid-cols-2">
          {policyDesk.map((note, index) => (
            <Reveal key={note.title} delay={staggerDelay(index, 0.07)}>
              <article className="flex h-full flex-col bg-white p-7">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                  <p className="text-[0.8125rem] font-semibold text-pink">
                    {note.destination}
                  </p>
                  {note.isNew && (
                    <span className="inline-flex items-center gap-1 rounded-card bg-blue-light px-2 py-0.5 text-[0.6875rem] font-semibold text-blue-dark">
                      <Sparkle size={11} weight="fill" aria-hidden />
                      New requirement
                    </span>
                  )}
                  {note.effectiveFrom && (
                    <span className="rounded-card bg-pending-bg px-2 py-0.5 text-[0.6875rem] font-medium text-pending">
                      From {note.effectiveFrom}
                    </span>
                  )}
                </div>

                <h3 className="mt-3 text-blue-dark h--5">
                  {note.title}
                </h3>
                {/* Each sentence of a note is one point, so it reads as a list.
                    The body stays one string because the policy digest reads it. */}
                <ul className="mt-3.5 flex-1 list-disc space-y-1.5 pl-5 text-[0.9375rem] leading-relaxed text-grey">
                  {note.body.split(/(?<=\.) (?=[A-Z])/).map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>

                <div className="mt-6 border-t border-line pt-4">
                  <p className="text-[0.8125rem] text-grey">Source: {note.source}</p>
                  <p className="mt-1 text-[0.8125rem] font-medium text-pending">
                    Not yet re-checked this quarter
                  </p>
                  <Link
                    href={`/destinations/${note.guideSlug}`}
                    className="group mt-3 inline-flex items-center gap-1.5 text-[0.875rem] font-medium text-pink hover:text-blue-dark"
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
