import type { CSSProperties } from "react";
import Link from "next/link";
import { WarningCircle } from "@phosphor-icons/react/ssr";
import type { Actor } from "@/domain/rbac";
import { SignOutButton } from "@/components/app/sign-out";
import { SplitText } from "@/components/ui/split-text";
import { BackgroundShapes } from "@/components/site/background-shapes";
import { storeNotice } from "@/data/store";
import { cn } from "@/lib/cn";

const surfaces = [
  { href: "/portal", label: "Student portal", roles: ["student"] },
  { href: "/console", label: "Counsellor console", roles: ["counselor", "manager", "founder"] },
  { href: "/ops", label: "Operations", roles: ["manager", "founder"] },
];

export function AppShell({
  actor,
  current,
  children,
}: {
  actor: Actor;
  current: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <BackgroundShapes still />
      <header className="Header Header--app">
        <div className="Header__container constrain">
          <Link href="/" className="Header__logo" title="Home">
            <span className="Header__logo-mark" aria-hidden>
              N
            </span>
            <span>Next Scholar</span>
          </Link>

          {/* Below 768px this was hidden, which left a manager on a phone with
              no way from the console to operations. It wraps to its own row. */}
          <nav className="Nav" aria-label="Signed-in areas">
            <ul className="Nav__list" role="list">
              {surfaces
                .filter((surface) => surface.roles.includes(actor.role))
                .map((surface) => (
                  <li key={surface.href} className="Nav__listItem">
                    <Link
                      href={surface.href}
                      className={cn(
                        "Nav__link",
                        current === surface.href && "Nav__link--active",
                      )}
                      aria-current={current === surface.href ? "page" : undefined}
                    >
                      {surface.label}
                    </Link>
                  </li>
                ))}
            </ul>
          </nav>

          <div className="flex items-center gap-5 text-white">
            {/* The notice under the header already names who is signed in, so
                on a phone this gives its room to the wordmark and sign out. */}
            <div className="hidden text-right leading-tight sm:block">
              <p className="font-bold">{actor.name}</p>
              <p className="small capitalize">{actor.role}</p>
            </div>
            <SignOutButton />
          </div>
        </div>
      </header>

      <div className="constrain rise mt-6">
        <div className="flex items-start gap-2.5 bg-blue-light px-5 py-3 text-blue-dark">
          <WarningCircle size={18} weight="fill" className="mt-0.5 shrink-0" aria-hidden />
          <p className="small">
            You are signed in as {actor.name}, a {actor.role}. Your session is
            signed, and every read of a case is logged against your name.{" "}
            {storeNotice()}
          </p>
        </div>
      </div>

      <main id="main-content" tabIndex={-1} className="flex-1 py-10">
        {children}
      </main>
    </div>
  );
}

export function Panel({
  title,
  description,
  action,
  icon,
  children,
  className,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
  /** Shown in a tinted disc beside the title, so a panel can be found by eye. */
  icon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("Panel bg-white text-grey", className)}>
      <div className="flex flex-wrap items-start justify-between gap-4 border-b-2 border-light px-6 py-5">
        <div className="flex items-start gap-4">
          {icon && (
            <span className="Panel__icon" aria-hidden>
              {icon}
            </span>
          )}
          <div>
            <h2 className="h h--5 text-blue-dark">{title}</h2>
            {description && <p className="small mt-1 max-w-2xl">{description}</p>}
          </div>
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

/**
 * One count at the top of a dashboard. The label is a small eyebrow rather
 * than a panel title: as a title, a label long enough to wrap pushed its
 * figure a line lower than its neighbours' and the row stopped lining up.
 */
export function Stat({
  label,
  value,
  note,
  icon,
}: {
  label: string;
  value: string | number;
  note: string;
  icon?: React.ReactNode;
}) {
  return (
    <section className="Panel Stat bg-white px-6 py-5 text-grey">
      {icon && (
        <span className="Stat__icon" aria-hidden>
          {icon}
        </span>
      )}
      <h2 className="eyebrow pr-14 text-grey">{label}</h2>
      <p className="h h--4 figures mt-3 text-blue-dark">
        <SplitText start={3}>{String(value)}</SplitText>
      </p>
      <p className="small mt-1">{note}</p>
    </section>
  );
}

/**
 * The visible head of a signed-in page: which surface this is, a title, and
 * one line of context, set on the ground above the panels. These pages used
 * to carry their h1 for screen readers only, which left the eye nothing to
 * start from but the first panel.
 */
export function PageHead({
  eyebrow,
  title,
  lede,
}: {
  eyebrow: string;
  title: string;
  lede?: string;
}) {
  return (
    <header className="PageHead shell">
      <p className="eyebrow rise text-blue-light">{eyebrow}</p>
      <h1 className="h h--3 text-light">
        <SplitText>{title}</SplitText>
      </h1>
      {lede && (
        <p className="rise mt-2 max-w-2xl text-light" style={{ "--i": 4 } as CSSProperties}>
          {lede}
        </p>
      )}
    </header>
  );
}

export function EmptyState({ headline, body }: { headline: string; body: string }) {
  return (
    <div className="px-6 py-12 text-center">
      <svg className="EmptyState__art" viewBox="0 0 130 60" aria-hidden focusable="false">
        <path
          className="fill-blue-light"
          d="M22 14a6 6 0 016-2l22 8a6 6 0 014 6l-1 24a6 6 0 01-4 5l-23 7a6 6 0 01-7-3L6 39a6 6 0 010-7z"
        />
        <path
          className="fill-teal-light"
          fillRule="evenodd"
          d="M84 38a8 8 0 10-8-8 8 8 0 008 8zm0 12a20 20 0 10-20-20 20 20 0 0020 20z"
        />
        <path
          className="fill-pink"
          d="M118 22a4 4 0 00-4 4v5h-5a4 4 0 000 8h5v5a4 4 0 008 0v-5h5a4 4 0 000-8h-5v-5a4 4 0 00-4-4z"
        />
      </svg>
      <p className="h h--6 text-blue-dark">{headline}</p>
      <p className="small mx-auto mt-2 max-w-md">{body}</p>
    </div>
  );
}
