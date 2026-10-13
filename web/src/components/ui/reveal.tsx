import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * Entry motion, used only where sequence carries meaning: a heading arriving
 * before the rows it introduces, a ledger reading top to bottom the way the
 * numbers are meant to be read.
 *
 * A scroll-driven CSS animation (`.reveal-item` in globals.css), not a script.
 * The content is visible in the server's HTML, so it never stays hidden if a
 * script is slow or fails; nothing moves for anyone who has asked for reduced
 * motion; and no animation library is loaded for it. `delay`, in the seconds
 * the old version used, starts an item a little further into its entry, so a
 * row still arrives in order.
 */
export function Reveal({
  children,
  delay = 0,
  className,
  as: Tag = "div",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: "div" | "li" | "section" | "article";
}) {
  return (
    <Tag
      className={cn("reveal-item", className)}
      style={{ "--reveal-delay": Math.min(delay, 0.5) } as CSSProperties}
    >
      {children}
    </Tag>
  );
}
