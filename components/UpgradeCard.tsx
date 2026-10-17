import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Lock, Sparkles } from "lucide-react";

interface UpgradeCardProps {
  title: string;
  description: string;
  primaryHref?: string;
  primaryLabel?: string;
  secondaryHref?: string;
  secondaryLabel?: string;
}

/**
 * Consistent upgrade / access-required notice used by gated pages.
 */
export function UpgradeCard({
  title,
  description,
  primaryHref = "/pricing",
  primaryLabel = "Upgrade to Pro",
  secondaryHref,
  secondaryLabel,
}: UpgradeCardProps) {
  return (
    <Card className="aurora mx-auto max-w-2xl items-center gap-0 overflow-hidden border-border/70 px-8 py-12 text-center">
      <span className="flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 text-primary ring-1 ring-primary/15">
        <Lock className="size-6" />
      </span>

      <h2 className="mt-6 font-display text-2xl font-bold tracking-tight">
        {title}
      </h2>

      <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
        {description}
      </p>

      <div className="mt-7 flex flex-col gap-3 sm:flex-row">
        <Button asChild>
          <Link href={primaryHref}>
            <Sparkles className="size-4" />
            {primaryLabel}
          </Link>
        </Button>
        {secondaryHref && secondaryLabel && (
          <Button variant="outline" asChild>
            <Link href={secondaryHref}>{secondaryLabel}</Link>
          </Button>
        )}
      </div>
    </Card>
  );
}
