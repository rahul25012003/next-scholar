"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { CaretDown, MagnifyingGlass } from "@phosphor-icons/react";
import { nav, primaryCta, secondaryCta, site } from "@/content/site";
import { BackgroundShapes } from "@/components/site/background-shapes";
import { NavMenu } from "@/components/site/nav-menu";
import { cn } from "@/lib/cn";

/** A link is current on its own page and on every page beneath it. */
const isCurrent = (pathname: string, href?: string) =>
  Boolean(href) &&
  !href!.includes("#") &&
  (pathname === href || pathname.startsWith(`${href}/`));

/**
 * The reference header: transparent over the blue ground, a white wordmark,
 * white nav links with an underline that scales in, and the primary action
 * as the pink pill. Below 1300px the nav collapses to the hamburger, whose
 * three lines morph into a cross, and opens the full-screen blue dialog with
 * its links fading up one after another.
 *
 * The reference nav is seven flat links. This one has five groups and their
 * children, so each group opens a white menu in the same idiom, and the
 * dialog lists every child under its group.
 *
 * Unlike the reference, the header stays on screen and condenses once the
 * page moves (D.16). The sticky side rails and the university tab strip were
 * built to sit under it, so a header that scrolled away left them floating.
 *
 * Every group menu is always rendered and hidden with visibility, not mounted
 * on open. That is what lets it ease out as well as in from the stylesheet
 * alone, and it puts every destination in the page's HTML for a crawler.
 */
export function SiteHeader() {
  const pathname = usePathname();
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  // True once the pointer or the keyboard first reaches the nav. Until then
  // the menus hold no photographs, so a page load does not fetch them.
  const [armed, setArmed] = useState(false);

  // Where the desktop nav is showing, fetch the menu photographs once the
  // page has gone quiet, so the first menu opens with its picture already
  // there. Narrower screens never show these menus and never fetch them.
  useEffect(() => {
    if (!window.matchMedia("(min-width: 1300px)").matches) return;
    const timer = window.setTimeout(() => setArmed(true), 2500);
    return () => window.clearTimeout(timer);
  }, []);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [condensed, setCondensed] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setCondensed(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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
        // The list is longer than a phone screen. Without this the smooth
        // scroller takes the wheel and moves the page behind the dialog.
        data-lenis-prevent
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
              <li className="Nav__listItem tickets">
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

      <header className={cn("Header Header--sticky", condensed && "Header--condensed")}>
        <div className="Header__container constrain">
          <Link href="/" className="Header__logo" title="Home" onClick={close}>
            <span className="Header__logo-mark" aria-hidden>
              N
            </span>
            <span aria-hidden>Next Scholar</span>
            <span className="sr-only">{site.name} home</span>
          </Link>

          <div className="Header__desktop-nav">
            <nav
              className="Nav"
              aria-label="primary nav"
              onMouseEnter={() => setArmed(true)}
              onFocus={() => setArmed(true)}
              onMouseLeave={() => setOpenMenu(null)}
            >
              <ul className="Nav__list" role="list">
                {nav.map((item) =>
                  item.children ? (
                    <li
                      key={item.label}
                      className="Nav__listItem Nav__listItem--group"
                      onMouseEnter={() => setOpenMenu(item.label)}
                      onBlur={(event) => {
                        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
                          setOpenMenu(null);
                        }
                      }}
                    >
                      <button
                        type="button"
                        className={cn(
                          "Nav__link",
                          item.children.some((child) => isCurrent(pathname, child.href)) &&
                            "Nav__link--active",
                        )}
                        aria-expanded={openMenu === item.label}
                        aria-haspopup="true"
                        onClick={() =>
                          setOpenMenu(openMenu === item.label ? null : item.label)
                        }
                      >
                        {item.label}
                        <CaretDown className="Nav__caret" size={11} weight="bold" aria-hidden />
                      </button>

                      <NavMenu
                        item={item}
                        armed={armed}
                        isCurrent={(href) => isCurrent(pathname, href)}
                        onNavigate={() => setOpenMenu(null)}
                      />
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
                    aria-current={isCurrent(pathname, "/search") ? "page" : undefined}
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
                <li className="Nav__listItem tickets">
                  <Link className="Nav__link Nav__link--cta" href={primaryCta.href}>
                    {primaryCta.label}
                  </Link>
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
