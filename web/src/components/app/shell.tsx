import Link from "next/link";
import { WarningCircle } from "@phosphor-icons/react/ssr";
import type { Actor } from "@/domain/rbac";
import { SignOutButton } from "@/components/app/sign-out";
import { BackgroundShapes } from "@/components/site/background-shapes";
import { storeNotice } from "@/data/store";
import { cn } from "@/lib/cn";

const surfaces = [
  { href: "/portal", label: "Student portal", roles: ["student"] },
  { href: "/console", label: "Counselor console", roles: ["counselor", "manager", "founder"] },
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
      <BackgroundShapes />
      <header className="Header">
        <div className="Header__container constrain">
          <Link href="/" className="Header__logo" title="Home">
            <span className="Header__logo-mark" aria-hidden>
              N
            </span>
            <span>Next Scholar</span>
          </Link>

          <nav className="Nav hidden md:block">
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
            <div className="text-right">
              <p className="font-bold">{actor.name}</p>
              <p className="small capitalize">{actor.role}</p>
            </div>
            <SignOutButton />
          </div>
        </div>
      </header>

      <div className="constrain">
        <div className="flex items-start gap-2.5 bg-blue-light px-5 py-3 text-blue-dark">
          <WarningCircle size={18} weight="fill" className="mt-0.5 shrink-0" aria-hidden />
          <p className="small">
            You are signed in as {actor.name}, a {actor.role}. Sessions are
            signed and every read of a case is recorded against your name.{" "}
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
  children,
  className,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("bg-white text-grey", className)}>
      <div className="flex flex-wrap items-start justify-between gap-4 border-b-2 border-light px-6 py-5">
        <div>
          <h2 className="h h--5 text-blue-dark">{title}</h2>
          {description && <p className="small mt-1 max-w-2xl">{description}</p>}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

export function EmptyState({ headline, body }: { headline: string; body: string }) {
  return (
    <div className="px-6 py-12 text-center">
      <p className="h h--6 text-blue-dark">{headline}</p>
      <p className="small mx-auto mt-2 max-w-md">{body}</p>
    </div>
  );
}
