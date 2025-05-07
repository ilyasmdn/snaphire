"use server";

import { db, auth } from "@/firebase/admin";
import { google } from "@ai-sdk/google";
import { generateObject } from "ai";
import { cookies } from "next/headers";
import { z } from "zod";

interface SignUpParams {
  uid: string;
  email: string;
  name: string;
  password: string;
}

interface SignInParams {
  email: string;
  idToken: string;
}

interface CreateFeedbackParams {
  interviewId: string;
  userId: string;
  transcript: { role: string; content: string }[];
  feedbackId?: string;
}

const feedbackSchema = z.object({
  totalScore: z.number(),
  categoryScores: z.tuple([
    z.object({
      name: z.literal("Communication Skills"),
      score: z.number(),
      comment: z.string(),
    }),
    z.object({
      name: z.literal("Technical Knowledge"),
      score: z.number(),
      comment: z.string(),
    }),
    z.object({
      name: z.literal("Problem Solving"),
      score: z.number(),
      comment: z.string(),
    }),
    z.object({
      name: z.literal("Cultural Fit"),
      score: z.number(),
      comment: z.string(),
    }),
    z.object({
      name: z.literal("Confidence and Clarity"),
      score: z.number(),
      comment: z.string(),
    }),
  ]),
  strengths: z.array(z.string()),
  areasForImprovement: z.array(z.string()),
  finalAssessment: z.string(),
});

export async function signUp(params: SignUpParams) {
  const { uid, email, name } = params;
  try {
    const userRecord = await db.collection("users").doc(uid).get();

    if (userRecord.exists) {
      return {
        success: false,
        error:
          "An account with this email already exists. Please sign in instead.",
      };
    }

    await db.collection("users").doc(uid).set({
      name,
      email,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    return {
      success: true,
      message: "Account created successfully",
      uid, // Return the UID so the client can use it if needed
    };
  } catch (error: any) {
    console.error("Error signing up:", error);

    if (error.code === "auth/email-already-in-use") {
      return {
        success: false,
        error:
          "This email is already registered. Please use a different email or sign in.",
      };
    }

    if (error.code === "auth/invalid-email") {
      return {
        success: false,
        error: "Please enter a valid email address.",
      };
    }

    if (error.code === "auth/weak-password") {
      return {
        success: false,
        error:
          "Please choose a stronger password. It should be at least 8 characters long.",
      };
    }

    return {
      success: false,
      error: "Unable to create your account. Please try again later.",
    };
  }
}

export async function signIn(params: SignInParams) {
  const { email, idToken } = params;

  try {
    const userRecord = await auth.getUserByEmail(email);
    if (!userRecord) {
      return {
        success: false,
        error: "No account found with this email. Please sign up first.",
      };
    }

    await setSessionCookie(idToken);
    return {
      success: true,
      message: "Signed in successfully",
    };
  } catch (error: any) {
    console.error("Error signing in:", error);

    if (error.code === "auth/user-disabled") {
      return {
        success: false,
        error: "This account has been disabled. Please contact support.",
      };
    }

    if (error.code === "auth/user-not-found") {
      return {
        success: false,
        error: "No account found with this email. Please sign up first.",
      };
    }

    return {
      success: false,
      error: "Unable to sign you in. Please try again later.",
    };
  }
}

export async function setSessionCookie(idToken: string) {
  const cookieStore = await cookies();
  const sessionCookie = await auth.createSessionCookie(idToken, {
    expiresIn: 60 * 60 * 24 * 7 * 1000,
  }); // 7 days
  cookieStore.set("session", sessionCookie, {
    maxAge: 60 * 60 * 24 * 7, // 7 days
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    sameSite: "lax",
  });
}

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("session")?.value;

  if (!sessionCookie) {
    return null;
  }

  try {
    const decodedClaims = await auth.verifySessionCookie(sessionCookie, true);
    
    const userRecord = await db.collection("users").doc(decodedClaims.uid).get();
    
    if (!userRecord.exists) return null;

    return {
      ...userRecord.data(),
      id: userRecord.id
    }
    
  } catch (error) {
    console.error("Error verifying session cookie:", error);
    return null;
  }
}

export async function createFeedback(params: CreateFeedbackParams) {
  const { interviewId, userId, transcript } = params;
  try {
    const formattedTranscript = transcript.map((sentence: {role: string; content: string;}) => (
      `- ${sentence.role}: ${sentence.content}\n`
    )).join("");

    const { object : { totalScore, categoryScores, strengths, areasForImprovement, finalAssessment} } = await generateObject({
      model: google("gemini-2.0-flash-001", {
        structuredOutputs: false,
      }),
      schema: feedbackSchema,
      prompt: `
        You are an AI interviewer analyzing a mock interview. Your task is to evaluate the candidate based on structured categories. Be thorough and detailed in your analysis. Don't be lenient with the candidate. If there are mistakes or areas for improvement, point them out.
        Transcript:
        ${formattedTranscript}

        Please score the candidate from 0 to 100 in the following areas. Do not add categories other than the ones provided:
        - **Communication Skills**: Clarity, articulation, structured responses.
        - **Technical Knowledge**: Understanding of key concepts for the role.
        - **Problem-Solving**: Ability to analyze problems and propose solutions.
        - **Cultural & Role Fit**: Alignment with company values and job role.
        - **Confidence & Clarity**: Confidence in responses, engagement, and clarity.
        `,
      system:
        "You are a professional interviewer analyzing a mock interview. Your task is to evaluate the candidate based on structured categories",
    })
    
    const feedback = await db.collection("feedback").add({
      interviewId,
      userId,
      totalScore,
      categoryScores,
      strengths,
      areasForImprovement,
      finalAssessment,
      createdAt: new Date().toISOString(),
    })

    return {
      success: true,
      feedbackId: feedback.id,
    };

  } catch (error) {
    console.error("Error saving feedback:", error);
    return {
      success: false,
      error: "Unable to save feedback. Please try again later.",
    };
  }
}