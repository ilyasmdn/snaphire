import { Metadata } from "next";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Users,
  Brain,
  BarChart3,
  Code2,
  Palette,
  Briefcase,
  Mic,
  Sparkles,
  LineChart,
} from "lucide-react";
import ProductHunt from "@/components/ProductHunt";

export const metadata: Metadata = {
  title: "SnapHire - AI-Powered Interview Practice Platform",
  description:
    "Prepare for your next job interview with SnapHire's AI-powered mock interviews. Get real-time feedback, expert insights, and improve your chances of landing your dream job.",
  keywords: [
    "interview preparation",
    "mock interviews",
    "AI interview practice",
    "interview feedback",
    "job interview preparation",
    "technical interview practice",
    "behavioral interview questions",
  ],
  alternates: {
    canonical: "https://snaphire.pro",
  },
  openGraph: {
    title: "SnapHire - Practice Interviews with AI and Get Expert Feedback",
    description:
      "Prepare for your job interviews with our AI-powered platform. Get personalized feedback and ace your next interview with confidence.",
    url: "https://snaphire.pro",
    type: "website",
  },
};

export default function LandingPage() {
  const features = [
    "AI-powered interview practice",
    "Personalized feedback",
    "Industry-specific questions",
    "Real-time performance analytics",
  ];

  const detailedFeatures = [
    {
      icon: Brain,
      title: "AI-Powered Practice",
      description:
        "Get realistic interview practice with our advanced AI that adapts to your responses and skill level.",
    },
    {
      icon: Users,
      title: "Expert Guidance",
      description:
        "Receive detailed feedback and suggestions based on industry standards and best practices.",
    },
    {
      icon: BarChart3,
      title: "Progress Tracking",
      description:
        "Monitor your improvement over time with detailed analytics and performance metrics.",
    },
  ];

  const steps = [
    {
      icon: Mic,
      title: "Have a real conversation",
      description:
        "Talk out loud with your AI interviewer, just like the real thing.",
    },
    {
      icon: Sparkles,
      title: "Get instant AI feedback",
      description:
        "Scores and written feedback on every answer within seconds.",
    },
    {
      icon: LineChart,
      title: "Track and improve",
      description:
        "See your growth over time and focus on what matters most.",
    },
  ];

  const useCases = [
    {
      icon: Code2,
      title: "Junior Developer?",
      description:
        "Master technical interviews with code challenges, system design basics, and foundational algorithm questions tailored to entry-level positions.",
      points: [
        "Data structure fundamentals",
        "Framework-specific questions",
        "Code walkthrough practice",
      ],
    },
    {
      icon: Palette,
      title: "Senior Designer?",
      description:
        "Polish your portfolio presentation skills, practice articulating design decisions, and prepare for stakeholder collaboration scenarios.",
      points: [
        "Design critique simulations",
        "Leadership scenario questions",
        "Portfolio presentation feedback",
      ],
    },
    {
      icon: Briefcase,
      title: "Product Manager?",
      description:
        "Tackle real-world product scenarios, practice prioritization exercises, and sharpen your strategic thinking with industry-specific challenges.",
      points: [
        "Metric analysis questions",
        "Stakeholder management scenarios",
        "Product strategy challenges",
      ],
    },
  ];

  const stats = [
    { value: "3 days", label: "Free trial, no card required" },
    { value: "5 min", label: "To your first feedback report" },
    { value: "24/7", label: "Practice whenever inspiration hits" },
    { value: "100+", label: "Roles and interview types" },
  ];

  return (
    <div className="flex min-h-screen flex-col">
      {/* Hero */}
      <section className="aurora relative w-full overflow-hidden">
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-[520px] bg-grid opacity-[0.35]"
          aria-hidden
        />
        <div className="section relative grid items-center gap-14 py-16 lg:grid-cols-2 lg:py-24">
          <div className="space-y-7">
            <div className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-card/70 px-3.5 py-1.5 text-xs font-medium text-muted-foreground shadow-sm backdrop-blur">
              <span className="flex size-1.5 rounded-full bg-emerald-500" />
              AI mock interviews, feedback in seconds
            </div>

            <h1 className="font-display text-4xl font-extrabold leading-[1.08] tracking-tight sm:text-5xl lg:text-[3.4rem]">
              Land your dream job with{" "}
              <span className="text-gradient">AI-powered</span> interview
              practice
            </h1>

            <p className="max-w-xl text-lg leading-relaxed text-muted-foreground">
              Practice realistic mock interviews with an AI interviewer, get
              instant, personalized feedback, and walk into your next interview
              knowing you are ready.
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <Button asChild size="lg" className="group">
                <Link href="/sign-in">
                  Start practicing free
                  <ArrowRight className="ml-1.5 size-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/pricing">View pricing</Link>
              </Button>
            </div>

            <p className="text-sm text-muted-foreground">
              Start with a{" "}
              <span className="font-semibold text-primary">
                3-day free trial
              </span>{" "}
              — no credit card required.
            </p>

            <ul className="grid gap-3 pt-2 sm:grid-cols-2">
              {features.map((feature) => (
                <li
                  key={feature}
                  className="flex items-center gap-2.5 text-sm text-muted-foreground"
                >
                  <CheckCircle2 className="size-[18px] shrink-0 text-primary" />
                  {feature}
                </li>
              ))}
            </ul>

            <ProductHunt />
          </div>

          <div className="relative w-full">
            <div
              className="absolute -inset-6 rounded-[2rem] bg-gradient-to-tr from-primary/25 via-accent/15 to-transparent blur-2xl"
              aria-hidden
            />
            <div className="relative overflow-hidden rounded-2xl border border-border/70 bg-card/80 p-2 shadow-2xl shadow-primary/10 backdrop-blur">
              <div className="flex items-center gap-1.5 px-3 py-2">
                <span className="size-2.5 rounded-full bg-red-400/80" />
                <span className="size-2.5 rounded-full bg-amber-400/80" />
                <span className="size-2.5 rounded-full bg-emerald-400/80" />
              </div>
              <img
                src="/snaphire.png"
                alt="SnapHire AI-powered interview practice platform"
                width={500}
                height={500}
                className="h-auto w-full rounded-xl"
              />
            </div>

            <div className="absolute -bottom-5 -left-5 hidden items-center gap-3 rounded-2xl border border-border/70 bg-card/95 px-4 py-3 shadow-xl backdrop-blur sm:flex">
              <span className="flex size-9 items-center justify-center rounded-xl bg-primary/12 text-primary">
                <Sparkles className="size-4" />
              </span>
              <div className="leading-tight">
                <p className="text-sm font-semibold">Feedback in seconds</p>
                <p className="text-xs text-muted-foreground">
                  On every single answer
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats band */}
      <section className="w-full border-y border-border/60 bg-card/40">
        <div className="section grid grid-cols-2 gap-8 py-12 lg:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center lg:text-left">
              <p className="font-display text-3xl font-bold tracking-tight text-gradient">
                {stat.value}
              </p>
              <p className="mt-1.5 text-sm text-muted-foreground">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="section py-20">
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <span className="text-sm font-semibold uppercase tracking-wider text-primary">
            How it works
          </span>
          <h2 className="mt-3 font-display text-3xl font-bold sm:text-4xl">
            From practice to offer in three steps
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            No setup, no scheduling. Just a conversation and honest feedback.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {steps.map((step, index) => (
            <div
              key={step.title}
              className="card-hover relative rounded-2xl border border-border/70 bg-card p-7"
            >
              <span className="absolute right-6 top-6 font-display text-4xl font-bold text-muted/60">
                0{index + 1}
              </span>
              <span className="flex size-11 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 text-primary">
                <step.icon className="size-5" />
              </span>
              <h3 className="mt-5 font-display text-lg font-semibold">
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Use cases */}
      <section className="w-full border-y border-border/60 bg-card/40 py-20">
        <div className="section">
          <div className="mx-auto mb-14 max-w-2xl text-center">
            <span className="text-sm font-semibold uppercase tracking-wider text-primary">
              Built for your role
            </span>
            <h2 className="mt-3 font-display text-3xl font-bold sm:text-4xl">
              Your perfect interview prep path
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              No matter your role or experience level, SnapHire tailors the
              practice experience to your specific needs.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {useCases.map((useCase) => (
              <div
                key={useCase.title}
                className="card-hover flex flex-col rounded-2xl border border-border/70 bg-card p-7"
              >
                <span className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <useCase.icon className="size-5" />
                </span>
                <h3 className="mt-5 font-display text-lg font-semibold">
                  {useCase.title}
                </h3>
                <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">
                  {useCase.description}
                </p>
                <ul className="mt-6 space-y-3 border-t border-border/60 pt-5">
                  {useCase.points.map((point) => (
                    <li
                      key={point}
                      className="flex items-start gap-2.5 text-sm text-muted-foreground"
                    >
                      <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Button asChild size="lg" variant="outline" className="group">
              <Link href="/sign-in" className="flex items-center gap-2">
                Try your role-specific practice
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Detailed features */}
      <section className="section py-20">
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <span className="text-sm font-semibold uppercase tracking-wider text-primary">
            Why SnapHire
          </span>
          <h2 className="mt-3 font-display text-3xl font-bold sm:text-4xl">
            Everything you need to interview well
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Our platform combines cutting-edge AI technology with proven
            interview techniques to help you succeed.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {detailedFeatures.map((feature) => (
            <div
              key={feature.title}
              className="card-hover rounded-2xl border border-border/70 bg-gradient-to-b from-card to-card/60 p-7"
            >
              <span className="flex size-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent text-primary-foreground shadow-lg shadow-primary/25">
                <feature.icon className="size-6" />
              </span>
              <h3 className="mt-6 font-display text-lg font-semibold">
                {feature.title}
              </h3>
              <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="section pb-24 pt-4">
        <div className="aurora relative overflow-hidden rounded-3xl border border-border/70 bg-gradient-to-br from-primary/12 via-card to-accent/12 px-6 py-16 text-center sm:px-16">
          <div
            className="pointer-events-none absolute inset-0 bg-grid opacity-20"
            aria-hidden
          />
          <div className="relative mx-auto max-w-2xl">
            <h2 className="font-display text-3xl font-bold sm:text-4xl">
              Ready to transform your interview skills?
            </h2>
            <p className="mt-5 text-lg text-muted-foreground">
              Join SnapHire today and take the first step towards landing your
              dream job with confidence. Try it free for 3 days.
            </p>
            <div className="mt-9 flex flex-wrap justify-center gap-3">
              <Button asChild size="lg" className="group">
                <Link href="/pricing">
                  Start 3-day free trial
                  <ArrowRight className="ml-1.5 size-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/pricing">View plans</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
