"use client";

import { useId } from "react";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/cn";

/**
 * The decorative pieces of the reference's overview section: the long pale
 * stroke that draws itself behind the boxes, the framed images with their
 * swipe reveal and shapes, the spinning ring of text, and the bar grid.
 * Motion drives what the reference drove with GSAP; reduced motion renders
 * every piece in its settled state.
 */
const ease = [0.16, 1, 0.3, 1] as const;

export function OverviewStroke() {
  const reduced = useReducedMotion();
  return (
    <svg
      className="Overview__svg"
      role="presentation"
      aria-hidden
      focusable="false"
      preserveAspectRatio="xMidYMin slice"
      width="100%"
      fill="none"
      viewBox="-480 0 2300 2241"
    >
      <motion.path
        className="anim-overview-stroke stroke-blue-light"
        strokeWidth="200"
        opacity=".2"
        d="M-841 100H584c124 0 225 101 225 225v0c0 124-101 225-225 225h-95a281 281 0 00-281 281v0c0 155 125 281 281 281h442c167 0 304 136 304 304v0c0 168-137 304-304 304H795a439 439 0 00-439 439v82"
        initial={reduced ? false : { pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true, amount: "some" }}
        transition={{ duration: 2.6, ease: "easeInOut" }}
      />
    </svg>
  );
}

/** A ring of text that turns slowly, the reference's anim-spin. */
export function SpinRing({
  id,
  cx,
  cy,
  r,
  text,
  className,
}: {
  id: string;
  cx: number;
  cy: number;
  r: number;
  text: string;
  className?: string;
}) {
  return (
    <g className="anim-spin">
      <defs>
        <path
          id={id}
          d={`M ${cx} ${cy} m -${r} 0 a ${r} ${r} 0 1 1 ${2 * r} 0 a ${r} ${r} 0 1 1 -${2 * r} 0`}
        />
      </defs>
      <text
        className={cn("font-display", className)}
        fontSize="15"
        fontWeight="900"
        letterSpacing="2"
        style={{ textTransform: "uppercase" }}
      >
        <textPath href={`#${id}`}>{text}</textPath>
      </text>
    </g>
  );
}

/** The ring that hangs off the corner of the first overview box. */
export function SpinCircle({ text }: { text: string }) {
  const id = useId().replace(/:/g, "");
  return (
    <svg
      className="anim-circle Overview__circle"
      role="presentation"
      aria-hidden
      focusable="false"
      viewBox="0 0 262 250"
    >
      <SpinRing id={`${id}-ring`} cx={131} cy={125} r={100} text={text} className="fill-blue-dark" />
    </svg>
  );
}

/** The bar grid tucked behind the third overview box. */
export function GridBars() {
  return (
    <svg
      className="anim-grid Overview__grid"
      role="presentation"
      aria-hidden
      focusable="false"
      width="229"
      fill="none"
      viewBox="0 0 229 229"
    >
      <g className="fill-blue-dark">
        <path d="M163 49c4-2 10-1 12 4l23 39a9 9 0 01-16 9l-23-39c-2-4-1-10 4-13z" />
        <path d="M110 32c4-3 10-1 12 3l64 112a9 9 0 11-16 9L106 45c-2-5-1-11 4-13z" />
        <path d="M85 45a9 9 0 10-16 9l74 129a9 9 0 1016-9L85 45z" />
        <path d="M45 69c5-3 10-1 13 3l64 112a9 9 0 01-16 9L42 82c-3-5-1-10 3-13z" />
        <path d="M47 127a9 9 0 00-16 9l22 39a9 9 0 0016-9l-22-39z" />
      </g>
    </svg>
  );
}

/**
 * A framed photograph between the boxes. Three framings, cycled: a hex and a
 * cross with white noise lines, two teal arcs with a scatter of white marks,
 * and a dark ring with a pale circle. The photo wipes in from the side.
 */
