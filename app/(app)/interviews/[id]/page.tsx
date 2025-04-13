"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, Star, BarChart, MessageSquare } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

// This would come from your database in a real app
const mockInterview = {
  id: "1",
  title: "Full Stack Developer Interview",
  date: "2025-04-08",
  score: 85,
  duration: "45 mins",
  type: "Technical",
  questions: [
    {
      question: "Explain the concept of closures in JavaScript",
      answer:
        "A closure is a combination of a function and the lexical environment within which that function was declared...",
      feedback: "Good explanation but could include more practical examples",
      score: 8,
    },
    {
      question: "How would you optimize a React application's performance?",
      answer:
        "Several strategies include: using React.memo for component memoization, implementing useMemo and useCallback...",
      feedback: "Excellent comprehensive answer with practical solutions",
      score: 9,
    },
  ],
  feedback: {
    strengths: [
      "Strong technical knowledge",
      "Clear communication",
      "Good problem-solving approach",
    ],
    improvements: [
      "Could provide more real-world examples",
      "Consider discussing trade-offs in solutions",
    ],
    summary:
      "Overall strong performance showing good technical depth and communication skills. Focus on incorporating more practical examples in future interviews.",
  },
};

export default function InterviewPage({ params }: { params: { id: string } }) {
  // In a real app, fetch the interview data based on the ID
  const interview = mockInterview;

  if (!interview) {
    return notFound();
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">{interview.title}</h1>
          <div className="flex items-center gap-4 mt-2 text-muted-foreground">
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {interview.duration}
            </span>
            <span>•</span>
            <span>{interview.date}</span>
            <span>•</span>
            <span>{interview.type}</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-lg">
            <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
            <span className="font-semibold">{interview.score}%</span>
          </div>
          <Button asChild variant="outline">
            <Link href="/app/interviews">Back to Interviews</Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Questions & Answers */}
        <div className="md:col-span-2 space-y-4">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Questions & Answers</h2>
            <div className="space-y-6">
              {interview.questions.map((qa, index) => (
                <div
                  key={index}
                  className="space-y-3 pb-6 border-b last:border-0"
                >
                  <div className="flex justify-between items-start">
                    <h3 className="font-medium">
                      Q{index + 1}: {qa.question}
                    </h3>
                    <div className="flex items-center gap-1 text-sm">
                      <BarChart className="h-4 w-4" />
                      <span>{qa.score}/10</span>
                    </div>
                  </div>
                  <p className="text-muted-foreground">{qa.answer}</p>
                  <div className="flex gap-2 items-start text-sm">
                    <MessageSquare className="h-4 w-4 mt-1" />
                    <p className="text-muted-foreground">{qa.feedback}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Feedback Summary */}
        <div className="space-y-4">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Interview Feedback</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">Strengths</h3>
                <ul className="list-disc list-inside text-muted-foreground">
                  {interview.feedback.strengths.map((strength, index) => (
                    <li key={index}>{strength}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="font-medium mb-2">Areas for Improvement</h3>
                <ul className="list-disc list-inside text-muted-foreground">
                  {interview.feedback.improvements.map((improvement, index) => (
                    <li key={index}>{improvement}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="font-medium mb-2">Summary</h3>
                <p className="text-muted-foreground">
                  {interview.feedback.summary}
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
