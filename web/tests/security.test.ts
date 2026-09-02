import { afterEach, describe, expect, it, vi } from "vitest";
import { hasConsent, withdraw, activeConsent } from "@/domain/consent";
import { checkUpload, MAX_BYTES, documentPipelineReady } from "@/domain/uploads";
import { retentionFor, RETENTION_YEARS } from "@/domain/retention";
import { checkCompleteness } from "@/domain/completeness";
import { buildHandoverPacket, suggestAssignment } from "@/domain/counselor-ops";
import { securityPosture, postureSummary } from "@/domain/security-posture";
import { syntheticConsents } from "@/data/synthetic-consents";
import { syntheticCases } from "@/data/synthetic-cases";
import type { StudentCase } from "@/domain/case";
import { policyDigest } from "@/content/policy-digest";
import { destinations } from "@/content/destinations";

const goodFile = { name: "transcript.pdf", type: "application/pdf", size: 400_000 };

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("consent is per category, timestamped and withdrawable", () => {
  it("finds a live consent and ignores a withdrawn one", () => {
    expect(hasConsent(syntheticConsents, "case-1041", "transcript")).toBe(true);
    expect(hasConsent(syntheticConsents, "case-1041", "funding")).toBe(false);
  });

  it("does not leak consent across cases", () => {
    expect(hasConsent(syntheticConsents, "case-1042", "funding")).toBe(false);
    expect(hasConsent(syntheticConsents, "case-1043", "funding")).toBe(true);
  });

  it("stamps a withdrawal rather than deleting the record", () => {
    const after = withdraw(syntheticConsents, "consent-1");
    const record = after.find((consent) => consent.id === "consent-1");

    expect(record).toBeDefined();
    expect(record?.withdrawnAt).not.toBeNull();
    expect(after).toHaveLength(syntheticConsents.length);
  });

  it("names actual recipients on every live consent", () => {
    for (const consent of syntheticConsents) {
      expect(consent.sharedWith.length).toBeGreaterThan(0);
      for (const recipient of consent.sharedWith) {
        expect(recipient.length).toBeGreaterThan(3);
      }
    }
    expect(activeConsent(syntheticConsents, "case-1041", "passport")).not.toBeNull();
  });
});

describe("the upload pipeline fails closed", () => {
  it("refuses a category with no live consent", () => {
    const result = checkUpload(goodFile, "funding", "case-1041", syntheticConsents);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.blocker).toBe("consent");
  });

  it("refuses a file type outside the allowlist", () => {
    const result = checkUpload(
      { name: "transcript.docx", type: "application/msword", size: 1000 },
      "transcript",
      "case-1041",
      syntheticConsents,
    );
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.blocker).toBe("type");
  });

  it("refuses a file whose extension does not match its type", () => {
    const result = checkUpload(
      { name: "transcript.exe", type: "application/pdf", size: 1000 },
      "transcript",
      "case-1041",
      syntheticConsents,
    );
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.blocker).toBe("type");
  });

  it("refuses an oversized file", () => {
    const result = checkUpload(
      { ...goodFile, size: MAX_BYTES + 1 },
      "transcript",
      "case-1041",
      syntheticConsents,
    );
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.blocker).toBe("size");
  });

  it("refuses everything while no malware scanner is configured", () => {
    const result = checkUpload(goodFile, "transcript", "case-1041", syntheticConsents);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.blocker).toBe("scanner");
  });

  it("accepts only once every precondition is met", () => {
    vi.stubEnv("MALWARE_SCAN_ENDPOINT", "https://scanner.example.internal");
    const result = checkUpload(goodFile, "transcript", "case-1041", syntheticConsents);
    expect(result.ok).toBe(true);
  });

  it("keeps extraction shut until storage exists as well as scanning", () => {
    vi.stubEnv("MALWARE_SCAN_ENDPOINT", "https://scanner.example.internal");
    expect(documentPipelineReady()).toBe(false);

    vi.stubEnv("DOCUMENT_STORAGE_BUCKET", "next-scholar-documents");
    expect(documentPipelineReady()).toBe(true);
  });
});

