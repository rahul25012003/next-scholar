import { NextResponse, type NextRequest } from "next/server";
import { readSession, SESSION_COOKIE } from "@/domain/auth";

/**
 * The route guard. Next 16 calls this a proxy rather than middleware.
 *
 * It checks the session signature before any authenticated page renders, so an
 * unsigned or expired cookie never reaches a surface that reads case data. It
 * deliberately does not do the authorisation: which cases a role may see is the
 * permission matrix's job, enforced again at the data layer, because a guard
 * that runs before routing is the wrong place to hold that decision.
 */

const protectedPrefixes = ["/portal", "/console", "/ops"];

export function proxy(request: NextRequest): NextResponse {
  const { pathname } = request.nextUrl;
  const session = readSession(request.cookies.get(SESSION_COOKIE)?.value);

  const needsAuth = protectedPrefixes.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );

  if (needsAuth && !session) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.search = `?next=${encodeURIComponent(pathname)}`;
    return NextResponse.redirect(url);
  }

  // A visitor who is already signed in may still open the sign in page: it
  // says who is signed in and lets them use another account.

  return NextResponse.next();
}

export const config = {
  matcher: ["/portal/:path*", "/console/:path*", "/ops/:path*"],
};
