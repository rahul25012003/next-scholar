"use client";

import { SignOut as SignOutIcon } from "@phosphor-icons/react";
import { signOut } from "@/app/actions/auth";

export function SignOutButton() {
  return (
    <form action={signOut}>
      <button
        type="submit"
        className="small flex items-center gap-1.5 font-bold text-white transition-colors hover:text-pink"
      >
        <SignOutIcon size={14} weight="bold" aria-hidden />
        Sign out
      </button>
    </form>
  );
}
