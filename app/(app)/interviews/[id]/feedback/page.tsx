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
  Lightbulb
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { notFound } from "next/navigation";
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

  // This is a placeholder for the actual data fetching logic
  useEffect(() => {
    // Simulating loading state for design purposes
    setTimeout(() => {
      setLoading(false);
      
      // Placeholder feedback data
      setFeedback({
        strengths: [
          "Excellent communication skills",
          "Strong technical knowledge",
          "Clear and structured responses",
          "Good examples to support points"
        ],
        areasOfImprovement: [
          "Could provide more specific metrics when discussing achievements",
          "Some responses could be more concise",
          "Consider using the STAR method more consistently"
        ],
        overallScore: 85,
        questionFeedback: [
          {
            question: "Tell me about a challenging project you've worked on and how you handled it.",
            score: 90,
            comments: "Excellent response with clear project details, challenges faced, and resolution. Good demonstration of problem-solving skills."
          },
          {
            question: "How do you handle tight deadlines?",
            score: 80,
            comments: "Good answer showing prioritization skills, but could have included a specific example of successfully meeting a tight deadline."
          },
          {
            question: "What are your strengths and weaknesses?",
            score: 85,
            comments: "Honest self-assessment with good examples of strengths. Weakness mentioned was genuine with steps to improve."
          }
        ],
        summary: "Overall, you performed very well in this interview. Your responses were clear, structured, and demonstrated both technical expertise and soft skills. With some minor improvements in specificity and conciseness, you would make an even stronger impression."
      });
      
      // Placeholder interview data
      setInterview({
        id: unwrappedParams.id,
        role: "Frontend Developer",
        type: "Technical",
        level: "Mid-Senior",
        questions: [
          "Tell me about a challenging project you've worked on and how you handled it.",
          "How do you handle tight deadlines?",
          "What are your strengths and weaknesses?"
        ],
        finalized: true,
        userId: "user123",
        createdAt: new Date().toISOString()
      });
    }, 1500);
  }, [unwrappedParams.id]);

  const handleDownload = () => {
    toast.success("Feedback report downloaded successfully");
    // Actual download logic would go here
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
            className={`h-4 w-4 ${i < filledStars ? 'text-yellow-500 fill-yellow-500' : 'text-muted-foreground'}`} 
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
            {interview?.role} • {interview?.type} Interview • {interview?.level} Level
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
              <p className="font-semibold text-2xl">{feedback?.overallScore}%</p>
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
              <li key={index} className="flex items-start gap-2 text-muted-foreground">
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
              <li key={index} className="flex items-start gap-2 text-muted-foreground">
                <Lightbulb className="h-4 w-4 text-orange-500 mt-0.5 flex-shrink-0" />
                <span>{area}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      {/* Question Feedback */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary" />
          Question-by-Question Feedback
        </h2>
        
        <div className="space-y-8">
          {feedback?.questionFeedback.map((qf, index) => (
            <div key={index} className="pb-6 border-b last:border-0 last:pb-0">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-medium">Q{index + 1}: {qf.question}</h3>
                {renderScoreStars(qf.score)}
              </div>
              <p className="text-muted-foreground text-sm">{qf.comments}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Action buttons */}
      <div className="flex justify-between items-center pt-4">
        <Button 
          variant="outline" 
          asChild
        >
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