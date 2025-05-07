import { NextResponse } from "next/server";
import { db } from "@/firebase/admin";
import { getCurrentUser } from "@/lib/actions/auth.action";

interface ContextParams {
  params: {
    id: string;
  };
}

export async function GET(request: Request, context: ContextParams) {
  try {
    const { id } = context.params;

    // Get the current user from the session
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized. Please sign in." },
        { status: 401 }
      );
    }

    // Get the specific interview document
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

    // Return only the specified fields
    const interview = {
      id: interviewDoc.id,
      role: interviewData.role || "",
      type: interviewData.type || "",
      level: interviewData.level || "",
      questions: interviewData.questions || [],
      finalized: interviewData.finalized || false,
      userId: interviewData.userId,
      createdAt: interviewData.createdAt?.toDate?.()
        ? interviewData.createdAt.toDate().toISOString()
        : interviewData.createdAt,
    };

    return NextResponse.json({ interview });
  } catch (error) {
    console.error("Error fetching interview:", error);
    return NextResponse.json(
      { error: "Failed to fetch interview. Please try again later." },
      { status: 500 }
    );
  }
}
