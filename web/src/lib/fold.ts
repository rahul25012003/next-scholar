/** Lowercase with accents dropped, so "universitat" finds "Universität" and "koln" finds "Köln". */
export const fold = (text: string) => text.normalize("NFD").replace(/\p{M}/gu, "").toLowerCase();
