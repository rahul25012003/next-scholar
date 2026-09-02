import { Check, Minus } from "@phosphor-icons/react/ssr";
import { Reveal } from "@/components/ui/reveal";

const usual = [
  "The commission is real, and it is never disclosed to you.",
  "Universities that pay nothing quietly stop appearing on shortlists.",
  "You pay a service fee on top, without knowing about the second income.",
  "The shortlist cannot be audited, so it cannot be argued with.",
];

const ours = [
  "Every figure is published before you pay us anything.",
  "The routes that pay us nothing get their own page, with instructions to apply without us.",
  "A commission above the category average is flagged in writing on the shortlist, before the recommendation.",
  "Every row is re-verified and republished quarterly, with the date attached.",
];

export function TheProblem() {
  return (
    <section className="band bg-surface">
      <div className="shell">
        <Reveal>
          <div className="max-w-3xl">
            <h2 className="font-display text-3xl font-bold text-navy-900 md:text-[2.5rem]">
              Why the shortlist you were given looked like that
            </h2>
            <p className="mt-5 text-[1.0625rem] leading-relaxed text-body">
              Most consultancies are paid by the universities they place you at,
              commonly ten to twenty percent of your first year tuition. None of
              that is illegal. It just means the universities that pay nothing
              stop appearing on shortlists, and you never find out which ones
              they were.
            </p>
          </div>
        </Reveal>

        <div className="mt-12 grid gap-5 lg:grid-cols-2">
          <Reveal>
            <div className="h-full rounded-panel border border-line bg-paper/60 p-7">
              <h3 className="font-display text-[1.125rem] font-bold text-ink-soft">
                The usual arrangement
              </h3>
              <ul className="mt-5 space-y-4">
                {usual.map((line) => (
                  <li key={line} className="flex gap-3">
                    <Minus
                      size={18}
                      weight="bold"
                      className="mt-0.5 shrink-0 text-muted"
                      aria-hidden
                    />
                    <span className="text-[0.9375rem] leading-relaxed text-body">
                      {line}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <div className="h-full rounded-panel border border-blue-600/20 bg-paper p-7 shadow-card">
              <h3 className="font-display text-[1.125rem] font-bold text-navy-900">
                What we do instead
              </h3>
              <ul className="mt-5 space-y-4">
                {ours.map((line) => (
                  <li key={line} className="flex gap-3">
                    <Check
                      size={18}
                      weight="bold"
                      className="mt-0.5 shrink-0 text-blue-600"
                      aria-hidden
                    />
                    <span className="text-[0.9375rem] leading-relaxed text-ink-soft">
                      {line}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
