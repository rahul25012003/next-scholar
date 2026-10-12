import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE } from "@/domain/auth";

/**
 * Sign out, as a plain form POST to a fixed address rather than a server
 * action. A server action is called by an id that changes with every build,
 * so a page left open across a rebuild or a deploy could not sign out: the
 * click failed into the error page instead. This address never changes, the
 * form works without JavaScript, and the 303 sends the browser on to the sign
 * in page as a fresh load, so nothing of the signed in page is left behind.
 *
 * Cross-site posts here arrive without the session cookie (it is SameSite
 * lax), so another site cannot sign anyone out.
 */
export function POST(request: NextRequest) {
  const response = NextResponse.redirect(new URL("/login", request.url), 303);
  response.cookies.delete(SESSION_COOKIE);
  return response;
}
