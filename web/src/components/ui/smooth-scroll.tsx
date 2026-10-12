"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import { useReducedMotion } from "motion/react";

/**
 * Global smooth scroll. Anchor links inside the page inherit it, so the nav and
 * the hero CTA land on their section with the same easing rather than jumping.
 *
 * Anyone who has asked their system for reduced motion gets native scrolling:
 * Lenis is never created for them rather than being run at speed.
 *
 * This renders its children untouched on purpose. The motion preference is
 * unknown on the server and known on the client's first render, so wrapping
 * the children in a provider only once it is known gave the two renders
 * different trees, and every useId() below this point hydrated with the wrong
 * value. Lenis is driven from an effect instead, so the tree never changes.
 */
export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const reduced = useReducedMotion();
  const pathname = usePathname();
  const lenis = useRef<Lenis | null>(null);

  // Null until the preference is known. Native scrolling is the safe default.
  useEffect(() => {
    if (reduced !== false) return;
    // Follows the wheel closely rather than gliding after it: testers found
    // the old 1.1s glide made the page feel slow to answer the mouse. A lerp
    // of 0.2 catches up in a few frames.
    const instance = new Lenis({
      lerp: 0.2,
      wheelMultiplier: 1.15,
      smoothWheel: true,
      autoRaf: true,
    });
    lenis.current = instance;
    return () => {
      instance.destroy();
      lenis.current = null;
    };
  }, [reduced]);

  // Lenis owns scroll position once mounted, which means Next's own
  // scroll-to-top-on-navigation never runs: the browser's native scroll offset
  // moves, but Lenis's virtualised position does not, so a route change lands
  // wherever the previous page happened to leave the reader. Reset it by hand
  // on every pathname change.
  useEffect(() => {
    lenis.current?.scrollTo(0, { immediate: true });
  }, [pathname]);

  return children;
}
