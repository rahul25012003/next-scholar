// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { Copilot } from "@/components/app/copilot";
import { OnboardingForm } from "@/components/app/onboarding";
import { emptyOnboarding } from "@/domain/onboarding";
import { CostOfLivingPicker } from "@/components/tools/cost-picker";
import { FilterRail } from "@/components/catalogue/filters";
import { emptyFilters } from "@/content/catalogue";
import { GermanGradeCalculator } from "@/components/tools/german-grade";
import { IntakeForm } from "@/components/marketing/intake-form";
import { cgpaToPercentage, modifiedBavarian, sgpaToCgpa } from "@/domain/calculators";

const drafts = vi.hoisted(() => ["First draft", "Second draft"]);
vi.mock("@/app/actions/case", () => ({
  draftMessage: async () => ({ status: "drafted", draft: drafts.shift(), confidence: "high" }),
}));
vi.mock("@/app/actions/onboarding", () => ({ saveOnboardingProfile: async () => ({ status: "saved" }) }));

afterEach(cleanup);

describe("copilot", () => {
  it("shows a new draft even after the previous one was edited", async () => {
    render(<Copilot caseId="c1" />);
    fireEvent.click(screen.getByRole("button", { name: "Draft it" }));
    const first = await screen.findByDisplayValue("First draft");
    fireEvent.change(first, { target: { value: "First draft, edited" } });
    fireEvent.click(screen.getByRole("button", { name: "Draft it" }));
    expect(await screen.findByDisplayValue("Second draft")).toBeTruthy();
  });
});

describe("onboarding form", () => {
  it("shows the saved result instead of an empty field", () => {
    const { container } = render(<OnboardingForm profile={{ ...emptyOnboarding(), percentage: 77.9 }} />);
    expect(container.querySelector<HTMLInputElement>("input[name=result]")?.value).toBe("77.9");
  });
});

describe("filter rail", () => {
  it("gives each copy of the rail its own field ids, so each label reaches its own input", () => {
    render(
      <>
        <FilterRail filters={emptyFilters} sort="name" resultCount={1} />
        <FilterRail filters={emptyFilters} sort="name" resultCount={1} />
      </>,
    );
    const [first, second] = screen.getAllByText("Search", { selector: "label" }) as HTMLLabelElement[];
    expect(first.control).not.toBeNull();
    expect(first.control).not.toBe(second.control);
  });
});

describe("cost of living picker", () => {
  it("switches destination without crashing on the previous city", () => {
    render(<CostOfLivingPicker />);
    fireEvent.click(screen.getByRole("button", { name: "Germany" }));
    expect(screen.getByRole("button", { name: "Munich" })).toBeTruthy();
  });

  it("prints the annual rupee figure in Indian digit grouping", () => {
    render(<CostOfLivingPicker />);
    const line = screen.getByText((_, element) =>
      Boolean(element?.tagName === "SPAN" && element.textContent?.startsWith("about ₹")),
    );
    expect(line.textContent).toMatch(/^about ₹\d{1,2}(,\d{2})*,\d{3}$/);
  });
});

describe("intake form", () => {
  // A real click runs microtasks before the default action, so a Next button
  // reused as the submit button would submit the half-filled form.
  it("does not turn the clicked Next button into the submit button", () => {
    render(<IntakeForm />);
    fireEvent.click(screen.getByRole("button", { name: /Next/ }));
    const next = screen.getByRole("button", { name: /Next/ });
    fireEvent.click(next);
    expect(screen.getByRole("button", { name: /Check and continue/ })).toBeTruthy();
    expect(next.getAttribute("type")).toBe("button");
  });
});

describe("German grade calculator", () => {
  it("asks for the pass mark instead of converting against an empty one", () => {
    render(<GermanGradeCalculator />);
    fireEvent.change(screen.getByLabelText("Your grade", { exact: false }), { target: { value: "8" } });
    fireEvent.change(screen.getByLabelText("Minimum pass grade", { exact: false }), { target: { value: "" } });
    expect(screen.getByText("Enter your mark, the maximum mark and the pass mark.")).toBeTruthy();
    expect(screen.queryByText(/German grade equivalent/)).toBeNull();
  });
});

describe("half-up rounding at exact .x5 boundaries", () => {
  it.each([
    [8.9, "1.6"], [8.3, "1.9"], [8.5, "1.8"], [9.1, "1.5"],
    [6.1, "3.0"], [7.2, "2.4"], [10, "1.0"], [4, "4.0"],
  ])("Modified Bavarian, %s out of 10 with pass 4 is %s", (obtained, expected) => {
    const result = modifiedBavarian({ obtained, max: 10, passing: 4 });
    expect("error" in result ? result.error : result.display).toBe(expected);
  });

  it("shows working that agrees with the rounded result", () => {
    const result = modifiedBavarian({ obtained: 8.9, max: 10, passing: 4 });
    if ("error" in result) throw new Error(result.error);
    expect(result.working.steps.slice(2, 5)).toEqual(["3 × 1.1 = 3.3", "3.3 ÷ 6 = 0.55", "1 + 0.55 = 1.55"]);
  });

  it("CGPA 5.81 × 9.5 = 55.195 rounds to 55.2", () => {
    const result = cgpaToPercentage(5.81);
    expect("error" in result ? result.error : result.value).toBe(55.2);
  });
});

describe("sgpaToCgpa", () => {
  it("does not claim no credits were entered when only some were", () => {
    const result = sgpaToCgpa([{ sgpa: 8, credits: 20 }, { sgpa: 9 }]);
    expect("error" in result ? result.error : result.source).not.toMatch(/no credit figures were entered/);
  });
});
