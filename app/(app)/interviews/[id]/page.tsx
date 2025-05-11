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
import { createFeedback } from "@/lib/actions/auth.action";

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

interface PageParams {
  id: string;
}

interface SavedMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

enum CallStatus {
  INACTIVE = "INACTIVE",
  CONNECTING = "CONNECTING",
  ACTIVE = "ACTIVE",
  FINISHED = "FINISHED",
}

enum MessageTypeEnum {
  TRANSCRIPT = "transcript",
  FUNCTION_CALL = "function-call",
  FUNCTION_CALL_RESULT = "function-call-result",
  ADD_MESSAGE = "add-message",
}

enum MessageRoleEnum {
  USER = "user",
  SYSTEM = "system",
  ASSISTANT = "assistant",
}

enum TranscriptMessageTypeEnum {
  PARTIAL = "partial",
  FINAL = "final",
}

interface BaseMessage {
  type: MessageTypeEnum;
}

interface TranscriptMessage extends BaseMessage {
  type: MessageTypeEnum.TRANSCRIPT;
  role: MessageRoleEnum;
  transcriptType: TranscriptMessageTypeEnum;
  transcript: string;
}

interface FunctionCallMessage extends BaseMessage {
  type: MessageTypeEnum.FUNCTION_CALL;
  functionCall: {
    name: string;
    parameters: unknown;
  };
}

interface FunctionCallResultMessage extends BaseMessage {
  type: MessageTypeEnum.FUNCTION_CALL_RESULT;
  functionCallResult: {
    forwardToClientEnabled?: boolean;
    result: unknown;
    [a: string]: unknown;
  };
}

type Message =
  | TranscriptMessage
  | FunctionCallMessage
  | FunctionCallResultMessage;

// @ts-ignore
export const interviewer: CreateAssistantDTO = {
  name: "Interviewer",
  firstMessage:
    "Hello! Thank you for taking the time to speak with me today. I'm excited to learn more about you and your experience.",
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
};

