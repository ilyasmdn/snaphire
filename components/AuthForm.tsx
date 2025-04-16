"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useState } from "react";
import { ArrowRight, Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { auth } from "@/firebase/client";
import { signIn, signUp } from "@/lib/actions/auth.action";

type AuthFormType = "sign-in" | "sign-up";

const createFormSchema = (type: AuthFormType) => {
  const baseSchema = {
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
  };

  if (type === "sign-up") {
    return z
      .object({
        ...baseSchema,
        name: z
          .string()
          .min(2, "Name must be at least 2 characters")
          .max(50, "Name must be less than 50 characters")
          .regex(
            /^[a-zA-Z\s'-]+$/,
            "Name can only contain letters, spaces, hyphens and apostrophes"
          ),
        confirmPassword: z.string(),
      })
      .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
      });
  }

  return z.object(baseSchema);
};

const AuthForm = ({ type }: { type: AuthFormType }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);

  // Get the redirect URL if it exists
  const redirectUrl = searchParams.get("redirect") || "/dashboard";

  const formSchema = createFormSchema(type);
  type FormSchema = z.infer<ReturnType<typeof createFormSchema>>;

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      ...(type === "sign-up" ? { name: "", confirmPassword: "" } : {}),
    },
  });

  const onSubmit = async (values: FormSchema) => {
    setIsLoading(true);
    try {
      if (type === "sign-up") {
        const { email, password } = values;
        const name = (values as { name: string }).name;

        try {
          const userCredentials = await createUserWithEmailAndPassword(
            auth,
            email,
            password
          );
          const idToken = await userCredentials.user.getIdToken();

          const result = await signUp({
            uid: userCredentials.user.uid,
            email,
            name,
            password,
          });

          if (!result?.success) {
            toast.error(result?.error || "Failed to create account");
            return;
          }

          toast.success(result.message || "Account created successfully!");
          router.push(redirectUrl);
        } catch (error: any) {
          console.error("Signup error:", error);
          if (
            error.code === "auth/email-already-in-use" ||
            (error.customData?.message &&
              error.customData.message.includes("EMAIL_EXISTS"))
          ) {
            toast.error(
              "This email is already registered. Please sign in instead."
            );
          } else if (error.code === "auth/invalid-email") {
            toast.error("Please enter a valid email address.");
          } else if (error.code === "auth/weak-password") {
            toast.error("Password should be at least 8 characters long.");
          } else {
            toast.error(
              error.message || "Failed to create account. Please try again."
            );
          }
        }
      } else {
        try {
          const { email, password } = values;
          const userCredentials = await signInWithEmailAndPassword(
            auth,
            email,
            password
          );
          const idToken = await userCredentials.user.getIdToken();

          const result = await signIn({
            email,
            idToken,
          });

          if (!result?.success) {
            toast.error(result?.error || "Failed to sign in");
            return;
          }

          toast.success(result.message || "Signed in successfully!");
          router.push(redirectUrl);
        } catch (error: any) {
          console.error("Signin error:", error);
          if (error.code === "auth/user-not-found") {
            toast.error(
              "No account found with this email. Please sign up first."
            );
          } else if (error.code === "auth/wrong-password") {
            toast.error("Incorrect password. Please try again.");
          } else if (error.code === "auth/too-many-requests") {
            toast.error("Too many failed attempts. Please try again later.");
          } else if (
            error.code === "auth/email-already-in-use" ||
            (error.customData?.message &&
              error.customData.message.includes("EMAIL_EXISTS"))
          ) {
            toast.error(
              "This email is already registered. Please sign in instead."
            );
          } else {
            toast.error(
              error.message || "Failed to sign in. Please try again."
            );
          }
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      const idToken = await userCredential.user.getIdToken();

      if (!idToken) {
        toast.error("Failed to authenticate with Google");
        return;
      }

      if (type === "sign-up") {
        const result = await signUp({
          uid: userCredential.user.uid,
          email: userCredential.user.email!,
          name: userCredential.user.displayName || "User",
          password: "",
        });

        if (!result?.success) {
          toast.error(result?.error || "Failed to create account");
          return;
        }

        toast.success(result.message || "Account created successfully!");
      } else {
        const result = await signIn({
          email: userCredential.user.email!,
          idToken,
        });

        if (!result?.success) {
          toast.error(result?.error || "Failed to sign in");
          return;
        }

        toast.success(result.message || "Signed in successfully!");
      }

      router.push(redirectUrl);
    } catch (error: any) {
      console.error("Google signin error:", error);
      if (error.code === "auth/popup-closed-by-user") {
        toast.error("Sign in was cancelled");
      } else if (
        error.code === "auth/account-exists-with-different-credential"
      ) {
        toast.error(
          "An account already exists with this email. Please sign in with your original method."
        );
      } else {
        toast.error("Failed to authenticate with Google. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto my-4 md:my-6">
      <div className="bg-card text-card-foreground rounded-xl border shadow-sm p-8 space-y-8 animate-in slide-in-from-bottom-4 duration-1000 fade-in-0">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-bold tracking-tight">
            {type === "sign-in" ? "Welcome back" : "Create an account"}
          </h1>
          <p className="text-muted-foreground text-sm">
            {type === "sign-in"
              ? "Enter your email to sign in to your account"
              : "Enter your information to create your account"}
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {type === "sign-up" && (
              <>
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John Smith" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="name@example.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center justify-between">
                    <FormLabel>Password</FormLabel>
                    {type === "sign-in" && (
                      <Link
                        href="/forgot-password"
                        className="text-sm text-muted-foreground hover:text-primary transition-colors"
                      >
                        Forgot password?
                      </Link>
                    )}
                  </div>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {type === "sign-up" && (
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="••••••••"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <Button
              type="submit"
              className="w-full font-medium"
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <>
                  {type === "sign-in" ? "Sign In" : "Create Account"}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </form>
        </Form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div>

        <Button
          variant="outline"
          type="button"
          disabled={isLoading}
          className="w-full hover:bg-secondary"
          onClick={handleGoogleSignIn}
        >
          <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
            <path
              d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
              fill="currentColor"
            />
          </svg>
          Continue with Google
        </Button>

        <div className="text-center text-sm">
          {type === "sign-in" ? (
            <>
              Don't have an account?{" "}
              <Link
                href="/sign-up"
                className="text-primary hover:underline underline-offset-4 font-medium transition-colors"
              >
                Sign up
              </Link>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <Link
                href="/sign-in"
                className="text-primary hover:underline underline-offset-4 font-medium transition-colors"
              >
                Sign in
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
