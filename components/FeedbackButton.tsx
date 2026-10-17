"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { MessageSquare, X } from "lucide-react";
import { toast } from "sonner";
import { Textarea } from "./ui/textarea";

export function FeedbackButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [feedbackType, setFeedbackType] = useState("feature_request");
  const [feedbackText, setFeedbackText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!feedbackText.trim()) {
      toast.error("Please enter your feedback");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/user/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ feedbackType, feedbackText }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to submit feedback");
      }

      toast.success("Thank you for your feedback!");
      setFeedbackText("");
      setIsOpen(false);
    } catch (error) {
      console.error("Error submitting feedback:", error);
      toast.error("Failed to submit feedback. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Floating button */}
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 size-12 rounded-full shadow-lg shadow-primary/25"
        aria-label="Submit feedback"
      >
        <MessageSquare className="size-5" />
      </Button>

      {/* Feedback modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
          <Card className="relative w-full max-w-md gap-0 p-6">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
              className="absolute right-2 top-2 rounded-full"
            >
              <X className="size-4" />
            </Button>

            <h2 className="font-display text-xl font-bold tracking-tight">
              Share your feedback
            </h2>
            <p className="text-sm text-muted-foreground">
              We&apos;d love to hear your thoughts on how we can improve
              SnapHire.
            </p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-5">
              <div>
                <Label htmlFor="feedback-type" className="mb-2 block">
                  Type of feedback
                </Label>
                <select
                  id="feedback-type"
                  value={feedbackType}
                  onChange={(e) => setFeedbackType(e.target.value)}
                  className="h-11 w-full rounded-lg border border-input bg-card px-3.5 text-sm shadow-xs outline-none transition-[color,box-shadow,border-color] focus-visible:border-primary/50 focus-visible:ring-[3px] focus-visible:ring-ring/25"
                >
                  <option value="feature_request">Feature request</option>
                  <option value="bug_report">Bug report</option>
                  <option value="general_feedback">General feedback</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <Label htmlFor="feedback-text" className="mb-2 block">
                  Your feedback
                </Label>
                <Textarea
                  id="feedback-text"
                  placeholder="Please describe your feedback in detail..."
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  rows={5}
                  className="w-full"
                />
              </div>

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Submit feedback"}
              </Button>
            </form>
          </Card>
        </div>
      )}
    </>
  );
}
