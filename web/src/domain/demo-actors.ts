import type { Actor } from "./rbac";

/**
 * Actor fixtures for tests.
 *
 * The application no longer uses these: every surface reads the signed session
 * through `domain/session`. They remain because the permission tests need
 * stable actors to try to break the matrix with, and building a session to do
 * that would test the cookie rather than the rule.
 */

export const demoStudent: Actor = {
  id: "demo-student",
  name: "Meghana Rangaswamy",
  role: "student",
  caseId: "case-1041",
};

export const demoCounselor: Actor = {
  id: "demo-counselor",
  name: "Rohini Bhat",
  role: "counselor",
  assignedCaseIds: ["case-1041", "case-1042"],
};

export const demoFounder: Actor = {
  id: "demo-founder",
  name: "Founder",
  role: "founder",
};


