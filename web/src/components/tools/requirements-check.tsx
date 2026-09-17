"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { CheckCircle, Question, XCircle } from "@phosphor-icons/react";
import { guides } from "@/content/guides";
import {
  runChecklist,
  tally,
  type CheckResult,
  type CheckState,
  type Profile,
} from "@/domain/eligibility";
import { cgpaToPercentage } from "@/domain/calculators";
import { cn } from "@/lib/cn";

const stateMeta: Record<
  CheckState,
  { label: string; icon: typeof CheckCircle; text: string; bg: string; border: string }
> = {
  met: {
    label: "Met",
    icon: CheckCircle,
    text: "text-verified",
    bg: "bg-verified-bg",
    border: "border-verified/25",
  },
  "not-met": {
    label: "Not met yet",
    icon: XCircle,
    text: "text-denied",
    bg: "bg-denied-bg",
    border: "border-denied/25",
  },
  unknown: {
    label: "Cannot tell",
    icon: Question,
    text: "text-pending",
    bg: "bg-pending-bg",
    border: "border-pending/25",
  },
};

const groups: CheckResult["group"][] = ["Academic", "Language", "Money", "Process", "Timing"];

/**
 * The requirements checklist.
 *
 * Three states per row, and no fourth. The thing this deliberately does not do
 * is the thing every competitor's version of it does: turn the row states into
 * a percentage, a score or a chance of admission. A count of met rows is not a
 * probability of anything, so the counts are printed as counts and the copy
 * says so.
 *
 * Nothing here is submitted. There is no form action, no fetch and no signup,
 * and the answer appears as you type.
 */
