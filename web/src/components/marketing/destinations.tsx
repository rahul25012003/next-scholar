import Image from "next/image";
import { Fragment } from "react";
import { WarningDiamond } from "@phosphor-icons/react/ssr";
import { destinations } from "@/content/destinations";
import { photos, photoUrl } from "@/content/photos";
import { site } from "@/content/site";
import { StatusChip } from "@/components/ui/chip";
import {
  GridBars,
  OverviewImage,
  OverviewStroke,
  SpinCircle,
} from "@/components/marketing/overview-art";

/**
 * The reference's overview: a heading on the ground, a long pale stroke
 * drawing itself behind, and white boxes staggered down a grid with framed
 * photographs between them. Each box leads with the place, so the country
 * registers before a word is read, and then carries the figures.
 */
export function Destinations() {
  return (
    <section id="destinations" className="Overview anim-overview pad-after-lg scroll-mt-20">
      <OverviewStroke />
      <div className="Overview__inner constrain">
        <div className="Overview__heading flow">
          <h2 className="h h--3 text-light">Three destinations, covered end to end</h2>
          <p className="text-light">
            A country is added to this list only when its full profile can be
            answered without looking anything up. That is why there are three of
            them and not eleven.
          </p>
        </div>

        <div className="Overview__layout pad-before-lg">
          {destinations.map((row, index) => {
            const photo = photos.destinations[row.slug];
            const image = (
              <OverviewImage
                key={`${row.slug}-image`}
                src={photoUrl(photo, 800, 800)}
                alt={photo.alt}
                variant={(index % 3) as 0 | 1 | 2}
              />
            );
            const box = <DestinationBox key={row.slug} row={row} index={index} />;
            // The reference alternates: image then box, then box then image.
            return index % 2 === 0 ? (
              <Fragment key={row.slug}>
                {image}
                {box}
              </Fragment>
            ) : (
              <Fragment key={row.slug}>
                {box}
                {image}
              </Fragment>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function DestinationBox({
  row,
  index,
}: {
  row: (typeof destinations)[number];
  index: number;
}) {
  return (
    <div className="Overview__box bg-white pad-around pad-x flow">
      <div className="flex items-start justify-between gap-4">
        <h3 className="h h--4 text-blue-dark">{row.country}</h3>
        <Image
          src={`https://flagcdn.com/w80/${row.flagCode}.png`}
          alt=""
          width={40}
          height={30}
          className="mt-2 h-6 w-auto rounded-xs"
        />
      </div>
      {row.route && <p className="h text-teal text-bold">{row.route}</p>}
      <p className="small">{row.intakes} intakes</p>

      <div className="divide-y-2 divide-light">
        <Row label="Tuition, year one" value={row.tuition} note={row.tuitionNote} />
        <Row
          label="Post study window"
          value={row.postStudy}
          note={row.postStudyNote}
          flagNote={Boolean(row.postStudyNote)}
        />
        <div className="py-3.5">
          <dl className="flex flex-wrap items-start justify-between gap-x-6 gap-y-2">
            <dt>We earn</dt>
            <dd className="flex flex-col items-end gap-1.5">
              <span className="figures font-bold text-blue-dark">{row.commission.display}</span>
              <StatusChip status={row.commission.status} />
              {row.commission.aboveAverage && (
                <span className="inline-flex items-center gap-1 rounded-input bg-pending-bg px-2 py-1 text-[0.6875rem] font-medium text-pending">
                  <WarningDiamond size={12} weight="fill" aria-hidden />
                  Above category average
                </span>
              )}
            </dd>
          </dl>
        </div>
        <Row label="You pay us" value={row.clientFee} note={row.clientFeeNote} />
      </div>

      {row.commission.note && <p className="small bg-light p-4">{row.commission.note}</p>}

      <p className="small">{row.planningNote}</p>

      {index === 0 && <SpinCircle text={site.pitch} />}
      {index === 2 && <GridBars />}
    </div>
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
      <dl className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
        <dt>{label}</dt>
        <dd className="figures font-bold text-blue-dark">{value}</dd>
      </dl>
      {note && (
        <p className="small mt-1.5 max-w-prose">
          {flagNote && (
            <span className="mr-1.5 font-bold text-pending">Needs checking at source.</span>
          )}
          {note}
        </p>
      )}
    </div>
  );
}
