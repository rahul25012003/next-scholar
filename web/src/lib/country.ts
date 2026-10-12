/**
 * A country name as it reads in the middle of a sentence: "studying in the
 * United Kingdom", "studying in Germany". Of the three destinations only the
 * United Kingdom takes the article; a heading on its own keeps the bare name.
 */
export function countryInSentence(country: string): string {
  return country === "United Kingdom" ? "the United Kingdom" : country;
}
