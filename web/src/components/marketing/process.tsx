import Link from "next/link";
import { stages } from "@/content/process";
import { Reveal } from "@/components/ui/reveal";

/**
 * The eleven stages as one numbered line, 1 to 11 from top to bottom, so a
 * reader can follow the whole engagement in order without grouping to decode.
 */
export function Process() {
  return (
    <section id="process" className="band scroll-mt-20">
      <div className="shell">
        <div className="max-w-2xl">
          <h2 className="text-blue-dark">
            Eleven stages, and what you get at each one
          </h2>
          <p className="mt-5 leading-relaxed text-grey">
            Your result goes into our public quarterly report, whether it was an
            approval or a refusal.
          </p>
        </div>

        <ol className="Stages mt-12 max-w-3xl">
          {stages.map((stage, index) => (
            <Reveal key={stage.key} as="li" delay={Math.min(index, 4) * 0.04} className="Stages__item">
              <span aria-hidden className="Stages__number figures">
                {index + 1}
              </span>
              <div className="pb-9">
                <h3 className="h--6 text-blue-dark">
                  <Link href={`/process/${stage.key}`} className="hover:text-pink">
                    <span className="sr-only">Stage {index + 1}: </span>
                    {stage.name}
                  </Link>
                </h3>
                <p className="mt-1.5 text-[0.9375rem] leading-relaxed text-grey">
                  {stage.summary}
                </p>
                <p className="mt-2 text-[0.875rem] leading-relaxed text-blue-dark">
                  <span className="font-semibold">You get:</span> {stage.deliverable}
                </p>
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
