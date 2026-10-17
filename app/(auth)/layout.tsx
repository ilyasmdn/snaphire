"use client";
import React, { ReactNode, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { CheckCircle2 } from "lucide-react";

const layout = ({ children }: { children: ReactNode }) => {
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");

    if (savedTheme === "dark") {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  }, []);

  const highlights = [
    "Realistic AI voice interviews",
    "Instant, detailed feedback",
    "Performance tracking over time",
  ];

  return (
    <div className="grid min-h-screen bg-background lg:grid-cols-2">
      {/* Brand panel */}
      <div className="relative hidden overflow-hidden border-r border-border/60 bg-card/40 lg:flex lg:flex-col lg:justify-between lg:p-12">
        <div
          className="pointer-events-none absolute inset-0 bg-grid opacity-30"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -left-24 top-1/3 size-[420px] rounded-full bg-primary/20 blur-[120px]"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -right-16 bottom-0 size-[320px] rounded-full bg-accent/20 blur-[120px]"
          aria-hidden
        />

        <Link href="/" className="relative flex items-center gap-2.5">
          <span className="flex size-9 items-center justify-center overflow-hidden rounded-xl ring-1 ring-border">
            <Image
              src="/snaphire.png"
              alt="SnapHire Logo"
              width={36}
              height={36}
              className="size-9 object-cover"
            />
          </span>
          <span className="font-display text-lg font-bold tracking-tight">
            SnapHire
          </span>
        </Link>

        <div className="relative max-w-md space-y-6">
          <h2 className="font-display text-3xl font-bold leading-tight tracking-tight">
            Practice like it&apos;s the real thing.{" "}
            <span className="text-gradient">Walk in ready.</span>
          </h2>
          <p className="text-muted-foreground">
            Join thousands of candidates using AI-powered mock interviews to
            land offers with confidence.
          </p>
          <ul className="space-y-3">
            {highlights.map((item) => (
              <li
                key={item}
                className="flex items-center gap-2.5 text-sm text-muted-foreground"
              >
                <CheckCircle2 className="size-[18px] shrink-0 text-primary" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <p className="relative text-sm text-muted-foreground">
          © {new Date().getFullYear()} SnapHire. All rights reserved.
        </p>
      </div>

      {/* Form panel */}
      <div className="aurora relative flex flex-col items-center justify-center px-4 py-10 sm:px-8">
        <Link
          href="/"
          className="mb-6 flex items-center gap-2.5 lg:hidden"
        >
          <span className="flex size-9 items-center justify-center overflow-hidden rounded-xl ring-1 ring-border">
            <Image
              src="/snaphire.png"
              alt="SnapHire Logo"
              width={36}
              height={36}
              className="size-9 object-cover"
            />
          </span>
          <span className="font-display text-lg font-bold tracking-tight">
            SnapHire
          </span>
        </Link>

        <div className="relative w-full max-w-md">{children}</div>
      </div>
    </div>
  );
};

export default layout;
