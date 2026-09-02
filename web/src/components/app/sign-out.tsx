"use client";

import { SignOut as SignOutIcon } from "@phosphor-icons/react";
import { signOut } from "@/app/actions/auth";

export function SignOutButton() {
  return (
    <form action={signOut}>
      <button
        type="submit"
        className="flex items-center gap-1.5 text-[0.8125rem] font-medium text-muted transition-colors hover:text-navy-900"
      >
        <SignOutIcon size={14} weight="bold" aria-hidden />
        Sign out
      </button>
    </form>
  );
}
