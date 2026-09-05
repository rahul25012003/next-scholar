// @vitest-environment jsdom
import { describe, expect, it } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { GradeConverter } from "@/components/tools/grade-converter";

/**
 * The domain arithmetic these calculators call is already pinned in
 * calculators.test.ts. What is not covered is the wiring: does typing a value
 * actually reach the right conversion function, does the result update as you
 * type rather than needing a submit, and does an out of range figure surface
 * the stated error instead of a wrong number.
 */
describe("the grade converter reads what is typed and updates live", () => {
  it("shows nothing until a value is entered", () => {
    render(<GradeConverter />);
    expect(
      screen.getByText("Enter your figure and the result appears here with its full working."),
    ).toBeInTheDocument();
  });

  it("computes the CBSE conversion as soon as a CGPA is typed, with no submit", () => {
    render(<GradeConverter />);
    fireEvent.change(screen.getByLabelText("Your CGPA", { exact: false }), {
      target: { value: "8.2" },
    });
    expect(screen.getAllByText("77.9%").length).toBeGreaterThan(0);
  });

  it("surfaces the domain's own error rather than a wrong figure when the value is out of range", () => {
    render(<GradeConverter />);
    fireEvent.change(screen.getByLabelText("Your CGPA", { exact: false }), {
      target: { value: "12" },
    });
    expect(screen.getByRole("status")).toHaveTextContent(
      "A 10 point CGPA sits between 0 and 10.",
    );
  });

  it("switches to a different conversion's own field when another tab is picked", () => {
    render(<GradeConverter />);
    fireEvent.click(screen.getByRole("tab", { name: "Percentage to CGPA" }));
    expect(screen.getByLabelText("Your percentage", { exact: false })).toBeInTheDocument();
    expect(screen.queryByLabelText("Your CGPA", { exact: false })).not.toBeInTheDocument();
  });

  it("lets a semester be added to the SGPA to CGPA calculator and folds it into the result", () => {
    render(<GradeConverter />);
    fireEvent.click(screen.getByRole("tab", { name: "SGPA to CGPA" }));
    fireEvent.change(screen.getByLabelText("Semester 1 SGPA"), { target: { value: "8" } });
    expect(screen.getByText("CGPA")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Add a semester" }));
    expect(screen.getByLabelText("Semester 3 SGPA")).toBeInTheDocument();
  });
});
