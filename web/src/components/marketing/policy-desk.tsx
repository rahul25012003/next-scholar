import { policyDesk } from "@/content/destinations";
import { Reveal } from "@/components/ui/reveal";

export function PolicyDesk() {
  return (
    <section className="band bg-surface">
      <div className="shell">
        <div className="max-w-2xl">
          <h2 className="font-display text-3xl font-bold text-navy-900 md:text-[2.5rem]">
            Policy desk
          </h2>
          <p className="mt-5 text-[1.0625rem] leading-relaxed text-body">
            The rules that decide whether a plan works change more often than
            most sites admit. Each note below still needs re-checking at its
            official source, and it says so, because a confident date on a stale
            figure is worse than no date at all.
          </p>
        </div>

        <div className="mt-12 grid gap-px overflow-hidden rounded-panel bg-line md:grid-cols-3">
          {policyDesk.map((note, index) => (
            <Reveal key={note.title} delay={index * 0.07}>
              <article className="flex h-full flex-col bg-paper p-7">
                <p className="text-[0.8125rem] font-semibold text-blue-600">
                  {note.destination}
                </p>
                <h3 className="mt-3 font-display text-[1.125rem] font-bold leading-snug text-navy-900">
                  {note.title}
                </h3>
                <p className="mt-3.5 flex-1 text-[0.9375rem] leading-relaxed text-body">
                  {note.body}
                </p>
                <div className="mt-6 border-t border-line pt-4">
                  <p className="text-[0.8125rem] text-muted">
                    Source: {note.source}
                  </p>
                  <p className="mt-1 text-[0.8125rem] font-medium text-pending">
                    Not yet re-verified for this quarter
                  </p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
