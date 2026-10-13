"use client";

import { useState } from "react";
import { Pause, Play } from "@phosphor-icons/react";

/**
 * One line of large type drifting across the ground between the hero and the
 * first panel. Each phrase is a commitment the pages below spell out in full,
 * so the line is hidden from assistive technology rather than read out twice,
 * and twice more for the copy that makes the loop seamless.
 *
 * It moves for longer than five seconds, so it can be stopped (WCAG 2.2.2):
 * the button at its right edge, over the faded end of the line, stops it for
 * good, and it holds still while the pointer or the focus is on it. Under
 * reduced motion it never moves, and the button is not shown.
 */
const phrases = [
  "No admission guarantees",
  "Documents never edited",
  "No predicted chances",
  "Refusals reported too",
  "Every figure sourced",
  "Three countries, in full",
];

export function Marquee() {
  const [stopped, setStopped] = useState(false);
  const [held, setHeld] = useState(false);

  return (
    <div
      className="relative"
      onMouseEnter={() => setHeld(true)}
      onMouseLeave={() => setHeld(false)}
      onFocus={() => setHeld(true)}
      onBlur={() => setHeld(false)}
    >
      <div className="Marquee" aria-hidden>
        <div
          className="Marquee__track"
          style={stopped || held ? { animationPlayState: "paused" } : undefined}
        >
          {[0, 1].map((copy) => (
            <ul key={copy} className="Marquee__line" role="list">
              {phrases.map((phrase) => (
                <li key={phrase} className="Marquee__item">
                  {phrase}
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>

      <button
        type="button"
        aria-pressed={stopped}
        onClick={() => setStopped((value) => !value)}
        className="absolute right-2 top-1/2 grid size-11 -translate-y-1/2 place-items-center rounded-full text-white transition-colors hover:bg-white/10 motion-reduce:hidden"
      >
        <span className="sr-only">Pause the moving text</span>
        {stopped ? (
          <Play size={18} weight="fill" aria-hidden />
        ) : (
          <Pause size={18} weight="fill" aria-hidden />
        )}
      </button>
    </div>
  );
}
