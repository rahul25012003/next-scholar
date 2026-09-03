import {
  Clock,
  GlobeHemisphereWest,
  HandCoins,
  ListChecks,
  Receipt,
} from "@phosphor-icons/react/ssr";
import { dayOneFigures } from "@/content/outcomes";
import { Reveal } from "@/components/ui/reveal";
import { staggerDelay } from "@/lib/stagger";
import { cn } from "@/lib/cn";

const icons = [GlobeHemisphereWest, ListChecks, HandCoins, Clock, Receipt];

const toneStyles: Record<string, string> = {
  blue: "bg-pastel-blue text-blue-600",
  mint: "bg-pastel-mint text-verified",
  peach: "bg-pastel-peach text-pending",
  rose: "bg-pastel-rose text-denied",
  lilac: "bg-pastel-lilac text-navy-700",
};

export function DayOneFigures() {
  return (
    <section className="band bg-paper">
      <div className="shell">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl font-bold text-navy-900 md:text-[2.5rem]">
            The only numbers we can stand behind
          </h2>
          <p className="mt-4 text-[1.0625rem] leading-relaxed text-body">
            No client has been taken on yet, so nothing here is a placement
            statistic. When there are placements, they appear in the quarterly
            report, refusals included.
          </p>
        </div>

        <div className="mt-14 grid gap-x-6 gap-y-11 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
          {dayOneFigures.map((figure, index) => {
            const Icon = icons[index];
            return (
              <Reveal key={figure.label} delay={staggerDelay(index, 0.06)}>
                <div className="text-center">
                  <span
                    className={cn(
                      "mx-auto grid h-14 w-14 place-items-center rounded-full",
                      toneStyles[figure.tone],
                    )}
                  >
                    <Icon size={24} weight="duotone" aria-hidden />
                  </span>
                  <p className="figures mt-5 text-[1.875rem] font-semibold leading-none text-navy-900">
                    {figure.value}
                  </p>
                  <p className="mt-2.5 text-[0.9375rem] font-medium leading-snug text-navy-900">
                    {figure.label}
                  </p>
                  <p className="mx-auto mt-2 max-w-[15rem] text-[0.8125rem] leading-relaxed text-muted">
                    {figure.detail}
                  </p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
