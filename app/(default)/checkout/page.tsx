"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

declare global {
  interface Window {
    createLemonSqueezy: () => {
      Setup: (attributes: {
        checkout: {
          embedUrl: string;
          success_url: string;
          cancel_url: string;
        };
        options: {
          embed: boolean;
          media: boolean;
          logo: boolean;
          desc: boolean;
          dark: boolean;
        };
      }) => {
        open: () => void;
      };
    };
  }
}

type PlanId = "single" | "pack" | "basic" | "pro";

// Use environment variables for store and variant IDs
const VARIANTS: Record<PlanId, string> = {
  single: process.env.NEXT_PUBLIC_LEMONSQUEEZY_SINGLE_INTERVIEW_VARIANT_ID!,
  pack: process.env.NEXT_PUBLIC_LEMONSQUEEZY_PACK_VARIANT_ID!,
  basic: process.env.NEXT_PUBLIC_LEMONSQUEEZY_BASIC_VARIANT_ID!,
  pro: process.env.NEXT_PUBLIC_LEMONSQUEEZY_PRO_VARIANT_ID!,
};

export default function CheckoutPage() {
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const planId = searchParams.get("plan") as PlanId | null;

  useEffect(() => {
    // Initialize LemonSqueezy
    const script = document.createElement("script");
    script.src = "https://app.lemonsqueezy.com/js/checkout.js";
    script.defer = true;

    script.onload = () => {
      setIsScriptLoaded(true);
      setIsLoading(false);
    };

    script.onerror = () => {
      console.error("Failed to load LemonSqueezy script");
      toast.error("Failed to load checkout. Please try again.");
      setIsLoading(false);
    };

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const getCheckoutTitle = () => {
    switch (planId) {
      case "single":
        return "Single Interview";
      case "pack":
        return "Interview Pack (5 Interviews)";
      case "basic":
        return "Basic Monthly Subscription";
      case "pro":
        return "Pro Monthly Subscription";
      default:
        return "Choose a Plan";
    }
  };

  const getCheckoutDescription = () => {
    switch (planId) {
      case "single":
        return "One complete AI-powered interview with detailed feedback";
      case "pack":
        return "5 AI-powered interviews with analytics and recordings";
      case "basic":
        return "10 interviews per month with basic features";
      case "pro":
        return "Unlimited interviews with all premium features";
      default:
        return "Please select a plan from the pricing page";
    }
  };

  const getPrice = () => {
    switch (planId) {
      case "single":
        return "$9";
      case "pack":
        return "$39";
      case "basic":
        return "$15/month";
      case "pro":
        return "$29/month";
      default:
        return "";
    }
  };

  const handleCheckout = async () => {
    if (!planId || !VARIANTS[planId]) {
      toast.error("Please select a valid plan");
      return;
    }

    if (!isScriptLoaded) {
      toast.error("Checkout is still initializing. Please try again.");
      return;
    }

    try {
      setIsLoading(true);
      const variantId = VARIANTS[planId];

      if (!variantId) {
        throw new Error("Invalid variant ID");
      }

      if (typeof window.createLemonSqueezy === "undefined") {
        throw new Error("LemonSqueezy checkout is not initialized");
      }

      window
        .createLemonSqueezy()
        .Setup({
          checkout: {
            embedUrl: `https://snaphire.lemonsqueezy.com/checkout/buy/${variantId}`,
            success_url: `${window.location.origin}/app/dashboard`,
            cancel_url: `${window.location.origin}/pricing`,
          },
          options: {
            embed: true,
            media: false,
            logo: true,
            desc: true,
            dark: document.documentElement.classList.contains("dark"),
          },
        })
        .open();
    } catch (error) {
      console.error("Checkout error:", error);
      toast.error("Failed to initialize checkout. Please try again.");
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
              disabled={isLoading || !isScriptLoaded}
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
