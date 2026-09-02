import { CheckCircle, Clock, Prohibit, PaperPlaneTilt } from "@phosphor-icons/react/ssr";
import type { VerificationStatus } from "@/content/types";
import { STATUS_LABEL, STATUS_TONE } from "@/content/types";
import { cn } from "@/lib/cn";

type Tone = "verified" | "pending" | "denied" | "neutral";

const toneStyles: Record<Tone, string> = {
  verified: "bg-verified-bg text-verified",
  pending: "bg-pending-bg text-pending",
  denied: "bg-denied-bg text-denied",
  neutral: "bg-neutral-chip-bg text-neutral-chip",
};

const toneIcon = {
  verified: CheckCircle,
  pending: Clock,
  denied: Prohibit,
  neutral: PaperPlaneTilt,
};

export function StatusChip({
  status,
  className,
}: {
  status: VerificationStatus;
  className?: string;
}) {
  const tone = STATUS_TONE[status];
  const Icon = toneIcon[tone];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-input px-2.5 py-1 text-[0.6875rem] font-medium leading-tight",
        toneStyles[tone],
        className,
      )}
    >
      <Icon size={13} weight="fill" aria-hidden />
      {STATUS_LABEL[status]}
    </span>
  );
}

export function Chip({
  tone = "neutral",
  children,
  className,
}: {
  tone?: Tone;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-input px-2.5 py-1 text-[0.6875rem] font-medium leading-tight",
        toneStyles[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
