"use client";

import { useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2, Clock, Loader2 } from "lucide-react";
import { useSubscriptionContext } from "@/components/providers/SubscriptionProvider";
import { formatDate } from "@/lib/utils";
import { SubscriptionPlan } from "@/lib/hooks/use-subscription";

interface PlanFeature {
  name: string;
  included: boolean;
}

const PLAN_FEATURES: Record<SubscriptionPlan, PlanFeature[]> = {
  free: [
    { name: "Basic profile", included: true },
    { name: "Limited mock interviews", included: false },
    { name: "Basic analytics", included: false },
    { name: "Custom interview scenarios", included: false },
    { name: "Learning resources", included: false },
    { name: "Priority support", included: false },
  ],
  starter: [
    { name: "5 AI-powered mock interviews per month", included: true },
    { name: "Basic performance analytics", included: true },
    { name: "Standard question bank access", included: true },
    { name: "Email support", included: true },
    { name: "Custom interview scenarios", included: false },
    { name: "Learning resources", included: false },
  ],
  pro: [
    { name: "Unlimited AI-powered mock interviews", included: true },
    { name: "Advanced performance analytics", included: true },
    { name: "Advanced feedback reports", included: true },
    { name: "Custom interview scenarios", included: true },
    { name: "Access to extra learning resources", included: true },
    { name: "Priority email support", included: true },
  ],
  teams: [
    { name: "Everything in Pro", included: true },
    { name: "Admin/team dashboard", included: true },
    { name: "Bulk user invites", included: true },
    { name: "API access", included: true },
    { name: "Dedicated success manager", included: true },
    { name: "24/7 support", included: true },
  ],
  unknown: [],
};

const PLAN_PRICE: Record<SubscriptionPlan, string> = {
  free: "$0",
  starter: "$12",
  pro: "$24",
  teams: "Custom",
  unknown: "",
};

export function SubscriptionManagement() {
  const [isLoading, setIsLoading] = useState(false);
  const { subscription, isActive, isPlan } = useSubscriptionContext();

  const handleManageSubscription = async () => {
    setIsLoading(true);
    try {
      // Here you would call an API endpoint to get a customer portal URL from Lemon Squeezy
      // For now we'll just simulate a redirect to the pricing page
      window.location.href = "/pricing";
    } catch (error) {
      console.error("Error opening customer portal:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const currentPlan = subscription?.plan || "free";
  const planFeatures = PLAN_FEATURES[currentPlan] || PLAN_FEATURES.free;

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold">Subscription</h2>
          <p className="text-muted-foreground mt-1">
            Manage your subscription and billing
          </p>
        </div>

        <div className="flex items-center justify-between border-b pb-4">
          <div>
            <h3 className="font-medium">Current Plan</h3>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xl font-bold capitalize">
                {currentPlan === "unknown" ? "Free" : currentPlan}
              </span>
              {isActive && (
                <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700">
                  <CheckCircle2 className="mr-1 h-3 w-3" />
                  Active
                </span>
              )}
            </div>
            <div className="text-sm text-muted-foreground mt-1">
              <span className="font-semibold">{PLAN_PRICE[currentPlan]}</span>
              {currentPlan !== "free" && currentPlan !== "teams"
                ? "/month"
                : ""}
            </div>
          </div>

          <div>
            {isLoading ? (
              <Button disabled>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Loading...
              </Button>
            ) : isActive ? (
              <Button onClick={handleManageSubscription}>
                Manage Subscription
              </Button>
            ) : (
              <Button asChild>
                <Link href="/pricing">Upgrade</Link>
              </Button>
            )}
          </div>
        </div>

        {/* Subscription Details */}
        {isActive && subscription && (
          <div className="space-y-4 border-b pb-4">
            <div>
              <h4 className="font-medium">Subscription Details</h4>
              {subscription.subscriptionId && (
                <p className="text-sm text-muted-foreground mt-1">
                  Subscription ID: {subscription.subscriptionId.slice(-8)}
                </p>
              )}
              {subscription.createdAt && (
                <p className="text-sm text-muted-foreground">
                  <Clock className="inline-block mr-1 h-3 w-3" />
                  Started: {formatDate(subscription.createdAt)}
                </p>
              )}
              {subscription.updatedAt &&
                subscription.updatedAt !== subscription.createdAt && (
                  <p className="text-sm text-muted-foreground">
                    Last Updated: {formatDate(subscription.updatedAt)}
                  </p>
                )}
            </div>

            <div className="flex justify-end">
              <Button variant="outline" size="sm" asChild>
                <Link href="/settings/billing">View Billing History</Link>
              </Button>
            </div>
          </div>
        )}

        {/* Plan Features */}
        <div>
          <h4 className="font-medium mb-4">Included Features</h4>
          <ul className="space-y-3">
            {planFeatures.map((feature) => (
              <li key={feature.name} className="flex items-start">
                <div
                  className={`mr-3 ${
                    feature.included ? "text-green-500" : "text-gray-300"
                  }`}
                >
                  <CheckCircle2 className="h-5 w-5" />
                </div>
                <span
                  className={feature.included ? "" : "text-muted-foreground"}
                >
                  {feature.name}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Call to Action */}
        {!isPlan("teams") && (
          <div className="flex justify-end pt-4">
            <Button asChild variant={isPlan("pro") ? "outline" : "default"}>
              <Link href="/pricing" className="inline-flex items-center">
                {isPlan("pro") ? "Compare Plans" : "Upgrade Now"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
}
