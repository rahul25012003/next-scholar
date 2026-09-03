"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ChatCircleDots, WhatsappLogo, X } from "@phosphor-icons/react";
import { channels } from "@/content/site";

/**
 * The persistent contact control.
 *
 * Two decisions in here are deliberate. It appears after the reader has scrolled
 * past the first screen, rather than the moment the page loads, because a
 * contact prompt that interrupts the first paragraph is an interruption rather
 * than an offer. And it never becomes a modal: the panel is dismissible, the
 * dismissal sticks for the session, and nothing behind it is blocked.
 *
 * The WhatsApp button renders only when a number actually exists. With no
 * number configured it says so rather than showing a dead button, because a
 * contact channel that does not work is worse than one that is honestly absent.
 */
export function TalkToUs() {
  const [visible, setVisible] = useState(false);
  const [open, setOpen] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const reduced = useReducedMotion();

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
          className="fixed bottom-4 right-4 z-40 flex max-w-[calc(100vw-2rem)] flex-col items-end gap-3 sm:bottom-6 sm:right-6"
        >
          {open && (
            <motion.div
              initial={reduced ? false : { opacity: 0, scale: 0.96, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
              className="w-80 max-w-full rounded-panel border border-line bg-paper p-5 shadow-lift"
              role="dialog"
              aria-label="Talk to a counsellor"
            >
              <div className="flex items-start justify-between gap-4">
                <h2 className="font-display text-[1rem] font-bold text-navy-900">
                  Talk to a counsellor
                </h2>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Close"
                  className="grid h-7 w-7 shrink-0 place-items-center rounded-full text-muted transition-colors hover:bg-surface hover:text-navy-900"
                >
                  <X size={15} weight="bold" aria-hidden />
                </button>
              </div>

              <p className="mt-2.5 text-[0.875rem] leading-relaxed text-body">
                The consultation is paid, priced in public, and ends in a written assessment
                within 24 hours. It includes the answer nobody sells, which is that you
                should not go at all.
              </p>

              <div className="mt-4 grid gap-2">
                <Link
                  href="/book-consultation"
                  onClick={() => setOpen(false)}
                  className="rounded-full bg-blue-600 px-4 py-2.5 text-center text-[0.875rem] font-medium text-white transition-colors hover:bg-blue-500"
                >
                  Book a consultation
                </Link>
                {href ? (
                  <a
                    href={href}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-line-strong px-4 py-2.5 text-[0.875rem] font-medium text-navy-900 transition-colors hover:border-verified hover:text-verified"
                  >
                    <WhatsappLogo size={16} weight="fill" aria-hidden />
                    Message us on WhatsApp
                  </a>
                ) : (
                  <p className="rounded-input bg-surface px-3.5 py-3 text-[0.8125rem] leading-relaxed text-muted">
                    {channels.pending}
                  </p>
                )}
              </div>

              <p className="mt-3.5 border-t border-line pt-3 text-[0.75rem] leading-relaxed text-muted">
                Nothing on this site is behind this button. Every guide, every calculator
                and every commission figure works without talking to anyone.
              </p>

              <button
                type="button"
                onClick={() => setDismissed(true)}
                className="mt-2 text-[0.75rem] text-muted underline underline-offset-2 hover:text-navy-900"
              >
                Hide this for the rest of my visit
              </button>
            </motion.div>
          )}

          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            className="inline-flex items-center gap-2 rounded-full bg-navy-900 px-5 py-3 text-[0.9375rem] font-medium text-white shadow-lift transition-colors hover:bg-navy-800"
          >
            <ChatCircleDots size={18} weight="fill" aria-hidden />
            Talk to a counsellor
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
