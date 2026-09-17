import { credentials } from "@/content/outcomes";

/**
 * The reference's blue panel: a heading across the top, copy in the left
 * half, and the right half carrying what the reference fills with a photo
 * collage. Here that half is the accreditation list, because a slot for
 * partner logos on a site with no partners is better used for the truth.
 */
export function CredentialsBanner() {
  return (
    <section className="Cta Cta--flat constrain">
      <div className="Cta__inner pad-before-lg pad-x-lg bg-blue-dark flow">
        <h2 className="Cta__heading h h--3 text-light">
          There are no partner logos on this page
        </h2>
        <div className="Cta__copy text-light flow">
          <p>
            No university agreement has been signed yet, so there is nothing to
            display. When one exists, the commission attached to it appears in
            the Open Ledger the same week.
          </p>
        </div>

        <div className="Cta__aside text-light flow">
          <h3 className="h h--5 text-light">Accreditation status</h3>
          <ul role="list" className="divide-y divide-white/10">
            {credentials.map((credential) => (
              <li
                key={credential.name}
                className="flex items-baseline justify-between gap-6 py-3 first:pt-0 last:pb-0"
              >
                <div>
                  <p className="font-bold text-white">{credential.name}</p>
                  <p className="small mt-0.5 leading-snug text-white/70">
                    {credential.body}
                  </p>
                </div>
                <span className="figures small shrink-0 text-white/70">
                  {credential.timeline}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
