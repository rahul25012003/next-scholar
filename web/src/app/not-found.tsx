import Link from "next/link";
import { ButtonLink } from "@/components/ui/button";
import { primaryCta } from "@/content/site";

export default function NotFound() {
  return (
    <main className="flex min-h-[70vh] items-center bg-surface">
      <div className="shell max-w-2xl py-20">
        <p className="figures text-[0.875rem] text-muted">404</p>
        <h1 className="mt-3 font-display text-[2.25rem] font-extrabold leading-tight tracking-[-0.03em] text-navy-900">
          There is nothing at this address
        </h1>
        <p className="mt-5 text-[1.0625rem] leading-relaxed text-body">
          Either the page moved or it never existed. If you followed a link from
          somewhere on this site, that is our mistake rather than yours.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <ButtonLink href="/" size="lg">
            Back to the start
          </ButtonLink>
          <ButtonLink href={primaryCta.href} variant="outline" size="lg">
            {primaryCta.label}
          </ButtonLink>
        </div>
        <p className="mt-10 text-[0.875rem] leading-relaxed text-muted">
          Looking for the commission figures? They are on the{" "}
          <Link href="/open-ledger" className="font-medium text-blue-600 hover:text-blue-500">
            Open Ledger
          </Link>
          .
        </p>
      </div>
    </main>
  );
}
