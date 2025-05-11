import { generateText } from "ai";
import { google } from "@ai-sdk/google";
import { db } from "@/firebase/admin";
import { FieldValue } from "firebase-admin/firestore";

export function GET() {
  return Response.json(
    { success: true, data: "VAPI is working!" },
    { status: 200 }
  );
}

export async function POST(req: Request) {
  const { type, role, level, amount, userid } = await req.json();

  try {
    // Generate interview questions
    const { text: questions } = await generateText({
      model: google("gemini-2.0-flash-001"),
      prompt: `Prepare questions for a job interview.
      The job role is ${role}.
      The job experience level is ${level}.
      The focus between behavioural and technical questions should lean towards: ${type}.
      The amount of questions required is: ${amount}.
      Please return only the questions, without any additional text.
      The questions are going to be read by a voice assistant so do not use "/" or "*" or any other special characters which might break the voice assistant.
      Return the questions formatted like this:
      ["Question 1", "Question 2", "Question 3"]
      
      Thank you! <3
  `,
    });

    const interview = {
      role,
      type,
      level,
      questions: JSON.parse(questions),
      userId: userid,
      finalized: true,
      createdAt: new Date().toISOString(),
    };

    // Save the interview
    await db.collection("interviews").add(interview);

    // Check if user has an active one-time purchase and update it
    await updateUserPurchase(userid);

    return Response.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Error in POST request:", error);
    return Response.json({ success: false, error: error }, { status: 500 });
  }
}

/**
 * Checks if the user has an active one-time purchase and updates the interviewsUsed count
 * @param userId The ID of the user
 */
async function updateUserPurchase(userId: string): Promise<void> {
  try {
    // Query for active one-time purchases
    const purchasesSnapshot = await db
      .collection("purchases")
      .where("userId", "==", userId)
      .get();

    if (purchasesSnapshot.empty) {
      console.log(`No purchases found for user ${userId}`);
      return;
    }

    // Sort purchases by purchaseDate to use the oldest active purchase first
    const purchases = purchasesSnapshot.docs
      .map((doc) => ({
        id: doc.id,
        ...(doc.data() as {
          type: "single" | "pack";
          interviewCount: number;
          interviewsUsed: number;
          purchaseDate: string;
          expiryDate: string;
        }),
      }))
      .filter(
        (purchase) =>
          // Check if purchase is active (not expired and has remaining interviews)
          new Date(purchase.expiryDate) > new Date() &&
          (purchase.interviewsUsed || 0) < purchase.interviewCount
      )
      .sort(
        (a, b) =>
          new Date(a.purchaseDate).getTime() -
          new Date(b.purchaseDate).getTime()
      );

    if (purchases.length === 0) {
      console.log(`No active purchases found for user ${userId}`);
      return;
    }

    // Get the oldest active purchase to update
    const purchaseToUpdate = purchases[0];
    console.log(`Updating purchase ${purchaseToUpdate.id} for user ${userId}`);

    // Update the purchase with an incremented interviewsUsed count
    await db
      .collection("purchases")
      .doc(purchaseToUpdate.id)
      .update({
        interviewsUsed: FieldValue.increment(1),
      });

    console.log(
      `Successfully updated purchase ${purchaseToUpdate.id} for user ${userId}`
    );
  } catch (error) {
    console.error(`Error updating purchase for user ${userId}:`, error);
  }
}
