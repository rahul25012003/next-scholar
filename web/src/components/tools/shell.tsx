import Link from "next/link";
import { ArrowLeft } from "@phosphor-icons/react/ssr";
import type { ReactNode } from "react";

/**
 * The shell every tool page shares.
 *
 * The ungated promise is printed on all of them, in the same place, in the same
 * words. It is a position rather than a feature, so it is not left to each page
 * to remember to mention.
 */
export function ToolPage({
  title,
  lede,
  children,
  foot,
}: {
  title: string;
  lede: string;
  children: ReactNode;
  foot?: ReactNode;
}) {
  return (
    <>
      <section className="Hero-sub band pad-before">
        <div className="shell flow">
          <Link href="/tools" className="inline-flex items-center gap-1.5 font-bold text-pink">
            <ArrowLeft size={14} weight="bold" aria-hidden />
            All tools
          </Link>
          <h1 className="h h--3 max-w-3xl text-blue-dark">{title}</h1>
          <p className="intro max-w-2xl">{lede}</p>
          <p className="small inline-flex bg-light px-3 py-1.5 font-bold text-teal">
            No signup. No email. The result is never held back.
          </p>
        </div>
      </section>

      <section className="band">
        <div className="shell">{children}</div>
      </section>

      {foot && (
        <section className="band">
          <div className="shell">{foot}</div>
        </section>
      )}
    </>
  );
}
