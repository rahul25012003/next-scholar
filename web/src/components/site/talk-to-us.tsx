"use client";

import { useEffect, useRef, useState } from "react";
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

  // A keyboard or screen reader user who opens this panel should land inside
  // it, and get their focus back on the toggle when it closes, rather than
  // being left wherever the page happened to put them.
  useEffect(() => {
    if (open) {
      panelRef.current?.focus();
      wasOpen.current = true;
    } else if (wasOpen.current) {
      toggleRef.current?.focus();
      wasOpen.current = false;
    }
  }, [open]);

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
              ref={panelRef}
              tabIndex={-1}
              initial={reduced ? false : { opacity: 0, scale: 0.96, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
              className="flow w-80 max-w-full bg-white p-6 text-grey"
              role="dialog"
              aria-label="Talk to a counsellor"
            >
              <div className="flex items-start justify-between gap-4">
                <h2 className="h--6 text-blue-dark">Talk to a counsellor</h2>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Close"
                  className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-transparent text-grey transition-colors hover:bg-light hover:text-pink"
                >
                  <X size={16} weight="bold" aria-hidden />
                </button>
              </div>

              <p className="small">
                The consultation is paid, priced in public, and ends in a written assessment
                within 24 hours. It includes the answer nobody sells, which is that you
                should not go at all.
              </p>

              <div className="grid gap-2">
                <Link href="/book-consultation" onClick={() => setOpen(false)} className="button">
                  Book a consultation
                </Link>
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
              </div>

              <p className="small border-t-2 border-light pt-3">
                Nothing on this site is behind this button. Every guide, every calculator
                and every commission figure works without talking to anyone.
              </p>

              <button
                type="button"
                onClick={() => setDismissed(true)}
                className="small bg-transparent text-pink underline underline-offset-2"
              >
                Hide this for the rest of my visit
              </button>
            </motion.div>
          )}

          <button
            ref={toggleRef}
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            className="button button--pink inline-flex items-center gap-2"
          >
            <ChatCircleDots size={20} weight="fill" aria-hidden />
            Talk to a counsellor
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
