"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { MagnifyingGlass } from "@phosphor-icons/react";
import { nav, primaryCta, secondaryCta, site } from "@/content/site";
import { BackgroundShapes } from "@/components/site/background-shapes";
import { ExplodeBurst } from "@/components/ui/explode-burst";
import { cn } from "@/lib/cn";

/**
 * The reference header: transparent over the blue ground, a white wordmark,
 * white nav links with an underline that scales in, and the primary action
 * as the pink pill. Below 1200px the nav collapses to the hamburger, whose
 * three lines morph into a cross, and opens the full-screen blue dialog with
 * its links fading up one after another.
 *
 * The reference nav is seven flat links. This one has five groups and their
 * children, so each group opens a white menu in the same idiom, and the
 * dialog lists every child under its group.
 */
export function SiteHeader() {
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

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
    document.body.classList.toggle("modal-open", mobileOpen);
    if (mobileOpen) {
      dialogRef.current?.querySelector<HTMLElement>(".js-first-focus")?.focus();
    } else if (document.activeElement && dialogRef.current?.contains(document.activeElement)) {
      toggleRef.current?.focus();
    }
    return () => {
      document.body.classList.remove("modal-open");
    };
  }, [mobileOpen]);

  const close = () => setMobileOpen(false);

  return (
    <>
      <div
        ref={dialogRef}
        className="Header__mobile-nav-modal a11y-modal"
        id="mobile-nav"
        role="dialog"
        aria-modal="true"
        hidden={!mobileOpen}
        tabIndex={-1}
        aria-labelledby="mobile-nav_heading"
      >
        <div className="Header__mobile-nav-inner" role="document">
          <h2 className="sr-only" id="mobile-nav_heading">
            Primary Navigation
          </h2>

          <nav className="Nav Nav--mobile" aria-label="primary nav">
            <ul className="Nav__list" role="list">
              {nav.flatMap((item, index) =>
                item.children
                  ? [
                      <li key={item.label} className="Nav__listItem Nav__group eyebrow">
                        {item.label}
                      </li>,
                      ...item.children.map((child, childIndex) => (
                        <li key={child.href + child.label} className="Nav__listItem">
                          <Link
                            className={cn(
                              "Nav__link",
                              index === 0 && childIndex === 0 && "js-first-focus",
                            )}
                            href={child.href}
                            onClick={close}
                          >
                            {child.label}
                          </Link>
                        </li>
                      )),
                    ]
                  : [
                      <li key={item.label} className="Nav__listItem">
                        <Link className="Nav__link" href={item.href ?? "/"} onClick={close}>
                          {item.label}
                        </Link>
                      </li>,
                    ],
              )}
              <li className="Nav__listItem">
                <Link className="Nav__link" href="/search" onClick={close}>
                  Search this site
                </Link>
              </li>
              <li className="Nav__listItem">
                <Link className="Nav__link" href={secondaryCta.href} onClick={close}>
                  {secondaryCta.label}
                </Link>
              </li>
              <li className="Nav__listItem">
                <Link className="Nav__link Nav__link--cta" href={primaryCta.href} onClick={close}>
                  {primaryCta.label}
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      <a className="skip-link" href="#main-content">
        Skip to content
      </a>

      <BackgroundShapes />

      <header className="Header">
        <div className="Header__container constrain">
          <Link href="/" className="Header__logo" title="Home" onClick={close}>
            <span className="Header__logo-mark" aria-hidden>
              N
            </span>
            <span aria-hidden>Next Scholar</span>
            <span className="sr-only">{site.name} home</span>
          </Link>

          <div className="Header__desktop-nav">
            <nav className="Nav" aria-label="primary nav" onMouseLeave={() => setOpenMenu(null)}>
              <ul className="Nav__list" role="list">
                {nav.map((item) =>
                  item.children ? (
                    <li
                      key={item.label}
                      className="Nav__listItem"
                      onMouseEnter={() => setOpenMenu(item.label)}
                      onBlur={(event) => {
                        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
                          setOpenMenu(null);
                        }
                      }}
                    >
                      <button
                        type="button"
                        className="Nav__link"
                        aria-expanded={openMenu === item.label}
                        aria-haspopup="true"
                        onClick={() =>
                          setOpenMenu(openMenu === item.label ? null : item.label)
                        }
                      >
                        {item.label}
                      </button>

                      {openMenu === item.label && (
                        <div className="Nav__menu">
                          <div className="Nav__menu-inner">
                            {item.children.map((child) => (
                              <Link
                                key={child.label}
                                href={child.href}
                                onClick={() => setOpenMenu(null)}
                                className="Nav__menu-link"
                              >
                                <span className="Nav__menu-label">{child.label}</span>
                                {child.note && (
                                  <span className="Nav__menu-note">{child.note}</span>
                                )}
                              </Link>
                            ))}
                          </div>
                        </div>
                      )}
                    </li>
                  ) : (
                    <li key={item.label} className="Nav__listItem">
                      <Link className="Nav__link" href={item.href ?? "/"}>
                        {item.label}
                      </Link>
                    </li>
                  ),
                )}

                <li className="Nav__listItem">
                  <Link
                    href="/search"
                    aria-label="Search this site"
                    className="Nav__link Nav__link--icon"
                  >
                    <MagnifyingGlass size={20} weight="bold" aria-hidden />
                  </Link>
                </li>
                <li className="Nav__listItem">
                  <Link className="Nav__link" href={secondaryCta.href}>
                    {secondaryCta.label}
                  </Link>
                </li>
                <li className="Nav__listItem anim-explode-container">
                  <Link className="Nav__link Nav__link--cta" href={primaryCta.href}>
                    {primaryCta.label}
                  </Link>
                  <ExplodeBurst />
                </li>
              </ul>
            </nav>
          </div>

          <div className="Header__mobile-nav">
            <button
              ref={toggleRef}
              type="button"
              className="Header__toggle"
              aria-expanded={mobileOpen}
              aria-controls="mobile-nav"
              onClick={() => setMobileOpen((open) => !open)}
            >
              <span className="sr-only">{mobileOpen ? "Close menu" : "Menu"}</span>
              <svg className="Header__toggle-svg" viewBox="0 0 60 40" aria-hidden focusable="false">
                <g stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                  <path className="Header__toggle-line Header__toggle-line--top" d="M10,10 L50,10 Z" />
                  <path className="Header__toggle-line Header__toggle-line--middle" d="M10,20 L50,20 Z" />
                  <path className="Header__toggle-line Header__toggle-line--bottom" d="M10,30 L50,30 Z" />
                </g>
              </svg>
            </button>
          </div>
        </div>
      </header>
    </>
  );
}
