"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";

/**
 * The jump list for long pages.
 *
 * Anchors would work without any of this. The observer earns its place on a
 * fifteen section page, where the useful question is not "where can I go" but
 * "where am I", and a list of fifteen identical links cannot answer it.
 */
export function JumpList({
  items,
  className,
  label = "On this page",
}: {
  items: { id: string; title: string }[];
  className?: string;
  label?: string;
}) {
  const [active, setActive] = useState<string | null>(items[0]?.id ?? null);

  useEffect(() => {
    const sections = items
      .map((item) => document.getElementById(item.id))
      .filter((node): node is HTMLElement => node !== null);
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      // The band sits under a sticky header, so the trigger line is pulled
      // down from the viewport top rather than sitting on it.
      { rootMargin: "-88px 0px -65% 0px", threshold: 0 },
    );

    for (const section of sections) observer.observe(section);
    return () => observer.disconnect();
  }, [items]);

  return (
    <nav className={className} aria-label={label}>
      <p className="text-[0.75rem] font-semibold uppercase tracking-wide text-muted">
        {label}
      </p>
      <ul className="mt-3 space-y-0.5 border-l border-line">
        {items.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              aria-current={active === item.id ? "true" : undefined}
              className={cn(
                "-ml-px block border-l-2 py-1.5 pl-3.5 text-[0.875rem] leading-snug transition-colors",
                active === item.id
                  ? "border-blue-600 font-medium text-blue-600"
                  : "border-transparent text-body hover:border-line-strong hover:text-navy-900",
              )}
            >
              {item.title}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
