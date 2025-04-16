import { auth } from "@/firebase/admin";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { sessionToken } = await request.json();

    if (!sessionToken) {
      return NextResponse.json({ isValid: false }, { status: 401 });
    }

    // Verify the session cookie
    await auth.verifySessionCookie(sessionToken, true);
    
    return NextResponse.json({ isValid: true });
  } catch (error) {
    console.error("Token verification error:", error);
    return NextResponse.json({ isValid: false }, { status: 401 });
  }
}