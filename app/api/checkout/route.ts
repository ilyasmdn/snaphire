import { NextResponse } from "next/server";
import {
  getAuthenticatedUser,
  lemonSqueezySetup,
  createCheckout,
} from "@lemonsqueezy/lemonsqueezy.js";

export async function POST(req: Request) {
  const body = await req.json();
  const { variantId, email } = body;

  if (!variantId || !email) {
    return NextResponse.json({ error: "Missing data" }, { status: 400 });
  }

  try {
    const apiKey = process.env.LEMONSQUEEZY_API_KEY!;

    lemonSqueezySetup({
      apiKey,
      onError: (error) => console.error("Error!", error),
    });

    // First verify the API connection
    const userResult = await getAuthenticatedUser();

    if (userResult.error) {
      console.error("Authentication failed:", userResult.error.message);
      return NextResponse.json(
        { error: userResult.error.message },
        { status: 500 }
      );
    } // Log the checkout request
    console.log(`Creating checkout with:
      Store ID: ${process.env.LEMONSQUEEZY_STORE_ID}
      Variant ID: ${variantId}
      Email: ${email}
    `);

    // Create checkout
    const { data: checkout, error: checkoutError } = await createCheckout(
      Number(process.env.LEMONSQUEEZY_STORE_ID),
      Number(variantId),
      {
        checkoutData: {
          email,
          custom: {},
        },
      }
    );

    if (checkoutError) {
      console.error("Checkout creation failed:", checkoutError);
      return NextResponse.json(
        { error: checkoutError.message },
        { status: 500 }
      );
    }

    if (!checkout) {
      return NextResponse.json(
        { error: "No checkout data returned" },
        { status: 500 }
      );
    }

    // Extract and log the checkout object structure to better understand it
    console.log("Checkout object keys:", Object.keys(checkout));

    // Based on the Checkout type in the SDK, try to access the correct URL property
    // This is a temporary solution to get to work with the current types
    const checkoutUrl =
      checkout.data?.attributes?.url ||
      // @ts-ignore - Accessing potential properties that might exist but aren't in the type definitions
      checkout.url ||
      // @ts-ignore
      checkout.checkout_url;

    if (!checkoutUrl) {
      console.error("No URL found in checkout response:", checkout);
      return NextResponse.json(
        { error: "Could not extract checkout URL" },
        { status: 500 }
      );
    }

    return NextResponse.json({ url: checkoutUrl });
  } catch (e) {
    console.error("Unexpected error during checkout:", e);
    return NextResponse.json(
      {
        error: "An unexpected error occurred",
      },
      {
        status: 500,
      }
    );
  }
}
