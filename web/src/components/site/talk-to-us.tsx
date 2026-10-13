"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowRight, ChatCircleDots, WhatsappLogo, X } from "@phosphor-icons/react";
import { channels } from "@/content/site";

const HIDDEN_KEY = "next-scholar.reach-hidden";

/**
 * How to reach us, as a control that floats in the corner.
 *
 * It says what is true. Until a WhatsApp number is configured there is no way
 * to reach us online, so the panel says so and points to the parts of the site
 * that work without us, rather than offering a person who cannot answer yet.
 * The day NEXT_PUBLIC_WHATSAPP_NUMBER is set, the WhatsApp button appears.
 *
 * It appears after the reader has scrolled past the first screen, never becomes
 * a modal, and "hide" lasts for the rest of the visit across pages. Focus goes
 * into the panel when it opens, back to the toggle when it closes, and to the
 * page's main content when the control is hidden, so it is never lost.
 */
export function TalkToUs() {
  const [visible, setVisible] = useState(false);
  const [open, setOpen] = useState(false);
  // Read at first render: the control draws nothing until the reader scrolls,
  // so the server's empty output and a hidden control hydrate the same.
  const [dismissed, setDismissed] = useState(() => {
    if (typeof window === "undefined") return false;
    try {
      return window.sessionStorage.getItem(HIDDEN_KEY) === "1";
    } catch {
      return false;
    }
  });
  const reduced = useReducedMotion();
  const panelRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const wasOpen = useRef(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 600);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (open) {
      panelRef.current?.focus();
      wasOpen.current = true;
    } else if (wasOpen.current) {
      toggleRef.current?.focus();
      wasOpen.current = false;
    }
  }, [open]);

  const hide = () => {
    try {
      window.sessionStorage.setItem(HIDDEN_KEY, "1");
    } catch {
      // Hidden for this page either way.
    }
    wasOpen.current = false;
    setDismissed(true);
    document.getElementById("main-content")?.focus();
  };

  if (dismissed) return null;

  const href = channels.whatsapp
    ? `https://wa.me/${channels.whatsapp.replace(/[^\d]/g, "")}?text=${encodeURIComponent(
        channels.whatsappMessage,
      )}`
    : null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={reduced ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduced ? undefined : { opacity: 0, y: 16 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          data-floating-contact
          className="fixed bottom-4 right-4 z-40 flex max-w-[calc(100vw-2rem)] flex-col items-end gap-3 sm:bottom-6 sm:right-6"
        >
          {open && (
            <motion.div
              ref={panelRef}
              tabIndex={-1}
              initial={reduced ? false : { opacity: 0, scale: 0.96, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
              className="flow w-80 max-w-full bg-white p-6 text-grey shadow-lift"
              role="dialog"
              aria-label="How to reach us"
            >
              <div className="flex items-start justify-between gap-4">
                <h2 className="h--6 text-blue-dark">How to reach us</h2>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Close"
                  className="-mr-2 -mt-2 grid h-11 w-11 shrink-0 place-items-center rounded-full bg-transparent text-grey transition-colors hover:bg-light hover:text-pink-dark"
                >
                  <X size={18} weight="bold" aria-hidden />
                </button>
              </div>

              {href ? (
                <a
                  href={href}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="button button--light inline-flex items-center justify-center gap-2"
                >
                  <WhatsappLogo size={18} weight="fill" aria-hidden />
                  Message us on WhatsApp
                </a>
              ) : (
                <p className="small bg-light px-4 py-3">{channels.pending}</p>
              )}

              <div>
                <p className="small font-semibold text-blue-dark">
                  Everything here works without us:
                </p>
                <ul className="mt-2 space-y-1.5">
                  {[
                    { href: "/tools/requirements-check", label: "Check your requirements" },
                    { href: "/destinations", label: "Read the country guides" },
                    { href: "/universities", label: "Compare courses and fees" },
                    { href: "/book-consultation", label: "How the paid consultation works" },
                  ].map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        onClick={() => setOpen(false)}
                        className="group inline-flex items-center gap-1.5 text-[0.9375rem] font-medium text-pink-dark hover:text-blue-dark"
                      >
                        {link.label}
                        <ArrowRight
                          size={13}
                          weight="bold"
                          aria-hidden
                          className="transition-transform group-hover:translate-x-0.5"
                        />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                type="button"
                onClick={hide}
                className="small min-h-11 bg-transparent text-left text-pink-dark underline underline-offset-2"
              >
                Hide this for the rest of my visit
              </button>
            </motion.div>
          )}

          <div>
            <button
              ref={toggleRef}
              type="button"
              onClick={() => setOpen((value) => !value)}
              aria-expanded={open}
              // On a phone the full pill covered the bottom of whatever was
              // being read. There it is the icon alone, with the same name.
              className="button button--pink inline-flex items-center gap-2 max-sm:h-14 max-sm:w-14 max-sm:justify-center max-sm:px-0"
            >
              <ChatCircleDots size={20} weight="fill" aria-hidden className="max-sm:size-6" />
              <span className="max-sm:sr-only">How to reach us</span>
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
