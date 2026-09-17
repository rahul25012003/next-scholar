import Link from "next/link";
import { ButtonLink } from "@/components/ui/button";
import { BackgroundShapes } from "@/components/site/background-shapes";
import { primaryCta } from "@/content/site";

export default function NotFound() {
  return (
    <main className="flex min-h-[70vh] items-center pad-around-lg">
      <BackgroundShapes />
      <div className="band w-full">
        <div className="shell flow max-w-2xl">
          <p className="figures small">404</p>
          <h1 className="h h--3 text-blue-dark">There is nothing at this address</h1>
          <p>
            Either the page moved or it never existed. If you followed a link from
            somewhere on this site, that is our mistake rather than yours.
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <ButtonLink href="/" size="lg">
              Back to the start
            </ButtonLink>
            <ButtonLink href="/search" variant="outline" size="lg">
              Search the site
            </ButtonLink>
          </div>
          <p className="small pt-4">
            Looking for the commission figures? They are on the{" "}
            <Link href="/open-ledger" className="font-bold text-pink">
              Open Ledger
            </Link>
            . Looking for a consultation instead?{" "}
            <Link href={primaryCta.href} className="font-bold text-pink">
              {primaryCta.label}
            </Link>
            .
          </p>
        </div>
      </div>
    </main>
  );
}
