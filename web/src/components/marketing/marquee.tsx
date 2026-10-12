/**
 * One line of large type drifting across the ground between the hero and the
 * first panel. Each phrase is a commitment the pages below spell out in full,
 * so the line is hidden from assistive technology rather than read out twice,
 * and twice more for the copy that makes the loop seamless.
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
  return (
    <div className="Marquee" aria-hidden>
      <div className="Marquee__track">
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
  );
}
