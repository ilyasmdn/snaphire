import { auth } from "@/firebase/admin";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { sessionToken } = await request.json();

    if (!sessionToken) {
      return NextResponse.json({ isValid: false }, { status: 401 });
    }

    // Verify the session cookie
    const decodedClaims = await auth.verifySessionCookie(sessionToken, true);
    const userId = decodedClaims.uid;

    return NextResponse.json({ isValid: true, userId });
  } catch (error) {
    console.error("Token verification error:", error);
    return NextResponse.json({ isValid: false }, { status: 401 });
  }
}
