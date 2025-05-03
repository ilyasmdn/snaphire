import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { db, auth } from "@/firebase/admin";

// API endpoint to get user's subscription status
export async function GET(req: NextRequest) {
  try {
    // Get session cookie
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("session")?.value;

    if (!sessionCookie) {
      return NextResponse.json(
        { error: "Unauthorized: No session cookie" },
        { status: 401 }
      );
    }

    // Verify session cookie
    try {
      const decodedClaims = await auth.verifySessionCookie(sessionCookie);
      const userId = decodedClaims.uid;

      // Get user data from Firestore
      const userDoc = await db.collection("users").doc(userId).get();

      if (!userDoc.exists) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
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
