"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { auth } from "@/firebase/client";
import { onAuthStateChanged } from "firebase/auth";
import Link from "next/link";
import { useSubscription } from "@/lib/hooks/use-subscription";

type PlanId = "single" | "pack" | "lifetime" | "starter" | "pro";

const VARIANTS: Record<PlanId, string> = {
  single: process.env.NEXT_PUBLIC_LEMONSQUEEZY_SINGLE_INTERVIEW_VARIANT_ID!,
  pack: process.env.NEXT_PUBLIC_LEMONSQUEEZY_PACK_VARIANT_ID!,
  lifetime: process.env.NEXT_PUBLIC_LEMONSQUEEZY_LIFETIME_VARIANT_ID!,
  starter: process.env.NEXT_PUBLIC_LEMONSQUEEZY_STARTER_VARIANT_ID!,
  pro: process.env.NEXT_PUBLIC_LEMONSQUEEZY_PRO_VARIANT_ID!,
};

const PLAN_DATA: Record<
  PlanId,
  { title: string; description: string; price: string }
> = {
  single: {
    title: "One-Time Interview",
    description: "Perfect for a quick mock interview experience",
    price: "$1",
  },
  pack: {
    title: "5-Interview Pack",
    description: "Best value for focused preparation",
    price: "$4",
  },
  lifetime: {
    title: "Lifetime Unlimited Interviews",
    description: "Unlimited interviews forever with a one-time payment",
    price: "$20",
  },
  starter: {
    title: "Starter Subscription",
    description: "For students or job seekers just starting out",
    price: "$8/month",
  },
  pro: {
    title: "Pro Subscription",
    description: "For active job seekers needing advanced prep",
    price: "$15/month",
  },
};

function CheckoutContent() {
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const planId = searchParams.get("plan") as PlanId | null;

  const {
    subscription,
    isActive,
    isPlan,
    isLoading: subscriptionLoading,
  } = useSubscription();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user && user.email) {
        setUserEmail(user.email);
        localStorage.setItem("userEmail", user.email);
      } else {
        const storedEmail = localStorage.getItem("userEmail");
        setUserEmail(storedEmail);
      }
    });

    return () => unsubscribe();
  }, []);

  const hasSubscription =
    subscription?.plan === "pro" || subscription?.plan === "starter";
  const isPurchasingSubscription = planId === "starter" || planId === "pro";
  const hasActiveSubscription =
    hasSubscription && isActive && isPurchasingSubscription;

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
    return planId && PLAN_DATA[planId] ? PLAN_DATA[planId].price : "";
  };

  const handleCheckout = async () => {
    if (hasActiveSubscription) {
      toast.error("You already have an active subscription");
      return;
    }

    if (!planId || !VARIANTS[planId]) {
      toast.error("Please select a valid plan");
      return;
    }

    const variantId = VARIANTS[planId];
    console.log("Using variant ID:", variantId);

    const email = userEmail || auth.currentUser?.email;

    if (!email) {
      toast.error("Email is missing. Please sign in or provide your email.");
      return;
    }

    try {
      setIsLoading(true);

      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          variantId,
          email,
        }),
      });

      const data = await response.json();

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

      if (email) localStorage.setItem("userEmail", email);

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

  if (subscriptionLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin mb-4" />
        <p>Loading subscription information...</p>
      </div>
    );
  }

  if (hasActiveSubscription) {
    return (
      <div className="mx-auto w-full max-w-2xl px-4 py-20 sm:px-6">
        <Card className="items-center gap-0 p-10 text-center">
          <div className="flex flex-col items-center text-center">
            <span className="flex size-14 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-500">
              <AlertCircle className="size-7" />
            </span>
            <h1 className="mt-6 font-display text-3xl font-bold tracking-tight">
              Subscription already active
            </h1>
            <p className="mt-3 text-muted-foreground">
              You already have an active <strong>{subscription?.plan}</strong>{" "}
              subscription.
            </p>
          </div>

          <div className="mt-8 flex w-full max-w-sm flex-col gap-3">
            <Button asChild>
              <Link href="/settings">Manage subscription</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/pricing">View plans</Link>
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  if (!planId || !VARIANTS[planId]) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
        <h1 className="font-display text-2xl font-bold tracking-tight">
          No plan selected
        </h1>
        <p className="mt-3 text-muted-foreground">
          Please select a plan from our pricing page.
        </p>
        <Button asChild className="mt-8">
          <a href="/pricing">View pricing</a>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-20 sm:px-6">
      <Card className="overflow-hidden gap-0 p-0">
        <div className="border-b border-border/60 bg-gradient-to-br from-primary/10 via-card to-accent/10 p-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-wider text-primary">
            Checkout
          </p>
          <h1 className="mt-2 font-display text-3xl font-bold tracking-tight">
            {getCheckoutTitle()}
          </h1>
          <p className="mt-2 text-muted-foreground">{getCheckoutDescription()}</p>
        </div>

        <div className="space-y-8 p-8">
          <div className="flex flex-col items-center space-y-5">
            <div className="font-display text-4xl font-extrabold tracking-tight">
              {getPrice()}
            </div>
            <Button
              size="lg"
              className="w-full max-w-sm"
              onClick={handleCheckout}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Loading...
                </>
              ) : (
                "Proceed to checkout"
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

export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin mb-4" />
          <p>Loading checkout information...</p>
        </div>
      }
    >
      <CheckoutContent />
    </Suspense>
  );
}
