import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "outline" | "quiet";
type Size = "md" | "lg";

/**
 * Interactive controls are pills. Cards are 16px. Inputs are 10px.
 *
 * The label wraps rather than being held on one line: a fixed height plus
 * `whitespace-nowrap` sent a long label straight past the right edge at 390px,
 * which is how "Check your own eligibility for United Kingdom" widened a whole
 * page. The heights below are minimums so a one-line label is unchanged.
 */
const base =
  "inline-flex max-w-full items-center justify-center gap-2 rounded-full text-center font-medium " +
  "transition-[transform,background-color,border-color,box-shadow] duration-200 ease-out " +
  "active:translate-y-[1px] disabled:pointer-events-none disabled:opacity-55";

const variants: Record<Variant, string> = {
  primary:
    // eslint-disable-next-line no-restricted-syntax -- token-exempt: 1px contact shadow for the primary control; card/lift are diffuse surface elevation
    "bg-blue-600 text-white shadow-[0_1px_2px_rgb(14_42_94/0.18)] hover:bg-blue-500 hover:shadow-lift",
  outline:
    "border border-line-strong bg-paper text-navy-900 hover:border-blue-600 hover:text-blue-600",
  quiet: "text-navy-900 hover:text-blue-600",
};

const sizes: Record<Size, string> = {
  md: "min-h-11 px-5 py-2 text-[0.9375rem]",
  lg: "min-h-13 px-7 py-2.5 text-base",
};

type CommonProps = {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
};

export function ButtonLink({
  href,
  variant = "primary",
  size = "md",
  className,
  children,
  ...rest
}: CommonProps & ComponentProps<typeof Link>) {
  return (
    <Link
      href={href}
      className={cn(base, variants[variant], sizes[size], className)}
      {...rest}
    >
      {children}
    </Link>
  );
}

export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  ...rest
}: CommonProps & ComponentProps<"button">) {
  return (
    <button className={cn(base, variants[variant], sizes[size], className)} {...rest}>
      {children}
    </button>
  );
}
