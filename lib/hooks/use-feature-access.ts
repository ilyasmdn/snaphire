"use client";

import { useSubscriptionContext } from "@/components/providers/SubscriptionProvider";
import { usePurchases } from "@/lib/hooks/use-purchases";
import {
  FeatureName,
  hasFeatureAccess,
  hasPlanAccess,
  hasInterviewAccess,
  getAvailableFeatures,
  getPlanRequiredForFeature,
} from "@/lib/utils/feature-access";
import { SubscriptionPlan } from "@/lib/hooks/use-subscription";

/**
 * Hook to check feature access based on user's subscription and purchases
 */
export function useFeatureAccess() {
  const { subscription, isActive, isPlan } = useSubscriptionContext();
  const { getTotalRemainingInterviews } = usePurchases();

  const userPlan = isActive ? (subscription?.plan as SubscriptionPlan) : "free";
  const remainingInterviews = getTotalRemainingInterviews();

  /**
   * Check if user can access a specific feature
   */
  const canUseFeature = (feature: FeatureName): boolean => {
    return hasFeatureAccess(feature, userPlan);
  };

  /**
   * Check if user can access features of a minimum plan level
   */
  const canAccessPlan = (minimumPlan: SubscriptionPlan): boolean => {
    return hasPlanAccess(userPlan, minimumPlan);
  };

  /**
   * Check if user can conduct an interview based on subscription or purchases
   */
  const canConductInterview = (): boolean => {
    return hasInterviewAccess(userPlan, remainingInterviews);
  };

  /**
   * Get all features available to the current user
   */
  const availableFeatures = (): FeatureName[] => {
    return getAvailableFeatures(userPlan);
  };

  /**
   * Get the plan required for a specific feature
   */
  const requiredPlanForFeature = (feature: FeatureName): SubscriptionPlan => {
    return getPlanRequiredForFeature(feature);
  };

  return {
    userPlan,
    isActive,
    isPlan,
    canUseFeature,
    canAccessPlan,
    canConductInterview,
    availableFeatures,
    requiredPlanForFeature,
    remainingInterviews,
  };
}
