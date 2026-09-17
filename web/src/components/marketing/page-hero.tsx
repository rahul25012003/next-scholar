import type { ReactNode } from "react";

/**
 * The head of an interior page: the reference's sub-page panel, a white box
 * on the ground with the title in blue and the lede at the intro size.
 */
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
    <section className="Hero-sub band pad-before">
      <div className="shell Hero-sub__inner">
        <div className="grid gap-10 lg:grid-cols-[1.3fr_1fr] lg:items-end lg:gap-16">
          <div className="flow">
            <h1 className="h h--3 text-blue-dark">{title}</h1>
            <p className="intro max-w-2xl">{lede}</p>
          </div>
          {aside}
        </div>
      </div>
    </section>
  );
}
