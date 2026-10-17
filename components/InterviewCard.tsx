import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowUpRight, CalendarDays, Layers } from "lucide-react";

// Updated to exactly match the specified data structure
interface InterviewData {
  id: string;
  role: string;
  type: string;
  level: string;
  questions: string[];
  finalized: boolean;
  userId: string;
  createdAt: string;
}

interface InterviewCardProps {
  variant?: "personal";
  data: InterviewData;
}

export function InterviewCard({
  variant = "personal",
  data,
}: InterviewCardProps) {
  // Format the date for display
  const displayDate = new Date(data.createdAt).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  // Create a title from role and level
  const title = `${data.role} ${data.level ? `(${data.level})` : ""} Interview`;

  return (
    <Card className="card-hover group flex-row items-center gap-4 border-border/70 p-4">
      <span className="hidden size-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary/15 to-accent/15 font-display text-sm font-bold text-primary sm:flex">
        {data.role?.slice(0, 1).toUpperCase() || "S"}
      </span>

      <div className="min-w-0 flex-1 space-y-1.5">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="truncate font-medium">{title}</h3>
          {data.finalized && (
            <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[0.7rem] font-medium text-emerald-600 dark:text-emerald-400">
              Completed
            </span>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <CalendarDays className="size-3.5" />
            {displayDate}
          </span>
          <span className="inline-flex items-center gap-1.5 capitalize">
            <Layers className="size-3.5" />
            {data.type}
          </span>
          <span>{data.questions.length} questions</span>
        </div>
      </div>

      <Button variant="ghost" size="sm" asChild className="shrink-0">
        <Link href={`/interviews/${data.id}`} className="gap-1.5">
          <span className="hidden sm:inline">Take interview</span>
          <span className="sm:hidden">Start</span>
          <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </Link>
      </Button>
    </Card>
  );
}
