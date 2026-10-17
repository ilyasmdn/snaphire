"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { confirmPasswordReset, verifyPasswordResetCode } from "firebase/auth";
import { auth } from "@/firebase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2, Eye, EyeOff } from "lucide-react";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const oobCode = searchParams.get("oobCode");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [codeValid, setCodeValid] = useState<boolean | null>(null);

  useEffect(() => {
    if (!oobCode) return;

    verifyPasswordResetCode(auth, oobCode)
      .then(() => setCodeValid(true))
      .catch(() => setCodeValid(false));
  }, [oobCode]);

  const handleReset = async () => {
    if (!oobCode || !newPassword || !confirmPassword) return;

    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      await confirmPasswordReset(auth, oobCode, newPassword);
      toast.success("Password has been reset.");
      router.push("/sign-in");
    } catch (error: any) {
      console.error("Password reset error:", error.code, error.message);
      toast.error("Failed to reset password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (codeValid === false) {
    return (
      <div className="w-full text-center text-sm text-red-500">
        Invalid or expired reset link.
      </div>
    );
  }

  if (codeValid === null) {
    return (
      <div className="w-full text-center text-sm text-muted-foreground">
        <Loader2 className="mr-2 inline-block size-4 animate-spin" />
        Validating link...
      </div>
    );
  }

  return (
    <div className="w-full p-7 bg-card border border-border/70 rounded-2xl shadow-xl shadow-black/[0.04] dark:shadow-black/30">
      <h1 className="font-display text-2xl font-bold mb-4 text-center tracking-tight">
        Reset your password
      </h1>

      {/* New Password */}
      <div className="relative mb-4">
        <label htmlFor="new-password" className="sr-only">
          New Password
        </label>
        <Input
          id="new-password"
          type={showPassword ? "text" : "password"}
          placeholder="Enter new password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <button
          type="button"
          onClick={() => setShowPassword((prev) => !prev)}
          className="absolute right-3 top-3.5 text-muted-foreground"
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>

      {/* Confirm Password */}
      <div className="relative mb-4">
        <label htmlFor="confirm-password" className="sr-only">
          Confirm Password
        </label>
        <Input
          id="confirm-password"
          type={showPassword ? "text" : "password"}
          placeholder="Confirm new password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
      </div>

      <Button
        onClick={handleReset}
        className="w-full"
        disabled={loading || !newPassword || !confirmPassword}
      >
        {loading ? (
          <Loader2 className="animate-spin h-4 w-4 mr-2" />
        ) : (
          "Reset Password"
        )}
      </Button>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="w-full max-w-md mx-auto my-6 text-center">
          <Loader2 className="animate-spin inline-block mr-2" />
          Loading...
        </div>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
}
