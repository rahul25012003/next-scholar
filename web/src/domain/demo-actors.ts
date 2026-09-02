import type { Actor } from "./rbac";

/**
 * Authentication is not connected. Rather than inventing a login, each surface
 * runs as a fixed unauthenticated actor and every read still passes through the
 * permission matrix, so what a role can and cannot see is real even though who
 * you are is not yet checked.
 *
 * Replacing these three constants with a Supabase session is the whole of the
 * auth work at this layer.
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

export const AUTH_NOTICE =
  "No authentication is connected. This surface runs as a fixed role and reads synthetic records. Permission checks are real, identity is not.";
