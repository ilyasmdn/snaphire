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
    }); // Check if user has an active one-time purchase
    const purchaseUsed = await findActivePurchase(userid);

    const interview = {
      role,
      type,
      level,
      questions: JSON.parse(questions),
      userId: userid,
      finalized: true,
      createdAt: new Date().toISOString(),
      // Track if this interview used a one-time purchase
      usedPurchase: purchaseUsed ? true : false,
      // If a purchase was used, store its ID for tracking
      purchaseId: purchaseUsed?.id || null,
    };

    // Save the interview
    await db.collection("interviews").add(interview);

    // If a purchase was found, update its usage count
    if (purchaseUsed) {
      await updatePurchaseUsage(purchaseUsed.id);
    }

    return Response.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Error in POST request:", error);
    return Response.json({ success: false, error: error }, { status: 500 });
  }
}

/**
 * Finds an active one-time purchase for the user
 * @param userId The ID of the user
 * @returns The purchase object if found, null otherwise
 */
interface Purchase {
  id: string;
  type: "single" | "pack";
  interviewCount: number;
  interviewsUsed: number;
  purchaseDate: string;
  expiryDate: string;
}

async function findActivePurchase(userId: string): Promise<Purchase | null> {
  try {
    // Query for active one-time purchases
    const purchasesSnapshot = await db
      .collection("purchases")
      .where("userId", "==", userId)
      .get();

    if (purchasesSnapshot.empty) {
      console.log(`No purchases found for user ${userId}`);
      return null;
    }

    // Sort purchases by purchaseDate to use the oldest active purchase first
    const purchases = purchasesSnapshot.docs
      .map((doc) => {
        const data = doc.data() as Purchase;
        return {
          id: doc.id,
          type: data.type,
          interviewCount: data.interviewCount,
          interviewsUsed: data.interviewsUsed,
          purchaseDate: data.purchaseDate,
          expiryDate: data.expiryDate,
        };
      })
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
      return null;
    }

    // Return the oldest active purchase
    return purchases[0];
  } catch (error) {
    console.error(`Error finding purchases for user ${userId}:`, error);
    return null;
  }
}

/**
 * Updates the usage count for a purchase
 * @param purchaseId The ID of the purchase to update
 */
async function updatePurchaseUsage(purchaseId: string): Promise<void> {
  try {
    console.log(`Updating purchase ${purchaseId}`);

    // Update the purchase with an incremented interviewsUsed count
    await db
      .collection("purchases")
      .doc(purchaseId)
      .update({
        interviewsUsed: FieldValue.increment(1),
      });

    console.log(`Successfully updated purchase ${purchaseId}`);
  } catch (error) {
    console.error(`Error updating purchase ${purchaseId}:`, error);
  }
}
