"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { notFound, useRouter } from "next/navigation";
import { useEffect, useState, use } from "react";
import { toast } from "sonner";

// Interview data interface with only the specified fields
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

interface PageParams {
  id: string;
}

export default function InterviewPage({
  params,
}: {
  params: Promise<PageParams>;
}) {
  const router = useRouter();

  // Unwrap params using React.use()
  const unwrappedParams = use(params);
  const id = unwrappedParams.id;

  const [interview, setInterview] = useState<Interview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchInterview() {
      setLoading(true);
      try {
        const response = await fetch(`/api/user/interviews/${id}`);
        if (response.status === 404) {
          return notFound();
        }
        if (!response.ok) {
          throw new Error("Failed to fetch interview");
        }
        const data = await response.json();
        setInterview(data.interview);
      } catch (err) {
        console.error("Error fetching interview:", err);
        setError("Failed to load interview details");
        toast.error("Failed to load interview details");
      } finally {
        setLoading(false);
      }
    }

    fetchInterview();
  }, [id]);

  if (loading) {
    return (
      <div className="container mx-auto p-6 flex justify-center items-center min-h-[70vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !interview) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <Card className="p-6 text-center">
          <p className="text-red-500 mb-4">{error || "Interview not found"}</p>
          <Button asChild variant="outline">
            <Link href="/interviews">Back to Interviews</Link>
          </Button>
        </Card>
      </div>
    );
  }

  // Format date for display
  const displayDate = new Date(interview.createdAt).toLocaleDateString();

  // Create title from role and level
  const title = `${interview.role} ${
    interview.level ? `(${interview.level})` : ""
  } Interview`;

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">{title}</h1>
          <div className="flex items-center gap-4 mt-2 text-muted-foreground">
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              30 mins
            </span>
            <span>•</span>
            <span>{displayDate}</span>
            <span>•</span>
            <span>{interview.type}</span>
            {interview.finalized && (
              <>
                <span>•</span>
                <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                  Finalized
                </span>
              </>
            )}
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Button asChild variant="outline">
            <Link href="/interviews" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Interviews
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-6">
        {/* Questions */}
        <div className="space-y-4">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Questions</h2>
            {!interview.questions || interview.questions.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">
                No questions available for this interview yet.
              </p>
            ) : (
              <div className="space-y-4">
                {interview.questions.map((question, index) => (
                  <div key={index} className="p-4 border rounded-md">
                    <h3 className="font-medium">
                      Question {index + 1}: {question}
                    </h3>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
