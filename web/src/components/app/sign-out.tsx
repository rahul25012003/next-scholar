import { SignOut as SignOutIcon } from "@phosphor-icons/react/ssr";

/** Posts to /sign-out, which clears the session and opens the sign in page. */
export function SignOutButton() {
  return (
    <form method="post" action="/sign-out">
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
