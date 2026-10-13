// @vitest-environment jsdom
import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { AnswersReady } from "@/components/marketing/answers-ready";

afterEach(cleanup);

/**
 * The end of a form that cannot send yet. It must say nothing was sent, leave
 * the visitor something to keep, point to what works today for the countries
 * they picked, and take a screen reader's focus to the result.
 */
describe("the form's end when nothing can be sent", () => {
  const renderIt = () =>
    render(
      <AnswersReady
        heading="Your answers are ready. Nothing was sent to us."
        message="No slot was booked."
        text={"Destinations\ngermany"}
        filename="answers.txt"
        destinations={["germany"]}
        missingTitle="Still to connect"
        missing={["A booking calendar"]}
      />,
    );

  it("says plainly that nothing was sent, and moves focus there", () => {
    renderIt();
    const heading = screen.getByRole("heading", { name: /Nothing was sent to us/ });
    expect(document.activeElement).toBe(heading);
  });

  it("offers the answers to keep, and the guide for each chosen country", () => {
    renderIt();
    expect(screen.getByRole("button", { name: "Download my answers" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Read the Germany guide/ })).toHaveAttribute(
      "href",
      "/destinations/germany",
    );
    expect(screen.getByRole("link", { name: /Check yourself against the requirements/ })).toHaveAttribute(
      "href",
      "/tools/requirements-check?destination=germany",
    );
  });
});
