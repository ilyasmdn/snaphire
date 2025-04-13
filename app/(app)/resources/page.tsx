"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Book,
  Bookmark,
  FileText,
  Play,
  Youtube,
  Download,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";

interface Resource {
  title: string;
  description: string;
  icon: typeof Book | typeof FileText | typeof Youtube;
  type: "guide" | "template" | "video";
  link: string;
  isExternal?: boolean;
}

export default function ResourcesPage() {
  const resources: Resource[] = [
    {
      title: "STAR Method Guide",
      description:
        "Learn how to structure your interview answers using the STAR (Situation, Task, Action, Result) method.",
      icon: Book,
      type: "guide",
      link: "/resources/star-method",
    },
    {
      title: "Technical Interview Checklist",
      description:
        "A comprehensive checklist to help you prepare for technical interviews.",
      icon: FileText,
      type: "template",
      link: "/downloads/tech-interview-checklist.pdf",
    },
    {
      title: "Common Behavioral Questions",
      description:
        "50+ common behavioral interview questions with example answers.",
      icon: Book,
      type: "guide",
      link: "/resources/behavioral-questions",
    },
    {
      title: "Resume Templates",
      description: "Professional resume templates optimized for ATS systems.",
      icon: FileText,
      type: "template",
      link: "/downloads/resume-templates.zip",
    },
    {
      title: "Interview Body Language",
      description:
        "Video guide on professional body language during interviews.",
      icon: Youtube,
      type: "video",
      link: "https://youtube.com/watch?v=example",
      isExternal: true,
    },
    {
      title: "Thank You Email Templates",
      description: "Professional email templates to send after your interview.",
      icon: FileText,
      type: "template",
      link: "/resources/thank-you-emails",
    },
  ];

  const getTypeStyles = (type: Resource["type"]) => {
    switch (type) {
      case "guide":
        return "bg-primary/10 text-primary";
      case "template":
        return "bg-green-500/10 text-green-500";
      case "video":
        return "bg-red-500/10 text-red-500";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getActionIcon = (type: Resource["type"], isExternal?: boolean) => {
    if (isExternal) return ExternalLink;
    switch (type) {
      case "template":
        return Download;
      default:
        return Play;
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Resources</h1>
        <p className="text-muted-foreground">
          Interview guides, templates, and learning materials
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {resources.map((resource) => {
          const ActionIcon = getActionIcon(resource.type, resource.isExternal);

          return (
            <Card key={resource.title} className="p-6">
              <div className="flex items-start gap-4">
                <div
                  className={`p-2 rounded-lg ${getTypeStyles(resource.type)}`}
                >
                  <resource.icon className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold truncate">{resource.title}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                    {resource.description}
                  </p>
                  <Button asChild variant="outline" className="w-full">
                    <Link
                      href={resource.link}
                      target={resource.isExternal ? "_blank" : undefined}
                      rel={
                        resource.isExternal ? "noopener noreferrer" : undefined
                      }
                    >
                      <ActionIcon className="mr-2 h-4 w-4" />
                      {resource.type === "template" ? "Download" : "View"}
                      {resource.isExternal && " (External)"}
                    </Link>
                  </Button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Bookmarks Section */}
      <div className="mt-12">
        <div className="flex items-center gap-2 mb-6">
          <Bookmark className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-semibold">Saved Resources</h2>
        </div>
        <Card className="p-6 flex items-center justify-center text-muted-foreground">
          <p>You haven't saved any resources yet</p>
        </Card>
      </div>
    </div>
  );
}
