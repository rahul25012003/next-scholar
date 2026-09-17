import { ButtonLink } from "@/components/ui/button";
import { ExplodeBurst } from "@/components/ui/explode-burst";
import { bookingIntegration, consultation } from "@/content/consultation";
import { primaryCta } from "@/content/site";

/**
 * The reference's ticket slat: centred light type on the ground, and the one
 * pink button on the page, with the burst behind it.
 */
export function ClosingCta() {
  return (
    <section className="Ticket-slat constrain constrain--mid pad-around-lg text-light bg-none">
      <div className="Ticket-slat__inner center text-constrain u-center pad-x flow flow--lg">
        <h2 className="h h--3 text-light">Start with 45 paid minutes</h2>
        <p>
          {consultation.price} for the call, {consultation.creditNote.toLowerCase()}{" "}
          {consultation.promise}
        </p>
        <p className="small">{consultation.includesUncomfortable}</p>
        <div className="Ticket-slat__button tickets anim-explode-container">
          <ButtonLink href={primaryCta.href} variant="pink">
            {primaryCta.label}
          </ButtonLink>
          <ExplodeBurst />
        </div>
        {!bookingIntegration.live && (
          <p className="small u-center max-w-xs">
            Scheduling and payment are not connected yet. The form records
            your request and answers, and says so on the page.
          </p>
        )}
      </div>
    </section>
  );
}
