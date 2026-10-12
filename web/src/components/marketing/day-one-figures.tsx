import Link from "next/link";
import {
  ArrowRight,
  Clock,
  GlobeHemisphereWest,
  HandCoins,
  ListChecks,
  Receipt,
  X,
} from "@phosphor-icons/react/ssr";
import { dayOneFigures } from "@/content/outcomes";
import { stages } from "@/content/process";
import { Reveal } from "@/components/ui/reveal";
import { staggerDelay } from "@/lib/stagger";
import { cn } from "@/lib/cn";

const icons = [GlobeHemisphereWest, ListChecks, HandCoins, Clock, Receipt];

const toneStyles: Record<string, string> = {
  blue: "bg-blue-light text-pink",
  mint: "bg-blue-light text-verified",
  peach: "bg-blue-light text-pending",
  rose: "bg-blue-light text-denied",
  lilac: "bg-blue-light text-blue-tint",
};

export function DayOneFigures() {
  return (
    <section className="band" data-ground="blue">
      <div className="shell">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-blue-dark">
            The only numbers we can stand behind
          </h2>
          <p className="mt-4 leading-relaxed text-grey">
            No client has been taken on yet, so nothing here is a placement
            statistic. When there are placements, they appear in the quarterly
            report, refusals included.
          </p>
        </div>

        <div className="mt-14 grid gap-x-6 gap-y-11 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
          {dayOneFigures.map((figure, index) => {
            const Icon = icons[index];
            const body = (
              <>
                <span
                  className={cn(
                    "mx-auto grid h-14 w-14 place-items-center rounded-full transition-transform duration-300 ease-(--ease-out-expo) group-hover:-rotate-12 group-hover:scale-115",
                    toneStyles[figure.tone],
                  )}
                >
                  <Icon size={24} weight="duotone" aria-hidden />
                </span>
                <p className="figures mt-5 text-[1.875rem] font-semibold leading-none text-blue-dark">
                  {figure.value}
                </p>
                <p className="mt-2.5 text-[0.9375rem] font-medium leading-snug text-blue-dark">
                  {figure.label}
                </p>
                <p className="mx-auto mt-2 max-w-[15rem] text-[0.8125rem] leading-relaxed text-grey">
                  {figure.detail}
                </p>
              </>
            );
            return (
              <Reveal key={figure.label} delay={staggerDelay(index, 0.06)}>
                {"opens" in figure ? (
                  <button
                    type="button"
                    popoverTarget="all-stages"
                    className="Figure-button group w-full text-center"
                  >
                    {body}
                    <span className="mt-3 inline-flex items-center gap-1 text-[0.8125rem] font-bold text-pink">
                      View all {stages.length} stages
                      <ArrowRight size={13} weight="bold" aria-hidden />
                    </span>
                  </button>
                ) : (
                  <div className="group text-center">{body}</div>
                )}
              </Reveal>
            );
          })}
        </div>
      </div>
      <AllStages />
    </section>
  );
}

/**
 * Every stage, numbered, opened from the stages figure. A native popover:
 * the browser handles opening, closing on Escape or an outside click, and
 * returning focus to the figure, with no script of our own.
 */
function AllStages() {
  return (
    <div id="all-stages" popover="auto" aria-labelledby="all-stages-title" className="Stages-popover" data-lenis-prevent>
      <div className="flex items-start justify-between gap-6">
        <h2 id="all-stages-title" className="h h--4 text-blue-dark">
          From first call to arrival
        </h2>
        <button
          type="button"
          popoverTarget="all-stages"
          popoverTargetAction="hide"
          aria-label="Close the list of stages"
          className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-light text-blue-dark hover:bg-blue-light"
        >
          <X size={18} weight="bold" aria-hidden />
        </button>
      </div>
      <ol className="mt-6 divide-y divide-line-strong border-y border-line-strong">
        {stages.map((stage, index) => (
          <li key={stage.key}>
            <Link
              href={`/process/${stage.key}`}
              className="group flex items-baseline gap-4 py-3.5 hover:text-pink"
            >
              <span className="figures w-7 shrink-0 font-display text-[1.125rem] font-extrabold text-pink">
                {index + 1}
              </span>
              <span>
                <span className="block font-display font-bold text-blue-dark group-hover:text-pink">
                  {stage.name}
                </span>
                <span className="mt-0.5 block text-[0.875rem] leading-relaxed text-grey">
                  You get: {stage.deliverable}
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ol>
    </div>
  );
}
