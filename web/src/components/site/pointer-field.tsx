"use client";

import { useEffect } from "react";

/**
 * Gives the page a sense of depth under the pointer. It publishes two
 * numbers, --px and --py, each from -1 to 1, to every element marked
 * `data-pointer`; the stylesheet decides what each one does with them (the
 * background shapes and the hero photograph shift by their own depth, the
 * ground's glow follows). Nothing else is done here.
 *
 * The numbers are written into one rule of a stylesheet this component owns,
 * never onto the elements themselves. Writing them as inline styles reached
 * elements React had not hydrated yet, the hero's photograph streams in after
 * the header, and React then reported the unexpected `style` attribute as a
 * hydration mismatch. A rule touches no element's attributes, and it also
 * covers anything marked `data-pointer` that arrives later.
 *
 * The value eases toward the pointer rather than snapping to it, and the loop
 * stops as soon as it has caught up, so a still pointer costs nothing. It
 * never starts on a touch screen or for anyone who has asked for less motion.
 */
export function PointerField() {
  useEffect(() => {
    if (
      !window.matchMedia("(pointer: fine)").matches ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    const sheet = new CSSStyleSheet();
    sheet.replaceSync("[data-pointer] { --px: 0; --py: 0; }");
    document.adoptedStyleSheets = [...document.adoptedStyleSheets, sheet];
    const values = (sheet.cssRules[0] as CSSStyleRule).style;

    let x = 0;
    let y = 0;
    let targetX = 0;
    let targetY = 0;
    let frame = 0;

    const tick = () => {
      x += (targetX - x) * 0.07;
      y += (targetY - y) * 0.07;
      values.setProperty("--px", x.toFixed(4));
      values.setProperty("--py", y.toFixed(4));
      const settled = Math.abs(targetX - x) + Math.abs(targetY - y) < 0.002;
      frame = settled ? 0 : requestAnimationFrame(tick);
    };

    const onMove = (event: PointerEvent) => {
      targetX = (event.clientX / window.innerWidth) * 2 - 1;
      targetY = (event.clientY / window.innerHeight) * 2 - 1;
      if (!frame) frame = requestAnimationFrame(tick);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(frame);
      document.adoptedStyleSheets = document.adoptedStyleSheets.filter((item) => item !== sheet);
    };
  }, []);

  return null;
}
