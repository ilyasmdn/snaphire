"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { InterviewCard } from "@/components/InterviewCard";
import Link from "next/link";
import {
  BarChart,
  Clock,
  LineChart,
  MessageSquare,
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
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    );
  }

  const statCards = [
    {
      label: "Total Interviews",
      value: totalInterviews,
      hint: totalInterviews > 0 ? "Keep practicing!" : "Start your journey",
      icon: MessageSquare,
    },
    {
      label: "Total Questions",
      value: totalQuestions,
      hint: "Practice regularly",
      icon: Clock,
    },
    {
      label: "Completed",
      value: completedCount,
      hint:
        completedCount > 0
          ? "Keep up the good work!"
          : "Complete your first interview",
      icon: Star,
    },
    {
      label: "Completion Rate",
      value: `${
        totalInterviews > 0
          ? Math.round((completedCount / totalInterviews) * 100)
          : 0
      }%`,
      hint:
        totalInterviews > 0 ? "Of interviews completed" : "Start your journey",
      icon: BarChart,
    },
  ];

  return (
    <div className="space-y-10">
      {/* Welcome Section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h1 className="font-display text-3xl font-bold tracking-tight">
            Welcome back, {user?.name || "there"} 👋
          </h1>
          <p className="text-muted-foreground">
            Track your progress and practice for your next interview
          </p>
        </div>
        <Button asChild className="group w-fit">
          <Link href="/generate-interview" className="flex items-center gap-2">
            <Plus className="size-4" />
            New interview
          </Link>
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => (
          <Card
            key={stat.label}
            className="card-hover gap-0 border-border/70 p-5"
          >
            <div className="flex items-start justify-between">
              <p className="text-sm font-medium text-muted-foreground">
                {stat.label}
              </p>
              <span className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <stat.icon className="size-[18px]" />
              </span>
            </div>
            <p className="mt-4 font-display text-3xl font-bold tracking-tight">
              {stat.value}
            </p>
            <p className="mt-1.5 flex items-center gap-1.5 text-xs text-muted-foreground">
              <TrendingUp className="size-3.5 text-primary" />
              {stat.hint}
            </p>
          </Card>
        ))}
      </div>

      {/* Recent Interviews */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl font-semibold">
            Recent Interviews
          </h2>
          <Button variant="outline" size="sm" asChild>
            <Link href="/interviews">View all</Link>
          </Button>
        </div>
        <div className="grid gap-3">
          {recentInterviews.length > 0 ? (
            recentInterviews.map((interview) => (
              <InterviewCard
                key={interview.id}
                variant="personal"
                data={interview}
              />
            ))
          ) : (
            <Card className="items-center p-10 text-center">
              <span className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Plus className="size-6" />
              </span>
              <div className="space-y-1">
                <p className="font-medium">No interviews yet</p>
                <p className="text-sm text-muted-foreground">
                  Create your first interview to get started.
                </p>
              </div>
              <Button asChild>
                <Link href="/generate-interview">New interview</Link>
              </Button>
            </Card>
          )}
        </div>
      </section>

      {/* Your Interview Types */}
      {uniqueTypes.length > 0 && (
        <section className="space-y-4">
          <div>
            <h2 className="font-display text-xl font-semibold">
              Your interview types
            </h2>
            <p className="text-sm text-muted-foreground">
              Interview types you&apos;ve practiced
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {uniqueTypes.map((type) => (
              <span
                key={type}
                className="rounded-full border border-primary/15 bg-primary/10 px-3.5 py-1.5 text-sm font-medium capitalize text-primary"
              >
                {type}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Performance Insights - Pro feature */}
      <FeatureGate feature="advanced_analytics">
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-xl font-semibold">
              Performance Insights
            </h2>
            <Button size="sm" variant="outline" asChild>
              <Link href="/analytics">View details</Link>
            </Button>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card className="p-6">
              <h3 className="mb-4 font-medium">Key strengths</h3>
              {totalInterviews > 0 ? (
                <ul className="space-y-3">
                  {["Communication skills", "Problem-solving approach"].map(
                    (item) => (
                      <li key={item} className="flex items-center gap-3 text-sm">
                        <span className="flex size-7 items-center justify-center rounded-full bg-emerald-500/10">
                          <Star className="size-3.5 text-emerald-500" />
                        </span>
                        {item}
                      </li>
                    )
                  )}
                </ul>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Complete an interview to see your strengths
                </p>
              )}
            </Card>

            <Card className="p-6">
              <h3 className="mb-4 font-medium">Areas to improve</h3>
              {totalInterviews > 0 ? (
                <ul className="space-y-3">
                  {["Technical depth", "Answering behavioral questions"].map(
                    (item) => (
                      <li key={item} className="flex items-center gap-3 text-sm">
                        <span className="flex size-7 items-center justify-center rounded-full bg-amber-500/10">
                          <TrendingUp className="size-3.5 text-amber-500" />
                        </span>
                        {item}
                      </li>
                    )
                  )}
                </ul>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Complete an interview to see improvement areas
                </p>
              )}
            </Card>
          </div>
        </section>
      </FeatureGate>

      {/* Learning Resources - Pro feature */}
      <FeatureGate feature="learning_resources">
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-xl font-semibold">
              Recommended resources
            </h2>
            <Button size="sm" variant="outline" asChild>
              <Link href="/resources">View all</Link>
            </Button>
          </div>

          <Card className="card-hover gap-0 p-5">
            <Link href="/resources/star-method" className="flex gap-4">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Star className="size-5" />
              </span>
              <div>
                <h3 className="font-medium">STAR Method Guide</h3>
                <p className="text-sm text-muted-foreground">
                  Structure your interview answers effectively
                </p>
              </div>
            </Link>
          </Card>
        </section>
      </FeatureGate>

      {/* Quick Tips */}
      <Card className="gap-0 border-primary/15 bg-gradient-to-br from-primary/10 via-card to-accent/10 p-6">
        <div className="flex items-start gap-4">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary">
            <Star className="size-5" />
          </span>
          <div>
            <h3 className="font-display font-semibold">Pro tip</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Regular practice is key! Try to complete at least 2–3 mock
              interviews per week for the best results in your real interviews.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
