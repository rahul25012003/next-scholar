"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, type CSSProperties } from "react";
import { ArrowRight } from "@phosphor-icons/react";
import type { NavItem } from "@/content/site";
import { navMedia } from "@/content/nav-media";
import { photoUrl } from "@/content/photos";
import { cn } from "@/lib/cn";

/**
 * One group's menu: the section's photograph and what it holds on the left,
 * its links on the right. Pointing at a link, or tabbing to it, swaps the
 * photograph and caption to that link's own, so the picture always shows
 * where the row under the pointer leads.
 *
 * The picture side is hidden from assistive technology. It repeats the label
 * and note the link itself already carries, and the photographs are
 * decoration.
 *
 * `armed` holds the photographs back until the pointer first reaches the nav.
 * The menus are always in the page, so without it every page load would fetch
 * a dozen pictures nobody had asked to see.
 */
export function NavMenu({
  item,
  armed,
  isCurrent,
  onNavigate,
}: {
  item: NavItem;
  armed: boolean;
  isCurrent: (href: string) => boolean;
  onNavigate: () => void;
}) {
  const [pointed, setPointed] = useState<number | null>(null);
  const children = item.children ?? [];
  const media = navMedia[item.label];
  const active = pointed === null ? null : children[pointed];
  const activePhoto = (active && media.byHref[active.href]) || media.lead;
  // The lead and every link's photograph, once each, stacked to cross-fade.
  const stack = [
    ...new Map(
      [media.lead, ...Object.values(media.byHref)].map((photo) => [photo.id, photo]),
    ).values(),
  ];

  return (
    <div
      className={cn("Nav__menu", children.length > 4 && "Nav__menu--wide")}
      onMouseLeave={() => setPointed(null)}
    >
      <div className="Nav__menu-inner">
        <div className="Nav__feature" aria-hidden>
          {armed &&
            stack.map((photo) => (
              <Image
                key={photo.id}
                src={photoUrl(photo, 560, 640)}
                alt=""
                fill
                sizes="272px"
                className={cn(
                  "Nav__feature-image",
                  photo.id === activePhoto.id && "is-active",
                )}
              />
            ))}
          {/* Keyed, so the caption remounts and rises in on every swap. */}
          <div className="Nav__feature-caption" key={pointed ?? "lead"}>
            <p className="Nav__feature-title">{active ? active.label : item.label}</p>
            <p className="Nav__feature-text">{active?.note ?? media.blurb}</p>
          </div>
        </div>

        <div className="Nav__menu-links">
          {children.map((child, index) => (
            <Link
              key={child.label}
              href={child.href}
              onClick={onNavigate}
              onMouseEnter={() => setPointed(index)}
              onFocus={() => setPointed(index)}
              className="Nav__menu-link"
              aria-current={isCurrent(child.href) ? "page" : undefined}
              style={{ "--i": index } as CSSProperties}
            >
              <span className="Nav__menu-label">{child.label}</span>
              {child.note && <span className="Nav__menu-note">{child.note}</span>}
              <ArrowRight className="Nav__menu-arrow" size={15} weight="bold" aria-hidden />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