describe("retention starts when a person closes the case", () => {
  it("reports an open case as having no clock running", () => {
    expect(retentionFor(null).state).toBe("open");
  });

  it("holds a recently closed case", () => {
    const closed = new Date();
    closed.setFullYear(closed.getFullYear() - 1);
    const state = retentionFor(closed.toISOString());

    expect(state.state).toBe("retained");
    if (state.state === "retained") {
      expect(state.daysRemaining).toBeGreaterThan(0);
    }
  });

  it("reports a case past the period as deletable rather than deleting it quietly", () => {
    const closed = new Date();
    closed.setFullYear(closed.getFullYear() - (RETENTION_YEARS + 1));
    const state = retentionFor(closed.toISOString());

    expect(state.state).toBe("deletable");
    if (state.state === "deletable") {
      expect(state.daysOverdue).toBeGreaterThan(300);
    }
  });
});

describe("completeness never says an application is ready", () => {
  const record = syntheticCases.find((item) => item.id === "case-1041")!;

  it("refuses to guess requirements for an unlisted destination", () => {
    const unlisted: StudentCase = { ...record, destination: "Canada" };
    const result = checkCompleteness(unlisted);

    expect(result.state).toBe("unknown");
    if (result.state === "unknown") {
      expect(result.reason).toContain("not yet verified");
    }
  });

  it("lists what is missing without producing a ready state", () => {
    const result = checkCompleteness(record);
    expect(result.state).toBe("checked");
    if (result.state === "checked") {
      expect(result.missing.length).toBeGreaterThan(0);
      expect(JSON.stringify(result)).not.toMatch(/ready to submit/i);
    }
  });

  it("says so when the requirement list has never been checked at source", () => {
    const result = checkCompleteness(record);
    if (result.state === "checked") {
      expect(result.curatedOn).toBeNull();
      expect(result.note).toContain("draft");
    }
  });
});

describe("handover and assignment are generated, not remembered", () => {
  const record = syntheticCases.find((item) => item.id === "case-1041")!;

  it("carries the open tasks, outstanding documents and recent log into the packet", () => {
    const packet = buildHandoverPacket(record);

    expect(packet.from).toBe(record.counselor);
    expect(packet.openTasks.length).toBeGreaterThan(0);
    expect(packet.pendingDocuments.length).toBeGreaterThan(0);
    expect(packet.lastFive.length).toBeGreaterThan(0);
    expect(packet.acknowledgement).toContain("confirms receipt");
  });

  it("marks whether the summary it carries was machine written", () => {
    const packet = buildHandoverPacket({ ...record, summary: "x", summarySource: "ai" });
    expect(packet.summaryIsMachineWritten).toBe(true);
  });

  it("suggests the lightest caseload and says a manager decides", () => {
    const suggestion = suggestAssignment(syntheticCases);
    const lightest = suggestion.loads[0];

    expect(suggestion.suggested).toBe(lightest.counselor);
    expect(suggestion.note).toContain("manager");
  });
});

describe("the security posture reports honestly", () => {
  it("does not claim encryption, backups or MFA that do not exist", () => {
    const items = securityPosture();
    const claimed = items
      .filter((item) => item.state === "in-code")
      .map((item) => item.requirement);

    expect(claimed).not.toContain("Encryption at rest and in transit");
    expect(claimed).not.toContain("Multi factor authentication for staff");
    expect(claimed).not.toContain("Backups and tested restore");
  });

  it("counts every requirement into exactly one state", () => {
    const counts = postureSummary();
    const total =
      counts["in-code"] + counts["needs-provider"] + counts["needs-a-person"];
    expect(total).toBe(securityPosture().length);
  });

  it("keeps the upload pipeline honest about the missing scanner", () => {
    const upload = securityPosture().find(
      (item) => item.requirement === "Secure upload pipeline",
    )!;
    expect(upload.state).toBe("needs-provider");
    expect(upload.detail).toContain("refuses every upload");
  });
});

describe("the guidance agent is given the policy it claims to answer from", () => {
  it("includes the published anti fraud commitments", () => {
    const digest = policyDigest();
    expect(digest).toContain("never write a bank statement");
    expect(digest).toContain("/anti-fraud-policy");
  });

  it("includes the ledger rules and the zero commission position", () => {
    const digest = policyDigest();
    expect(digest).toContain("re-verified and republished each quarter");
    expect(digest).toContain("Public universities pay agents nothing");
  });

  it("carries the same destination figures the public page renders", () => {
    const digest = policyDigest();
    for (const destination of destinations) {
      expect(digest).toContain(destination.commission.display);
      expect(digest).toContain(destination.clientFee);
    }
  });

  it("publishes the open data protection gaps rather than hiding them", () => {
    expect(policyDigest()).toContain("Open gap:");
  });
});
