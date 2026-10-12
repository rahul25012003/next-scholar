import { Fragment, type CSSProperties } from "react";

/**
 * A line of type that arrives word by word, each word rising out from behind
 * its own baseline. The words stay ordinary inline text with ordinary spaces
 * between them, so the heading reads, wraps, selects and is announced exactly
 * as it would unsplit; the motion is the `word-up` keyframe in globals.css.
 *
 * `start` offsets the stagger, so a heading split into several runs keeps
 * counting across them instead of restarting at each one.
 */
export function SplitText({ children, start = 0 }: { children: string; start?: number }) {
  return children.split(" ").map((word, index) => (
    <Fragment key={index}>
      {index > 0 && " "}
      <span className="Split">
        <span className="Split__word" style={{ "--i": start + index } as CSSProperties}>
          {word}
        </span>
      </span>
    </Fragment>
  ));
}
