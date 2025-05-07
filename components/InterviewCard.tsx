import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

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
  const displayDate = new Date(data.createdAt).toLocaleDateString();

  // Create a title from role and level
  const title = `${data.role} ${data.level ? `(${data.level})` : ""} Interview`;

  return (
    <Card className="p-4 hover:border-primary transition-colors">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h3 className="font-medium">{title}</h3>
          </div>
          <p className="text-sm text-muted-foreground">
            {displayDate} • {data.type} • {data.questions.length} questions
          </p>
        </div>
        <Button variant="ghost" size="sm" asChild>
          <Link href={`/interviews/${data.id}`}>Take The Interview</Link>
        </Button>
      </div>
    </Card>
  );
}
