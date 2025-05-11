"use client";

import { useState, useEffect, use } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  CheckCircle,
  Clock,
  FileText,
  ArrowLeft,
  Download,
  Star,
  BarChart,
  AlertCircle,
  ThumbsUp,
  ThumbsDown,
  Lightbulb,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

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

interface Feedback {
  strengths: string[];
  areasOfImprovement: string[];
  overallScore: number;
  questionFeedback: {
    question: string;
    score: number;
    comments: string;
  }[];
  summary: string;
}

interface PageParams {
  id: string;
}

export default function FeedbackPage({
  params,
}: {
  params: Promise<PageParams>;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [interview, setInterview] = useState<Interview | null>(null);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const unwrappedParams = use(params);
  // Fetch interview and feedback data
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);

        // Fetch interview data
        const interviewResponse = await fetch(
          `/api/user/interviews/${unwrappedParams.id}`
        );
        if (!interviewResponse.ok) {
          const errorData = await interviewResponse.json();
          throw new Error(errorData.error || "Failed to fetch interview data");
        }

        const interviewData = await interviewResponse.json();
        setInterview(interviewData.interview);

        // Fetch feedback data
        const feedbackResponse = await fetch(
          `/api/user/interviews/${unwrappedParams.id}/feedback`
        );

        if (!feedbackResponse.ok) {
          // If feedback doesn't exist, redirect to interview page
          if (feedbackResponse.status === 404) {
            toast.info(
              "No feedback available yet. Please complete the interview first."
            );
            router.push(`/interviews/${unwrappedParams.id}`);
            return;
          }

          const errorData = await feedbackResponse.json();
          throw new Error(errorData.error || "Failed to fetch feedback data");
        }

        const feedbackData = await feedbackResponse.json();
        if (!feedbackData.feedback) {
          toast.info(
            "No feedback available yet. Please complete the interview first."
          );
          router.push(`/interviews/${unwrappedParams.id}`);
          return;
        }

        setFeedback(feedbackData.feedback);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(
          err instanceof Error ? err.message : "An unknown error occurred"
        );
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [unwrappedParams.id, router]);
  const handleDownload = async () => {
    if (!interview || !feedback) {
      toast.error("Feedback data is not fully loaded");
      return;
    }

    const loadingToast = toast.loading("Generating report...");

    try {
      // Dynamically import jsPDF
      const { default: jsPDF } = await import("jspdf");

      // Create a new PDF document
      const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      // Set font size and styles
      const titleFontSize = 18;
      const subtitleFontSize = 16;
      const headerFontSize = 14;
      const normalFontSize = 11;
      const smallFontSize = 10;

      // page dimensions
      const pageWidth = doc.internal.pageSize.getWidth();
      const margin = 20;
      const usableWidth = pageWidth - margin * 2;

      // Add title
      doc.setFontSize(titleFontSize);
      doc.setFont("helvetica", "bold");
      doc.text(`Interview Feedback Report`, margin, margin);

      // Add interview details
      doc.setFontSize(normalFontSize);
      doc.setFont("helvetica", "normal");
      doc.text(`Role: ${interview.role}`, margin, margin + 10);
      doc.text(`Type: ${interview.type}`, margin, margin + 15);
      doc.text(`Level: ${interview.level}`, margin, margin + 20);
      doc.text(
        `Date: ${new Date(interview.createdAt).toLocaleDateString()}`,
        margin,
        margin + 25
      );

      // Add score
      doc.setFontSize(headerFontSize);
      doc.setFont("helvetica", "bold");
      doc.text(`Overall Score: ${feedback.overallScore}%`, margin, margin + 35);

      // Add rating text based on score
      doc.setFontSize(normalFontSize);
      let rating = "Needs Improvement";
      if (feedback.overallScore >= 80) rating = "Excellent";
      else if (feedback.overallScore >= 60) rating = "Good";
      doc.text(`Rating: ${rating}`, margin, margin + 40);

      // Add Summary
      doc.setFontSize(subtitleFontSize);
      doc.setFont("helvetica", "bold");
      doc.text("Summary", margin, margin + 50);

      doc.setFontSize(normalFontSize);
      doc.setFont("helvetica", "normal");

      // Format and add the summary text with line wrapping
      const summaryText = doc.splitTextToSize(feedback.summary, usableWidth);
      doc.text(summaryText, margin, margin + 55);

      // Calculate the height of the summary text to position the next section
      let yPosition = margin + 55 + summaryText.length * 5;

      // Add Strengths section
      doc.setFontSize(subtitleFontSize);
      doc.setFont("helvetica", "bold");
      doc.text("Strengths", margin, yPosition + 10);

      doc.setFontSize(normalFontSize);
      doc.setFont("helvetica", "normal");

      yPosition += 15;
      feedback.strengths.forEach((strength, index) => {
        const strengthText = doc.splitTextToSize(
          `${index + 1}. ${strength}`,
          usableWidth
        );
        doc.text(strengthText, margin, yPosition);
        yPosition += strengthText.length * 5;
      });

      // Check if we need a new page for areas of improvement
      if (yPosition > 250) {
        doc.addPage();
        yPosition = margin;
      }

      // Add Areas for Improvement
      doc.setFontSize(subtitleFontSize);
      doc.setFont("helvetica", "bold");
      doc.text("Areas for Improvement", margin, yPosition + 10);

      doc.setFontSize(normalFontSize);
      doc.setFont("helvetica", "normal");

      yPosition += 15;
      feedback.areasOfImprovement.forEach((area, index) => {
        const areaText = doc.splitTextToSize(
          `${index + 1}. ${area}`,
          usableWidth
        );
        doc.text(areaText, margin, yPosition);
        yPosition += areaText.length * 5;
      });

      // Check if we need a new page for question feedback
      if (yPosition > 250) {
        doc.addPage();
        yPosition = margin;
      } else {
        yPosition += 10;
      }

      // Add Question Feedback
      doc.setFontSize(subtitleFontSize);
      doc.setFont("helvetica", "bold");
      doc.text("Question-by-Question Feedback", margin, yPosition);

      doc.setFontSize(normalFontSize);

      feedback.questionFeedback.forEach((qf, index) => {
        // Check if we need a new page
        if (yPosition > 240) {
          doc.addPage();
          yPosition = margin;
        }

        yPosition += 10;

        // Add question
        doc.setFont("helvetica", "bold");
        const questionText = doc.splitTextToSize(
          `${index + 1}. ${qf.question}`,
          usableWidth
        );
        doc.text(questionText, margin, yPosition);
        yPosition += questionText.length * 5;

        // Add score
        doc.setFont("helvetica", "normal");
        doc.text(`Score: ${qf.score}%`, margin, yPosition);
        yPosition += 5;

        // Add feedback
        const feedbackText = doc.splitTextToSize(qf.comments, usableWidth);
        doc.text(feedbackText, margin, yPosition);
        yPosition += feedbackText.length * 5 + 5;
      });

      // Add footer
      const timestamp = new Date().toLocaleString();
      doc.setFontSize(smallFontSize);
      doc.setTextColor(100, 100, 100);
      doc.text(`Generated by SnapHire on ${timestamp}`, margin, 285);

      // Save the PDF with filename based on interview role and date
      const filename = `Interview_Feedback_${interview.role.replace(
        /\s+/g,
        "_"
      )}_${new Date().toISOString().split("T")[0]}.pdf`;
      doc.save(filename);

      toast.dismiss(loadingToast);
      toast.success("Feedback report downloaded successfully");
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.dismiss(loadingToast);
      toast.error("Failed to generate report");
    }
  };

  // Function to render score as stars
  const renderScoreStars = (score: number) => {
    const maxStars = 5;
    const filledStars = Math.round((score / 100) * maxStars);

    return (
      <div className="flex items-center">
        {[...Array(maxStars)].map((_, i) => (
          <Star
            key={i}
            className={`h-4 w-4 ${
              i < filledStars
                ? "text-yellow-500 fill-yellow-500"
                : "text-muted-foreground"
            }`}
          />
        ))}
        <span className="ml-2 text-sm font-medium">{score}%</span>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6 max-w-4xl space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-64 mt-2" />
          </div>
          <Skeleton className="h-10 w-28" />
        </div>

        <Card className="p-6">
          <Skeleton className="h-6 w-32 mb-4" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-3/4" />
        </Card>

        <div className="grid md:grid-cols-2 gap-4">
          <Card className="p-6">
            <Skeleton className="h-6 w-32 mb-4" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          </Card>

          <Card className="p-6">
            <Skeleton className="h-6 w-48 mb-4" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </Card>
        </div>

        <Card className="p-6">
          <Skeleton className="h-6 w-40 mb-4" />
          <div className="space-y-6">
            <div>
              <Skeleton className="h-5 w-full mb-2" />
              <Skeleton className="h-4 w-full mb-1" />
              <Skeleton className="h-4 w-3/4" />
            </div>
            <div>
              <Skeleton className="h-5 w-full mb-2" />
              <Skeleton className="h-4 w-full mb-1" />
              <Skeleton className="h-4 w-5/6" />
            </div>
          </div>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6 max-w-2xl">
        <Card className="p-6">
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="text-destructive mb-4 rounded-full bg-destructive/10 p-3">
              <AlertCircle className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-semibold">Error Loading Feedback</h3>
            <p className="text-sm text-muted-foreground mt-1">{error}</p>
            <Button
              className="mt-4"
              variant="outline"
              onClick={() => router.push("/interviews")}
            >
              Return to Interviews
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" asChild className="p-0">
              <Link href={`/interviews/${unwrappedParams.id}`}>
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <h1 className="text-3xl font-bold">Interview Feedback</h1>
          </div>
          <p className="text-muted-foreground mt-1">
            {interview?.role} • {interview?.type} Interview • {interview?.level}{" "}
            Level
          </p>
        </div>

        <Button onClick={handleDownload} className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          Download Report
        </Button>
      </div>

      {/* Overall Summary */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary" />
          Overall Summary
        </h2>
        <p className="text-muted-foreground">{feedback?.summary}</p>

        <div className="mt-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-primary/10">
              <BarChart className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Overall Score</p>
              <p className="font-semibold text-2xl">
                {feedback?.overallScore}%
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            {feedback && feedback.overallScore >= 80 ? (
              <div className="px-3 py-1 rounded-full bg-green-500/10 text-green-500 text-sm font-medium flex items-center gap-1">
                <CheckCircle className="h-3.5 w-3.5" />
                Excellent
              </div>
            ) : feedback && feedback.overallScore >= 60 ? (
              <div className="px-3 py-1 rounded-full bg-yellow-500/10 text-yellow-500 text-sm font-medium flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                Good
              </div>
            ) : (
              <div className="px-3 py-1 rounded-full bg-orange-500/10 text-orange-500 text-sm font-medium flex items-center gap-1">
                <AlertCircle className="h-3.5 w-3.5" />
                Needs Improvement
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Strengths and Areas for Improvement */}
      <div className="grid md:grid-cols-2 gap-4">
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <ThumbsUp className="h-5 w-5 text-green-500" />
            Strengths
          </h2>
          <ul className="space-y-2">
            {feedback?.strengths.map((strength, index) => (
              <li
                key={index}
                className="flex items-start gap-2 text-muted-foreground"
              >
                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span>{strength}</span>
              </li>
            ))}
          </ul>
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <ThumbsDown className="h-5 w-5 text-orange-500" />
            Areas for Improvement
          </h2>
          <ul className="space-y-2">
            {feedback?.areasOfImprovement.map((area, index) => (
              <li
                key={index}
                className="flex items-start gap-2 text-muted-foreground"
              >
                <Lightbulb className="h-4 w-4 text-orange-500 mt-0.5 flex-shrink-0" />
                <span>{area}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      {/* Response Assessment */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary" />
          Response Assessment
        </h2>

        <div className="space-y-8">
          {feedback?.questionFeedback.map((qf, index) => (
            <div key={index} className="pb-6 border-b last:border-0 last:pb-0">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-medium">
                  {index + 1}. {qf.question}
                </h3>
                {renderScoreStars(qf.score)}
              </div>
              <p className="text-muted-foreground text-sm">{qf.comments}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Action buttons */}
      <div className="flex justify-between items-center pt-4">
        <Button variant="outline" asChild>
          <Link href="/interviews" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Interviews
          </Link>
        </Button>

        <Button asChild>
          <Link href="/generate-interview" className="flex items-center gap-2">
            Create New Interview
          </Link>
        </Button>
      </div>
    </div>
  );
}
