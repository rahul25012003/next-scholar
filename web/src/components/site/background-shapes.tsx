import type { CSSProperties } from "react";

/**
 * The fixed field of shapes behind every page: circles, dashes, dots, a hoop,
 * a hash and a squiggle, ported from the reference header. They sit at
 * z-index -1, so the page ground shows through them and every panel sits on
 * top. Each shape scales in on load, staggered, then drifts slowly; the
 * strokes draw themselves. Reduced motion collapses all of it in globals.css.
 */
const shape = (delay: number, opacity = 1, drift = -14): CSSProperties =>
  ({
    "--shape-delay": `${delay}s`,
    "--shape-opacity": opacity,
    "--shape-drift": `${drift}px`,
  }) as CSSProperties;

const stroke = (delay: number): CSSProperties =>
  ({ "--shape-delay": `${delay}s` }) as CSSProperties;

export function BackgroundShapes({ still = false }: { still?: boolean }) {
  return (
    <svg
      role="presentation"
      aria-hidden
      focusable="false"
      className={`anim-header anim-header--main${still ? " anim-header--still" : ""}`}
      preserveAspectRatio="xMidYMid slice"
      viewBox="0 -40 1440 900"
    >
      <defs>
        <clipPath id="squiggle-clip">
          <path
            fillRule="evenodd"
            d="M295-13a22 22 0 00-15-27l-377-97a66 66 0 00-81 48 66 66 0 0047 81l253 65a22 22 0 01-11 43L-20 66a66 66 0 00-82 48 66 66 0 0048 81l65 17a22 22 0 0011-43l-65-17a22 22 0 01-16-27 22 22 0 0127-16l132 34a67 67 0 0033-129l-252-65a22 22 0 01-16-27 22 22 0 0127-16L268 3a22 22 0 0027-16z"
          />
        </clipPath>
      </defs>
      <g>
        <circle className="shape fill-blue" style={shape(0.1, 0.3, -18)} cx="1389.5" cy="196.5" r="102.5" opacity=".3" />
        <path
          className="shape fill-blue-light"
          style={shape(0.35)}
          fillRule="evenodd"
          d="M1344 203a7 7 0 01-10-4l-10-23a7 7 0 014-9 7 7 0 019 4l3 8 10-26a7 7 0 0113 5l-10 26 8-4a7 7 0 019 4 7 7 0 01-3 9z"
        />
        <circle className="shape fill-teal-light" style={shape(0.5, 1, -10)} cx="1107" cy="557" r="10" />
        <line
          className="stroke stroke-teal-light"
          style={stroke(0.6)}
          x1="826"
          x2="1053.9"
          y1="835.9"
          y2="608"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="20"
        />
        <circle className="shape fill-blue" style={shape(0.2, 0.3, -12)} cx="931" cy="244" r="105" opacity=".3" />
        <line
          className="stroke stroke-blue-light"
          style={stroke(0.8)}
          x1="1483"
          x2="1255.1"
          y1="580.9"
          y2="353"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="20"
        />
        <circle className="shape fill-blue-light" style={shape(0.45, 1, -8)} cx="1207" cy="303" r="10" />
        <circle className="shape fill-blue" style={shape(0.55, 1, -8)} cx="41" cy="522" r="10" />
        <line
          className="stroke stroke-blue"
          style={stroke(0.3)}
          x1="779.9"
          x2="552"
          y1="-107"
          y2="120.9"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="20"
        />
        <circle className="shape fill-blue" style={shape(0.65, 1, -8)} cx="491" cy="176" r="10" />
        <path
          className="shape fill-blue-light"
          style={shape(0.4, 1, -16)}
          d="M295 226a6 6 0 017-2l37 13a6 6 0 015 6l-2 40a6 6 0 01-4 6l-38 11a6 6 0 01-7-3l-23-33a6 6 0 011-7z"
        />
        <g className="shape fill-blue" style={shape(0.25, 0.3, -10)} opacity=".3">
          <path d="M54 600a11 11 0 017-13l49-16a11 11 0 016 20l-49 16a11 11 0 01-13-7z" />
          <path d="M21 655a11 11 0 017-14l140-44a11 11 0 017 20L34 662a11 11 0 01-13-7z" />
          <path d="M30 685a11 11 0 006 21l162-51a11 11 0 10-6-21z" />
          <path d="M47 736a11 11 0 016-13l141-45a11 11 0 116 21L60 743a11 11 0 01-13-7z" />
          <path d="M112 749a11 11 0 006 20l49-15a11 11 0 00-6-21z" />
        </g>
        <path
          className="shape fill-teal-light"
          style={shape(0.7, 1, -20)}
          fillRule="evenodd"
          d="M1038 226a20 20 0 10-20-20 20 20 0 0020 20zm0 30a50 50 0 10-50-50 50 50 0 0050 50z"
        />
        <path
          className="stroke stroke-teal-light"
          style={stroke(0.5)}
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="20"
          d="M322 521L124 323"
        />
        <path
          className="shape fill-teal-light"
          style={shape(0.75, 1, -10)}
          fillRule="evenodd"
          d="M61 237a5 5 0 00-5 5v10H46a5 5 0 000 10h10v10a5 5 0 0010 0v-10h10a5 5 0 000-10H66v-10a5 5 0 00-5-5z"
        />
        <g className="shape fill-blue" style={shape(0.15, 0.3, -12)} opacity=".3">
          <path
            fillRule="evenodd"
            d="M1191 599a109 109 0 11185 116l30 19a145 145 0 00-246-154zm61 39a36 36 0 1162 38l31 20a73 73 0 00-123-77z"
          />
        </g>
        <path
          className="shape fill-blue-light"
          style={shape(0.3, 0.3, -14)}
          fillRule="evenodd"
          d="M492 539a62 62 0 00107 64l65 40a138 138 0 11-237-143z"
          opacity=".3"
        />
        <path
          clipPath="url(#squiggle-clip)"
          className="squiggle stroke-blue"
          opacity=".3"
          fill="none"
          fillRule="evenodd"
          strokeLinecap="round"
          strokeMiterlimit="10"
          strokeWidth="51"
          d="M278-18l-360-92c-36-10-66-5-75 31s23 50 58 59l228 57c12 3 39 22 30 55s-41 33-53 30L-5 92c-36-9-65-8-74 27s15 51 50 60l54 11"
        />
      </g>
    </svg>
  );
}
