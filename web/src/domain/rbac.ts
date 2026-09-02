import type { StudentCase } from "./case";

export type Role = "student" | "counselor" | "manager" | "founder";

export type Actor = {
  id: string;
  name: string;
  role: Role;
  /** Set for students. The only case they may ever read. */
  caseId?: string;
  /** Set for counselors. The caseload they are assigned. */
  assignedCaseIds?: string[];
};

export type Action =
  | "case.read"
  | "case.note.write"
  | "case.stage.write"
  | "case.reassign"
  | "document.upload"
  | "document.verify"
  | "escalation.resolve"
  | "commission.read.source"
  | "commission.verify"
  | "commission.publish"
  | "report.publish"
  | "system.configure";

/**
 * The permission matrix, enforced here rather than in the UI. Every read and
 * write path calls this. An AI agent is never an Actor: agents run with the
 * narrower capability set in `domain/agents`, which cannot reach these actions
 * at all.
 */
const matrix: Record<Role, Action[]> = {
  student: ["case.read", "document.upload"],
  counselor: [
    "case.read",
    "case.note.write",
    "case.stage.write",
    "document.upload",
    "document.verify",
  ],
  manager: [
    "case.read",
    "case.note.write",
    "case.stage.write",
    "case.reassign",
    "document.verify",
    "escalation.resolve",
  ],
  founder: [
    "case.read",
    "case.note.write",
    "case.stage.write",
    "case.reassign",
    "document.verify",
    "escalation.resolve",
    "commission.read.source",
    "commission.verify",
    "commission.publish",
    "report.publish",
    "system.configure",
  ],
};

export function can(actor: Actor, action: Action, subject?: StudentCase): boolean {
  if (!matrix[actor.role].includes(action)) return false;
  if (!subject) return true;

  switch (actor.role) {
    case "student":
      return subject.id === actor.caseId;
    case "counselor":
      return (actor.assignedCaseIds ?? []).includes(subject.id);
    case "manager":
    case "founder":
      return true;
  }
}

/** Reads that pass the matrix but must still be scoped to a caseload. */
export function visibleCases(actor: Actor, cases: StudentCase[]): StudentCase[] {
  switch (actor.role) {
    case "student":
      return cases.filter((item) => item.id === actor.caseId);
    case "counselor":
      return cases.filter((item) => (actor.assignedCaseIds ?? []).includes(item.id));
    case "manager":
    case "founder":
      return cases;
  }
}

export class PermissionError extends Error {
  constructor(actor: Actor, action: Action) {
    super(`${actor.role} may not perform ${action}`);
    this.name = "PermissionError";
  }
}

export function assertCan(actor: Actor, action: Action, subject?: StudentCase): void {
  if (!can(actor, action, subject)) throw new PermissionError(actor, action);
}
