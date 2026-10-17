"use client";

import { ReactNode, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { LogOut, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { sidebarLinks } from "@/lib/constants";
import { MobileNav } from "@/components/MobileNav";
import { FeedbackButton } from "@/components/FeedbackButton";
import { auth } from "@/firebase/client";
import { signOut, onAuthStateChanged, User } from "firebase/auth";
import { toast } from "sonner";
import { SubscriptionProvider } from "@/components/providers/SubscriptionProvider";

export default function AppLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isAuthChecking, setIsAuthChecking] = useState(true);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");

    if (savedTheme === "dark") {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log("Auth state changed:", user ? "user exists" : "no user");

      setCurrentUser(user);
      setIsAuthChecking(false);

      if (!user) {
        // Redirect to sign-in if not authenticated
        console.log(`Redirecting to sign-in from AppLayout, path: ${pathname}`);
        router.push(`/sign-in?redirect=${encodeURIComponent(pathname)}`);
      }
    });

    return () => unsubscribe();
  }, [pathname, router]);

  const handleLogout = async () => {
    try {
      await signOut(auth);

      // Clear the session cookie
      await fetch("/api/auth/logout", { method: "POST" });

      toast.success("Signed out successfully");
      router.push("/sign-in");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Failed to sign out");
    }
  };

  // Show loading state while checking authentication
  if (isAuthChecking) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="size-10 animate-spin rounded-full border-2 border-primary/25 border-t-primary" />
      </div>
    );
  }

  // If auth check completed and we have no user, don't render anything
  // as we should be redirecting to sign-in
  if (!currentUser) {
    return null;
  }

  const initials = (currentUser.displayName || currentUser.email || "U")
    .slice(0, 1)
    .toUpperCase();

  return (
    <SubscriptionProvider>
      <div className="flex h-screen bg-background">
        {/* Sidebar */}
        <aside className="hidden w-[264px] shrink-0 flex-col border-r border-sidebar-border bg-sidebar md:flex">
          <div className="flex h-16 items-center px-5">
            <Link href="/" className="group flex items-center gap-2.5">
              <span className="flex size-9 items-center justify-center overflow-hidden rounded-xl ring-1 ring-border">
                <img
                  src="/snaphire.png"
                  alt="SnapHire Logo"
                  className="size-9 object-cover"
                />
              </span>
              <span className="font-display text-lg font-bold tracking-tight">
                SnapHire
              </span>
            </Link>
          </div>

          <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
            <p className="px-3 pb-2 text-[0.7rem] font-semibold uppercase tracking-wider text-muted-foreground/70">
              Workspace
            </p>
            {sidebarLinks.map((link) => {
              const isActive =
                pathname === link.href || pathname.startsWith(`${link.href}/`);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                  }`}
                >
                  {isActive && (
                    <span className="absolute left-0 h-6 w-[3px] rounded-r-full bg-primary" />
                  )}
                  <link.icon
                    className={`size-[18px] shrink-0 ${
                      isActive
                        ? "text-primary"
                        : "text-muted-foreground/80 transition-colors group-hover:text-foreground"
                    }`}
                  />
                  {link.label}
                  <ChevronRight
                    className={`ml-auto size-4 opacity-0 transition-opacity ${
                      isActive ? "" : "group-hover:opacity-40"
                    }`}
                  />
                </Link>
              );
            })}
          </nav>

          <div className="space-y-3 border-t border-sidebar-border p-3">
            <div className="flex items-center gap-3 rounded-xl bg-sidebar-accent/60 px-3 py-2.5">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-sm font-semibold text-primary-foreground">
                {initials}
              </span>
              <div className="min-w-0 leading-tight">
                <p className="truncate text-sm font-medium">
                  {currentUser.displayName || "SnapHire member"}
                </p>
                <p className="truncate text-xs text-muted-foreground">
                  {currentUser.email}
                </p>
              </div>
            </div>

            <Button
              variant="ghost"
              className="w-full justify-start text-muted-foreground hover:text-foreground"
              onClick={handleLogout}
            >
              <LogOut className="mr-3 size-[18px]" />
              Logout
            </Button>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex h-screen flex-1 flex-col overflow-hidden">
          {/* Mobile Header */}
          <header className="flex h-16 items-center justify-between border-b border-border/60 px-4 glass md:hidden">
            <Link href="/" className="flex items-center gap-2.5">
              <img
                src="/snaphire.png"
                alt="SnapHire Logo"
                className="size-8 rounded-lg"
              />
              <span className="font-display text-base font-bold">SnapHire</span>
            </Link>
            <MobileNav />
          </header>

          {/* Page Content */}
          <main className="flex-1 overflow-y-auto">
            <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-10">
              {children}
            </div>
          </main>

          {/* Floating Feedback Button */}
          <FeedbackButton />
        </div>
      </div>
    </SubscriptionProvider>
  );
}
