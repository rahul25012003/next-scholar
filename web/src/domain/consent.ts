import type { DocumentRecord } from "./case";

/**
 * Consent, recorded per document category, timestamped, naming exactly who the
 * document may be shared with, and withdrawable.
 *
 * The published anti fraud policy promises explicit written consent before any
 * sensitive document is collected. This is that promise as a precondition: the
 * upload pipeline asks this module first, and a category with no live consent
 * cannot be collected at all.
 */

export type DocumentCategory = DocumentRecord["category"];

export type ConsentRecord = {
  id: string;
  caseId: string;
  category: DocumentCategory;
  /** Why it is collected, in the words shown to the student. */
  purpose: string;
  /** Named recipients. "Anyone we work with" is not an acceptable value here. */
  sharedWith: string[];
  grantedAt: string;
  grantedBy: string;
  withdrawnAt: string | null;
};

export const categoryLabel: Record<DocumentCategory, string> = {
  transcript: "Academic transcripts and certificates",
  passport: "Passport copy",
  "english-test": "English test result",
  funding: "Bank statements and funding evidence",
  recommendation: "Letters of recommendation",
  other: "Other supporting documents",
};

export const categoryPurpose: Record<DocumentCategory, string> = {
  transcript: "Verifying your academic record with universities you apply to.",
  passport: "Identity on university applications and the visa file.",
  "english-test": "Meeting the language requirement on each application.",
  funding: "Evidencing funds to the visa authority and, where required, the university.",
  recommendation: "Submitting with applications that ask for references.",
  other: "Whatever specific step it was requested for, named at the time.",
};

export function activeConsent(
  consents: ConsentRecord[],
  caseId: string,
  category: DocumentCategory,
): ConsentRecord | null {
  return (
    consents.find(
      (consent) =>
        consent.caseId === caseId &&
        consent.category === category &&
        consent.withdrawnAt === null,
    ) ?? null
  );
}

export function hasConsent(
  consents: ConsentRecord[],
  caseId: string,
  category: DocumentCategory,
): boolean {
  return activeConsent(consents, caseId, category) !== null;
}

/**
 * Withdrawal does not delete the record. It stamps it, because the fact that
 * consent once existed is itself part of the audit answer.
 */
export function withdraw(
  consents: ConsentRecord[],
  consentId: string,
  now = new Date(),
): ConsentRecord[] {
  return consents.map((consent) =>
    consent.id === consentId && consent.withdrawnAt === null
      ? { ...consent, withdrawnAt: now.toISOString() }
      : consent,
  );
}
