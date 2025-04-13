"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check, HelpCircle, CreditCard, Wallet } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const subscriptionTiers = [
  {
    name: "Basic",
    price: "15",
    description: "Perfect for occasional interview practice",
    features: [
      "10 AI-powered mock interviews per month",
      "Basic performance analytics",
      "Interview question bank access",
      "Email support",
    ],
    cta: "Start Free Trial",
    href: "/sign-up?plan=basic",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "29",
    description: "Ideal for job seekers in active interview preparation",
    features: [
      "Unlimited AI-powered mock interviews",
      "Advanced performance analytics",
      "Custom interview scenarios",
      "Interview recording & playback",
      "Personalized feedback reports",
      "Priority email support",
    ],
    cta: "Start Free Trial",
    href: "/sign-up?plan=pro",
    highlighted: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    description: "For organizations training multiple candidates",
    features: [
      "Everything in Pro",
      "Custom interview templates",
      "Team management dashboard",
      "Bulk user management",
      "API access",
      "Dedicated success manager",
      "24/7 phone & email support",
    ],
    cta: "Contact Sales",
    href: "/contact",
    highlighted: false,
  },
];

const payPerInterviewTiers = [
  {
    name: "Single Interview",
    price: "9",
    description: "Try a full mock interview experience",
    features: [
      "One complete AI-powered interview",
      "Performance report",
      "Interview recording",
      "Valid for 30 days",
    ],
    cta: "Purchase Now",
    href: "/sign-up?plan=single",
    highlighted: false,
  },
  {
    name: "Interview Pack",
    price: "39",
    description: "Best value for focused preparation",
    features: [
      "5 AI-powered interviews",
      "Performance analytics",
      "Interview recordings",
      "Basic question bank access",
      "Valid for 90 days",
    ],
    cta: "Get Started",
    href: "/sign-up?plan=pack",
    highlighted: true,
  },
];

export default function PricingPage() {
  const [showSubscription, setShowSubscription] = useState(true);

  return (
    <div className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight mb-4">
          Choose your perfect plan
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Flexible pricing options to match your interview preparation needs
        </p>
      </div>

      {/* Pricing Toggle */}
      <div className="flex justify-center mb-12">
        <div className="inline-flex rounded-lg border p-1 bg-muted/50">
          <Button
            variant={showSubscription ? "default" : "ghost"}
            size="sm"
            onClick={() => setShowSubscription(true)}
            className="flex items-center gap-2"
          >
            <CreditCard className="h-4 w-4" />
            Subscription
          </Button>
          <Button
            variant={!showSubscription ? "default" : "ghost"}
            size="sm"
            onClick={() => setShowSubscription(false)}
            className="flex items-center gap-2"
          >
            <Wallet className="h-4 w-4" />
            Pay Per Interview
          </Button>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {(showSubscription ? subscriptionTiers : payPerInterviewTiers).map(
          (tier) => (
            <Card
              key={tier.name}
              className={`relative flex flex-col p-8 ${
                tier.highlighted
                  ? "border-primary shadow-lg scale-105"
                  : "border-border"
              }`}
            >
              {tier.highlighted && (
                <div className="absolute -top-5 left-0 right-0 mx-auto w-32 rounded-full bg-primary px-3 py-1 text-sm text-primary-foreground text-center">
                  Most Popular
                </div>
              )}

              <div className="mb-5">
                <h3 className="text-2xl font-bold">{tier.name}</h3>
                <div className="mt-4 flex items-baseline text-5xl font-bold">
                  ${tier.price}
                  {tier.price !== "Custom" && (
                    <span className="text-xl font-semibold text-muted-foreground">
                      {showSubscription ? "/mo" : ""}
                    </span>
                  )}
                </div>
                <p className="mt-4 text-sm text-muted-foreground">
                  {tier.description}
                </p>
              </div>

              <ul className="mb-8 space-y-4 flex-1">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-start">
                    <Check className="h-5 w-5 text-primary shrink-0 mr-2" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                asChild
                className="w-full"
                variant={tier.highlighted ? "default" : "outline"}
              >
                <Link href={tier.href}>{tier.cta}</Link>
              </Button>
            </Card>
          )
        )}
      </div>

      {/* FAQ Section */}
      <div className="mt-20 max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">
          Frequently Asked Questions
        </h2>
        <div className="grid gap-8">
          <div className="space-y-4">
            <div className="flex gap-2">
              <HelpCircle className="h-6 w-6 text-primary shrink-0" />
              <div>
                <h3 className="font-semibold mb-2">
                  What's the difference between subscription and
                  pay-per-interview?
                </h3>
                <p className="text-muted-foreground">
                  Subscriptions offer unlimited access to features for a monthly
                  fee, while pay-per-interview lets you purchase interviews as
                  needed without a recurring commitment.
                </p>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex gap-2">
              <HelpCircle className="h-6 w-6 text-primary shrink-0" />
              <div>
                <h3 className="font-semibold mb-2">
                  How long are my purchased interviews valid?
                </h3>
                <p className="text-muted-foreground">
                  Single interviews are valid for 30 days, while interview packs
                  are valid for 90 days from the date of purchase.
                </p>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex gap-2">
              <HelpCircle className="h-6 w-6 text-primary shrink-0" />
              <div>
                <h3 className="font-semibold mb-2">
                  Can I switch between plans?
                </h3>
                <p className="text-muted-foreground">
                  Yes, you can switch between subscription plans or purchase
                  individual interviews at any time. Subscription changes will
                  be reflected in your next billing cycle.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Final CTA */}
      <div className="mt-20 text-center">
        <h2 className="text-2xl font-bold mb-4">Need a custom solution?</h2>
        <p className="text-muted-foreground mb-8">
          Contact our team to discuss custom plans or bulk interview packages
          for your organization.
        </p>
        <Button asChild variant="outline" size="lg">
          <Link href="/contact">Contact Sales</Link>
        </Button>
      </div>
    </div>
  );
}
