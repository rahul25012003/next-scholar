import Link from "next/link";
import { ArrowRight, CheckCircle, Question, XCircle } from "@phosphor-icons/react/ssr";
import { OnboardingForm } from "@/components/app/onboarding";
import { Panel } from "@/components/app/shell";
import {
  answeredCount,
  nextSteps,
  toChecklistProfile,
  type OnboardingProfile,
} from "@/domain/onboarding";
import { runChecklist, tally, type CheckState } from "@/domain/eligibility";
import { guides } from "@/content/guides";
import { cn } from "@/lib/cn";

const stateMeta: Record<CheckState, { label: string; icon: typeof CheckCircle; text: string; bg: string }> = {
  met: { label: "Met", icon: CheckCircle, text: "text-verified", bg: "bg-verified-bg" },
  "not-met": { label: "Not met yet", icon: XCircle, text: "text-denied", bg: "bg-denied-bg" },
  unknown: { label: "Cannot tell", icon: Question, text: "text-pending", bg: "bg-pending-bg" },
};

/**
 * What a new account sees.
 *
 * It used to see one panel saying "No case record", which was true and did
 * nothing for anyone. A case exists when a consultation has happened and a
 * counsellor has opened one, and that is deliberate: we are not going to open a
 * fake case to make a dashboard look populated.
 *
 * So this is the honest middle. The account holds what the student tells us,
 * the published requirements run against it immediately, and every gap has a
 * next step with a free tool behind it. Nothing here is a case, nothing here
 * pretends to be, and none of it is gated behind paying us.
 */
