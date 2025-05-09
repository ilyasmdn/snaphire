import { SubscriptionPlan } from "@/lib/hooks/use-subscription";

// Define the features of the application
export type FeatureName =
  | "mock_interviews_limited" // 5 interviews for starter plan
  | "mock_interviews_unlimited" // unlimited interviews for pro/teams plans
  | "basic_analytics" // basic analytics for starter plan
  | "advanced_analytics" // advanced analytics for pro/teams plans
  | "standard_question_bank" // standard questions for starter plan
  | "custom_interview_scenarios" // for pro/teams plans
  | "learning_resources" // for pro/teams plans
  | "basic_feedback_reports" // for starter plan
  | "advanced_feedback_reports" // for pro/teams plans
  | "admin_dashboard" // for teams plan
  | "bulk_user_invites" // for teams plan
  | "api_access" // for teams plan
  | "email_support" // for starter plan
  | "priority_support" // for pro/teams plans
  | "dedicated_success_manager"; // for teams plan

// Define which features are available for each subscription tier
export const FEATURE_ACCESS: Record<SubscriptionPlan, FeatureName[]> = {
  free: [],
  starter: [
    "mock_interviews_limited",
    "basic_analytics",
    "standard_question_bank",
    "basic_feedback_reports",
    "email_support",
  ],
  pro: [
    "mock_interviews_unlimited",
    "advanced_analytics",
    "standard_question_bank",
    "custom_interview_scenarios",
    "learning_resources",
    "advanced_feedback_reports",
    "priority_support",
  ],
  teams: [
    "mock_interviews_unlimited",
    "advanced_analytics",
    "standard_question_bank",
    "custom_interview_scenarios",
    "learning_resources",
    "advanced_feedback_reports",
    "admin_dashboard",
    "bulk_user_invites",
    "api_access",
    "priority_support",
    "dedicated_success_manager",
  ],
  unknown: [],
};

// Define plan level hierarchy for comparing subscription tiers
export const PLAN_LEVELS: Record<SubscriptionPlan, number> = {
  free: 0,
  starter: 1,
  pro: 2,
  teams: 3,
  unknown: -1,
};

/**
 * Checks if a specific feature is available in a subscription plan
 * @param feature The feature to check access for
 * @param userPlan The user's current subscription plan
 * @returns boolean indicating if the user can access the feature
 */
export function hasFeatureAccess(
  feature: FeatureName,
  userPlan: SubscriptionPlan
): boolean {
  // If the user plan is unknown or doesn't exist, default to free
  const plan = userPlan || "free";

  // Check if the feature is directly included in the user's plan
  return FEATURE_ACCESS[plan].includes(feature);
}

/**
 * Checks if a user's plan meets or exceeds a required minimum plan level
 * @param userPlan The user's current subscription plan
 * @param minimumPlan The minimum plan level required
 * @returns boolean indicating if the user's plan is sufficient
 */
export function hasPlanAccess(
  userPlan: SubscriptionPlan,
  minimumPlan: SubscriptionPlan
): boolean {
  const userPlanLevel = PLAN_LEVELS[userPlan || "free"];
  const requiredLevel = PLAN_LEVELS[minimumPlan];

  return userPlanLevel >= requiredLevel;
}

/**
 * Get all features available to a specific subscription plan
 * @param userPlan The subscription plan to check
 * @returns Array of features available to the specified plan
 */
export function getAvailableFeatures(
  userPlan: SubscriptionPlan
): FeatureName[] {
  return FEATURE_ACCESS[userPlan || "free"];
}

/**
 * Determine which plan is required for a specific feature
 * @param feature The feature to check
 * @returns The minimum subscription plan required for the feature
 */
export function getPlanRequiredForFeature(
  feature: FeatureName
): SubscriptionPlan {
  // Go through plans in order of increasing level
  if (FEATURE_ACCESS.starter.includes(feature)) return "starter";
  if (FEATURE_ACCESS.pro.includes(feature)) return "pro";
  if (FEATURE_ACCESS.teams.includes(feature)) return "teams";

  // If the feature isn't found in any plan, return teams as the highest level
  return "teams";
}

/**
 * Check if a specific purchase-based feature is available
 * For features that might be available via one-time purchases rather than subscriptions
 * @param feature The feature to check
 * @param userPlan The user's subscription plan
 * @param remainingInterviews Number of interviews available from purchases
 * @returns boolean indicating if the feature is available
 */
export function hasInterviewAccess(
  userPlan: SubscriptionPlan,
  remainingInterviews: number
): boolean {
  // If user has a subscription plan that includes interviews
  if (userPlan === "starter" || userPlan === "pro" || userPlan === "teams") {
    return true;
  }

  // Otherwise, check if they have remaining purchased interviews
  return remainingInterviews > 0;
}
