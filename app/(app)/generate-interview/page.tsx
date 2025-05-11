"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Mic, Phone, PhoneOff, Loader2, Lock } from "lucide-react";
import { vapi } from "@/lib/vapi.sdk";
import { getCurrentUser } from "@/lib/actions/auth.action";
import { toast } from "sonner";
import { useFeatureAccess } from "@/lib/hooks/use-feature-access";
import Link from "next/link";

interface SavedMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

export default function GenerateInterviewPage() {
  const router = useRouter();
  const [isCallActive, setIsCallActive] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [messages, setMessages] = useState<SavedMessage[]>([]);
  const [isInitiatingCall, setIsInitiatingCall] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const { canConductInterview } = useFeatureAccess();

  // Define all event handlers first before useEffect
  const handleCallStart = () => {
    setIsCallActive(true);
  };

  const handleEndCall = async () => {
    setIsCallActive(false);

    try {
      vapi.stop();
    } catch (error) {
      console.error("Error stopping call:", error);
    }

    try {
      router.push(`/interviews`);
    } catch (error) {
      console.error("Failed to generate interview:", error);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const handleStartCall = async () => {
    if (!userId) {
      toast.error("Please sign in to use this feature");
      router.push("/sign-in?redirect=/generate-interview");
      return;
    }

    setIsInitiatingCall(true);
    try {
      // @ts-ignore
      await vapi.start(process.env.NEXT_PUBLIC_VAPI_WORKFLOW_ID!, {
        variableValues: {
          userid: userId,
        },
      });
    } catch (error) {
      console.error("Failed to start Vapi call:", error);
      toast.error("Failed to start call. Please try again.");
    } finally {
      setIsInitiatingCall(false);
    }
  };

  // Authentication check and user fetch
  useEffect(() => {
    async function checkAuth() {
      setIsLoading(true);
      try {
        const user = await getCurrentUser();
        if (!user) {
          toast.error("Please sign in to use this feature");
          router.push("/sign-in?redirect=/generate-interview");
          return;
        }
        setUserId(user.id);
      } catch (error) {
        console.error("Authentication error:", error);
        toast.error("Authentication error. Please sign in again.");
        router.push("/sign-in?redirect=/generate-interview");
      } finally {
        setIsLoading(false);
      }
    }

    checkAuth();
  }, [router]);

  // Set up call event handlers
  useEffect(() => {
    const handleMessage = (message: SavedMessage) => {
      setMessages((prev) => [...prev, message]);
    };

    const onStartCall = () => {
      setIsCallActive(true);
    };

    const onError = (error: any) => {
      console.error("Error from VAPI:", error);
    };

    vapi.on("call-start", onStartCall);
    vapi.on("message", handleMessage);
    vapi.on("call-end", handleEndCall);
    vapi.on("error", onError);

    return () => {
      vapi.off("call-start", onStartCall);
      vapi.off("message", handleMessage);
      vapi.off("call-end", handleEndCall);
      vapi.off("error", onError);
    };
  }, []);

  // Timer for call duration
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isCallActive) {
      interval = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isCallActive]);

  // Check if user has access to interview functionality
  const hasInterviewAccess = canConductInterview();

  // Render the access restricted UI if user doesn't have access
  if (!hasInterviewAccess) {
    return (
      <div className="container py-10">
        <Card className="p-8 max-w-2xl mx-auto">
          <div className="flex flex-col items-center text-center">
            <div className="p-3 rounded-full bg-amber-100 mb-4">
              <Lock className="h-8 w-8 text-amber-700" />
            </div>

            <h1 className="text-2xl font-bold mb-2">
              Interview Access Required
            </h1>

            <p className="text-muted-foreground mb-6">
              To conduct mock interviews, you need either an active subscription
              or interview credits.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button asChild>
                <Link href="/pricing">Get a Subscription</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/pricing?tab=pay-per-interview">
                  Buy Interview Credits
                </Link>
              </Button>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-2xl">
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">Voice Interview Setup</h1>
          <p className="text-muted-foreground">
            Tell us about the interview you want to practice
          </p>
        </div>

        <Card className="p-6">
          <div className="space-y-8">
            {isLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <div className="text-center space-y-4">
                {!isCallActive ? (
                  <>
                    <div className="w-24 h-24 bg-primary/5 rounded-full flex items-center justify-center mx-auto">
                      <Mic className="h-12 w-12 text-primary" />
                    </div>
                    <div>
                      <Button
                        size="lg"
                        onClick={handleStartCall}
                        className="gap-2"
                        disabled={isInitiatingCall || !userId}
                      >
                        {isInitiatingCall ? (
                          <>
                            <Loader2 className="h-5 w-5 animate-spin" />
                            Starting...
                          </>
                        ) : (
                          <>
                            <Phone className="h-5 w-5" />
                            Start Voice Call
                          </>
                        )}
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Click to start the voice call and describe your interview
                      preferences
                    </p>
                  </>
                ) : (
                  <>
                    <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto animate-pulse">
                      <Mic className="h-12 w-12 text-red-500" />
                    </div>
                    <div className="text-xl font-medium">Call in Progress</div>
                    <div className="text-2xl font-bold text-primary">
                      {formatTime(callDuration)}
                    </div>
                    <div>
                      <Button
                        variant="destructive"
                        size="lg"
                        onClick={handleEndCall}
                        className="gap-2"
                      >
                        <PhoneOff className="h-5 w-5" />
                        End Call
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Your interview will be generated when you end the call
                    </p>
                  </>
                )}
              </div>
            )}

            <div className="space-y-4 text-sm text-muted-foreground">
              <h3 className="font-medium text-foreground">Instructions:</h3>
              <ul className="list-disc pl-4 space-y-2">
                <li>
                  Speak clearly and describe the type of interview you want
                </li>
                <li>Mention the role you're interviewing for</li>
                <li>
                  Specify any specific topics or areas you want to focus on
                </li>
                <li>
                  The interview will be generated based on your voice input
                </li>
              </ul>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
