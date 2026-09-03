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
      <section className="border-b border-line bg-surface">
        <div className="shell py-10 md:py-14">
          <Link
            href="/tools"
            className="inline-flex items-center gap-1.5 text-[0.875rem] font-medium text-blue-600 hover:text-blue-500"
          >
            <ArrowLeft size={14} weight="bold" aria-hidden />
            All tools
          </Link>
          <h1 className="mt-4 max-w-3xl font-display text-[2rem] font-extrabold leading-[1.1] tracking-[-0.03em] text-navy-900 md:text-[2.75rem]">
            {title}
          </h1>
          <p className="mt-5 max-w-2xl text-[1.0625rem] leading-relaxed text-body">{lede}</p>
          <p className="mt-5 inline-flex rounded-input bg-verified-bg px-3 py-1.5 text-[0.8125rem] font-medium text-verified">
            No signup. No email. The result is never held back.
          </p>
        </div>
      </section>

      <section className="bg-paper py-10 md:py-14">
        <div className="shell">{children}</div>
      </section>

      {foot && (
        <section className="border-t border-line bg-surface py-10 md:py-14">
          <div className="shell">{foot}</div>
        </section>
      )}
    </>
  );
}