export function OverviewImage({
  src,
  alt,
  variant,
}: {
  src: string;
  alt: string;
  variant: 0 | 1 | 2;
}) {
  const id = useId().replace(/:/g, "");
  const reduced = useReducedMotion();
  const box =
    variant === 1
      ? { x: 188, y: 93.77, width: 289.99, height: 289.99 }
      : { x: 60, y: 207, width: 392.8, height: 392.8 };
  const viewBox = variant === 1 ? "0 0 478 504.77" : "0 0 528 600";

  return (
    <motion.svg
      className="Overview__image"
      role="img"
      aria-labelledby={`${id}-title`}
      width="500px"
      viewBox={viewBox}
      initial={reduced ? false : "hidden"}
      whileInView="shown"
      viewport={{ once: true, amount: 0.3 }}
    >
      <title id={`${id}-title`}>{alt}</title>
      <clipPath id={`${id}-mask`}>
        <motion.rect
          className="swipe"
          {...box}
          variants={{
            hidden: { x: variant === 1 ? box.width : -box.width },
            shown: { x: 0 },
          }}
          transition={{ duration: 1, ease }}
        />
      </clipPath>

      {variant === 0 && (
        <>
          <path
            className="fill-blue-light"
            d="M75 113a14 14 0 0115-4l80 29a14 14 0 019 13l-3 85a14 14 0 01-10 12l-81 24a14 14 0 01-15-6l-48-70a14 14 0 011-16z"
          />
          <path
            className="fill-pink"
            fillRule="evenodd"
            d="M427 11a7 7 0 00-10 4l-5 15-15-5a7 7 0 00-4 13l14 6-5 14a7 7 0 0013 5l6-14 14 5a7 7 0 005-14l-14-5 5-15a7 7 0 00-4-9z"
          />
        </>
      )}

      {variant === 2 && (
        <>
          <path
            className="fill-blue-dark"
            fillRule="evenodd"
            d="M106 233a42 42 0 10-43-43 42 42 0 0043 43zm0 63A106 106 0 100 191a105 105 0 00106 105z"
          />
          <circle cx="416.4" cy="42.4" r="30" className="fill-blue-light" />
        </>
      )}

      <image
        preserveAspectRatio="xMidYMid slice"
        href={src}
        clipPath={`url(#${id}-mask)`}
        {...box}
      />

      {variant === 0 && (
        <g className="stroke-white" strokeLinecap="round" strokeMiterlimit="10" strokeWidth="10">
          <line x1="488.6" x2="518.5" y1="309.5" y2="287.8" />
          <line x1="465" x2="484.1" y1="287" y2="244.2" />
          <line x1="407.1" x2="377.2" y1="309.3" y2="287.6" />
          <line x1="430.7" x2="411.6" y1="286.8" y2="244" />
        </g>
      )}

      {variant === 1 && (
        <>
          <clipPath id={`${id}-big`}>
            <path d="M30.79,370.16A108.91,108.91,0,0,1,215.54,485.53l30.8,19.22A145.21,145.21,0,0,0,0,350.94Z" />
          </clipPath>
          <clipPath id={`${id}-small`}>
            <path d="M92.38,408.62A36.3,36.3,0,1,1,154,447.07l30.79,19.23A72.61,72.61,0,1,0,61.58,389.39Z" />
          </clipPath>
          <g className="fill-white">
            <rect x="265.99" y="17.33" width="9.96" height="19.91" />
            <rect x="328.21" y="89.51" width="19.91" height="9.96" />
            <rect x="193.81" y="89.51" width="19.91" height="9.96" />
            <rect x="218.76" y="36.68" width="9.95" height="19.91" transform="translate(32.55 171.87) rotate(-45)" />
            <rect x="308.18" y="41.63" width="19.91" height="9.96" transform="translate(60.21 238.59) rotate(-45)" />
          </g>
          <motion.path
            clipPath={`url(#${id}-big)`}
            className="stroke-teal-light"
            d="M12.76,364.64s70.11-108.4,178.79-39.7,35.76,174.85,35.76,174.85"
            fill="none"
            strokeMiterlimit="10"
            strokeWidth="45"
            variants={{ hidden: { pathLength: 0 }, shown: { pathLength: 1 } }}
            transition={{ duration: 1.2, ease: "easeInOut", delay: 0.4 }}
          />
          <motion.path
            clipPath={`url(#${id}-small)`}
            className="stroke-teal-light"
            d="M74.7,399.56s30.41-43.93,78.28-14.65,17.45,77.15,17.45,77.15"
            fill="none"
            strokeMiterlimit="10"
            strokeWidth="45"
            variants={{ hidden: { pathLength: 0 }, shown: { pathLength: 1 } }}
            transition={{ duration: 1, ease: "easeInOut", delay: 0.6 }}
          />
        </>
      )}
    </motion.svg>
  );
}
