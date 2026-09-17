import type { Metadata } from "next";
import { SignInForm } from "@/components/app/auth-form";
import { seedAccountHint } from "@/data/users";

export const metadata: Metadata = { title: "Sign in" };
export const dynamic = "force-dynamic";

export default async function LoginPage() {
  const showHint = process.env.NODE_ENV !== "production";
  const accounts = showHint ? await seedAccountHint() : [];

  return (
    <>
      <h1 className="text-blue-dark">
        Sign in
      </h1>
      <p className="mt-2 text-[0.9375rem] leading-relaxed text-grey">
        Students, counselors and operations all sign in here. Where you land
        depends on your role.
      </p>

      <div className="mt-8">
        <SignInForm />
      </div>

      {showHint && (
        <div className="mt-10 rounded-card border border-line bg-light p-5">
          <p className="text-[0.8125rem] font-medium text-blue-dark">
            Development accounts
          </p>
          <p className="mt-1 text-[0.8125rem] leading-relaxed text-grey">
            Shown only outside production. The password is whatever
            SEED_ACCOUNT_PASSWORD is set to, and defaults to
            <span className="figures"> next-scholar-dev-1</span>.
          </p>
          <ul className="mt-3 space-y-1">
            {accounts.map((account) => (
              <li key={account.email} className="figures text-[0.75rem] text-grey">
                {account.email} <span className="text-grey">({account.role})</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}
