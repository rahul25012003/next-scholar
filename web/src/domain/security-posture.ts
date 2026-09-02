import { scannerConfigured } from "./uploads";
import { RETENTION_CAVEAT, RETENTION_YEARS } from "./retention";

/**
 * The security and data protection checklist, kept as a live status rather than
 * a paragraph claiming everything is handled.
 *
 * Three honest states. "In code" means it is implemented and testable here.
 * "Needs a provider" means the logic is in place and waiting on infrastructure
 * nobody has bought yet. "Needs a person" means no amount of engineering
 * finishes it: a lawyer, an incorporation, a named human being.
 */

export type PostureState = "in-code" | "needs-provider" | "needs-a-person";

export type PostureItem = {
  requirement: string;
  state: PostureState;
  detail: string;
};

export const postureLabel: Record<PostureState, string> = {
  "in-code": "Implemented",
  "needs-provider": "Waiting on infrastructure",
  "needs-a-person": "Waiting on a person",
};

export function securityPosture(): PostureItem[] {
  return [
    {
      requirement: "Role based access control",
      state: "in-code",
      detail:
        "Four roles, one permission matrix, checked on every read and write path rather than in the interface. Proven by the guardrail tests.",
    },
    {
      requirement: "Consent management",
      state: "in-code",
      detail:
        "Per document category, timestamped, naming the recipients, withdrawable. An upload with no live consent is refused.",
    },
    {
      requirement: "Access logging and audit trail",
      state: "in-code",
      detail:
        "Every read and write of a case records who, when and what changed. Reads cannot bypass it, because the store will not return a record without an actor.",
    },
    {
      requirement: "Secure upload pipeline",
      state: scannerConfigured() ? "in-code" : "needs-provider",
      detail: scannerConfigured()
        ? "File type allowlist, size ceiling, consent precondition and malware scanning, all enforced before storage."
        : "Type allowlist, size ceiling and consent precondition are enforced. Malware scanning has no endpoint configured, so the pipeline currently refuses every upload rather than storing an unscanned file.",
    },
    {
      requirement: "Environment separation",
      state: "in-code",
      detail:
        "Fabricated records are refused in production unless someone explicitly asks for a demo. A real document never leaves production because production has no real documents yet.",
    },
    {
      requirement: "Retention and deletion",
      state: "needs-provider",
      detail: `The ${RETENTION_YEARS} year period is computed per case and a case past it reports as deletable. Actually deleting it needs the database. ${RETENTION_CAVEAT}`,
    },
    {
      requirement: "Managed storage with row level security",
      state: "needs-provider",
      detail:
        "Cases live in memory from synthetic fixtures. One file, data/store.ts, is the whole of the swap to Supabase, and the permission matrix moves down into row level policies at the same time.",
    },
    {
      requirement: "Encryption at rest and in transit",
      state: "needs-provider",
      detail:
        "Provider managed once storage exists, plus TLS on every connection including service to service. Nothing here is encrypted today because nothing real is stored today.",
    },
    {
      requirement: "Multi factor authentication for staff",
      state: "needs-provider",
      detail:
        "Required for counselor, manager and founder logins from the first day there are logins. There is no authentication connected yet, so there is nothing to protect with a second factor.",
    },
    {
      requirement: "Backups and tested restore",
      state: "needs-provider",
      detail:
        "Daily automated backups with a restore that has actually been run, and a documented recovery objective. Follows the database.",
    },
    {
      requirement: "Written breach protocol",
      state: "needs-a-person",
      detail:
        "Who is notified, in what timeframe, through what escalation path. It needs a named person to own it, which needs the entity to exist.",
    },
    {
      requirement: "Complaints procedure and grievance officer",
      state: "needs-a-person",
      detail:
        "A named contact, a response time commitment, an escalation path, and a test run before launch. Currently a structural placeholder, and the policy page says so.",
    },
    {
      requirement: "DPDP lawful basis and data principal rights",
      state: "needs-a-person",
      detail:
        "Lawful basis per category, a working route to access, correction and erasure, and a cross border transfer check for every non Indian vendor. This is a lawyer's work, not a developer's.",
    },
  ];
}

export function postureSummary(): Record<PostureState, number> {
  return securityPosture().reduce(
    (totals, item) => ({ ...totals, [item.state]: totals[item.state] + 1 }),
    { "in-code": 0, "needs-provider": 0, "needs-a-person": 0 } as Record<
      PostureState,
      number
    >,
  );
}