export function RequirementsCheck({ initialDestination }: { initialDestination?: string }) {
  const [destination, setDestination] = useState(
    guides.some((guide) => guide.slug === initialDestination)
      ? (initialDestination as string)
      : guides[0].slug,
  );
  const [scale, setScale] = useState<"percentage" | "cgpa">("cgpa");
  const [grade, setGrade] = useState("");
  const [applyingFor, setApplyingFor] = useState<"" | "bachelors" | "masters">("masters");
  const [duration, setDuration] = useState<"" | "3" | "4">("");
  const [subjectGroup, setSubjectGroup] = useState<Profile["subjectGroup"] | "">("");
  const [testName, setTestName] = useState("IELTS");
  const [overall, setOverall] = useState("");
  const [lowestSection, setLowestSection] = useState("");
  const [fundsLakh, setFundsLakh] = useState("");
  const [fundsHeldMonths, setFundsHeldMonths] = useState("");
  const [apsStatus, setApsStatus] = useState<Profile["apsStatus"] | "">("");
  const [apsEarly, setApsEarly] = useState(false);
  const [irishLevel, setIrishLevel] = useState<"" | "8" | "9">("");
  const [germanLevel, setGermanLevel] = useState<Profile["germanLevel"] | "">("");

  const percentage = useMemo(() => {
    if (grade.trim() === "") return undefined;
    const value = Number(grade);
    if (!Number.isFinite(value)) return undefined;
    if (scale === "percentage") return value;
    const converted = cgpaToPercentage(value);
    return "error" in converted ? undefined : converted.value;
  }, [grade, scale]);

  const profile: Profile = {
    destination,
    applyingFor: applyingFor === "" ? undefined : applyingFor,
    degreeDurationYears: duration === "" ? undefined : (Number(duration) as 3 | 4),
    percentage,
    subjectGroup: subjectGroup === "" ? undefined : subjectGroup,
    englishTest:
      overall.trim() === ""
        ? undefined
        : {
            name: testName,
            overall: Number(overall),
            lowestSection: lowestSection.trim() === "" ? undefined : Number(lowestSection),
          },
    fundsInr: fundsLakh.trim() === "" ? undefined : Number(fundsLakh) * 100000,
    fundsHeldMonths: fundsHeldMonths.trim() === "" ? undefined : Number(fundsHeldMonths),
    apsStatus: apsStatus === "" ? undefined : apsStatus,
    apsRegisteredBefore29June2026: apsEarly,
    irishLevel: irishLevel === "" ? undefined : (Number(irishLevel) as 8 | 9),
    germanLevel: germanLevel === "" ? undefined : germanLevel,
  };

  const results = runChecklist(profile);
  const counts = tally(results);
  const guide = guides.find((item) => item.slug === destination)!;

  return (
    <div className="grid gap-8 lg:grid-cols-[24rem_minmax(0,1fr)] lg:items-start lg:gap-10">
      <form
        className="rounded-panel border border-line bg-white p-6 md:p-7"
        onSubmit={(event) => event.preventDefault()}
      >
        <fieldset>
          <legend className="text-[0.875rem] font-semibold text-blue-dark">Destination</legend>
          <div className="mt-3 flex flex-wrap gap-2">
            {guides.map((option) => (
              <button
                key={option.slug}
                type="button"
                onClick={() => setDestination(option.slug)}
                aria-pressed={option.slug === destination}
                className={cn(
                  "button",
                  option.slug === destination
                    ? "button--selected"
                    : "button--light",
                )}
              >
                {option.country}
              </button>
            ))}
          </div>
        </fieldset>

        <fieldset className="mt-7 space-y-4 border-t border-line pt-6">
          <legend className="text-[0.875rem] font-semibold text-blue-dark">Your academics</legend>

          <Select
            label="Applying for"
            value={applyingFor}
            onChange={(value) => setApplyingFor(value as typeof applyingFor)}
            options={[
              { value: "", label: "Not sure yet" },
              { value: "masters", label: "A Master's" },
              { value: "bachelors", label: "A Bachelor's" },
            ]}
          />

          <div>
            <span className="block text-[0.875rem] font-medium text-blue-dark">Your result</span>
            <div className="mt-2 flex gap-2">
              <select
                value={scale}
                onChange={(event) => setScale(event.target.value as typeof scale)}
                aria-label="Result scale"
                className="w-32 shrink-0 rounded-card border border-line-strong bg-white px-3 py-2.5 text-[0.9375rem] text-blue-dark"
              >
                <option value="cgpa">CGPA / 10</option>
                <option value="percentage">Percentage</option>
              </select>
              <input
                type="number"
                inputMode="decimal"
                min={0}
                max={scale === "cgpa" ? 10 : 100}
                step={0.01}
                value={grade}
                onChange={(event) => setGrade(event.target.value)}
                placeholder={scale === "cgpa" ? "8.2" : "76"}
                className="figures w-full rounded-card border border-line-strong px-3.5 py-2.5 text-blue-dark"
              />
            </div>
            {scale === "cgpa" && percentage !== undefined && (
              <p className="mt-1.5 text-[0.8125rem] text-grey">
                Converted at the CBSE 9.5 convention to{" "}
                <span className="figures">{percentage}%</span>. Your university&rsquo;s own
                conversion governs.
              </p>
            )}
          </div>

          <Select
            label="Bachelor's length"
            value={duration}
            onChange={(value) => setDuration(value as typeof duration)}
            options={[
              { value: "", label: "Not stated" },
              { value: "3", label: "Three years" },
              { value: "4", label: "Four years" },
            ]}
          />

          {destination === "germany" && (
            <Select
              label="Subject group"
              hint="This decides whether the dMAT applies to you."
              value={subjectGroup ?? ""}
              onChange={(value) => setSubjectGroup(value as typeof subjectGroup)}
              options={[
                { value: "", label: "Not stated" },
                { value: "engineering", label: "Engineering" },
                {
                  value: "commerce-business-finance-economics",
                  label: "Commerce, Business, Finance or Economics",
                },
                { value: "other", label: "Something else" },
              ]}
            />
          )}

          {destination === "ireland" && (
            <Select
              label="Programme NFQ level"
              hint="Level 9 is a taught Master's. Level 8 is an honours bachelor."
              value={irishLevel}
              onChange={(value) => setIrishLevel(value as typeof irishLevel)}
              options={[
                { value: "", label: "Not stated" },
                { value: "9", label: "Level 9 or higher" },
                { value: "8", label: "Level 8" },
              ]}
            />
          )}
        </fieldset>

        <fieldset className="mt-7 space-y-4 border-t border-line pt-6">
          <legend className="text-[0.875rem] font-semibold text-blue-dark">Language</legend>
          <div className="flex gap-2">
            <select
              value={testName}
              onChange={(event) => setTestName(event.target.value)}
              aria-label="English test"
              className="w-32 shrink-0 rounded-card border border-line-strong bg-white px-3 py-2.5 text-[0.9375rem] text-blue-dark"
            >
              {["IELTS", "TOEFL", "PTE", "Duolingo"].map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
            <input
              type="number"
              inputMode="decimal"
              step={0.5}
              value={overall}
              onChange={(event) => setOverall(event.target.value)}
              placeholder="Overall"
              aria-label="Overall score"
              className="figures w-full rounded-card border border-line-strong px-3.5 py-2.5 text-blue-dark"
            />
          </div>
          <input
            type="number"
            inputMode="decimal"
            step={0.5}
            value={lowestSection}
            onChange={(event) => setLowestSection(event.target.value)}
            placeholder="Your lowest section score"
            aria-label="Lowest section score"
            className="figures w-full rounded-card border border-line-strong px-3.5 py-2.5 text-blue-dark"
          />

          {destination === "germany" && (
            <Select
              label="German level"
              value={germanLevel ?? ""}
              onChange={(value) => setGermanLevel(value as typeof germanLevel)}
              options={[
                { value: "", label: "Not stated" },
                { value: "none", label: "None yet" },
                { value: "a1-a2", label: "A1 to A2" },
                { value: "b1", label: "B1" },
                { value: "b2", label: "B2" },
                { value: "c1-c2", label: "C1 to C2" },
              ]}
            />
          )}
        </fieldset>

        <fieldset className="mt-7 space-y-4 border-t border-line pt-6">
          <legend className="text-[0.875rem] font-semibold text-blue-dark">Money</legend>
          <label className="block">
            <span className="block text-[0.875rem] font-medium text-blue-dark">
              What you can evidence
            </span>
            <span className="mt-0.5 block text-[0.8125rem] leading-snug text-grey">
              In lakh. Savings, family funds you can document, or a sanctioned loan.
            </span>
            <span className="mt-2 flex items-center gap-2">
              <input
                type="number"
                inputMode="decimal"
                min={0}
                step={0.5}
                value={fundsLakh}
                onChange={(event) => setFundsLakh(event.target.value)}
                placeholder="15"
                className="figures w-full rounded-card border border-line-strong px-3.5 py-2.5 text-blue-dark"
              />
              <span className="shrink-0 text-[0.875rem] text-grey">lakh</span>
            </span>
          </label>
          <label className="block">
            <span className="block text-[0.875rem] font-medium text-blue-dark">
              How long it has been in the account
            </span>
            <span className="mt-0.5 block text-[0.8125rem] leading-snug text-grey">
              In months. This is what the UK 28 day rule and the Irish six month rule read.
            </span>
            <span className="mt-2 flex items-center gap-2">
              <input
                type="number"
                inputMode="numeric"
                min={0}
                step={1}
                value={fundsHeldMonths}
                onChange={(event) => setFundsHeldMonths(event.target.value)}
                placeholder="6"
                className="figures w-full rounded-card border border-line-strong px-3.5 py-2.5 text-blue-dark"
              />
              <span className="shrink-0 text-[0.875rem] text-grey">months</span>
            </span>
          </label>
        </fieldset>

        {destination === "germany" && (
          <fieldset className="mt-7 space-y-4 border-t border-line pt-6">
            <legend className="text-[0.875rem] font-semibold text-blue-dark">APS</legend>
            <Select
              label="Where your APS application stands"
              value={apsStatus ?? ""}
              onChange={(value) => setApsStatus(value as typeof apsStatus)}
              options={[
                { value: "", label: "Not stated" },
                { value: "not-started", label: "Not started" },
                { value: "in-progress", label: "In progress" },
                { value: "issued", label: "Certificate issued" },
              ]}
            />
            <label className="flex items-start gap-2.5">
              <input
                type="checkbox"
                checked={apsEarly}
                onChange={(event) => setApsEarly(event.target.checked)}
                className="mt-1 h-4 w-4 shrink-0 accent-[var(--color-blue-dark)]"
              />
              <span className="text-[0.875rem] leading-snug text-grey">
                I registered with APS India before 29 June 2026
                <span className="mt-0.5 block text-[0.8125rem] text-grey">
                  This is the transitional exemption from the dMAT.
                </span>
              </span>
            </label>
          </fieldset>
        )}

        <p className="mt-7 border-t border-line pt-6 text-[0.8125rem] leading-relaxed text-grey">
          Nothing on this form is submitted anywhere. It runs in your browser, there is no
          account behind it, and the answer changes as you type. Leave a field blank and the
          row it feeds says we cannot tell rather than guessing.
        </p>
      </form>

      <div className="min-w-0 space-y-6">
        <div className="rounded-panel border border-line bg-white p-6 md:p-7">
          <h2 className="text-blue-dark h--5">
            {guide.country}: {results.length} requirements checked
          </h2>
          <dl className="mt-5 grid grid-cols-3 gap-3">
            {(["met", "not-met", "unknown"] as CheckState[]).map((state) => {
              const meta = stateMeta[state];
              return (
                <div
                  key={state}
                  className={cn("rounded-card border p-4", meta.border, meta.bg)}
                >
                  <dt className={cn("text-[0.8125rem] font-medium", meta.text)}>{meta.label}</dt>
                  <dd className={cn("figures mt-1 text-[1.75rem] font-bold leading-none", meta.text)}>
                    {counts[state]}
                  </dd>
                </div>
              );
            })}
          </dl>
          <p className="mt-5 text-[0.875rem] leading-relaxed text-grey">
            These are counts, not a score. Nothing on this page converts them into a
            percentage or a chance of admission, because a count of met requirements is not
            a probability of anything and publishing one as if it were is the single most
            common dishonesty in this industry.
          </p>
          <p className="mt-3 text-[0.875rem] leading-relaxed text-grey">
            Every figure the rows below check against is on the{" "}
            <Link
              href={`/destinations/${guide.slug}`}
              className="font-medium text-pink hover:text-blue-dark"
            >
              {guide.country} guide
            </Link>
            , with its official source named. Written into the site on{" "}
            <span className="figures">{guide.verification.statedOn}</span> and not since
            re-checked by a named person.
          </p>
        </div>

        {groups.map((group) => {
          const rows = results.filter((item) => item.group === group);
          if (rows.length === 0) return null;
          return (
            <section key={group}>
              <h3 className="eyebrow text-grey">
                {group}
              </h3>
              <ul className="mt-3 space-y-3">
                {rows.map((row) => {
                  const meta = stateMeta[row.state];
                  const Icon = meta.icon;
                  return (
                    <li
                      key={row.id}
                      className="rounded-card border border-line bg-white p-5 md:p-6"
                    >
                      <div className="flex items-start gap-3.5">
                        <Icon
                          size={19}
                          weight="fill"
                          aria-hidden
                          className={cn("mt-0.5 shrink-0", meta.text)}
                        />
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                            <h4 className="text-blue-dark h--6">
                              {row.title}
                            </h4>
                            <span
                              className={cn(
                                "rounded-input px-2 py-0.5 text-[0.6875rem] font-medium",
                                meta.bg,
                                meta.text,
                              )}
                            >
                              {meta.label}
                            </span>
                          </div>
                          <p className="mt-2 text-[0.9375rem] leading-relaxed text-grey">
                            {row.reason}
                          </p>
                          {row.action && (
                            <p className="mt-2.5 rounded-card bg-light px-3.5 py-2.5 text-[0.875rem] leading-relaxed text-grey">
                              <span className="font-medium text-blue-dark">What to do.</span>{" "}
                              {row.action}
                            </p>
                          )}
                          <p className="mt-2.5 text-[0.8125rem] text-grey">
                            Source: {row.source}
                          </p>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </section>
          );
        })}
      </div>
    </div>
  );
}

function Select({
  label,
  hint,
  value,
  onChange,
  options,
}: {
  label: string;
  hint?: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <label className="block">
      <span className="block text-[0.875rem] font-medium text-blue-dark">{label}</span>
      {hint && <span className="mt-0.5 block text-[0.8125rem] leading-snug text-grey">{hint}</span>}
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 w-full rounded-card border border-line-strong bg-white px-3.5 py-2.5 text-[0.9375rem] text-blue-dark"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}
