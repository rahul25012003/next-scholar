"use client";

import { ReactLenis } from "lenis/react";
import { useReducedMotion } from "motion/react";

/**
 * Global smooth scroll. Anchor links inside the page inherit it, so the nav and
 * the hero CTA land on their section with the same easing rather than jumping.
 *
 * Anyone who has asked their system for reduced motion gets native scrolling,
 * and the wrapper unmounts Lenis entirely rather than running it at speed.
 */
export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const reduced = useReducedMotion();

  // Null until the preference is known. Native scrolling is the safe default.
  if (reduced !== false) return <>{children}</>;

  return (
    <ReactLenis
      root
      options={{
        duration: 1.1,
        easing: (t: number) => 1 - Math.pow(1 - t, 4),
        smoothWheel: true,
      }}
    >
      {children}
    </ReactLenis>
  );
}
