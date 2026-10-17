"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useEffect } from "react";

export default function NotFound() {
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");

    if (savedTheme === "dark") {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  }, []);

  return (
    <div className="aurora relative flex min-h-screen items-center justify-center bg-background p-4">
      <div className="relative w-full max-w-md space-y-8 text-center">
        <div className="space-y-3">
          <p className="font-display text-7xl font-extrabold tracking-tight text-gradient">
            404
          </p>
          <h1 className="font-display text-2xl font-semibold tracking-tight">
            Page not found
          </h1>
          <p className="text-muted-foreground">
            The page you&apos;re looking for doesn&apos;t exist or has been
            moved.
          </p>
        </div>

        <div className="rounded-2xl border border-border/70 bg-card/60 p-6">
          <p className="mb-5 text-sm text-muted-foreground">
            Ready to get back on track with your interview preparation?
          </p>
          <div className="flex flex-col gap-3">
            <Button asChild size="lg">
              <Link href="/">
                <ArrowLeft className="mr-2 size-4" />
                Return home
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/dashboard">Go to dashboard</Link>
            </Button>
          </div>
        </div>

        <p className="text-sm text-muted-foreground">
          Need help?{" "}
          <Link href="/resources" className="text-primary hover:underline">
            Visit our resources
          </Link>{" "}
          or{" "}
          <Link href="/contact" className="text-primary hover:underline">
            contact support
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
