"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import {
  BarChart as BarChartIcon,
  Target,
  Star,
  TrendingUp,
  MessageSquare,
  Loader2,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";
import { useFeatureAccess } from "@/lib/hooks/use-feature-access";
import { UpgradeCard } from "@/components/UpgradeCard";


interface Interview {
  id: string;
  type: string;
  createdAt: string;
  questions: any[];
}

interface Feedback {
  overallScore: number;
  strengths: string[];
  areasOfImprovement: string[];
  questionFeedback: Array<{
    question: string;
    score: number;
    comments: string;
  }>;
}

interface InterviewWithFeedback extends Interview {
  feedback?: Feedback;
}

export default function AnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [interviews, setInterviews] = useState<InterviewWithFeedback[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { canUseFeature } = useFeatureAccess();

  // Check if user has access to advanced analytics
  const hasAdvancedAnalyticsAccess = canUseFeature("advanced_analytics");

  useEffect(() => {
    // Only fetch data if user has access
    if (hasAdvancedAnalyticsAccess) {
      async function fetchData() {
        try {
          // Fetch interviews
          const response = await fetch("/api/user/interviews");
          if (!response.ok) {
            throw new Error("Failed to fetch interviews");
          }
          const data = await response.json();
          const interviewsData = data.interviews || [];

          // Fetch feedback for each interview
          const interviewsWithFeedback = await Promise.all(
            interviewsData.map(async (interview: Interview) => {
              try {
                const feedbackResponse = await fetch(
                  `/api/user/interviews/${interview.id}/feedback`
                );
                if (feedbackResponse.ok) {
                  const feedbackData = await feedbackResponse.json();
                  return {
                    ...interview,
                    feedback: feedbackData.feedback,
                  };
                }
                return interview;
              } catch {
                return interview;
              }
            })
          );

          setInterviews(interviewsWithFeedback);
        } catch (err) {
          console.error("Error fetching analytics data:", err);
          setError("Failed to load analytics data");
        } finally {
          setLoading(false);
        }
      }

      fetchData();
    } else {
      setLoading(false);
    }
  }, [hasAdvancedAnalyticsAccess]);

  // Calculate statistics
  const totalInterviews = interviews.length;
  const completedInterviews = interviews.filter((i) => i.feedback).length;
  const averageScore =
    interviews.reduce((sum, i) => sum + (i.feedback?.overallScore || 0), 0) /
      completedInterviews || 0;

  const uniqueSkills = new Set<string>();
  interviews.forEach((interview) => {
    interview.feedback?.strengths?.forEach((skill) => uniqueSkills.add(skill));
  });

  // Calculate average scores for each category
  const categoryScores = interviews
    .filter((i) => i.feedback)
    .reduce((acc, interview) => {
      interview.feedback?.questionFeedback.forEach((qf) => {
        if (!acc[qf.question]) {
          acc[qf.question] = {
            count: 0,
            total: 0,
          };
        }
        acc[qf.question].count++;
        acc[qf.question].total += qf.score;
      });
      return acc;
    }, {} as Record<string, { count: number; total: number }>);

  const performanceCategoryData = Object.entries(categoryScores).map(
    ([category, { count, total }]) => ({
      category,
      score: Math.round(total / count),
    })
  );

  // Prepare performance data for charts
  const performanceData = interviews
    .filter((i) => i.feedback)
    .map((interview) => ({
      date: new Date(interview.createdAt).toLocaleDateString(),
      score: interview.feedback?.overallScore || 0,
    }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const stats = [
    {
      label: "Total Interviews",
      value: totalInterviews.toString(),
      change: `${completedInterviews} completed`,
      trend: "up",
      icon: MessageSquare,
    },
    {
      label: "Average Score",
      value: `${Math.round(averageScore)}%`,
      change: completedInterviews > 0 ? "+5%" : "N/A",
      trend: "up",
      icon: Star,
    },
    {
      label: "Questions Answered",
      value: interviews
        .reduce((sum, i) => sum + (i.questions?.length || 0), 0)
        .toString(),
      change: `${Math.round(
        (completedInterviews / totalInterviews) * 100
      )}% completion`,
      trend: "up",
      icon: Target,
    },
    {
      label: "Skills Identified",
      value: uniqueSkills.size.toString(),
      change: uniqueSkills.size > 0 ? "Growing" : "Start practicing",
      trend: "up",
      icon: TrendingUp,
    },
  ];

  if (!hasAdvancedAnalyticsAccess) {
    return (
      <div className="space-y-8 py-6">
        <div className="space-y-1">
          <h1 className="font-display text-3xl font-bold tracking-tight">
            Analytics
          </h1>
          <p className="text-muted-foreground">
            Track your interview performance and progress
          </p>
        </div>

        <UpgradeCard
          title="Advanced analytics"
          description="Advanced analytics are available with our Pro subscription plan. Upgrade to access performance insights, trend analysis, and detailed feedback reports."
          primaryLabel="Upgrade to Pro"
        />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="space-y-1">
        <h1 className="font-display text-3xl font-bold tracking-tight">
          Analytics Dashboard
        </h1>
        <p className="text-muted-foreground">
          Track your interview performance and progress
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="card-hover gap-0 p-5">
            <div className="flex items-center justify-between">
              <span className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <stat.icon className="size-[18px]" />
              </span>
              <span className="text-xs font-medium text-primary">
                {stat.change}
              </span>
            </div>
            <div className="mt-4">
              <h3 className="font-display text-2xl font-bold tracking-tight">
                {stat.value}
              </h3>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </div>
          </Card>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="gap-0 p-6">
          <div className="mb-6 flex items-center gap-3">
            <span className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <TrendingUp className="size-[18px]" />
            </span>
            <h3 className="font-display text-lg font-semibold">
              Performance Trend
            </h3>
          </div>
          {performanceData.length > 0 ? (
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={performanceData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="var(--border)"
                    opacity={0.3}
                  />
                  <XAxis
                    dataKey="date"
                    stroke="var(--muted-foreground)"
                    fontSize={12}
                    tickLine={false}
                    axisLine={{ stroke: "var(--border)", strokeWidth: 1 }}
                  />
                  <YAxis
                    domain={[0, 100]}
                    stroke="var(--muted-foreground)"
                    fontSize={12}
                    tickLine={false}
                    axisLine={{ stroke: "var(--border)", strokeWidth: 1 }}
                    tickFormatter={(value) => `${value}%`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--card)",
                      border: "1px solid var(--border)",
                      borderRadius: "var(--radius)",
                      boxShadow: "0 1px 3px 0 rgb(0 0 0 / 0.1)",
                    }}
                    labelStyle={{
                      color: "var(--muted-foreground)",
                      marginBottom: "4px",
                    }}
                    itemStyle={{ color: "var(--foreground)" }}
                    formatter={(value: number) => [`${value}%`, "Score"]}
                  />
                  <Line
                    type="monotone"
                    dataKey="score"
                    stroke="var(--primary)"
                    strokeWidth={2}
                    dot={{ fill: "var(--primary)", strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, fill: "var(--primary)" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-[300px] flex items-center justify-center border rounded-lg bg-muted/5">
              <p className="text-muted-foreground">
                Complete interviews to see your performance trend
              </p>
            </div>
          )}
        </Card>

        <Card className="gap-0 p-6">
          <div className="mb-6 flex items-center gap-3">
            <span className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <BarChartIcon className="size-[18px]" />
            </span>
            <h3 className="font-display text-lg font-semibold">
              Performance Categories
            </h3>
          </div>
          {performanceCategoryData.length > 0 ? (
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={performanceCategoryData}>
                  <PolarGrid stroke="var(--border)" opacity={0.3} />
                  <PolarAngleAxis
                    dataKey="category"
                    tick={{
                      fill: "var(--muted-foreground)",
                      fontSize: 12,
                    }}
                  />
                  <PolarRadiusAxis
                    angle={90}
                    domain={[0, 100]}
                    tick={{
                      fill: "var(--muted-foreground)",
                      fontSize: 12,
                    }}
                    tickFormatter={(value) => `${value}%`}
                    stroke="var(--border)"
                  />
                  <Radar
                    name="Score"
                    dataKey="score"
                    stroke="var(--color-primary)"
                    fill="var(--color-primary)"
                    fillOpacity={0.2}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--card)",
                      border: "1px solid var(--border)",
                      borderRadius: "var(--radius)",
                      boxShadow: "0 1px 3px 0 rgb(0 0 0 / 0.1)",
                    }}
                    labelStyle={{
                      color: "var(--muted-foreground)",
                      marginBottom: "4px",
                    }}
                    itemStyle={{ color: "var(--foreground)" }}
                    formatter={(value: number) => [`${value}%`, "Score"]}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-[300px] flex items-center justify-center border rounded-lg bg-muted/5">
              <p className="text-muted-foreground">
                Complete interviews to see your category performance
              </p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
