import Image from "next/image";
import Link from "next/link";
import { Fragment } from "react";
import { WarningDiamond } from "@phosphor-icons/react/ssr";
import { destinations } from "@/content/destinations";
import { guideForDestinationSlug } from "@/content/guides";
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
  const guide = guideForDestinationSlug(row.slug);
  return (
    <div className="Overview__box Dest-card bg-white pad-around pad-x flow">
      <div className="flex items-start justify-between gap-4">
        <h3 className="h h--4 text-blue-dark">
          {/* Stretched over the whole card in the stylesheet, so the card is
              one target; the figures stay selectable text. */}
          <Link href={guide ? `/destinations/${guide.slug}` : "/destinations"} className="Dest-card__link">
            {row.country}
          </Link>
        </h3>
        <span className="Dest-card__flag" aria-hidden>
          <Image
            src={`https://flagcdn.com/w160/${row.flagCode}.png`}
            alt=""
            width={80}
            height={60}
            className="h-12 w-auto rounded-sm ring-1 ring-blue-deep/10"
          />
          <svg className="Dest-card__cap" viewBox="-20 -11 40 26" focusable="false">
            <path d="M-10 1V8c0 2.6 4.5 4.6 10 4.6S10 10.6 10 8V1L0 5Z" className="fill-blue-deep" />
            <path d="M0-9L18-2L0 5L-18-2Z" className="fill-blue-deep stroke-white" strokeWidth="1.2" strokeLinejoin="round" />
            <path d="M0-2L13 1V9" fill="none" className="stroke-pink" strokeWidth="1.4" strokeLinecap="round" />
          </svg>
        </span>
      </div>
      {row.route && <p className="h text-teal-dark text-bold">{row.route}</p>}
      <p className="Dest-card__intakes">
        <span className="block text-[0.8125rem] font-medium uppercase tracking-wide text-grey">Intakes</span>
        <span className="figures text-step-1 font-extrabold text-blue-dark">{row.intakes}</span>
      </p>

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
