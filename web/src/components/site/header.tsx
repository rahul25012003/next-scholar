"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { CaretDown, List, X } from "@phosphor-icons/react";
import { nav, primaryCta, secondaryCta, site } from "@/content/site";
import { ButtonLink } from "@/components/ui/button";
import { cn } from "@/lib/cn";

export function SiteHeader() {
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const reduced = useReducedMotion();

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpenMenu(null);
        setMobileOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-paper/90 backdrop-blur-md">
      <div className="shell flex h-18 items-center justify-between gap-6">
        <Link
          href="/"
          className="flex items-center gap-2.5"
          onClick={() => setMobileOpen(false)}
        >
          <span
            className="grid h-9 w-9 place-items-center rounded-input bg-navy-900 font-display text-[1.05rem] font-bold text-white"
            aria-hidden
          >
            N
          </span>
          <span className="font-display text-[1.0625rem] font-bold tracking-tight text-navy-900">
            Next<span className="text-blue-600">Scholar</span>
          </span>
          <span className="sr-only">{site.name} home</span>
        </Link>

        <nav
          className="hidden items-center gap-1 lg:flex"
          onMouseLeave={() => setOpenMenu(null)}
        >
          {nav.map((item) =>
            item.children ? (
              <div
                key={item.label}
                className="relative"
                onMouseEnter={() => setOpenMenu(item.label)}
              >
                <button
                  type="button"
                  aria-expanded={openMenu === item.label}
                  aria-haspopup="true"
                  onClick={() =>
                    setOpenMenu(openMenu === item.label ? null : item.label)
                  }
                  className={cn(
                    "flex items-center gap-1.5 rounded-full px-3.5 py-2 text-[0.9375rem] font-medium transition-colors",
                    openMenu === item.label
                      ? "text-blue-600"
                      : "text-ink-soft hover:text-navy-900",
                  )}
                >
                  {item.label}
                  <CaretDown
                    size={13}
                    weight="bold"
                    className={cn(
                      "transition-transform duration-200",
                      openMenu === item.label && "rotate-180",
                    )}
                    aria-hidden
                  />
                </button>

                <AnimatePresence>
                  {openMenu === item.label && (
                    <motion.div
                      initial={reduced ? false : { opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={reduced ? undefined : { opacity: 0, y: -6 }}
                      transition={{ duration: 0.15, ease: "easeOut" }}
                      className="absolute left-0 top-full w-72 pt-2"
                    >
                      <div className="overflow-hidden rounded-card border border-line bg-paper p-1.5 shadow-lift">
                        {item.children.map((child) => (
                          <Link
                            key={child.label}
                            href={child.href}
                            onClick={() => setOpenMenu(null)}
                            className="block rounded-input px-3 py-2.5 transition-colors hover:bg-surface"
                          >
                            <span className="block text-[0.9375rem] font-medium text-navy-900">
                              {child.label}
                            </span>
                            {child.note && (
                              <span className="mt-0.5 block text-[0.8125rem] leading-snug text-muted">
                                {child.note}
                              </span>
                            )}
                          </Link>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link
                key={item.label}
                href={item.href ?? "/"}
                className="rounded-full px-3.5 py-2 text-[0.9375rem] font-medium text-ink-soft transition-colors hover:text-navy-900"
              >
                {item.label}
              </Link>
            ),
          )}
        </nav>

        <div className="hidden items-center gap-2.5 lg:flex">
          <ButtonLink href={secondaryCta.href} variant="outline">
            {secondaryCta.label}
          </ButtonLink>
          <ButtonLink href={primaryCta.href}>{primaryCta.label}</ButtonLink>
        </div>

        <button
          type="button"
          className="grid h-11 w-11 place-items-center rounded-full border border-line-strong text-navy-900 lg:hidden"
          aria-expanded={mobileOpen}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          onClick={() => setMobileOpen((open) => !open)}
        >
          {mobileOpen ? <X size={20} weight="bold" /> : <List size={20} weight="bold" />}
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={reduced ? false : { opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={reduced ? undefined : { opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden border-t border-line bg-paper lg:hidden"
          >
            <div className="shell flex flex-col gap-1 py-5">
              {nav.flatMap((item) =>
                item.children
                  ? [
                      <p
                        key={item.label}
                        className="px-1 pb-1 pt-3 text-[0.75rem] font-semibold text-muted"
                      >
                        {item.label}
                      </p>,
                      ...item.children.map((child) => (
                        <Link
                          key={child.href + child.label}
                          href={child.href}
                          onClick={() => setMobileOpen(false)}
                          className="rounded-input px-1 py-2.5 text-[1.0625rem] font-medium text-navy-900"
                        >
                          {child.label}
                        </Link>
                      )),
                    ]
                  : [
                      <Link
                        key={item.label}
                        href={item.href ?? "/"}
                        onClick={() => setMobileOpen(false)}
                        className="rounded-input px-1 py-2.5 text-[1.0625rem] font-medium text-navy-900"
                      >
                        {item.label}
                      </Link>,
                    ],
              )}
              <div className="mt-4 grid gap-2.5">
                <ButtonLink
                  href={secondaryCta.href}
                  variant="outline"
                  size="lg"
                  onClick={() => setMobileOpen(false)}
                >
                  {secondaryCta.label}
                </ButtonLink>
                <ButtonLink
                  href={primaryCta.href}
                  size="lg"
                  onClick={() => setMobileOpen(false)}
                >
                  {primaryCta.label}
                </ButtonLink>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
