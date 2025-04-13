"use client";

import { useState, use } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mic, MicOff, Phone } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface PageParams {
  id: string;
}

export default function InterviewSessionPage({
  params,
}: {
  params: Promise<PageParams>;
}) {
  const router = useRouter();
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const unwrappedParams = use(params);

  const handleStartCall = async () => {
    try {
      setIsConnecting(true);
      // TODO: Add voice API connection logic here
      await new Promise((resolve) => setTimeout(resolve, 1500)); // Simulate connection
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
      router.push(`/interviews/${unwrappedParams.id}`);
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

        {/* Call Status Card */}
        <Card className="p-6">
          <div className="flex flex-col items-center justify-center space-y-6">
            <div className={`relative ${isConnecting ? "animate-pulse" : ""}`}>
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
                  Tell me about a challenging project you've worked on and how
                  you handled it.
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
      </div>
    </div>
  );
}
