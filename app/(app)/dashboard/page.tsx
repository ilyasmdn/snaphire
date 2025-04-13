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
} from "lucide-react";

const recentInterviews = [
  {
    id: "1",
    title: "Full Stack Developer Interview",
    date: "2025-04-08",
    score: 85,
    duration: "45 mins",
    type: "Technical",
  },
  {
    id: "2",
    title: "System Design Discussion",
    date: "2025-04-07",
    score: 78,
    duration: "30 mins",
    type: "System Design",
  },
  {
    id: "3",
    title: "Behavioral Interview",
    date: "2025-04-05",
    score: 92,
    duration: "25 mins",
    type: "Behavioral",
  },
];

const communityInterviews = [
  {
    id: "c1",
    role: "Senior Frontend Developer",
    company: "Tech Company",
    date: "2025-04-09",
    duration: "45 mins",
    type: "Technical",
    topics: ["React", "System Design", "JavaScript"],
  },
  {
    id: "c2",
    role: "Full Stack Engineer",
    company: "Startup",
    date: "2025-04-08",
    duration: "60 mins",
    type: "Technical + System Design",
    topics: ["Node.js", "Microservices", "TypeScript"],
  },
  {
    id: "c3",
    role: "Product Engineer",
    company: "Enterprise",
    date: "2025-04-08",
    duration: "30 mins",
    type: "Behavioral",
    topics: ["Leadership", "Project Management", "Communication"],
  },
];

export default function DashboardPage() {
  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Welcome Section */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Welcome back, User!</h1>
          <p className="text-muted-foreground">
            Track your progress and practice for your next interview
          </p>
        </div>
        <Button asChild>
          <Link
            href="/app/generate-interview"
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            New Interview
          </Link>
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 flex flex-col">
          <p className="text-sm text-muted-foreground">Total Interviews</p>
          <p className="text-2xl font-bold mt-2">12</p>
          <div className="text-primary text-sm mt-2 flex items-center gap-1">
            <TrendingUp className="h-4 w-4" />
            +3 this week
          </div>
        </Card>
        <Card className="p-4 flex flex-col">
          <p className="text-sm text-muted-foreground">Average Score</p>
          <p className="text-2xl font-bold mt-2">85%</p>
          <div className="text-primary text-sm mt-2 flex items-center gap-1">
            <BarChart className="h-4 w-4" />
            +5% improvement
          </div>
        </Card>
        <Card className="p-4 flex flex-col">
          <p className="text-sm text-muted-foreground">Practice Time</p>
          <p className="text-2xl font-bold mt-2">8.5h</p>
          <div className="text-primary text-sm mt-2 flex items-center gap-1">
            <Clock className="h-4 w-4" />
            This month
          </div>
        </Card>
        <Card className="p-4 flex flex-col">
          <p className="text-sm text-muted-foreground">Interview Types</p>
          <p className="text-2xl font-bold mt-2">5</p>
          <div className="text-primary text-sm mt-2 flex items-center gap-1">
            <LineChart className="h-4 w-4" />
            Diverse practice
          </div>
        </Card>
      </div>

      {/* Recent Interviews */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Recent Interviews</h2>
          <Button variant="outline" asChild>
            <Link href="/app/interviews">View All</Link>
          </Button>
        </div>
        <div className="grid gap-4">
          {recentInterviews.map((interview) => (
            <InterviewCard
              key={interview.id}
              variant="personal"
              data={interview}
            />
          ))}
        </div>
      </div>

      {/* Community Interviews */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div className="space-y-1">
            <h2 className="text-xl font-semibold">Community Interviews</h2>
            <p className="text-sm text-muted-foreground">
              Learn from other developers' interview experiences
            </p>
          </div>
          <Button variant="outline" size="sm">
            <Users className="h-4 w-4 mr-2" />
            View All
          </Button>
        </div>
        <div className="grid gap-4">
          {communityInterviews.map((interview) => (
            <InterviewCard
              key={interview.id}
              variant="community"
              data={interview}
            />
          ))}
        </div>
      </div>

      {/* Quick Tips */}
      <Card className="p-6 bg-primary/5 border-primary/10">
        <div className="flex items-start gap-4">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Star className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold">Pro Tips</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Learn from the community! Browse through other developers'
              interviews to understand different interview styles and prepare
              better.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
