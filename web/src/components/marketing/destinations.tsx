import Image from "next/image";
import { WarningDiamond } from "@phosphor-icons/react/ssr";
import { destinations } from "@/content/destinations";
import { StatusChip } from "@/components/ui/chip";
import { Reveal } from "@/components/ui/reveal";

export function Destinations() {
  return (
    <section id="destinations" className="band bg-paper scroll-mt-20">
      <div className="shell">
        <div className="max-w-2xl">
          <h2 className="font-display text-3xl font-bold text-navy-900 md:text-[2.5rem]">
            Three destinations, covered end to end
          </h2>
          <p className="mt-5 text-[1.0625rem] leading-relaxed text-body">
            A country is added to this list only when its full profile can be
            answered without looking anything up. That is why there are three of
            them and not eleven.
          </p>
        </div>

        <div className="mt-12 grid gap-5 lg:grid-cols-2">
          {destinations.map((row, index) => (
            <Reveal key={row.slug} delay={index * 0.06}>
              <article className="flex h-full flex-col rounded-panel border border-line bg-paper p-7 shadow-card">
                <div className="flex items-center gap-3.5">
                  <Image
                    src={`https://flagcdn.com/w80/${row.flagCode}.png`}
                    alt=""
                    width={40}
                    height={30}
                    className="h-7 w-auto rounded-[3px] ring-1 ring-line"
                  />
                  <div>
                    <h3 className="font-display text-[1.25rem] font-bold text-navy-900">
                      {row.country}
                      {row.route && (
                        <span className="ml-2 align-middle text-[0.8125rem] font-medium text-muted">
                          {row.route}
                        </span>
                      )}
                    </h3>
                    <p className="text-[0.8125rem] text-muted">
                      {row.intakes} intakes
                    </p>
                  </div>
                </div>

                <dl className="mt-6 divide-y divide-line">
                  <Row label="Tuition, year one" value={row.tuition} note={row.tuitionNote} />
                  <Row
                    label="Post study window"
                    value={row.postStudy}
                    note={row.postStudyNote}
                    flagNote={Boolean(row.postStudyNote)}
                  />
                  <div className="flex flex-wrap items-start justify-between gap-x-6 gap-y-2 py-3.5">
                    <dt className="text-[0.9375rem] text-body">We earn</dt>
                    <dd className="flex flex-col items-end gap-1.5">
                      <span className="figures text-[0.9375rem] font-semibold text-navy-900">
                        {row.commission.display}
                      </span>
                      <StatusChip status={row.commission.status} />
                      {row.commission.aboveAverage && (
                        <span className="inline-flex items-center gap-1 rounded-input bg-pending-bg px-2 py-1 text-[0.6875rem] font-medium text-pending">
                          <WarningDiamond size={12} weight="fill" aria-hidden />
                          Above category average
                        </span>
                      )}
                    </dd>
                  </div>
                  <Row label="You pay us" value={row.clientFee} note={row.clientFeeNote} />
                </dl>

                {row.commission.note && (
                  <p className="mt-5 rounded-card bg-surface p-4 text-[0.8125rem] leading-relaxed text-body">
                    {row.commission.note}
                  </p>
                )}

                <p className="mt-5 text-[0.875rem] leading-relaxed text-muted">
                  {row.planningNote}
                </p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Row({
  label,
  value,
  note,
  flagNote,
}: {
  label: string;
  value: string;
  note?: string;
  flagNote?: boolean;
}) {
  return (
    <div className="py-3.5">
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
        <dt className="text-[0.9375rem] text-body">{label}</dt>
        <dd className="figures text-[0.9375rem] font-semibold text-navy-900">
          {value}
        </dd>
      </div>
      {note && (
        <p className="mt-1.5 max-w-prose text-[0.8125rem] leading-relaxed text-muted">
          {flagNote && (
            <span className="mr-1.5 font-medium text-pending">Needs checking at source.</span>
          )}
          {note}
        </p>
      )}
    </div>
  );
}
