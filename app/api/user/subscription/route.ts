import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { db, auth } from "@/firebase/admin";

// API endpoint to get user's subscription status
export async function GET(req: NextRequest) {
  try {
    // Get session cookie
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("session")?.value;

    console.log("Session cookie exists:", !!sessionCookie);

    if (!sessionCookie) {
      return NextResponse.json(
        { error: "Unauthorized: No session cookie" },
        { status: 401 }
      );
    }

    // Verify session cookie - using false for checkRevoked to be less strict
    try {
      const decodedClaims = await auth.verifySessionCookie(
        sessionCookie,
        false
      );
      const userId = decodedClaims.uid;

      console.log("Session verified successfully for user:", userId);

      // Get user data from Firestore
      const userDoc = await db.collection("users").doc(userId).get();

      // Instead of returning a 404 error, return a default subscription for users not found
      // This prevents the "Not Found" error in the frontend
      if (!userDoc.exists) {
        console.warn(
          `User document not found for ID: ${userId}. Providing default subscription.`
        );
        return NextResponse.json({
          subscription: {
            active: false,
            plan: "free",
          },
        });
      }

      const userData = userDoc.data();

      // Return subscription data if exists, otherwise return inactive status
      const subscriptionData = userData?.subscription || {
        active: false,
        plan: "free",
      };

      return NextResponse.json({ subscription: subscriptionData });
    } catch (error) {
      console.error("Session verification failed:", error);
      console.error("Session cookie value:", sessionCookie);
      return NextResponse.json(
        { error: "Unauthorized: Invalid session" },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error("Error getting subscription:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
