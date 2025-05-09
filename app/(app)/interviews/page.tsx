"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { InterviewCard } from "@/components/InterviewCard";
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
      <div className="container py-10">
        <h1 className="text-3xl font-bold mb-8">My Interviews</h1>

        <Card className="p-8 max-w-2xl mx-auto">
          <div className="flex flex-col items-center text-center">
            <div className="p-3 rounded-full bg-amber-100 mb-4">
              <Lock className="h-8 w-8 text-amber-700" />
            </div>

            <h2 className="text-2xl font-bold mb-2">
              Interview Access Required
            </h2>

            <p className="text-muted-foreground mb-6">
              To conduct mock interviews and view your history, you need either
              an active subscription or interview credits.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button asChild>
                <Link href="/pricing">Get a Subscription</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/pricing?tab=pay-per-interview">
                  Buy Interview Credits
                </Link>
              </Button>
            </div>
          </div>
        </Card>
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
        <Card className="p-6 text-center">
          <Lock className="h-8 w-8 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-xl font-bold">Feature Locked</h2>
          <p className="text-muted-foreground mt-2">
            Access to the interviews feature is restricted.
          </p>
        </Card>
      }
    >
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Your Interviews</h1>
            <p className="text-muted-foreground">
              Review and track all your interview practice sessions
            </p>
          </div>
          <Button asChild>
            <Link
              href="/generate-interview"
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              New Interview
            </Link>
          </Button>
        </div>

        {types.length > 1 && (
          <Card className="p-4">
            <div className="flex gap-4 items-center">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <div className="flex gap-2">
                {types.map((type) => (
                  <Button
                    key={type}
                    variant={selectedType === type ? "default" : "outline"}
                    size="sm"
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
          <div className="flex justify-center items-center p-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : error ? (
          <Card className="p-6 text-center">
            <p className="text-red-500">{error}</p>
            <Button
              variant="outline"
              onClick={() => window.location.reload()}
              className="mt-4"
            >
              Try Again
            </Button>
          </Card>
        ) : filteredInterviews.length === 0 ? (
          <Card className="p-6 text-center">
            <p className="text-muted-foreground">No interviews found.</p>
            <p className="text-muted-foreground mt-1">
              Create a new interview to get started.
            </p>
            <Button asChild className="mt-4">
              <Link href="/generate-interview">New Interview</Link>
            </Button>
          </Card>
        ) : (
          <div className="grid gap-4">
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
