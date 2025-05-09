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
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="space-y-2">
          <h1 className="text-6xl font-bold text-primary">404</h1>
          <h2 className="text-2xl font-semibold text-text">Page Not Found</h2>
          <p className="text-text/50">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>

        <div className="bg-secondary/5 p-6 rounded-lg">
          <p className="text-text/70 mb-4">
            Ready to get back on track with your interview preparation?
          </p>
          <div className="flex flex-col gap-3">
            <Button asChild size="lg" className="font-semibold">
              <Link href="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Return to Home
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/dashboard">Go to Dashboard</Link>
            </Button>
          </div>
        </div>

        <div className="pt-6">
          <p className="text-sm text-text/50">
            Need help?{" "}
            <Link href="/resources" className="text-primary hover:underline">
              Visit our resources
            </Link>{" "}
            or{" "}
            <Link href="/settings" className="text-primary hover:underline">
              contact support
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
