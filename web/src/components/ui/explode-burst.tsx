import type { CSSProperties } from "react";

/**
 * The burst behind a hot button. Twelve dots at the centre of the control
 * that fly outward and fade when it is hovered or focused, the way the
 * reference's Tickets button explodes. Pure CSS: the directions are custom
 * properties, the motion is the `explode` keyframe in globals.css.
 */
const particles = [
  { dx: 0, dy: -1, tone: "fill-pink", r: 14 },
  { dx: 0.7, dy: -0.7, tone: "fill-teal-light", r: 9 },
  { dx: 1, dy: 0, tone: "fill-blue-light", r: 11 },
  { dx: 0.7, dy: 0.7, tone: "fill-pink", r: 8 },
  { dx: 0, dy: 1, tone: "fill-white", r: 12 },
  { dx: -0.7, dy: 0.7, tone: "fill-teal-light", r: 9 },
  { dx: -1, dy: 0, tone: "fill-blue-light", r: 13 },
  { dx: -0.7, dy: -0.7, tone: "fill-pink", r: 8 },
  { dx: 0.35, dy: -0.95, tone: "fill-white", r: 6 },
  { dx: 0.95, dy: 0.35, tone: "fill-teal-light", r: 6 },
  { dx: -0.35, dy: 0.95, tone: "fill-pink", r: 6 },
  { dx: -0.95, dy: -0.35, tone: "fill-blue-light", r: 6 },
];

export function ExplodeBurst() {
  return (
    <svg className="anim-explode" viewBox="0 0 500 500" aria-hidden focusable="false">
      {particles.map((particle, index) => (
        <circle
          key={index}
          cx="250"
          cy="250"
          r={particle.r}
          className={particle.tone}
          style={
            {
              "--dx": `${Math.round(particle.dx * 170)}px`,
              "--dy": `${Math.round(particle.dy * 170)}px`,
              animationDelay: `${index * 0.02}s`,
            } as CSSProperties
          }
        />
      ))}
    </svg>
  );
}
