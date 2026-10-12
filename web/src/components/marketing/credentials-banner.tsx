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
      {/* No fill of its own. The panel was the ground's colour and so
          invisible; once the ground gained its glow, the fill showed up as a
          faint dark rectangle wherever the glow passed behind it. */}
      <div className="Cta__inner pad-before-lg pad-x-lg flow">
        <h2 className="Cta__heading h h--3 text-light">
          There are no partner logos on this page
        </h2>
        <div className="Cta__copy text-light flow">
          <p>
            We have not signed an agreement with any university yet, so there
            are no logos to show.
          </p>
        </div>

        <div className="Cta__aside text-light flow">
          <h3 className="h h--5 text-light">Accreditation status</h3>
          <ul role="list" className="divide-y divide-white/10">
            {credentials.map((credential) => (
              <li
                key={credential.name}
                className="flex flex-col gap-1 py-3 first:pt-0 last:pb-0 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6"
              >
                <div>
                  <p className="font-bold text-white">{credential.name}</p>
                  <p className="small mt-0.5 leading-snug text-light">
                    {credential.body}
                  </p>
                </div>
                <span className="figures small shrink-0 text-light">
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
