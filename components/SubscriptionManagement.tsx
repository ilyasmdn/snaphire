"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  CreditCard,
  Loader2,
  Package,
  Tag,
  Timer,
} from "lucide-react";
import { useSubscriptionContext } from "@/components/providers/SubscriptionProvider";
import { formatDate } from "@/lib/utils";
import { SubscriptionPlan } from "@/lib/hooks/use-subscription";
import { usePurchases } from "@/lib/hooks/use-purchases";
import { toast } from "sonner";

interface PlanFeature {
  name: string;
  included: boolean;
}

const PLAN_FEATURES: Record<SubscriptionPlan, PlanFeature[]> = {
  free: [
    { name: "Basic profile", included: true },
    { name: "Limited mock interviews", included: false },
    { name: "Basic analytics", included: false },
    { name: "Standard question bank", included: false },
    { name: "Email support", included: false },
  ],
  starter: [
    { name: "15 AI-powered mock interviews per month", included: true },
    { name: "Basic performance analytics", included: true },
    { name: "Standard question bank access", included: true },
    { name: "Email support", included: true },
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
  starter: "$8",
  pro: "$15",
  teams: "Custom",
  unknown: "",
};

export function SubscriptionManagement() {
  const [activeTab, setActiveTab] = useState<"subscription" | "purchases">(
    "subscription"
  );
  const [isLoading, setIsLoading] = useState(false);
  const [monthlyInterviewsUsed, setMonthlyInterviewsUsed] = useState<number>(0);
  const [isLoadingInterviewCount, setIsLoadingInterviewCount] = useState(false);
  const { subscription, isActive, isPlan } = useSubscriptionContext();
  const { purchases, getActivePurchases, getTotalRemainingInterviews } =
    usePurchases();
  // Fetch the number of interviews used in the current month for starter plan users
  useEffect(() => {
    const fetchMonthlyInterviewUsage = async () => {
      if (isActive && subscription?.plan === "starter") {
        setIsLoadingInterviewCount(true);
        try {
          // Get the current month's interviews
          const response = await fetch("/api/user/interviews");

          if (!response.ok) {
            throw new Error("Failed to fetch interviews");
          }

          const data = await response.json();
          const interviews = data.interviews || []; // Filter interviews from the current month
          const now = new Date();
          const firstDayOfMonth = new Date(
            now.getFullYear(),
            now.getMonth(),
            1
          );

          const thisMonthsInterviews = interviews.filter((interview: any) => {
            const interviewDate = new Date(interview.createdAt);

            // Only count interviews that:
            // 1. Were created this month
            // 2. Did NOT use a one-time purchase (exclude usedPurchase === true)
            return interviewDate >= firstDayOfMonth && !interview.usedPurchase;
          });

          setMonthlyInterviewsUsed(thisMonthsInterviews.length);
        } catch (error) {
          console.error("Error fetching interview usage:", error);
        } finally {
          setIsLoadingInterviewCount(false);
        }
      }
    };

    fetchMonthlyInterviewUsage();
  }, [isActive, subscription?.plan]);

  const handleManageSubscription = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/user/subscription/manage", {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Failed to generate customer portal link");
      }

      const { url } = await response.json();

      if (url) {
        window.location.href = url;
      } else {
        throw new Error("No portal URL returned");
      }
    } catch (error) {
      console.error("Error opening customer portal:", error);
      toast.error("Failed to open customer portal. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const currentPlan = subscription?.plan || "free";
  const planFeatures = PLAN_FEATURES[currentPlan] || PLAN_FEATURES.free;
  const activePurchases = getActivePurchases();
  const remainingInterviews = getTotalRemainingInterviews();

  return (
    <div className="space-y-6">
      <div className="flex border-b">
        <button
          onClick={() => setActiveTab("subscription")}
          className={`px-4 py-2 flex items-center gap-2 ${
            activeTab === "subscription"
              ? "border-b-2 border-primary font-medium text-primary"
              : "text-muted-foreground"
          }`}
        >
          <CreditCard className="h-4 w-4" />
          Subscription
        </button>
        <button
          onClick={() => setActiveTab("purchases")}
          className={`px-4 py-2 flex items-center gap-2 ${
            activeTab === "purchases"
              ? "border-b-2 border-primary font-medium text-primary"
              : "text-muted-foreground"
          }`}
        >
          <Tag className="h-4 w-4" />
          Individual Purchases
        </button>
      </div>

      {activeTab === "subscription" ? (
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
                  {isActive ? (
                    <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700">
                      <CheckCircle2 className="mr-1 h-3 w-3" />
                      Active
                    </span>
                  ) : (
                    <span className="inline-flex items-center rounded-full bg-amber-50 px-2 py-1 text-xs font-medium text-amber-700">
                      <CheckCircle2 className="mr-1 h-3 w-3" />
                      Inactive
                    </span>
                  )}
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  <span className="font-semibold">
                    {PLAN_PRICE[currentPlan]}
                  </span>
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
                ) : (
                  <Button onClick={handleManageSubscription}>
                    Manage Subscription
                  </Button>
                )}
              </div>
            </div>{" "}
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

                  {/* Monthly interview limit info for starter plan */}
                  {isPlan("starter") && (
                    <div className="mt-3 p-3 bg-muted/40 rounded-lg">
                      <h5 className="text-sm font-medium mb-1">
                        Monthly Interview Usage
                      </h5>
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-muted-foreground">
                          {isLoadingInterviewCount ? (
                            <span className="flex items-center">
                              <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                              Loading...
                            </span>
                          ) : (
                            <>
                              <span>{monthlyInterviewsUsed} used</span>
                              <span className="mx-1">/</span>
                              <span>15 included</span>
                            </>
                          )}
                        </p>
                        <span
                          className={`text-xs px-1.5 py-0.5 rounded-full font-medium 
                            ${
                              monthlyInterviewsUsed >= 15
                                ? "bg-amber-100 text-amber-700"
                                : "bg-green-100 text-green-700"
                            }`}
                        >
                          {15 - monthlyInterviewsUsed} remaining
                        </span>
                      </div>
                      <div className="mt-2 w-full bg-gray-200 rounded-full h-1.5">
                        <div
                          className="bg-primary h-1.5 rounded-full transition-all"
                          style={{
                            width: `${(monthlyInterviewsUsed / 5) * 100}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex justify-end">
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/settings/billing">View Billing History</Link>
                  </Button>
                </div>
              </div>
            )}
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
                      className={
                        feature.included ? "" : "text-muted-foreground"
                      }
                    >
                      {feature.name}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
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
      ) : (
        <Card className="p-6">
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold">Individual Purchases</h2>
              <p className="text-muted-foreground mt-1">
                Manage your one-time interview purchases
              </p>
            </div>

            <div className="flex flex-col md:flex-row gap-4 border-b pb-4">
              <div className="flex-1 bg-muted/40 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-primary/10">
                    <Package className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">
                      Active Purchases
                    </div>
                    <div className="text-2xl font-bold">
                      {activePurchases.length}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex-1 bg-muted/40 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-primary/10">
                    <Timer className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">
                      Remaining Interviews
                    </div>
                    <div className="text-2xl font-bold">
                      {remainingInterviews}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {activePurchases.length > 0 ? (
              <div>
                <h4 className="font-medium mb-3">Active Purchases</h4>
                <div className="space-y-4">
                  {activePurchases.map((purchase) => (
                    <div key={purchase.id} className="border rounded-md p-4">
                      <div className="flex justify-between">
                        <div>
                          <div className="font-medium">
                            {purchase.type === "single"
                              ? "Single Interview"
                              : "5-Interview Pack"}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {purchase.interviewCount - purchase.interviewsUsed}{" "}
                            of {purchase.interviewCount} remaining
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-muted-foreground">
                            Expires
                          </div>
                          <div className="font-medium">
                            {formatDate(purchase.expiryDate)}
                          </div>
                        </div>
                      </div>
                      <div className="mt-3 flex justify-between items-center">
                        <div className="text-sm text-muted-foreground">
                          Purchased: {formatDate(purchase.purchaseDate)}
                        </div>
                        <Button size="sm" asChild>
                          <Link href="/generate-interview">Use Now</Link>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-6">
                <Package className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                <h3 className="text-lg font-medium mb-2">
                  No Active Purchases
                </h3>
                <p className="text-muted-foreground mb-4">
                  You don't have any active interview purchases
                </p>
                <Button asChild>
                  <Link href="/pricing?tab=pay-per-interview">
                    Buy Interviews
                  </Link>
                </Button>
              </div>
            )}

            <div className="flex justify-end pt-4 border-t">
              <Button asChild>
                <Link
                  href="/pricing?tab=pay-per-interview"
                  className="inline-flex items-center"
                >
                  Purchase Interviews
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
