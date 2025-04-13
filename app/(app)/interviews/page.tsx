"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { InterviewCard } from "@/components/InterviewCard";
import { Filter, Plus } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const allInterviews = [
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
  {
    id: "4",
    title: "Frontend Developer Interview",
    date: "2025-04-03",
    score: 88,
    duration: "40 mins",
    type: "Technical",
  },
];

export default function InterviewsPage() {
  const [selectedType, setSelectedType] = useState<string>("all");

  const filteredInterviews =
    selectedType === "all"
      ? allInterviews
      : allInterviews.filter((interview) => interview.type === selectedType);

  const types = [
    "all",
    ...new Set(allInterviews.map((interview) => interview.type)),
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
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </Button>
            ))}
          </div>
        </div>
      </Card>

      <div className="grid gap-4">
        {filteredInterviews.map((interview) => (
          <InterviewCard
            key={interview.id}
            variant="personal"
            data={interview}
          />
        ))}
      </div>
    </div>
  );
}
