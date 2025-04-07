"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "./ui/label";

const formSchema = z.object({
  name: z.string().min(2, "Name too short"),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password too short"),
});

type AuthFormType = "sign-in" | "sign-up";

const AuthForm = ({ type }: { type: AuthFormType }) => {
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    // Here you’d call your backend or auth API
    console.log("User created:", values);
    localStorage.setItem("user", JSON.stringify(values));
    router.push("/plans");
  };

  return (
    <div className="p-8 border shadow-lg rounded-md w-full max-w-sm">
      <Form {...form}>
        <form className={"flex flex-col gap-6"}>
          <div className="flex flex-col items-center gap-2 text-center">
            <h1 className="text-2xl font-bold">{type=="sign-in" ? "Login to your account" : "Create an Account"}</h1>
            <p className="text-balance text-sm text-muted-foreground">
              {type=="sign-in" ? "Enter your email below to login to your account" : "Create an account to start using SnapHire"}
            </p>
          </div>
          <div className="grid gap-6">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
                {type=="sign-in" && 
                <a
                  href="#"
                  className="ml-auto text-sm underline-offset-4 hover:underline"
                >
                  Forgot your password?
                </a>}
              </div>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                required
              />
            </div>
            {type=="sign-up" && 
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Repeat Password</Label>
              </div>
              <Input
                id="re-password"
                type="password"
                placeholder="••••••••"
                required
              />
            </div>}
            <Button type="submit" className="w-full cursor-pointer">
              {type=="sign-in" ? "Login" : "Create Account"}
            </Button>
            <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
              <span className="relative z-10 bg-background px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
            <Button variant="outline" className="w-full hover:bg-text/20! cursor-pointer">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path
                  d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                  fill="currentColor"
                />
              </svg>
              Continue with Google
            </Button>
          </div>
          <div className="text-center text-sm">
          {type=="sign-in" ? "Don't have an account? " : "Already have an account? "}
            <a href="#" className="underline underline-offset-4">
              {type=="sign-in" ? "Sign up" : "Login"}
            </a>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default AuthForm;
