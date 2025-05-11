import { Metadata } from "next";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle,
  Star,
  Users,
  Brain,
  BarChart,
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
    "AI-Powered Interview Practice",
    "Personalized Feedback",
    "Industry-Specific Questions",
    "Real-time Performance Analytics",
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Software Engineer at Google",
      content:
        "SnapHire helped me prepare for my tech interviews effectively. The AI feedback was incredibly valuable.",
      avatar: "SJ",
    },
    {
      name: "Michael Chen",
      role: "Product Manager at Microsoft",
      content:
        "The industry-specific questions really helped me understand what to expect. I landed my dream job!",
      avatar: "MC",
    },
    {
      name: "Emma Davis",
      role: "Data Scientist at Amazon",
      content:
        "The real-time analytics helped me track my progress and identify areas for improvement.",
      avatar: "ED",
    },
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
      icon: BarChart,
      title: "Progress Tracking",
      description:
        "Monitor your improvement over time with detailed analytics and performance metrics.",
    },
  ];

  return (
    <div className="flex flex-col items-center min-h-screen">
      <div className="w-full max-w-7xl px-4 md:px-12 py-6">
        {/* Hero Section */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-10 py-6">
          {/* Left Column - Text Content */}
          <div className="flex-1 space-y-6">
            <h1 className="text-3xl lg:text-4xl font-bold text-text">
              Master Your Interviews with{" "}
              <span className="text-primary">AI-Powered</span> Practice
            </h1>
            <p className="text-text/50 text-lg max-w-xl">
              Prepare for your dream job with our advanced interview simulation
              platform. Get real-time feedback and improve your interview skills
              with SnapHire.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button asChild size="lg" className="font-semibold">
                <Link href="/sign-in">
                  Get Started Free <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/pricing">View Pricing</Link>
              </Button>
            </div>
            <div className="pt-8">
              <div className="grid sm:grid-cols-2 gap-4">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-primary" />
                    <span className="text-text/50">{feature}</span>
                  </div>
                ))}
              </div>
              <ProductHunt />
            </div>
          </div>

          {/* Right Column - Image/Visual */}
          <div className="flex-1 w-full max-w-xl">
            <div className="relative bg-gradient-to-b from-primary/10 to-transparent p-8 rounded-xl">
              <img
                src="/snaphire.png"
                alt="SnapHire AI-Powered Interview Practice Platform"
                width={500}
                height={500}
                className="w-full h-auto rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Features Section */}
      <section className="w-full bg-secondary/10 py-20">
        <div className="max-w-7xl mx-auto px-4 md:px-12">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why Choose SnapHire?</h2>
            <p className="text-text/50 max-w-2xl mx-auto">
              Our platform combines cutting-edge AI technology with proven
              interview techniques to help you succeed.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 mt-12">
            {detailedFeatures.map((feature, index) => (
              <div
                key={index}
                className="bg-background p-6 rounded-lg shadow-sm"
              >
                <feature.icon className="h-10 w-10 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-text/50">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="w-full py-20">
        <div className="max-w-7xl mx-auto px-4 md:px-12">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">What Our Users Say</h2>
            <p className="text-text/50 max-w-2xl mx-auto">
              Join thousands of successful professionals who transformed their
              interview performance with SnapHire.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-secondary/5 p-6 rounded-lg">
                <div className="flex items-center gap-4 mb-4">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <h4 className="font-semibold">{testimonial.name}</h4>
                    <p className="text-sm text-text/50">{testimonial.role}</p>
                  </div>
                </div>
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-4 w-4 text-yellow-400 fill-yellow-400"
                    />
                  ))}
                </div>
                <p className="text-text/70">{testimonial.content}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="w-full bg-primary/5 py-20">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Transform Your Interview Skills?
          </h2>
          <p className="text-text/50 mb-8 max-w-2xl mx-auto">
            Join SnapHire today and take the first step towards landing your
            dream job with confidence.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button asChild size="lg" className="font-semibold">
              <Link href="/sign-up">
                Start Free Trial <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/pricing">View Plans</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
