import { NextResponse } from "next/server";
import { db } from "@/firebase/admin";
import { getCurrentUser } from "@/lib/actions/auth.action";

export async function GET() {
  try {
    // Get the current user from the session
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized. Please sign in." },
        { status: 401 }
      );
    }

    // Query the interviews collection for documents where userId matches
    const interviewsSnapshot = await db
      .collection("interviews")
      .where("userId", "==", user.id)
      .orderBy("createdAt", "desc")
      .get();

    if (interviewsSnapshot.empty) {
      return NextResponse.json({ interviews: [] });
    } // Map the documents to include only the specified fields
    const interviews = interviewsSnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        role: data.role || "",
        type: data.type || "",
        level: data.level || "",
        questions: data.questions || [],
        finalized: data.finalized || false,
        userId: data.userId,
        createdAt: data.createdAt?.toDate?.()
          ? data.createdAt.toDate().toISOString()
          : data.createdAt,
        // Include whether this interview used a one-time purchase
        usedPurchase: data.usedPurchase || false,
        purchaseId: data.purchaseId || null,
      };
    });

    return NextResponse.json({ interviews });
  } catch (error) {
    console.error("Error fetching interviews:", error);
    return NextResponse.json(
      { error: "Failed to fetch interviews. Please try again later." },
      { status: 500 }
    );
  }
}
