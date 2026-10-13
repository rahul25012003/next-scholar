"use client";

import { useActionState } from "react";
import Link from "next/link";
import { WarningCircle } from "@phosphor-icons/react";
import { signIn, signUp, type AuthResult } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";

const field =
  "w-full rounded-input border-2 border-line-strong bg-white px-5 py-2.5 text-[1rem] text-blue-dark placeholder:text-grey hover:border-blue-light focus:border-blue focus:outline-none focus:ring-4 focus:ring-blue/20";

function Field({
  id,
  label,
  type,
  help,
  autoComplete,
  placeholder,
}: {
  id: string;
  label: string;
  type: string;
  help?: string;
  autoComplete?: string;
  placeholder?: string;
}) {
  return (
    // The help sits under the field, not between the label and it, so two
    // fields side by side keep their inputs on one line.
    <div className="grid content-start gap-1.5">
      <label htmlFor={id} className="text-[0.875rem] font-medium text-blue-dark">
        {label}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        autoComplete={autoComplete}
        placeholder={placeholder}
        aria-describedby={help ? `${id}-help` : undefined}
        className={field}
      />
      {help && (
        <p id={`${id}-help`} className="text-[0.8125rem] leading-snug text-grey">
          {help}
        </p>
      )}
    </div>
  );
}

function Error({ message }: { message: string }) {
  return (
    <div
      className="flex items-start gap-2.5 rounded-card border border-denied/25 bg-denied-bg/50 p-4"
      role="alert"
    >
      <WarningCircle size={17} weight="fill" className="mt-0.5 shrink-0 text-denied" aria-hidden />
      <p className="text-[0.875rem] leading-relaxed text-grey">{message}</p>
    </div>
  );
}

export function SignInForm() {
  const [state, formAction, pending] = useActionState<AuthResult, FormData>(signIn, {
    status: "idle",
  });

  return (
    <form action={formAction} className="grid gap-4" data-sign-in>
      <Field id="email" label="Email address" type="email" autoComplete="email" placeholder="you@example.com" />
      <Field id="password" label="Password" type="password" autoComplete="current-password" />

      {state.status === "error" && <Error message={state.message} />}

      <Button type="submit" size="lg" disabled={pending} aria-busy={pending}>
        {pending ? "Signing in" : "Sign in"}
      </Button>

      <p className="text-[0.875rem] text-grey">
        No account yet?{" "}
        <Link href="/signup" className="font-medium text-pink hover:text-blue-dark">
          Create one
        </Link>
        .
      </p>
    </form>
  );
}

export function SignUpForm() {
  const [state, formAction, pending] = useActionState<AuthResult, FormData>(signUp, {
    status: "idle",
  });

  return (
    // Two fields to a row from 640px, which is what lets four fields and
    // their help fit one screen without scrolling.
    <form action={formAction} className="grid gap-4 sm:grid-cols-2 [&>:not(div.grid)]:sm:col-span-2">
      <Field
        id="name"
        label="Your name"
        type="text"
        help="As it appears on your passport. Every application will use it."
        autoComplete="name"
      />
      <Field id="email" label="Email address" type="email" autoComplete="email" placeholder="you@example.com" />
      <Field
        id="password"
        label="Password"
        type="password"
        help="At least ten characters, with a letter and a number."
        autoComplete="new-password"
      />
      <Field id="confirm" label="Password again" type="password" autoComplete="new-password" />

      {state.status === "error" && <Error message={state.message} />}

      <Button type="submit" size="lg" disabled={pending} aria-busy={pending}>
        {pending ? "Creating your account" : "Create account"}
      </Button>

      <p className="text-[0.875rem] leading-relaxed text-grey">
        Creating an account does not start an application or commit you to
        anything. It gives you a portal to follow one.
      </p>

      <p className="text-[0.875rem] text-grey">
        Already have one?{" "}
        <Link href="/login" className="font-medium text-pink hover:text-blue-dark">
          Sign in
        </Link>
        .
      </p>
    </form>
  );
}
