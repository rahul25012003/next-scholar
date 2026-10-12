"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

/**
 * The flags of the three countries we advise on, and graduation caps, rising
 * from behind a button. Kept to two places on purpose, so the rest of the
 * site's buttons stay plain:
 *
 *   plant   a button that names a destination: that country's flag rises on
 *           a staff crowned with a small cap, waves, and sinks back.
 *   toss    the home page's closing pink button: two caps and the three
 *           flags thrown up like a graduation and falling back.
 *
 * One layer, mounted once, listening at the document. The art is drawn in one
 * fixed layer over the page rather than inside each button, and each burst is
 * clipped by the outline of its own button, so nothing is ever drawn over a
 * label and everything appears to come from behind the button.
 *
 * Fired by the pointer entering, keyboard focus, a touch press, and a
 * bubbling `burst` event (the closing section sends one when it scrolls into
 * view). Driven by the Web Animations API, so no animation library is loaded
 * for it. Nothing fires for anyone who has asked for reduced motion.
 */
const NS = "http://www.w3.org/2000/svg";
const BUTTONS = ".button:not(.button--quiet)";

type Country = "gb" | "de" | "ie";
const NAMED: [Country, RegExp][] = [
  ["gb", /united[- ]kingdom|\buk\b|britain|british/],
  ["de", /german/],
  ["ie", /ireland|irish/],
];

const between = (low: number, high: number) => low + Math.random() * (high - low);
const countryIn = (text: string) => NAMED.find(([, pattern]) => pattern.test(text.toLowerCase()))?.[0] ?? null;

function make(tag: string, attrs: Record<string, string | number> = {}, ...children: Node[]) {
  const node = document.createElementNS(NS, tag);
  for (const [key, value] of Object.entries(attrs)) node.setAttribute(key, String(value));
  node.append(...children);
  return node;
}

/** A group at x, y: whatever is drawn around its 0,0 turns about that point. */
const at = (x: number, y: number, ...children: Node[]) =>
  make("g", { transform: `translate(${x} ${y})` }, ...children);

/* --- The art. Real flag colours, everything else from the palette. ------- */

const cloth: Record<Country, () => Node[]> = {
  gb: () => [
    make("rect", { width: 30, height: 18, fill: "#012169" }),
    make("path", { d: "M0 0L30 18M30 0L0 18", stroke: "#fff", "stroke-width": 3.6 }),
    make("path", { d: "M0 0L30 18M30 0L0 18", stroke: "#c8102e", "stroke-width": 1.2 }),
    make("path", { d: "M15 0V18M0 9H30", stroke: "#fff", "stroke-width": 6 }),
    make("path", { d: "M15 0V18M0 9H30", stroke: "#c8102e", "stroke-width": 3.6 }),
  ],
  de: () =>
    ["#000", "#dd0000", "#ffce00"].map((fill, band) => make("rect", { y: band * 6, width: 30, height: 6, fill })),
  ie: () =>
    ["#169b62", "#fff", "#ff883e"].map((fill, band) => make("rect", { x: band * 10, width: 10, height: 18, fill })),
};

/** A 30 by 18 flag from its top left corner, edged in white so it reads on the blue ground and on a white panel. */
const flag = (country: Country) =>
  make(
    "g",
    {},
    make("g", { "clip-path": "url(#burst-flag)" }, ...cloth[country]()),
    make("rect", { width: 30, height: 18, rx: 2.5, fill: "none", class: "stroke-white", "stroke-width": 1.4 }),
  );

/** A loose flag, turning about its centre. */
const card = (country: Country) => at(-15, -9, flag(country));

/** A mortarboard about 38 wide, centred, its tassel free to swing. */
const cap = () =>
  make(
    "g",
    { "stroke-linejoin": "round", "stroke-linecap": "round" },
    make("path", { d: "M-10 1V8c0 2.6 4.5 4.6 10 4.6S10 10.6 10 8V1L0 5Z", class: "fill-blue-deep stroke-white", "stroke-width": 1 }),
    make("path", { d: "M0-9L18-2L0 5L-18-2Z", class: "fill-blue-deep stroke-white", "stroke-width": 1.2 }),
    make("path", { d: "M0-2L13 1", fill: "none", class: "stroke-pink", "stroke-width": 1.4 }),
    make("circle", { cy: -2, r: 1.7, class: "fill-pink" }),
    at(
      13,
      1,
      make(
        "g",
        { class: "Burst-tassel" },
        make("path", { d: "M0 0V7", class: "stroke-pink", "stroke-width": 1.4 }),
        make("path", { d: "M-2 7h4l1 5h-6z", class: "fill-pink" }),
      ),
    ),
  );

