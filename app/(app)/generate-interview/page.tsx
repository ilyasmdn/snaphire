"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Mic, Phone, PhoneOff, Loader2, CheckCircle2 } from "lucide-react";
import { vapi } from "@/lib/vapi.sdk";
import { getCurrentUser } from "@/lib/actions/auth.action";
import { toast } from "sonner";
import { useFeatureAccess } from "@/lib/hooks/use-feature-access";
import { UpgradeCard } from "@/components/UpgradeCard";

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
      handleCallStart();
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
      <div className="space-y-8 py-6">
        <div className="space-y-1">
          <h1 className="font-display text-3xl font-bold tracking-tight">
            New Interview
          </h1>
          <p className="text-muted-foreground">
            Practice a realistic mock interview with AI
          </p>
        </div>

        <UpgradeCard
          title="Interview access required"
          description="To conduct mock interviews, you need either an active subscription or interview credits."
          primaryLabel="Get a subscription"
          secondaryHref="/pricing?tab=pay-per-interview"
          secondaryLabel="Buy interview credits"
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6 py-6">
      <div className="space-y-2 text-center">
        <h1 className="font-display text-3xl font-bold tracking-tight">
          Voice Interview Setup
        </h1>
        <p className="text-muted-foreground">
          Tell us about the interview you want to practice
        </p>
      </div>

      <Card className="overflow-hidden border-border/70 p-6">
        <div className="space-y-8">
          {isLoading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="size-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="space-y-5 text-center">
              {!isCallActive ? (
                <>
                  <div className="relative mx-auto flex size-28 items-center justify-center">
                    <span className="absolute inset-0 rounded-full bg-primary/10" />
                    <span className="absolute inset-3 rounded-full bg-primary/10" />
                    <span className="relative flex size-20 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-primary-foreground shadow-lg shadow-primary/30">
                      <Mic className="size-9" />
                    </span>
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
                          <Loader2 className="size-5 animate-spin" />
                          Starting...
                        </>
                      ) : (
                        <>
                          <Phone className="size-5" />
                          Start voice call
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
                  <div className="relative mx-auto flex size-28 items-center justify-center">
                    <span className="absolute inset-0 animate-ping rounded-full bg-red-500/15" />
                    <span className="absolute inset-3 rounded-full bg-red-500/15" />
                    <span className="relative flex size-20 items-center justify-center rounded-full bg-red-500/20">
                      <Mic className="size-9 text-red-500" />
                    </span>
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <span className="flex size-2 rounded-full bg-red-500" />
                    <span className="text-sm font-medium text-red-500">
                      Call in progress
                    </span>
                  </div>
                  <div className="font-display text-4xl font-bold tabular-nums tracking-tight">
                    {formatTime(callDuration)}
                  </div>
                  <div>
                    <Button
                      variant="destructive"
                      size="lg"
                      onClick={handleEndCall}
                      className="gap-2"
                    >
                      <PhoneOff className="size-5" />
                      End call
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Your interview will be generated when you end the call
                  </p>
                </>
              )}
            </div>
          )}

          <div className="space-y-4 rounded-xl border border-border/60 bg-muted/30 p-5">
            <h3 className="font-display text-sm font-semibold">
              Before you begin
            </h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {[
                "Speak clearly and describe the type of interview you want",
                "Mention the role you're interviewing for",
                "Specify any specific topics or areas you want to focus on",
                "The interview will be generated based on your voice input",
              ].map((item) => (
                <li key={item} className="flex gap-2.5">
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
}
