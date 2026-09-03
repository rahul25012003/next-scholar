import { beforeEach, describe, expect, it } from "vitest";
import { check, clientKey, policies, reset } from "@/domain/rate-limit";

beforeEach(() => {
  reset();
});

const policy = { limit: 3, windowSeconds: 60 };

describe("rate limiting", () => {
  it("allows up to the limit and refuses after it", () => {
    expect(check("1.2.3.4", policy).allowed).toBe(true);
    expect(check("1.2.3.4", policy).allowed).toBe(true);
    expect(check("1.2.3.4", policy).allowed).toBe(true);

    const refused = check("1.2.3.4", policy);
    expect(refused.allowed).toBe(false);
    expect(refused.remaining).toBe(0);
    expect(refused.retryAfter).toBeGreaterThan(0);
  });

  it("counts each caller separately", () => {
    for (let i = 0; i < 3; i += 1) check("1.2.3.4", policy);
    expect(check("1.2.3.4", policy).allowed).toBe(false);
    expect(check("5.6.7.8", policy).allowed).toBe(true);
  });

  it("buckets an unidentifiable caller rather than waving it through", () => {
    for (let i = 0; i < 3; i += 1) check(null, policy);
    expect(check(null, policy).allowed).toBe(false);
  });

  it("keeps separate counters per policy, so one cannot exhaust another", () => {
    for (let i = 0; i < 3; i += 1) check("1.2.3.4", policy);
    expect(check("1.2.3.4", policy).allowed).toBe(false);
    expect(check("1.2.3.4", { limit: 3, windowSeconds: 120 }).allowed).toBe(true);
  });

  it("reopens once the window has passed", () => {
    const start = 1_000_000;
    for (let i = 0; i < 3; i += 1) check("1.2.3.4", policy, start);
    expect(check("1.2.3.4", policy, start).allowed).toBe(false);
    expect(check("1.2.3.4", policy, start + 61_000).allowed).toBe(true);
  });

  it("reports how long is left, in seconds", () => {
    const start = 1_000_000;
    for (let i = 0; i < 3; i += 1) check("1.2.3.4", policy, start);
    const refused = check("1.2.3.4", policy, start + 10_000);
    expect(refused.retryAfter).toBe(50);
  });

  it("throttles auth tightly enough to matter, since each attempt does scrypt work", () => {
    expect(policies.auth.limit).toBeLessThanOrEqual(10);
    expect(policies.auth.windowSeconds).toBeGreaterThanOrEqual(60);
  });

  it("reads the client key from the headers a proxy sets", () => {
    expect(clientKey(new Headers({ "x-forwarded-for": "9.9.9.9, 10.0.0.1" }))).toBe("9.9.9.9");
    expect(clientKey(new Headers({ "x-real-ip": "8.8.8.8" }))).toBe("8.8.8.8");
    expect(clientKey(new Headers())).toBeNull();
  });
});
