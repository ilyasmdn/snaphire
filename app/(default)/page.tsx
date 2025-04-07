import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-text text-4xl font-bold mb-4">Welcome to SnapHire</h1>
      <p className="text-text/50 text-lg mb-8">An AI-Powered platform for preparing for interviews</p>
      <Button asChild>
      <Link href="/sign-in">
        Get Started
      </Link>
      </Button>
    </div>
  );
}
