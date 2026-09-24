import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const token = request.cookies.get("auth_token")?.value;

  const isAuthPage = pathname.startsWith("/login");
  const isDashboardPage = pathname.startsWith("/products");

  // Redirect root path / to /products
  if (pathname === "/") {
    if (token) {
      return NextResponse.redirect(new URL("/products", request.url));
    }
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Protected Dashboard Routes: redirect unauthenticated users to /login
  if (isDashboardPage && !token) {
    const returnUrl = encodeURIComponent(`${pathname}${search}`);
    const loginUrl = new URL(`/login?redirect=${returnUrl}`, request.url);
    return NextResponse.redirect(loginUrl);
  }

  // Auth Page: redirect authenticated users to /products
  if (isAuthPage && token) {
    return NextResponse.redirect(new URL("/products", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/login", "/products", "/products/:path*"],
};
