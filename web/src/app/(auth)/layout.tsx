import type { CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import { site } from "@/content/site";
import { photos, photoUrl } from "@/content/photos";
import { BackgroundShapes } from "@/components/site/background-shapes";
import { SplitText } from "@/components/ui/split-text";
import { SignedInNotice } from "@/components/app/signed-in-notice";

const points = [
  ["What you see", "Your stage, your deadlines, every reference number we hold for you."],
  ["What we never show", "A predicted chance of an admission or a visa. Nobody can honestly give you one."],
  ["What you control", "Consent for each type of document, which you can withdraw at any time."],
];

/**
 * Sign in and sign up, as one screen exactly the height of the window: the
 * form on the ground at the left, and from 1024px one photograph filling the
 * right half with the pitch set over its foot. The page never scrolls; on a
 * screen too short for the form, the form's own column does.
 *
 * The photograph is decoration. It is credited in photos.ts, nobody in it is
 * a client, and it carries an empty alt.
 */
export default function AuthLayout({ children }: LayoutProps<"/">) {
  return (
    <div className="Auth">
      <BackgroundShapes quiet />

      <div className="Auth__side">
        <header className="Auth__header flex flex-wrap items-center justify-between gap-3">
          <Link href="/" className="Header__logo" title="Home">
            <span className="Header__logo-mark" aria-hidden>
              N
            </span>
            <span aria-hidden>Next Scholar</span>
            <span className="sr-only">{site.name} home</span>
          </Link>
          <SignedInNotice />
        </header>

        <main id="main-content" tabIndex={-1} className="Auth__main">
          <div className="Auth__panel rise bg-white">{children}</div>
        </main>
      </div>

      {/* The form lands first; the reasons to trust it follow, in order. */}
      <aside className="Auth__visual hidden lg:flex">
        <Image
          src={photoUrl(photos.signIn, 1800, 2000)}
          alt=""
          fill
          priority
          sizes="(min-width: 1024px) 55vw, 1px"
          className="Auth__visual-img"
        />
        <div className="Auth__visual-body">
          <p className="h h--4 text-light">
            <SplitText start={3}>{site.pitch}</SplitText>
          </p>
          <p className="rise mt-3 max-w-xl text-light" style={{ "--i": 6 } as CSSProperties}>
            There is no version of your case that only we can see.
          </p>

          <dl className="Auth__points">
            {points.map(([term, detail], index) => (
              <div key={term} className="rise" style={{ "--i": index + 8 } as CSSProperties}>
                <dt className="font-bold text-white">{term}</dt>
                <dd className="small mt-1 text-white/85">{detail}</dd>
              </div>
            ))}
          </dl>
        </div>
      </aside>
    </div>
  );
}
