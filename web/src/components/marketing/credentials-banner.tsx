import { credentials } from "@/content/outcomes";

/**
 * The layout this section borrows sits a rating badge and a row of partner
 * university logos here. Next Scholar has neither, so the slot carries what is
 * actually true: no signed agreements, and three credentials that are targets
 * rather than holdings.
 */
export function CredentialsBanner() {
  return (
    <section className="relative bg-surface pb-16 md:pb-20">
      <div className="shell">
        <div className="grid gap-10 rounded-panel bg-navy-900 px-7 py-9 text-white md:px-10 md:py-11 lg:grid-cols-[1fr_1fr] lg:gap-16">
          <div>
            <h2 className="font-display text-[1.375rem] font-bold leading-snug text-white md:text-2xl">
              There are no partner logos on this page
            </h2>
            <p className="mt-4 max-w-md text-[0.9375rem] leading-relaxed text-white/70">
              No university agreement has been signed yet, so there is nothing to
              display. When one exists, the commission attached to it appears in
              the Open Ledger the same week.
            </p>
          </div>

          <div>
            <h3 className="font-display text-[0.9375rem] font-semibold text-white/90">
              Accreditation status
            </h3>
            <ul className="mt-4 divide-y divide-white/10">
              {credentials.map((credential) => (
                <li
                  key={credential.name}
                  className="flex items-baseline justify-between gap-6 py-3 first:pt-0 last:pb-0"
                >
                  <div>
                    <p className="text-[0.9375rem] font-medium text-white">
                      {credential.name}
                    </p>
                    <p className="mt-0.5 text-[0.8125rem] leading-snug text-white/50">
                      {credential.body}
                    </p>
                  </div>
                  <span className="figures shrink-0 text-[0.75rem] text-white/60">
                    {credential.timeline}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
