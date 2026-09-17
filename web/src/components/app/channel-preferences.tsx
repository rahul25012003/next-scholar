"use client";

import { useActionState } from "react";
import { EnvelopeSimple, WhatsappLogo } from "@phosphor-icons/react";
import type { ChannelConsent, ContactChannel } from "@/domain/consent";
import { setChannelPreference, type ChannelResult } from "@/app/actions/student";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";

const channels: {
  key: ContactChannel;
  label: string;
  icon: typeof EnvelopeSimple;
  detail: string;
}[] = [
  {
    key: "email",
    label: "Email",
    icon: EnvelopeSimple,
    detail:
      "Deadline reminders, document requests and anything that needs a written record. Turning this off means we contact you only through this portal.",
  },
  {
    key: "whatsapp",
    label: "WhatsApp",
    icon: WhatsappLogo,
    detail:
      "Only with an explicit opt in, and the planner refuses to queue a message without one. It is the channel most of this industry uses without asking.",
  },
];

/**
 * Notification preferences.
 *
 * The planner already fails closed on a missing opt in: no recorded consent
 * means no message, rather than a message sent on the assumption nobody would
 * mind. This is the control that was missing, so a student could see what was
 * recorded and change it themselves rather than asking a counsellor to.
 *
 * A withdrawal is stamped rather than deleted, and turning a channel back on
 * writes a new record. Both are visible below, because the history of what you
 * consented to is part of what you are entitled to see.
 */
export function ChannelPreferences({
  caseId,
  consents,
}: {
  caseId: string;
  consents: ChannelConsent[];
}) {
  const [state, formAction, pending] = useActionState<ChannelResult, FormData>(
    setChannelPreference,
    { status: "idle" },
  );

  return (
    <div className="px-6 py-5">
      <ul className="divide-y divide-line">
        {channels.map((channel) => {
          const live = consents.find(
            (consent) => consent.channel === channel.key && consent.withdrawnAt === null,
          );
          const history = consents.filter(
            (consent) => consent.channel === channel.key && consent.withdrawnAt !== null,
          );
          const Icon = channel.icon;

          return (
            <li key={channel.key} className="py-4 first:pt-0 last:pb-0">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex min-w-0 gap-3">
                  <Icon
                    size={18}
                    weight="fill"
                    aria-hidden
                    className={cn("mt-0.5 shrink-0", live ? "text-verified" : "text-grey")}
                  />
                  <div className="min-w-0">
                    <p className="text-[0.9375rem] font-medium text-blue-dark">
                      {channel.label}
                      <span
                        className={cn(
                          "ml-2 rounded-input px-2 py-0.5 text-[0.6875rem] font-medium",
                          live
                            ? "bg-verified-bg text-verified"
                            : "bg-neutral-chip-bg text-neutral-chip",
                        )}
                      >
                        {live ? "On" : "Off"}
                      </span>
                    </p>
                    <p className="mt-1 max-w-prose text-[0.8125rem] leading-relaxed text-grey">
                      {channel.detail}
                    </p>
                    {live && (
                      <p className="figures mt-1.5 text-[0.75rem] text-grey">
                        Opted in {live.grantedAt.slice(0, 10)} by {live.grantedBy}
                      </p>
                    )}
                    {history.map((consent) => (
                      <p key={consent.id} className="figures mt-1 text-[0.75rem] text-grey">
                        Withdrawn {consent.withdrawnAt?.slice(0, 10)}. The record is kept
                        rather than deleted.
                      </p>
                    ))}
                  </div>
                </div>

                <form action={formAction} className="shrink-0">
                  <input type="hidden" name="caseId" value={caseId} />
                  <input type="hidden" name="channel" value={channel.key} />
                  <input type="hidden" name="on" value={live ? "off" : "on"} />
                  <Button type="submit" variant="outline" disabled={pending}>
                    {live ? `Turn ${channel.label} off` : `Turn ${channel.label} on`}
                  </Button>
                </form>
              </div>
            </li>
          );
        })}
      </ul>

      {state.status === "error" && (
        <p className="mt-4 text-[0.8125rem] text-denied" role="alert">
          {state.message}
        </p>
      )}
      {state.status === "changed" && (
        <p className="mt-4 text-[0.8125rem] text-verified" role="status">
          {state.message}
        </p>
      )}

      <p className="mt-5 border-t border-line pt-4 text-[0.8125rem] leading-relaxed text-grey">
        Neither channel is connected to a provider yet, so nothing is actually delivered on
        either today. What is recorded here is the permission, and the notification planner
        already refuses to queue a message on a channel with no live opt in.
      </p>
    </div>
  );
}
