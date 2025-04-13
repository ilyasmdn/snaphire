import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface InterviewCardProps {
  variant?: "personal" | "community";
  data: {
    id: string;
    date: string;
    duration: string;
    type: string;
    // Personal interview specific fields
    title?: string;
    score?: number;
    // Community interview specific fields
    role?: string;
    company?: string;
    topics?: string[];
  };
}

export function InterviewCard({
  variant = "personal",
  data,
}: InterviewCardProps) {
  if (variant === "personal") {
    return (
      <Card className="p-4 hover:border-primary transition-colors">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h3 className="font-medium">{data.title}</h3>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-muted-foreground">•</span>
                <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                  {data.score}% Score
                </span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              {data.date} • {data.duration} • {data.type}
            </p>
          </div>
          <Button variant="ghost" size="sm" asChild>
            <Link href={`/interviews/${data.id}`}>Review</Link>
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-4 hover:border-primary transition-colors">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h3 className="font-medium">{data.role}</h3>
            <span className="text-sm text-muted-foreground">
              • {data.company}
            </span>
          </div>
          <p className="text-sm text-muted-foreground">
            {data.date} • {data.duration} • {data.type}
          </p>
          {data.topics && (
            <div className="flex gap-2 mt-2">
              {data.topics.map((topic) => (
                <span
                  key={topic}
                  className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary"
                >
                  {topic}
                </span>
              ))}
            </div>
          )}
        </div>
        <Button variant="ghost" size="sm" asChild>
          <Link href={`/interviews/${data.id}`}>View Details</Link>
        </Button>
      </div>
    </Card>
  );
}
