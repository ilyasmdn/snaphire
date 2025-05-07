"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { InterviewCard } from "@/components/InterviewCard";
import { Filter, Plus, Loader2 } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { toast } from "sonner";

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

  useEffect(() => {
    async function fetchInterviews() {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch("/api/user/interviews");
        if (!response.ok) {
          throw new Error("Failed to fetch interviews");
        }
        const data = await response.json();
        setInterviews(data.interviews || []);
      } catch (err) {
        console.error("Error fetching interviews:", err);
        setError("Failed to load interviews. Please try again.");
        toast.error("Failed to load interviews");
      } finally {
        setLoading(false);
      }
    }

    fetchInterviews();
  }, []);

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
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Your Interviews</h1>
          <p className="text-muted-foreground">
            Review and track all your interview practice sessions
          </p>
        </div>
        <Button asChild>
          <Link href="/generate-interview" className="flex items-center gap-2">
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
  );
}
