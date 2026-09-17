import { outcomeMetrics, reportingRules } from "@/content/outcomes";
import { Reveal } from "@/components/ui/reveal";
import { staggerDelay } from "@/lib/stagger";

export function Outcomes() {
  return (
    <section id="outcomes" className="band scroll-mt-20">
      <div className="shell">
        <div className="max-w-2xl">
          <h2 className="text-blue-dark">
            Outcomes, including the ones nobody publishes
          </h2>
          <p className="mt-5 leading-relaxed text-grey">
            Every counter below is empty, and stays empty until there is a real
            case behind it. The prototype this business replaces carried
            invented figures here, which is the specific habit Next Scholar
            exists to break.
          </p>
        </div>

        <Reveal>
          <div className="mt-12 grid overflow-hidden rounded-panel border border-line bg-white sm:grid-cols-2 lg:grid-cols-5">
            {outcomeMetrics.map((metric) => (
              <div
                key={metric.key}
                className="border-b border-line p-6 last:border-b-0 sm:[&:nth-last-child(-n+1)]:border-b-0 lg:border-b-0 lg:border-r lg:last:border-r-0"
              >
                <p className="figures text-[1.75rem] font-semibold leading-none text-line-strong">
                  {metric.value.state === "measured" ? metric.value.value : "0"}
                </p>
                <p className="mt-3 text-[0.9375rem] font-medium leading-snug text-blue-dark">
                  {metric.label}
                </p>
                <p className="mt-2 text-[0.8125rem] leading-relaxed text-grey">
                  {metric.value.state === "pending"
                    ? metric.value.reason
                    : `As of ${metric.value.asOf}`}
                </p>
              </div>
            ))}
          </div>
        </Reveal>

        <div className="mt-12 grid gap-x-10 gap-y-5 md:grid-cols-2">
          {reportingRules.map((rule, index) => (
            <Reveal key={rule} delay={staggerDelay(index, 0.05)}>
              <p className="border-t border-line-strong pt-4 text-[0.9375rem] leading-relaxed text-grey">
                {rule}
              </p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
