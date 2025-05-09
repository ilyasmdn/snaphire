"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { InterviewCard } from "@/components/InterviewCard";
import Link from "next/link";
import {
  BarChart,
  Clock,
  LineChart,
  Plus,
  Star,
  TrendingUp,
  Users,
  Loader2,
} from "lucide-react";
import { useState, useEffect } from "react";
import { getCurrentUser } from "@/lib/actions/auth.action";
import { toast } from "sonner";
import { FeatureGate } from "@/components/FeatureGate";
import { useFeatureAccess } from "@/lib/hooks/use-feature-access";

// Define interview interface with the specified fields
interface Interview {
  id: string;
  role: string;
  type: string;
  level: string;
  questions: string[];
  finalized: boolean;
  userId: string;
  createdAt: string;
}

// Define user interface to match what getCurrentUser returns
interface User {
  id: string;
  name?: string;
  email?: string;
  createdAt?: string;
  updatedAt?: string;
  [key: string]: any; // For any other fields that might be in the user document
}

export default function DashboardPage() {
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [completedCount, setCompletedCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch the current user
        const userData = (await getCurrentUser()) as User | null;
        if (userData) {
          setUser(userData);
        }

        // Fetch interviews
        const response = await fetch("/api/user/interviews");
        if (!response.ok) {
          throw new Error("Failed to fetch interviews");
        }
        const data = await response.json();
        setInterviews(data.interviews || []);

        // Check which interviews have feedback
        const completedInterviews = await Promise.all(
          data.interviews.map(async (interview: Interview) => {
            try {
              const feedbackResponse = await fetch(
                `/api/user/interviews/${interview.id}/feedback`
              );
              return feedbackResponse.ok;
            } catch {
              return false;
            }
          })
        );

        setCompletedCount(completedInterviews.filter(Boolean).length);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError("Failed to load dashboard data");
        toast.error("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  // Get recent interviews (latest 3)
  const recentInterviews = interviews
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, 3);

  // Calculate stats
  const totalInterviews = interviews.length;

  // Get the unique interview types
  const uniqueTypes = [
    ...new Set(interviews.map((interview) => interview.type)),
  ];

  // Calculate total questions across all interviews
  const totalQuestions = interviews.reduce(
    (sum, interview) => sum + (interview.questions?.length || 0),
    0
  );

  if (loading) {
    return (
      <div className="container mx-auto p-6 flex justify-center items-center min-h-[70vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Welcome Section */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">
            Welcome back, {user?.name || "User"}!
          </h1>
          <p className="text-muted-foreground">
            Track your progress and practice for your next interview
          </p>
        </div>
        <Button asChild>
          <Link href="/generate-interview" className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            New Interview
          </Link>
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 flex flex-col">
          <p className="text-sm text-muted-foreground">Total Interviews</p>
          <p className="text-2xl font-bold mt-2">{totalInterviews}</p>
          {totalInterviews > 0 && (
            <div className="text-primary text-sm mt-2 flex items-center gap-1">
              <TrendingUp className="h-4 w-4" />
              Keep practicing!
            </div>
          )}
        </Card>
        <Card className="p-4 flex flex-col">
          <p className="text-sm text-muted-foreground">Total Questions</p>
          <p className="text-2xl font-bold mt-2">{totalQuestions}</p>
          <div className="text-primary text-sm mt-2 flex items-center gap-1">
            <Clock className="h-4 w-4" />
            Practice regularly
          </div>
        </Card>
        <Card className="p-4 flex flex-col">
          <p className="text-sm text-muted-foreground">Completed Interviews</p>
          <p className="text-2xl font-bold mt-2">{completedCount}</p>
          <div className="text-primary text-sm mt-2 flex items-center gap-1">
            <Star className="h-4 w-4" />
            {completedCount > 0
              ? "Keep up the good work!"
              : "Complete your first interview"}
          </div>
        </Card>
        <Card className="p-4 flex flex-col">
          <p className="text-sm text-muted-foreground">Completion Rate</p>
          <p className="text-2xl font-bold mt-2">
            {totalInterviews > 0
              ? Math.round((completedCount / totalInterviews) * 100)
              : 0}
            %
          </p>
          <div className="text-primary text-sm mt-2 flex items-center gap-1">
            <BarChart className="h-4 w-4" />
            {totalInterviews > 0
              ? "Of interviews completed"
              : "Start your journey"}
          </div>
        </Card>
      </div>

      {/* Recent Interviews */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Recent Interviews</h2>
          <Button variant="outline" asChild>
            <Link href="/interviews">View All</Link>
          </Button>
        </div>
        <div className="grid gap-4">
          {recentInterviews.length > 0 ? (
            recentInterviews.map((interview) => (
              <InterviewCard
                key={interview.id}
                variant="personal"
                data={interview}
              />
            ))
          ) : (
            <Card className="p-6 text-center">
              <p className="text-muted-foreground">No interviews yet.</p>
              <p className="text-muted-foreground mt-1">
                Create your first interview to get started.
              </p>
              <Button asChild className="mt-4">
                <Link href="/generate-interview">New Interview</Link>
              </Button>
            </Card>
          )}
        </div>
      </div>

      {/* Popular Interview Types */}
      {uniqueTypes.length > 0 && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="space-y-1">
              <h2 className="text-xl font-semibold">Your Interview Types</h2>
              <p className="text-sm text-muted-foreground">
                Interview types you've practiced
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {uniqueTypes.map((type) => (
              <div
                key={type}
                className="px-3 py-1.5 rounded-full bg-primary/10 text-sm font-medium text-primary"
              >
                {type}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Performance Insights - Pro feature */}
      <FeatureGate feature="advanced_analytics">
        <div className="space-y-4 mt-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Performance Insights</h2>
            <Button size="sm" variant="outline" asChild>
              <Link href="/analytics">View Details</Link>
            </Button>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card className="p-5">
              <h3 className="font-medium mb-3">Key Strengths</h3>
              {totalInterviews > 0 ? (
                <ul className="space-y-2">
                  <li className="flex items-center gap-2 text-sm">
                    <div className="bg-green-100 p-1 rounded-full">
                      <Star className="h-4 w-4 text-green-600" />
                    </div>
                    Communication skills
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <div className="bg-green-100 p-1 rounded-full">
                      <Star className="h-4 w-4 text-green-600" />
                    </div>
                    Problem-solving approach
                  </li>
                </ul>
              ) : (
                <p className="text-muted-foreground text-sm">
                  Complete an interview to see your strengths
                </p>
              )}
            </Card>

            <Card className="p-5">
              <h3 className="font-medium mb-3">Areas to Improve</h3>
              {totalInterviews > 0 ? (
                <ul className="space-y-2">
                  <li className="flex items-center gap-2 text-sm">
                    <div className="bg-amber-100 p-1 rounded-full">
                      <TrendingUp className="h-4 w-4 text-amber-600" />
                    </div>
                    Technical depth
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <div className="bg-amber-100 p-1 rounded-full">
                      <TrendingUp className="h-4 w-4 text-amber-600" />
                    </div>
                    Answering behavioral questions
                  </li>
                </ul>
              ) : (
                <p className="text-muted-foreground text-sm">
                  Complete an interview to see improvement areas
                </p>
              )}
            </Card>
          </div>
        </div>
      </FeatureGate>

      {/* Learning Resources - Pro feature */}
      <FeatureGate feature="learning_resources">
        <div className="space-y-4 mt-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Recommended Resources</h2>
            <Button size="sm" variant="outline" asChild>
              <Link href="/resources">View All</Link>
            </Button>
          </div>

          <div className="grid gap-3">
            <Card className="p-4 hover:bg-muted/30 transition-colors">
              <Link href="/resources/star-method" className="flex gap-3">
                <div className="bg-primary/10 p-2 rounded-lg h-fit">
                  <Star className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">STAR Method Guide</h3>
                  <p className="text-sm text-muted-foreground">
                    Structure your interview answers effectively
                  </p>
                </div>
              </Link>
            </Card>
          </div>
        </div>
      </FeatureGate>

      {/* Quick Tips */}
      <Card className="p-6 bg-primary/5 border-primary/10">
        <div className="flex items-start gap-4">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Star className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold">Pro Tips</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Regular practice is key! Try to complete at least 2-3 mock
              interviews per week for the best results in your real interviews.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
