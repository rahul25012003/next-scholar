import { NextResponse, type NextRequest } from "next/server";
import { readSession, SESSION_COOKIE, landingFor } from "@/domain/auth";

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
const authPages = ["/login", "/signup"];

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

  // Someone already signed in has no use for the sign in page.
  if (session && authPages.includes(pathname)) {
    const url = request.nextUrl.clone();
    url.pathname = landingFor[session.role];
    url.search = "";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/portal/:path*", "/console/:path*", "/ops/:path*", "/login", "/signup"],
};