export function NewAccountState({
  name,
  profile,
}: {
  name: string;
  profile: OnboardingProfile;
}) {
  const checklistProfile = toChecklistProfile(profile);
  const results = checklistProfile ? runChecklist(checklistProfile) : [];
  const counts = tally(results);
  const progress = answeredCount(profile);
  const steps = nextSteps(profile);
  const guide = guides.find((item) => item.slug === profile.destination);

  return (
    <div className="grid gap-6">
      <Panel
        title={`Welcome, ${name.split(" ")[0]}`}
        description="No case has been opened for this account yet, and nothing has been invented to fill the screen. Here is what the account can do meanwhile, which is more than most consultancies give you after they have taken a fee."
      >
        <div className="grid gap-5 px-6 py-6 sm:grid-cols-3">
          <Step
            n={1}
            title="Tell us about yourself"
            body="Three short steps, nothing required, all of it editable. It stays on your account and reaches no university."
            done={progress.answered > 0}
          />
          <Step
            n={2}
            title="See where you stand"
            body="Your answers run against every published requirement for the destination. Met, not met, or cannot tell."
            done={results.length > 0}
          />
          <Step
            n={3}
            title="Book a consultation when you want a person"
            body="A case is opened by a counsellor after that conversation. Everything before it is free and stays free."
            done={false}
          />
        </div>
        <p className="border-t border-line px-6 py-4 text-[0.8125rem] leading-relaxed text-grey">
          {progress.answered} of {progress.total} questions answered. An unanswered question
          produces a &ldquo;cannot tell&rdquo; row rather than a guess, so a half-finished
          profile is still worth having.
        </p>
      </Panel>

      <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr] lg:items-start">
        <div className="grid content-start gap-6">
          <OnboardingForm profile={profile} />

          {results.length > 0 && guide && (
            <Panel
              title={`Where you stand for ${guide.country}`}
              description="Run against the published requirements on the destination guide, with the source named on every row. Counts, never a score, and never a probability of admission."
            >
              <div className="grid grid-cols-3 gap-3 px-6 pt-5">
                {(["met", "not-met", "unknown"] as CheckState[]).map((state) => (
                  <div
                    key={state}
                    className={cn("rounded-card px-4 py-3", stateMeta[state].bg)}
                  >
                    <p className={cn("text-[0.75rem] font-medium", stateMeta[state].text)}>
                      {stateMeta[state].label}
                    </p>
                    <p
                      className={cn(
                        "figures mt-0.5 text-[1.5rem] font-bold leading-none",
                        stateMeta[state].text,
                      )}
                    >
                      {counts[state]}
                    </p>
                  </div>
                ))}
              </div>

              <ul className="divide-y divide-line px-6 py-5">
                {results.map((row) => {
                  const meta = stateMeta[row.state];
                  const Icon = meta.icon;
                  return (
                    <li key={row.id} className="flex gap-3.5 py-4 first:pt-0 last:pb-0">
                      <Icon
                        size={17}
                        weight="fill"
                        aria-hidden
                        className={cn("mt-0.5 shrink-0", meta.text)}
                      />
                      <div className="min-w-0">
                        <p className="text-[0.9375rem] font-medium text-blue-dark">{row.title}</p>
                        <p className="mt-1 text-[0.875rem] leading-relaxed text-grey">
                          {row.reason}
                        </p>
                        {row.action && (
                          <p className="mt-1.5 text-[0.8125rem] leading-relaxed text-grey">
                            {row.action}
                          </p>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>

              <p className="border-t border-line px-6 py-4 text-[0.8125rem] leading-relaxed text-grey">
                The same checklist runs without an account at{" "}
                <Link
                  href={`/tools/requirements-check?destination=${guide.slug}`}
                  className="font-medium text-pink hover:text-blue-dark"
                >
                  /tools/requirements-check
                </Link>
                . Signing in does not unlock anything here, and it is not meant to.
              </p>
            </Panel>
          )}
        </div>

        <div className="grid content-start gap-6">
          <Panel
            title="What to do next"
            description="Derived from what your profile is actually missing, not a welcome list."
          >
            <ol className="divide-y divide-line">
              {steps.map((step, index) => (
                <li key={step.title} className="px-6 py-5">
                  <div className="flex gap-3.5">
                    <span
                      aria-hidden
                      className="figures mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-blue-light text-[0.75rem] font-semibold text-blue-dark"
                    >
                      {index + 1}
                    </span>
                    <div className="min-w-0">
                      <p className="text-[0.9375rem] font-medium text-blue-dark">{step.title}</p>
                      <p className="mt-1 text-[0.875rem] leading-relaxed text-grey">
                        {step.body}
                      </p>
                      {step.href && (
                        <Link
                          href={step.href}
                          className="group mt-2 inline-flex items-center gap-1.5 text-[0.875rem] font-medium text-pink hover:text-blue-dark"
                        >
                          {step.hrefLabel}
                          <ArrowRight
                            size={14}
                            weight="bold"
                            aria-hidden
                            className="transition-transform group-hover:translate-x-0.5"
                          />
                        </Link>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          </Panel>

          <Panel
            title="What an account does not do"
            description="Stated because most platforms leave it to be discovered."
          >
            <ul className="divide-y divide-line">
              {[
                "It does not unlock a calculator. Every tool on this site works signed out and always will.",
                "It does not change what we charge, and there is no member price.",
                "It does not put you in a queue. A case is opened after a consultation, by a person.",
                "It does not send your details to a university, a lender or anyone else. Nothing leaves this account without a consent you gave for a named recipient.",
              ].map((line) => (
                <li key={line} className="px-6 py-3.5 text-[0.875rem] leading-relaxed text-grey">
                  {line}
                </li>
              ))}
            </ul>
          </Panel>
        </div>
      </div>
    </div>
  );
}

function Step({
  n,
  title,
  body,
  done,
}: {
  n: number;
  title: string;
  body: string;
  done: boolean;
}) {
  return (
    <div>
      <span
        aria-hidden
        className={cn(
          "figures grid h-8 w-8 place-items-center rounded-full text-[0.8125rem] font-semibold",
          done ? "bg-verified-bg text-verified" : "bg-blue-light text-blue-dark",
        )}
      >
        {done ? <CheckCircle size={17} weight="fill" /> : n}
      </span>
      <p className="mt-3 text-[0.9375rem] font-semibold text-blue-dark">{title}</p>
      <p className="mt-1.5 text-[0.875rem] leading-relaxed text-grey">{body}</p>
    </div>
  );
}
