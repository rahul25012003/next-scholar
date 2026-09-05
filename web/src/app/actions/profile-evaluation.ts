"use server";

import { z } from "zod";

const requestSchema = z.object({
  name: z.string().trim().min(2, "Your name."),
  email: z.string().trim().email("A valid email address, so a person can reply."),
  destinations: z.string().trim().optional(),
  details: z
    .string()
    .trim()
    .min(
      20,
      "Enough to check something: your percentage or CGPA, your language test result if you have one, and the destination.",
    ),
  consent: z.literal("on", { message: "Confirm you agree to be contacted about this request." }),
});

export type ProfileEvaluationState =
  | { status: "idle" }
  | { status: "invalid"; errors: Record<string, string> }
  | { status: "not-live"; message: string; missing: string[] };

/**
 * The free profile evaluation's intake.
 *
 * No published contact channel exists yet to deliver the written answer on
 * (`content/site.ts` `channels.whatsapp` is unset and no support email is
 * published anywhere on this site), and no personal detail from an anonymous
 * visitor is stored until the security and DPDP foundation exists, the same
 * rule `submitIntake` already follows for the paid consultation. So this
 * validates the request and says exactly what is missing, rather than showing
 * a confirmation for a reply that cannot be sent.
 */
export async function requestProfileEvaluation(
  _previous: ProfileEvaluationState,
  formData: FormData,
): Promise<ProfileEvaluationState> {
  const parsed = requestSchema.safeParse(Object.fromEntries(formData));

  if (!parsed.success) {
    const errors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0]);
      if (!errors[key]) errors[key] = issue.message;
    }
    return { status: "invalid", errors };
  }

  return {
    status: "not-live",
    message:
      "Your answers are complete and nothing was sent or stored on our side. Copy them with the button below and send them yourself for now, or run the checklist above for the same read, instantly and ungated.",
    missing: [
      "A published contact channel, email or WhatsApp, for a person to reply on",
      "The security and DPDP foundation, before any personal detail from an anonymous visitor is stored",
    ],
  };
}
