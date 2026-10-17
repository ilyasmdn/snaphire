"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UpgradeCard } from "@/components/UpgradeCard";
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
import { useFeatureAccess } from "@/lib/hooks/use-feature-access";

interface Resource {
  title: string;
  description: string;
  icon: typeof Book | typeof FileText | typeof Youtube;
  type: "guide" | "template" | "video";
  link: string;
  isExternal?: boolean;
}

export default function ResourcesPage() {
  const { canUseFeature } = useFeatureAccess();
  const hasLearningResourcesAccess = canUseFeature("learning_resources");

  // If user doesn't have access to learning resources, show upgrade UI
  if (!hasLearningResourcesAccess) {
    return (
      <div className="space-y-8 py-6">
        <div className="space-y-1">
          <h1 className="font-display text-3xl font-bold tracking-tight">
            Learning Resources
          </h1>
          <p className="text-muted-foreground">
            Interview guides, templates, and learning materials
          </p>
        </div>

        <UpgradeCard
          title="Pro resources"
          description="Our curated learning resources are available exclusively for Pro and Teams subscribers. Upgrade to access guides, templates, and tutorial videos to help you ace your interviews."
          primaryLabel="Upgrade to Pro"
        />
      </div>
    );
  }

  const resources: Resource[] = [
    {
      title: "STAR Method Guide",
      description:
        "Learn how to structure your interview answers using the STAR (Situation, Task, Action, Result) method.",
      icon: Book,
      type: "guide",
      link: "https://career.unm.edu/career-tools/star-method-interview-prep-packet-2020.pdf",
      isExternal: true,
    },
    {
      title: "Technical Interview Checklist",
      description:
        "A comprehensive checklist to help you prepare for technical interviews.",
      icon: FileText,
      type: "template",
      link: "/resources/tech-interview-checklist.pdf",
    },
    {
      title: "Common Behavioral Questions",
      description:
        "50+ common behavioral interview questions with example answers.",
      icon: Book,
      type: "guide",
      link: "https://www.macslist.org/wp-content/uploads/2018/01/100-Practice-Behavioral-Interview-Questions.pdf",
      isExternal: true,
    },
    {
      title: "Interview Body Language",
      description:
        "Video guide on professional body language during interviews.",
      icon: Youtube,
      type: "video",
      link: "https://www.youtube.com/watch?v=Go4GVvcS02Y&ab_channel=CareerVidz",
      isExternal: true,
    },
    {
      title: "Thank You Email Templates",
      description: "Professional email templates to send after your interview.",
      icon: FileText,
      type: "template",
      link: "/resources/Post-Interview_Thank_You_Email_Template.pdf",
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
    <div className="space-y-8">
      <div className="space-y-1">
        <h1 className="font-display text-3xl font-bold tracking-tight">
          Resources
        </h1>
        <p className="text-muted-foreground">
          Interview guides, templates, and learning materials
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {resources.map((resource) => {
          const ActionIcon = getActionIcon(resource.type, resource.isExternal);

          return (
            <Card
              key={resource.title}
              className="card-hover gap-0 p-6"
            >
              <div className="flex items-start gap-4">
                <div
                  className={`rounded-xl p-2.5 ${getTypeStyles(resource.type)}`}
                >
                  <resource.icon className="size-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="truncate font-semibold">{resource.title}</h3>
                  <p className="mb-4 line-clamp-2 text-sm text-muted-foreground">
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
                      <ActionIcon className="mr-2 size-4" />
                      {resource.type === "template" ? "Download" : "View"}
                      {resource.isExternal && " (external)"}
                    </Link>
                  </Button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Bookmarks Section */}
      <div className="pt-6">
        <div className="mb-5 flex items-center gap-2">
          <Bookmark className="size-5 text-primary" />
          <h2 className="font-display text-xl font-semibold">
            Saved resources
          </h2>
        </div>
        <Card className="items-center gap-0 border-dashed p-8 text-center text-muted-foreground">
          <p>You haven&apos;t saved any resources yet</p>
        </Card>
      </div>
    </div>
  );
}
