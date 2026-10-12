import { Check, Minus } from "@phosphor-icons/react/ssr";
import { Reveal } from "@/components/ui/reveal";
import { ImageSwipe } from "@/components/marketing/image-swipe";
import { photos, photoUrl } from "@/content/photos";
import { site } from "@/content/site";

const usual = [
  "They are paid a commission, and you are never told about it.",
  "Universities that pay nothing quietly drop off the shortlist.",
  "You pay them a fee as well, without knowing they are paid twice.",
  "You cannot check the shortlist, so you cannot question it.",
];

const ours = [
  "You see every figure before you pay us anything.",
  "If a university pays us more than double the average for its category, the shortlist says so in writing before we recommend it.",
  "We re-check every figure each quarter and show the date.",
];

/**
 * The reference's intro panel: a heading across the top, the copy in the
 * left half, and the photo collage hanging off the bottom right corner. The
 * two comparison lists sit under the copy in the same half.
 */
export function TheProblem() {

  return (
    <section className="Intro constrain anim-home--intro">
      <div className="Intro__inner pad-before-lg pad-x-lg bg-white flow">
        <h2 className="Intro__heading h h--3 text-blue-dark">
          Why the shortlist you were given looked like that
        </h2>

        <div className="Intro__copy flow">
          <p>
            Most consultancies are paid by the universities they send you to,
            often ten to twenty percent of your first year tuition. That is
            legal, but it changes which universities you hear about.
          </p>

          <Reveal>
            <div className="flow bg-light p-7">
              <h3 className="h h--5 text-grey">The usual arrangement</h3>
              <ul role="list" className="flow">
                {usual.map((line) => (
                  <li key={line} className="flex gap-3">
                    <Minus size={18} weight="bold" className="mt-1 shrink-0 text-grey" aria-hidden />
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <div className="flow border-2 border-blue-light p-7">
              <h3 className="h h--5 text-blue-dark">What we do instead</h3>
              <ul role="list" className="flow">
                {ours.map((line) => (
                  <li key={line} className="flex gap-3">
                    <Check size={18} weight="bold" className="mt-1 shrink-0 text-teal" aria-hidden />
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>

        <ImageSwipe
          top={{ src: photoUrl(photos.collagePerson, 600, 600), alt: photos.collagePerson.alt }}
          bottom={{ src: photoUrl(photos.collagePlace, 800, 800), alt: photos.collagePlace.alt }}
          ring={site.pitch}
        />
      </div>
    </section>
  );
}
