import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtDecode } from "jwt-decode";

// Helper function to check if token is expired
const isTokenExpired = (token: string) => {
  try {
    const decoded = jwtDecode<{ exp: number }>(token);
    return decoded.exp < Date.now() / 1000;
  } catch {
    return true;
  }
};

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("access_token")?.value;
  const refreshToken = request.cookies.get("refresh_token")?.value;

  // Paths that don't require authentication
  const publicPaths = [
    "/login",
    "/register",
    "/api/auth/login",
    "/api/auth/me",
    "/api/auth/refresh",
  ];
  const isPublicPath = publicPaths.some((path) =>
    request.nextUrl.pathname.startsWith(path)
  );

  // // Allow all API routes except those that require auth
  // if (!request.nextUrl.pathname.startsWith("/api/auth")) {
  //   return NextResponse.next();
  // }

  // Don't redirect API calls to login page
  // if (request.nextUrl.pathname.startsWith("/api")) {
  // if (!token) {
  //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  // }

  // Handle public paths
  if (isPublicPath) {
    if (token && !isTokenExpired(token)) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    console.log("Public Path: ", request.nextUrl.pathname);
    console.log("Token: ", token);
    console.log("Refresh Token: ", refreshToken);
    return NextResponse.next();
  }

  // Handle protected paths
  if (!token || isTokenExpired(token)) {
    // If we have a refresh token, let the client handle the refresh
    if (refreshToken) {
      return NextResponse.next();
    }
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/login",
    "/register",
    "/profile",
    "/admin/:path*",
    "/api/:path*",
  ],
};
