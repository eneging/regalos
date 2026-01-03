import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("auth_token")?.value; // 👈 usa un solo nombre
  const role = request.cookies.get("role")?.value;

  const { pathname } = request.nextUrl;

  // -----------------------------
  // 🔐 PROTEGER CHECKOUT
  // -----------------------------
  if (pathname.startsWith("/checkout")) {
    if (!token) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // -----------------------------
  // 🔐 PROTEGER ADMIN
  // -----------------------------
  if (pathname.startsWith("/admin")) {
    if (!token) {
      const loginUrl = new URL("/login", request.url);
      return NextResponse.redirect(loginUrl);
    }

    if (role !== "admin") {
      const homeUrl = new URL("/", request.url);
      return NextResponse.redirect(homeUrl);
    }
  }

  return NextResponse.next();
}


export const config = {
  matcher: ["/admin/:path*", "/checkout/:path*"],
};
