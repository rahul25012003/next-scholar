import type { ConsentRecord } from "@/domain/consent";
import { categoryPurpose } from "@/domain/consent";

/**
 * Synthetic consent records, matching the synthetic cases. Real consent is
 * written, timestamped and names its recipients, so the fixtures do too rather
 * than modelling it as a single boolean somewhere.
 */

const stamp = (offsetDays: number) =>
  new Date(Date.now() - offsetDays * 86_400_000).toISOString();

export const syntheticConsents: ConsentRecord[] = [
  {
    id: "consent-1",
    caseId: "case-1041",
    category: "transcript",
    purpose: categoryPurpose.transcript,
    sharedWith: ["uni-assist", "APS India", "The four shortlisted universities"],
    grantedAt: stamp(22),
    grantedBy: "Meghana Rangaswamy",
    withdrawnAt: null,
  },
  {
    id: "consent-2",
    caseId: "case-1041",
    category: "passport",
    purpose: categoryPurpose.passport,
    sharedWith: ["The German mission, for the visa file"],
    grantedAt: stamp(22),
    grantedBy: "Meghana Rangaswamy",
    withdrawnAt: null,
  },
  {
    id: "consent-3",
    caseId: "case-1041",
    category: "english-test",
    purpose: categoryPurpose["english-test"],
    sharedWith: ["The four shortlisted universities"],
    grantedAt: stamp(22),
    grantedBy: "Meghana Rangaswamy",
    withdrawnAt: null,
  },
  {
    id: "consent-4",
    caseId: "case-1041",
    category: "funding",
    purpose: categoryPurpose.funding,
    sharedWith: ["The blocked account provider", "The German mission"],
    grantedAt: stamp(22),
    grantedBy: "Meghana Rangaswamy",
    withdrawnAt: stamp(4),
  },
  {
    id: "consent-5",
    caseId: "case-1042",
    category: "transcript",
    purpose: categoryPurpose.transcript,
    sharedWith: ["University of Leeds", "University of Sheffield"],
    grantedAt: stamp(39),
    grantedBy: "Aditya Prabhu",
    withdrawnAt: null,
  },
  {
    id: "consent-6",
    caseId: "case-1042",
    category: "passport",
    purpose: categoryPurpose.passport,
    sharedWith: ["UK Visas and Immigration"],
    grantedAt: stamp(39),
    grantedBy: "Aditya Prabhu",
    withdrawnAt: null,
  },
  {
    id: "consent-7",
    caseId: "case-1043",
    category: "funding",
    purpose: categoryPurpose.funding,
    sharedWith: ["Irish Naturalisation and Immigration Service", "University College Dublin"],
    grantedAt: stamp(60),
    grantedBy: "Farhan Qureshi",
    withdrawnAt: null,
  },
];
