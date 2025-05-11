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
    <div className="max-w-7xl mx-auto px-4 md:px-12 py-12 md:py-16">
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold">Get in Touch</h1>
        <p className="text-text/50 mt-2 max-w-xl mx-auto">
          Have questions or need help? Contact our support team and we'll get
          back to you as soon as possible.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
        {/* Contact Information */}
        <div className="md:col-span-1 space-y-8">
          <div className="bg-secondary/10 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Contact Information</h2>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="p-2 rounded-full bg-primary/10">
                  <Mail className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">Email</h3>
                  <p className="text-text/70">snapstudio2025@gmail.com</p>
                  <p className="text-sm text-text/50 mt-1">
                    For general inquiries and support
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-primary/5 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-3">Business Hours</h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-text/70">Monday - Friday</span>
                <span className="font-medium">9:00 AM - 5:00 PM EST</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text/70">Saturday - Sunday</span>
                <span className="font-medium">Closed</span>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="md:col-span-2">
          <div className="bg-background border rounded-lg p-6 md:p-8 shadow-sm">
            <h2 className="text-xl font-semibold mb-6">Send Us a Message</h2>

            {isSubmitted ? (
              <div className="flex flex-col items-center justify-center text-center py-8">
                <div className="p-3 rounded-full bg-green-50 mb-4">
                  <CheckCircle className="h-8 w-8 text-green-500" />
                </div>
                <h3 className="text-xl font-semibold">Message Sent!</h3>
                <p className="text-text/70 mt-2 max-w-md">
                  Thank you for reaching out. We've received your message and
                  will get back to you as soon as possible. A confirmation email
                  has been sent to your inbox.
                </p>
              </div>
            ) : (
              <form ref={form} onSubmit={handleSubmit} className="space-y-6">
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
                  <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-md">
                    {errorMessage}
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full md:w-auto"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      Send Message <Send className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="mt-16 lg:mt-24">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold">Frequently Asked Questions</h2>
          <p className="text-text/50 mt-2">
            Find quick answers to common questions
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-background p-6 rounded-lg border">
            <h3 className="font-semibold mb-2">
              How do I cancel my subscription?
            </h3>
            <p className="text-text/70">
              You can cancel your subscription at any time from your account
              settings. Navigate to Settings → Billing and click on "Cancel
              Subscription".
            </p>
          </div>

          <div className="bg-background p-6 rounded-lg border">
            <h3 className="font-semibold mb-2">
              What payment methods do you accept?
            </h3>
            <p className="text-text/70">
              We accept all major credit cards including Visa, Mastercard, and
              American Express. We also support PayPal for payments.
            </p>
          </div>

          <div className="bg-background p-6 rounded-lg border">
            <h3 className="font-semibold mb-2">Can I get a refund?</h3>
            <p className="text-text/70">
              We offer a 7-day money-back guarantee for all subscription plans.
              Contact our support team to process your refund if you're not
              satisfied.
            </p>
          </div>

          <div className="bg-background p-6 rounded-lg border">
            <h3 className="font-semibold mb-2">
              Do you offer discounts for teams?
            </h3>
            <p className="text-text/70">
              Yes! We offer special pricing for teams of 5 or more. Contact our
              sales team at snapstudio2025@gmail.com for more information.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
