"use client";

import React, { createContext, useContext, ReactNode } from "react";
import {
  useSubscription,
  Subscription,
  SubscriptionPlan,
} from "@/lib/hooks/use-subscription";

interface SubscriptionContextType {
  subscription: Subscription | null;
  isLoading: boolean;
  error: string | null;
  isActive: boolean;
  isPlan: (planName: SubscriptionPlan) => boolean;
  hasAccess: (minimumPlan: SubscriptionPlan) => boolean;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(
  undefined
);

export function SubscriptionProvider({ children }: { children: ReactNode }) {
  const subscriptionData = useSubscription();

  return (
    <SubscriptionContext.Provider value={subscriptionData}>
      {children}
    </SubscriptionContext.Provider>
  );
}

export function useSubscriptionContext() {
  const context = useContext(SubscriptionContext);

  if (context === undefined) {
    throw new Error(
      "useSubscriptionContext must be used within a SubscriptionProvider"
    );
  }

  return context;
}
