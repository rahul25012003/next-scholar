import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "outline" | "quiet" | "light" | "pink";
type Size = "md" | "lg";

/**
 * The reference's `.button`: a pill in the heading face, dark blue that turns
 * pink on hover. `light` is the lighter blue variant the reference uses on
 * its own blue panels, `pink` the hot one it fires the burst from. `outline`
 * is kept as a name for the site's secondary actions and renders as the
 * light variant, since the reference draws no outlined controls.
 *
 * The label wraps rather than being held on one line: a fixed height plus
 * `whitespace-nowrap` sent a long label straight past the right edge at 390px,
 * which is how "Check your own eligibility for United Kingdom" widened a whole
 * page.
 */
// The hover fade, the focus fill and the press are the stylesheet's `.button`
// rules, untouched; only layout utilities are added here.
const base =
  "button inline-flex max-w-full items-center justify-center gap-2 " +
  "disabled:pointer-events-none disabled:opacity-55";

const variants: Record<Variant, string> = {
  primary: "",
  light: "button--light",
  outline: "button--light",
  pink: "button--pink",
  quiet: "button--quiet",
};

const sizes: Record<Size, string> = {
  md: "",
  lg: "button--lg",
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
