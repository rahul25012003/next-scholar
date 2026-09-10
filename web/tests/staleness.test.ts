import { describe, expect, it } from "vitest";
import { isStale, STALE_AFTER_DAYS } from "@/content/types";

describe("isStale matches the ledger's own stated cadence", () => {
  const now = new Date("2026-09-10T00:00:00.000Z");

  it("is not stale inside the threshold", () => {
    const recent = new Date(now);
    recent.setDate(recent.getDate() - (STALE_AFTER_DAYS - 1));
    expect(isStale(recent.toISOString().slice(0, 10), now)).toBe(false);
  });

  it("is stale once past the threshold", () => {
    const old = new Date(now);
    old.setDate(old.getDate() - (STALE_AFTER_DAYS + 1));
    expect(isStale(old.toISOString().slice(0, 10), now)).toBe(true);
  });

  it("is not stale on the day it was stated", () => {
    expect(isStale(now.toISOString().slice(0, 10), now)).toBe(false);
  });
});
