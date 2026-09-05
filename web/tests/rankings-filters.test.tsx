// @vitest-environment jsdom
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import RankingsPage from "@/app/(marketing)/universities/rankings/page";

/**
 * The search box and the destination/body pills are two different ways of
 * changing the same URL. A pill click builds its own href with every active
 * filter folded in, but the search box is a real form submission, and a plain
 * GET form only sends the fields it actually carries. Whichever filters are
 * active have to ride along as hidden inputs, or typing a search term while a
 * pill is active silently drops that pill the moment the form submits.
 */
describe("the rankings search form preserves active pill filters", () => {
  it("carries the active destination forward as a hidden field", async () => {
    const jsx = await RankingsPage({
      searchParams: Promise.resolve({ destination: "germany" }),
      params: Promise.resolve({}),
    } as never);
    render(jsx);

    const hidden = document.querySelector('input[type="hidden"][name="destination"]');
    expect(hidden).not.toBeNull();
    expect((hidden as HTMLInputElement).value).toBe("germany");
  });

  it("carries the active ranking body forward as a hidden field", async () => {
    const jsx = await RankingsPage({
      searchParams: Promise.resolve({ body: "QS World University Rankings" }),
      params: Promise.resolve({}),
    } as never);
    render(jsx);

    const hidden = document.querySelector('input[type="hidden"][name="body"]');
    expect(hidden).not.toBeNull();
    expect((hidden as HTMLInputElement).value).toBe("QS World University Rankings");
  });

  it("adds no hidden fields when no pill filter is active", async () => {
    const jsx = await RankingsPage({
      searchParams: Promise.resolve({}),
      params: Promise.resolve({}),
    } as never);
    render(jsx);

    expect(document.querySelector('input[type="hidden"]')).toBeNull();
  });

  it("still lets the visible search field carry its own value", async () => {
    const jsx = await RankingsPage({
      searchParams: Promise.resolve({ destination: "germany", q: "Munich" }),
      params: Promise.resolve({}),
    } as never);
    render(jsx);

    expect(screen.getByLabelText("Search by institution or city")).toHaveValue("Munich");
  });
});