export default function InterviewSessionPage({
  params,
}: {
  params: Promise<PageParams>;
}) {
  const router = useRouter();
  const [callStatus, setCallStatus] = useState<CallStatus>(CallStatus.INACTIVE);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [interview, setInterview] = useState<Interview | null>(null);
  const [messages, setMessages] = useState<SavedMessage[]>([]);
  const [lastMessage, setLastMessage] = useState<string>("");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const unwrappedParams = use(params);
  useEffect(() => {
    async function fetchInterview() {
      setLoading(true);
      try {
        // First check if feedback exists for this interview
        const feedbackResponse = await fetch(
          `/api/user/interviews/${unwrappedParams.id}/feedback`
        );

        // If feedback exists (200 OK response), redirect to feedback page
        if (feedbackResponse.ok) {
          const feedbackData = await feedbackResponse.json();
          if (feedbackData.feedback) {
            toast.info("Interview feedback already exists");
            router.push(`/interviews/${unwrappedParams.id}/feedback`);
            return;
          }
        }

        // Fetch interview data if no feedback exists
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
  }, [unwrappedParams.id, router]);

  useEffect(() => {
    const onCallStart = () => {
      console.log("Call started...");
      setCallStatus(CallStatus.ACTIVE);
    };

    const onCallEnd = () => {
      console.log("Call ended");
      setCallStatus(CallStatus.FINISHED);
    };

    const onMessage = (message: any) => {
      // Handle transcription messages
      if (message.type === MessageTypeEnum.TRANSCRIPT) {
        if (message.transcriptType === TranscriptMessageTypeEnum.FINAL) {
          console.log("Final transcript received:", message.transcript);
          const newMessage = {
            role: message.role,
            content: message.transcript,
          };
          setMessages((prev) => {
            const updated = [...prev, newMessage];
            console.log("Updated messages array:", updated);
            return updated;
          });
        }
      }
    };

    const onSpeechStart = () => {
      console.log("speech start");
      setIsSpeaking(true);
    };

    const onSpeechEnd = () => {
      console.log("speech end");
      setIsSpeaking(false);
    };

    const onError = (error: any) => {
      console.error("VAPI error:", error);
      toast.error(
        "Error with the interview: " + (error?.message || "Unknown error")
      );
    };

    // Add logging for all events to ensure they're registered
    console.log("Registering VAPI event handlers");
    vapi.on("call-start", onCallStart);
    vapi.on("call-end", onCallEnd);
    vapi.on("message", onMessage);
    vapi.on("speech-start", onSpeechStart);
    vapi.on("speech-end", onSpeechEnd);
    vapi.on("error", onError);

    return () => {
      vapi.off("call-start", onCallStart);
      vapi.off("call-end", onCallEnd);
      vapi.off("message", onMessage);
      vapi.off("speech-start", onSpeechStart);
      vapi.off("speech-end", onSpeechEnd);
      vapi.off("error", onError);
    };
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      setLastMessage(messages[messages.length - 1].content);
    }

    const handleGenerateFeedback = async (messages: SavedMessage[]) => {
      console.log("Generating feedback from transcript:", messages);

      if (messages.length === 0 || !interview) {
        toast.error("Interview completed, but no transcript was recorded");
        router.push("/interviews");
        return;
      }

      const loadingToast = toast.loading("Generating feedback...");

      try {
        const result = await createFeedback({
          interviewId: interview.id,
          userId: interview.userId,
          transcript: messages,
        });

        toast.dismiss(loadingToast);

        if (result.success) {
          toast.success("Interview completed! Feedback generated successfully");
          router.push(`/interviews/${unwrappedParams.id}/feedback`);
        } else {
          toast.error(
            "Interview completed, but there was an issue generating feedback"
          );
          router.push(`/interviews/${unwrappedParams.id}`);
        }
      } catch (error) {
        toast.dismiss(loadingToast);
        console.error("Failed to generate feedback:", error);
        toast.error("Failed to generate feedback");
        router.push(`/interviews`);
      }
    };

    if (callStatus === CallStatus.FINISHED) {
      handleGenerateFeedback(messages);
    }
  }, [messages, callStatus, interview, router, unwrappedParams.id]);

  const handleStartCall = async () => {
    setCallStatus(CallStatus.CONNECTING);
    setMessages([]);

    try {
      let formattedQuestions = "";
      formattedQuestions =
        interview?.questions
          .map((question, index) => `${index + 1}. ${question}`)
          .join("\n") || "";

      // @ts-ignore
      await vapi.start(interviewer, {
        variableValues: {
          questions: formattedQuestions,
        },
      });

      toast.success("Connected to AI interviewer");
    } catch (error) {
      console.error("Failed to connect:", error);
      toast.error("Failed to connect to AI interviewer");
      setCallStatus(CallStatus.INACTIVE);
    }
  };

  const handleEndCall = () => {
    setCallStatus(CallStatus.FINISHED);
    vapi.stop();
  };

  return (
    <div className="container mx-auto p-6 max-w-2xl">
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">Interview Session</h1>
          <p className="text-muted-foreground">
            Your interview is ready to begin
          </p>
        </div>

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
            <Card className="p-6">
              <div className="flex flex-col items-center justify-center space-y-6">
                <div
                  className={`relative ${
                    callStatus === CallStatus.CONNECTING ? "animate-pulse" : ""
                  }`}
                >
                  <div
                    className={`
                    w-24 h-24 rounded-full flex items-center justify-center
                    ${
                      callStatus === CallStatus.ACTIVE
                        ? "bg-green-500/20"
                        : "bg-primary/10"
                    }
                  `}
                  >
                    {callStatus === CallStatus.ACTIVE ? (
                      <div className="relative">
                        <Mic className="h-10 w-10 text-green-500" />
                        {isSpeaking && (
                          <span className="absolute -top-1 -right-1 flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                          </span>
                        )}
                      </div>
                    ) : (
                      <MicOff className="h-10 w-10 text-primary" />
                    )}
                  </div>
                  {callStatus === CallStatus.ACTIVE && (
                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2">
                      <span className="inline-flex items-center rounded-full bg-green-500/10 px-2.5 py-0.5 text-xs font-medium text-green-500">
                        Connected
                      </span>
                    </div>
                  )}
                </div>

                <div className="text-center space-y-2">
                  <h2 className="text-xl font-semibold">
                    {callStatus === CallStatus.ACTIVE
                      ? "Interview in Progress"
                      : callStatus === CallStatus.CONNECTING
                      ? "Connecting..."
                      : "Ready to Start"}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    {callStatus === CallStatus.ACTIVE
                      ? "Speak clearly and take your time with your responses"
                      : "Click start when you're ready to begin"}
                  </p>
                </div>

                <Button
                  size="lg"
                  variant={
                    callStatus === CallStatus.ACTIVE ? "destructive" : "default"
                  }
                  className="w-full max-w-sm"
                  onClick={
                    callStatus === CallStatus.ACTIVE
                      ? handleEndCall
                      : handleStartCall
                  }
                  disabled={
                    callStatus === CallStatus.CONNECTING ||
                    callStatus === CallStatus.FINISHED
                  }
                >
                  {callStatus === CallStatus.CONNECTING ? (
                    <span className="flex items-center gap-2">
                      <Phone className="h-4 w-4 animate-pulse" />
                      Connecting...
                    </span>
                  ) : callStatus === CallStatus.ACTIVE ? (
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

            {callStatus === CallStatus.ACTIVE && (
              <>
                {lastMessage && (
                  <Card className="p-4 mt-4 bg-secondary/5 border-secondary/20">
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium">Last message:</h3>
                      <p className="text-sm text-muted-foreground">
                        {lastMessage}
                      </p>
                      <div className="text-xs text-muted-foreground mt-1">
                        Messages recorded: {messages.length}
                      </div>
                    </div>
                  </Card>
                )}

                <Card className="p-6">
                  <div className="space-y-4">
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
              </>
            )}

            {callStatus !== CallStatus.ACTIVE &&
              callStatus !== CallStatus.FINISHED && (
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
