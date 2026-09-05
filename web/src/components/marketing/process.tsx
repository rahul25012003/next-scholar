import Link from "next/link";
import { stageGroups, stages } from "@/content/process";
import { Reveal } from "@/components/ui/reveal";

export function Process() {
  const byKey = new Map(stages.map((stage) => [stage.key, stage]));

  return (
    <section id="process" className="band scroll-mt-20 bg-paper">
      <div className="shell">
        <div className="max-w-2xl">
          <h2 className="font-display text-3xl font-bold text-navy-900 md:text-[2.5rem]">
            Eleven stages, and what you get at each one
          </h2>
          <p className="mt-5 text-[1.0625rem] leading-relaxed text-body">
            The last stage is the one that makes the rest of them honest. Your
            result enters the public quarterly report whether it was an approval
            or a refusal.
          </p>
        </div>

        <div className="mt-14 grid gap-x-10 gap-y-14 lg:grid-cols-3">
          {stageGroups.map((group, groupIndex) => (
            <Reveal key={group.title} delay={groupIndex * 0.08}>
              <div>
                <h3 className="font-display text-[1.125rem] font-bold text-navy-900">
                  {group.title}
                </h3>
                <p className="mt-2 text-[0.875rem] leading-relaxed text-muted">
                  {group.blurb}
                </p>

                <ol className="mt-7 border-l border-line">
                  {group.keys.map((key) => {
                    const stage = byKey.get(key);
                    if (!stage) return null;
                    return (
                      <li key={key} className="relative pb-8 pl-6 last:pb-0">
                        <span
                          aria-hidden
                          className="absolute -left-[4.5px] top-2 h-2 w-2 rounded-full bg-blue-600"
                        />
                        <h4 className="font-display text-[1rem] font-bold text-navy-900">
                          <Link href={`/process/${stage.key}`} className="hover:text-blue-600">
                            {stage.name}
                          </Link>
                        </h4>
                        <p className="mt-1.5 text-[0.9375rem] leading-relaxed text-body">
                          {stage.summary}
                        </p>
                        <p className="mt-2 text-[0.8125rem] leading-relaxed text-muted">
                          You receive: {stage.deliverable}
                        </p>
                      </li>
                    );
                  })}
                </ol>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
