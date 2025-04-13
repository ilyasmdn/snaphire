"use client";

import { Card } from "@/components/ui/card";
import {
  BarChart,
  LineChart,
  Target,
  Users,
  Star,
  TrendingUp,
  MessageSquare,
} from "lucide-react";

export default function AnalyticsPage() {
  // Example data - in a real app, this would come from an API
  const stats = [
    {
      label: "Total Interviews",
      value: "24",
      change: "+12%",
      trend: "up",
      icon: MessageSquare,
    },
    {
      label: "Average Score",
      value: "82%",
      change: "+5%",
      trend: "up",
      icon: Star,
    },
    {
      label: "Practice Hours",
      value: "18.5",
      change: "+3.2",
      trend: "up",
      icon: Target,
    },
    {
      label: "Skills Improved",
      value: "8",
      change: "+2",
      trend: "up",
      icon: TrendingUp,
    },
  ];

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
        <p className="text-muted-foreground">
          Track your interview performance and progress
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="p-6">
            <div className="flex items-center justify-between">
              <stat.icon className="h-5 w-5 text-muted-foreground" />
              <span
                className={`text-xs font-medium ${
                  stat.trend === "up" ? "text-green-500" : "text-red-500"
                }`}
              >
                {stat.change}
              </span>
            </div>
            <div className="mt-4">
              <h3 className="text-xl font-bold">{stat.value}</h3>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </div>
          </Card>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Interview Performance</h3>
          <div className="h-[300px] flex items-center justify-center border rounded-lg">
            <p className="text-muted-foreground">
              Performance chart will be displayed here
            </p>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Skills Progress</h3>
          <div className="h-[300px] flex items-center justify-center border rounded-lg">
            <p className="text-muted-foreground">
              Skills progress chart will be displayed here
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
