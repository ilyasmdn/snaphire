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
    }    // Parse the payload
    const payload = JSON.parse(rawBody) as WebhookPayload;
    const { event_name } = payload.meta;
    const { user_email, variant_id, order_id } = payload.data.attributes;

    console.log(`Processing ${event_name} for ${user_email}`);
    console.log(`Webhook details - Event: ${event_name}, Email: ${user_email}, Order ID: ${order_id}, Variant ID: ${variant_id}`);
    
    // Log environment variables for debugging variant IDs
    console.log(`Environment variables for variants: 
      Single: ${process.env.NEXT_PUBLIC_LEMONSQUEEZY_SINGLE_INTERVIEW_VARIANT_ID}, 
      Pack: ${process.env.NEXT_PUBLIC_LEMONSQUEEZY_PACK_VARIANT_ID}, 
      Starter: ${process.env.NEXT_PUBLIC_LEMONSQUEEZY_STARTER_VARIANT_ID}, 
      Pro: ${process.env.NEXT_PUBLIC_LEMONSQUEEZY_PRO_VARIANT_ID}`);

    // Handle different event types
    switch (event_name) {
      case "order_created":
        await handleOrderCreated(payload);
        break;
      case "order_refunded":
        await handleOrderRefunded(payload);
        break;
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

// Handler for order_created event (one-time purchases)
async function handleOrderCreated(payload: WebhookPayload) {
  const { user_email, order_id, variant_id } = payload.data.attributes;
  
  console.log(`🔍 handleOrderCreated called with:
    Email: ${user_email}
    Order ID: ${order_id}
    Variant ID: ${variant_id}
    Full payload:`, JSON.stringify(payload.data.attributes));

  try {
    // Find the user by email
    console.log(`Looking for user with email: ${user_email}`);
    const usersSnapshot = await db
      .collection("users")
      .where("email", "==", user_email)
      .get();

    if (usersSnapshot.empty) {
      console.error(`❌ No user found with email: ${user_email}`);
      return;
    }

    const userId = usersSnapshot.docs[0].id;
    console.log(`✅ Found user with ID: ${userId}`);    // Determine the purchase type and interview count based on the variant
    console.log(`Mapping variant ID ${variant_id} to purchase type`);
    const purchaseType = getPlanFromVariantId(variant_id);
    console.log(`Mapped variant ID ${variant_id} to purchase type: ${purchaseType}`);
    
    const interviewCount =
      purchaseType === "single" ? 1 : purchaseType === "pack" ? 5 : 0;
    console.log(`Interview count for ${purchaseType}: ${interviewCount}`);

    if (interviewCount === 0) {
      console.error(`❌ Invalid interview purchase variant: ${variant_id}`);
      return;
    }

    // Calculate expiry date (6 months from now)
    const expiryDate = new Date();
    expiryDate.setMonth(expiryDate.getMonth() + 6);
    console.log(`Set expiry date to: ${expiryDate.toISOString()}`);

    // Prepare purchase record
    const purchaseRecord = {
      userId,
      type: purchaseType,
      interviewCount,
      interviewsUsed: 0,
      orderId: order_id.toString(),
      purchaseDate: new Date().toISOString(),
      expiryDate: expiryDate.toISOString(),
      amount: payload.data.attributes.total || 0,
      isActive: true,
    };
    
    console.log(`Attempting to create purchase record in database:`, purchaseRecord);
    
    try {
      // Create a purchase record in the database
      const purchaseRef = await db.collection("purchases").add(purchaseRecord);
      console.log(`✅ Purchase record created successfully with ID: ${purchaseRef.id}`);
    } catch (dbError) {
      console.error(`❌ Error creating purchase record:`, dbError);
      throw dbError;
    }

    console.log(
      `Purchase created for user: ${userId}, interviews: ${interviewCount}`
    );
  } catch (error) {
    console.error("Error handling order_created:", error);
  }
}

// Handler for order_refunded event
async function handleOrderRefunded(payload: WebhookPayload) {
  const { user_email, order_id } = payload.data.attributes;

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

    // Find the purchase with the matching order ID
    const purchasesSnapshot = await db
      .collection("purchases")
      .where("userId", "==", userId)
      .where("orderId", "==", order_id.toString())
      .get();

    if (purchasesSnapshot.empty) {
      console.error(`No purchase found with order ID: ${order_id}`);
      return;
    }

    // Deactivate the purchase
    const purchaseId = purchasesSnapshot.docs[0].id;
    await db.collection("purchases").doc(purchaseId).update({
      isActive: false,
      refundedAt: new Date().toISOString(),
    });

    // Log the refund
    await db.collection("payments").add({
      userId,
      email: user_email,
      eventType: "order_refunded",
      orderId: order_id.toString(),
      timestamp: new Date().toISOString(),
      refundData: payload.data.attributes,
    });

    console.log(`Purchase refunded for user: ${userId}, order: ${order_id}`);
  } catch (error) {
    console.error("Error handling order_refunded:", error);
  }
}

// Get the plan name from the variant ID
function getPlanFromVariantId(variantId: number): string {
  console.log(`🔍 Getting plan for variant ID: ${variantId}`);
  
  // Get variant IDs from environment variables
  const starterVariantId =
    process.env.NEXT_PUBLIC_LEMONSQUEEZY_STARTER_VARIANT_ID;
  const proVariantId = process.env.NEXT_PUBLIC_LEMONSQUEEZY_PRO_VARIANT_ID;
  const singleVariantId =
    process.env.NEXT_PUBLIC_LEMONSQUEEZY_SINGLE_INTERVIEW_VARIANT_ID;
  const packVariantId = process.env.NEXT_PUBLIC_LEMONSQUEEZY_PACK_VARIANT_ID;

  console.log(`Environment variables:
    Starter: ${starterVariantId}
    Pro: ${proVariantId}
    Single: ${singleVariantId}
    Pack: ${packVariantId}`);

  // Convert environment variable strings to numbers for comparison
  const planMap: Record<string, string> = {
    [starterVariantId || ""]: "starter",
    [proVariantId || ""]: "pro",
    [singleVariantId || ""]: "single",
    [packVariantId || ""]: "pack",
  };

  // Convert the incoming variantId to a string for comparison with env vars
  const variantIdStr = variantId.toString();
  console.log(`Looking up plan for variant ID string: "${variantIdStr}"`);
  console.log(`Plan map:`, planMap);
  
  const plan = planMap[variantIdStr] || "unknown";
  console.log(`Mapped plan: ${plan}`);
  
  return plan;
}
