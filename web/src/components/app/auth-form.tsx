"use client";

import { useActionState } from "react";
import Link from "next/link";
import { WarningCircle } from "@phosphor-icons/react";
import { signIn, signUp, type AuthResult } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";

const field =
  "w-full rounded-input border border-line-strong bg-paper px-3.5 py-2.5 text-[0.9375rem] text-navy-900 placeholder:text-muted/70 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/25";

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
    <div className="grid gap-2">
      <label htmlFor={id} className="text-[0.875rem] font-medium text-navy-900">
        {label}
      </label>
      {help && <p className="text-[0.8125rem] leading-relaxed text-muted">{help}</p>}
      <input
        id={id}
        name={id}
        type={type}
        autoComplete={autoComplete}
        placeholder={placeholder}
        className={field}
      />
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
      <p className="text-[0.875rem] leading-relaxed text-ink-soft">{message}</p>
    </div>
  );
}

export function SignInForm() {
  const [state, formAction, pending] = useActionState<AuthResult, FormData>(signIn, {
    status: "idle",
  });

  return (
    <form action={formAction} className="grid gap-5">
      <Field id="email" label="Email address" type="email" autoComplete="email" placeholder="you@example.com" />
      <Field id="password" label="Password" type="password" autoComplete="current-password" />

      {state.status === "error" && <Error message={state.message} />}

      <Button type="submit" size="lg" disabled={pending}>
        {pending ? "Signing in" : "Sign in"}
      </Button>

      <p className="text-[0.875rem] text-body">
        No account yet?{" "}
        <Link href="/signup" className="font-medium text-blue-600 hover:text-blue-500">
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
    <form action={formAction} className="grid gap-5">
      <Field
        id="name"
        label="Your name"
        type="text"
        help="As it appears on your passport, because every application will use it."
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

      <Button type="submit" size="lg" disabled={pending}>
        {pending ? "Creating your account" : "Create account"}
      </Button>

      <p className="text-[0.875rem] leading-relaxed text-muted">
        Creating an account does not start an application and does not commit you
        to anything. It gives you a portal to watch one from.
      </p>

      <p className="text-[0.875rem] text-body">
        Already have one?{" "}
        <Link href="/login" className="font-medium text-blue-600 hover:text-blue-500">
          Sign in
        </Link>
        .
      </p>
    </form>
  );
}
