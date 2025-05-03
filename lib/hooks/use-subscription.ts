"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

// Updated to match pricing page plans
export type SubscriptionPlan = "free" | "starter" | "pro" | "teams" | "unknown";

export interface Subscription {
  active: boolean;
  plan: SubscriptionPlan;
  subscriptionId?: string;
  orderId?: string;
  createdAt?: string;
  updatedAt?: string;
  cancelledAt?: string;
}

export function useSubscription() {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchSubscription = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const response = await fetch("/api/user/subscription");
        
        if (!response.ok) {
          if (response.status === 401) {
            // If unauthorized, redirect to login
            router.push("/sign-in");
            return;
          }
          
          throw new Error(`Error fetching subscription: ${response.statusText}`);
        }
        
        const data = await response.json();
        setSubscription(data.subscription);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An unknown error occurred");
        console.error("Failed to fetch subscription:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSubscription();
  }, [router]);

  // Helper methods to check subscription status
  const isActive = subscription?.active ?? false;
  
  // Check if user is on a specific plan and has an active subscription
  const isPlan = (planName: SubscriptionPlan) => {
    return isActive && subscription?.plan === planName;
  };
  
  // Check if user's plan is at least at the specified level
  const hasAccess = (minimumPlan: SubscriptionPlan) => {
    if (!isActive) return false;
    
    // Updated plan levels to match pricing page
    const planLevels: Record<SubscriptionPlan, number> = {
      free: 0,
      starter: 1,
      pro: 2,
      teams: 3,
      unknown: -1
    };
    
    const userPlanLevel = planLevels[subscription?.plan || 'free'];
    const requiredLevel = planLevels[minimumPlan];
    
    return userPlanLevel >= requiredLevel;
  };

  return {
    subscription,
    isLoading,
    error,
    isActive,
    isPlan,
    hasAccess,
  };
}
