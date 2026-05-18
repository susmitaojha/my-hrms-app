import { NextRequest, NextResponse } from "next/server";

const PUBLIC_PATHS = ["/login", "/register", "/api", "/favicon.ico"];
const ASSETS = ["/_next", "/static", "/fonts", "/images"];
const PROTECTED_PATHS = ["/dashboard", "/profile", "/settings"];

function isPublicPath(pathname: string) {
  return (
    PUBLIC_PATHS.some((path) => pathname === path || pathname.startsWith(`${path}/`)) ||
    ASSETS.some((path) => pathname.startsWith(path)) ||
    pathname.includes(".")
  );
}

function isProtectedPath(pathname: string) {
  return PROTECTED_PATHS.some((path) => pathname === path || pathname.startsWith(`${path}/`));
}

export function middleware(req: NextRequest) {
  const { pathname, origin } = req.nextUrl;
  const token = req.cookies.get("token")?.value;
  const isAuthPage = pathname === "/login" || pathname === "/register";

  if (isPublicPath(pathname)) {
    return NextResponse.next();
  }

  if (isProtectedPath(pathname) && !token) {
    return NextResponse.redirect(new URL("/login", origin));
  }

  if (isAuthPage && token) {
    return NextResponse.redirect(new URL("/dashboard", origin));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/profile/:path*", "/settings/:path*", "/login", "/register"],
};