/** A flag on a staff crowned with a small cap, turning about the foot of the staff. */
const staff = (country: Country, height: number) =>
  make(
    "g",
    {},
    make("path", { d: `M0 0V${-height}`, class: "stroke-blue-deep", "stroke-width": 2.2, "stroke-linecap": "round" }),
    at(1, -height + 1, make("g", { class: "Burst-wave" }, flag(country))),
    at(0, -height - 6, make("g", { transform: "scale(0.6)" }, cap())),
  );

/* --- The two choreographies. Each places its pieces relative to the
   button's centre and says how each one moves from there. ---------------- */

type Piece = {
  art: Node;
  x?: number;
  keyframes: Keyframe[];
  duration: number;
  delay?: number;
};

const SPRING = "cubic-bezier(0.34, 1.56, 0.64, 1)";
const FALL = "cubic-bezier(0.55, 0, 0.85, 0.35)";

function plant(box: DOMRect, country: Country): Piece[] {
  const height = box.height / 2 + 26;
  return [
    {
      art: staff(country, height),
      x: box.width / 2 - Math.min(box.height / 2, 26),
      keyframes: [
        { transform: "translate(0px, 28px) rotate(0deg)", opacity: 0, easing: SPRING },
        { transform: "translate(0px, 0px) rotate(9deg)", opacity: 1, offset: 0.24 },
        { transform: "translate(0px, 0px) rotate(5deg)", opacity: 1, offset: 0.78, easing: "ease-in" },
        { transform: "translate(0px, 28px) rotate(2deg)", opacity: 0 },
      ],
      duration: 2200,
    },
  ];
}

function toss(box: DOMRect): Piece[] {
  const cast = [() => card("gb"), cap, () => card("de"), cap, () => card("ie")];
  const reach = Math.min(box.width * 0.6 + 50, window.innerWidth * 0.36);
  return cast.map((art, index) => {
    const spread = (index / (cast.length - 1)) * 2 - 1 + between(-0.1, 0.1);
    const peak = between(90, 150);
    const spin = between(180, 360) * (spread < 0 ? -1 : 1);
    return {
      art: art(),
      keyframes: [
        { transform: "translate(0px, 0px) rotate(0deg) scale(0.5)", opacity: 1, easing: "cubic-bezier(0.15, 0.6, 0.35, 1)" },
        { transform: `translate(${spread * reach * 0.55}px, ${-peak}px) rotate(${spin * 0.5}deg) scale(0.9)`, opacity: 1, offset: 0.42, easing: FALL },
        { transform: `translate(${spread * reach}px, ${box.height / 2 + 60}px) rotate(${spin}deg) scale(0.8)`, opacity: 0 },
      ],
      duration: between(1700, 2000),
      delay: index * 60,
    };
  });
}

/** The pieces for this button, or none: most buttons fire nothing. */
function piecesFor(button: Element, box: DOMRect): Piece[] {
  if (button.closest(".Ticket-slat__button")) return toss(box);
  const country = countryIn(`${button.textContent} ${button.getAttribute("href") ?? ""}`);
  return country ? plant(box, country) : [];
}

/** The whole screen with the button's rounded outline cut out of it. */
function around(box: DOMRect, radius: number) {
  const { left: x, top: y, width: w, height: h } = box;
  const r = Math.min(radius, w / 2, h / 2);
  return (
    `M0 0H${window.innerWidth}V${window.innerHeight}H0Z ` +
    `M${x + r} ${y}H${x + w - r}A${r} ${r} 0 0 1 ${x + w} ${y + r}V${y + h - r}` +
    `A${r} ${r} 0 0 1 ${x + w - r} ${y + h}H${x + r}A${r} ${r} 0 0 1 ${x} ${y + h - r}` +
    `V${y + r}A${r} ${r} 0 0 1 ${x + r} ${y}Z`
  );
}

