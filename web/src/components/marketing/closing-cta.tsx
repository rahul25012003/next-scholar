import { ButtonLink } from "@/components/ui/button";
import { BurstOnView } from "@/components/ui/burst-on-view";
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
        <BurstOnView className="Ticket-slat__button tickets">
          <ButtonLink href={primaryCta.href} variant="pink" size="lg">
            {primaryCta.label}
          </ButtonLink>
        </BurstOnView>
        {!bookingIntegration.live && (
          <p className="small u-center max-w-xs">
            Online booking and payment are not set up yet. The form keeps
            your answers and tells you so on the page.
          </p>
        )}
      </div>
    </section>
  );
}
