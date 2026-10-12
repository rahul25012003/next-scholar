import type { Metadata } from "next";
import { SignUpForm } from "@/components/app/auth-form";
import { SplitText } from "@/components/ui/split-text";

export const metadata: Metadata = { title: "Create an account" };

export default function SignupPage() {
  return (
    <>
      <h1 className="text-blue-dark">
        <SplitText>Create your account</SplitText>
      </h1>
      <p className="mt-2 text-[0.9375rem] leading-relaxed text-grey">
        For students. Counsellor and operations accounts are created by someone
        who already holds one.
      </p>

      <div className="mt-6">
        <SignUpForm />
      </div>
    </>
  );
}
