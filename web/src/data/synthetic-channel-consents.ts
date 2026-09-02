import type { ChannelConsent } from "@/domain/consent";

/**
 * Channel opt ins. Deliberately partial: one student has opted into WhatsApp,
 * another has not, so the fail-closed path is exercised by the fixtures rather
 * than only by a test.
 */
const stamp = (offsetDays: number) =>
  new Date(Date.now() - offsetDays * 86_400_000).toISOString();

export const syntheticChannelConsents: ChannelConsent[] = [
  {
    id: "channel-1",
    caseId: "case-1041",
    channel: "whatsapp",
    grantedAt: stamp(22),
    grantedBy: "Meghana Rangaswamy",
    withdrawnAt: null,
  },
  {
    id: "channel-2",
    caseId: "case-1041",
    channel: "email",
    grantedAt: stamp(22),
    grantedBy: "Meghana Rangaswamy",
    withdrawnAt: null,
  },
  {
    id: "channel-3",
    caseId: "case-1043",
    channel: "email",
    grantedAt: stamp(60),
    grantedBy: "Farhan Qureshi",
    withdrawnAt: null,
  },
];
