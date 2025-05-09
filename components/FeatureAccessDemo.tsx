"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useFeatureAccess } from "@/lib/hooks/use-feature-access";
import { AlertCircle, Check, Lock, X } from "lucide-react";
import Link from "next/link";

export function FeatureAccessDemo() {
  const {
    userPlan,
    isActive,
    canUseFeature,
    canAccessPlan,
    canConductInterview,
    availableFeatures,
    remainingInterviews,
  } = useFeatureAccess();

  const features = [
    {
      id: "mock_interviews_limited",
      name: "5 AI Mock Interviews",
      description: "Limited to 5 interviews per month",
    },
    {
      id: "mock_interviews_unlimited",
      name: "Unlimited AI Mock Interviews",
      description: "Conduct as many interviews as you need",
    },
    {
      id: "advanced_analytics",
      name: "Advanced Analytics",
      description: "Get detailed insights into your performance",
    },
    {
      id: "custom_interview_scenarios",
      name: "Custom Interview Scenarios",
      description: "Create tailored interview experiences",
    },
    {
      id: "learning_resources",
      name: "Learning Resources",
      description: "Access exclusive learning materials",
    },
    {
      id: "advanced_feedback_reports",
      name: "Advanced Feedback",
      description: "Get comprehensive feedback on your interviews",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="border rounded-lg p-6 bg-muted/20">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="text-lg font-medium">Your Current Plan</h3>
            <p className="text-sm text-muted-foreground">
              Access is based on your subscription level
            </p>
          </div>
          <div className="flex flex-col items-end">
            <div className="text-xl font-bold capitalize">
              {userPlan === "unknown" ? "Free" : userPlan}
            </div>
            {isActive ? (
              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full font-medium">
                Active
              </span>
            ) : (
              <span className="text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded-full font-medium">
                Inactive
              </span>
            )}
          </div>
        </div>

        {!isActive && (
          <div className="flex items-center gap-2 mb-4 p-2 bg-amber-50 border border-amber-200 rounded text-amber-800 text-sm">
            <AlertCircle className="h-4 w-4" />
            <span>
              You don&apos;t have an active subscription. Some features may be
              unavailable.
            </span>
          </div>
        )}

        {remainingInterviews > 0 && (
          <div className="flex items-center gap-2 mb-4 p-2 bg-blue-50 border border-blue-200 rounded text-blue-800 text-sm">
            <span>
              You have {remainingInterviews} interview credits remaining.
            </span>
          </div>
        )}

        <div className="mt-4">
          <h4 className="font-medium mb-3">Your interview access:</h4>
          <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-md">
            <div
              className={`p-1 rounded-full ${
                canConductInterview()
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {canConductInterview() ? (
                <Check className="h-4 w-4" />
              ) : (
                <X className="h-4 w-4" />
              )}
            </div>
            <div>
              <div className="font-medium">Interview Access</div>
              <div className="text-sm text-muted-foreground">
                {canConductInterview()
                  ? "You can conduct interviews"
                  : "Purchase interviews or upgrade your plan"}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 grid md:grid-cols-2 gap-3">
          {features.map((feature) => (
            <div
              key={feature.id}
              className={`border rounded-md p-3 ${
                canUseFeature(feature.id as any)
                  ? "bg-white"
                  : "bg-gray-50 opacity-70"
              }`}
            >
              <div className="flex justify-between">
                <div className="font-medium">{feature.name}</div>
                {!canUseFeature(feature.id as any) && (
                  <Lock className="h-4 w-4 text-muted-foreground" />
                )}
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                {feature.description}
              </p>
              <div className="mt-2 text-xs">
                {canUseFeature(feature.id as any) ? (
                  <span className="text-green-700 flex items-center gap-1">
                    <Check className="h-3 w-3" /> Available in your plan
                  </span>
                ) : (
                  <span className="text-muted-foreground">
                    Upgrade to access this feature
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 flex justify-center">
          <Button asChild>
            <Link href="/pricing">
              {isActive ? "Change Plan" : "Upgrade Now"}
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
