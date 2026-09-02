import type { CommunicationRecord } from "@/domain/communications";

/** Synthetic threads for the synthetic cases. Not real correspondence. */

const stamp = (offsetDays: number) =>
  new Date(Date.now() - offsetDays * 86_400_000).toISOString();

export const syntheticCommunications: CommunicationRecord[] = [
  {
    id: "comm-1",
    caseId: "case-1041",
    channel: "email",
    direction: "inbound",
    occurredAt: stamp(20),
    participants: "Meghana Rangaswamy to Rohini Bhat",
    raw: "Sending the passport scan as asked. It expires next year, is that a problem for the October intake? Also my APS payment went through yesterday.",
    summary: null,
    summarySource: null,
    studentVisible: true,
  },
  {
    id: "comm-2",
    caseId: "case-1041",
    channel: "email",
    direction: "outbound",
    occurredAt: stamp(19),
    participants: "Rohini Bhat to Meghana Rangaswamy",
    raw: "Thanks. The expiry is a problem, yes, but a fixable one. Start the renewal now rather than after the offer. The visa file needs a passport valid well past your course start, and appointment slots are the slow part, not the passport itself. APS payment noted.",
    summary: null,
    summarySource: null,
    studentVisible: true,
  },
  {
    id: "comm-3",
    caseId: "case-1041",
    channel: "call",
    direction: "outbound",
    occurredAt: stamp(9),
    participants: "Rohini Bhat and Meghana Rangaswamy",
    raw: "Eleven minutes. Walked through the renewal process and the tatkal option. She will try for an appointment this month and send the acknowledgement number when she has it. Asked again about private universities as a backup. Told her the public route is free and pays us nothing, and that a private university would only go on the shortlist for a specific programme reason, in writing.",
    summary: null,
    summarySource: null,
    studentVisible: true,
  },
  {
    id: "comm-4",
    caseId: "case-1041",
    channel: "portal",
    direction: "inbound",
    occurredAt: stamp(3),
    participants: "Meghana Rangaswamy",
    raw: "No appointment slots until the end of next month. Should I still submit the APS documents now or wait?",
    summary: null,
    summarySource: null,
    studentVisible: true,
  },
  {
    id: "comm-5",
    caseId: "case-1042",
    channel: "email",
    direction: "outbound",
    occurredAt: stamp(2),
    participants: "Rohini Bhat to Aditya Prabhu",
    raw: "Leeds have made a conditional offer. Before you accept anything, the Sheffield decision is likely within a fortnight and their fee is lower. Nothing is lost by waiting, and the Leeds deposit deadline is four weeks out. I will send both side by side once Sheffield answer.",
    summary: null,
    summarySource: null,
    studentVisible: true,
  },
];
