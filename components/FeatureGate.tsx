"use client";

import { useFeatureAccess } from "@/lib/hooks/use-feature-access";
import { FeatureName } from "@/lib/utils/feature-access";
import { ReactNode } from "react";
import { SubscriptionPlan } from "@/lib/hooks/use-subscription";
import { Button } from "@/components/ui/button";
import { Lock } from "lucide-react";
import Link from "next/link";

interface FeatureGateProps {
  /**
   * The content to render if the user has access
   */
  children: ReactNode;

  /**
   * The specific feature name that is required
   */
  feature?: FeatureName;

  /**
   * The minimum plan required (alternative to specifying a feature)
   */
  minimumPlan?: SubscriptionPlan;

  /**
   * Optional content to render if the user doesn't have access
   * If not provided, a default upgrade message will be shown
   */
  fallback?: ReactNode;

  /**
   * Whether to allow access if the user has purchased interviews
   * (only relevant for interview-related features)
   */
  checkPurchases?: boolean;
}

/**
 * Component that conditionally renders content based on the user's subscription
 * Can check access based on a specific feature or a minimum plan level
 */
export function FeatureGate({
  children,
  feature,
  minimumPlan,
  fallback,
  checkPurchases = false,
}: FeatureGateProps) {
  const {
    canUseFeature,
    canAccessPlan,
    canConductInterview,
    requiredPlanForFeature,
  } = useFeatureAccess();

  // Determine if user has access
  let hasAccess = false;

  if (
    checkPurchases &&
    (feature?.includes("interview") ||
      feature === "mock_interviews_limited" ||
      feature === "mock_interviews_unlimited")
  ) {
    hasAccess = canConductInterview();
  } else if (feature) {
    hasAccess = canUseFeature(feature);
  } else if (minimumPlan) {
    hasAccess = canAccessPlan(minimumPlan);
  }

  // If user has access, render the children
  if (hasAccess) {
    return <>{children}</>;
  }

  // If a custom fallback is provided, use that
  if (fallback) {
    return <>{fallback}</>;
  }

  // Determine the plan needed for upgrade messaging
  let requiredPlan =
    minimumPlan || (feature ? requiredPlanForFeature(feature) : "starter");

  // Default fallback with upgrade message
  return (
    <div className="border border-dashed rounded-md p-6 bg-muted/20 flex flex-col items-center justify-center text-center">
      <Lock className="h-10 w-10 text-muted-foreground mb-3" />
      <h3 className="text-lg font-medium mb-2">Feature Restricted</h3>
      <p className="text-muted-foreground mb-4 max-w-xs">
        This feature requires a{" "}
        <span className="font-semibold capitalize">{requiredPlan}</span> plan or
        higher.
      </p>
      <Button asChild>
        <Link href="/pricing">Upgrade Now</Link>
      </Button>
    </div>
  );
}
