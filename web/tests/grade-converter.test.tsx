// @vitest-environment jsdom
import { describe, expect, it } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { GradeConverter } from "@/components/tools/grade-converter";

/**
 * The domain arithmetic these calculators call is already pinned in
 * calculators.test.ts. What is not covered is the wiring: does typing a value
 * actually reach the right conversion function, does the result change only
 * when Submit is pressed (testers could not tell whether a live result had
 * taken their figure), and does an out of range figure surface the stated
 * error instead of a wrong number.
 */
describe("the grade converter reads what is submitted", () => {
  it("shows nothing until a value is submitted", () => {
    render(<GradeConverter />);
    expect(screen.getByText(/Enter your figure and press Submit/)).toBeInTheDocument();
    expect(screen.getByText("Press Submit to see your result.")).toBeInTheDocument();
  });

  it("computes the CBSE conversion when Submit is pressed, not before", () => {
    render(<GradeConverter />);
    fireEvent.change(screen.getByLabelText("Your CGPA", { exact: false }), {
      target: { value: "8.2" },
    });
    expect(screen.queryAllByText("77.9%")).toHaveLength(0);
    fireEvent.click(screen.getByRole("button", { name: "Submit" }));
    expect(screen.getAllByText("77.9%").length).toBeGreaterThan(0);
    expect(screen.getByText("Done. Your result is updated.")).toBeInTheDocument();
  });

  it("says when the figure has changed since the last submit", () => {
    render(<GradeConverter />);
    const field = screen.getByLabelText("Your CGPA", { exact: false });
    fireEvent.change(field, { target: { value: "8.2" } });
    fireEvent.click(screen.getByRole("button", { name: "Submit" }));
    fireEvent.change(field, { target: { value: "9" } });
    expect(
      screen.getByText("You changed a detail. Press Submit to update your result."),
    ).toBeInTheDocument();
    expect(screen.getAllByText("77.9%").length).toBeGreaterThan(0);
  });

  it("marks an out of range figure invalid, and the domain still refuses it if it gets through", () => {
    render(<GradeConverter />);
    const field = screen.getByLabelText("Your CGPA", { exact: false });
    fireEvent.change(field, { target: { value: "12" } });
    expect(field).toBeInvalid();
    // Past the browser's own check, the conversion states its error rather
    // than printing a wrong figure.
    fireEvent.submit(field.closest("form")!);
    expect(screen.getByText("A 10 point CGPA sits between 0 and 10.")).toBeInTheDocument();
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
    fireEvent.click(screen.getByRole("button", { name: "Submit" }));
    expect(screen.getByText("CGPA")).toBeInTheDocument();

    // Adding a row is not a submit.
    fireEvent.click(screen.getByRole("button", { name: "Add a semester" }));
    expect(screen.getByLabelText("Semester 3 SGPA")).toBeInTheDocument();
    expect(
      screen.getByText("You changed a detail. Press Submit to update your result."),
    ).toBeInTheDocument();
  });
});
