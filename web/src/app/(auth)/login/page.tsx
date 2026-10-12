import type { Metadata } from "next";
import { SignInForm } from "@/components/app/auth-form";
import { DemoAccounts } from "@/components/app/demo-accounts";
import { SplitText } from "@/components/ui/split-text";
import { devSeedPassword, seedAccountHint } from "@/data/users";

export const metadata: Metadata = { title: "Sign in" };
export const dynamic = "force-dynamic";

export default async function LoginPage() {
  // Defined only outside production, so the accounts never show there.
  const password = devSeedPassword();
  const accounts = password ? await seedAccountHint() : [];

  return (
    <>
      <h1 className="text-blue-dark">
        <SplitText>Sign in</SplitText>
      </h1>
      <p className="mt-2 text-[0.9375rem] leading-relaxed text-grey">
        Students, counsellors and operations all sign in here. Where you land
        depends on your role.
      </p>

      <div className="mt-6">
        <SignInForm />
      </div>

      {password && accounts.length > 0 && (
        <DemoAccounts accounts={accounts} password={password} />
      )}
    </>
  );
}
