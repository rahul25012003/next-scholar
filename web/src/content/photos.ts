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
 *
 * Three rules were applied to the set chosen on 2026-10-02, and each was
 * checked rather than assumed:
 *
 *   no photograph appears twice on the site outside the destination it
 *   stands for;
 *   every original is at least 3840px on its long edge, measured by asking
 *   the image server for that size without upscaling and reading what came
 *   back;
 *   the people are composed and at work, never posed mid-laugh.
 */

export type Photo = {
  id: string;
  alt: string;
  /** Unsplash photo page, for the credit the licence asks for. */
  credit: string;
};

/**
 * `id` is the part of the image URL after "photo-". `page` is the id of the
 * photograph's own page on Unsplash, which is what a credit should link to;
 * the older entries were recorded without one and fall back to the image id.
 */
const unsplash = (id: string, alt: string, page?: string): Photo => ({
  id,
  alt,
  credit: `https://unsplash.com/photos/${page ?? id}`,
});

export const photos = {
  /** Beside the form on the sign in and sign up pages. */
  signIn: unsplash(
    "1723721118924-4d3e5d945fc8",
    "A tall stone university tower with a clock, rising above trees",
    "NWFzAum14EA",
  ),
  /** The two frames of the collage in the home page's first panel. */
  collagePerson: unsplash(
    "1544168190-79c17527004f",
    "A man in a denim shirt sitting at a desk with his hands folded",
    "WC7KIHo13Fc",
  ),
  collagePlace: unsplash(
    "1623632306901-e509641e7191",
    "King's College Chapel in Cambridge on a clear day",
    "FC1uuekWoZc",
  ),

  /** Along the bottom of the footer, under a wash of the footer's blue. */
  footer: unsplash(
    "1488155665162-7fc8d8093d18",
    "The stone front of a university building, with lamps at its gate",
    "jEQydmwFlFM",
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

  /**
   * The navigation menus: one photograph per link, none shared between two
   * links and none borrowed from the pages above.
   */
  menu: {
    london: unsplash(
      "1681407979872-0a4cbde28391",
      "The Palace of Westminster and Big Ben across the Thames",
      "d80dS3gesa8",
    ),
    berlin: unsplash(
      "1566404791232-af9fe0ae8f8b",
      "The Berlin television tower above the city at dusk",
      "g8DI2ZZFt8I",
    ),
    dublin: unsplash(
      "1644955538144-7d896b5ffc70",
      "A bridge over the Liffey in Dublin with houses along the quay",
      "sRVm8CC2fks",
    ),
    worldMap: unsplash(
      "1712150177656-b3c0bd50eb25",
      "A map of the world in relief, brown on a pale ground",
      "WXnoxGfJ9zA",
    ),
    readingRoom: unsplash(
      "1531259736756-6caccf485f81",
      "A vaulted university reading room lined with desks",
      "PoE6Q48B-5k",
    ),
    heidelberg: unsplash(
      "1634069779524-26ddf3de507a",
      "The old bridge at Heidelberg at dusk",
      "U9PZZx88CIE",
    ),
    oxford: unsplash(
      "1612563958093-2c3bcfbd8760",
      "The Radcliffe Camera in Oxford from above",
      "nqBUTBsDQNM",
    ),
    oldLibrary: unsplash(
      "1509330336708-10b331f3ae6f",
      "A barrel vaulted library of dark wooden shelves",
      "ORehLWGSZ4s",
    ),
    lectureHall: unsplash(
      "1640416639872-93aabd8d91d3",
      "An empty lecture hall with rows of seats",
      "mNY_-DvKisc",
    ),
    graduation: unsplash(
      "1541339907198-e08756dedf3f",
      "Graduates throwing their caps into the air at sunset",
      "_kd5cxwZOK4",
    ),
    notebook: unsplash(
      "1620287920810-3f5b9746380c",
      "A closed notebook and a pen on a wooden desk",
      "2_BrZ3AJ_78",
    ),
    paperwork: unsplash(
      "1554224155-1696413565d3",
      "Papers laid out flat on a white table",
      "tQQ4BwN_UFs",
    ),
    euros: unsplash(
      "1621280336935-ed7cae618aac",
      "Euro banknotes spread across a table",
      "kkACMU0GYko",
    ),
    answerSheet: unsplash(
      "1606326608606-aa0b62935f2b",
      "A hand filling in an answer sheet with a pencil",
      "qDgTQOYk6B8",
    ),
    books: unsplash(
      "1497633762265-9d179a990aa6",
      "A stack of books seen edge on",
      "lUaaKCUANVI",
    ),
    headphones: unsplash(
      "1546435770-a3e426bf472b",
      "Headphones on a white desk beside a keyboard",
      "YDZPdqv3FcA",
    ),
    calculator: unsplash(
      "1746221331496-a87689fc8eb9",
      "A calculator and office tools on a desk",
      "54bvLAWhWAM",
    ),
    ledger: unsplash(
      "1595014361739-7370d0fc74ee",
      "An old account book lying open",
      "jv5gATb12xo",
    ),
    charts: unsplash(
      "1551288049-bebda4e38f71",
      "A laptop showing a dashboard of charts",
      "JKUTrJ4vK00",
    ),
    shelves: unsplash(
      "1524995997946-a1c2e315a42f",
      "Curved library shelves filled with books",
      "2JIvboGLeho",
    ),
    meeting: unsplash(
      "1606836591695-4d58a73eba1e",
      "People meeting in a glass walled room",
      "ONe-snuCaqQ",
    ),
    signing: unsplash(
      "1521791055366-0d553872125f",
      "A hand signing a document",
      "GJao3ZTX9gU",
    ),
  },
} as const;

/** Builds a sized Unsplash URL. Cropping happens at their end, not ours. */
export function photoUrl(
  photo: Photo,
  width: number,
  height: number,
): string {
  return `https://images.unsplash.com/photo-${photo.id}?w=${width}&h=${height}&fit=crop&q=80&auto=format`;
}
