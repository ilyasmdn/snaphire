"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "@/firebase/client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Mail } from "lucide-react";

const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

type ForgotPasswordSchema = z.infer<typeof forgotPasswordSchema>;

const ForgotPasswordForm = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<ForgotPasswordSchema>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (values: ForgotPasswordSchema) => {
    setIsLoading(true);
    try {
      const actionCodeSettings = {
        url: `${window.location.origin}/reset-password`, // Your custom page
        handleCodeInApp: true,
      };
      
      await sendPasswordResetEmail(auth, values.email, actionCodeSettings);      
      toast.success("Password reset email sent. Check your inbox.");
      router.push("/sign-in");
    } catch (error: any) {
      console.error("Reset password error:", error);
      if (error.code === "auth/user-not-found") {
        toast.error("No account found with this email.");
      } else {
        toast.error("Failed to send reset email. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full animate-in fade-in-0 slide-in-from-bottom-4 duration-700">
      <div className="space-y-8 rounded-2xl border border-border/70 bg-card p-8 shadow-xl shadow-black/[0.04] dark:shadow-black/30">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="font-display text-2xl font-bold tracking-tight">
            Forgot password?
          </h1>
          <p className="text-sm text-muted-foreground">
            Enter your email and we&apos;ll send you reset instructions
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="you@example.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              size="lg"
              className="w-full font-medium"
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="mr-2 size-4 animate-spin" />
              ) : (
                <>
                  Send Reset Email
                  <Mail className="ml-2 size-4" />
                </>
              )}
            </Button>
          </form>
        </Form>

        <div className="text-center text-sm">
          Remembered your password?{" "}
          <a
            href="/sign-in"
            className="text-primary hover:underline underline-offset-4 font-medium transition-colors"
          >
            Sign in
          </a>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordForm;
