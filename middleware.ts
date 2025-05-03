import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("session")?.value;
  const pathname = request.nextUrl.pathname;

  // Protected routes (require authentication)
  const protectedPaths = [
    "/dashboard",
    "/analytics",
    "/interviews",
    "/generate-interview",
    "/resources",
    "/settings",
  ];

  // Premium routes mapped to subscription tiers from pricing page
  // Dashboard is now excluded from premium routes to allow free access
  const premiumRoutes = {
    // "Starter" tier from pricing page
    starter: [
      "/interviews", // "5 AI-powered mock interviews per month"
      "/generate-interview", // (Part of interview process)
    ],
    // "Pro" tier from pricing page
    pro: [
      "/analytics", // "Advanced performance analytics"
      "/resources", // "Access to extra learning resources"
    ],
    // "Teams" tier from pricing page (highest level)
    teams: []
  };

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

    const { isValid, userId } = await verifyResponse.json();

    if (!isValid) {
      throw new Error("Invalid session");
    }

    // User is authenticated, now check subscription for premium routes
    const requiresSubscription = isPremiumRoute(pathname, premiumRoutes);
    
    if (requiresSubscription) {
      // Get user's subscription
      const subscriptionResponse = await fetch(
        new URL("/api/user/subscription", request.url)
      );
      
      if (!subscriptionResponse.ok) {
        // Redirect to pricing page if subscription check fails
        return NextResponse.redirect(new URL("/pricing", request.url));
      }
      
      const { subscription } = await subscriptionResponse.json();
      
      if (!subscription?.active) {
        // Redirect to pricing page if no active subscription
        return NextResponse.redirect(new URL("/pricing", request.url));
      }
      
      // Check if user has access to this route based on their plan
      if (!hasAccessToRoute(pathname, subscription.plan, premiumRoutes)) {
        // Redirect to pricing page for upgrade
        return NextResponse.redirect(new URL("/pricing?upgrade=true", request.url));
      }
    }

    // User is authenticated and has appropriate subscription, allow access
    return NextResponse.next();
  } catch (error) {
    // Redirect to sign-in page
    const redirectUrl = new URL("/sign-in", request.url);
    redirectUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(redirectUrl);
  }
}

// Helper function to check if a route requires subscription
function isPremiumRoute(
  pathname: string,
  premiumRoutes: Record<string, string[]>
): boolean {
  const allPremiumPaths = [
    ...premiumRoutes.starter,
    ...premiumRoutes.pro,
    ...premiumRoutes.teams
  ];
  
  return allPremiumPaths.some(path => pathname.startsWith(path));
}

// Helper function to check if user's plan has access to a route
function hasAccessToRoute(
  pathname: string, 
  userPlan: string,
  premiumRoutes: Record<string, string[]>
): boolean {
  // Define plan levels mapped to pricing page tiers
  const planLevels: Record<string, number> = {
    free: 0,
    starter: 1,
    pro: 2,
    teams: 3,
    unknown: -1
  };
  
  // Get user's plan level
  const userPlanLevel = planLevels[userPlan] || 0;
  
  // Check which level is required for this route
  if (premiumRoutes.teams.some(path => pathname.startsWith(path))) {
    return userPlanLevel >= planLevels.teams;
  }
  
  if (premiumRoutes.pro.some(path => pathname.startsWith(path))) {
    return userPlanLevel >= planLevels.pro;
  }
  
  if (premiumRoutes.starter.some(path => pathname.startsWith(path))) {
    return userPlanLevel >= planLevels.starter;
  }
  
  // Default to allowing access if route is not specifically restricted
  return true;
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
