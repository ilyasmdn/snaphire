"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { auth } from "@/firebase/client";
import { onAuthStateChanged } from "firebase/auth";

// Updated to match pricing page plan names
type PlanId = "single" | "pack" | "starter" | "pro";

// Use environment variables for store and variant IDs
const VARIANTS: Record<PlanId, string> = {
  single: process.env.NEXT_PUBLIC_LEMONSQUEEZY_SINGLE_INTERVIEW_VARIANT_ID!,
  pack: process.env.NEXT_PUBLIC_LEMONSQUEEZY_PACK_VARIANT_ID!,
  starter: process.env.NEXT_PUBLIC_LEMONSQUEEZY_STARTER_VARIANT_ID!,
  pro: process.env.NEXT_PUBLIC_LEMONSQUEEZY_PRO_VARIANT_ID!,
};

// Pricing data from pricing page
const PLAN_DATA: Record<PlanId, { title: string; description: string; price: string }> = {
  single: {
    title: "One-Time Interview",
    description: "Perfect for a quick mock interview experience",
    price: "$5",
  },
  pack: {
    title: "5-Interview Pack",
    description: "Best value for focused preparation",
    price: "$20",
  },
  starter: {
    title: "Starter Subscription",
    description: "For students or job seekers just starting out",
    price: "$12/month",
  },
  pro: {
    title: "Pro Subscription",
    description: "For active job seekers needing advanced prep",
    price: "$24/month",
  },
};

export default function CheckoutPage() {
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false); // Set to false initially since we're not loading scripts
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const planId = searchParams.get("plan") as PlanId | null;

  // Listen to auth state changes to get the user's email
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user && user.email) {
        setUserEmail(user.email);
        // Also store in localStorage as a backup
        localStorage.setItem("userEmail", user.email);
      } else {
        // Try to get from localStorage as fallback
        const storedEmail = localStorage.getItem("userEmail");
        setUserEmail(storedEmail);
      }
    });

    return () => unsubscribe();
  }, []);

  const getCheckoutTitle = () => {
    return planId && PLAN_DATA[planId] 
      ? PLAN_DATA[planId].title 
      : "Choose a Plan";
  };

  const getCheckoutDescription = () => {
    return planId && PLAN_DATA[planId] 
      ? PLAN_DATA[planId].description 
      : "Please select a plan from the pricing page";
  };

  const getPrice = () => {
    return planId && PLAN_DATA[planId] 
      ? PLAN_DATA[planId].price 
      : "";
  };

  const handleCheckout = async () => {
    if (!planId || !VARIANTS[planId]) {
      toast.error("Please select a valid plan");
      return;
    }

    const variantId = VARIANTS[planId];
    console.log("Using variant ID:", variantId);

    // First try to get email from state (which is populated from Firebase Auth)
    const email =
      userEmail || auth.currentUser?.email;

    if (!email) {
      toast.error("Email is missing. Please sign in or provide your email.");
      return;
    }

    try {
      setIsLoading(true);

      // Make the API call to create a checkout session
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          variantId,
          email,
        }),
      });

      // Get the response data
      const data = await response.json();

      // Check if the response was successful
      if (!response.ok) {
        console.error("API error response:", data);
        throw new Error(
          data.error || data.message || "Failed to start checkout"
        );
      }

      if (!data.url) {
        console.error("No URL in response:", data);
        throw new Error("No checkout URL returned");
      }

      // Store email in localStorage as a backup
      if (email) localStorage.setItem("userEmail", email);

      // Redirect to the checkout URL
      console.log("Redirecting to:", data.url);
      window.location.href = data.url;
    } catch (error: any) {
      console.error("Checkout error:", error);
      toast.error(
        error.message || "Failed to initialize checkout. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (!planId || !VARIANTS[planId]) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <h1 className="text-2xl font-bold mb-4">No Plan Selected</h1>
        <p className="text-muted-foreground mb-8">
          Please select a plan from our pricing page.
        </p>
        <Button asChild>
          <a href="/pricing">View Pricing</a>
        </Button>
      </div>
    );
  }

  return (
    <div className="container max-w-2xl mx-auto py-16 px-4">
      <Card className="p-8">
        <div className="space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">{getCheckoutTitle()}</h1>
            <p className="text-muted-foreground">{getCheckoutDescription()}</p>
          </div>

          <div className="flex flex-col items-center space-y-4 py-4">
            <div className="text-4xl font-bold">{getPrice()}</div>
            <Button
              size="lg"
              className="w-full max-w-sm"
              onClick={handleCheckout}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Loading...
                </>
              ) : (
                "Proceed to Checkout"
              )}
            </Button>
          </div>

          <div className="text-center text-sm text-muted-foreground">
            <p>Secure payment powered by LemonSqueezy</p>
            <p className="mt-2">
              By proceeding, you agree to our{" "}
              <a href="/terms" className="underline hover:text-primary">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="/privacy" className="underline hover:text-primary">
                Privacy Policy
              </a>
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
