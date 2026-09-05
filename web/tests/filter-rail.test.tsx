// @vitest-environment jsdom
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { FilterRail } from "@/components/catalogue/filters";
import { emptyFilters, filtersFromParams } from "@/content/catalogue";

/**
 * `filtersFromParams`/`paramsFromFilters` already have a pure round trip test
 * in catalogue.test.ts. What that leaves untested is the wiring between a
 * `Filters` object and the actual form the reader sees: whether the right box
 * is checked, the right field carries the right value, and the whole thing is
 * still a plain GET so a filtered result is a real, shareable URL.
 */
describe("the filter rail reflects the filters object it is given", () => {
  it("checks the boxes and fills the fields the active filters name", () => {
    const filters = filtersFromParams({
      destination: "germany",
      level: "masters",
      q: "informatics",
      zeroCommission: "1",
    });
    render(<FilterRail filters={filters} sort="fee-asc" resultCount={3} />);

    expect(screen.getByLabelText("Search")).toHaveValue("informatics");
    expect(screen.getByRole("checkbox", { name: "Germany" })).toBeChecked();
    expect(screen.getByRole("checkbox", { name: "United Kingdom" })).not.toBeChecked();
    expect(screen.getByRole("checkbox", { name: "Master's" })).toBeChecked();
    expect(screen.getByRole("checkbox", { name: "Bachelor's" })).not.toBeChecked();
    expect(
      screen.getByRole("checkbox", { name: "Only institutions that pay us nothing" }),
    ).toBeChecked();
  });

  it("leaves every box unchecked and every field empty on the empty filter set", () => {
    render(<FilterRail filters={emptyFilters} sort="name" resultCount={30} />);
    for (const checkbox of screen.getAllByRole("checkbox")) {
      expect(checkbox).not.toBeChecked();
    }
    expect(screen.getByLabelText("Search")).toHaveValue("");
  });

  it("submits as a plain GET to /universities, so a filtered result is a real URL", () => {
    render(<FilterRail filters={emptyFilters} sort="name" resultCount={30} />);
    const form = screen.getByRole("form", { name: "Filter courses" });
    expect(form).toHaveAttribute("method", "get");
    expect(form).toHaveAttribute("action", "/universities");
  });

  it("names each field with the same key paramsFromFilters writes to the URL", () => {
    const filters = filtersFromParams({ destination: "germany,ireland" });
    render(<FilterRail filters={filters} sort="name" resultCount={5} />);
    const germany = screen.getByRole("checkbox", { name: "Germany" }) as HTMLInputElement;
    expect(germany.name).toBe("destination");
    expect(germany.value).toBe("germany");
  });
});
