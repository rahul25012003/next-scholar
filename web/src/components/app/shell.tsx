import Link from "next/link";
import { WarningCircle } from "@phosphor-icons/react/ssr";
import type { Actor } from "@/domain/rbac";
import { SignOutButton } from "@/components/app/sign-out";
import { storeNotice } from "@/data/store";

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
    <div className="flex min-h-screen flex-col bg-surface">
      <header className="border-b border-line bg-paper">
        <div className="shell flex h-16 items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2.5">
              <span
                className="grid h-8 w-8 place-items-center rounded-input bg-navy-900 font-display text-[0.9375rem] font-bold text-white"
                aria-hidden
              >
                N
              </span>
              <span className="font-display text-[0.9375rem] font-bold tracking-tight text-navy-900">
                Next<span className="text-blue-600">Scholar</span>
              </span>
            </Link>
            <nav className="hidden items-center gap-1 md:flex">
              {surfaces
                .filter((surface) => surface.roles.includes(actor.role))
                .map((surface) => (
                <Link
                  key={surface.href}
                  href={surface.href}
                  className={
                    current === surface.href
                      ? "rounded-full bg-blue-50 px-3.5 py-1.5 text-[0.875rem] font-medium text-blue-600"
                      : "rounded-full px-3.5 py-1.5 text-[0.875rem] font-medium text-ink-soft transition-colors hover:text-navy-900"
                  }
                >
                  {surface.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-5">
            <div className="text-right">
              <p className="text-[0.875rem] font-medium text-navy-900">{actor.name}</p>
              <p className="text-[0.75rem] capitalize text-muted">{actor.role}</p>
            </div>
            <SignOutButton />
          </div>
        </div>
      </header>

      <div className="border-b border-pending/25 bg-pending-bg/60">
        <div className="shell flex items-start gap-2.5 py-2.5">
          <WarningCircle
            size={16}
            weight="fill"
            className="mt-0.5 shrink-0 text-pending"
            aria-hidden
          />
          <p className="text-[0.8125rem] leading-relaxed text-ink-soft">
            You are signed in as {actor.name}, a {actor.role}. Sessions are
            signed and every read of a case is recorded against your name.{" "}
            {storeNotice()}
          </p>
        </div>
      </div>

      <main className="flex-1 py-10">{children}</main>
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
    <section
      className={`rounded-panel border border-line bg-paper ${className ?? ""}`}
    >
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-line px-6 py-5">
        <div>
          <h2 className="font-display text-[1.0625rem] font-bold text-navy-900">
            {title}
          </h2>
          {description && (
            <p className="mt-1 max-w-2xl text-[0.8125rem] leading-relaxed text-muted">
              {description}
            </p>
          )}
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
      <p className="font-display text-[1rem] font-bold text-navy-900">{headline}</p>
      <p className="mx-auto mt-2 max-w-md text-[0.875rem] leading-relaxed text-muted">
        {body}
      </p>
    </div>
  );
}
