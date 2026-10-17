"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { InterviewCard } from "@/components/InterviewCard";
import { UpgradeCard } from "@/components/UpgradeCard";
import { Filter, Plus, Loader2, Lock } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useFeatureAccess } from "@/lib/hooks/use-feature-access";
import { FeatureGate } from "@/components/FeatureGate";

// Define interface for interview data with only the specified fields
interface Interview {
  id: string;
  role: string;
  type: string;
  level: string;
  questions: string[]; // List of strings
  finalized: boolean;
  userId: string;
  createdAt: string;
}

export default function InterviewsPage() {
  const [selectedType, setSelectedType] = useState<string>("all");
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { canConductInterview } = useFeatureAccess();
  // Store the interview access status to use in the dependency array
  const hasInterviewAccess = canConductInterview();

  useEffect(() => {
    async function fetchInterviews() {
      setLoading(true);
      // Only fetch data if user has access
      if (hasInterviewAccess) {
        try {
          const response = await fetch("/api/user/interviews");

          if (!response.ok) {
            throw new Error("Failed to fetch interviews");
          }

          const data = await response.json();
          setInterviews(data.interviews || []);
        } catch (err) {
          console.error("Error fetching interviews:", err);
          setError("Failed to load interviews");
          toast.error("Failed to load interviews");
        }
      }
      setLoading(false);
    }

    fetchInterviews();
  }, [hasInterviewAccess]); // Use the boolean value instead of function reference

  // If user doesn't have access to interview features, show access restriction UI
  if (!canConductInterview()) {
    return (
      <div className="space-y-8 py-6">
        <div className="space-y-1">
          <h1 className="font-display text-3xl font-bold tracking-tight">
            My Interviews
          </h1>
          <p className="text-muted-foreground">
            Review and track all your interview practice sessions
          </p>
        </div>

        <UpgradeCard
          title="Interview access required"
          description="To conduct mock interviews and view your history, you need either an active subscription or interview credits."
          primaryLabel="Get a subscription"
          secondaryHref="/pricing?tab=pay-per-interview"
          secondaryLabel="Buy interview credits"
        />
      </div>
    );
  }

  // Filter interviews by type
  const filteredInterviews =
    selectedType === "all"
      ? interviews
      : interviews.filter((interview) => interview.type === selectedType);

  // Get unique types for filter buttons
  const types = [
    "all",
    ...new Set(interviews.map((interview) => interview.type).filter(Boolean)),
  ];
  return (
    <FeatureGate
      feature="mock_interviews_limited"
      checkPurchases={true}
      fallback={
        <Card className="items-center p-10 text-center">
          <Lock className="mx-auto mb-4 size-8 text-muted-foreground" />
          <h2 className="font-display text-xl font-bold">Feature locked</h2>
          <p className="mt-2 text-muted-foreground">
            Access to the interviews feature is restricted.
          </p>
        </Card>
      }
    >
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <h1 className="font-display text-3xl font-bold tracking-tight">
              Your Interviews
            </h1>
            <p className="text-muted-foreground">
              Review and track all your interview practice sessions
            </p>
          </div>
          <Button asChild className="w-fit">
            <Link
              href="/generate-interview"
              className="flex items-center gap-2"
            >
              <Plus className="size-4" />
              New interview
            </Link>
          </Button>
        </div>

        {types.length > 1 && (
          <Card className="gap-0 p-4">
            <div className="flex flex-wrap items-center gap-3">
              <Filter className="size-4 text-muted-foreground" />
              <div className="flex flex-wrap gap-2">
                {types.map((type) => (
                  <Button
                    key={type}
                    variant={selectedType === type ? "default" : "outline"}
                    size="sm"
                    className="capitalize"
                    onClick={() => setSelectedType(type)}
                  >
                    {type === "all" ? "All" : type}
                  </Button>
                ))}
              </div>
            </div>
          </Card>
        )}

        {loading ? (
          <div className="flex items-center justify-center p-16">
            <Loader2 className="size-8 animate-spin text-primary" />
          </div>
        ) : error ? (
          <Card className="items-center p-10 text-center">
            <p className="text-destructive">{error}</p>
            <Button
              variant="outline"
              onClick={() => window.location.reload()}
            >
              Try again
            </Button>
          </Card>
        ) : filteredInterviews.length === 0 ? (
          <Card className="items-center p-10 text-center">
            <span className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Plus className="size-6" />
            </span>
            <div className="space-y-1">
              <p className="font-medium">No interviews found</p>
              <p className="text-sm text-muted-foreground">
                Create a new interview to get started.
              </p>
            </div>
            <Button asChild>
              <Link href="/generate-interview">New interview</Link>
            </Button>
          </Card>
        ) : (
          <div className="grid gap-3">
            {filteredInterviews.map((interview) => (
              <InterviewCard
                key={interview.id}
                variant="personal"
                data={interview}
              />
            ))}
          </div>
        )}
      </div>
    </FeatureGate>
  );
}
