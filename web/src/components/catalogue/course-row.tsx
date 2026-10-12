import Link from "next/link";
import Image from "next/image";
import { WarningDiamond } from "@phosphor-icons/react/ssr";
import {
  type CourseSummary,
  feeValue,
  formatDay,
  formatFee,
  formatLakh,
  nextDeadline,
} from "@/content/catalogue/query";
import { STATUS_LABEL, STATUS_TONE } from "@/content/types";
import { SaveToShortlist } from "@/components/catalogue/save-button";
import { cn } from "@/lib/cn";

const intakeTone = {
  open: "bg-verified",
  "closing-soon": "bg-pink",
  closed: "bg-denied",
  "not-yet-open": "bg-line-strong",
} as const;

const intakeLabel = {
  open: "open",
  "closing-soon": "closing soon",
  closed: "closed",
  "not-yet-open": "not yet open",
} as const;

const earnTone = {
  verified: "text-verified",
  pending: "text-pending",
  denied: "text-denied",
  neutral: "text-neutral-chip",
} as const;

/**
 * One course in the list: a single row, read left to right like a line of a
 * comparison table, with the course name stretched over the whole row as its
 * link. What we earn sits under the name on every row, in the same type as the
 * place, because it is the same kind of fact. The save control floats above
 * the stretched link so it stays its own target.
 */
export function CourseRow({
  course,
  rates,
  today,
  saved,
  returnTo,
  onSavedChange,
}: {
  course: CourseSummary;
  rates: Record<"GBP" | "EUR", number>;
  today: string;
  saved: boolean;
  returnTo: string;
  onSavedChange?: (slug: string, saved: boolean) => void;
}) {
  const fee = feeValue(course.feePerYear);
  const deadline = nextDeadline(course, today);
  const intake = deadline
    ? course.intakes.find((item) => item.applicationDeadline === deadline)
    : course.intakes[0];
  const href = `/universities/${course.university.slug}/${course.slug}`;
  const commission = course.university.commission;
  const zero = commission.highInr === 0;

  return (
    <li className="Course-row">
      <div className="Course-row__main">
        <h3 className="Course-row__title">
          <Link href={href} className="Course-row__link">
            {course.name}
          </Link>
        </h3>
        <p className="Course-row__place">
          <span>{course.university.name}</span>
          <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
            {course.university.city}
            <Image
              src={`https://flagcdn.com/w40/${course.university.flagCode}.png`}
              alt=""
              width={20}
              height={15}
              unoptimized
              className="h-3 w-auto rounded-xs ring-1 ring-line"
            />
          </span>
        </p>
        <p className="Course-row__earn">
          <span className={cn("font-semibold", zero ? "text-verified" : "text-blue-dark")}>
            We earn <span className="figures">{commission.display}</span>
          </span>
          <span className={earnTone[STATUS_TONE[commission.status]]}>
            {STATUS_LABEL[commission.status]}
          </span>
          {commission.aboveAverage && (
            <span className="inline-flex items-center gap-1 text-pending">
              <WarningDiamond size={13} weight="fill" aria-hidden />
              Above category average
            </span>
          )}
        </p>
      </div>

      <dl className="Course-row__facts">
        <div>
          <dt className="lg:sr-only">Tuition a year</dt>
          <dd className="Course-row__value figures">
            {fee === null ? "Not published" : formatFee(fee, course.currency)}
          </dd>
          <dd className="Course-row__note figures">
            {fee === null
              ? "See the course page"
              : fee === 0
                ? "Semester fee only"
                : `≈ ${formatLakh(fee * rates[course.currency])}`}
          </dd>
        </div>
        <div>
          <dt className="lg:sr-only">Length</dt>
          <dd className="Course-row__value figures">{course.durationMonths} months</dd>
          <dd className="Course-row__note">{course.languageOfInstruction}</dd>
        </div>
        <div>
          <dt className="lg:sr-only">Next deadline</dt>
          <dd className="Course-row__value figures">
            {deadline ? formatDay(deadline) : "None ahead"}
          </dd>
          {intake && (
            <dd className="Course-row__note">
              <span aria-hidden className={cn("Course-row__dot", intakeTone[intake.status])} />
              {intake.name}, {intakeLabel[intake.status]}
            </dd>
          )}
        </div>
      </dl>

      <SaveToShortlist
        programmeSlug={course.slug}
        saved={saved}
        returnTo={returnTo}
        compact
        courseName={course.name}
        onChange={(next) => onSavedChange?.(course.slug, next)}
        className="Course-row__save"
      />
    </li>
  );
}
