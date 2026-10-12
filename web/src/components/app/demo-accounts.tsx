"use client";

/**
 * The seeded development accounts as buttons: one press fills the sign in
 * form with that account and submits it, so each role can be tried in turn.
 * Rendered by the sign in page only outside production, where the seeded
 * password is already public in the repository.
 *
 * A role held by one account is labelled by the role alone; where two
 * accounts share a role, each also carries its name, so the two buttons can
 * be told apart.
 */
export function DemoAccounts({
  accounts,
  password,
}: {
  accounts: { email: string; role: string }[];
  password: string;
}) {
  const signInAs = (email: string) => {
    const form = document.querySelector<HTMLFormElement>("form[data-sign-in]");
    if (!form) return;
    (form.elements.namedItem("email") as HTMLInputElement).value = email;
    (form.elements.namedItem("password") as HTMLInputElement).value = password;
    form.requestSubmit();
  };

  const shared = (role: string) => accounts.filter((account) => account.role === role).length > 1;
  const name = (email: string) => email.charAt(0).toUpperCase() + email.slice(1, email.indexOf("@"));

  return (
    <div className="mt-4 bg-light px-4 py-3">
      <p className="text-[0.75rem] text-grey">
        <span className="font-bold text-blue-dark">Development accounts.</span> Not shown in
        production. One press signs in.
      </p>
      <ul role="list" className="mt-2 flex flex-wrap gap-1.5">
        {accounts.map((account) => (
          <li key={account.email}>
            <button
              type="button"
              onClick={() => signInAs(account.email)}
              title={account.email}
              className="rounded-input border-2 border-line-strong bg-white px-2.5 py-0.5 text-[0.75rem] font-bold capitalize text-blue-dark transition-colors hover:border-blue hover:text-pink"
            >
              {account.role}
              {shared(account.role) && ` ${name(account.email)}`}
              <span className="sr-only">, {account.email}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
