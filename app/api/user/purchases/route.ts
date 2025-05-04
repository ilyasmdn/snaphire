import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { db, auth } from "@/firebase/admin";

// API endpoint to get user's one-time purchases
export async function GET(req: NextRequest) {
  try {
    // Get session cookie - correctly using await with cookies()
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("session")?.value;

    if (!sessionCookie) {
      console.log("No session cookie found in purchases API");
      return NextResponse.json(
        { error: "Unauthorized: No session cookie" },
        { status: 401 }
      );
    }

    // Verify session cookie
    try {
      const decodedClaims = await auth.verifySessionCookie(sessionCookie);
      const userId = decodedClaims.uid;
      console.log(`Verified user: ${userId} in purchases API`);

      // Get user's one-time purchases from Firestore
      // For now, return empty array if collection doesn't exist yet
      try {
        const purchasesSnapshot = await db
          .collection("purchases")
          .where("userId", "==", userId)
          .orderBy("purchaseDate", "desc")
          .get();

        const purchases = purchasesSnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            type: data.type, // 'single' or 'pack'
            interviewCount: data.interviewCount,
            interviewsUsed: data.interviewsUsed || 0,
            purchaseDate: data.purchaseDate,
            expiryDate: data.expiryDate,
            orderId: data.orderId,
            amount: data.amount,
            isActive:
              new Date(data.expiryDate) > new Date() &&
              data.interviewsUsed < data.interviewCount,
          };
        });

        return NextResponse.json({ purchases });
      } catch (err) {
        console.log("Error fetching purchases, returning empty array:", err);
        // If there's an error fetching purchases (like collection doesn't exist yet),
        // just return an empty array rather than an error
        return NextResponse.json({ purchases: [] });
      }
    } catch (error) {
      console.error("Session verification failed in purchases API:", error);
      return NextResponse.json(
        { error: "Unauthorized: Invalid session" },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error("Error getting purchases:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
