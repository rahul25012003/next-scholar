import { Check, Minus } from "@phosphor-icons/react/ssr";
import { Reveal } from "@/components/ui/reveal";
import { ImageSwipe } from "@/components/marketing/image-swipe";
import { heroPortraitImage, photos, photoUrl } from "@/content/photos";
import { site } from "@/content/site";

const usual = [
  "The commission is real, and it is never disclosed to you.",
  "Universities that pay nothing quietly stop appearing on shortlists.",
  "You pay a service fee on top, without knowing about the second income.",
  "The shortlist cannot be audited, so it cannot be argued with.",
];

const ours = [
  "Every figure is published before you pay us anything.",
  "The routes that pay us nothing get their own page, with instructions to apply without us.",
  "A commission above the category average is flagged in writing on the shortlist, before the recommendation.",
  "Every row is re-verified and republished quarterly, with the date attached.",
];

/**
 * The reference's intro panel: a heading across the top, the copy in the
 * left half, and the photo collage hanging off the bottom right corner. The
 * two comparison lists sit under the copy in the same half.
 */
export function TheProblem() {
  const landmark = photos.destinations["united-kingdom"];

  return (
    <section className="Intro constrain anim-home--intro">
      <div className="Intro__inner pad-before-lg pad-x-lg bg-white flow">
        <h2 className="Intro__heading h h--3 text-blue-dark">
          Why the shortlist you were given looked like that
        </h2>

        <div className="Intro__copy flow">
          <p>
            Most consultancies are paid by the universities they place you at,
            commonly ten to twenty percent of your first year tuition. None of
            that is illegal. It just means the universities that pay nothing
            stop appearing on shortlists, and you never find out which ones
            they were.
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
          top={{ src: heroPortraitImage.src, alt: photos.heroPortrait.alt }}
          bottom={{ src: photoUrl(landmark, 600, 600), alt: landmark.alt }}
          ring={site.pitch}
        />
      </div>
    </section>
  );
}
