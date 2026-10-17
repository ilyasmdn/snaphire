"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Send, Loader2, CheckCircle } from "lucide-react";
import emailjs from "@emailjs/browser";

// Initialize EmailJS with your credentials
const EMAILJS_PUBLIC_KEY = "0Qtfvk6wil6OKIdLR";
const EMAILJS_SERVICE_ID = "service_g98p6ps";
const EMAILJS_TEMPLATE_ID = "template_e3gtn4d";

export default function ContactPage() {
  // Initialize EmailJS when component mounts
  useEffect(() => {
    emailjs.init(EMAILJS_PUBLIC_KEY);
  }, []);

  const form = useRef<HTMLFormElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");

    if (!form.current) return;

    const formData = new FormData(form.current);
    const formValues = {
      from_name: formData.get("user_name") as string,
      to_name: "SnapStudio",
      from_email: formData.get("user_email") as string,
      to_email: "snapstudio2025@gmail.com",
      message: formData.get("message") as string,
      subject: formData.get("subject") as string,
    };

    try {
      // Use EmailJS to send the form data
      const result = await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        formValues,
        EMAILJS_PUBLIC_KEY
      );

      if (result.status !== 200) {
        throw new Error("Failed to send message");
      }

      // Reset the form
      if (form.current) {
        form.current.reset();
      }

      // Show success message
      setIsSubmitted(true);

      // Hide success message after 5 seconds
      setTimeout(() => {
        setIsSubmitted(false);
      }, 5000);
    } catch (error) {
      console.error("Error sending message:", error);
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again later."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
      <div className="aurora relative mx-auto mb-14 max-w-2xl text-center">
        <h1 className="font-display text-4xl font-extrabold tracking-tight sm:text-5xl">
          Get in touch
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Have questions or need help? Contact our support team and we&apos;ll
          get back to you as soon as possible.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-3 lg:gap-12">
        {/* Contact Information */}
        <div className="space-y-6 md:col-span-1">
          <div className="rounded-2xl border border-border/70 bg-card p-6">
            <h2 className="font-display text-lg font-semibold">
              Contact information
            </h2>

            <div className="mt-5 space-y-6">
              <div className="flex items-start gap-4">
                <div className="rounded-xl bg-primary/10 p-2.5">
                  <Mail className="size-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">Email</h3>
                  <p className="text-sm text-muted-foreground">
                    snapstudio2025@gmail.com
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground/80">
                    For general inquiries and support
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border/70 bg-gradient-to-br from-primary/10 via-card to-accent/10 p-6">
            <h2 className="font-display text-lg font-semibold">
              Business hours
            </h2>
            <div className="mt-4 space-y-2.5 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Monday - Friday</span>
                <span className="font-medium">9:00 AM - 5:00 PM EST</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">
                  Saturday - Sunday
                </span>
                <span className="font-medium">Closed</span>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="md:col-span-2">
          <div className="rounded-2xl border border-border/70 bg-card p-6 shadow-sm md:p-8">
            <h2 className="font-display text-lg font-semibold">
              Send us a message
            </h2>

            {isSubmitted ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="mb-5 rounded-2xl bg-green-500/10 p-3.5">
                  <CheckCircle className="size-8 text-green-500" />
                </div>
                <h3 className="font-display text-xl font-semibold">
                  Message sent!
                </h3>
                <p className="mt-2 max-w-md text-muted-foreground">
                  Thank you for reaching out. We&apos;ve received your message
                  and will get back to you as soon as possible. A confirmation
                  email has been sent to your inbox.
                </p>
              </div>
            ) : (
              <form
                ref={form}
                onSubmit={handleSubmit}
                className="mt-6 space-y-5"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="user_name" className="text-sm font-medium">
                      Your Name
                    </label>
                    <Input
                      id="user_name"
                      name="user_name"
                      placeholder="John Doe"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="user_email" className="text-sm font-medium">
                      Email Address
                    </label>
                    <Input
                      id="user_email"
                      name="user_email"
                      type="email"
                      placeholder="john@example.com"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="subject" className="text-sm font-medium">
                    Subject
                  </label>
                  <Input
                    id="subject"
                    name="subject"
                    placeholder="How can we help you?"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="message" className="text-sm font-medium">
                    Message
                  </label>
                  <Textarea
                    id="message"
                    name="message"
                    placeholder="Please provide as much detail as possible..."
                    rows={6}
                    required
                  />
                </div>

                {errorMessage && (
                  <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
                    {errorMessage}
                  </div>
                )}

                <Button
                  type="submit"
                  size="lg"
                  className="w-full md:w-auto"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 size-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      Send message <Send className="ml-2 size-4" />
                    </>
                  )}
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="mt-20">
        <div className="mb-10 text-center">
          <h2 className="font-display text-3xl font-bold tracking-tight">
            Frequently asked questions
          </h2>
          <p className="mt-3 text-muted-foreground">
            Find quick answers to common questions
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          {[
            {
              q: "How do I cancel my subscription?",
              a: "You can cancel your subscription at any time from your account settings. Navigate to Settings → Billing and click on \"Cancel Subscription\".",
            },
            {
              q: "What payment methods do you accept?",
              a: "We accept all major credit cards including Visa, Mastercard, and American Express. We also support PayPal for payments.",
            },
            {
              q: "Can I get a refund?",
              a: "We offer a 7-day money-back guarantee for all subscription plans. Contact our support team to process your refund if you're not satisfied.",
            },
            {
              q: "Do you offer discounts for teams?",
              a: "Yes! We offer special pricing for teams of 5 or more. Contact our sales team at snapstudio2025@gmail.com for more information.",
            },
          ].map((faq) => (
            <div
              key={faq.q}
              className="card-hover rounded-2xl border border-border/70 bg-card p-6"
            >
              <h3 className="font-display font-semibold">{faq.q}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
