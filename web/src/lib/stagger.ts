/**
 * The entry-motion stagger, capped.
 *
 * Sequence carries meaning for the first few items and stops carrying it after
 * that: on a twelve item list an uncapped 0.07s step puts the last card most of
 * a second behind the first, which reads as the page being slow rather than as
 * the list arriving in order.
 *
 * It lives here, in a plain module, rather than next to the Reveal component.
 * Reveal is a client component, and a function exported from a "use client"
 * module cannot be called by a server component: the callers are server
 * components computing a prop, so the helper has to sit outside that boundary.
 * A production build catches this and a dev server quietly falls back to the
 * loading skeleton, which is how it survived a dev-mode check.
 */
export const MAX_STAGGER_STEPS = 4;

export function staggerDelay(index: number, step = 0.07): number {
  return Math.min(index, MAX_STAGGER_STEPS) * step;
}
