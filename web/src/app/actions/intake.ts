"use server";

import { z } from "zod";
import { bookingIntegration } from "@/content/consultation";

const intakeSchema = z.object({
  academicBackground: z.string().trim().min(12, "Give the degree, institution and the number on your transcript."),
  graduationYear: z.string().trim().min(4, "The year, and an explanation of any gap since."),
  englishTest: z.string().trim().min(2, "Score and date, or say it is not booked yet."),
  budget: z.string().trim().min(2, "A number, including what a loan would need to cover."),
  targetIntake: z.string().trim().min(2, "Pick an intake, or say it is not decided."),
  priorConsultant: z.string().trim().min(2, "Answer this one. A duplicate application can sink both."),
  // Not decided yet is a legitimate answer to the first step, so this one is
  // optional. A form that refuses to proceed until you have picked a country is
  // a form that has decided for you.
  destinations: z.string().trim().optional(),
});

export type IntakeState =
  | { status: "idle" }
  | { status: "invalid"; errors: Record<string, string> }
  | { status: "not-live"; message: string; missing: string[] };

/**
 * The booking provider and the payment gateway are not connected, and no
 * student personal data is stored anywhere until the security and DPDP
 * foundation exists. So this action validates the answers, keeps nothing, and
 * says exactly that.
 *
 * When Cal.com or Zoho Bookings and Razorpay are wired in, the branch below is
 * where the real hold and the real charge go. Nothing else about this form has
 * to change.
 */
export async function submitIntake(
  _previous: IntakeState,
  formData: FormData,
): Promise<IntakeState> {
  const parsed = intakeSchema.safeParse(Object.fromEntries(formData));

  if (!parsed.success) {
    const errors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0]);
      if (!errors[key]) errors[key] = issue.message;
    }
    return { status: "invalid", errors };
  }

  if (!bookingIntegration.live) {
    return {
      status: "not-live",
      message: bookingIntegration.pendingNote,
      missing: bookingIntegration.needed,
    };
  }

  // Unreachable until a provider is connected. Left as the single place a real
  // booking and a real ₹1,500 charge will be created.
  throw new Error("Booking provider flagged live with no implementation behind it.");
}
