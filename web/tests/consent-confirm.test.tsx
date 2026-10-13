// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { ConsentList } from "@/components/app/consent-list";

const withdraw = vi.hoisted(() => vi.fn(async () => ({ status: "done", message: "Withdrawn." })));
vi.mock("@/app/actions/case", () => ({ withdrawConsentAction: withdraw }));

afterEach(cleanup);

const consent = {
  id: "c1",
  caseId: "case1",
  category: "passport" as const,
  purpose: "Visa file",
  sharedWith: ["Embassy"],
  grantedAt: "2026-01-01T00:00:00Z",
  grantedBy: "Student",
  withdrawnAt: null,
};

describe("consent withdrawal", () => {
  it("asks once before it withdraws, and can be kept", async () => {
    render(<ConsentList consents={[consent]} />);
    const button = screen.getByRole("button", { name: "Withdraw" });

    fireEvent.click(button);
    expect(button.textContent).toBe("Confirm withdrawal");
    fireEvent.click(screen.getByRole("button", { name: "Keep it" }));
    expect(button.textContent).toBe("Withdraw");
    expect(withdraw).not.toHaveBeenCalled();

    fireEvent.click(button);
    fireEvent.click(screen.getByRole("button", { name: "Confirm withdrawal" }));
    await waitFor(() => expect(withdraw).toHaveBeenCalledTimes(1));
  });
});
