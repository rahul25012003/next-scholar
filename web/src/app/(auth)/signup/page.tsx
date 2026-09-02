import type { Metadata } from "next";
import { SignUpForm } from "@/components/app/auth-form";

export const metadata: Metadata = { title: "Create an account" };

export default function SignupPage() {
  return (
    <>
      <h1 className="font-display text-[1.875rem] font-bold text-navy-900">
        Create your account
      </h1>
      <p className="mt-2 text-[0.9375rem] leading-relaxed text-body">
        For students. Counselor and operations accounts are created by someone
        who already holds one.
      </p>

      <div className="mt-8">
        <SignUpForm />
      </div>
    </>
  );
}
