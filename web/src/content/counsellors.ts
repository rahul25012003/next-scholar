/**
 * Counsellor profiles, credential checked rather than self-declared.
 *
 * Empty today, because there is one named counsellor's work referenced
 * elsewhere on this site (case logs, the handover packet) and no public
 * profile has been checked and published for them yet. The shape exists so
 * that when one is, it carries a checkable credential rather than a job
 * title and a stock photo.
 */

export type Counsellor = {
  slug: string;
  name: string;
  /** Stated exactly as the credentialing body names it, e.g. a specific certification or degree. */
  credential: string;
  credentialBody: string;
  destinationsCovered: string[];
  bio: string;
  /** Null until a named person has checked the credential against the issuing body. */
  verifiedBy: string | null;
  verifiedOn: string | null;
};

export const counsellors: Counsellor[] = [];

export function publishableCounsellors(list: Counsellor[] = counsellors): Counsellor[] {
  return list.filter(
    (counsellor): counsellor is Counsellor & { verifiedBy: string } =>
      counsellor.verifiedBy !== null,
  );
}

export const counsellorScope = {
  note: "A profile appears here only once a named person has checked the counsellor's stated credential against the body that issued it. A job title is not a credential, and this page will not treat one as one.",
};
