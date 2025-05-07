"use client";

import { useState, useEffect, use } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mic, MicOff, Phone } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { notFound } from "next/navigation";
import { vapi } from "@/lib/vapi.sdk";
import { CreateAssistantDTO } from "@vapi-ai/web/dist/api";

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

export const interviewer: CreateAssistantDTO = {
  name: "Interviewer",
  firstMessage: "Hello! Thank you for taking the time to speak with me today. I'm excited to learn more about you and your experience.",
  transcriber: {
    provider: "deepgram",
    model: "nova-2",
    language: "en",
  },
  voice: {
    provider: "11labs",
    voiceId: "sarah",
    stability: 0.4,
    similarityBoost: 0.8,
    speed: 0.9,
    style: 0.5,
    useSpeakerBoost: true,
  },
  model: {
    provider: "openai",
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content: `You are a professional job interviewer conducting a real-time voice interview with a candidate. Your goal is to assess their qualifications, motivation, and fit for the role.

Interview Guidelines:
Follow the structured question flow:
{{questions}}

Engage naturally & react appropriately:
Listen actively to responses and acknowledge them before moving forward.
Ask brief follow-up questions if a response is vague or requires more detail.
Keep the conversation flowing smoothly while maintaining control.
Be professional, yet warm and welcoming:

Use official yet friendly language.
Keep responses concise and to the point (like in a real voice interview).
Avoid robotic phrasing—sound natural and conversational.
Answer the candidate's questions professionally:

If asked about the role, company, or expectations, provide a clear and relevant answer.
If unsure, redirect the candidate to HR for more details.

Conclude the interview properly:
Thank the candidate for their time.
Inform them that the company will reach out soon with feedback.
End the conversation on a polite and positive note.


- Be sure to be professional and polite.
- Keep all your responses short and simple. Use official language, but be kind and welcoming.
- This is a voice conversation, so keep your responses short, like in a real conversation. Don't ramble for too long.`,
      },
    ],
  },
  clientMessages: [],
  serverMessages: []
};

export default function InterviewSessionPage({
  params,
}: {
  params: Promise<PageParams>;
}) {
  const router = useRouter();
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [interview, setInterview] = useState<Interview | null>(null);
  const unwrappedParams = use(params);

  useEffect(() => {
    async function fetchInterview() {
      setLoading(true);
      try {
        const response = await fetch(
          `/api/user/interviews/${unwrappedParams.id}`
        );
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
  }, [unwrappedParams.id]);

  const handleStartCall = async () => {
    try {
      setIsConnecting(true);
      
      let formattedQuestions = "";
      formattedQuestions = interview?.questions.map((question, index) => `${index + 1}. ${question}`).join("\n") || "";

      await vapi.start( interviewer, {
        variableValues: {
          questions: formattedQuestions
        },
        clientMessages: [],
        serverMessages: []
      }
      )
      
      setIsConnected(true);
      toast.success("Connected to AI interviewer");
    } catch (error) {
      console.error("Failed to connect:", error);
      toast.error("Failed to connect to AI interviewer");
      setIsConnected(false);
    } finally {
      setIsConnecting(false);
    }
  };

  const handleEndCall = async () => {
    try {
      // TODO: Add voice API disconnection logic here
      setIsConnected(false);
      toast.success("Interview completed successfully");
      // Redirect to interview results page
      router.push(`/interviews/${unwrappedParams.id}/feedback`);
    } catch (error) {
      console.error("Failed to disconnect:", error);
      toast.error("Failed to end interview");
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-2xl">
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">Interview Session</h1>
          <p className="text-muted-foreground">
            Your interview is ready to begin
          </p>
        </div>

        {/* Loading and Error States */}
        {loading ? (
          <Card className="p-6">
            <div className="flex flex-col items-center justify-center py-10">
              <div className="animate-pulse flex flex-col items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-primary/20"></div>
                <div className="h-4 w-32 rounded bg-primary/20"></div>
                <div className="h-3 w-48 rounded bg-primary/10"></div>
              </div>
              <p className="mt-4 text-muted-foreground">
                Loading interview details...
              </p>
            </div>
          </Card>
        ) : error ? (
          <Card className="p-6">
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <div className="text-destructive mb-4 rounded-full bg-destructive/10 p-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-6 w-6"
                >
                  <path d="M18 6 6 18"></path>
                  <path d="m6 6 12 12"></path>
                </svg>
              </div>
              <h3 className="text-lg font-semibold">Error Loading Interview</h3>
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
        ) : (
          <>
            {/* Call Status Card */}
            <Card className="p-6">
              <div className="flex flex-col items-center justify-center space-y-6">
                <div
                  className={`relative ${isConnecting ? "animate-pulse" : ""}`}
                >
                  <div
                    className={`
                    w-24 h-24 rounded-full flex items-center justify-center
                    ${isConnected ? "bg-green-500/20" : "bg-primary/10"}
                  `}
                  >
                    {isConnected ? (
                      <Mic className="h-10 w-10 text-green-500" />
                    ) : (
                      <MicOff className="h-10 w-10 text-primary" />
                    )}
                  </div>
                  {isConnected && (
                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2">
                      <span className="inline-flex items-center rounded-full bg-green-500/10 px-2.5 py-0.5 text-xs font-medium text-green-500">
                        Connected
                      </span>
                    </div>
                  )}
                </div>

                <div className="text-center space-y-2">
                  <h2 className="text-xl font-semibold">
                    {isConnected
                      ? "Interview in Progress"
                      : isConnecting
                      ? "Connecting..."
                      : "Ready to Start"}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    {isConnected
                      ? "Speak clearly and take your time with your responses"
                      : "Click start when you're ready to begin"}
                  </p>
                </div>

                <Button
                  size="lg"
                  variant={isConnected ? "destructive" : "default"}
                  className="w-full max-w-sm"
                  onClick={isConnected ? handleEndCall : handleStartCall}
                  disabled={isConnecting}
                >
                  {isConnecting ? (
                    <span className="flex items-center gap-2">
                      <Phone className="h-4 w-4 animate-pulse" />
                      Connecting...
                    </span>
                  ) : isConnected ? (
                    <span className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      End Interview
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      Start Interview
                    </span>
                  )}
                </Button>
              </div>
            </Card>

            {/* Current Question Display */}
            {isConnected && (
              <Card className="p-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-sm text-muted-foreground">
                      Current Question:
                    </h3>
                    <p className="text-lg mt-1">
                      Tell me about a challenging project you've worked on and
                      how you handled it.
                    </p>
                  </div>
                  <div className="border-t pt-4">
                    <h3 className="font-semibold text-sm text-muted-foreground mb-2">
                      Tips:
                    </h3>
                    <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
                      <li>Structure your response using the STAR method</li>
                      <li>Include specific examples and outcomes</li>
                      <li>Keep your answer focused and concise</li>
                    </ul>
                  </div>
                </div>
              </Card>
            )}

            {/* Instructions Card */}
            {!isConnected && (
              <Card className="p-6 bg-muted/50">
                <h3 className="font-semibold mb-2">Before you begin:</h3>
                <ul className="space-y-2 text-sm text-muted-foreground list-disc list-inside">
                  <li>Find a quiet place with minimal background noise</li>
                  <li>Test your microphone and make sure it's working</li>
                  <li>Have a glass of water ready</li>
                  <li>Take deep breaths and stay calm</li>
                  <li>You can end the interview at any time</li>
                </ul>
              </Card>
            )}
          </>
        )}
      </div>
    </div>
  );
}
