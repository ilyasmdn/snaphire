"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Bell, User, Shield, Moon, Sun, LucideIcon, CreditCard } from "lucide-react";
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
      title: "Notifications",
      icon: Bell,
      description: "Configure how you receive notifications",
      settings: [
        {
          label: "Email Notifications",
          type: "toggle",
          value: true,
          editable: true,
        },
        {
          label: "Interview Reminders",
          type: "toggle",
          value: true,
          editable: true,
        },
      ],
    },
    {
      title: "Privacy",
      icon: Shield,
      description: "Manage your privacy and security settings",
      settings: [
        {
          label: "Profile Visibility",
          type: "select",
          value: "private",
          options: ["private", "public"],
          editable: true,
        },
        {
          label: "Two-Factor Authentication",
          type: "toggle",
          value: false,
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

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account settings and preferences
        </p>
      </div>

      <div className="space-y-6">
        {/* Subscription Section */}
        <div className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          <h2 className="text-xl font-semibold">Subscription</h2>
        </div>
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
                      <Label htmlFor={setting.label}>{setting.label}</Label>
                      {(setting.type === "text" ||
                        setting.type === "email") && (
                        <Input
                          id={setting.label}
                          type={setting.type}
                          defaultValue={setting.value}
                          className="max-w-md"
                        />
                      )}
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
                  ))}
                </div>

                <Button variant="outline">Save Changes</Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
