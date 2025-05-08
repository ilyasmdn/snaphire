import { NextResponse } from "next/server";
import { db } from "@/firebase/admin";
import { getCurrentUser } from "@/lib/actions/auth.action";

interface ContextParams {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(request: Request, context: ContextParams) {
  try {
    // Await the params before destructuring
    const params = await context.params;
    const { id } = params;

    // Get the current user from the session
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized. Please sign in." },
        { status: 401 }
      );
    }

    // Get the specific interview document to verify ownership
    const interviewDoc = await db.collection("interviews").doc(id).get();

    if (!interviewDoc.exists) {
      return NextResponse.json(
        { error: "Interview not found." },
        { status: 404 }
      );
    }

    // Check if the interview belongs to the current user
    const interviewData = interviewDoc.data();
    if (interviewData?.userId !== user.id) {
      return NextResponse.json(
        { error: "Unauthorized access to this interview." },
        { status: 403 }
      );
    }

    // Query the feedback collection for documents matching this interview ID
    const feedbackSnapshot = await db
      .collection("feedback")
      .where("interviewId", "==", id)
      .where("userId", "==", user.id)
      .orderBy("createdAt", "desc")
      .limit(1)
      .get();

    if (feedbackSnapshot.empty) {
      return NextResponse.json(
        { error: "Feedback not yet available for this interview." },
        { status: 404 }
      );
    }

    const feedbackDoc = feedbackSnapshot.docs[0];
    const feedbackData = feedbackDoc.data();

    // Format the feedback data according to the interface used in the frontend
    const feedback = {
      strengths: feedbackData?.strengths || [],
      areasOfImprovement: feedbackData?.areasForImprovement || [],
      overallScore: feedbackData?.totalScore || 0,
      questionFeedback:
        feedbackData?.categoryScores?.map((category: any) => ({
          question: category.name,
          score: category.score,
          comments: category.comment,
        })) || [],
      summary:
        feedbackData?.finalAssessment || "No feedback summary available.",
    };

    return NextResponse.json({ feedback });
  } catch (error) {
    console.error("Error fetching feedback:", error);
    return NextResponse.json(
      { error: "Failed to fetch feedback. Please try again later." },
      { status: 500 }
    );
  }
}
