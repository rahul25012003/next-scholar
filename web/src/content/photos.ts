/**
 * Photography, with its source recorded.
 *
 * Every image here was chosen by loading it in a browser and looking at it,
 * rather than trusting a keyword endpoint, which returned a police badge for
 * "campus" and a stranger's name card for "library".
 *
 * These are Unsplash photographs used under the Unsplash licence. They are
 * decorative: nobody in them is a Next Scholar client, and no caption on the
 * site suggests otherwise. When real photographs exist, the ids below are the
 * only thing that changes.
 */

export type Photo = {
  id: string;
  alt: string;
  /** Unsplash photo page, for the credit the licence asks for. */
  credit: string;
};

const unsplash = (id: string, alt: string): Photo => ({
  id,
  alt,
  credit: `https://unsplash.com/photos/${id}`,
});

export const photos = {
  /**
   * Chosen by rendering six candidates inside the actual hero card and looking
   * at them. This one's blue wall carries into the card's gradient, which is
   * what the reference layout does with a cut out.
   */
  heroPortrait: unsplash(
    "1494790108377-be9c29b29330",
    "A student laughing, photographed against a soft city background",
  ),
  portraitOnBlue: unsplash(
    "1534528741775-53994a69daeb",
    "A student photographed against a soft blue background",
  ),
  smilingStudent: unsplash(
    "1502685104226-ee32379fefbe",
    "A student smiling against a painted wall",
  ),
  studentWithBag: unsplash(
    "1546525848-3ce03ca516f6",
    "A student outdoors carrying a backpack",
  ),
  studyGroup: unsplash(
    "1523240795612-9a054b0db644",
    "A group of students working together at a table",
  ),
  atComputers: unsplash(
    "1531482615713-2afd69097998",
    "Students working at computers",
  ),
  fiveStudents: unsplash(
    "1517486808906-6ca8b3f04846",
    "Five students sitting together outdoors",
  ),
  twoAtLaptop: unsplash(
    "1522202176988-66273c2fd55f",
    "Two people looking at a laptop together",
  ),
  /**
   * One landmark per destination card, each a different place. Every one was
   * checked by eye: an earlier keyword service offered a police badge for
   * "campus", so nothing here is trusted on the strength of a search term.
   */
  destinations: {
    "united-kingdom": unsplash(
      "1543832923-44667a44c804",
      "Tower Bridge in London at sunset",
    ),
    "germany-public": unsplash(
      "1587330979470-3595ac045ab0",
      "The Brandenburg Gate in Berlin, lit at night",
    ),
    "germany-private": unsplash(
      "1467269204594-9661b134dd2b",
      "A German old town street of timber framed houses",
    ),
    ireland: unsplash(
      "1590089415225-401ed6f9db8e",
      "Colourful terraced houses below a cathedral in Cobh, Ireland",
    ),
  } as Record<string, Photo>,
} as const;

/** Builds a sized Unsplash URL. Cropping happens at their end, not ours. */
export function photoUrl(
  photo: Photo,
  width: number,
  height: number,
): string {
  return `https://images.unsplash.com/photo-${photo.id}?w=${width}&h=${height}&fit=crop&q=80`;
}
