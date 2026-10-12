"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { useInView } from "motion/react";

/**
 * Fires the burst behind a hot button once, when the button first scrolls
 * fully into view, so the page's closing action announces itself to a reader
 * who never hovers it. It only sends the `burst` event, which bubbles to the
 * document; BurstLayer hears it there and throws the shapes.
 */
export function BurstOnView({ className, children }: { className?: string; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const seen = useInView(ref, { once: true, amount: 1 });

  useEffect(() => {
    if (!seen) return;
    const timer = window.setTimeout(() => ref.current?.dispatchEvent(new Event("burst", { bubbles: true })), 350);
    return () => window.clearTimeout(timer);
  }, [seen]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
