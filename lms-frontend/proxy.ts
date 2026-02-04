import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

// Lightweight auth middleware for admin routes
async function adminAuthMiddleware(request: NextRequest) {
  const sessionCookie = getSessionCookie(request);

  // If no session cookie, redirect to login
  if (!sessionCookie) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Verify admin role by calling the backend
  try {
    const response = await fetch(`${API_URL}/api/admin/verify`, {
      method: "GET",
      headers: {
        Cookie: request.headers.get("cookie") || "",
      },
    });

    // If not admin (403) or unauthorized (401), redirect accordingly
    if (response.status === 403) {
      return NextResponse.redirect(new URL("/not-admin", request.url));
    }

    if (!response.ok) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    // Admin verified, allow access
    return NextResponse.next();
  } catch (error) {
    console.error("Admin verification error:", error);
    return NextResponse.redirect(new URL("/login", request.url));
  }
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api|public).*)"],
};

export default async function middleware(request: NextRequest) {
  // Auth check for admin routes
  if (request.nextUrl.pathname.startsWith("/admin")) {
    return adminAuthMiddleware(request);
  }

  return NextResponse.next();
}