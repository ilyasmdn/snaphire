import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("session")?.value;
  const pathname = request.nextUrl.pathname;

  // Protected routes
  const protectedPaths = [
    "/dashboard",
    "/analytics",
    "/interviews",
    "/generate-interview",
    "/resources",
    "/settings",
  ];

  // Check if current path matches any protected path
  const isProtectedRoute = protectedPaths.some((path) =>
    pathname.startsWith(path)
  );

  // If it's not a protected route, continue
  if (!isProtectedRoute) {
    return NextResponse.next();
  }

  try {
    // Verify the session token
    if (!token) {
      throw new Error("No session token");
    }

    // Call the verify API endpoint
    const verifyResponse = await fetch(
      new URL("/api/auth/verify", request.url),
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ sessionToken: token }),
      }
    );

    if (!verifyResponse.ok) {
      throw new Error("Invalid session");
    }

    const { isValid } = await verifyResponse.json();

    if (!isValid) {
      throw new Error("Invalid session");
    }

    // User is authenticated, allow access
    return NextResponse.next();
  } catch (error) {
    // Redirect to sign-in page
    const redirectUrl = new URL("/sign-in", request.url);
    redirectUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(redirectUrl);
  }
}

// Update matcher to catch all protected routes
export const config = {
  matcher: [
    "/dashboard/:path*",
    "/analytics/:path*",
    "/interviews/:path*",
    "/generate-interview/:path*",
    "/resources/:path*",
    "/settings/:path*",
  ],
};
