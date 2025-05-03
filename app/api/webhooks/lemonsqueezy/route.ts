import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { db } from "@/firebase/admin";
import { headers } from "next/headers";

// Define event types from Lemon Squeezy
type WebhookEvent =
  | "order_created"
  | "order_refunded"
  | "subscription_created"
  | "subscription_updated"
  | "subscription_cancelled"
  | "subscription_resumed"
  | "subscription_expired"
  | "subscription_paused"
  | "subscription_unpaused"
  | "subscription_payment_failed"
  | "subscription_payment_recovered"
  | "subscription_payment_success"
  | "subscription_payment_refunded"
  | "subscription_plan_changed";

interface WebhookPayload {
  meta: {
    event_name: WebhookEvent;
    custom_data?: Record<string, any>;
  };
  data: {
    id: string;
    type: string;
    attributes: {
      store_id: number;
      customer_id: number;
      order_id: number;
      user_name: string;
      user_email: string;
      status: string;
      status_formatted: string;
      variant_id: number;
      [key: string]: any; // For any other attributes
    };
  };
}

export async function POST(req: NextRequest) {
  try {
    // Get the signature from the headers
    const headersList = await headers();
    const signature = headersList.get("x-signature");

    if (!signature) {
      console.error("No signature provided in the webhook request");
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Get the raw body for signature verification
    const rawBody = await req.text();

    // Verify the webhook signature
    const isValid = verifySignature(rawBody, signature);

    if (!isValid) {
      console.error("Invalid webhook signature");
      return new NextResponse("Invalid signature", { status: 401 });
    }

    // Parse the payload
    const payload = JSON.parse(rawBody) as WebhookPayload;
    const { event_name } = payload.meta;
    const { user_email } = payload.data.attributes;

    console.log(`Processing ${event_name} for ${user_email}`);

    // Handle different event types
    switch (event_name) {
      case "subscription_created":
        await handleSubscriptionCreated(payload);
        break;
      case "subscription_updated":
        await handleSubscriptionUpdated(payload);
        break;
      case "subscription_cancelled":
      case "subscription_expired":
        await handleSubscriptionCancelled(payload);
        break;
      case "subscription_payment_success":
        await handleSubscriptionPaymentSuccess(payload);
        break;
      case "subscription_payment_failed":
        await handleSubscriptionPaymentFailed(payload);
        break;
      // Add more event handlers as needed
    }

    return new NextResponse("Webhook processed successfully", { status: 200 });
  } catch (error) {
    console.error("Error processing webhook:", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}

// Verify the webhook signature from Lemon Squeezy
function verifySignature(payload: string, signature: string): boolean {
  try {
    const webhookSecret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET;

    if (!webhookSecret) {
      console.error("LEMONSQUEEZY_WEBHOOK_SECRET is not defined");
      return false;
    }

    const hmac = crypto.createHmac("sha256", webhookSecret);
    const digest = hmac.update(payload).digest("hex");

    return crypto.timingSafeEqual(Buffer.from(digest), Buffer.from(signature));
  } catch (error) {
    console.error("Error verifying signature:", error);
    return false;
  }
}

// Handler for subscription_created event
async function handleSubscriptionCreated(payload: WebhookPayload) {
  const { user_email, order_id, variant_id } = payload.data.attributes;

  try {
    // Find the user by email
    const usersSnapshot = await db
      .collection("users")
      .where("email", "==", user_email)
      .get();

    if (usersSnapshot.empty) {
      console.error(`No user found with email: ${user_email}`);
      return;
    }

    const userId = usersSnapshot.docs[0].id;

    // Update the user with subscription data
    await db
      .collection("users")
      .doc(userId)
      .update({
        subscription: {
          active: true,
          plan: getPlanFromVariantId(variant_id),
          subscriptionId: payload.data.id,
          orderId: order_id.toString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      });

    console.log(`Subscription created for user: ${userId}`);
  } catch (error) {
    console.error("Error handling subscription_created:", error);
  }
}

// Handler for subscription_updated event
async function handleSubscriptionUpdated(payload: WebhookPayload) {
  const { user_email, variant_id } = payload.data.attributes;

  try {
    // Find the user by email
    const usersSnapshot = await db
      .collection("users")
      .where("email", "==", user_email)
      .get();

    if (usersSnapshot.empty) {
      console.error(`No user found with email: ${user_email}`);
      return;
    }

    const userId = usersSnapshot.docs[0].id;
    const userDoc = usersSnapshot.docs[0];
    const userData = userDoc.data();

    // Update the subscription data
    await db
      .collection("users")
      .doc(userId)
      .update({
        subscription: {
          ...userData.subscription,
          plan: getPlanFromVariantId(variant_id),
          updatedAt: new Date().toISOString(),
        },
      });

    console.log(`Subscription updated for user: ${userId}`);
  } catch (error) {
    console.error("Error handling subscription_updated:", error);
  }
}

// Handler for subscription_cancelled or subscription_expired events
async function handleSubscriptionCancelled(payload: WebhookPayload) {
  const { user_email } = payload.data.attributes;

  try {
    // Find the user by email
    const usersSnapshot = await db
      .collection("users")
      .where("email", "==", user_email)
      .get();

    if (usersSnapshot.empty) {
      console.error(`No user found with email: ${user_email}`);
      return;
    }

    const userId = usersSnapshot.docs[0].id;
    const userDoc = usersSnapshot.docs[0];
    const userData = userDoc.data();

    // Update the subscription data
    await db
      .collection("users")
      .doc(userId)
      .update({
        subscription: {
          ...userData.subscription,
          active: false,
          cancelledAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      });

    console.log(`Subscription cancelled for user: ${userId}`);
  } catch (error) {
    console.error("Error handling subscription cancellation:", error);
  }
}

// Handler for subscription_payment_success event
async function handleSubscriptionPaymentSuccess(payload: WebhookPayload) {
  const { user_email } = payload.data.attributes;

  try {
    // Find the user by email
    const usersSnapshot = await db
      .collection("users")
      .where("email", "==", user_email)
      .get();

    if (usersSnapshot.empty) {
      console.error(`No user found with email: ${user_email}`);
      return;
    }

    const userId = usersSnapshot.docs[0].id;

    // Log the payment success
    await db.collection("payments").add({
      userId,
      email: user_email,
      eventType: "payment_success",
      subscriptionId: payload.data.id,
      amount: payload.data.attributes.total || 0,
      timestamp: new Date().toISOString(),
      paymentData: payload.data.attributes,
    });

    console.log(`Payment success recorded for user: ${userId}`);
  } catch (error) {
    console.error("Error handling payment success:", error);
  }
}

// Handler for subscription_payment_failed event
async function handleSubscriptionPaymentFailed(payload: WebhookPayload) {
  const { user_email } = payload.data.attributes;

  try {
    // Find the user by email
    const usersSnapshot = await db
      .collection("users")
      .where("email", "==", user_email)
      .get();

    if (usersSnapshot.empty) {
      console.error(`No user found with email: ${user_email}`);
      return;
    }

    const userId = usersSnapshot.docs[0].id;

    // Log the payment failure
    await db.collection("payments").add({
      userId,
      email: user_email,
      eventType: "payment_failed",
      subscriptionId: payload.data.id,
      timestamp: new Date().toISOString(),
      paymentData: payload.data.attributes,
    });

    console.log(`Payment failure recorded for user: ${userId}`);
  } catch (error) {
    console.error("Error handling payment failure:", error);
  }
}

// Get the plan name from the variant ID
function getPlanFromVariantId(variantId: number): string {
  // Map variant IDs to plan names - you'll need to update these with your actual variant IDs
  const planMap: Record<number, string> = {
    // Example: Replace these with your actual variant IDs from Lemon Squeezy
    1234: "basic",
    5678: "pro",
    9012: "enterprise",
  };

  return planMap[variantId] || "unknown";
}
