import type { Metadata } from "next";
import { SignUpForm } from "@/components/app/auth-form";

export const metadata: Metadata = { title: "Create an account" };

export default function SignupPage() {
  return (
    <>
      <h1 className="text-blue-dark">
        Create your account
      </h1>
      <p className="mt-2 text-[0.9375rem] leading-relaxed text-grey">
        For students. Counselor and operations accounts are created by someone
        who already holds one.
      </p>

      <div className="mt-8">
        <SignUpForm />
      </div>
    </>
  );
}
