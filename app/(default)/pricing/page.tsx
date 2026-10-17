"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check, HelpCircle, CreditCard, Wallet, Loader2 } from "lucide-react";
import Link from "next/link";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";

const subscriptionTiers = [
  {
    name: "Starter",
    price: "8",
    description: "For students or job seekers just starting out",
    features: [
      "15 AI-powered mock interviews per month",
      "Basic performance analytics",
      "Standard question bank access",
      "Email support",
    ],
    cta: "Start Free Trial",
    href: "/checkout?plan=starter",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "15",
    description: "For active job seekers needing advanced prep",
    features: [
      "Unlimited AI-powered mock interviews",
      "Advanced performance analytics",
      "Advanced feedback reports",
      "Custom interview scenarios",
      "Access to extra learning resources",
      "Priority email support",
    ],
    cta: "Start Free Trial",
    href: "/checkout?plan=pro",
    highlighted: true,
  },
  {
    name: "Teams",
    price: "Custom",
    description: "For organizations training multiple candidates",
    features: [
      "Everything in Pro",
      "Admin/team dashboard",
      "Bulk user invites",
      "API access",
      "Dedicated success manager",
      "24/7 support",
    ],
    cta: "Contact Sales",
    href: "/contact",
    highlighted: false,
  },
];

const payPerInterviewTiers = [
  {
    name: "One-Time Interview",
    price: "1",
    description: "Perfect for a quick mock interview experience",
    features: [
      "1 full AI-powered interview",
      "Basic performance report",
      "Valid for 30 days",
    ],
    cta: "Purchase Now",
    href: "/checkout?plan=single",
    highlighted: false,
  },
  {
    name: "5-Interview Pack",
    price: "4",
    description: "Best value for focused preparation",
    features: [
      "5 AI-powered interviews",
      "Advanced performance analytics",
      "Advanced feedback reports",
      "Valid for 90 days",
    ],
    cta: "Get Started",
    href: "/checkout?plan=pack",
    highlighted: true,
  },
  {
    name: "Lifetime Access",
    price: "20",
    description: "Unlimited interviews forever with a one-time payment",
    features: [
      "Unlimited AI-powered interviews",
      "Advanced performance analytics",
      "Advanced feedback reports",
      "Never expires",
      "No recurring billing",
    ],
    cta: "Get Lifetime Access",
    href: "/checkout?plan=lifetime",
    highlighted: false,
  },
];

function PricingContent() {
  const searchParams = useSearchParams();
  const [showSubscription, setShowSubscription] = useState(true);

  // Handle tab parameter from URL
  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab === "pay-per-interview") {
      setShowSubscription(false);
    }
  }, [searchParams]);

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
      {/* Header */}
      <div className="aurora relative mx-auto mb-14 max-w-3xl text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-card/70 px-3.5 py-1.5 text-xs font-medium text-muted-foreground shadow-sm backdrop-blur">
          Pricing
        </span>
        <h1 className="mt-5 font-display text-4xl font-extrabold tracking-tight sm:text-5xl">
          Choose your perfect plan
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
          Flexible pricing options to match your interview preparation needs.
          Start free — upgrade only when you&apos;re ready.
        </p>
      </div>

      {/* Pricing Toggle */}
      <div className="mb-14 flex justify-center">
        <div className="inline-flex rounded-full border border-border/70 bg-card/70 p-1 shadow-sm backdrop-blur">
          <Button
            variant={showSubscription ? "default" : "ghost"}
            size="sm"
            onClick={() => setShowSubscription(true)}
            className={`rounded-full ${showSubscription ? "" : "text-muted-foreground"}`}
          >
            <CreditCard className="size-4" />
            Subscription
          </Button>
          <Button
            variant={!showSubscription ? "default" : "ghost"}
            size="sm"
            onClick={() => setShowSubscription(false)}
            className={`rounded-full ${!showSubscription ? "" : "text-muted-foreground"}`}
          >
            <Wallet className="size-4" />
            Pay per interview
          </Button>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="mx-auto grid max-w-7xl items-stretch gap-6 md:grid-cols-3">
        {(showSubscription ? subscriptionTiers : payPerInterviewTiers).map(
          (tier) => (
            <Card
              key={tier.name}
              className={`relative flex flex-col gap-0 p-8 ${
                tier.highlighted
                  ? "border-primary/40 shadow-xl shadow-primary/10 md:-translate-y-2"
                  : "border-border/70"
              }`}
            >
              {tier.highlighted && (
                <>
                  <div
                    className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-b from-primary/10 to-transparent"
                    aria-hidden
                  />
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-primary to-accent px-3.5 py-1 text-xs font-semibold text-primary-foreground shadow-lg shadow-primary/25">
                    Most popular
                  </div>
                </>
              )}

              <div className="relative mb-6">
                <h3 className="font-display text-xl font-bold tracking-tight">
                  {tier.name}
                </h3>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="font-display text-5xl font-extrabold tracking-tight">
                    {tier.price === "Custom" ? "" : "$"}
                    {tier.price}
                  </span>
                  {tier.price !== "Custom" && (
                    <span className="text-lg font-medium text-muted-foreground">
                      {showSubscription ? "/mo" : ""}
                    </span>
                  )}
                </div>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {tier.description}
                </p>
              </div>

              <ul className="relative mb-8 flex-1 space-y-3.5 border-t border-border/60 pt-6">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2.5">
                    <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                asChild
                size="lg"
                className="relative w-full"
                variant={tier.highlighted ? "default" : "outline"}
              >
                <Link href={tier.href}>{tier.cta}</Link>
              </Button>
            </Card>
          )
        )}
      </div>

      {/* FAQ Section */}
      <div className="mx-auto mt-24 max-w-3xl">
        <div className="mb-10 text-center">
          <h2 className="font-display text-3xl font-bold tracking-tight">
            Frequently asked questions
          </h2>
          <p className="mt-3 text-muted-foreground">
            Everything you need to know before getting started.
          </p>
        </div>
        <div className="space-y-4">
          {[
            {
              question:
                "What's the difference between subscription and pay-per-interview?",
              answer:
                "Subscriptions offer unlimited access to features for a monthly fee, while pay-per-interview lets you purchase interviews as needed without a recurring commitment.",
            },
            {
              question: "How long are my purchased interviews valid?",
              answer:
                "Single interviews are valid for 30 days, while interview packs are valid for 90 days from the date of purchase.",
            },
            {
              question: "Can I switch between plans?",
              answer:
                "Yes, you can switch between subscription plans or purchase individual interviews at any time. Subscription changes will be reflected in your next billing cycle.",
            },
          ].map((faq) => (
            <Card key={faq.question} className="gap-0 border-border/70 p-6">
              <div className="flex gap-3.5">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <HelpCircle className="size-4" />
                </span>
                <div>
                  <h3 className="font-display font-semibold">{faq.question}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {faq.answer}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Final CTA */}
      <div className="aurora relative mt-20 overflow-hidden rounded-3xl border border-border/70 bg-gradient-to-br from-primary/12 via-card to-accent/12 px-6 py-14 text-center">
        <h2 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">
          Need a custom solution?
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
          Contact our team to discuss custom plans or bulk interview packages
          for your organization.
        </p>
        <Button asChild variant="outline" size="lg" className="mt-8">
          <Link href="/contact">Contact sales</Link>
        </Button>
      </div>
    </div>
  );
}

export default function PricingPage() {
  return (
    <Suspense
      fallback={
        <div className="container mx-auto px-4 py-16 sm:px-6 lg:px-8 flex justify-center">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      }
    >
      <PricingContent />
    </Suspense>
  );
}
