"use server";

import { db, auth } from "@/firebase/admin";
import { cookies } from "next/headers";

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

    // Note: We can't automatically set the session cookie in server action after signup
    // because we need an ID token, not a custom token
    // The client should handle setting the session after successful signup

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
