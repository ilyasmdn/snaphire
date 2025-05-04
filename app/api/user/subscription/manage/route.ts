import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { db, auth } from "@/firebase/admin";

// API endpoint to create a customer portal URL for managing subscription
export async function POST(req: NextRequest) {
  try {
    // Get session cookie
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("session")?.value;

    if (!sessionCookie) {
      console.log("No session cookie found in manage subscription API");
      return NextResponse.json(
        { error: "Unauthorized: No session cookie" },
        { status: 401 }
      );
    }

    // Verify session cookie
    try {
      const decodedClaims = await auth.verifySessionCookie(sessionCookie);
      const userId = decodedClaims.uid;
      console.log(`Processing portal request for user: ${userId}`);

      // Get user data from Firestore
      const userDoc = await db.collection("users").doc(userId).get();

      if (!userDoc.exists) {
        console.log(`User ${userId} not found in Firestore`);
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }

      const userData = userDoc.data();

      // Check if user has a subscription
      if (!userData?.subscription?.subscriptionId) {
        console.log(`No subscription ID found for user ${userId}`);
        return NextResponse.json(
          { error: "No active subscription found" },
          { status: 400 }
        );
      }

      const subscriptionId = userData.subscription.subscriptionId;
      console.log(`Found subscription ID: ${subscriptionId}`);

      // Make a request to Lemon Squeezy API
      const apiKey = process.env.LEMONSQUEEZY_API_KEY;
      if (!apiKey) {
        console.error(
          "LEMONSQUEEZY_API_KEY environment variable is not configured"
        );
        return NextResponse.json(
          { error: "API key not configured" },
          { status: 500 }
        );
      }

      // According to Lemon Squeezy documentation, we can get a signed customer portal URL
      // directly from the subscription object
      console.log(
        `Fetching signed portal URL for subscription ID: ${subscriptionId}`
      );

      const response = await fetch(
        `https://api.lemonsqueezy.com/v1/subscriptions/${subscriptionId}`,
        {
          method: "GET",
          headers: {
            Accept: "application/vnd.api+json",
            Authorization: `Bearer ${apiKey}`,
          },
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error(
          `Error fetching subscription (${response.status}):`,
          errorText
        );

        // If we can't access the subscription, fall back to an unsigned URL
        console.log("Failed to get signed URL, falling back to unsigned URL");

        // Get store domain from env variables (preferred) or use default lemonsqueezy domain
        const storeName = process.env.LEMONSQUEEZY_STORE_NAME;
        if (storeName) {
          const unsignedUrl = `https://${storeName}.lemonsqueezy.com/billing`;
          console.log(`Generated unsigned portal URL: ${unsignedUrl}`);
          return NextResponse.json({ url: unsignedUrl });
        } else {
          console.error(
            "Cannot generate unsigned URL: LEMONSQUEEZY_STORE_NAME not configured"
          );
          return NextResponse.json(
            { error: "Failed to generate portal URL" },
            { status: 500 }
          );
        }
      }

      const data = await response.json();

      // Extract the customer portal URL from the subscription attributes
      const portalUrl = data?.data?.attributes?.urls?.customer_portal;

      if (!portalUrl) {
        console.error("Customer portal URL not found in subscription response");
        return NextResponse.json(
          { error: "Customer portal URL not available in subscription data" },
          { status: 404 }
        );
      }

      console.log("Successfully retrieved signed customer portal URL");
      return NextResponse.json({ url: portalUrl });
    } catch (error) {
      console.error("Session verification or portal creation failed:", error);
      return NextResponse.json(
        { error: "Unauthorized or portal creation failed" },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error("Error managing subscription:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
