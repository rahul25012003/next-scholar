import type { ReactNode } from "react";

export function PageHero({
  title,
  lede,
  aside,
}: {
  title: string;
  lede: string;
  aside?: ReactNode;
}) {
  return (
    <section className="border-b border-line bg-surface">
      <div className="shell grid gap-10 py-14 md:py-18 lg:grid-cols-[1.3fr_1fr] lg:items-end lg:gap-16">
        <div>
          <h1 className="font-display text-[2.25rem] font-extrabold leading-[1.1] tracking-[-0.03em] text-navy-900 md:text-[3rem]">
            {title}
          </h1>
          <p className="mt-5 max-w-2xl text-[1.0625rem] leading-relaxed text-body">
            {lede}
          </p>
        </div>
        {aside}
      </div>
    </section>
  );
}
