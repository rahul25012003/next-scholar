import { documentIntegrity, dataProtection } from "./policy";
import { consultation } from "./consultation";
import { destinations, policyDesk } from "./destinations";
import { ledgerMethodology } from "./ledger";
import { zeroCommissionEntries } from "./zero-commission";
import { stages } from "./process";

/**
 * The published policy pages, compacted into something a model can be given.
 *
 * The Student Guidance agent is specified to answer from the student's own
 * record and the published policies. It was only ever given the record, so its
 * claim to be sourced was decoration. This is the other half, and it is built
 * from the same modules the public pages render, so an answer cannot cite a
 * policy that the site does not actually say.
 */
export function policyDigest(): string {
  const lines: string[] = [];

  lines.push("PUBLISHED POLICY, from the Next Scholar site.");

  lines.push("\nAnti fraud policy, /anti-fraud-policy:");
  for (const commitment of documentIntegrity.commitments) lines.push(`- ${commitment}`);

  lines.push("\nData protection, /anti-fraud-policy, published as an unfinished draft:");
  lines.push(`- ${dataProtection.consent}`);
  for (const item of dataProtection.openItems) lines.push(`- Open gap: ${item.title}`);

  lines.push("\nOpen Ledger, /open-ledger:");
  lines.push(`- ${ledgerMethodology.cadence}`);
  lines.push(`- ${ledgerMethodology.flaggingRule}`);

  lines.push("\nZero commission list, /zero-commission:");
  for (const entry of zeroCommissionEntries) {
    lines.push(`- ${entry.destination}: ${entry.headline}. ${entry.body}`);
  }

  lines.push("\nDestinations and fees:");
  for (const destination of destinations) {
    lines.push(
      `- ${destination.country}${destination.route ? `, ${destination.route}` : ""}: intakes ${destination.intakes}, tuition ${destination.tuition}, post study ${destination.postStudy}, we earn ${destination.commission.display}, you pay us ${destination.clientFee}.`,
    );
  }

  lines.push("\nPolicy desk, each item still needing re-checking at source:");
  for (const note of policyDesk) lines.push(`- ${note.destination}: ${note.title}. ${note.body}`);

  lines.push("\nThe eleven stages and what the client receives at each:");
  for (const stage of stages) lines.push(`- ${stage.name}: ${stage.deliverable}`);

  lines.push(
    `\nConsultation: ${consultation.duration}, ${consultation.price}. ${consultation.promise}`,
  );

  return lines.join("\n");
}