export function BurstLayer() {
  const ref = useRef<SVGGElement>(null);
  const pathname = usePathname();

  // The layer outlives a client-side navigation, and each burst is clipped
  // around a button on the page it was fired from. Clear it when the page
  // changes, so nothing from the last page drifts across the next one.
  useEffect(() => {
    ref.current?.replaceChildren();
  }, [pathname]);

  useEffect(() => {
    const layer = ref.current;
    if (!layer) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let serial = 0;

    const fire = (button: Element) => {
      const box = button.getBoundingClientRect();
      if (box.width === 0) return;
      const pieces = piecesFor(button, box);
      if (pieces.length === 0) return;

      // An SVG clipPath in user space, not a CSS path(): a CSS shape on an SVG
      // group is measured from the group's own bounding box, which moves as
      // the pieces fly, so the hole would drift off the button.
      const radius = parseFloat(getComputedStyle(button).borderTopLeftRadius) || 0;
      const id = `burst-${(serial += 1)}`;
      const hole = make(
        "clipPath",
        { id, clipPathUnits: "userSpaceOnUse" },
        make("path", { d: around(box, radius), "clip-rule": "evenodd" }),
      );
      const group = at(box.left + box.width / 2, box.top + box.height / 2);
      const clip = make("g", { "clip-path": `url(#${id})` }, hole, group);
      layer.appendChild(clip);

      const flights = pieces.map(({ art, x = 0, keyframes, duration, delay = 0 }) => {
        const body = make("g", {}, art);
        // The shadow sits on the still parent, so it stays below a piece however the piece turns.
        group.appendChild(make("g", { transform: `translate(${x} 0)`, filter: "url(#burst-lift)" }, body));
        return body.animate(keyframes, { duration, delay, fill: "both" });
      });

      // The flags wave from the staff and the tassels swing for as long as
      // the burst is in the air; neither decides when it is over.
      for (const cloth of group.querySelectorAll(".Burst-wave")) {
        cloth.animate([{ transform: "skewY(6deg) scaleX(0.9)" }, { transform: "skewY(-4deg) scaleX(1)" }], {
          duration: 360,
          direction: "alternate",
          iterations: 6,
          easing: "ease-in-out",
        });
      }
      for (const tassel of group.querySelectorAll(".Burst-tassel")) {
        tassel.animate([{ transform: "rotate(22deg)" }, { transform: "rotate(-16deg)" }], {
          duration: 420,
          direction: "alternate",
          iterations: 5,
          easing: "ease-in-out",
        });
      }

      Promise.allSettled(flights.map((flight) => flight.finished)).then(() => clip.remove());
    };

    const buttonAt = (target: EventTarget | null) =>
      target instanceof Element ? target.closest(BUTTONS) : null;

    const onOver = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      const button = buttonAt(event.target);
      // Only on the way in, not on each move between the button's children.
      if (!button || (event.relatedTarget instanceof Node && button.contains(event.relatedTarget))) return;
      fire(button);
    };
    const onFocus = (event: FocusEvent) => {
      const button = buttonAt(event.target);
      if (button?.matches(":focus-visible")) fire(button);
    };
    const onTouch = (event: TouchEvent) => {
      const button = buttonAt(event.target);
      if (button) fire(button);
    };
    const onBurst = (event: Event) => {
      const button = event.target instanceof Element ? event.target.querySelector(BUTTONS) : null;
      if (button) fire(button);
    };

    document.addEventListener("pointerover", onOver);
    document.addEventListener("focusin", onFocus);
    document.addEventListener("touchstart", onTouch, { passive: true });
    document.addEventListener("burst", onBurst);
    return () => {
      document.removeEventListener("pointerover", onOver);
      document.removeEventListener("focusin", onFocus);
      document.removeEventListener("touchstart", onTouch);
      document.removeEventListener("burst", onBurst);
    };
  }, []);

  return (
    <svg className="Burst-layer" aria-hidden focusable="false">
      <defs>
        {/* Rounds every flag's corners and trims the Union Jack's diagonals. */}
        <clipPath id="burst-flag">
          <rect width="30" height="18" rx="2.5" />
        </clipPath>
        {/* The panels' own lift: the ground's blue taken darker, never grey. */}
        <filter id="burst-lift" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="0" dy="3" stdDeviation="2.5" floodColor="#0d244e" floodOpacity="0.35" />
        </filter>
      </defs>
      <g ref={ref} />
    </svg>
  );
}
