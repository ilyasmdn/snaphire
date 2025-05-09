"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  User,
  Shield,
  Moon,
  Sun,
  LucideIcon,
  CreditCard,
  FileText,
  Settings,
  AlertCircle,
  Info,
  MessageSquare,
} from "lucide-react";
import { SubscriptionManagement } from "@/components/SubscriptionManagement";

interface TextSetting {
  label: string;
  type: "text" | "email";
  value: string;
  editable: boolean;
}

interface ToggleSetting {
  label: string;
  type: "toggle";
  value: boolean;
  editable: boolean;
}

interface SelectSetting {
  label: string;
  type: "select";
  value: string;
  options: string[];
  editable: boolean;
}

type Setting = TextSetting | ToggleSetting | SelectSetting;

interface SettingsSection {
  title: string;
  icon: LucideIcon;
  description: string;
  settings: Setting[];
}

export default function SettingsPage() {
  const [theme, setTheme] = useState("dark");
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);

  const sections: SettingsSection[] = [
    {
      title: "Account",
      icon: User,
      description: "Manage your account settings and preferences",
      settings: [
        {
          label: "Name",
          type: "text",
          value: "John Doe",
          editable: true,
        },
        {
          label: "Email",
          type: "email",
          value: "john@example.com",
          editable: true,
        },
      ],
    },
    {
      title: "Feedback",
      icon: MessageSquare,
      description: "Help us improve SnapHire with your feedback",
      settings: [
        {
          label: "Feedback Type",
          type: "select",
          value: "feature_request",
          options: [
            "feature_request",
            "bug_report",
            "general_feedback",
            "other",
          ],
          editable: true,
        },
        {
          label: "Your Feedback",
          type: "text",
          value: "",
          editable: true,
        },
      ],
    },
    {
      title: "Interview Preferences",
      icon: Settings,
      description: "Customize your interview experience",
      settings: [
        {
          label: "Default Interview Duration",
          type: "select",
          value: "30min",
          options: ["15min", "30min", "45min", "60min"],
          editable: true,
        },
        {
          label: "Difficulty Level",
          type: "select",
          value: "intermediate",
          options: ["beginner", "intermediate", "advanced", "expert"],
          editable: true,
        },
        {
          label: "Auto-save Interview Recordings",
          type: "toggle",
          value: true,
          editable: true,
        },
      ],
    },
    {
      title: "Resume & Profile",
      icon: FileText,
      description: "Update your career profile and experience",
      settings: [
        {
          label: "Current Role",
          type: "text",
          value: "Software Engineer",
          editable: true,
        },
        {
          label: "Years of Experience",
          type: "select",
          value: "3-5",
          options: ["0-2", "3-5", "6-10", "10+"],
          editable: true,
        },
        {
          label: "Upload Resume",
          type: "text",
          value: "resume.pdf",
          editable: true,
        },
      ],
    },
  ];
  const handleToggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.body.classList.toggle("dark", newTheme === "dark");
    localStorage.setItem("theme", newTheme);
  };
  const handleFeedbackSubmit = async () => {
    // Get values from the DOM since we don't have state management for the form
    const feedbackType =
      (document.getElementById("Feedback Type") as HTMLSelectElement)?.value ||
      "general_feedback";
    const feedbackText =
      (document.getElementById("Your Feedback") as HTMLTextAreaElement)
        ?.value || "";

    if (!feedbackText) {
      toast.error("Please enter your feedback");
      return;
    }

    setIsSubmittingFeedback(true);

    try {
      const response = await fetch("/api/user/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          feedbackType,
          feedbackText,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to submit feedback");
      }

      toast.success("Thank you for your feedback!");

      // Reset the feedback field
      const feedbackInput = document.getElementById(
        "Your Feedback"
      ) as HTMLTextAreaElement;
      if (feedbackInput) {
        feedbackInput.value = "";
      }
    } catch (error) {
      console.error("Error submitting feedback:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to submit feedback"
      );
    } finally {
      setIsSubmittingFeedback(false);
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account settings and preferences
        </p>
      </div>{" "}
      <div className="space-y-6">
        <SubscriptionManagement />
        {/* Theme Toggle */}
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="text-lg font-semibold">Appearance</h3>
              <p className="text-sm text-muted-foreground">
                Toggle between light and dark themes
              </p>
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={handleToggleTheme}
              className="h-9 w-9"
            >
              {theme === "light" ? (
                <Moon className="h-4 w-4" />
              ) : (
                <Sun className="h-4 w-4" />
              )}
            </Button>
          </div>
        </Card>
        {/* Update Notice */}{" "}
        <Card className="p-4 border-amber-200 bg-amber-50 dark:bg-amber-950/30 dark:border-amber-800">
          <p className="text-sm text-amber-800 dark:text-amber-300 flex items-center">
            <Info className="h-4 w-4 mr-2 inline" />
            Note: Account, Interview Preferences and Resume &amp; Profile
            features will be activated in the next update.
          </p>
        </Card>
        {/* Settings Sections */}
        {sections.map((section) => (
          <Card key={section.title} className="p-6">
            <div className="flex items-start gap-4">
              <div className="p-2 rounded-lg bg-primary/10">
                <section.icon className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1 space-y-4">
                <div>
                  <h2 className="text-lg font-semibold">{section.title}</h2>
                  <p className="text-sm text-muted-foreground">
                    {section.description}
                  </p>
                </div>

                <div className="space-y-4">
                  {section.settings.map((setting) => (
                    <div key={setting.label} className="flex flex-col gap-2">
                      <Label htmlFor={setting.label}>{setting.label}</Label>{" "}
                      {(setting.type === "text" || setting.type === "email") &&
                        (setting.label === "Your Feedback" ? (
                          <Textarea
                            id={setting.label}
                            defaultValue={setting.value}
                            className="max-w-md min-h-[120px]"
                            placeholder="Share your thoughts, suggestions, or report issues..."
                          />
                        ) : (
                          <Input
                            id={setting.label}
                            type={setting.type}
                            defaultValue={setting.value}
                            className="max-w-md"
                          />
                        ))}
                      {setting.type === "toggle" && (
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            id={setting.label}
                            defaultChecked={setting.value}
                            className="h-4 w-4"
                          />
                          <Label htmlFor={setting.label}>Enabled</Label>
                        </div>
                      )}
                      {setting.type === "select" && (
                        <select
                          id={setting.label}
                          defaultValue={setting.value}
                          className="max-w-md rounded-md border border-input bg-background p-2"
                        >
                          {setting.options.map((option) => (
                            <option key={option} value={option}>
                              {option.charAt(0).toUpperCase() + option.slice(1)}
                            </option>
                          ))}
                        </select>
                      )}
                    </div>
                  ))}{" "}
                </div>

                <Button
                  variant="outline"
                  onClick={() =>
                    section.title === "Feedback"
                      ? handleFeedbackSubmit()
                      : toast.info("Changes saved")
                  }
                  disabled={
                    section.title === "Feedback" && isSubmittingFeedback
                  }
                >
                  {section.title === "Feedback" && isSubmittingFeedback
                    ? "Submitting..."
                    : section.title === "Feedback"
                    ? "Submit Feedback"
                    : "Save Changes"}
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
