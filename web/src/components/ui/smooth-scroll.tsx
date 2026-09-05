"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { ReactLenis, useLenis } from "lenis/react";
import { useReducedMotion } from "motion/react";

/**
 * Lenis owns scroll position once mounted, which means Next's own
 * scroll-to-top-on-navigation never runs: the browser's native scroll offset
 * moves, but Lenis's virtualised position does not, so a route change lands
 * wherever the previous page happened to leave the reader. Reset it by hand
 * on every pathname change instead of on window scroll, which Lenis already
 * intercepts.
 */
function ScrollToTopOnNavigate() {
  const pathname = usePathname();
  const lenis = useLenis();

  useEffect(() => {
    lenis?.scrollTo(0, { immediate: true });
  }, [pathname, lenis]);

  return null;
}

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
      <ScrollToTopOnNavigate />
      {children}
    </ReactLenis>
  );
}
