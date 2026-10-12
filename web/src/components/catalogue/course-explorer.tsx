"use client";

import { useDeferredValue, useEffect, useId, useMemo, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  BookmarkSimple,
  FunnelSimple,
  MagnifyingGlass,
  X,
} from "@phosphor-icons/react";
import {
  type CourseSummary,
  type Filters,
  activeFilterCount,
  applyFilters,
  emptyFilters,
  paramsFromFilters,
  sortProgrammes,
} from "@/content/catalogue/query";
import { sortOptions } from "@/content/catalogue/types";
import { CourseRow } from "@/components/catalogue/course-row";
import { cn } from "@/lib/cn";

type Destination = { slug: string; country: string; flagCode: string };

/**
 * The course list, filtered in the browser.
 *
 * Fifty-two courses are a few kilobytes, so every filter, the search box and
 * the order apply on the keystroke, with no reload and no loading flash; the
 * address bar follows, so a filtered list is still a link to send someone.
 * The server renders the same component from the URL first, and every control
 * is also a plain GET field or link, so the page works without JavaScript.
 *
 * Each filter is read from one state object and applied together, so no
 * control can quietly clear another.
 */
export function CourseExplorer({
  courses,
  destinations,
  subjects,
  initialFilters,
  initialSort,
  saved: initialSaved,
  rates,
  ratesTakenOn,
  today,
  basePath = "/universities",
}: {
  courses: CourseSummary[];
  destinations: Destination[];
  subjects: string[];
  initialFilters: Filters;
  initialSort: string;
  saved: string[];
  rates: Record<"GBP" | "EUR", number>;
  ratesTakenOn: string;
  today: string;
  /** Where the list lives; a country's own Masters page passes its path. */
  basePath?: string;
}) {
  const formId = useId();
  const [filters, setFilters] = useState(initialFilters);
  const [sort, setSort] = useState(initialSort);
  const [saved, setSaved] = useState(() => new Set(initialSaved));
  const [sheetOpen, setSheetOpen] = useState(false);
  const sheet = useRef<HTMLDialogElement>(null);
  const filterButton = useRef<HTMLButtonElement>(null);

  // Typing stays instant; the list catches up a frame later.
  const query = useDeferredValue(filters.query);
  const live = useMemo(() => ({ ...filters, query }), [filters, query]);

  const rows = useMemo(
    () => sortProgrammes(applyFilters(courses, live), sort, today),
    [courses, live, sort, today],
  );

  // Counts beside each choice answer "what if I pick this", given the rest.
  const destinationCounts = useMemo(() => {
    const pool = applyFilters(courses, { ...live, destinations: [] });
    const counts: Record<string, number> = {};
    for (const row of pool) {
      counts[row.university.destination] = (counts[row.university.destination] ?? 0) + 1;
    }
    return { all: pool.length, ...counts };
  }, [courses, live]);

  const subjectCounts = useMemo(() => {
    const pool = applyFilters(courses, { ...live, disciplines: [] });
    const counts: Record<string, number> = {};
    for (const row of pool) {
      for (const discipline of row.disciplines) {
        counts[discipline] = (counts[discipline] ?? 0) + 1;
      }
    }
    return counts;
  }, [courses, live]);

  const search = useMemo(() => {
    const params = new URLSearchParams(paramsFromFilters(filters));
    if (sort !== "name") params.set("sort", sort);
    return params.toString();
  }, [filters, sort]);

  // The address bar follows the list, replacing rather than stacking history.
  useEffect(() => {
    const target = search ? `?${search}` : "";
    if (window.location.search !== target) {
      window.history.replaceState(window.history.state, "", `${window.location.pathname}${target}`);
    }
  }, [search]);

  useEffect(() => {
    const dialog = sheet.current;
    if (!dialog) return;
    if (sheetOpen && !dialog.open) dialog.showModal();
    if (!sheetOpen && dialog.open) dialog.close();
  }, [sheetOpen]);

  const returnTo = search ? `${basePath}?${search}` : basePath;
  const update = (patch: Partial<Filters>) => setFilters((current) => ({ ...current, ...patch }));
  const hrefFor = (next: Filters) => {
    const params = new URLSearchParams(paramsFromFilters(next));
    if (sort !== "name") params.set("sort", sort);
    const query = params.toString();
    return query ? `${basePath}?${query}` : basePath;
  };

  const chips = activeChips(filters, destinations);
  const activeCount = activeFilterCount(filters);
  const panelCount = activeCount - filters.destinations.length - (filters.query ? 1 : 0);

  const suggestions =
    rows.length > 0
      ? []
      : chips
          .map((chip) => ({ ...chip, count: applyFilters(courses, chip.without).length }))
          .filter((chip) => chip.count > 0)
          .sort((a, b) => b.count - a.count)
          .slice(0, 3);

  const fields = (prefix: string) => (
    <FilterFields
      prefix={prefix}
      formId={formId}
      filters={filters}
      subjects={subjects}
      subjectCounts={subjectCounts}
      update={update}
    />
  );

  return (
    <div className="Explorer">
      {/* Every control below belongs to this form by id, so the layout is free
          to place them and no row's save form ends up nested inside it. */}
      <form
        id={formId}
        method="get"
        action={basePath}
        onSubmit={(event) => event.preventDefault()}
        aria-label="Find a course"
      />

      <div className="Explorer__bar">
        <label className="Explorer__search">
          <MagnifyingGlass size={20} weight="bold" aria-hidden className="shrink-0 text-grey" />
          <span className="sr-only">Search courses</span>
          <input
            type="search"
            name="q"
            form={formId}
            value={filters.query}
            onChange={(event) => update({ query: event.target.value })}
            placeholder="Search a course, university, city or subject"
            autoComplete="off"
            enterKeyHint="search"
          />
          {filters.query && (
            <button
              type="button"
              onClick={() => update({ query: "" })}
              aria-label="Clear the search"
              className="Explorer__clear"
            >
              <X size={16} weight="bold" aria-hidden />
            </button>
          )}
        </label>

        <div className="Explorer__actions">
          <label className="Explorer__sort">
            <span className="sr-only sm:not-sr-only">Order</span>
            <select
              name="sort"
              form={formId}
              value={sort}
              onChange={(event) => setSort(event.target.value)}
            >
              {/* The default order first, then the rest as the catalogue lists them. */}
              {[...sortOptions]
                .sort((a, b) => Number(b.key === "name") - Number(a.key === "name"))
                .map((option) => (
                  <option key={option.key} value={option.key}>
                    {option.label}
                  </option>
                ))}
            </select>
          </label>
          <button
            ref={filterButton}
            type="button"
            onClick={() => setSheetOpen(true)}
            className="Explorer__filters-button lg:hidden"
            aria-haspopup="dialog"
          >
            <FunnelSimple size={17} weight="bold" aria-hidden />
            Filters
            {panelCount > 0 && <span className="Explorer__count figures">{panelCount}</span>}
          </button>
        </div>
      </div>

      {destinations.length > 1 && (
      <nav aria-label="Destination" className="mt-4">
        <ul role="list" className="Explorer__tabs">
          <li>
            <Link
              href={hrefFor({ ...filters, destinations: [] })}
              scroll={false}
              onClick={(event) => {
                event.preventDefault();
                update({ destinations: [] });
              }}
              aria-current={filters.destinations.length === 0 ? "true" : undefined}
              className={cn(
                "button Explorer__tab",
                filters.destinations.length === 0 ? "button--selected" : "button--light",
              )}
            >
              All destinations
              <span className="Explorer__tab-count figures">{destinationCounts.all}</span>
            </Link>
          </li>
          {destinations.map((destination) => {
            const active =
              filters.destinations.length === 1 && filters.destinations[0] === destination.slug;
            const count = (destinationCounts as Record<string, number>)[destination.slug] ?? 0;
            return (
              <li key={destination.slug}>
                <Link
                  href={hrefFor({ ...filters, destinations: [destination.slug] })}
                  scroll={false}
                  onClick={(event) => {
                    event.preventDefault();
                    update({ destinations: [destination.slug] });
                  }}
                  aria-current={active ? "true" : undefined}
                  className={cn("button Explorer__tab", active ? "button--selected" : "button--light")}
                >
                  <Image
                    src={`https://flagcdn.com/w40/${destination.flagCode}.png`}
                    alt=""
                    width={20}
                    height={15}
                    unoptimized
                    className="h-3.5 w-auto rounded-xs"
                  />
                  {destination.country}
                  <span className="Explorer__tab-count figures">{count}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      )}

      <div className="Explorer__body">
        <aside className="Explorer__panel" aria-label="Filters">
          {fields("panel")}
          <noscript>
            <style>{".Explorer__panel{display:block}"}</style>
            <button type="submit" form={formId} className="button mt-6 w-full">
              Apply filters
            </button>
          </noscript>
        </aside>

        <section aria-labelledby={`${formId}-results`} className="min-w-0">
          <div className="Explorer__head">
            <h2 id={`${formId}-results`} className="Explorer__total">
              <span role="status">
                <span className="figures">{rows.length}</span>{" "}
                {rows.length === 1 ? "course" : "courses"}
                {activeCount > 0 && (
                  <span className="Explorer__of">
                    {" "}
                    of <span className="figures">{courses.length}</span>
                  </span>
                )}
              </span>
            </h2>
            {saved.size > 0 && (
              <Link href="/shortlist" className="Explorer__shortlist">
                <BookmarkSimple size={16} weight="fill" aria-hidden />
                Your shortlist <span className="figures">({saved.size})</span>
                <ArrowRight size={14} weight="bold" aria-hidden />
              </Link>
            )}
          </div>

          {chips.length > 0 && (
            <ul role="list" aria-label="Active filters" className="mt-3 flex flex-wrap gap-2">
              {chips.map((chip) => (
                <li key={chip.key}>
                  <Link
                    href={hrefFor(chip.without)}
                    scroll={false}
                    onClick={(event) => {
                      event.preventDefault();
                      setFilters(chip.without);
                    }}
                    className="Explorer__chip"
                    aria-label={`Remove filter: ${chip.label}`}
                  >
                    {chip.label}
                    <X size={13} weight="bold" aria-hidden />
                  </Link>
                </li>
              ))}
              {chips.length > 1 && (
                <li>
                  <Link
                    href={hrefFor(emptyFilters)}
                    scroll={false}
                    onClick={(event) => {
                      event.preventDefault();
                      setFilters(emptyFilters);
                    }}
                    className="Explorer__clear-all"
                  >
                    Clear all
                  </Link>
                </li>
              )}
            </ul>
          )}

          {rows.length === 0 ? (
            <div className="Explorer__empty">
              <h3 className="h--5 text-blue-dark">No course matches all of that</h3>
              <p className="mt-2 max-w-xl text-grey">
                We list <span className="figures">{courses.length}</span> courses here,
                chosen by hand, so an empty list usually means we have not added that
                combination yet.
              </p>
              {suggestions.length > 0 && (
                <ul role="list" className="mt-5 flex flex-wrap gap-2">
                  {suggestions.map((suggestion) => (
                    <li key={suggestion.key}>
                      <Link
                        href={hrefFor(suggestion.without)}
                        scroll={false}
                        onClick={(event) => {
                          event.preventDefault();
                          setFilters(suggestion.without);
                        }}
                        className="button button--light"
                      >
                        Remove “{suggestion.label}” to see{" "}
                        <span className="figures">{suggestion.count}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ) : (
            <>
              <div className="Course-list__columns" aria-hidden>
                <span>Course</span>
                <span>Tuition a year</span>
                <span>Length</span>
                <span>Next deadline</span>
              </div>
              <ul role="list" className="Course-list">
                {rows.map((course) => (
                  <CourseRow
                    key={course.slug}
                    course={course}
                    rates={rates}
                    today={today}
                    saved={saved.has(course.slug)}
                    returnTo={returnTo}
                    onSavedChange={(slug, isSaved) =>
                      setSaved((current) => {
                        const next = new Set(current);
                        if (isSaved) next.add(slug);
                        else next.delete(slug);
                        return next;
                      })
                    }
                  />
                ))}
              </ul>
              <p className="Explorer__footnote">
                Tuition is per year and indicative; each course&rsquo;s own fee page is
                final. Rupee figures use the rate we record by hand, £1 = ₹{rates.GBP} and
                €1 = ₹{rates.EUR}, taken <span className="figures">{ratesTakenOn}</span>.
                &ldquo;We earn&rdquo; is what the university would pay us if you enrol.
              </p>
            </>
          )}
        </section>
      </div>

      <dialog
        ref={sheet}
        className="Explorer__sheet"
        aria-labelledby={`${formId}-sheet`}
        onClose={() => {
          setSheetOpen(false);
          filterButton.current?.focus();
        }}
        onClick={(event) => {
          // A press on the dimmed backdrop, outside the sheet, closes it.
          if (event.target === event.currentTarget) setSheetOpen(false);
        }}
        data-lenis-prevent
      >
        {sheetOpen && (
          <div className="Explorer__sheet-inner">
            <div className="flex items-center justify-between gap-4">
              <h2 id={`${formId}-sheet`} className="h--5 text-blue-dark">
                Filters
              </h2>
              <button
                type="button"
                onClick={() => setSheetOpen(false)}
                aria-label="Close filters"
                className="grid h-11 w-11 place-items-center rounded-full bg-light text-blue-dark"
              >
                <X size={18} weight="bold" aria-hidden />
              </button>
            </div>
            <div className="mt-4">{fields("sheet")}</div>
            <button
              type="button"
              onClick={() => setSheetOpen(false)}
              className="button button--lg mt-6 w-full justify-center px-5"
            >
              Show <span className="figures">{rows.length}</span>{" "}
              {rows.length === 1 ? "course" : "courses"}
            </button>
          </div>
        )}
      </dialog>
    </div>
  );
}

/** The filters beside the list, and inside the sheet on a phone. */
function FilterFields({
  prefix,
  formId,
  filters,
  subjects,
  subjectCounts,
  update,
}: {
  prefix: string;
  formId: string;
  filters: Filters;
  subjects: string[];
  subjectCounts: Record<string, number>;
  update: (patch: Partial<Filters>) => void;
}) {
  // Subjects that still match something come first; the rest stay listed.
  const ordered = [...subjects].sort(
    (a, b) => Number((subjectCounts[b] ?? 0) > 0) - Number((subjectCounts[a] ?? 0) > 0),
  );
  const toggle = (list: string[], value: string, on: boolean) =>
    on ? [...list, value] : list.filter((item) => item !== value);

  return (
    <div className="Explorer__fields">
      <fieldset>
        <legend>Subject</legend>
        <div className="mt-2 space-y-1">
          {ordered.map((subject) => {
            const count = subjectCounts[subject] ?? 0;
            const checked = filters.disciplines.includes(subject);
            return (
              <label
                key={subject}
                className={cn("Explorer__option", count === 0 && !checked && "is-empty")}
              >
                <input
                  type="checkbox"
                  name="discipline"
                  value={subject}
                  form={formId}
                  checked={checked}
                  onChange={(event) =>
                    update({ disciplines: toggle(filters.disciplines, subject, event.target.checked) })
                  }
                />
                <span className="flex-1">{subject}</span>
                <span className="figures text-grey">{count}</span>
              </label>
            );
          })}
        </div>
      </fieldset>

      <fieldset>
        <legend>Highest tuition a year</legend>
        <p className="Explorer__hint">Each in its own currency, never converted.</p>
        <div className="mt-2 grid gap-3">
          <Budget
            id={`${prefix}-gbp`}
            label="UK courses, in £"
            name="maxGbp"
            formId={formId}
            value={filters.maxFeeGbp}
            onChange={(value) => update({ maxFeeGbp: value })}
            placeholder="e.g. 25000"
          />
          <Budget
            id={`${prefix}-eur`}
            label="Germany and Ireland, in €"
            name="maxEur"
            formId={formId}
            value={filters.maxFeeEur}
            onChange={(value) => update({ maxFeeEur: value })}
            placeholder="e.g. 15000"
          />
        </div>
      </fieldset>

      <fieldset>
        <legend>What we earn</legend>
        <div className="mt-2 space-y-1">
          <Toggle
            name="zeroCommission"
            formId={formId}
            label="Only universities that pay us nothing"
            checked={filters.zeroCommissionOnly}
            onChange={(on) => update({ zeroCommissionOnly: on })}
          />
          <Toggle
            name="hideAboveAverage"
            formId={formId}
            label="Hide earnings above the category average"
            checked={filters.hideAboveAverage}
            onChange={(on) => update({ hideAboveAverage: on })}
          />
        </div>
      </fieldset>

      <fieldset>
        <legend>Fees</legend>
        <div className="mt-2">
          <Toggle
            name="publishedFee"
            formId={formId}
            label="Only courses with a published fee"
            checked={filters.publishedFeeOnly}
            onChange={(on) => update({ publishedFeeOnly: on })}
          />
        </div>
      </fieldset>
    </div>
  );
}

function Budget({
  id,
  label,
  name,
  formId,
  value,
  onChange,
  placeholder,
}: {
  id: string;
  label: string;
  name: string;
  formId: string;
  value: number | null;
  onChange: (value: number | null) => void;
  placeholder: string;
}) {
  return (
    <div>
      <label htmlFor={id} className="Explorer__hint block">
        {label}
      </label>
      <input
        id={id}
        type="number"
        inputMode="numeric"
        name={name}
        form={formId}
        min={0}
        step="any"
        value={value ?? ""}
        onChange={(event) =>
          onChange(event.target.value === "" ? null : Math.max(0, Number(event.target.value)))
        }
        placeholder={placeholder}
        className="Explorer__number figures"
      />
    </div>
  );
}

function Toggle({
  name,
  formId,
  label,
  checked,
  onChange,
}: {
  name: string;
  formId: string;
  label: string;
  checked: boolean;
  onChange: (on: boolean) => void;
}) {
  return (
    <label className="Explorer__option">
      <input
        type="checkbox"
        name={name}
        value="1"
        form={formId}
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
      />
      <span className="flex-1">{label}</span>
    </label>
  );
}

/** Each active filter as a removable chip, with the filter set it leaves behind. */
function activeChips(filters: Filters, destinations: Destination[]) {
  const chips: { key: string; label: string; without: Filters }[] = [];
  for (const slug of filters.destinations) {
    chips.push({
      key: `destination-${slug}`,
      label: destinations.find((item) => item.slug === slug)?.country ?? slug,
      without: { ...filters, destinations: filters.destinations.filter((item) => item !== slug) },
    });
  }
  for (const subject of filters.disciplines) {
    chips.push({
      key: `subject-${subject}`,
      label: subject,
      without: { ...filters, disciplines: filters.disciplines.filter((item) => item !== subject) },
    });
  }
  if (filters.maxFeeGbp !== null) {
    chips.push({
      key: "gbp",
      label: `UK up to £${filters.maxFeeGbp.toLocaleString("en-GB")}`,
      without: { ...filters, maxFeeGbp: null },
    });
  }
  if (filters.maxFeeEur !== null) {
    chips.push({
      key: "eur",
      label: `Up to €${filters.maxFeeEur.toLocaleString("en-GB")}`,
      without: { ...filters, maxFeeEur: null },
    });
  }
  if (filters.zeroCommissionOnly) {
    chips.push({
      key: "zero",
      label: "Pays us nothing",
      without: { ...filters, zeroCommissionOnly: false },
    });
  }
  if (filters.hideAboveAverage) {
    chips.push({
      key: "above",
      label: "No above-average earnings",
      without: { ...filters, hideAboveAverage: false },
    });
  }
  if (filters.publishedFeeOnly) {
    chips.push({
      key: "fee",
      label: "Published fee",
      without: { ...filters, publishedFeeOnly: false },
    });
  }
  if (filters.query) {
    chips.push({
      key: "query",
      label: `“${filters.query}”`,
      without: { ...filters, query: "" },
    });
  }
  return chips;
}
