"use client";

import { useId } from "react";
import { motion, useReducedMotion } from "motion/react";
import { SpinRing } from "@/components/marketing/overview-art";
import { cn } from "@/lib/cn";

type Frame = { src: string; alt: string };

const ease = [0.16, 1, 0.3, 1] as const;

/**
 * The reference's image collage: two photographs in offset frames, each
 * wiping in from its own side, with a ring of text turning between them.
 * Reversed, the larger frame moves to the top.
 */
export function ImageSwipe({
  top,
  bottom,
  ring,
  reverse = false,
  className,
}: {
  top: Frame;
  bottom: Frame;
  ring: string;
  reverse?: boolean;
  className?: string;
}) {
  const id = useId().replace(/:/g, "");
  const reduced = useReducedMotion();
  const topBox = reverse
    ? { width: 280, height: 280, x: 215, y: 0 }
    : { width: 215, height: 215, x: 282, y: 0 };
  const bottomBox = reverse
    ? { width: 215, height: 215, x: 0, y: 282 }
    : { width: 281.1, height: 273.6, x: 0, y: 214 };

  return (
    <motion.svg
      className={cn("anim-image-swipe", reverse && "anim-image-swipe--reverse", className)}
      role="img"
      aria-labelledby={`${id}-title`}
      viewBox="0 0 490 488"
      initial={reduced ? false : "hidden"}
      whileInView="shown"
      viewport={{ once: true, amount: 0.3 }}
    >
      <title id={`${id}-title`}>{`${top.alt}. ${bottom.alt}`}</title>
      <clipPath id={`${id}-top`}>
        <motion.rect
          className="swipe"
          {...topBox}
          variants={{ hidden: { x: topBox.width }, shown: { x: 0 } }}
          transition={{ duration: 1, ease }}
        />
      </clipPath>
      <clipPath id={`${id}-bottom`}>
        <motion.rect
          className="swipe"
          {...bottomBox}
          variants={{ hidden: { x: -bottomBox.width }, shown: { x: 0 } }}
          transition={{ duration: 1, ease, delay: 0.15 }}
        />
      </clipPath>
      <image
        clipPath={`url(#${id}-top)`}
        {...topBox}
        preserveAspectRatio="xMidYMid slice"
        href={top.src}
      />
      <image
        clipPath={`url(#${id}-bottom)`}
        {...bottomBox}
        preserveAspectRatio="xMidYMid slice"
        href={bottom.src}
      />
      <SpinRing
        id={`${id}-ring`}
        cx={reverse ? 193 : 283}
        cy={reverse ? 302 : 208}
        r={84}
        text={ring}
        className={reverse ? "fill-teal" : "fill-pink"}
      />
    </motion.svg>
  );
}
