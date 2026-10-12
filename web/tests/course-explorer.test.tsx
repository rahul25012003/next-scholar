// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { CourseExplorer } from "@/components/catalogue/course-explorer";
import {
  applyFilters,
  courseSummaries,
  emptyFilters,
  filtersFromParams,
  type Filters,
} from "@/content/catalogue";

vi.mock("@/app/actions/shortlist", () => ({
  toggleShortlistEntry: async () => ({ status: "signed-out" }),
}));

afterEach(cleanup);

const courses = courseSummaries();
const destinations = [
  { slug: "united-kingdom", country: "United Kingdom", flagCode: "gb" },
  { slug: "germany", country: "Germany", flagCode: "de" },
  { slug: "ireland", country: "Ireland", flagCode: "ie" },
];

function renderExplorer(initialFilters: Filters = emptyFilters, sort = "name") {
  return render(
    <CourseExplorer
      courses={courses}
      destinations={destinations}
      subjects={[...new Set(courses.flatMap((course) => course.disciplines))].sort()}
      initialFilters={initialFilters}
      initialSort={sort}
      saved={[]}
      rates={{ GBP: 118, EUR: 101 }}
      ratesTakenOn="2026-09-03"
      today="2026-10-12"
    />,
  );
}

const rowCount = () => screen.queryAllByRole("listitem").filter((item) => item.classList.contains("Course-row")).length;

/**
 * The course list filters in the browser, so the checks here are the ones a
 * student would make: does typing narrow the list at once, does a destination
 * tab do what it says, can a filter be taken off again, and does an empty
 * result say how to get courses back.
 */
describe("the course list", () => {
  it("shows every course before anything is chosen", () => {
    renderExplorer();
    expect(rowCount()).toBe(courses.length);
  });

  it("narrows on each word typed, across course, country and subject", () => {
    renderExplorer();
    fireEvent.change(screen.getByRole("searchbox", { name: "Search courses" }), {
      target: { value: "data science germany" },
    });
    const expected = applyFilters(courses, { ...emptyFilters, query: "data science germany" });
    expect(expected.length).toBeGreaterThan(0);
    expect(expected.every((course) => course.university.destination === "germany")).toBe(true);
    expect(rowCount()).toBe(expected.length);
  });

  it("does not let a short word match inside another one", () => {
    const hits = applyFilters(courses, { ...emptyFilters, query: "cs" });
    expect(hits.some((course) => /analytics/i.test(course.name) && !/computer/i.test(course.disciplines.join(" ")))).toBe(false);
  });

  it("filters to one country from its tab, and marks the tab", () => {
    renderExplorer();
    const nav = screen.getByRole("navigation", { name: "Destination" });
    fireEvent.click(within(nav).getByRole("link", { name: /Ireland/ }));
    const irish = courses.filter((course) => course.university.destination === "ireland");
    expect(rowCount()).toBe(irish.length);
    expect(within(nav).getByRole("link", { name: /Ireland/ })).toHaveAttribute("aria-current", "true");
  });

  it("lists each active filter as a chip that takes it off again", () => {
    renderExplorer(filtersFromParams({ destination: "germany", zeroCommission: "1" }));
    const before = rowCount();
    fireEvent.click(screen.getByRole("link", { name: "Remove filter: Pays us nothing" }));
    expect(rowCount()).toBeGreaterThanOrEqual(before);
    expect(screen.queryByRole("link", { name: "Remove filter: Pays us nothing" })).toBeNull();
  });

  it("offers the way back from an empty list, with how many it would bring", () => {
    renderExplorer({ ...emptyFilters, destinations: ["ireland"], zeroCommissionOnly: true });
    expect(rowCount()).toBe(0);
    expect(screen.getByText("No course matches all of that")).toBeInTheDocument();
    expect(screen.getAllByRole("link", { name: /^Remove “.+” to see \d+$/ }).length).toBeGreaterThan(0);
  });

  it("keeps a plain GET form behind the controls, so a filtered list is a real URL", () => {
    const { container } = renderExplorer();
    const form = screen.getByRole("form", { name: "Find a course" });
    expect(form).toHaveAttribute("method", "get");
    expect(form).toHaveAttribute("action", "/universities");
    const search = container.querySelector<HTMLInputElement>("input[name=q]");
    expect(search?.getAttribute("form")).toBe(form.id);
  });

  it("puts the filtered list in the address bar as the controls change", () => {
    renderExplorer();
    fireEvent.change(screen.getByRole("searchbox", { name: "Search courses" }), {
      target: { value: "berlin" },
    });
    expect(window.location.search).toContain("q=berlin");
  });
});
