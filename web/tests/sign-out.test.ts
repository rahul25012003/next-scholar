import { describe, expect, it } from "vitest";
import { POST } from "@/app/sign-out/route";
import { SESSION_COOKIE } from "@/domain/auth";

describe("sign out", () => {
  it("sends the browser to sign in on the address it is using, not the server's own", () => {
    const response = POST();
    expect(response.status).toBe(303);
    // Relative, so a visitor on a tunnel or proxy address is not sent to localhost.
    expect(response.headers.get("location")).toBe("/login");
  });

  it("clears the session cookie", () => {
    const cookie = POST().headers.get("set-cookie") ?? "";
    expect(cookie).toContain(`${SESSION_COOKIE}=;`);
    expect(cookie).toMatch(/Expires=Thu, 01 Jan 1970/);
  });
});
