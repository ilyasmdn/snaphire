import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/actions/auth.action";
import { db } from "@/firebase/admin";

// Define the user type based on what's returned by getCurrentUser
interface User {
  id: string;
  email: string;
  [key: string]: any; // For other properties that might be in the user document
}

export async function POST(request: NextRequest) {
  try {
    // Get the current user
    const user = (await getCurrentUser()) as User | null;

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse the feedback data from request
    const { feedbackType, feedbackText } = await request.json();

    // Validate the input
    if (!feedbackType || !feedbackText) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Store the feedback in Firebase
    const feedbackRef = db.collection("users_feedback");
    await feedbackRef.add({
      userId: user.id,
      userEmail: user.email as string,
      feedbackType,
      feedbackText,
      createdAt: new Date().toISOString(),
      path: request.headers.get("referer") || "",
      status: "new",
    });

    return NextResponse.json(
      { success: true, message: "Feedback submitted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error submitting feedback:", error);
    return NextResponse.json(
      { error: "Failed to submit feedback" },
      { status: 500 }
    );
  }
}
