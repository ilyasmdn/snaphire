"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export interface Purchase {
  id: string;
  type: "single" | "pack";
  interviewCount: number;
  interviewsUsed: number;
  purchaseDate: string;
  expiryDate: string;
  orderId: string;
  amount: number;
  isActive: boolean;
}

export function usePurchases() {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchPurchases = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch("/api/user/purchases");

        if (!response.ok) {
          if (response.status === 401) {
            // If unauthorized, redirect to login
            router.push("/sign-in");
            return;
          }

          throw new Error(`Error fetching purchases: ${response.statusText}`);
        }

        const data = await response.json();
        setPurchases(data.purchases || []);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unknown error occurred"
        );
        console.error("Failed to fetch purchases:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPurchases();
  }, [router]);

  const getActivePurchases = () => {
    return purchases.filter((purchase) => purchase.isActive);
  };

  const getExpiredPurchases = () => {
    return purchases.filter((purchase) => !purchase.isActive);
  };

  const getTotalRemainingInterviews = () => {
    return getActivePurchases().reduce(
      (total, purchase) =>
        total + (purchase.interviewCount - purchase.interviewsUsed),
      0
    );
  };

  return {
    purchases,
    isLoading,
    error,
    getActivePurchases,
    getExpiredPurchases,
    getTotalRemainingInterviews,
  };
}
