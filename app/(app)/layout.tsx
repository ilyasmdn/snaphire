"use client";

import { ReactNode, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { sidebarLinks } from "@/lib/constants";
import { MobileNav } from "@/components/MobileNav";

export default function AppLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="hidden md:flex w-64 flex-col border-r bg-card">
        <div className="flex h-14 items-center border-b px-4">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <img src="/snaphire.png" alt="SnapHire Logo" className="h-8 w-8" />
            <span>SnapHire</span>
          </Link>
        </div>

        <nav className="flex-1 space-y-1 px-2 py-4">
          {sidebarLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link key={link.href} href={link.href}>
                <span
                  className={`group flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  <link.icon className="mr-3 h-5 w-5" />
                  {link.label}
                </span>
              </Link>
            );
          })}
        </nav>

        <div className="border-t p-4">
          <Button
            variant="ghost"
            className="w-full justify-start text-muted-foreground hover:text-foreground"
            onClick={() => {
              // Add logout logic here
              window.location.href = "/auth/sign-in";
            }}
          >
            <LogOut className="mr-3 h-5 w-5" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Mobile Header */}
        <header className="h-14 border-b md:hidden flex items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <img src="/snaphire.png" alt="SnapHire Logo" className="h-8 w-8" />
            <span>SnapHire</span>
          </Link>
          <MobileNav />
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-background">{children}</main>
      </div>
    </div>
  );
}
